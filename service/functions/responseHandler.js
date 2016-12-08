'use strict';

module.exports.responseHandler = (data, context, callback) => {
    console.log(data.body);
    callback(null, {
        statusCode: 200
    });
};
