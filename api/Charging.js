export default {
	//充电站列表
	getHomeList(query){
		return uni.$u.get('/bs-smart-charger/station/list',query)
	},
	//充电站详情
	getHomeDetail(id){
		return uni.$u.get(`/bs-smart-charger/station/${id}`);
	},
	//充电桩详情
	getChargeDetail(chargingPileld){
		return uni.$u.get(`/bs-smart-charger/pile/${chargingPileld}`);
	},
	// 数据分析1
	getOneDataAnalysis(){
		return uni.$u.get('/bs-smart-charger/earnings/chargingStation');
	},
	//数据分析2
	getTwoDataAnalysis(query){
		return uni.$u.get('/bs-smart-charger/consumption/stationPower',query);
	},
	//充电桩详情数据分析1
	getOneDetailAnalysis(id){
		return uni.$u.get(`/bs-smart-charger/consumption/statistics/${id}`);
	},
	//充电桩详情数据分析2
	getTwoDetailAnalysis(id){
		return uni.$u.get(`/bs-smart-charger/earnings/statistics/${id}`);
	},
	// 开始充电生成订单
	getBeginCharge(data){
		return uni.$u.post('/bs-smart-charger/orders', data);
	},
	//结束充电更新订单
	getEndCharge(data){
		return uni.$u.put('/bs-smart-charger/orders', data);
	},
	// 车辆是否存在未完成的订单
	getChargeNoOrders(){
		return uni.$u.get(`/bs-smart-charger/orders/check`);
	},
	// 获取订单
	getOrders(query){
		return uni.$u.get('/bs-smart-charger/orders/list',query);
	},
	//获取订单详情
	getOrdersDetail(chargingOrdersId){
		return uni.$u.get(`/bs-smart-charger/orders/${chargingOrdersId}`);
	},
	// 支付接口
	getPay(query){
		return uni.$u.put('/bs-smart-charger/orders/payment',query);
	},
	// 充电桩校验
	getVerify(query){
		return uni.$u.get('/bs-smart-charger/pile/check',query);
	},
	//充电桩详情数据分析
	getDetailData(query){
		return uni.$u.post('/bs-smart-charger/record/statistics',query);
	},
	//获取余额
	getbalance(userId){
		return uni.$u.get(`/charger/account/byUserId/${userId}`);
	},
	//我的充电站
	getSite(userId){
		return uni.$u.get(`/bs-smart-charger/user_pile/stationList/${userId}`);
	},
	// 根据充电站找充电桩
	getPile(query){
		return uni.$u.get('/bs-smart-charger/user_pile/pileList',query)
	},
	// 柱状图数据
	getColumnar(query){
		return uni.$u.get('/bs-smart-charger/record/list',query)
	},
	// 饼状图数据
	getCake(query){
		return uni.$u.get('/bs-smart-charger/orders/allList',query)
	},
	//查询车辆状态
	getCarType(carId){
		return uni.$u.get(`/bs-smart-charger/car/${carId}`)
	}
}
