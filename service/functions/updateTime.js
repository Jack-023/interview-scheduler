'use strict';

const storageService = require('../lib/storageService');

module.exports.setTime = (data, context, callback) => {

    const payload = JSON.parse(data.body);

    if (!payload.candidateId || !payload.interviewTime) {
        callback(null, {
            statusCode: 500
        });
    } else {
        const sS = storageService();
        sS.setTime(payload.candidateId, payload.interviewTime).then(() => {
            callback(null, {
                statusCode: 200
            });
        }).catch((err) => {
            console.log(err);
            callback(null, {
                statusCode: 500
            });
        });
    }
};
