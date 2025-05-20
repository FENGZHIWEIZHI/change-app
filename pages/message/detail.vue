<template>
	<view class="">
		<u-navbar :is-back="true" :title="doctorName"></u-navbar>
		<view class="content">
			<view class="order">
				<view class="structure" v-if="detailData.chargingOrdersType == '1'">
					<view class="">
						订单状态：
					</view>
					<view class="" style="color: #15C38E;">
						{{'进行中'}}
					</view>
				</view>
				<view class="structure" v-if="detailData.chargingOrdersType == '2'">
					<view class="">
						订单状态：
					</view>
					<view class="" style="color: #F6763F;">
						{{'待支付'}}
					</view>
				</view>
				<view class="structure" v-if="detailData.chargingOrdersType == '3'">
					<view class="">
						订单状态：
					</view>
					<view class="">
						{{'已完成'}}
					</view>
				</view>
				<view class="structure">
					<view class="">
						订单编号：
					</view>
					<view class="structure-color">
						{{detailData.chargingOrdersNo}}
					</view>
				</view>
			</view>
			<view class="order">
				<view class="title">
					终端信息
				</view>
				<view class="structure">
					<view class="">
						充电站名称：
					</view>
					<view class="structure-color">
						{{detailData.chargingStationName}}
					</view>
				</view>
				<view class="structure">
					<view class="">
						充电桩编号：
					</view>
					<view class="structure-color">
						{{detailData.chargingPileNo}}
					</view>
				</view>
				<view class="structure">
					<view class="">
						充电桩名称：
					</view>
					<view class="structure-color">
						{{detailData.chargingPileName}}
					</view>
				</view>
			</view>
			<view class="order">
				<view class="title">
					充电信息
				</view>
				<view class="structure">
					<view class="">
						开始充电时间：
					</view>
					<view class="structure-color">
						{{detailData.beginTime}}
					</view>
				</view>
				<view class="structure" v-if="detailData.chargingOrdersType == '2' || detailData.chargingOrdersType == '3'">
					<view class="">
						结束充电时间：
					</view>
					<view class="structure-color">
						{{detailData.endTime}}
					</view>
				</view>
				<view class="structure">
					<view class="">
						已充电量：
					</view>
					<view class="structure-color">
						{{detailData.chargedQuantity}}度
					</view>
				</view>
				<view class="structure">
					<view class="">
						充电时长：
					</view>
					<view class="structure-color">
						{{detailData.chargingDuration}}H
					</view>
				</view>
				<view class="structure">
					<view class="">
						车牌号：
					</view>
					<view class="structure-color">
						{{detailData.licenseTag}}
					</view>
				</view>
				<view class="structure">
					<view class="">
						车辆型号：
					</view>
					<view class="structure-color">
						{{detailData.carModels}}
					</view>
				</view>
			</view>
			<view class="" v-if="detailData.chargingOrdersType == '2' || detailData.chargingOrdersType == '3'">
				<view class="order">
					<view class="title">
						费用信息
					</view>
					<view class="structure">
						<view class="">
							订单总额:
						</view>
						<view class="structure-color">
							￥{{detailData.totalOrderAmount}}
						</view>
					</view>
					<view class="structure">
						<view class="">
							电费:
						</view>
						<view class="structure-color">
							￥{{detailData.electricityCost}}
						</view>
					</view>
					<view class="structure">
						<view class="">
							服务费:
						</view>
						<view class="structure-color">
							￥{{detailData.serviceFee}}
						</view>
					</view>
					<view class="structure" v-if="detailData.chargingOrdersType == '3'?false:true">
						<view class="">
							待支付金额:
						</view>
						<view class="structure-color">
							￥{{detailData.pendingPaymentAmount}}
						</view>
					</view>
					<view class="structure" v-if="detailData.chargingOrdersType == '3'">
						<view class="">
							实付金额:
						</view>
						<view class="structure-color">
							￥{{detailData.actualPaymentAmount}}
						</view>
					</view>
				</view>
				<view class="order" v-if="detailData.chargingOrdersType == '3'">
					<view class="title" v-if="detailData.chargingOrdersType == '3'">
						支付信息
					</view>
					<view class="structure">
						<view class="">
							支付金额：
						</view>
						<view class="structure-color">
							￥{{detailData.paymentAmount}}
						</view>
					</view>
					<view class="structure">
						<view class="">
							支付方式：
						</view>
						<view class="structure-color">
							{{ payment }}
						</view>
					</view>
					<view class="structure">
						<view class="">
							支付时间：
						</view>
						<view class="structure-color">
							{{detailData.paymentTime}}
						</view>
					</view>
				</view>
			</view>
			<!-- <u-button v-if="detailData.chargingOrdersType == '1'" class="gradient"  type="success" shape="circle" @click="handleStop">结束充电</u-button>
			<u-button v-if="detailData.chargingOrdersType == '2'" class="gradient" type="success" shape="circle" @click="handleMoney">支付费用</u-button> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				doctorName: '订单详情',
				// show: false,
				detailData:{},
				chargingOrdersId:'',
				chargingOrdersType:'',
				payment:'在线钱包',
				// modalShow:false,
				// content:'确认放弃支付？'
			}
		},
		computed: {
			
		},
		watch: {
			
		},
		onLoad(options) {
			this.chargingOrdersId = options.chargingOrdersId
			// this.chargingOrdersType = options.chargingOrdersType
			this.getOrdersList()
		},
		onShow() {
			
		},
		methods: {
			getOrdersList(){
				this.$u.api.getOrdersDetail(this.chargingOrdersId).then((res)=>{
					console.log(res);
					this.detailData = res.data
				})
			},
			// handleOpen(){
				
			// },
			// handleClose(){
			// 	this.modalShow = true
			// },
			// handleMoney(){
			// 	this.show = true
			// },
			// handlePay(){
			// 	let query = {
			// 		chargingOrdersId:this.chargingOrdersId
			// 	}
			// 	this.$u.api.getPay(query).then((res)=>{
			// 		console.log(res);
			// 		if(res.code == 200){
			// 			this.$refs.uToast.show({
			// 								title: '支付成功',
			// 								type: 'success',
			// 								url: '/pages/message/index',
			// 								isTab:true
			// 							})
			// 		}
			// 	})
			// },
			// handleStop(){
			// 	let dataObj = {
			// 		chargingPileId:this.detailData.chargingPileId,
			// 		chargingStationId:this.detailData.chargingStationId,
			// 		carId:uni.getStorageSync('cars').carId
			// 	}
			// 	this.$u.api.getEndCharge(dataObj).then((res)=>{
			// 		console.log(res);
			// 		if(res.code == 200){
			// 			this.$u.route({
			// 				url: '/pages/message/index',
			// 				type: 'tab'
			// 			})
			// 		}
			// 	})
			// },
			
		}
	}
