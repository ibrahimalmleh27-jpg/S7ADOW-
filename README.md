# 🦖 watermark

Un módulo ligero y potente en JavaScript puro para agregar, personalizar y eliminar marcas de agua en imágenes y videos. Construido con `canvas` y `fluent-ffmpeg`, maneja sin problemas archivos locales, buffers y URLs, y sube automáticamente el contenido multimedia procesado a una CDN dual (Adoolab y Soymaycol).

---

> ⭐ **¡Se agradecería muchísimo si le das una estrellita al repo!** Tu apoyo ayuda a que el proyecto siga creciendo. 🦖  
> ✨ *It would mean a lot if you starred the repo! Your support helps keep the project alive.* 🌾

---

**Autores / Authors:**
- [@thisAdo](https://github.com/thisAdo)
- [@SoyMaycol](https://github.com/SoyMaycol)

---

## 🦈 Contenido

- [🇪🇸 Español](#-español)
- [🇺🇸 English](#-english)

---

<details>
<summary>🇪🇸 Ver en Español</summary>

## 🌾 Español

### 🍄 Características

- 🦖 **Soporte Multiformato:** Agrega marcas de agua tanto a imágenes como a videos.
- 🐢 **Marcas de Agua Animadas:** Soporta GIFs y videos cortos (hasta 15 segundos) como marca de agua sobre otros videos.
- 📝 **Texto como Marca de Agua:** No tienes una imagen? Usa texto puro con fuente, color y borde personalizable.
- 🧩 **Patrón Repetido (Tile):** Protege tus imágenes con marcas de agua en mosaico diagonales o cuadradas.
- 🕒 **Timestamp Automático:** Agrega la fecha y hora actual dinámicamente como marca de agua.
- 📸 **Múltiples Watermarks:** Superpon varias marcas de agua en una sola imagen con posiciones individuales.
- 🤖 **Eliminador de Watermarks (Imágenes):** Elimina marcas de agua de imágenes automáticamente usando Inteligencia Artificial (no requiere coordenadas).
- 🩹 **Eliminador de Watermarks (Videos):** Borra marcas de agua de videos difuminando una región específica usando `delogo`.
- 📍 **Entradas Flexibles:** Acepta rutas de archivos locales, Buffers o URLs directas HTTP/HTTPS.
- 🌾 **Posicionamiento Personalizado:** Coloca tu marca de agua exactamente donde la necesitas usando coordenadas o posiciones relativas.
- 🍄 **Opacidad, Escalado y Formatos:** Ajusta transparencia, escala, calidad y formato de salida (PNG, JPG, WEBP, MP4, WEBM).
- 🚫 **Modo Local (Skip CDN):** Procesa y devuelve solo el Buffer sin subir a ninguna CDN.
- 🦖 **Auto-CDN Dual:** Sube automáticamente el resultado a dos CDNs al mismo tiempo y devuelve ambos enlaces.

### 📍 Instalación

Para instalar el módulo directamente desde GitHub usando la terminal (CLI), ejecuta:

**Vía GitHub:**

```bash
npm install github:thisAdo/watermark
```

**Vía NPM:**

```bash
npm install @adomay/watermark
```

Como este módulo utiliza la sintaxis moderna de módulos de ECMAScript (`import`/`export`), debes asegurarte de que el proyecto donde lo vayas a usar tenga configurado `"type": "module"` en su archivo `package.json`.

**Si instalas vía GitHub**, tu `package.json` debería verse así:

```json
{
  "name": "mi-proyecto-increible",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@adomay/watermark": "github:thisAdo/watermark"
  }
}
```

**Si instalas vía NPM**, tu `package.json` debería verse así:

```json
{
  "name": "mi-proyecto-increible",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@adomay/watermark": "*"
  }
}
```

### 🌾 Ejemplos de Uso

#### 🍄 1. Marca de agua en una Imagen (Estándar)

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    'https://cdn.adoolab.xyz/dl/watermark.png',
    'image',
    { x: 'right', y: 'bottom', margin: 20, opacity: 0.8, width: 150 }
);

console.log(result.status ? result.urls : result.msg);
```

#### 🐢 2. Marca de agua (Imagen) en un Video

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/db6f3f3b.mp4',
    'https://cdn.adoolab.xyz/dl/watermark.png',
    'video',
    { x: 'left', y: 'top', opacity: 0.9, width: 120 }
);

console.log(result.status ? result.urls : result.msg);
```

#### 🦖 3. Marca de agua Animada (GIF/Video) en un Video

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/db6f3f3b.mp4',
    'https://cdn.adoolab.xyz/dl/e426a597.gif',
    'video',
    { x: 'left', y: 'bottom', width: 100 }
);

console.log(result.status ? result.urls : result.msg);
```

#### 📝 4. Marca de Agua de Texto Puro

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    null,
    'image',
    {
        text: '© Mi Empresa 2024',
        fontSize: 30,
        fontColor: '#ff0000',
        strokeColor: '#000000',
        strokeWidth: 3,
        x: 'center',
        y: 'center'
    }
);

console.log(result.status ? result.urls : result.msg);
```

#### 🧩 5. Patrón Repetido (Tile / Mosaico)

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    'https://cdn.adoolab.xyz/dl/watermark.png',
    'image',
    {
        x: 'tile',
        y: 'tile',
        opacity: 0.2,
        margin: 50,
        rotation: -30
    }
);

console.log(result.status ? result.urls : result.msg);
```

#### 🕒 6. Timestamp Automático

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    null,
    'image',
    {
        timestamp: true,
        timestampFormat: 'YYYY-MM-DD HH:mm:ss',
        fontSize: 20,
        x: 'right',
        y: 'bottom',
        margin: 10
    }
);

console.log(result.status ? result.urls : result.msg);
```

#### 📸 7. Múltiples Watermarks a la vez

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    [
        { source: 'https://cdn.adoolab.xyz/dl/watermark.png', x: 'left', y: 'top', width: 80 },
        { source: 'https://cdn.adoolab.xyz/dl/watermark2.png', x: 'right', y: 'bottom', width: 100 }
    ],
    'image'
);

