export default {
	getHospitalList(query) {
		return uni.$u.get('/hospital/list', query);
	},
	getHospitalInfo(id) {
		return uni.$u.get('/hospital/' + id);
	},
	getOfficeList(query) {
		return uni.$u.get('/hospital/office/list', query);
	},
	getOfficeTree() {
		return uni.$u.get('/hospital/office/tree');
	}
}
