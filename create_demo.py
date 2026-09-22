"""Original CM melody sketch: synthesized instruments, with spoken end tag.

Run with Python + numpy + ffmpeg. No sampled songs or external music assets.
"""
from pathlib import Path
import subprocess
import wave
import numpy as np

ROOT = Path(__file__).resolve().parent
SR = 44100
BPM = 112
BEAT = 60 / BPM
LENGTH = 24 * 4 * BEAT + 2
rng = np.random.default_rng(72)
mix = np.zeros((int(LENGTH * SR), 2), dtype=np.float64)


def add(signal, seconds, gain=1.0, pan=0.0):
    start = int(seconds * SR)
    end = min(len(mix), start + len(signal))
    if end <= start:
        return
    p = (pan + 1) * np.pi / 4
    mix[start:end, 0] += signal[:end-start] * gain * np.cos(p)
    mix[start:end, 1] += signal[:end-start] * gain * np.sin(p)


def tone(midi, beats, kind):
    duration = beats * BEAT
    t = np.arange(int((duration + .14) * SR)) / SR
    f = 440 * 2 ** ((midi - 69) / 12)
    env = np.minimum(t / .012, 1) * np.clip((duration + .14 - t) / .17, 0, 1)
    if kind == 'lead':
        phase = 2 * np.pi * f * t + .014 * np.sin(2 * np.pi * 5 * t)
        s = np.sin(phase) + .24 * np.sin(2*phase) + .07 * np.sin(3*phase)
        env *= .7 + .3 * np.exp(-t*9)
    elif kind == 'keys':
        s = np.sin(2*np.pi*f*t + 1.3*np.sin(2*np.pi*f*t)*np.exp(-t*5))
        s += .17 * np.sin(2*np.pi*f*2*t)
        env *= np.exp(-t*3)
    elif kind == 'bass':
        s = np.sin(2*np.pi*f*t) + .24*np.sin(2*np.pi*f*2*t)
        env *= np.exp(-t*2)
    else:
        s = np.sin(2*np.pi*f*t) + .2*np.sin(2*np.pi*f*2*t)
        env *= np.minimum(t/.13, 1) * .6
    return s * env


def note(midi, pos, length, kind='lead', gain=.18, pan=0):
    s = tone(midi, length, kind)
    add(s, pos*BEAT, gain, pan)
    if kind in ('lead', 'keys'):
        add(s, pos*BEAT+.13, gain*.12, -.45)
        add(s, pos*BEAT+.23, gain*.08, .5)


def drum(kind, pos, gain=1):
    duration = {'kick': .3, 'clap': .17, 'hat': .065, 'open': .2}[kind]
    t = np.arange(int(duration*SR))/SR
    noise = rng.normal(0, 1, len(t))
    if kind == 'kick':
        phase = 2*np.pi*(49*t + 85*.023*(1-np.exp(-t/.023)))
        s = np.sin(phase)*np.exp(-t*17) + noise*.035*np.exp(-t*160)
        level, pan = .43, 0
    elif kind == 'clap':
        high = noise - np.roll(noise, 1)
        s = high * (np.exp(-t*38) + .5*np.exp(-((t-.014)/.005)**2))
        s += .18*np.sin(2*np.pi*185*t)*np.exp(-t*30)
        level, pan = .075, -.12
    else:
        s = (noise-np.roll(noise, 1))*np.exp(-t*(70 if kind=='hat' else 22))
        level, pan = .033, .32
    add(s, pos*BEAT, level*gain, pan)


# C major, warm major seventh / minor seventh voicings.
C = (48, [60, 64, 67, 71])
G = (43, [59, 62, 67, 69])
A = (45, [60, 64, 67, 69])
F = (41, [57, 60, 64, 67])
D = (38, [57, 60, 62, 65])
progression = [C,G,F,G, A,F,C,G,A,F,D,G, C,G,A,F,C,G,F,G, F,G,C,C]
for bar, (root, chord) in enumerate(progression):
    base = bar*4
    verse = 4 <= bar < 12
    ending = bar >= 22
    for m in chord:
        note(m, base, 3.8, 'pad', .028 if verse else .038, -.3)
    for off, vel in [(0,1), (1.5,.8), (2.5,.75), (3.5,.7)]:
        if ending and off:
            continue
        for j,m in enumerate(chord):
            note(m, base+off+j*.015, .65, 'keys', .072*vel, .2)
    for off, m, length in [(0,root,.8),(1.5,root,.35),(2,root+12,.7),(3,root+7,.6)]:
        if ending and off:
            continue
        note(m, base+off, length, 'bass', .22)
    if not ending:
        for off in [0, 2, 2.75]:
            drum('kick',base+off,.83 if verse else 1)
        for off in [1,3]:
            drum('clap',base+off,.7 if verse else 1)
        for k in range(8):
            drum('hat',base+k*.5, .55 if k%2==0 else .9)
        if bar%4==3:
            drum('open',base+3.5,.7)


