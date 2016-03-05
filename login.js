var http = require('http')
var url = require('url')
var mysql = require('mysql')

var client = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: 'root',
})
client.connect()

function login(args, req, res){

	var db = 'exchange'
	
	var sql = ''
	console.log(args)
	for (var arg in args) {
		if (sql == '') {
			sql += 'select * from users where '+"(username='" + args[arg] +"' "+"or phonenumber='" + args[arg] +"' "+" or email='" + args[arg] +"') "	
		}else {
			sql += 'and ' + arg + "='" + args[arg] + "' "
		}
	}
	console.log(sql)
	client.query("use " + db)
	client.query(sql, function (err, results, fields) {
		if (err) {
			console.log(err)
		}
		if (results.length!=0) {
			var dict = {login:'true'}
			res.end(JSON.stringify(dict))
		}else {
			var dict = {login:'false'}
			res.end(JSON.stringify(dict))
		}
	})
}
exports.login = login