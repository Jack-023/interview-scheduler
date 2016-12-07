'use strict';

const storageService = require('../lib/storageService');

module.exports.getAllInterviewList = (payload, context, callback) => {

    storageService.getAllInterviewList().then((response) => {
        callback(null, {
            statusCode: 200,
            body: response
        });
    }).catch((err) => {
        console.log(JSON.stringify(err));
        callback(null, {
            statusCode: 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Internal Server Error.'
        });
    });
};
