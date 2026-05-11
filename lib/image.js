import { createCanvas, loadImage } from 'canvas';
import { getBuffer, formatTimestamp } from './utils.js';
import { generateTextBuffer } from './text.js';

async function drawSingleWatermark(ctx, watermarkImg, options) {
    const wmWidth = options.width || watermarkImg.width;
    const wmHeight = (watermarkImg.height / watermarkImg.width) * wmWidth;

    if (options.x === 'tile' || options.y === 'tile') {
        ctx.globalAlpha = options.opacity;
        for (let y = 0; y < ctx.canvas.height; y += wmHeight + (options.margin || 20)) {
            for (let x = 0; x < ctx.canvas.width; x += wmWidth + (options.margin || 20)) {
                ctx.save();
                if (options.rotation) {
                    ctx.translate(x + wmWidth / 2, y + wmHeight / 2);
                    ctx.rotate((options.rotation * Math.PI) / 180);
                    ctx.drawImage(watermarkImg, -wmWidth / 2, -wmHeight / 2, wmWidth, wmHeight);
                } else {
                    ctx.drawImage(watermarkImg, x, y, wmWidth, wmHeight);
                }
                ctx.restore();
            }
        }
        ctx.globalAlpha = 1.0;
        return;
    }

    let x = options.margin || 0;
    let y = options.margin || 0;

    if (options.x === 'right') x = ctx.canvas.width - wmWidth - (options.margin || 0);
    else if (options.x === 'center') x = (ctx.canvas.width - wmWidth) / 2;
    else if (typeof options.x === 'number') x = options.x;

    if (options.y === 'bottom') y = ctx.canvas.height - wmHeight - (options.margin || 0);
    else if (options.y === 'center') y = (ctx.canvas.height - wmHeight) / 2;
    else if (typeof options.y === 'number') y = options.y;

    ctx.globalAlpha = options.opacity;
    ctx.drawImage(watermarkImg, x, y, wmWidth, wmHeight);
    ctx.globalAlpha = 1.0;
}

export async function processImage(source, watermark, options) {
    const sourceBuffer = await getBuffer(source);
    const sourceImg = await loadImage(sourceBuffer);

    const outputFormat = options.outputFormat || 'png';
    const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : outputFormat === 'webp' ? 'image/webp' : 'image/png';
    const quality = options.quality || 90;

    const canvas = createCanvas(sourceImg.width, sourceImg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sourceImg, 0, 0, canvas.width, canvas.height);

    let watermarksToProcess = [];

    if (options.timestamp) {
        options.text = formatTimestamp(options.timestampFormat);
    }

    if (options.text) {
        const textBuffer = await generateTextBuffer(options);
        const textImg = await loadImage(textBuffer);
        watermarksToProcess.push({ img: textImg, opts: options });
    } else if (Array.isArray(watermark)) {
        for (const wm of watermark) {
            const wmBuffer = await getBuffer(wm.source);
            const wmImg = await loadImage(wmBuffer);
            watermarksToProcess.push({ img: wmImg, opts: { ...options, ...wm } });
        }
    } else if (watermark) {
        const watermarkBuffer = await getBuffer(watermark);
        const watermarkImg = await loadImage(watermarkBuffer);
        watermarksToProcess.push({ img: watermarkImg, opts: options });
    }

    for (const item of watermarksToProcess) {
        await drawSingleWatermark(ctx, item.img, item.opts);
    }

    return canvas.toBuffer(mimeType, { quality });
}

export async function processImageRemoval(source, region) {
    const encodedApiKey = 'TWlsaWstQm90LU91cmluTUQ=';
    const apiKey = Buffer.from(encodedApiKey, 'base64').toString('utf-8');

    let imageUrl = source;
    if (Buffer.isBuffer(source)) {
        throw new Error('La API externa requiere una URL directa. No se permiten Buffers locales para eliminar marcas de agua en imágenes.');
    }

    const prompt = 'remove watermark';
    const apiUrl = `https://api.neoxr.eu/api/photo-editor?image=${encodeURIComponent(imageUrl)}&q=${encodeURIComponent(prompt)}&apikey=${encodeURIComponent(apiKey)}`;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error en la API externa: ${response.status}`);

    const json = await response.json();

    if (json.status && json.data && json.data.url) {
        const imgResponse = await fetch(json.data.url);
        if (!imgResponse.ok) throw new Error('Error al descargar la imagen procesada de la API');
        const arrayBuffer = await imgResponse.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } else {
        throw new Error(json.message || 'La API no pudo procesar la imagen correctamente');
    }
        }
