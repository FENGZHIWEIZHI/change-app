<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view v-if="loaded">
			<view class="top">
				<view class="u-flex u-row-center">
					<view class="u-flex-2">
						<u-avatar :src="getBaseUrl()+info.photo"></u-avatar>
					</view>
					<view class="u-flex-8 content">
						<view class="title">{{info.name}} {{info.level}} {{info.officeName}}</view>
						<view>{{info.hospitalLevel}}
							<text class="u-m-l-20 u-main-color" @click="toHospital()">{{info.hospitalName}}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-if="info.skill" class="skill">
				<view class="u-font-32 u-font-bold">擅长：</view>
				<view class="u-m-t-20" style="line-height: 1.8;">
					{{info.skill}}
				</view>
			</view>
			<view v-if="info.introduce" class="introduce">
				<view class="u-font-32 u-font-bold">
					执业经历
				</view>
				<view class="u-m-t-20" style="line-height: 1.8;">
					{{info.introduce}}
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				loaded: false,
				title: '医生简介',
				id: '',
				info: {},
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.getInfo();
		},
		methods: {
			// 获取医生详情
			getInfo() {
				this.$u.api.getDoctor(this.id).then(res => {
					this.info = res.data;
					this.loaded = true;
				})
			},
			// 跳转医院
			toHospital() {
				this.$u.route('/pages/hospital/detail', {
					id: this.info.hospitalId
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		margin: 20rpx 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		padding: 20rpx 30rpx;
	}

	.skill {
		padding: 30rpx;
		margin-top: 20rpx;
		background-color: #FFFFFF;
	}

	.introduce {
		padding: 30rpx;
		padding-bottom: 50px;
		margin-top: 20rpx;
		background-color: #FFFFFF;
	}

	.fixed-bottom {
		position: fixed;
		right: 0;
		bottom: calc(var(--window-bottom) + 0px);
		left: 0;
		z-index: 9999;
	}
</style>
