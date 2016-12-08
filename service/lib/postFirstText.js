'use strict';

const aws = require('aws-sdk'); //eslint-disable-line
const moment = require('moment-timezone');

moment.tz.setDefault('Australia/Victoria');

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
                        const date = moment(data.Item.interviewTime).format('dddd, MMMM Do YYYY');
                        const time = moment(data.Item.interviewTime).format('hh:mm');
                        console.log(data);
                        const message = `Hi ${data.Item.candidateName}, you have an interview with ${data.Item.advertiserName} from ${data.Item.advertiserCompany} on`
                        + ` ${date} at ${time}. Please ring ${data.Item.advertiserPhNo} if you cannot attend or want to reschedule your interview.`

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
