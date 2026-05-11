import { createCanvas } from 'canvas';

export async function generateTextBuffer(options) {
    const fontSize = options.fontSize || 24;
    const fontFamily = options.fontFamily || 'Arial';
    const fontColor = options.fontColor || '#ffffff';
    const strokeColor = options.strokeColor || '#000000';
    const strokeWidth = options.strokeWidth || 2;
    const text = options.text || 'Watermark';

    const canvas = createCanvas(1, 1);
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    const finalWidth = textWidth + (strokeWidth * 4);
    const finalHeight = textHeight + (strokeWidth * 4);

    const finalCanvas = createCanvas(finalWidth, finalHeight);
    const finalCtx = finalCanvas.getContext('2d');
    finalCtx.font = `${fontSize}px ${fontFamily}`;

    if (strokeWidth > 0) {
        finalCtx.strokeStyle = strokeColor;
        finalCtx.lineWidth = strokeWidth;
        finalCtx.lineJoin = 'round';
        finalCtx.strokeText(text, strokeWidth * 2, textHeight + strokeWidth);
    }

    finalCtx.fillStyle = fontColor;
    finalCtx.fillText(text, strokeWidth * 2, textHeight + strokeWidth);

    return finalCanvas.toBuffer('image/png');
}