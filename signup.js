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

function signup(args, req, res){
	var username = ''
	var phonenumber = ''
	var email = ''
	var password = ''
	var date = ''
	var sql1 = ''
	
	for (var arg in args) {
		if (arg=='username') {
			username = args[arg]
			sql1 = "select * from users where username='"+username+"' "
		}else if (arg=='phonenumber') {
			if (args[arg]!='') {
				phonenumber = args[arg]
				sql1 += "or phonenumber='"+phonenumber+"' "
				// sql2 = "select * from users where phonenumber='"+phonenumber+"' "
			}
		}else if (arg=='email') {
			if (args[arg]!='') {
				email = args[arg]
				sql1 += "or email='"+email+"' "
				// sql3 = "select * from users where email='"+email+"' "
			}
		}else if (arg=='password') {
			password = args[arg]
		}
	}

	var today = new Date()
	date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()

	var db = 'exchange'
	var sql = 'insert into users (id,username,phonenumber,email,password,date) values('+"'"+'123456789'+"', '"+username+"', '"+phonenumber+"', '"+email+"', '"+password+"', '"+date+"')"
	

	client.query("use " + db)
	console.log(sql1)
	client.query(sql1, function(err, results, fields){
		if (err) {
			console.log(err)
		}
		if (results.toString() != [].toString()) {
			console.log(results)
			var dict = {}
			for (var i = 0; i <= results.length - 1; i++) {
				if (results[i].username == username) {
					dict['username'] = 'false'
				}
				if (results[i].phonenumber == phonenumber && phonenumber != '') {
					dict['phonenumber'] = 'false'
				}
				if (results[i].email == email && email != '') {
					dict['email'] = 'false'
				}
			}
			res.end(JSON.stringify({'false':dict}))
		}else{

			/**
			 * 注册成功并返回信息
			 * @param  {[type]} err     [数据库操作错误]
			 * @param  {[type]} results [数据库操作的结果集]
			 * @param  {匿名函数} 
			 * @return {[type]}         [如果注册成功，返回{signup:'true'},否则返回{sign:'false'}]
			 */
			client.query(sql, function (err, results, fields) {
				if (err) {
					console.log(err)
				}
				if (results) {
					var dict = {signup:'true'}
					res.end(JSON.stringify(dict))
				}else {
					var dict = {signup:'false'}
					res.end(JSON.stringify(dict))
				}
			})
		}
	})
}
exports.signup = signup