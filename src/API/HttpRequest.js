const https = require("https");
module.exports = (url, options, data) => {
    return new Promise((resolve, reject) => {
        const request = https.request(url, options, response => {
            if (response.statusCode == null)
                return reject('Unknown response.');
            const ReturnResult = (result) => resolve({ code: response.statusCode || 0, data: result });
            const chunks = [];
            let responseLen = 0;
            response.on('data', (chunk) => {
                chunks.push(chunk);
                responseLen += chunk.length;
            });
            response.on('end', () => {
                if (!response.complete)
                    return reject('Response error.');
                if (responseLen == 0)
                    return ReturnResult();
                if (chunks.length == 1)
                    return ReturnResult(chunks[0].toString());
                const data = Buffer.allocUnsafe(responseLen);
                let len = 0;
                for (let i = 0; i < chunks.length; i++) {
                    const chunk = chunks[i];
                    chunk.copy(data, len);
                    len += chunk.length;
                }
                return ReturnResult(data.toString());
            });
        });
        request.on('error', reject);
        request.on('timeout', () => reject('Request timeout.'));
        request.end(data);
    });
};