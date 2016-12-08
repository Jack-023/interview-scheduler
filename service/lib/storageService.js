'use strict';

const aws = require('aws-sdk'); // eslint-disable-line
const twilioService = require('../lib/twilioService'); // eslint-disable-line
const docClient = new aws.DynamoDB.DocumentClient();

module.exports = () => {
    return {
        addInterview: (interview) => {
            const params = {
                TableName: 'interview-scheduler-interview-data',
                Item: interview
            };
            return new Promise((resolve, reject) => {
                docClient.put(params, (err) => {
                    if (err) {
                        console.error('Failed to write event to DynamoDB.', err);
                        reject(err);
                    } else {
                        console.log('Successfully added the new interview to the DynamoDB.');
                        resolve();
                    }
                });
            });
        },
        getAllInterviewList: () => {
            const params = {
                TableName: 'interview-scheduler-interview-data',
            };
            return new Promise((resolve, reject) => {
                docClient.scan(params, (err, data) => {
                    if (err) {
                        console.log('Failed to read from DynamoDB.');
                        reject(err);
                    }
                    else { //eslint-disable-line
                        resolve(JSON.stringify(data));
                    }
                });
            });
        },
        sendFirstText: (interviewId) => {
          const ts = twilioService();
            const params = {
                TableName: `interview-scheduler-interview-data`,
                ConsistentRead: true,
                Key: {
                    interviewId: interviewId
                }
            };
            return new Promise((resolve, reject) => {
                docClient.get(params, (err, data) => {
                    if (err) {
                        console.log('Failed to read from DynamoDB.');
                        reject(err);
                    }
                    else { //eslint-disable-line
                      ts.sendMessage(data);
                        resolve();
                    }
                });
            });
        }
    };
};
