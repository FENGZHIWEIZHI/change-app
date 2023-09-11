// 根据字典类型查询字典数据信息
export default {
	getDicts(dictType) {
		return uni.$u.get('/dict/data/type/' + dictType);
	}
}
