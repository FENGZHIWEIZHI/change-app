<template>
	<view>
		<u-navbar :is-back="false" :title="title"></u-navbar>
		<view class="top">
			<view>
				<image src="/static/icons/right.png" class="icon"></image>
			</view>
			<view class="u-font-lg u-margin-top-40 u-font-bold">支付成功</view>
		</view>

		<view class="u-m-t-60 u-p-20 bg-white">

			<view class="u-border-bottom u-p-20">问诊流程</view>
			<view class="u-p-l-40">
				<u-time-line class="u-m-t-30">
					<u-time-line-item nodeTop="2">
						<template v-slot:node>
							<view class="u-node"></view>

						</template>
						<template v-slot:content>
							<view class="u-order-title">订单支付成功</view>
							<view class="u-m-t-60"></view>
						</template>
					</u-time-line-item>
					<u-time-line-item nodeTop="2">
						<template v-slot:node>
							<view class="u-node"></view>
						</template>
						<template v-slot:content>
							<view class="u-order-title">等待医生接诊</view>
							<view class="u-m-t-60"></view>
						</template>
					</u-time-line-item>
					<u-time-line-item nodeTop="2">
						<template v-slot:node>
							<view class="u-node-1" style=""></view>
						</template>
						<template v-slot:content>
							<view class="u-tips-color">医生接诊</view>
						</template>
					</u-time-line-item>

				</u-time-line>
			</view>

		</view>
		<view class="u-padding-20 u-margin-top-60">
			<view>
				<u-button type='primary' @click="toDetail()">查看详情</u-button>
			</view>
			<view class="u-margin-top-40">
				<u-button type='primary' :plain="true" @click="toHome()">返回首页</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '支付成功',
				id: ''
			}
		},
		onLoad(options) {
			this.id = options.id;
		},

		methods: {
			// 跳转详情
			toDetail() {
				this.$u.route('/pages/ask/detail', {
					id: this.id
				});
			},
			// 返回首页
			toHome() {
				this.$u.route({
					url: '/pages/home',
					type: 'tab'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 50px;
	}

	.icon {
		width: 50px;
		height: 50px;
	}



	.u-node {
		width: 30rpx;
		height: 30rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgb(112, 182, 3);
	}

	.u-node-1 {
		width: 30rpx;
		height: 30rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: $u-type-info;
	}

	.u-order-title {
		color: rgb(112, 182, 3);
		font-size: 28rpx;
	}
</style>
