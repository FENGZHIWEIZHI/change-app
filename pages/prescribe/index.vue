<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<u-gap height="15" bg-color="#f6fafd"></u-gap>
		<u-section title="开药流程" :right="false" font-size="40"></u-section>
		<u-gap height="5" bg-color="#f6fafd"></u-gap>
		<view class="u-p-tb-20">
			<u-steps :list="stepList" :current="-1" mode="number" un-active-color="#4e89d4"></u-steps>
		</view>
		<u-gap height="15" bg-color="#f6fafd"></u-gap>
		<u-section title="如何开药" :right="false" font-size="40"></u-section>
		<u-gap height="5" bg-color="#f6fafd"></u-gap>
		<view class="u-p-tb-20 u-m-l-20">
			<view>• 医生了解病情后，判断是否开药</view>
			<view>• 凭医生处方购药</view>
		</view>
		<u-gap height="15" bg-color="#f6fafd"></u-gap>
		<u-section title="温馨提示" :right="false" font-size="40"></u-section>
		<u-gap height="5" bg-color="#f6fafd"></u-gap>
		<view class="u-p-tb-20 u-m-l-20">
			开药申请适用于药用完，已有用药方案和病情稳定的患者
		</view>
		<u-gap height="5" bg-color="#f6fafd"></u-gap>
		<view class="u-p-lr-20">
			<u-button type="primary" @click="handlePrescribe">申请开药</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '复诊/开药',
				stepList: [{
					name: '提交开药清单'
				}, {
					name: '挂号医生开处方'
				}, {
					name: '药师审核处方'
				}, {
					name: '购药凭码取药'
				}]
			}
		},
		methods: {
			handlePrescribe() {
				this.$u.route('/pages/doctor/search', {
					bizType: 'prescribe'
				})
			}
		}
	}
</script>

<style>

</style>
