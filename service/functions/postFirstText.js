'use strict';
const aws = require("aws-sdk");
const docClient = new aws.DynamoDB.DocumentClient();
const twilio = require("../lib/twilioService");

module.exports.postFirstText = (data, context, callback)=> {
    const payload = JSON.parse(data.body);
    if (!payload.id) {
        callback(null, {
            statusCode: 500
        });
    } else {
        var param = {
            TableName: `interview-scheduler-interview-data`,
            ConsistentRead: true,
            Key: {
                interviewId: payload.id
            }
        };
        docClient.get(param, (err, data) => {
            if (err) {
                console.log(JSON.stringify(err, null, 2));
                reject(err);
            }
            else {
                const ts = twilio();
                ts.sendMessage(data);
                resolve();
            }
        });
    }
};
