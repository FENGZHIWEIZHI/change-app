export default {

	// 查询患者信息列表
	listPatient(query) {
		return uni.$u.get('/patient/list', query);
	},

	// 查询患者信息详细
	getPatient(id) {
		return uni.$u.get( '/patient/' + id);
	},

	// 新增患者信息
	addPatient(data) {
		return uni.$u.post('/patient', data);
	},

	// 修改患者信息
	updatePatient(data) {
		return uni.$u.put('/patient', data);
	},

	// 删除患者信息
	delPatientInfo(id) {
		return uni.$u.delete('/patients/patientsInfo/' + id);
	},
	
	delPatient(id){
		return uni.$u.delete('/patient/'+id)
	}

}
