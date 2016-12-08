'use strict';

const aws = require('aws-sdk'); //eslint-disable-line
const moment = require('moment');

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
                const date = moment(data.item.interviewTime).tz('AEDT').format('dddd, MMMM Do YYYY');
                const time = moment(data.item.interviewTime).tz('AEDT').format('hh:mm');
                console.log(data);
                const message = `${data.item.candidateName}, you have an interview with ${data.item.advertiserName} from ${data.item.advertiserCompany}`
                + ` on ${date} at ${time}. Can you confirm that still works for you? A YES or NO will do! Please ring ${data.item.advertiserPhNo} if`
                + ' you cannot attend or want to reschedule your interview.';

                ts.sendMessage(data.item.candidatePhNo, message).then((resp) => {
                    console.log(resp);
                    resolve();
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                });
            }
        });
    });
};
