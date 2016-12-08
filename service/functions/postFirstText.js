const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const twilio = require("../lib/twilioService");

module.exports = () => {
    return {
        getAllInterviewList: (id)=> {
            var param = {
                TableName: `interview-scheduler-interview-data`,
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
                else {
                    const ts = twilio();
                    ts.sendMessage(data);
                    resolve();
                }
            });
        }
    };
    // const response = {
    //   statusCode: 200,
    //   body: JSON.stringify({
    //     message: 'You have reached the interview scheduler backend.',
    //     input: event,
    //   }),
    // };
    //
    // callback(null, response);

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
