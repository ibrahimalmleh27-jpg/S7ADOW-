import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { getTempFilePath, formatTimestamp } from './utils.js';
import { generateTextBuffer } from './text.js';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// حساب مكان العلامة المائية
function calculateOverlayCoords(options) {

    let overlayX = (options.margin || 0).toString();

    if (options.x === 'right')
        overlayX = `W-w-${options.margin || 0}`;

    else if (options.x === 'center')
        overlayX = '(W-w)/2';

    else if (typeof options.x === 'number')
        overlayX = options.x.toString();

    let overlayY = (options.margin || 0).toString();

    if (options.y === 'bottom')
        overlayY = `H-h-${options.margin || 0}`;

    else if (options.y === 'center')
        overlayY = '(H-h)/2';

    else if (typeof options.y === 'number')
        overlayY = options.y.toString();

    return { overlayX, overlayY };
}

// تجهيز فلاتر العلامة المائية
function buildWmFilter(wmStream, options) {

    let wmFilters = [];

    // تغيير الحجم
    if (options.width)
        wmFilters.push(`scale=${options.width}:-1`);

    // الشفافية
    if (options.opacity < 1.0)
        wmFilters.push(
            `format=rgba,colorchannelmixer=aa=${options.opacity}`
        );

    if (wmFilters.length > 0) {

        return `${wmStream}${wmFilters.join(',')}[wm]; `;

    }

    return '';
}

// إضافة العلامة المائية للفيديو
export async function processVideo(source, watermark, options) {

    const sourceFile =
        await getTempFilePath(source, 'video');

    const outputFormat =
        options.outputFormat || 'mp4';

    const tempOutput =
        path.join(
            os.tmpdir(),
            `output_${Date.now()}.${outputFormat}`
        );

    return new Promise((resolve, reject) => {

        const command = ffmpeg(sourceFile.path);

        let filterComplex = '';

        let inputCount = 1;

        // إضافة الوقت كنص
        if (options.timestamp) {

            options.text =
                formatTimestamp(options.timestampFormat);

        }

        // إذا العلامة Text
        if (options.text) {

            generateTextBuffer(options)

                .then(buf => {

                    const tmpPath =
                        path.join(
                            os.tmpdir(),
                            `text_wm_${Date.now()}.png`
                        );

                    return fs.writeFile(tmpPath, buf)
                        .then(() => tmpPath);

                })

                .then(tmpPath => {

                    command.input(tmpPath);

                    const {
                        overlayX,
                        overlayY
                    } = calculateOverlayCoords(options);

                    const prepFilter =
                        buildWmFilter(
                            `[${inputCount}:v]`,
                            options
                        );

                    const currentStream =
                        prepFilter
                            ? '[wm]'
                            : `[${inputCount}:v]`;

                    filterComplex +=
                        `${prepFilter}[0:v]${currentStream}overlay=${overlayX}:${overlayY}[vout]`;

                    executeCommand(
                        command,
                        tempOutput,
                        filterComplex,
                        outputFormat,
                        sourceFile,
                        null,
                        resolve,
                        reject
                    );

                })

                .catch(reject);

            return;
        }

        // عدة علامات مائية
        if (Array.isArray(watermark)) {

            let currentLabel = '[0:v]';

            watermark.forEach((wm, index) => {

                command.input(wm.source);

                const wmOpts = {
                    ...options,
                    ...wm
                };

                const {
                    overlayX,
                    overlayY
                } = calculateOverlayCoords(wmOpts);

                const prepFilter =
                    buildWmFilter(
                        `[${inputCount}:v]`,
                        wmOpts
                    );

                const wmStream =
                    prepFilter
                        ? `[wm${index}]`
                        : `[${inputCount}:v]`;

                filterComplex += prepFilter;

                const nextLabel =
                    index === watermark.length - 1
                        ? '[vout]'
                        : `[v${index}]`;

                filterComplex +=
                    `${currentLabel}${wmStream}overlay=${overlayX}:${overlayY}${nextLabel}${index < watermark.length - 1 ? '; ' : ''}`;

                currentLabel = nextLabel;

                inputCount++;

            });

            executeCommand(
                command,
                tempOutput,
                filterComplex,
                outputFormat,
                sourceFile,
                null,
                resolve,
                reject
            );

        }

        // علامة واحدة
        else if (watermark) {

            const watermarkFile =
                getTempFilePath(watermark, 'wm');

            watermarkFile

                .then(wf => {

                    command.input(wf.path);

                    const {
                        overlayX,
                        overlayY
                    } = calculateOverlayCoords(options);

                    const prepFilter =
                        buildWmFilter('[1:v]', options);

                    const wmStream =
                        prepFilter
                            ? '[wm]'
                            : '[1:v]';

                    filterComplex =
                        `${prepFilter}[0:v]${wmStream}overlay=${overlayX}:${overlayY}[vout]`;

                    executeCommand(
                        command,
                        tempOutput,
                        filterComplex,
                        outputFormat,
                        sourceFile,
                        wf,
                        resolve,
                        reject
                    );

                })

                .catch(reject);

        }

        // لا يوجد Watermark
        else {

            reject(
                new Error('لم يتم توفير علامة مائية')
            );

        }

    });

}

