<template>
	<view>
		<u-navbar :is-back="false" :title="title"></u-navbar>
		<view class="u-flex u-col-center u-row-center">
			<view>
				<view>
					<u-icon name="checkbox-mark" size="100" :color="color"></u-icon>
				</view>
				<view class="u-p-tb-20 u-font-40">
					支付成功
				</view>
			</view>
		</view>
		<view class="u-p-lr-20">
			<text class="u-font-40">购药流程</text>
			<view class="u-p-20">
				<u-steps :list="stepList" current="1" direction="column" :active-color="color"
					un-active-color="#aaaaaa"></u-steps>
			</view>
			<text>如果医生24小时内未回复，将全额退款</text>
			<view class="u-p-tb-20">
				<u-button type="primary" @click="handleDetail">查看详情</u-button>
			</view>
			<view class="u-p-tb-20">
				<u-button type="primary" :plain="true" @click="handleHome">返回主页</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '支付成功',
				orderId: '',
				color: '#70B603',
				stepList: [{
					name: '订单支付成功'
				}, {
					name: '等待医生接诊'
				}, {
					name: '医生接诊开处方'
				}, ]
			}
		},
		onLoad(options) {
			this.orderId = options.id;
		},
		methods: {
			handleHome() {
				this.$u.route({
					url: '/pages/home',
					type: 'tab'
				})
			},
			handleDetail() {
				this.$u.route({
					url: '/pages/prescribe/detail',
					type: 'redirect',
					params: {
						id: this.orderId
					}
				})
			}
		}
	}
</script>

<style>

</style>
