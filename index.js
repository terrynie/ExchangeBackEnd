var http = require('http')
var url = require('url')
var exchange = require('./exchange')
var login = require('./login')
var signup = require('./signup')
var router = require('./router')
var queryByBank = require('./queryByBank')
var queryByCurrency = require('./queryByCurrency')
var mysql = require('mysql')

var client = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: 'root',
})
client.connect()

var handle = {}
handle['/'] = login.login
handle['/exchange'] = exchange.queryLastReleaseDate
handle['/signup'] = signup.signup
handle['/queryByBank'] = queryByBank.queryByBank
handle['/queryByCurrency'] = queryByCurrency.queryByCurrency

http.createServer(function(req, res) {
	
	var path = url.parse(req.url).pathname
	var args = url.parse(req.url, true).query
	router.router(handle, path, args, req, res, client)
	// exchange.queryLastReleaseDate(args, req, res)
	
}).listen(8000)

