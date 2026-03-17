#!/bin/bash
cd "/Users/gerla/Documents/DLYRA/CLIENTES DLYRA/INGRID NUNEZ"
count=0

copy_day() {
  local dir="$1" prefix="$2"
  local src="PUBLICACIONES/$dir/HISTORIAS"
  if [ -d "$src" ]; then
    for h in H1 H2 H3; do
      if [ -f "$src/$h.png" ]; then
        cp "$src/$h.png" "HISTORIAS-PNG/${prefix}_${h}.png"
        count=$((count+1))
      fi
    done
  fi
}

copy_day "DIA_01_SAB_14_MAR" "Sab_14_Mar"
copy_day "DIA_02_LUN_16_MAR" "Lun_16_Mar"
copy_day "DIA_03_MAR_17_MAR" "Mar_17_Mar"
copy_day "DIA_04_MIE_18_MAR" "Mie_18_Mar"
copy_day "DIA_05_JUE_19_MAR" "Jue_19_Mar"
copy_day "DIA_06_VIE_20_MAR" "Vie_20_Mar"
copy_day "DIA_07_SAB_21_MAR" "Sab_21_Mar"
copy_day "DIA_08_DOM_22_MAR" "Dom_22_Mar"
copy_day "DIA_09_LUN_23_MAR" "Lun_23_Mar"
copy_day "DIA_10_MAR_24_MAR" "Mar_24_Mar"
copy_day "DIA_11_MIE_25_MAR" "Mie_25_Mar"
copy_day "DIA_12_JUE_26_MAR" "Jue_26_Mar"
copy_day "DIA_13_VIE_27_MAR" "Vie_27_Mar"
copy_day "DIA_14_SAB_28_MAR" "Sab_28_Mar"
copy_day "DIA_15_DOM_29_MAR" "Dom_29_Mar"
copy_day "DIA_16_LUN_30_MAR" "Lun_30_Mar"
copy_day "DIA_17_MAR_31_MAR" "Mar_31_Mar"
copy_day "DIA_18_MIE_01_ABR" "Mie_1_Abr"
copy_day "DIA_19_JUE_02_ABR" "Jue_2_Abr"
copy_day "DIA_20_VIE_03_ABR" "Vie_3_Abr"
copy_day "DIA_21_SAB_04_ABR" "Sab_4_Abr"
copy_day "DIA_22_DOM_05_ABR" "Dom_5_Abr"
copy_day "DIA_23_LUN_06_ABR" "Lun_6_Abr"
copy_day "DIA_24_MAR_07_ABR" "Mar_7_Abr"
copy_day "DIA_25_MIE_08_ABR" "Mie_8_Abr"
copy_day "DIA_26_JUE_09_ABR" "Jue_9_Abr"
copy_day "DIA_27_VIE_10_ABR" "Vie_10_Abr"
copy_day "DIA_28_SAB_11_ABR" "Sab_11_Abr"
copy_day "DIA_29_DOM_12_ABR" "Dom_12_Abr"
copy_day "DIA_30_LUN_13_ABR" "Lun_13_Abr"
copy_day "DIA_31_MAR_14_ABR" "Mar_14_Abr"
copy_day "DIA_32_MIE_15_ABR" "Mie_15_Abr"
copy_day "DIA_33_JUE_16_ABR" "Jue_16_Abr"
copy_day "DIA_34_VIE_17_ABR" "Vie_17_Abr"
copy_day "DIA_35_SAB_18_ABR" "Sab_18_Abr"

echo "Done! Copied $count stories to HISTORIAS-PNG/"
