<template>
	<view class="content-box">
		<u-navbar :is-back="true" :title="doctorName" :borderBottom="false"></u-navbar>
		<view class="content">
			<view class="">
				<image :src="devUrl+itemData.picPath" mode=""></image>
			</view>
			<view class="">
				{{ itemData.chargingStationName }}
			</view>
			<view class="u-m-tb-20">
				<u-icon size="25" name="../../static/image/dizhi.png"></u-icon>
				{{itemData.chargingStationAddr}}
			</view>
			<view class="">
				<!-- {{itemData.electricityPrice}}
				<text class="">
					元/度 起
				</text> -->
			</view>
			<view class="">
				<view class="fast">
					<view class="">
						快
					</view>
					<view class="" v-if="itemData.bsChargingPileList">
						空闲
						{{handleQuantity(itemData.bsChargingPileList,1)}}
						<text>/共{{handleQuantity(itemData.bsChargingPileList,2)}}</text>
					</view>
				</view>
				<view class="slow">
					<view class="">
						慢
					</view>
					<view class="" v-if="itemData.bsChargingPileList">
						空闲
						{{handleQuantity(itemData.bsChargingPileList,3)}}
						<text>/共{{handleQuantity(itemData.bsChargingPileList,4)}}</text>
					</view>
				</view>
			</view>
			<view class="">
					<scroll-view scroll-y="true" class="scroll-Y">
									<view class="center-list" @click.stop="handlePile(items,items.chargingPileId,itemData.electricityPrice,itemData.serviceFee,itemData.chargingStationId,carId)" v-for="items in itemData.bsChargingPileList" :key="items.chargingPileId">
										<view class="center-title">
											<view class="list-free" v-if="items.chargingPileState=='3'">
												空闲
											</view>
											<view class="list-occupation" v-if="items.chargingPileState=='2'">
												运行中
											</view>
											<view class="list-occupation" v-if="items.chargingPileState=='5'">
												连接中
											</view>
											<view class="list-alarm" v-if="items.chargingPileState=='1'">
												报警
											</view>
										</view>
										<view class="">
											<view class="">
												充电桩编号：{{items.chargingPileNo}}
											</view>
											<view class="" v-if="items.chargingVoltage==1">
												电压：{{220}}v
											</view>
											<view class="" v-if="items.chargingVoltage==2">
												电压：{{380}}v
											</view>
											<view class="">
												充电功率：{{items.chargingPileCapacity}}kw
											</view>
											<!-- <view class="">
												充电时长：{{items.chargingDuration}}h
											</view> -->
											<view class="">
												充电电量统计：{{items.chargingDuration}}度
											</view>
										</view>
										<view class="">
											<view class="list-fast" v-if="items.chargingPileRate=='1'">
												快
											</view>
											<view class="list-slow" v-if="items.chargingPileRate=='2'">
												慢
											</view>
										</view>
									</view>
								</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {devUrl} from '@/common/settings'
	export default {
		data() {
			return {
				doctorName: '充电站详情',
				id:'',
				itemData:{},
				carId:'',
				carIds:[],
				devUrl:''
			}
		},
		computed: {
			
		},
		watch: {
			
		},
		onLoad(option) {
			console.log(option.id);
			this.id = option.id;
			// this.carId = uni.getStorageSync('cars')
			this.carIds = uni.getStorageSync('cars').split(',')
		},
		onShow() {
			this.devUrl = devUrl
			this.getDetail()
		},
		methods: {
			getDetail(){
				this.$u.api.getHomeDetail(this.id).then((res)=>{
					console.log(res);
					this.itemData = res.data
				})
			},
			handlePile(item,ids,electricityPrice,serviceFee,chargingStationId,carId){
				let query = {
					chargingPileNo:item.chargingPileNo,
					// carId:this.carId
				}
				if(item.chargingPileState == 3){
					this.$u.route('/pages/detail/pileDetail',{ids,electricityPrice,serviceFee,chargingStationId,carId})
				}else if(item.chargingPileState == 1){
					this.$u.route('/pages/detail/pileDetail',{ids,electricityPrice,serviceFee,chargingStationId,carId})
				}else{
					if(this.carIds == -1){
						this.$u.toast('充电桩已占用')
					}else{
						this.$u.api.getVerify(query).then((res)=>{
							if(this.carIds.includes(res.data+'')){
									uni.setStorageSync('carId',res.data)
									this.$u.route('/pages/detail/pileDetail',{ids,electricityPrice,serviceFee,chargingStationId,carId})
							}else{
								console.log('无连接');
								this.$u.toast('充电桩已占用')
							}
						})
						
					}
					
					
				}
			},
			handleQuantity(item,type){
				if(type == '1'){
					return item.filter(i=>i.chargingPileRate =='1'&&i.chargingPileState=='3').length
				}else if(type == '2'){
					return item.filter(i=>i.chargingPileRate =='1').length
				}else if(type == '3'){
					return item.filter(i=>i.chargingPileRate =='2'&&i.chargingPileState=='3').length
				}else{
					return item.filter(i=>i.chargingPileRate =='2').length
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		background:linear-gradient(rgb(231,252,244), rgb(242,249,246));
		padding: 20rpx;
		>view:nth-child(1){
			image{
				width: 100%;
				height: 300rpx;
				border-radius: 10rpx;
			}
		}
		>view:nth-child(2){font-weight: bolder;font-size: 40rpx;line-height: 80rpx;padding-left: 10rpx;}
		>view:nth-child(4){
			padding-left: 10rpx;
			color: #f60;
			text{
				color: #666;
				margin-left: 10rpx;
				font-size: 24rpx
			}
			}
		>view:nth-child(5){
			display: flex;
			justify-content: space-around;
			margin:20rpx 0 20rpx 0;
			.fast{
				border-radius: 10rpx;
				background-color: #f3dfd2;
				display: flex;
				flex:1;
				margin: 0 10rpx;
				padding: 20rpx;
				justify-content: space-around;
				align-items: center;
				>view:nth-child(1){
					color: #fff;
					font-size: 28rpx;
					background-color: #f60;
					transform: skew(-15deg);
					width: 50rpx;
					height: 40rpx;
					text-align: center;
					line-height: 40rpx;
					border-radius: 5rpx;
					font-weight: bold;
					}
				>view:nth-child(2){
					font-size: 36rpx;
					font-weight: 600;
					text{
						// font-weight: normal;
						color: #999;
					}
				}
			}
			.slow{
				border-radius: 10rpx;
				background-color: #dcf4ec;
				display: flex;
				flex:1;
				margin: 0 10rpx;
				padding: 20rpx;
				justify-content: space-around;
				align-items: center;
				>view:nth-child(1){
					color: #fff;
					font-size: 28rpx;
					background-color: #15c38e;
					transform: skew(-15deg);
					width: 50rpx;
					height: 40rpx;
					text-align: center;
					line-height: 40rpx;
					border-radius: 5rpx;
					font-weight: bold;
					}
				>view:nth-child(2){
					font-size: 36rpx;
					font-weight: 600;
					text{
						// font-weight: normal;
						color: #999;
					}
				}
			}
		}
		
		
		.charge{
			margin-top: 32rpx;
		}
	
	.center-list{
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
		display: flex;
		justify-content: space-around;
		padding: 20rpx 0rpx 20rpx 0rpx;
		margin-bottom: 20rpx;
		.center-title{align-self: center;}
		.list-free{
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			border: 4rpx solid #19c490;
			text-align: center;
			line-height: 90rpx;
			font-weight: normal;
			color: #19c490;
		}
		.list-occupation{
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			border: 4rpx solid #f67943;
			text-align: center;
			line-height: 90rpx;
			font-weight: normal;
			color: #f67943;
		}
		.list-alarm{
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			border: 4rpx solid #ed2d2d;
			text-align: center;
			line-height: 90rpx;
			font-weight: normal;
			color: #ed2d2d;
		}
		.list-fast{font-weight: bolder;color: #fff;background-color: #f60;height: 50rpx;width: 50rpx;text-align: center;line-height: 50rpx;border-radius: 10rpx;}
		.list-slow{font-weight: bolder;color: #fff;background-color: #15c38e;height: 50rpx;width: 50rpx;text-align: center;line-height: 50rpx;border-radius: 10rpx;}
		>view:nth-child(2){line-height: 40rpx;} 
		}
	}
	.scroll-Y {
			height: calc(100vh - 752rpx)
	}
	/deep/.u-navbar-inner{
		background-color: #e7fcf4;
	}
	.address{
		width: 35rpx;
		vertical-align: middle;
	}
</style>