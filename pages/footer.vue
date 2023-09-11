<template>
	<view>
		<u-tabbar v-model="current" :list="tabList" :mid-button="false" :activeColor="activeColor"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uploadUrl: this.getBaseUrl() + '/api/common/upload',
				current: "",
				tabList: [{
					pagePath: "/pages/home",
					iconPath: "home",
					selectedIconPath: "home-fill",
					text: '首页',
					customIcon: false,
				}, {
					pagePath: "/pages/cms/index",
					iconPath: "chat",
					selectedIconPath: "chat-fill",
					text: '病理科普',
					customIcon: false,
				}, {
					pagePath: "/pages/message/index",
					iconPath: "kefu-ermai",
					selectedIconPath: "server-fill",
					text: '消息',
					customIcon: false,
				}, {
					pagePath: "/pages/my/index",
					iconPath: "account",
					selectedIconPath: "account-fill",
					text: '我的',
					customIcon: false,
				}],
				activeColor: '#1e5cdf'
			}
		},
		methods:{
			
		}
	}
</script>

<style>
</style>
