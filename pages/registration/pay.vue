<template>
	<view>
		<view class="u-m-t-20">
			<lj-pay v-model="form.payType"></lj-pay>
		</view>
		<view class="u-padding-10 u-flex u-row-between fixed-bottom">
			<view>支付金额：<text class="u-type-error-dark u-m-l-10 u-font-15">￥{{form.total}}</text></view>
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
			console.log(options);
			this.form.id = options.id;
			this.num = options.num;
			this.getOrderInfo();
		},
		data() {
			return {
				orderNo:'',
				form: {
					id: null,
					total: null,
					payType: '电子钱包',
					num:''
				}
			}
		},
		methods: {
			getOrderInfo() {
				console.log(this.num);
				if(this.num=='1'){
					this.$u.api.getReservation(this.form.id).then(res=>{
						console.log(res);
						this.$u.api.getReservationOrder(res.data.orderNo).then(res=>{
							console.log(123);
							this.orderNo = res.data.orderNo;
							this.form.total = res.data.total;
						})
					})
					
				}else{
					this.$u.api.getConsultation(this.form.id).then(res => {
						console.log(456);
						this.form.total = res.data.total;
						this.orderNo = res.data.orderNo;
					})
				}
				
			},
			getInfo(){
				this.$u.api.getReservationOrder().then(res=>{
					this.orderNo = res.data.orderNo;
					this.form.total = res.data.total;
				})
			},
			handlePay() {
				this.$u.api.payReservation(this.form).then(res => {
					// this.$u.toast("支付成功！");
					this.$u.route({
						url: '/pages/registration/payResult',
						type: 'redirect',
						params: {
							orderNo: this.orderNo
						}
					})
				})
			}
		}
	}
</script>

<style>

</style>
