// 获取广告列表
const listAdv = (params = {}) => uni.$u.get('/adv/list', params);

export default {
	listAdv,
}
