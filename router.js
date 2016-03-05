function router(handle, pathname, args, req, res) {

	if (typeof handle[pathname] === 'function') {
		handle[pathname](args, req, res)
	}else {
		//为何会执行两次请求，第一次请求成功，第二次请求失败
		return '404 Not Found'
	}
}

exports.router = router