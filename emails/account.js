const sgMail = require('@sendgrid/mail');
const key = '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'
sgMail.setApiKey(key);


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'danialarshad02@gmail.com', // cannot use any other email(otherwise, it will throw error)...If want to use another email, first register that email at sendGridMail
        subject: 'Welcome to myBlogger',
        text: `Hi ${name}, Hope you have a great journey with myBlogger`
    }).then(() => {
        console.log('worked!')
    }).catch((error) => {
        console.log(error)
    })
}

module.exports = {
    sendWelcomeEmail
}