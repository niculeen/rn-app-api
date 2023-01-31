const path = require("path");
const url = require("url")
const streamifier = require('streamifier');
const crypto = require('crypto');
const AWS = require("./aws")
const s3 = new AWS.S3();
module.exports = (req) => new Promise((resolve, reject) => {
    const dist = req.body.dist ? req.body.dist : "uploads"
    console.log(req.body)
    if (req.body.old_file) {
        const old_key = url.parse(req.body.old_file).pathname.substring(1);
        s3.deleteObject({
            Key: old_key,
            Bucket: process.env.AWS_BUCKET_NAME,
        }).promise()
    }
    const fileStream = streamifier.createReadStream(req.files[0].buffer)
    const fileInfo = path.parse(req.files[0].originalname)
    const key = path.join(dist,
        crypto.createHash('md5')
            .update(fileInfo.name.replace(/ /ig, "_"))
            .digest("hex")
        + "_" + (new Date().getTime()) + fileInfo.ext);


    s3.upload({
        Body: fileStream,
        Key: key,
        Bucket: process.env.AWS_BUCKET_NAME,
        Metadata: { "Content-Type": req.files[0].mimetype },
    }).promise().then(data => {
        resolve({ message: "SUCCESS: Uploaded!", url: data.Location });
    })
    /*
    return;
    // const form = new IncomingForm({ multiples: true }); //instance of formidable
    form.parse(req, async function (err, fields, files) {
        console.log(err, fields)
        console.log(Object.keys(files))
        if (fields.old_file) {
            const old_key = url.parse(fields.old_file).pathname.substring(1);
            s3.deleteObject({
                Key: old_key,
                Bucket: process.env.AWS_BUCKET_NAME,
            }).promise()
        }
        const dist = fields.dist ? fields.dist : "uploads"
        try {
            const fileField = Object.keys(files).pop()
            const key = path.join(dist, path.basename(files[fileField].originalFilename).replace(/ /ig, "_") + "_" + files[fileField].newFilename);

            const fileStream = fs.createReadStream(files[fileField].filepath)

            s3.upload({
                Body: fileStream,
                Key: key,
                Bucket: process.env.AWS_BUCKET_NAME,
                Metadata: { "Content-Type": files[fileField].mimetype },
            }).promise().then(data => {
                resolve({ message: "Successfully uploaded!", url: data.Location });
            })
        } catch (error) {
            reject(error)
        }
    });*/
});