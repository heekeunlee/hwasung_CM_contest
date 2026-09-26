from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080
bg = Image.open('public/hwaseong-cm-cover.png').convert('RGB').resize((W, H), Image.Resampling.LANCZOS)
layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
draw = ImageDraw.Draw(layer)

font_path = '/System/Library/Fonts/AppleSDGothicNeo.ttc'
title = ImageFont.truetype(font_path, 58)
subtitle = ImageFont.truetype(font_path, 27)
slogan = ImageFont.truetype(font_path, 31)
credit = ImageFont.truetype(font_path, 18)

draw.rounded_rectangle((50, 55, 858, 253), radius=8, fill=(11, 28, 45, 220))
draw.text((95, 82), '바다에서 내일까지', font=title, fill=(255, 255, 255, 255))
draw.text((95, 177), '화성특례시 AI CM SONG', font=subtitle, fill=(255, 210, 122, 255))
draw.rectangle((0, 1018, W, H), fill=(7, 21, 34, 200))
draw.text((50, 1033), '모두의 행복, 더 큰 화성', font=slogan, fill=(255, 255, 255, 255))
draw.text((1455, 1042), 'BI: 화성특례시 공식 BI', font=credit, fill=(255, 255, 255, 220))

card = Image.alpha_composite(bg.convert('RGBA'), layer)
bi = Image.open('public/hwaseong-city-bi.png').convert('RGBA')
bi.thumbnail((404, 100), Image.Resampling.LANCZOS)
card.alpha_composite(bi, (1468, 45))
card.convert('RGB').save('public/hwaseong-cm-album-card-realistic.png', quality=96)
