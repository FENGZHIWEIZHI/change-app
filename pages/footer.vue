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
					iconPath: require("../static/image/shouye1.png"),
					selectedIconPath: require("../static/image/shouye.png"),
					text: '首页',
					customIcon: false,
				}, 
				
				{
					pagePath: "/pages/message/index",
					iconPath: require("../static/image/dingdan.png"),
					selectedIconPath: require("../static/image/dingdan1.png"),
					text: '订单',
					customIcon: false,
				},
				{
					pagePath: "/pages/cms/index",
					iconPath: require("../static/image/shujufenxi.png"),
					selectedIconPath: require("../static/image/shujufenxi1.png"),
					text: '数据分析',
					customIcon: false,
				}, 
				{
					pagePath: "/pages/my/index",
					iconPath: require("../static/image/wode.png"),
					selectedIconPath: require("../static/image/wode1.png"),
					text: '我的',
					customIcon: false,
				}],
				activeColor: '#15c38e'
			}
		},
		methods:{
			
		}
	}
</script>

<style>
</style>
