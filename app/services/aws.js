const AWS = require('aws-sdk');
// Set the Region 
AWS.config.update({ region: 'us-west-2' });

AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
    bucketname: process.env.AWS_BUCKET_NAME,
});

module.exports = AWS