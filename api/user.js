// 获取用户详细信息
function getUserInfo() {
	return uni.$u.get('/user/getInfo');
}

// 修改用户信息
function updateUser(data) {
	return uni.$u.put('/user', data);
}

// 重置密码
function resetPwd(data) {
	return uni.$u.put('/user/resetPwd', data);
}

// 检查用户，重置密码
function checkUser(data) {
	return uni.$u.post('/user/check', data);
}

// 设置密码
function setPwd(data) {
	return uni.$u.put('/user/setPwd', data);
}

// 设置密码
function changeTel(data) {
	return uni.$u.put('/user/changeTel', data);
}

export default {
	getUserInfo,
	updateUser,
	setPwd,
	resetPwd,
	checkUser,
	changeTel
}