// تنفيذ FFmpeg
function executeCommand(
    command,
    tempOutput,
    filterComplex,
    outputFormat,
    sourceFile,
    watermarkFile,
    resolve,
    reject
) {

    command
        .inputOptions(['-t', '15'])

        .complexFilter(filterComplex)

        .outputOptions([
            '-map',
            '[vout]',
            '-c:a copy'
        ])

        .outputFormat(outputFormat)

        .save(tempOutput)

        .on('end', async () => {

            try {

                const buffer =
                    await fs.readFile(tempOutput);

                await cleanup(
                    [sourceFile, watermarkFile],
                    tempOutput
                );

                resolve(buffer);

            } catch (err) {

                await cleanup(
                    [sourceFile, watermarkFile],
                    tempOutput
                );

                reject(err);

            }

        })

        .on('error', async (err) => {

            await cleanup(
                [sourceFile, watermarkFile],
                tempOutput
            );

            reject(
                new Error(
                    `خطأ FFmpeg: ${err.message}`
                )
            );

        });

}

// حذف الملفات المؤقتة
async function cleanup(files, tempOutput) {

    for (const f of files) {

        if (f && f.isTemp) {

            await fs.unlink(f.path)
                .catch(() => {});

        }

    }

    await fs.unlink(tempOutput)
        .catch(() => {});

}

// إزالة العلامة المائية من الفيديو
export async function processVideoRemoval(source, region) {

    const sourceFile =
        await getTempFilePath(
            source,
            'video_rm'
        );

    const tempOutput =
        path.join(
            os.tmpdir(),
            `removed_${Date.now()}.mp4`
        );

    // قراءة أبعاد الفيديو
    const getDimensions = (filePath) =>
        new Promise((resolve, reject) => {

            ffmpeg.ffprobe(
                filePath,
                (err, metadata) => {

                    if (err)
                        return reject(err);

                    const videoStream =
                        metadata.streams.find(
                            s => s.codec_type === 'video'
                        );

                    if (videoStream)

                        resolve({
                            width: videoStream.width,
                            height: videoStream.height
                        });

                    else

                        reject(
                            new Error(
                                'لم يتم العثور على فيديو'
                            )
                        );

                }
            );

        });

    return new Promise((resolve, reject) => {

        getDimensions(sourceFile.path)

            .then(dimensions => {

                let w = region.width || 100;
                let h = region.height || 100;

                const margin =
                    region.margin || 0;

                let posX = margin;

                if (region.x === 'right')

                    posX =
                        dimensions.width -
                        w -
                        margin;

                else if (region.x === 'center')

                    posX =
                        Math.floor(
                            (dimensions.width - w) / 2
                        );

                else if (typeof region.x === 'number')

                    posX = region.x;

                let posY = margin;

                if (region.y === 'bottom')

                    posY =
                        dimensions.height -
                        h -
                        margin;

                else if (region.y === 'center')

                    posY =
                        Math.floor(
                            (dimensions.height - h) / 2
                        );

                else if (typeof region.y === 'number')

                    posY = region.y;

                // منع الخروج عن حدود الفيديو
                posX = Math.max(0, posX);
                posY = Math.max(0, posY);

                if (posX + w > dimensions.width)

                    w = dimensions.width - posX;

                if (posY + h > dimensions.height)

                    h = dimensions.height - posY;

                if (w <= 0 || h <= 0) {

                    return reject(
                        new Error(
                            'منطقة الحذف خارج حدود الفيديو.'
                        )
                    );

                }

                // فلتر إزالة اللوجو
                const filterComplex =
                    `delogo=x=${posX}:y=${posY}:w=${w}:h=${h}`;

                ffmpeg(sourceFile.path)

                    .inputOptions(['-t', '15'])

                    .complexFilter(filterComplex)

                    .outputOptions(['-c:a copy'])

                    .save(tempOutput)

                    .on('end', async () => {

                        try {

                            const buffer =
                                await fs.readFile(
                                    tempOutput
                                );

                            await fs.unlink(tempOutput)
                                .catch(() => {});

                            if (sourceFile.isTemp)

                                await fs.unlink(
                                    sourceFile.path
                                ).catch(() => {});

                            resolve(buffer);

                        } catch (err) {

                            reject(err);

                        }

                    })

                    .on('error', async (err) => {

                        await fs.unlink(tempOutput)
                            .catch(() => {});

                        if (sourceFile.isTemp)

                            await fs.unlink(
                                sourceFile.path
                            ).catch(() => {});

                        reject(
                            new Error(
                                `خطأ FFmpeg: ${err.message}`
                            )
                        );

                    });

            })

            .catch(err => {

                reject(
                    new Error(
                        `خطأ أثناء قراءة أبعاد الفيديو: ${err.message}`
                    )
                );

            });

    });

}