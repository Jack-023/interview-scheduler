'use strict';

const aws = require('aws-sdk'); // eslint-disable-line
const config = require('../config'); // eslint-disable-line
const twilio = require('twilio'); // eslint-disable-line

module.exports = () => {
    return {
        sendMessage: (to, message) => {
            console.log(config);
            if (to && message) {
                const twilioClient = new twilio.RestClient(config.twilio.accountSid, config.twilio.authToken);
                return new Promise((res, rej) => twilioClient.messages.create({
                    body: message,
                    to: "+61" + /\d+/.exec(to)[0].substring(1),
                    from: '61439249641'
                }, (err, resp) => {
                    if (err) {
                        rej(err);
                    }
                    else {
                        res(resp);
                    }
                }));
            }
        }
    };
};
