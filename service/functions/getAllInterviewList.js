var AWS = require("aws-sdk");

module.exports.getAllInterviewList = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();
  docClient.scan({TableName: "Music"}, function(err, data) {
    if (err)
      console.log(JSON.stringify(err, null, 2));
    else
      console.log(JSON.stringify(data, null, 2));
  });
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
