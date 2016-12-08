'use strict';

const aws = require('aws-sdk'); //eslint-disable-line
const moment = require('moment-timezone');
const storageService = require('../lib/storageService');

const docClient = new aws.DynamoDB.DocumentClient();
const twilio = require('../lib/twilioService');

module.exports.sendReminder = (data, context, callback) => {
    const payload = JSON.parse(data.body);

    if (!payload.interviewId) {
        callback(null, {
            statusCode: 500
        });
    } else {
        console.log('start');
        return new Promise((resolve, reject) => {
            const param = {
                TableName: 'interview-scheduler-interview-data',
                ConsistentRead: true,
                Key: {
                    interviewId: payload.interviewId
                }
            };
            docClient.get(param, (err, data) => {
                if (err) {
                    console.log(JSON.stringify(err, null, 2));
                    reject(err);
                }
                if (!data.Item.interviewTime) {
                    console.log('no time found.');
                    reject('notime');
                }
                else { // eslint-disable-line
                    if (data.Item.responseStatus === 'notSent') {
                        const sS = storageService();
                        const status = 'noResponse';
                        sS.setResponseStatus(payload.interviewId, status).then(() => {
                            callback(null, {
                                statusCode: 200
                            });
                        }).catch((err) => {
                            console.log(err);
                            callback(null, {
                                statusCode: 500
                            });
                        });
                        const ts = twilio();
                        console.log(data);
                        const date = moment(data.Item.interviewTime).tz('Australia/Sydney').format('dddd, MMMM Do YYYY');
                        const time = moment(data.Item.interviewTime).tz('Australia/Sydney').format('h:mma');
                        console.log(date, time);
                        const message = `${data.Item.candidateName}, you have an interview with ${data.Item.advertiserName} from ${data.Item.advertiserCompany}`
                            + ` on ${date} at ${time}. Can you confirm that still works for you? A YES or NO will do! Please ring ${data.Item.advertiserPhNo} if`
                            + ' you cannot attend or want to reschedule your interview.';

                        ts.sendMessage(data.Item.candidatePhNo, message).then((resp) => {
                            console.log(resp);
                            resolve();
                        }).catch((error) => {
                            console.log(error);
                            reject(error);
                        });
                    }
                    else{
                        callback(null, {
                            statusCode: 200
                        });
                    }
                }
            });
        });
    }
};
