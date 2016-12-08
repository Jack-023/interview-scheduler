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
          }
        });
      });
    }
  };
};