# Every note corresponds to a Korean syllable, with an intentional pause
# before the city's two-syllable response.
hook1 = [(67,.5),(69,.5),(72,1),(71,.5),(69,.5),(67,1),
         (None,.5),(72,1),(76,1.5),(None,1)]
hook2 = [(67,.5),(69,.5),(72,1),(74,.5),(72,.5),(69,1),
         (None,.5),(67,1),(72,1.5),(None,1)]
verse1 = [(64,.5),(64,.5),(67,.5),(69,.5),(67,.5),(64,.5),(62,1),
          (64,.5),(67,.5),(69,1),(67,1),(None,1)]
verse2 = [(65,.5),(65,.5),(69,.5),(72,.5),(69,.5),(67,.5),(65,1),
          (64,.5),(62,.5),(64,1),(67,1),(None,1)]
verse3 = [(64,.5),(67,.5),(69,1),(72,.5),(69,.5),(67,1),
          (65,.5),(64,.5),(62,1),(64,1),(None,1)]
verse4 = [(65,.5),(67,.5),(69,.5),(67,.5),(65,.5),(64,.5),(62,1),
          (62,.5),(64,.5),(67,1),(71,1),(None,1)]
line3 = [(72,.5),(72,.5),(74,.5),(76,.5),(74,1),(72,1),
         (69,.5),(67,.5),(69,1),(72,1),(None,1)]
line4 = [(71,.5),(69,.5),(67,1),(69,.5),(71,.5),(74,1),
         (72,2),(None,2)]


def phrase(events, bar, gain=.2):
    beat=bar*4
    assert abs(sum(d for _,d in events)-8)<.001
    for m,d in events:
        if m is not None:
            note(m,beat,max(.1,d-.09),'lead',gain)
        beat+=d


for bar, events in [(0,hook1),(2,hook2),(4,verse1),(6,verse2),
                    (8,verse3),(10,verse4),(12,hook1),(14,hook2),
                    (16,line3),(18,line4),(20,hook1)]:
    phrase(events,bar,.16 if 4<=bar<12 else .22)

# Three-note sonic signature resolving to the tonic.
for offset,m in [(0,67),(.5,72),(1,76),(2,72)]:
    note(m,92+offset,.8 if offset<2 else 2,'keys',.13,-.15)

tag = Path('/private/tmp/hwaseong-demo-tag.aiff')
if tag.exists():
    result = subprocess.run(['ffmpeg','-v','error','-i',str(tag),'-f','f32le',
                             '-ac','1','-ar',str(SR),'-'],capture_output=True,check=True)
    speech = np.frombuffer(result.stdout,dtype='<f4').astype(float)
    if speech.size and np.max(np.abs(speech))>0:
        speech *= .5/np.max(np.abs(speech))
        start = 88*BEAT
        lo,hi=int(start*SR),min(len(mix),int(start*SR)+len(speech))
        mix[lo:hi] *= .48
        add(speech,start,1)

mix *= np.minimum(np.arange(len(mix))/ (SR*.008),1)[:,None]
mix *= np.minimum((len(mix)-np.arange(len(mix)))/(SR*.7),1)[:,None]
mix = np.tanh(mix*1.25)
mix *= .94/max(np.max(np.abs(mix)),.001)
out=ROOT/'here_happy_hwaseong_demo.wav'
with wave.open(str(out),'wb') as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes((mix*32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',str(out),'-codec:a','libmp3lame',
                '-b:a','192k',str(ROOT/'here_happy_hwaseong_demo.mp3')],check=True)
print(f'Created {LENGTH:.2f}s original instrumental melody demo with spoken end tag.')
