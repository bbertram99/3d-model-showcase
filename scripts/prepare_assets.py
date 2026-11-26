"""Prepare optimized WebP media and raw GLB meshes from source 3D models and Art folders."""

from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Any

import numpy as np
import trimesh
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_MEDIA = ROOT / "public" / "media"
TMP_GLB = ROOT / ".tmp-glb"
STATS_OUT = ROOT / "src" / "data" / "generatedModelStats.json"

IMAGE_JOBS: dict[str, list[tuple[str, str, int]]] = {
    "king-graham": [
        ("3D models/King's Quest/King Graham.jpg", "concept.webp", 1600),
        ("3D models/King's Quest/King Graham_painted.jpg", "painted.webp", 1600),
        ("3D models/King's Quest/King Graham virtual 3d model.jpg", "virtual.webp", 1600),
        ("3D models/King's Quest/all three.PNG", "triptych.webp", 2000),
        ("3D models/King's Quest/printed/IMG_2802.JPG", "printed-1.webp", 1600),
        ("3D models/King's Quest/printed/IMG_2803.JPG", "printed-2.webp", 1600),
        ("3D models/King's Quest/printed/IMG_2804.JPG", "printed-3.webp", 1600),
        ("3D models/King's Quest/printed/IMG_2805.JPG", "printed-4.webp", 1600),
        ("3D models/King's Quest/printed/IMG_2808.JPG", "printed-5.webp", 1600),
        ("3D models/King's Quest/printed/IMG_2809.JPG", "printed-6.webp", 1600),
    ],
    "gorath": [
        ("3D models/Krondor/Gorath.jpg", "concept.webp", 1600),
        ("3D models/Krondor/Gorath_painted.jpg", "painted.webp", 1600),
        ("3D models/Krondor/Gorath virtual 3d model.jpg", "virtual.webp", 1600),
        ("3D models/Krondor/all three.PNG", "triptych.webp", 2000),
        ("3D models/Krondor/printed/IMG_2798.JPG", "printed-1.webp", 1600),
        ("3D models/Krondor/printed/IMG_2799.JPG", "printed-2.webp", 1600),
        ("3D models/Krondor/printed/IMG_2800.JPG", "printed-3.webp", 1600),
        ("3D models/Krondor/printed/IMG_2801.JPG", "printed-4.webp", 1600),
        ("3D models/Krondor/printed/IMG_2808.JPG", "printed-5.webp", 1600),
        ("3D models/Krondor/printed/IMG_2809.JPG", "printed-6.webp", 1600),
    ],
    "roger-wilco": [
        ("3D models/Space Quest/Roger_Wilco.jpg", "concept.webp", 1600),
        ("3D models/Space Quest/Roger_Wilco_painted.jpg", "painted.webp", 1600),
        ("3D models/Space Quest/Roger_Wilco_virtual_model.jpg", "virtual.webp", 1600),
        ("3D models/Space Quest/Screenshot 2026-11-18 191304.png", "triptych.webp", 2000),
        ("3D models/Space Quest/Printed/roger_printed.jpeg", "printed-1.webp", 1600),
        ("3D models/Space Quest/Printed/IMG_2861.JPG", "printed-2.webp", 1600),
        ("3D models/Space Quest/Printed/IMG_2862.JPG", "printed-3.webp", 1600),
        ("3D models/Space Quest/Printed/IMG_2863.JPG", "printed-4.webp", 1600),
    ],
    "sonny-bonds": [
        ("3D models/Police Quest/Sonny Bonds painted.jpg", "painted.webp", 1600),
        ("3D models/Police Quest/Sonny Bonds_virtual_model.jpg", "virtual.webp", 1600),
        ("3D models/Police Quest/Screenshot 2026-11-19 183639.png", "triptych.webp", 2000),
        ("3D models/Police Quest/Printed/IMG_2821.JPG", "printed-1.webp", 1600),
        ("3D models/Police Quest/Printed/IMG_2822.JPG", "printed-2.webp", 1600),
        ("3D models/Police Quest/Printed/IMG_2857.JPG", "printed-3.webp", 1600),
        ("3D models/Police Quest/Printed/IMG_2858.JPG", "printed-4.webp", 1600),
        ("3D models/Police Quest/Printed/IMG_2859.JPG", "printed-5.webp", 1600),
        ("3D models/Police Quest/Printed/IMG_2860.JPG", "printed-6.webp", 1600),
    ],
    "larry-laffer": [
        ("3D models/Leisure Suit Lary/Larry colored.jpg", "painted.webp", 1600),
        ("3D models/Leisure Suit Lary/Larry_Virtual_model.jpg", "virtual.webp", 1600),
        ("3D models/Leisure Suit Lary/Printed/IMG_2854.JPG", "printed-1.webp", 1600),
        ("3D models/Leisure Suit Lary/Printed/IMG_2855.JPG", "printed-2.webp", 1600),
        ("3D models/Leisure Suit Lary/Printed/IMG_2856.JPG", "printed-3.webp", 1600),
    ],
    "qfg-paladin": [
        ("3D models/Quest for Glory/Paladin.jpg", "concept.webp", 1600),
        ("3D models/Quest for Glory/Paladin_painted.jpg", "painted.webp", 1600),
        ("3D models/Quest for Glory/Paladin_virtual_mmodel.jpg", "virtual.webp", 1600),
        ("3D models/Quest for Glory/Screenshot 2026-11-18 191119.png", "triptych.webp", 2000),
        ("3D models/Quest for Glory/Printed/paladin_printed.jpeg", "printed-1.webp", 1600),
        ("3D models/Quest for Glory/Printed/IMG_2864.JPG", "printed-2.webp", 1600),
        ("3D models/Quest for Glory/Printed/IMG_2865.JPG", "printed-3.webp", 1600),
        ("3D models/Quest for Glory/Printed/IMG_2866.JPG", "printed-4.webp", 1600),
    ],
    "iceman": [
        ("3D models/Code-Name - Iceman/Generated Image November 25, 2026 - 7_17PM.jpg", "concept.webp", 1600),
        ("3D models/Code-Name - Iceman/Generated Image November 25, 2026 - 8_56PM.jpg", "painted.webp", 1600),
        ("3D models/Code-Name - Iceman/Generated Image November 25, 2026 - 7_23PM (Large).jpg", "virtual.webp", 1600),
    ],
    "qfg-diorama": [
        ("3D models/Quest for Glory/Gemini_Generated_Image_3kxh513kxh513kxh.jpg", "concept.webp", 1800),
        ("3D models/Quest for Glory/Gemini_Generated_Image_b9xmo8b9xmo8b9xm.jpg", "painted.webp", 1800),
        ("3D models/Quest for Glory/Gemini_Generated_Image_xw1f1axw1f1axw1f.jpg", "virtual.webp", 1800),
        ("3D models/Quest for Glory/Gemini_Generated_Image_ykhvnwykhvnwykhv.jpg", "lineup-painted.webp", 1800),
        ("3D models/Quest for Glory/Gemini_Generated_Image_wzo470wzo470wzo4.jpg", "lineup-virtual.webp", 1800),
    ],
    "qfg-fighter": [
        ("3D models/Quest for Glory/Gemini_Generated_Image_vfxhdpvfxhdpvfxh.jpg", "painted.webp", 1600),
        ("3D models/Quest for Glory/Gemini_Generated_Image_gq01gzgq01gzgq01.jpg", "virtual.webp", 1600),
    ],
    "qfg-magic-user": [
        ("3D models/Quest for Glory/Gemini_Generated_Image_ra6euira6euira6e.jpg", "painted.webp", 1600),
        ("3D models/Quest for Glory/Gemini_Generated_Image_62hgwb62hgwb62hg.jpg", "virtual.webp", 1600),
    ],
    "qfg-thief": [
        ("3D models/Quest for Glory/Gemini_Generated_Image_rv5r6urv5r6urv5r.jpg", "painted.webp", 1600),
        ("3D models/Quest for Glory/Gemini_Generated_Image_v17lmbv17lmbv17l.jpg", "virtual.webp", 1600),
    ],
    "art-kq5": [
        ("Art/KQ5_Art_V2/artwork/KQ5_Art_V2_03_step1_input.png", "input.webp", 1800),
        ("Art/KQ5_Art_V2/inspection/05_blender_studio_render.png", "render.webp", 1800),
        ("Art/KQ5_Art_V2/inspection/04_3d_assembled_and_exploded.png", "exploded.webp", 2000),
        ("Art/KQ5_Art_V2/inspection/03_multi_plate_slicer_layout.png", "plates.webp", 2000),
        ("Art/KQ5_Art_V2/inspection/01_segmentation_and_topology.png", "topology.webp", 2000),
        ("Art/KQ5_Art_V2/inspection/06_depth_relief_map.png", "relief.webp", 1600),
        ("Art/KQ5_Art_V2/printed/printed_art.jpg", "printed-1.webp", 1800),
    ],
    "art-roll-initiative": [
        ("Art/Roll_For_Initiative/artwork/Roll_For_Initiative_03_step1_input.png", "input.webp", 1800),
        ("Art/Roll_For_Initiative/inspection/05_blender_studio_render.png", "render.webp", 1800),
        ("Art/Roll_For_Initiative/inspection/04_3d_assembled_and_exploded.png", "exploded.webp", 2000),
        ("Art/Roll_For_Initiative/inspection/03_multi_plate_slicer_layout.png", "plates.webp", 2000),
        ("Art/Roll_For_Initiative/inspection/01_segmentation_and_topology.png", "topology.webp", 2000),
        ("Art/Roll_For_Initiative/inspection/06_depth_relief_map.png", "relief.webp", 1600),
        ("Art/Roll_For_Initiative/inspection/07_virtual_construction_layout.png", "construction.webp", 2000),
    ],
    "art-grade-4": [
        ("Art/Grade_4/artwork/Grade_4_03_step1_input.png", "input.webp", 1800),
        ("Art/Grade_4/inspection/05_blender_studio_render.png", "render.webp", 1800),
        ("Art/Grade_4/inspection/04_3d_assembled_and_exploded.png", "exploded.webp", 2000),
        ("Art/Grade_4/inspection/03_multi_plate_slicer_layout.png", "plates.webp", 2000),
        ("Art/Grade_4/inspection/01_segmentation_and_topology.png", "topology.webp", 2000),
        ("Art/Grade_4/inspection/06_depth_relief_map.png", "relief.webp", 1600),
    ],
}

