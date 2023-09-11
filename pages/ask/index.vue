<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="wrap">
			<view class="u-m-t-20 u-flex u-row-around">
				<view class="ask-type" :class="{ active: type=='text'}" @click="type='text'">
					<image src="/static/image/icon/registration.png" class="icon"></image>
					<text class="u-m-t-30 u-font-15">图文咨询</text>
					<text class="u-m-t-30 u-type-error-dark">￥{{doctorInfo.textAskPrice}}/次</text>
				</view>
				<view class="ask-type" :class="{ active: type=='tel'}" @click="type='tel'">
					<image src="/static/image/icon/registration.png" class="icon"></image>
					<text class="u-m-t-30 u-font-15">电话咨询</text>
					<text class="u-m-t-30 u-type-error-dark">￥{{doctorInfo.telAskPrice}}/次</text>
				</view>
			</view>

			<view class="u-m-t-40">
				<view class="u-font-15">
					使用文字、图片、语音与医生线上沟通
				</view>
				<view class="tips">
					1. 医生接诊后24小时内不限次数交流<br>
					2. 医生23小时未接诊，可自动退款<br>
				</view>
			</view>

			<view class="u-m-t-40">
				<view v-if="type=='text'">
					<u-button type="primary" @click="toAsk">
						图文资讯<text class="u-m-l-30">￥{{doctorInfo.textAskPrice}}/次</text>
					</u-button>
				</view>
				<view v-if="type=='tel'">
					<u-button type="primary" @click="toAsk">
						电话咨询<text class="u-m-l-30">￥{{doctorInfo.telAskPrice}}/次</text>
					</u-button>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				title: '选择服务方式',
				doctorId: '',
				doctorInfo: {},
				type: 'text'
			}
		},
		onLoad(options) {
			this.doctorId = options.doctorId;
			this.getDoctorInfo();
		},
		methods: {

			// 获取医生信息
			getDoctorInfo() {
				this.$u.api.getDoctor(this.doctorId).then(res => {
					this.doctorInfo = res.data;
				})
			},

			toAsk() {
				this.$u.route('/pages/ask/add', {
					doctorId: this.doctorId,
					type: this.type
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 30rpx;

		.ask-type {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: #FFFFFF;
			padding: 90rpx;
			border-radius: 10rpx;
			border: solid 1px $u-type-info-light;
		}

		.active {
			border: solid 2px $u-type-primary;
		}

		.icon {
			width: 50px;
			height: 50px;
		}

		.tips {
			margin-top: 30rpx;
			line-height: 60rpx;
		}



	}
</style>
