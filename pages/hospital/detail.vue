<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="header u-text-center">
			<view class="title">{{hospitalInfo.name}}</view>
			<view>（{{hospitalInfo.level}}）</view>
			<view class="u-p-tb-20">
				{{hospitalInfo.officeCount?hospitalInfo.officeCount:0}}个科室|{{hospitalInfo.doctorCount?hospitalInfo.doctorCount:0}}个医生
			</view>
			<view v-if="hospitalInfo.address" class="u-p-tb-20">
				{{hospitalInfo.address}}
			</view>
		</view>
		<u-gap height="15" bg-color="#f6fafd"></u-gap>
		<view>
			<view class="u-m-lr-20 u-p-tb-20">
				<u-parse :html="hospitalInfo.description"></u-parse>
			</view>
		</view>
		<image class="card-cover" :src="getBaseUrl()+hospitalInfo.cover"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '医院简介',
				hospitalInfo: {},
			}
		},
		onLoad(options) {
			this.hospitalInfo.id = options.id;
			this.getHospitalInfo();
		},
		methods: {
			getHospitalInfo() {
				this.$u.api.getHospitalInfo(this.hospitalInfo.id).then(res => {
					this.hospitalInfo = res.data;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		.title {
			font-size: 40rpx;
			font-weight: bold;
		}
	}
	.card-cover{
		width: 100%;
	}
</style>
