'use strict';

const storageService = require('../lib/storageService');

const pft = require('../lib/postFirstText');

const messenger = pft();

module.exports.setTime = (data, context, callback) => {

    const payload = JSON.parse(data.body);

    if (!payload.interviewId || !payload.interviewTime) {
        callback(null, {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    } else {
        const sS = storageService();
        sS.setTime(payload.interviewId, payload.interviewTime).then(() => {
            console.log(payload.interviewId);
            messenger.postFirstText(payload.interviewId).then(() => {
                callback(null, {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }).catch((err) => {
                console.log('couldnt send msg', err);
                callback(null, {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            });
        }).catch((err) => {
            console.log(err);
            callback(null, {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
        });
    }
};
