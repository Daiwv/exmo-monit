
    const moment = require ('moment')
    const ejs = require ('ejs')
    const math = require('mathjs')
    const schedule = require ('node-schedule')

    var config = require ('./config')

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

    var exicute = () => {
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
			    let quantity = user_info[type][curr]
			    let amount = 0
			    if (quantity > 0) {
				if (curr == config.currency) {
				    amount = quantity
				} else if (curr == 'RUB') {
				    amount = quantity * ticker['USD_RUB'].buy_price
				} else if (curr == 'KICK') {
				    amount = (quantity * ticker['KICK_BTC'].buy_price) * ticker['BTC_USD'].buy_price
				} else {
				    if (ticker[curr + '_' + config.currency]) {
					amount = quantity * ticker[curr + '_' + config.currency].buy_price
				    }
				}
				amount = math.round (amount, 5)
				amounts[type].push (amount)
				currencys[type].push (curr)
				volumes[type].push (quantity)
				balance += amount
			    }
			}
		    }
		}
		balance = math.round (balance, 2)
		if (config.debug) {
		    console.log ('currencys\n', currencys)
		    console.log ('amounts\n', amounts)
		    console.log ('volumes\n', volumes)
		    console.log ('balance\n', balance)
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
    }

    if (!config.debug) {
	var job = schedule.scheduleJob (config.mail.time, () => {exicute ()})
    } else {
	exicute ()
    }