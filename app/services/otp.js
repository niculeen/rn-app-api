const otpGenerator = require('otp-generator')

const generateOTP = function (len = 4) {
    return otpGenerator.generate(len, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
}


module.exports = {
    generateOTP
}