console.log(result.status ? result.urls : result.msg);
```

#### 🚫 8. Procesar Localmente (Skip CDN)

```js
import { Watermark } from '@adomay/watermark';
import fs from 'fs';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    'https://cdn.adoolab.xyz/dl/watermark.png',
    'image',
    { skipCDN: true, outputFormat: 'webp', quality: 80 }
);

if (result.status) {
    fs.writeFileSync('mi_foto_local.webp', result.data);
}
```

#### 🤖 9. Quitar Marca de Agua en Imagen (Automático con IA)

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

// Para imágenes, solo pasa la URL. El módulo usa IA para detectar y borrar la marca automáticamente.
const result = await watermarkService.remove(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    'image'
);

console.log(result.status ? result.urls : result.msg);
```

#### 🩹 10. Quitar Marca de Agua en Video (Por Región)

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

// Para videos, debes indicar las coordenadas exactas de la marca de agua a difuminar.
const result = await watermarkService.remove(
    'https://cdn.adoolab.xyz/dl/db6f3f3b.mp4',
    'video',
    {
        x: 'left',
        y: 'bottom',
        margin: 20,
        width: 100,
        height: 100
    }
);

console.log(result.status ? result.urls : result.msg);
```

### 📍 Referencia de la API

#### `execute(source, watermark, type, options)`

Inicia el proceso de superposición de la marca de agua y devuelve un objeto que contiene el Buffer resultante y los enlaces de las subidas a las CDN.

**🌾 Parámetros:**

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| `source` | `String | Buffer` | El archivo principal. Puede ser una ruta local, una URL HTTP/HTTPS directa o un Buffer en memoria. |
| `watermark` | `String | Buffer | Array | Null` | El archivo de marca de agua. Si es `Null`, se usará `options.text`. Si es un `Array`, aplicará múltiples watermarks. |
| `type` | `String` | El tipo de medio del archivo principal. Debe ser `'image'` o `'video'`. Por defecto: `'image'`. |
| `options` | `Object` | Objeto opcional de configuración para cambiar la apariencia y posición de la marca de agua. |

**🍄 Objeto `options`:**

| Propiedad | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `x` | `String | Number` | `'right'` | Posición horizontal. Acepta `'left'`, `'center'`, `'right'`, `'tile'`, o un número exacto en píxeles. |
| `y` | `String | Number` | `'bottom'` | Posición vertical. Acepta `'top'`, `'center'`, `'bottom'`, `'tile'`, o un número exacto en píxeles. |
| `margin` | `Number` | `20` | Distancia en píxeles hacia los bordes (se aplica cuando usas posiciones relativas o en mosaico). |
| `width` | `Number` | `null` | Fuerza a la marca de agua a cambiar su tamaño a este ancho específico en píxeles. |
| `opacity` | `Number` | `1.0` | Nivel de transparencia. Va desde `0.0` (invisible) hasta `1.0` (opaco). |
| `rotation` | `Number` | `null` | Rota la marca de agua en grados (solo aplicable en modo mosaico `'tile'`). |
| `text` | `String` | `null` | Texto a renderizar como marca de agua (ignora el parámetro `watermark`). |
| `fontSize` | `Number` | `24` | Tamaño de la fuente si se usa `text`. |
| `fontColor` | `String` | `'#ffffff'` | Color del texto (hexadecimal). |
| `strokeColor` | `String` | `'#000000'` | Color del borde del texto (hexadecimal). |
| `strokeWidth` | `Number` | `2` | Grosor del borde del texto. |
| `timestamp` | `Boolean` | `false` | Si es `true`, genera un texto dinámico con la fecha y hora actuales. |
| `timestampFormat` | `String` | `'DD/MM/YYYY HH:mm:ss'` | Formato de la fecha (variables: YYYY, MM, DD, HH, mm, ss). |
| `skipCDN` | `Boolean` | `false` | Si es `true`, no sube el archivo a ninguna CDN y devuelve solo el Buffer. |
| `outputFormat` | `String` | `'png'/'mp4'` | Formato de salida ('png', 'jpg', 'webp' para imágenes; 'mp4', 'webm' para videos). |
| `quality` | `Number` | `90` | Calidad de compresión para formatos como jpg o webp (0 a 100). |

#### `remove(source, type, region)`

Elimina una marca de agua existente. En imágenes utiliza una API de Inteligencia Artificial que detecta y borra la marca automáticamente. En videos difumina una región específica usando el filtro `delogo` de FFmpeg.

**🌾 Parámetros:**

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| `source` | `String` | El archivo principal. Nota: Para imágenes, debe ser obligatoriamente una URL pública accesible por internet (no Buffers ni rutas locales). |
| `type` | `String` | `'image'` o `'video'`. |
| `region` | `Object` | Opcional en imágenes (la IA se encarga). Obligatorio en videos: Requiere coordenadas (`x`, `y`, `width`, `height`). Acepta posiciones relativas (`'left'`, `'right'`, `'bottom'`, etc.) junto con `margin`, o números exactos en píxeles. |

**🐢 Valor de Retorno:**

Si el proceso tiene éxito, devuelve un objeto con la siguiente estructura:

```js
{
  creator: 'Ado & Maycol',
  status: true,
  data: <Buffer>,
  urls: {
    ado: 'https://cdn.adoolab.xyz/dl/output.png',
    maycol: 'https://cdn.soymaycol.icu/files/output.png'
  },
  cdnData: { ... }
}
```

En caso de error, devuelve:

```js
{
  creator: 'Ado & Maycol',
  status: false,
  msg: 'Descripción detallada del error'
}
```

</details>

---

<details>
<summary>🇺🇸 View in English</summary>

## 🌾 English

### 🍄 Features

- 🦖 **Multi-Format Support:** Add watermarks to both images and videos.
- 🐢 **Animated Watermarks:** Supports GIFs and short videos (up to 15 seconds) as watermarks over other videos.
- 📝 **Text Watermark:** Don't have an image? Use pure text with custom font, color, and stroke.
- 🧩 **Tile Pattern:** Protect your images with diagonal or square mosaic watermarks.
- 🕒 **Automatic Timestamp:** Dynamically add the current date and time as a watermark.
- 📸 **Multiple Watermarks:** Overlay several watermarks on a single image with individual positions.
- 🤖 **Watermark Remover (Images):** Removes watermarks from images automatically using Artificial Intelligence (no coordinates required).
- 🩹 **Watermark Remover (Videos):** Erases watermarks from videos by blurring a specific region using `delogo`.
- 📍 **Flexible Inputs:** Accepts local file paths, raw Buffers, or direct HTTP/HTTPS URLs.
- 🌾 **Custom Positioning:** Place your watermark exactly where you need it using coordinates or relative text positions.
- 🍄 **Opacity, Scaling & Formats:** Adjust transparency, scale, quality, and output format (PNG, JPG, WEBP, MP4, WEBM).
- 🚫 **Local Mode (Skip CDN):** Process and return only the Buffer without uploading to any CDN.
- 🦖 **Dual Auto-CDN:** Automatically uploads the resulting output to two external CDNs simultaneously and returns both ready-to-use URLs.

### 📍 Installation

To install the module directly from GitHub using the CLI, run the following command:

**By GitHub:**

```bash
npm install github:thisAdo/watermark
```

**By NPM:**

```bash
npm install @adomay/watermark
```

Since this module uses modern ECMAScript module syntax (`import`/`export`), you must ensure that the project where you are using it has `"type": "module"` set in its `package.json`.

**If installing via GitHub**, your `package.json` should look like this:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@adomay/watermark": "github:thisAdo/watermark"
  }
}
```

