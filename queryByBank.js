var http = require('http')
var url = require('url')

function queryByBank(args, req, res, client) {
	var db = 'exchange'
	var data = {}

	var sql = ''

	for (var arg in args) {
		sql = 'select * from exchange_rate where ' + arg + "='" + args[arg]+"' and (flag = 1 or flag=0)"
	}

	client.query("use "+db)
	client.query(sql, function (err, results, fields){
		if (err) {
			console.log(err)
		}
		if (results) {
			data['now'] = {}
			data['last'] = {}
			for (var i = 0; i < results.length; i++) {
				var dict = {}
				if (results[i].flag==1) {
					dict['bank'] = results[i].bank
					dict['currency'] = results[i].currency
					dict['lastReleaseDate'] = results[i].lastReleaseDate
					dict['lastReleaseTime'] = results[i].lastReleaseTime
					dict['remittanceBuyPrice'] = results[i].remittanceBuyPrice //汇买价
					dict['cashBuyPrice'] = results[i].cashBuyPrice //钞买价
					dict['sellPrice'] = results[i].sellPrice //卖出价
					dict['cenPrice'] = results[i].cenPrice   //中间价
					data['now'][results[i].currency] = dict
				}else {
					dict['bank'] = results[i].bank
					dict['currency'] = results[i].currency
					dict['lastReleaseDate'] = results[i].lastReleaseDate
					dict['lastReleaseTime'] = results[i].lastReleaseTime
					dict['remittanceBuyPrice'] = results[i].remittanceBuyPrice //汇买价
					dict['cashBuyPrice'] = results[i].cashBuyPrice //钞买价
					dict['sellPrice'] = results[i].sellPrice //卖出价
					dict['cenPrice'] = results[i].cenPrice   //中间价
					data['last'][results[i].currency] = dict
				}
			}
			for (var result in results) {
				
			}
		}
		res.writeHead(200, {'Content-Type': 'application/json'})
		res.end(JSON.stringify(data))
	})
}

exports.queryByBank = queryByBank