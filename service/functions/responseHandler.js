'use strict';

const storageService = require('../lib/storageService');

module.exports.responseHandler = (data, context, callback) => {

    let from = data.body.match(/From=%2B\d{11}/)[0]; // from number without the + eg 61XXXXXXXXX
    from = '0' + from.slice(10);
    let resp = data.body.match(/Body=\w*/)[0];
    resp = resp.slice(5).toLowerCase();

    const sS = storageService();

    if (resp !== 'yes' && resp !== 'no') {
        callback(null, {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    } else {
        if (resp === 'yes') {
            resp = 'accepted';
        } else {
            resp = 'declined';
        }
        sS.updateResponse(from, resp).then(() => {
            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
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
