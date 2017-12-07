
    var config = require ('./../config')

    const nodemailer = require ('nodemailer')

    var transporter = nodemailer.createTransport ({
	service: config.mail.server,
	auth: {
	    user: config.mail.user,
	    pass: config.mail.password,
	}
    })

    var mail = {
	post: (email, params) => {
	    let message = {
		from: config.mail.from,
		to: email,
		subject: params.subject,
		text: params.text,
		html: params.html
	    }
	    if (config.debug) {
		console.log ('test:\n', message)
	    }
	    if (!config.debug) {
		transporter.sendMail (message, (error, result) => {
		    console.log ('result:\n', (error) ? error : result )
		    transporter.close()
		})
	    }
	},
	send: (emails, params) => {
	    if (config.debug) {
		console.log ('sender:', ((config.debug === false) ? 'on' : 'off'))
	    }
	    emails.forEach ((email, i, emails) => {
		mail.post (email, params)
	    })
	}
    }

    module.exports = mail