**If installing via NPM**, your `package.json` should look like this:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@adomay/watermark": "*"
  }
}
```

### 🌾 Usage Examples

#### 🍄 1. Watermark on an Image (Standard)

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    'https://cdn.adoolab.xyz/dl/watermark.png',
    'image',
    { x: 'right', y: 'bottom', margin: 20, opacity: 0.8, width: 150 }
);

console.log(result.status ? result.urls : result.msg);
```

#### 🐢 2. Static Watermark (Image) on a Video

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/db6f3f3b.mp4',
    'https://cdn.adoolab.xyz/dl/watermark.png',
    'video',
    { x: 'left', y: 'top', opacity: 0.9, width: 120 }
);

console.log(result.status ? result.urls : result.msg);
```

#### 🦖 3. Animated Watermark (GIF/Video) on a Video

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/db6f3f3b.mp4',
    'https://cdn.adoolab.xyz/dl/e426a597.gif',
    'video',
    { x: 'left', y: 'bottom', width: 100 }
);

console.log(result.status ? result.urls : result.msg);
```

#### 📝 4. Pure Text Watermark

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    null,
    'image',
    {
        text: '© My Company 2024',
        fontSize: 30,
        fontColor: '#ff0000',
        strokeColor: '#000000',
        strokeWidth: 3,
        x: 'center',
        y: 'center'
    }
);

