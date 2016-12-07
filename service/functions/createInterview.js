'use strict';

const storageService = require('../lib/storageService');
// This file recieves candidate data and saves it in the DynamoDB

module.exports.createInterview = (data, context, callback) => {

    const payload = JSON.parse(data);

    if (!payload.candidateName || !payload.candidatePhNo) {
        callback(null, {
            statusCode: 500,
            headers: { 'Content-Type': 'text/plain' },
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
    } else {
        currentRole = null;
    }

    if (payload.candidateEmail) {
        email = payload.candidateEmail;
    } else {
        email = null;
    }

    const interview = {
        interviewId: guid,
        advertiserPhNo: null,
        advertiserName: 'SEEK',
        advertiserCompany: 'Seek',
        postionName: 'Barista',
        candidatePhNo: payload.candidatePhNo,
        candidateName: payload.candidateName,
        candidateEmail: email,
        candidateCurrentRole: currentRole,
        interviewTime: null,
        responseStatus: 'notSent',
        advertiserEmail: null,
        sendReminder: 'no',
        interviewOrTrial: 'interview'
    };


    storageService.addInterview(interview).then(() => {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: 'OK'
            })
        });
    }).catch((err) => {
        console.log(err);
        callback(null, {
            statusCode: 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Internal Server Error.'
        });
    });
};