const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = () => {
  return {
    getAllInterviewList: ()=> {
      docClient.scan({TableName: "interview-scheduler-interview-data"}, (err, data) => {
        if (err)
          console.log(JSON.stringify(err, null, 2));
        else
          return JSON.stringify(data);
      });
    }
  }
};
