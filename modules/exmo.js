
    const cryptojs = require ('crypto-js')
    const querystring = require ('querystring')
    const request = require ('request')

    var config = require ('./config')
    var setup = config.exmo
    var nonce = Math.floor (new Date ().getTime ())

    exports.query = (name, params, callback) => {
	params.nonce = nonce++
	request ({
	    url: setup.url + name,
	    method: 'POST',
	    headers: {
		'Key': setup.key,
		'Sign': cryptojs.HmacSHA512 (querystring.stringify (params), setup.secret).toString (cryptojs.enc.hex)
	    },
	    form: params
	}, (error, response, body) => {
	    if (error) {
		if (config.debug) {
		    console.log (error)
		} else {
		    console.log ('error')
		}
	    } else {
		callback (JSON.parse (body))
	    }
	})
    }