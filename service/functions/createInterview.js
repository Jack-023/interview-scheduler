'use strict';

const storageService = require('../lib/storageService');
// This file recieves candidate data and saves it in the DynamoDB

module.exports.createInterview = (data, context, callback) => {

    const payload = JSON.parse(data.body);

    if (!payload.candidateName || !payload.candidatePhNo) {
        callback(null, {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: 'Internal Server Error.'
        });
    }

    const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3|0x8); //eslint-disable-line
        return v.toString(16);
    });

    let currentRole;
    let email;

    if (payload.candidateCurrentRole) {
        currentRole = payload.candidateCurrentRole;
    }

    if (payload.candidateEmail) {
        email = payload.candidateEmail;
    }

    const interview = {
        interviewId: guid,
        advertiserName: 'Rocky',
        advertiserCompany: 'SEEK',
        advertiserPhNo: '0401 679 423',
        postionName: 'Barista',
        candidatePhNo: payload.candidatePhNo,
        candidateName: payload.candidateName,
        candidateEmail: email,
        responseStatus: 'notSent',
        sendReminder: 'no',
        interviewOrTrial: 'interview'
    };

    if (currentRole) {
        interview.candidateCurrentRole = currentRole;
    }

    const sS = storageService();
    sS.addInterview(interview).then(() => {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: 'OK'
            }),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    }).catch((err) => {
        console.log(err);
        callback(null, {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: 'Internal Server Error.'
        });
    });
};
