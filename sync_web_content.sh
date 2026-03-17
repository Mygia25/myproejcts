#!/bin/bash
# sync_web_content.sh — Copy updated carousel & story PNGs to web-serving folders
# Run this from the INGRID NUNEZ directory

cd "/Users/gerla/Documents/DLYRA/CLIENTES DLYRA/INGRID NUNEZ"
count=0

echo "=== STEP 1: Copy updated carousel slides from PUBLICACIONES to CARRUSELES-PNG ==="

copy_carousel() {
  local cnum="$1" dia_folder="$2" cpng_folder="$3"
  local src="PUBLICACIONES/$dia_folder/CARRUSEL"
  local dest="CARRUSELES-PNG/$cpng_folder"

  if [ ! -d "$dest" ]; then
    echo "  WARNING: $dest does not exist, skipping"
    return
  fi

  # First fix any CXX_slide_XX.png -> slide-XX.png in dest
  for f in "$dest/${cnum}_slide_"*.png; do
    if [ -f "$f" ]; then
      num=$(basename "$f" | sed "s/${cnum}_slide_//;s/.png//")
      mv "$f" "$dest/slide-${num}.png"
      echo "  Renamed: $(basename $f) -> slide-${num}.png"
      count=$((count+1))
    fi
  done

  # Then copy updated slides from PUBLICACIONES
  if [ -d "$src" ]; then
    for f in "$src/${cnum}_slide_"*.png; do
      if [ -f "$f" ]; then
        num=$(basename "$f" | sed "s/${cnum}_slide_//;s/.png//")
        cp "$f" "$dest/slide-${num}.png"
        echo "  Updated: $cpng_folder/slide-${num}.png"
        count=$((count+1))
      fi
    done
  fi

  local total=$(ls "$dest/"slide-*.png 2>/dev/null | wc -l)
  echo "  $cpng_folder: $total slides total"
}

copy_carousel "C01" "DIA_01_SAB_14_MAR" "C01-MAR14-PRESENTACION"
copy_carousel "C02" "DIA_02_LUN_16_MAR" "C02-MAR15-CRIAR-SANAR"
copy_carousel "C03" "DIA_03_MAR_17_MAR" "C03-MAR16-RABIETAS"
copy_carousel "C04" "DIA_04_MIE_18_MAR" "C04-MAR17-PANTALLAS"
copy_carousel "C05" "DIA_05_JUE_19_MAR" "C05-MAR18-FELICIDAD"
copy_carousel "C06" "DIA_06_VIE_20_MAR" "C06-MAR19-SINDROME-DOWN"
copy_carousel "C07" "DIA_07_SAB_21_MAR" "C07-MAR20-PAPA-AGOTADO"
copy_carousel "C08" "DIA_08_DOM_22_MAR" "C08-MAR22-TEASER"
copy_carousel "C09" "DIA_09_LUN_23_MAR" "C09-MAR23-TERMOSTATO"
copy_carousel "C10" "DIA_10_MAR_24_MAR" "C10-MAR24-RECONOCES"
copy_carousel "C11" "DIA_11_MIE_25_MAR" "C11-MAR25-PREVIEW-MODULOS"
copy_carousel "C12" "DIA_12_JUE_26_MAR" "C12-MAR26-LANZAMIENTO"
copy_carousel "C13" "DIA_13_VIE_27_MAR" "C13-MAR27-POST-LANZAMIENTO"
copy_carousel "C14" "DIA_14_SAB_28_MAR" "C14-MAR30-ETAPAS"
copy_carousel "C15" "DIA_17_MAR_31_MAR" "C15-ABR01-AUTISMO"
copy_carousel "C16" "DIA_19_JUE_02_ABR" "C16-ABR03-SEMANA-SANTA"
copy_carousel "C17" "DIA_23_LUN_06_ABR" "C17-ABR06-SALUD"
copy_carousel "C18" "DIA_25_MIE_08_ABR" "C18-ABR08-LIMITES"
copy_carousel "C19" "DIA_31_MAR_14_ABR" "C19-ABR14-HERIDAS"
copy_carousel "C20" "DIA_32_MIE_15_ABR" "C20-ABR16-PRESENCIA"

echo ""
echo "=== STEP 2: Copy stories from PUBLICACIONES to HISTORIAS-PNG ==="

# Remove old Dom_15_Mar files (Sunday that was skipped)
rm -f HISTORIAS-PNG/Dom_15_Mar_H1.png HISTORIAS-PNG/Dom_15_Mar_H2.png HISTORIAS-PNG/Dom_15_Mar_H3.png
echo "  Removed Dom_15_Mar files"

# Run the existing copy_stories.sh
bash copy_stories.sh

echo ""
echo "=== STEP 3: Verify ==="
echo "Carousel folders:"
for d in CARRUSELES-PNG/C*/; do
  echo "  $(basename $d): $(ls "$d"slide-*.png 2>/dev/null | wc -l) slides"
done

echo ""
echo "Stories in HISTORIAS-PNG: $(ls HISTORIAS-PNG/*.png 2>/dev/null | wc -l) files"
echo "Dom_15 files: $(ls HISTORIAS-PNG/Dom_15_Mar_*.png 2>/dev/null | wc -l) (should be 0)"

echo ""
echo "=== DONE! Total carousel operations: $count ==="
echo "Now run: git add . && git commit -m '[SYNC] Web actualizada con contenido correcto del mes' && git push"