console.log(result.status ? result.urls : result.msg);
```

#### 🧩 5. Repeated Pattern (Tile / Mosaic)

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    'https://cdn.adoolab.xyz/dl/watermark.png',
    'image',
    {
        x: 'tile',
        y: 'tile',
        opacity: 0.2,
        margin: 50,
        rotation: -30
    }
);

console.log(result.status ? result.urls : result.msg);
```

#### 🕒 6. Automatic Timestamp

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    null,
    'image',
    {
        timestamp: true,
        timestampFormat: 'YYYY-MM-DD HH:mm:ss',
        fontSize: 20,
        x: 'right',
        y: 'bottom',
        margin: 10
    }
);

console.log(result.status ? result.urls : result.msg);
```

#### 📸 7. Multiple Watermarks at Once

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    [
        { source: 'https://cdn.adoolab.xyz/dl/watermark.png', x: 'left', y: 'top', width: 80 },
        { source: 'https://cdn.adoolab.xyz/dl/watermark2.png', x: 'right', y: 'bottom', width: 100 }
    ],
    'image'
);

console.log(result.status ? result.urls : result.msg);
```

#### 🚫 8. Process Locally (Skip CDN)

```js
import { Watermark } from '@adomay/watermark';
import fs from 'fs';

const watermarkService = new Watermark();

const result = await watermarkService.execute(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    'https://cdn.adoolab.xyz/dl/watermark.png',
    'image',
    { skipCDN: true, outputFormat: 'webp', quality: 80 }
);

if (result.status) {
    fs.writeFileSync('my_local_photo.webp', result.data);
}
```

#### 🤖 9. Remove Watermark from Image (Automatic with AI)

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

// For images, just pass the URL. The module uses AI to detect and erase the watermark automatically.
const result = await watermarkService.remove(
    'https://cdn.adoolab.xyz/dl/8932d34a.jpg',
    'image'
);