</script>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style lang="scss" scoped>
	.content {
		color: $u-tips-color;
		background:linear-gradient(rgb(231,252,244), rgb(242,249,246));
		padding: 30rpx;
		// height: 100vh;
		font-size: 26rpx;
		.order{
			background-color: #fff;
			line-height: 80rpx;
			padding: 20rpx;
			border-radius: 20rpx;
			margin-top: 40rpx;
		}
		.title{
			line-height: 80rpx;
			font-weight: bolder;
			color: #666;
			border-bottom: 2rpx solid #f0f0f0;
		}
	}
	.contentDown{
		font-size: 10rpx;
	}
	.gradient{
		background:linear-gradient(to right, #15C38E , #29E1AF);
		margin-top: 50rpx;
	}
	.structure{
		display: flex;
		justify-content: space-between;
		.structure-color{
			color: #333;
		}
	}
	// .pop{
	// 	padding: 20rpx;
	// 	.pop-head{
	// 		text-align: center;
	// 		color: #666;
	// 	}
	// 	.pop-money{
	// 		font-size: 50rpx;
	// 		font-weight: bold;
	// 		text-align: center;
	// 		margin: 70rpx 0 70rpx 0;
	// 		.pop-money-one{
	// 			color: #666;
	// 			font-size: 28rpx;
	// 			font-weight: normal;
	// 			line-height: 50rpx;
	// 		}
	// 	}
	// 	.pop-manner{
	// 		display: flex;
	// 		justify-content: space-between;
	// 		padding: 0 150rpx 0 150rpx;
	// 		margin: 20rpx 0 100rpx 0;
	// 	}
	// }
</style>
