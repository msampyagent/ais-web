# imageTagger

Utility per stampare un piccolo tag di testo (es. `EN`, `ES`) nei 4 angoli di tutte le immagini di una cartella (ricorsivamente), salvando le copie taggate in una cartella "sorella" con suffisso `_<TAG>`, senza toccare gli originali.

## Requisiti

```bash
pip install pillow
```

## Utilizzo

```bash
python image_tagger.py --input-folder /folder/folder2/folder3 --tag ES
```

Scansiona ricorsivamente `--input-folder`, cerca immagini `.png .jpg .jpeg .webp .gif .bmp .tiff` e per ognuna crea una copia con il tag scritto in bianco nei 4 angoli (sfondo completamente trasparente), salvata in una cartella sorella allo stesso livello, con suffisso `_<TAG>`:

```
/folder/folder2/folder3        <- input (non modificato)
/folder/folder2/folder3_ES     <- output, stessa struttura relativa
```

Gli originali non vengono modificati.

| Opzione | Default | Descrizione |
|---|---|---|
| `--input-folder` | *(obbligatorio)* | Cartella radice da scansionare ricorsivamente |
| `--tag` | *(obbligatorio)* | Testo del tag, es. `EN`, `ES` |
| `--font-size` | auto (~2.5% del lato minore, min 10px) | Forza una dimensione font specifica |
| `--margin` | 8 | Margine in px dagli angoli |
| `--opacity` | 255 | Opacità del testo (0-255) |

### Esempi

```bash
python image_tagger.py --input-folder ../../v2/assets/pics --tag EN
python image_tagger.py --input-folder ../../v2/assets/pics --tag ES --font-size 14 --margin 6
```
