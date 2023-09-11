export default {
	addPrescribeOrder(data) {
		return uni.$u.post('/prescribe', data);
	},
	getMedicineTree() {
		return uni.$u.get('/prescribe/medicine/tree');
	},
	updatePrescribeOrder(data) {
		return uni.$u.put('/prescribe', data);
	},
	getMedicineDetail(query) {
		return uni.$u.get('/prescribe/medicine/list', query);
	},
	addPrescribeOrderItem(data) {
		return uni.$u.post('/prescribe/medicine', data);
	},
	deletePrescribeOrderItem(id) {
		return uni.$u.delete('/prescribe/medicine/' + id);
	},
	updatePrescribeOrderItem(data) {
		return uni.$u.put('/prescribe/medicine', data);
	},
	searchMedicine(query) {
		return uni.$u.get('/prescribe/medicine/search', query);
	},
	getPrescribeOrderInfo(id) {
		return uni.$u.get('/prescribe/' + id);
	},
	payPrescribeOrder(data) {
		return uni.$u.post('/prescribe/pay', data);
	},
	deletePrescribeOrder(id) {
		return uni.$u.delete('/prescribe/' + id);
	},
	getPrescribeOrderList(query) {
		return uni.$u.get('/prescribe/list', query);
	}
}
