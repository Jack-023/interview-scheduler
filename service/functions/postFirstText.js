'use strict';

const aws = require("aws-sdk"); //eslint-disable-line

const docClient = new aws.DynamoDB.DocumentClient();
const twilio = require('../lib/twilioService');

module.exports.postFirstText = (id) => {
    return new Promise((resolve, reject) => {
        const param = {
            TableName: 'interview-scheduler-interview-data',
            ConsistentRead: true,
            Key: {
                interviewId: id
            }
        };
        docClient.get(param, (err, data) => {
            if (err) {
                console.log(JSON.stringify(err, null, 2));
                reject(err);
            }
            else { // eslint-disable-line
                const ts = twilio();
                ts.sendMessage(data).then((message) => {
                    console.log(message);
                    resolve();
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                });
            }
        });
    });
};
