<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="content">
			<view class="u-font-15 u-font-bold">
				医院规则
			</view>
			<view class="u-m-t-60">
				1、预约周期1-7天<br>

				2、取消时限，就诊前一天15：00之前<br>

				3、患者需要实名预约，否则预约无效<br>

				4、如遇专家班次变动，会以短信形式通知，请保持手机畅通<br>

				5、门诊号是有效资源，如确定不来就诊，预约者要在前一天下午15：00前取消预约，否则将作为爽约一次，对爽约三次以上（包括三次），将取消网上预约资格

			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '预约规则',
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 40rpx 20rpx;
		line-height: 30px;
	}
</style>
