import { processImage, processImageRemoval } from './lib/image.js';
import { processVideo, processVideoRemoval } from './lib/video.js';
import { uploadToAdoCDN, uploadToMaycolCDN } from './lib/upload.js';

export class Watermark {
    #creators = 'Ado & Maycol';

    async execute(source, watermark, type = 'image', options = {}) {
        try {
            const config = {
                x: 'right',
                y: 'bottom',
                margin: 20,
                width: null,
                opacity: 1.0,
                skipCDN: false,
                outputFormat: type === 'image' ? 'png' : 'mp4',
                quality: 90,
                ...options
            };

            let buffer;
            let mimetype;
            let extension = config.outputFormat;

            if (type === 'image') {
                buffer = await processImage(source, watermark, config);
                mimetype = config.outputFormat === 'webp' ? 'image/webp' : config.outputFormat === 'jpg' ? 'image/jpeg' : 'image/png';
            } else if (type === 'video') {
                buffer = await processVideo(source, watermark, config);
                mimetype = config.outputFormat === 'webm' ? 'video/webm' : 'video/mp4';
            } else {
                throw new Error(`Invalid type "${type}". Valid types are "image" and "video".`);
            }

            if (config.skipCDN) {
                return {
                    creator: this.#creators,
                    status: true,
                    data: buffer,
                    urls: { ado: null, maycol: null },
                    cdnData: { ado: null, maycol: null }
                };
            }

            const [adoResponse, maycolResponse] = await Promise.all([
                uploadToAdoCDN(buffer, mimetype, extension),
                uploadToMaycolCDN(buffer, mimetype, extension)
            ]);

            return {
                creator: this.#creators,
                status: true,
                data: buffer,
                urls: {
                    ado: adoResponse ? adoResponse.url : null,
                    maycol: maycolResponse ? maycolResponse.link : null
                },
                cdnData: {
                    ado: adoResponse,
                    maycol: maycolResponse
                }
            };
        } catch (e) {
            return {
                creator: this.#creators,
                status: false,
                msg: e instanceof Error ? e.message : String(e),
            };
        }
    }

    async remove(source, type = 'image', region = {}) {
        try {
            if (type === 'video') {
                if (!region.x && region.x !== 0 || !region.y && region.y !== 0 || !region.width || !region.height) {
                    throw new Error('Se requiere el objeto region {x, y, width, height} exacto para eliminar marcas de agua en videos.');
                }
            }

            let buffer;
            let mimetype;
            let extension;

            if (type === 'image') {
                buffer = await processImageRemoval(source, region);
                mimetype = 'image/png';
                extension = 'png';
            } else if (type === 'video') {
                buffer = await processVideoRemoval(source, region);
                mimetype = 'video/mp4';
                extension = 'mp4';
            } else {
                throw new Error(`Invalid type "${type}". Valid types are "image" and "video".`);
            }

            const [adoResponse, maycolResponse] = await Promise.all([
                uploadToAdoCDN(buffer, mimetype, extension),
                uploadToMaycolCDN(buffer, mimetype, extension)
            ]);

            return {
                creator: this.#creators,
                status: true,
                data: buffer,
                urls: {
                    ado: adoResponse ? adoResponse.url : null,
                    maycol: maycolResponse ? maycolResponse.link : null
                },
                cdnData: {
                    ado: adoResponse,
                    maycol: maycolResponse
                }
            };
        } catch (e) {
            return {
                creator: this.#creators,
                status: false,
                msg: e instanceof Error ? e.message : String(e),
            };
        }
    }
            }
