export default {

	// 查询问诊列表
	listConsultation(query) {
		return uni.$u.get('/consultation/list', query);
	},

	// 根据订单号查询问诊订单
	getConsultationOrder(orderNo) {
		return uni.$u.get('/consultation/order/' + orderNo);
	},

	// 查询问诊详情
	getConsultation(id) {
		return uni.$u.get('/consultation/' + id);
	},

	// 新增问诊
	addConsultation(data) {
		return uni.$u.post('/consultation', data);
	},

	// 修改问诊
	updateConsultation(data) {
		return uni.$u.put('/consultation', data);
	},

	// 删除问诊
	delConsultation(id) {
		return uni.$u.delete('/consultation/' + id);
	},

	// 支付问诊订单
	payConsultation(data) {
		return uni.$u.post('/consultation/pay', data);
	},


}
