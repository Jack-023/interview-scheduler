'use strict';

const storageService = require('../lib/storageService');

const messenger = require('./postFirstText');

module.exports.setTime = (data, context, callback) => {

    const payload = JSON.parse(data.body);

    if (!payload.interviewId || !payload.interviewTime) {
        callback(null, {
            statusCode: 500
        });
    } else {
        const sS = storageService();
        sS.setTime(payload.interviewId, payload.interviewTime).then(() => {
            messenger.postFirstText(payload.interviewId).then(() => {
                callback(null, {
                    statusCode: 200
                });
            }).catch((err) => {
                console.log(err);
                callback(null, {
                    statusCode: 500
                });
            });
        }).catch((err) => {
            console.log(err);
            callback(null, {
                statusCode: 500
            });
        });
    }
};
