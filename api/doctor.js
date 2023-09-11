export default {

	// 查询医生列表
	listDoctor(query) {
		return uni.$u.get('/doctor/list', query);
	},

	// 查询医生信息详细
	getDoctor(id) {
		return uni.$u.get('/doctor/' + id);
	},

	// 查询医生挂号时间列表
	getScheduleList(query) {
		return uni.$u.get('/doctor/schedule/list', query);
	},

	// 查询医生挂号时间
	getSchedule(id) {
		return uni.$u.get('/doctor/schedule/' + id);
	},

	// 查询医生评价信息列表
	getDoctorCommentList(query) {
		return uni.$u.get('/doctor/comment/list', query);
	},

	// 新增医生评价
	addDoctorComment(data) {
		return uni.$u.post('/doctor/comment', data);
	},

}
