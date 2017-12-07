
    const moment = require ('moment')
    const ejs = require ('ejs')
    const math = require('mathjs')
    const schedule = require ('node-schedule')

    var config = require ('./modules/config')

    const exmo = require ('./modules/exmo')
    const mail = require ('./modules/mail')

    var template = (data) => {
	ejs.renderFile ('./template.ejs', data, (error, message) => {
	    if (config.debug) {
		if (error) {
		    console.log (error)
		} else {
		    console.log (message)
		}
	    }
	    mail.send (config.mail.subscribers, {
		subject: 'balance: ' + data.balance,
		html: message
	    })
	})
    }

    var job = schedule.scheduleJob (config.mail.time, () => {
	exmo.query ('user_info', {}, (user_info) => {
	    if (config.debug) {
		//console.log ('result:\n', user_info)
	    }
	    let uid = user_info.uid
	    let date = moment.unix (user_info.server_date).format ('Y.MM.DD')
	    let time = moment.unix (user_info.server_date).format ('hh:mm')
	    exmo.query ('ticker', {}, (ticker) => {
		if (config.debug) {
		    //console.log ('result:\n', ticker)
		}
		let balance = 0
		let types = []
		let currencys = []
		let amounts = []
		let volumes = []
		for (type in user_info) {
		    if (typeof user_info[type] == 'object') {
			types.push (type)
			currencys[type] = []
			amounts[type] = []
			volumes[type] = []
			for (curr in user_info[type]) {
			    if (curr != 'USD' && curr != 'RUB' && user_info[type][curr] > 0) {
				currencys[type].push (curr)
				amounts[type].push (math.round ((user_info[type][curr] * ticker[curr + '_' + config.currency].buy_price), 2))
				volumes[type].push (user_info[type][curr])
				balance += user_info[type][curr] * ticker[curr + '_' + config.currency].buy_price
			    }
			}
		    }
		}
		if (config.debug) {
		    console.log (currencys, amounts, volumes, balance)
		}
		template ({
		    title: {uid: uid, date: date, time: time},
		    type: types,
		    header: ['currency', 'volume', 'amount'],
		    content: {currency: currencys, volume: volumes, amount: amounts},
		    balance: math.round (balance, 2) + ' ' + config.currency
		})
	    })
	})
	console.log ('exicute:', moment ().format ('hh:mm:ss'))
    })