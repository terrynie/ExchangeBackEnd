var http = require('http')
var url = require('url')

/**
 * 获取指定银行、指定货币最新更新时间
 * @param  {String} args 参数字典
 * @return {String}      最后的更新时间
 */
function queryLastReleaseDate(args, req, res, client){

	var db = 'exchange'
	var record = {}
	var lastUpdateDate = ''
	var lastUpdateTime = ''
	
	var sql = ''
	for (var arg in args) {
		if (sql == '') {
			record[arg] = args[arg]
			sql += 'select * from updateTime where ' + arg + "='" + args[arg] +"' "
		}else {
			record[arg] = args[arg]
			sql += 'and ' + arg + "='" + args[arg] + "' "
		}
	}

	client.query("use " + db)
	client.query(sql, function (err, results, fields) {
		if (err) {
			console.log(err)
		}
		if (results) {
			for (var i = 0; i < results.length; i++) {
				lastUpdateDate = results[i].lastreleasedate
				lastUpdateTime = results[i].lastreleasetime
			}
			record['lastReleaseDate'] = lastUpdateDate
			record['lastReleaseTime'] = lastUpdateTime
			
			queryExchange(record, req, res, client)
		}
	})
}

function queryExchange(args, req, res, client){
	var db = 'exchange'
	var bank = args['bank']
	var currency = args['currency']
	var lastReleaseDate = args['lastReleaseDate']
	var lastReleaseTime = args['lastReleaseTime']
	var date = {}

	sql = 'select * from exchange_rate where bank='+"'"+bank+"'"+' and currency='+"'"+currency+"'"+' and (flag=1 or flag=0) '

	client.query("use " + db)
	client.query(sql,function (err, results, fields){
		var dicts = {}
		if (err) {
			console.log(err)
		}
		if (results) {
			for (var i = 0; i < results.length; i++) {
				if (results[i].flag==1) {
					var dict = {}
					dict['bank'] = bank
					dict['currency'] = currency
					dict['lastReleaseDate'] = lastReleaseDate
					dict['lastReleaseTime'] = lastReleaseTime
					dict['remittanceBuyPrice'] = results[i].remittanceBuyPrice //汇买价
					dict['cashBuyPrice'] = results[i].cashBuyPrice //钞买价
					dict['sellPrice'] = results[i].sellPrice //卖出价
					dict['cenPrice'] = results[i].cenPrice   //中间价
					dicts['now'] = dict
				}else {
					var dict = {}
					dict['bank'] = bank
					dict['currency'] = currency
					dict['lastReleaseDate'] = results[i].releasedate
					dict['lastReleaseTime'] = results[i].releasetime
					dict['remittanceBuyPrice'] = results[i].remittanceBuyPrice //汇买价
					dict['cashBuyPrice'] = results[i].cashBuyPrice //钞买价
					dict['sellPrice'] = results[i].sellPrice //卖出价
					dict['cenPrice'] = results[i].cenPrice   //中间价
					dicts['last'] = dict
				}
				
			}
		}
		res.writeHead(200, {'Content-Type': 'application/json'})
		res.end(JSON.stringify(dicts))
	})
	
}

exports.queryLastReleaseDate = queryLastReleaseDate
