# AI Model — Ramp Detection (Role 5)

## Objective
Detect wheelchair ramps in images to support SugamPath's accessibility mapping feature.
Per project scope, this is the primary AI feature being fully implemented (of the 3 proposed
in the PRD) to keep the demo reliable.

## Dataset
- Source: Roboflow Universe — "ramp" dataset
- Link: https://universe.roboflow.com/prakash-roy-nj20b/ramp-ync8p-utdbe/dataset/1
- License: CC BY 4.0
- Size: 2,823 training images, 806 validation images
- Classes: 1 (ramp presence/absence detection — not yet split into sub-conditions
  like "broken" or "blocked"; noted as a future improvement)
- Format: YOLOv8 (images + bounding box labels)

## Pipeline Status (Week 1–4)
- [x] AI scope defined: ramp detection via YOLOv8-nano
- [x] Dataset sourced, labeled, and downloaded (Roboflow)
- [x] Raw-data → training-dataset pipeline built and verified (`data.yaml`)
- [x] End-to-end smoke test: 1-epoch training run completed successfully
      (806 val images, model weights generated)

## Files
- `data.yaml` — dataset config (train/val/test paths, class list)
- `train.py` — training script (YOLOv8-nano)

## Setup
```bash
pip install ultralytics
python train.py
```

Note: `data.yaml` currently uses absolute paths to a local dataset folder
(not included in this repo due to size). To reproduce, download the dataset
from the Roboflow link above and update the paths in `data.yaml` to match
your local folder structure.

## Next Steps (Week 5–6)
- Full training run (50+ epochs) instead of 1-epoch smoke test
- Evaluate model accuracy (precision/recall/mAP) on real numbers
- Consider expanding to multi-class (ramp present / broken / missing)