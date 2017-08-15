/*
Notes:
-Any error will result in termination. Implement additional retry logic if needed.
*/

var AWS = require('aws-sdk');
var async = require('async');

AWS.config.region = 'us-west-2';
var sqs = new AWS.SQS();
var queueUrl = 'https://sqs.us-west-2.amazonaws.com/842337631775/andrew';

//loop forever
async.forever(
    function(next) {
        var params = {
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 10,
            AttributeNames: [
                'All'
            ],
            MessageAttributeNames: [
                'All'
            ]
        };

        sqs.receiveMessage(params, function(err, data) {
            //success
            if(!err) {
                /*
                data = {
                    Messages: [{
                        MessageId: 'd6790f8d-d575-4f01-bc51-40122EXAMPLE',
                        Body: '1',
                        MessageAttributes: {},
                        Attributes: {},
                        ReceiptHandle: 'AQEBzbVv...fqNzFw=='
                    }]
                }
                */

                //found some messages
                if(data.Messages) {
                    console.log('--' + data.Messages.length + ' Messages Received--');

                    async.eachSeries(data.Messages, function(message, callback) {
                        console.log('Received: ' + message.Body);

                        params = {
                            QueueUrl: queueUrl,
                            ReceiptHandle: message.ReceiptHandle
                        };

                        sqs.deleteMessage(params, callback);
                    }, next);
                }
                //didn't find any messages
                else {
                    //try again
                    next();
                }
            }
            //error
            else {
                next(err);
            }
        });
    },
    //an error occurred
    function(err) {
        console.log(err, err.stack);
    }
);
