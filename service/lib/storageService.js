'use strict';

const aws = require('aws-sdk'); // eslint-disable-line
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
        }
    };
};
