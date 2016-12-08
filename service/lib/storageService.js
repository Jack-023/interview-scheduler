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
        },
        getAllInterviewList: () => {
            const params = {
                TableName: 'interview-scheduler-interview-data'
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
        setTime: (id, time) => {
            const params = {
                TableName: 'interview-scheduler-interview-data',
                Key: {
                    interviewId: id
                },
                UpdateExpression: 'set interviewTime =:interviewTime, responseStatus =:responseStatus',
                ExpressionAttributeValues: {
                    ':interviewTime': time,
                    ':responseStatus': 'notSent'
                },
                ReturnValues: 'UPDATED_NEW'
            };
            console.log(params);
            return new Promise((resolve, reject) => {
                docClient.update(params, (err, data) => { //eslint-disable-line
                    if (err) {
                        console.log('Error updating time');
                        reject(err);
                    } else {
                        console.log(data);
                        resolve();
                    }
                });
            });
        },
        setResponseStatus: (interviewId, status) => {
            const params = {
                TableName: 'interview-scheduler-interview-data',
                Key: {
                    interviewId
                },
                UpdateExpression: 'set responseStatus =:responseStatus',
                ExpressionAttributeValues: {
                    ':responseStatus': status
                },
                ReturnValues: 'UPDATED_NEW'
            };
            console.log(params);
            return new Promise((resolve, reject) => {
                docClient.update(params, (err, data) => { //eslint-disable-line
                    if (err) {
                        console.log('Error updating time');
                        reject(err);
                    } else {
                        console.log(data);
                        resolve();
                    }
                });
            });
        },
        updateResponse: (candidatePhNo, status) => {
            return new Promise((resolve, reject) => {
                console.log(candidatePhNo);
                const params = {
                    TableName: 'interview-scheduler-interview-data',
                    FilterExpression: 'candidatePhNo= :candidatePhNo',
                    ExpressionAttributeValues: {
                        ':candidatePhNo': candidatePhNo
                    }
                };
                docClient.scan(params, (err, data) => {
                    if (err) {
                        console.log('Failed to read from DynamoDB.');
                        reject(err);
                    }
                    else { //eslint-disable-line
                        console.log(data);
                        const params2 = {
                            TableName: 'interview-scheduler-interview-data',
                            Key: {
                                interviewId: data.Items[0].interviewId
                            },
                            UpdateExpression: 'set responseStatus =:responseStatus',
                            ExpressionAttributeValues: {
                                ':responseStatus': status
                            },
                            ReturnValues: 'UPDATED_NEW'
                        };
                        console.log(params2);
                        new Promise((res, rej) => {
                            docClient.update(params2, (error, data) => { //eslint-disable-line
                                if (error) {
                                    console.log('Error updating status');
                                    console.log(error);
                                    rej(error);
                                } else {
                                    console.log(data);
                                    res();
                                }
                            });
                        }).then(() => {
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
