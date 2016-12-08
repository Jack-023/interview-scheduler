'use strict';

const aws = require('aws-sdk'); // eslint-disable-line
const config = require('../config.json'); // eslint-disable-line
const docClient = new aws.DynamoDB.DocumentClient();

module.exports = () => {
    return {
        sendMessage: (data) => {
          console.log(data);
          console.log(config);
            if (data.Item) {
                const twilioClient = new twilio.RestClient(config.twilio.accountSid, config.twilio.authToken);
                var message = "TEST MESSAGE";
                return new Promise((res, rej) => twilioClient.messages.create({
                    body: message,
                    to: "+61" + /\d+/.exec(data.Item.candidatePhNo)[0].substring(1),
                    from: "+61 439 249 641"
                }, function (err, message) {
                    if (err)
                        rej(err);
                    else
                        res(message);
                }));
            }
        }
    };
};
