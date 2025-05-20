import { sha256 } from './sha256.min.js'

// Websocket地址
export const wsUrl = 'ws://10.199.1.96:61614'
// export const wsUrl = 'ws://192.168.1.100:61614'
// export const wsUrl = 'ws://10.199.1.33:61614'

/**
 * 模拟请求刷新token，并缓存到localStorage
 */
export function refreshToken() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			// 生成模拟token
			let token = sha256('528c3e36775d438a986eab7c4d45ffacstomp' + parseInt((new Date().getTime() / 600000)))
			// 缓存token
			uni.setStorageSync('AccessToken', token)
			resolve()
		}, 1000)
	})
}