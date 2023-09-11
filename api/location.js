export default {
	getAreaList(query) {
		return uni.$u.get('/location/area/list', query);
	},
	getLocation() {
		return uni.$u.get('/location/gps');
	},
	getCityLetterTree() {
		return uni.$u.get('/location/city/tree');
	}
}
