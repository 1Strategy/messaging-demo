var AWS = require('aws-sdk');
var async = require('async');
var uuid = require('uuid');

AWS.config.region = 'us-west-2';
var sqs = new AWS.SQS();
var queueUrl = 'FIFO_QUEUE_URL_GOES_HERE';
var i = 1;
var messageGroupId = (process.env.GROUP ? process.env.GROUP : uuid.v4());

console.log('Message Group ID: ' + messageGroupId);

//loop forever
async.forever(
    function(next) {
        var params = {
            QueueUrl: queueUrl,
            MessageBody: i.toString(),
            MessageAttributes: {
                'AddedBy': {
                    DataType: 'String',
                    StringValue: 'ME'
                }
            },

            //FIFO-specific:
            MessageGroupId: messageGroupId,
            //MessageDeduplicationId: i.toString(),
            MessageDeduplicationId: uuid.v4() //helpful when demo uses multiple clients that send the same numbers
        };

        sqs.sendMessage(params, function(err, data) {
            //success
            if(!err) {
                /*
                data = {
                    MD5OfMessageAttributes: '00484c68...59e48f06',
                    MD5OfMessageBody: '51b0a325...39163aa0',
                    MessageId: 'da68f62c-0c07-4bee-bf5f-7e856EXAMPLE'
                }
                */
                console.log('Sent: ' + i);
                i++;

                //send another one
                next();
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
