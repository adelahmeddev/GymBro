import imageio.v3 as imageio
import subprocess, tempfile, os, sys

url = "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-bench-press.mp4"
with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as f:
    path = f.name

subprocess.run(["curl.exe", "-s", "-o", path, url], check=True)

reader = imageio.imiter(path, plugin="FFMPEG")
frame_count = 0
for i, frame in enumerate(reader):
    if i >= 150:
        break
    frame_count += 1
    if i == 0:
        h, w = frame.shape[:2]
        print(f"Video dimensions: {w}x{h}")

os.unlink(path)
print(f"Frames in first ~5s: {frame_count}")
