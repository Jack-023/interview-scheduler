'use strict';

const storageService = require('../lib/storageService');
const sS = storageService();

module.exports.getAllInterviewList = (payload, context, callback) => {

    sS.getAllInterviewList().then((response) => {
        callback(null, {
            statusCode: 200,
            body: response,
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    }).catch((err) => {
        console.log(JSON.stringify(err));
        callback(null, {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: 'Internal Server Error.'
        });
    });
};
