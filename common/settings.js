/**
 * @copyright
 * @description 全局变量配置
 */
module.exports = {
	// 应用名
	name: '基础项目模板',
	// 版本号
	version: '1.0.0',
	// 开发环境接口Url
	devUrl: 'http://localhost:9090',
	//devUrl: 'http://sh.luojixiangliang.com:9988',
	// 线上环境接口Url
	prodUrl: 'http://section.cloudsheng.com:8834',
	// 配后端数据的接收方式application/json;charset=UTF-8或者application/x-www-form-urlencoded;charset=UTF-8
	contentType: 'application/json;charset=UTF-8',
	// 后端返回状态码，如code,status
	codeName:'code',
	// 是否显示请求中loading
	showLoading: true,
	// 请求loading的文字提示
	loadingText: '请求中...',
	// 请求头中身份验证字段名称
	headerTokenName: 'Authorization',
	// 用户信息中身份验证字段名称
	userTokenName: 'token',
	// 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
	loadingTime: 800,
	// 操作正常code
	successCode: 200,
	// 登录失效code
	invalidCode: 401,
	// 公众号appid
	wechatAppId: '',
	// 公众号授权方式snsapi_base或snsapi_userinfo
	wechatScope: 'snsapi_userinfo',
}