CARD_SOURCES: dict[str, str] = {
    "king-graham": "painted.webp",
    "gorath": "painted.webp",
    "roger-wilco": "painted.webp",
    "sonny-bonds": "painted.webp",
    "larry-laffer": "painted.webp",
    "qfg-paladin": "painted.webp",
    "iceman": "painted.webp",
    "qfg-diorama": "painted.webp",
    "qfg-fighter": "painted.webp",
    "qfg-magic-user": "painted.webp",
    "qfg-thief": "painted.webp",
    "art-kq5": "render.webp",
    "art-roll-initiative": "render.webp",
    "art-grade-4": "render.webp",
}

MODEL_JOBS: dict[str, str] = {
    "king-graham": "3D models/King's Quest/King Graham.3mf",
    "gorath": "3D models/Krondor/Gorath.3mf",
    "roger-wilco": "3D models/Space Quest/Roger_Wilco_3D.3mf",
    "sonny-bonds": "3D models/Police Quest/Sonny Bonds.3mf",
    "larry-laffer": "3D models/Leisure Suit Lary/Larry.3mf",
    "qfg-paladin": "3D models/Quest for Glory/Paladin.3mf",
    "iceman": "3D models/Code-Name - Iceman/Iceman.3mf",
    "qfg-fighter": "3D models/Quest for Glory/fighter.3mf",
    "qfg-magic-user": "3D models/Quest for Glory/Magic User.3mf",
    "qfg-thief": "3D models/Quest for Glory/Thief.3mf",
}


