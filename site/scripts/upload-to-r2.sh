#!/usr/bin/env bash
#
# Upload artwork images from public/artworks/ to Cloudflare R2 bucket.
#
# Prerequisites:
#   - wrangler CLI installed and authenticated (npx wrangler login)
#   - R2 bucket created in Cloudflare dashboard
#
# Usage:
#   ./scripts/upload-to-r2.sh                    # dry-run (default)
#   ./scripts/upload-to-r2.sh --execute          # actually upload
#   ./scripts/upload-to-r2.sh --bucket my-bucket # custom bucket name
#
# Environment variables:
#   R2_BUCKET_NAME  - R2 bucket name (default: korobkovart-images)
#   R2_ACCOUNT_ID   - Cloudflare account ID (optional, uses wrangler default)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PUBLIC_DIR="$SITE_DIR/public"

# Defaults
DRY_RUN=true
BUCKET_NAME="${R2_BUCKET_NAME:-korobkovart-images}"
ACCOUNT_FLAG=""

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --execute)
      DRY_RUN=false
      shift
      ;;
    --bucket)
      BUCKET_NAME="$2"
      shift 2
      ;;
    --account-id)
      ACCOUNT_FLAG="--account-id $2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [--execute] [--bucket NAME] [--account-id ID]"
      echo ""
      echo "Options:"
      echo "  --execute      Actually upload files (default: dry-run)"
      echo "  --bucket NAME  R2 bucket name (default: korobkovart-images)"
      echo "  --account-id   Cloudflare account ID"
      echo ""
      echo "Uploads all files from public/artworks/ and public/videos/ to R2."
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

# Directories to upload (relative to public/)
UPLOAD_DIRS=("artworks" "videos")

# Count files
total_files=0
total_size=0

echo "============================================"
echo "  Cloudflare R2 Upload Script"
echo "============================================"
echo ""
echo "Bucket:    $BUCKET_NAME"
echo "Source:    $PUBLIC_DIR"
echo "Mode:     $(if $DRY_RUN; then echo 'DRY-RUN (no files will be uploaded)'; else echo 'EXECUTE'; fi)"
echo ""

for dir in "${UPLOAD_DIRS[@]}"; do
  dir_path="$PUBLIC_DIR/$dir"
  if [[ ! -d "$dir_path" ]]; then
    echo "  [SKIP] $dir/ - directory not found"
    continue
  fi

  file_count=$(find "$dir_path" -type f | wc -l)
  dir_size=$(du -sh "$dir_path" 2>/dev/null | cut -f1)
  total_files=$((total_files + file_count))

  echo "  $dir/ - $file_count files ($dir_size)"
done

echo ""
echo "Total files to upload: $total_files"
echo ""

if $DRY_RUN; then
  echo "--- DRY RUN: listing files that would be uploaded ---"
  echo ""
  for dir in "${UPLOAD_DIRS[@]}"; do
    dir_path="$PUBLIC_DIR/$dir"
    [[ ! -d "$dir_path" ]] && continue

    find "$dir_path" -type f | sort | while read -r file; do
      rel_path="${file#$PUBLIC_DIR/}"
      file_size=$(du -h "$file" | cut -f1)
      # Detect content type
      case "${file##*.}" in
        jpg|jpeg) ct="image/jpeg" ;;
        png)      ct="image/png" ;;
        webp)     ct="image/webp" ;;
        svg)      ct="image/svg+xml" ;;
        mp4)      ct="video/mp4" ;;
        webm)     ct="video/webm" ;;
        pdf)      ct="application/pdf" ;;
        *)        ct="application/octet-stream" ;;
      esac
      echo "  [DRY] $rel_path ($file_size, $ct)"
    done
  done

  echo ""
  echo "Run with --execute to actually upload."
  exit 0
fi

# --- EXECUTE MODE ---

echo "Starting upload..."
echo ""

uploaded=0
failed=0
skipped=0

for dir in "${UPLOAD_DIRS[@]}"; do
  dir_path="$PUBLIC_DIR/$dir"
  [[ ! -d "$dir_path" ]] && continue

  find "$dir_path" -type f | sort | while read -r file; do
    rel_path="${file#$PUBLIC_DIR/}"

    # Detect content type
    case "${file##*.}" in
      jpg|jpeg) ct="image/jpeg" ;;
      png)      ct="image/png" ;;
      webp)     ct="image/webp" ;;
      svg)      ct="image/svg+xml" ;;
      mp4)      ct="video/mp4" ;;
      webm)     ct="video/webm" ;;
      pdf)      ct="application/pdf" ;;
      *)        ct="application/octet-stream" ;;
    esac

    echo -n "  Uploading $rel_path ... "

    # shellcheck disable=SC2086
    if npx wrangler r2 object put "$BUCKET_NAME/$rel_path" \
        --file "$file" \
        --content-type "$ct" \
        $ACCOUNT_FLAG 2>/dev/null; then
      echo "OK"
      uploaded=$((uploaded + 1))
    else
      echo "FAILED"
      failed=$((failed + 1))
    fi
  done
done

echo ""
echo "============================================"
echo "  Upload complete"
echo "  Uploaded: $uploaded"
echo "  Failed:   $failed"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Set up custom domain for R2 bucket (e.g. images.korobkovart.com)"
echo "  2. Add R2_PUBLIC_URL=https://images.korobkovart.com to .env"
echo "  3. Rebuild and deploy the site"
