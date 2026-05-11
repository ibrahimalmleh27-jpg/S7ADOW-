export async function uploadToAdoCDN(buffer, mimetype, extension) {
    try {
        const base64 = buffer.toString('base64');
        const response = await fetch('https://cdn.adoolab.xyz/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: `output.${extension}`,
                data: base64,
                mimetype: mimetype,
                expiration: '24h'
            })
        });

        if (!response.ok) throw new Error('Ado CDN Upload failed');
        return await response.json();
    } catch (e) {
        return null;
    }
}

export async function uploadToMaycolCDN(buffer, mimetype, extension) {
    try {
        const blob = new Blob([buffer], { type: mimetype });
        const formData = new FormData();
        formData.append('file', blob, `output.${extension}`);

        const response = await fetch('https://cdn.soymaycol.icu/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Maycol CDN Upload failed');
        return await response.json();
    } catch (e) {
        return null;
    }
}