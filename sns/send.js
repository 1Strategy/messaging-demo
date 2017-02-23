var AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
var sns = new AWS.SNS();

var params = {
    TopicArn: 'SNS_TOPIC_ARN_GOES_HERE',
    Message: 'Messages goes here.'
};

sns.publish(params, function(err, data) {
    if(!err) {
        /*
        data = {
            MessageId: 'da68f62c-0c07-4bee-bf5f-7e856EXAMPLE'
        }
        */
        console.log(data.MessageId);
    }
    else {
        //err
        console.log(err, err.stack);
    }
});
