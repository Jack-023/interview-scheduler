'use strict';

const aws = require('aws-sdk'); //eslint-disable-line
const moment = require('moment-timezone');

const docClient = new aws.DynamoDB.DocumentClient();
const twilio = require('../lib/twilioService');

module.exports = () => {
    return {
        postFirstText: (id) => {
            console.log('start');
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
                        console.log(data);
                        const date = moment(data.Item.interviewTime).tz('Australia/Sydney').format('dddd, MMMM Do YYYY');
                        const time = moment(data.Item.interviewTime).tz('Australia/Sydney').format('h:mma');
                        console.log(data);
                        const message = `INTERVIEW CONFIRMED. Hi ${data.Item.candidateName}, your `
                        + `interview with ${data.Item.advertiserName} at ${data.Item.advertiserCompany}`
                        + ` for ${data.Item.postionName}`
                        + ` is confirmed for ${date} at ${time}. Please call ${data.Item.advertiserPhNo} if you have any questions.`
                        + ` We look forward to seeing you then.`;

                        ts.sendMessage(data.Item.candidatePhNo, message).then((resp) => {
                            console.log(resp);
                            resolve();
                        }).catch((error) => {
                            console.log(error);
                            reject(error);
                        });
                    }
                });
            });
        }
    };
};