def resize_and_save_webp(src: Path, dst: Path, max_side: int) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as raw:
        im = ImageOps.exif_transpose(raw)
        if im.mode in ("RGBA", "LA", "P"):
            bg = Image.new("RGB", im.size, (11, 14, 19))
            rgba = im.convert("RGBA")
            bg.paste(rgba, mask=rgba.split()[-1])
            im = bg
        else:
            im = im.convert("RGB")
        w, h = im.size
        scale = min(1.0, max_side / max(w, h))
        if scale < 1.0:
            im = im.resize((int(round(w * scale)), int(round(h * scale))), Image.Resampling.LANCZOS)
        im.save(dst, "WEBP", quality=86, method=4)


def process_images() -> None:
    print("=== Processing WebP images ===")
    for slug, jobs in IMAGE_JOBS.items():
        slug_dir = PUBLIC_MEDIA / slug
        for rel_src, out_name, max_side in jobs:
            src_path = ROOT / rel_src
            if not src_path.exists():
                raise FileNotFoundError(f"Missing image source: {src_path}")
            dst_path = slug_dir / out_name
            resize_and_save_webp(src_path, dst_path, max_side)
        card_src = slug_dir / CARD_SOURCES[slug]
        resize_and_save_webp(card_src, slug_dir / "card.webp", 680)
        print(f"  [img] {slug}: {len(jobs)} images + card.webp")


