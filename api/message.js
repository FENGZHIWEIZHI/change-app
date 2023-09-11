export default {

	// 查询医生列表
	listDoctorMsg(query) {
		return uni.$u.get('/message/doctor', query);
	},

	// 查询与医生交谈信息列表
	listMsg(query) {
		return uni.$u.get('/message/list', query);
	},

	// 新增信息内容
	addMessage(data) {
		return uni.$u.post('/message', data);
	},
}
