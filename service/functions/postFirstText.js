const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const twilio = require("twilio");
const config = require("config");

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
        }
        else {
          if (data.Item) {
            const twilioClient = new twilio.RestClient(config.twilio.accountSid, config.twilio.authToken, { host: config.twilio.host });
            var message = "";
            return new Promise((resolve, reject) => twilioClient.messages.create({
              body: message,
              to: "+61" + /\d+/.exec(data.Item.candidatePhNo)[0].substring(1),
              from: "+61 439 249 641"
            }, function (err, message) {
              if (err)
                reject(err);
              else
                resolve(message);
            }));
          }
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