def process_models() -> dict[str, Any]:
    print("=== Exporting 3MF meshes to raw GLB ===")
    TMP_GLB.mkdir(parents=True, exist_ok=True)
    stats: dict[str, Any] = {}
    rot_x = trimesh.transformations.rotation_matrix(-math.pi / 2.0, [1.0, 0.0, 0.0])

    for slug, rel_src in MODEL_JOBS.items():
        src_path = ROOT / rel_src
        if not src_path.exists():
            raise FileNotFoundError(f"Missing 3MF model: {src_path}")

        loaded = trimesh.load(src_path, force="mesh")
        if isinstance(loaded, trimesh.Scene):
            mesh = trimesh.util.concatenate(list(loaded.geometry.values()))
        else:
            mesh = loaded

        orig_tris = int(len(mesh.faces))
        orig_verts = int(len(mesh.vertices))
        ext_mm = [round(float(v), 1) for v in mesh.extents]

        # Convert Z-up (3MF) -> Y-up (glTF), center X/Z, ground base at Y=0, scale height to 2.0
        mesh.apply_transform(rot_x)
        bounds = mesh.bounds
        center_x = (bounds[0][0] + bounds[1][0]) * 0.5
        center_z = (bounds[0][2] + bounds[1][2]) * 0.5
        min_y = bounds[0][1]
        height = max(float(bounds[1][1] - bounds[0][1]), 1e-5)
        scale = 2.0 / height

        mesh.vertices -= np.array([center_x, min_y, center_z], dtype=np.float64)
        mesh.vertices *= scale
        mesh.visual = trimesh.visual.ColorVisuals(mesh=mesh)

        out_glb = TMP_GLB / f"{slug}.raw.glb"
        mesh.export(out_glb, file_type="glb")
        stats[slug] = {
            "sourceFile": src_path.name,
            "originalTriangles": orig_tris,
            "originalVertices": orig_verts,
            "dimensionsMm": ext_mm,
        }
        mb = out_glb.stat().st_size / (1024 * 1024)
        print(f"  [3mf] {slug}: {orig_tris:,} tris | {ext_mm} mm -> {mb:.1f} MB raw GLB")

    STATS_OUT.parent.mkdir(parents=True, exist_ok=True)
    STATS_OUT.write_text(json.dumps(stats, indent=2) + "\n", encoding="utf-8")
    return stats


if __name__ == "__main__":
    process_images()
    process_models()
    print("Done preparing images and raw GLB files.")
