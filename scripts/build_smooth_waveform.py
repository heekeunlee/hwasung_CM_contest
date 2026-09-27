from pathlib import Path
import subprocess
import numpy as np
from PIL import Image, ImageDraw

audio = Path('/private/tmp/hwaseong_waveform.f32')
subprocess.run([
    'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
    '-i', '바다에서 내일까지 화성 (1).mp3',
    '-ac', '1', '-ar', '8000', '-f', 'f32le', str(audio)
], check=True)

samples = np.fromfile(audio, dtype=np.float32)
columns, height, scale = 1500, 120, 3
edges = np.linspace(0, len(samples), columns + 1, dtype=np.int64)
rms = np.array([
    np.sqrt(np.mean(samples[edges[i]:edges[i + 1]] ** 2))
    for i in range(columns)
])

# Smooth the macro-dynamics so the line reads like a polished broadcast waveform.
kernel = np.ones(25, dtype=np.float64) / 25
rms = np.convolve(rms, kernel, mode='same')
rms = np.clip((rms - np.percentile(rms, 8)) / (np.percentile(rms, 99) - np.percentile(rms, 8) + 1e-8), 0, 1)
rms = 0.12 + rms * 0.78

x = np.arange(columns, dtype=np.float64)
phase = 2 * np.pi * (0.012 * x + 0.0000045 * x * x)
y = height / 2 - np.sin(phase) * rms * (height * 0.43)

img = Image.new('RGBA', (columns * scale, height * scale), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)
points = [(int(px * scale), int(py * scale)) for px, py in zip(x, y)]
draw.line(points, fill=(255, 255, 255, 255), width=3 * scale, joint='curve')
img.resize((columns, height), Image.Resampling.LANCZOS).save('/private/tmp/hwaseong-smooth-waveform.png')
