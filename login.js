var http = require('http')
var url = require('url')

function login(args, req, res, client){

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
	client.query("use " + db)
	client.query(sql, function (err, results, fields) {
		if (err) {
			console.log(err)
		}
		if (results.toString() != [].toString()) {
			var dict = {login:'true'}
			res.end(JSON.stringify(dict))
		}else {
			var dict = {login:'false'}
			res.end(JSON.stringify(dict))
		}
	})
}
exports.login = login