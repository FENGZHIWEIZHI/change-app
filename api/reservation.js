export default {

	// 查询挂号预约列表
	listReservation(query) {
		return uni.$u.get('/reservation/list', query);
	},

	// 查询挂号预约详细
	getReservationOrder(orderNo) {
		return uni.$u.get('/reservation/order/' + orderNo);
	},

	// 查询挂号预约详细
	getReservation(id) {
		return uni.$u.get('/reservation/' + id);
	},

	// 新增挂号预约
	addReservation(data) {
		return uni.$u.post('/reservation', data);
	},

	// 修改挂号预约
	updateReservation(data) {
		return uni.$u.put('/reservation', data);
	},

	// 删除挂号预约
	delReservation(id) {
		return uni.$u.delete('/reservation/' + id);
	},

	// 支付挂号订单
	payReservation(data) {
		return uni.$u.post('/reservation/pay', data);
	},
	
	// 获取预约提醒
	getRemindList(){
		return uni.$u.get('/reservation/remind/list');
	}

}