console.log(result.status ? result.urls : result.msg);
```

#### 🩹 10. Remove Watermark from Video (By Region)

```js
import { Watermark } from '@adomay/watermark';

const watermarkService = new Watermark();

// For videos, you must specify the exact coordinates of the watermark area to blur.
const result = await watermarkService.remove(
    'https://cdn.adoolab.xyz/dl/db6f3f3b.mp4',
    'video',
    {
        x: 'left',
        y: 'bottom',
        margin: 20,
        width: 100,
        height: 100
    }
);

console.log(result.status ? result.urls : result.msg);
```

### 📍 API Reference

#### `execute(source, watermark, type, options)`

Executes the watermark overlay process and returns an object containing the resulting Buffer and the dual CDN upload data.

**🌾 Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `source` | `String | Buffer` | The main media file. Can be a local path, an HTTP/HTTPS URL, or a Buffer. |
| `watermark` | `String | Buffer | Array | Null` | The watermark file. If Null, uses `options.text`. If an `Array`, applies multiple watermarks sequentially. |
| `type` | `String` | Specifies the main media type. Must be either `'image'` or `'video'`. Defaults to `'image'`. |
| `options` | `Object` | Optional configuration object to change the watermark's appearance and position. |

**🍄 Options Object:**

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `x` | `String | Number` | `'right'` | Horizontal position. Accepts `'left'`, `'center'`, `'right'`, `'tile'`, or a specific number in pixels. |
| `y` | `String | Number` | `'bottom'` | Vertical position. Accepts `'top'`, `'center'`, `'bottom'`, `'tile'`, or a specific number in pixels. |
| `margin` | `Number` | `20` | Margin in pixels applied when using relative string positions or tile mode. |
| `width` | `Number` | `null` | Forces the watermark to scale to a specific width in pixels. |
| `opacity` | `Number` | `1.0` | Transparency level, from `0.0` (invisible) to `1.0` (fully opaque). |
| `rotation` | `Number` | `null` | Rotates the watermark in degrees (only applicable in `'tile'` mode). |
| `text` | `String` | `null` | Text to render as a watermark (ignores the `watermark` parameter). |
| `fontSize` | `Number` | `24` | Font size if using `text`. |
| `fontColor` | `String` | `'#ffffff'` | Text color (hexadecimal). |
| `strokeColor` | `String` | `'#000000'` | Text stroke color (hexadecimal). |
| `strokeWidth` | `Number` | `2` | Text stroke thickness. |
| `timestamp` | `Boolean` | `false` | If `true`, generates dynamic text with the current date and time. |
| `timestampFormat` | `String` | `'DD/MM/YYYY HH:mm:ss'` | Date format (variables: YYYY, MM, DD, HH, mm, ss). |
| `skipCDN` | `Boolean` | `false` | If `true`, skips uploading to CDNs and returns only the Buffer. |
| `outputFormat` | `String` | `'png'/'mp4'` | Output format ('png', 'jpg', 'webp' for images; 'mp4', 'webm' for videos). |
| `quality` | `Number` | `90` | Compression quality for formats like jpg or webp (0 to 100). |

#### `remove(source, type, region)`

Removes an existing watermark. For images, it uses an Artificial Intelligence API that detects and erases the mark automatically. For videos, it blurs a specific region using FFmpeg's `delogo` filter.

**🌾 Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `source` | `String` | The main media file. **Note:** For images, it must strictly be a public URL accessible via the internet (no Buffers or local paths). |
| `type` | `String` | `'image'` or `'video'`. |
| `region` | `Object` | **Optional for images** (AI handles it). **Mandatory for videos:** Requires coordinates (`x`, `y`, `width`, `height`). Accepts relative positions (`'left'`, `'right'`, `'bottom'`, etc.) along with `margin`, or exact pixel numbers. |

**🐢 Return Value:**

If successful, returns a Promise that resolves to an object with the following structure:

```js
{
  creator: 'Ado & Maycol',
  status: true,
  data: <Buffer>,
  urls: {
    ado: 'https://cdn.adoolab.xyz/dl/output.png',
    maycol: 'https://cdn.soymaycol.icu/files/output.png'
  },
  cdnData: { ... }
}
```

If an error occurs, it returns:

```js
{
  creator: 'Ado & Maycol',
  status: false,
  msg: 'Detailed error description'
}
```

</details>
