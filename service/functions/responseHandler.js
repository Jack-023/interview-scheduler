'use strict';

module.exports.responseHandler = (data, context, callback) => {
    console.log(data);
    callback(null, {
        statusCode: 200
    });
};
