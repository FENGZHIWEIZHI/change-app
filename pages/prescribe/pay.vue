<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-m-t-20">
			<lj-pay v-model="form.payType"></lj-pay>
		</view>
		<view class="u-padding-10 u-flex u-row-between fixed-bottom">
			<view>支付金额：<text class="u-type-error-dark u-m-l-10 u-font-15">￥{{form.total?form.total:'0'}}</text></view>
			<view>
				<u-button type="primary" @click="handlePay()" size="medium">支付</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import ljPay from '@/components/lj-pay/lj-pay.vue'
	export default {
		components: {
			ljPay
		},
		onLoad(options) {
			this.form.id = options.id;
			this.getOrderInfo();
		},
		data() {
			return {
				title: '确认订单',
				form: {
					id: null,
					total: null,
					payType: '电子钱包'
				}
			}
		},
		methods: {
			getOrderInfo() {
				this.$u.api.getPrescribeOrderInfo(this.form.id).then(res => {
					this.form.total = res.data.total;
				})
			},
			handlePay() {
				this.$u.api.payPrescribeOrder(this.form).then(res => {
					this.$u.toast("支付成功！");
					this.$u.route({
						url: '/pages/prescribe/finish',
						type: 'redirect',
						params: {
							id: this.form.id
						}
					})
				})
			}
		}
	}
</script>

<style>

</style>
