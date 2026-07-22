"""Generate focused exercise GIFs from 1080p MP4 videos using the Slack GIF Creator skill."""
import sys
sys.path.insert(0, r"C:\Users\Adel Ahmed\AppData\Local\Temp\skills-use-3MAQuV\slack-gif-creator")

from core.gif_builder import GIFBuilder
import imageio.v3 as imageio
from PIL import Image
import numpy as np
import subprocess
import tempfile
import os
from pathlib import Path

OUTPUT_DIR = Path(r"D:\GymBro\public\exercises")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUT_W, OUT_H = 480, 360

EXERCISES = [
    {"id": "barbell-bench-press", "focus": (0.5, 0.35), "url": "barbell-bench-press.mp4"},
    {"id": "overhead-press", "focus": (0.5, 0.25), "url": "military-press.mp4"},
    {"id": "incline-dumbbell-press", "focus": (0.5, 0.30), "url": "dumbbell-incline-bench-press.mp4"},
    {"id": "dumbbell-lateral-raise", "focus": (0.45, 0.30), "url": "dumbbell-lateral-raise.mp4"},
    {"id": "triceps-pushdown", "focus": (0.5, 0.45), "url": "cable-triceps-pushdown.mp4"},
    {"id": "deadlift", "focus": (0.5, 0.50), "url": "dumbbell-deadlift.mp4"},
    {"id": "barbell-row", "focus": (0.5, 0.40), "url": "barbell-underhand-bent-over-row.mp4"},
    {"id": "pull-up", "focus": (0.5, 0.25), "url": "pull-up-wide-front-grip.mp4"},
    {"id": "dumbbell-curl", "focus": (0.5, 0.50), "url": "dumbbell-biceps-curl.mp4"},
    {"id": "barbell-squat", "focus": (0.5, 0.50), "url": "classic-barbell-squat.mp4"},
    {"id": "romanian-deadlift", "focus": (0.5, 0.60), "url": "barbell-straight-leg-deadlift.mp4"},
    {"id": "leg-press", "focus": (0.5, 0.50), "url": "close-feet-leg-press.mp4"},
    {"id": "dumbbell-lunges", "focus": (0.5, 0.55), "url": "dumbbell-lunge.mp4"},
    {"id": "calf-raises", "focus": (0.5, 0.75), "url": "dumbbell-standing-calf-raise.mp4"},
]

BASE_URL = "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/"

def crop_frame(frame, focus):
    h, w = frame.shape[:2]
    target_ar = OUT_W / OUT_H
    if w / h > target_ar:
        crop_w = int(h * target_ar)
        crop_h = h
    else:
        crop_w = w
        crop_h = int(w / target_ar)
    cx, cy = int(w * focus[0]), int(h * focus[1])
    x1 = max(0, min(cx - crop_w // 2, w - crop_w))
    y1 = max(0, min(cy - crop_h // 2, h - crop_h))
    return frame[y1:y1+crop_h, x1:x1+crop_w]

def generate_gif(ex):
    print(f"\n=== {ex['id']} ===")
    url = BASE_URL + ex["url"]
    gif_path = OUTPUT_DIR / f"{ex['id']}.gif"

    with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as f:
        tmp_path = f.name

    try:
        subprocess.run(["curl.exe", "-s", "-o", tmp_path, url], check=True, capture_output=True, timeout=30)
        reader = imageio.imiter(tmp_path, plugin="FFMPEG")
        frames = []

        for i, frame in enumerate(reader):
            if i % 2 != 0:
                continue
            cropped = crop_frame(frame, ex["focus"])
            pil = Image.fromarray(cropped).resize((OUT_W, OUT_H), Image.LANCZOS)
            frames.append(pil)
            if len(frames) >= 90:
                break

        if not frames:
            print(f"  No frames read!")
            return

        builder = GIFBuilder(width=OUT_W, height=OUT_H, fps=15)
        builder.add_frames(frames)
        info = builder.save(str(gif_path), num_colors=64, remove_duplicates=True)

    finally:
        try:
            os.unlink(tmp_path)
        except PermissionError:
            pass

if __name__ == "__main__":
    for ex in EXERCISES:
        generate_gif(ex)
    print("\nAll GIFs generated!")
