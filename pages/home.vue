<template>
	<view class="content">
		<u-navbar :is-back="false" :title="title" :background="background" :borderBottom="false">
			<view class="slot-wrap">
				<view class="u-flex u-row-center u-p-10 searchBox">
					<view class="u-flex-11">
						<u-search v-model="keyword" placeholder="搜索充电站" height="56" :show-action="false" @search="handleSearch"></u-search>
					</view>
				</view>
			</view>
			<view slot="right">
				<view class="u-p-r-20">
					<u-icon name="scan" size="38" @click="handleScan"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="u-p-20">
			<view class="" >
				<h3 class="u-m-tb-30">附近充电站</h3>
				<view class="stand" v-for="item in list" :key="item.chargingStationId" @click.stop="handleStand(item.chargingStationId)">
					<view class="stand-left">
						<image :src="devUrl+item.picPath" mode=""></image>
					</view>
					<view class="stand-right ">
						<view class="noWarp">
							{{item.chargingStationName}}
						</view>
						<view class="noWarp">
							<u-icon size="25" name="../static/image/dizhi.png"></u-icon>
							{{item.chargingStationAddr}}
						</view>
						<view class="">
							<u-icon size="25" name="../static/image/daohang.png"></u-icon>
							距离我{{item.distance}}km
						</view>
						<u-collapse>
							<u-collapse-item :open="true">
								<view class="" slot="title">
									<view class="power">
										<view class="">
											<view class="u-flex">
												<view class="power-fast">
													快
													<view class="" v-if="item.bsChargingPileList"> 
														闲{{handleQuantity(item.bsChargingPileList,1)}}/{{handleQuantity(item.bsChargingPileList,2)}}
													</view>
												</view>
												<view class="u-m-l-20 power-slow">
													慢
													<view class="" v-if="item.bsChargingPileList">
														闲{{handleQuantity(item.bsChargingPileList,3)}}/{{handleQuantity(item.bsChargingPileList,4)}}
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="stand-center">
									<view class="center-list" @click.stop="handlePile(items,items.chargingPileId,item.electricityPrice,item.serviceFee,item.chargingStationId,carId)" v-for="items in item.bsChargingPileList" :key="items.chargingPileId">
										<view class="">
											<view class="list-free" v-if="items.chargingPileState==3">
												空闲
											</view>
											<view class="list-occupation" v-if="items.chargingPileState==2">
												运行中
											</view>
											<view class="list-occupation" v-if="items.chargingPileState==5">
												连接中
											</view>
											<view class="list-alarm" v-if="items.chargingPileState==1">
												报警
											</view>
										</view>
										<view class="">
											<view class="">
												充电桩编号：{{items.chargingPileNo}}
											</view>
											<view class="" v-if="items.chargingVoltage=='1'">
												充电电压：{{220}}v
											</view>
											<view class="" v-if="items.chargingVoltage=='2'">
												充电电压：{{380}}v
											</view>
											<view class="">
												充电功率：{{items.chargingPileCapacity}}kw
											</view>
										</view>
										<view class="">
											<view class="list-fast" v-if="items.chargingPileRate==1">
												快
											</view>
											<view class="list-slow" v-if="items.chargingPileRate==2">
												慢
											</view>
										</view>
									</view>
								</view>
							</u-collapse-item>
						</u-collapse>
					</view>
				</view>
			</view>
		</view>
		<cmt-footer></cmt-footer>
	</view>
</template>

<script>
	import cmtFooter from '@/pages/footer.vue'
	import ws from '@/websocket/ws.js';
	import {devUrl} from '@/common/settings'
	export default {
		components: {
			cmtFooter
		},
		data() {
			return {
				title: '',
				keyword: '',
				background:{
					backgroundImage: 'linear-gradient(45deg, rgb(218,255,242), rgb(174,255,227))'
				},
				list:[],
				carId:'',
				objCarId:'',
				objChargingPileId:'',
				objChargingPileNo:'',
				carIds:[],
				devUrl:''
			}
		},
		onLoad() {
			this.connectws()
			
		},
		onShow() {
			
			if (!this.isLogin) {
				this.$u.route({
					url: '/pages/user/login',
					type: 'redirect',
				})
				return
			}
			this.devUrl = devUrl
			this.getList()
			this.carIds = uni.getStorageSync('cars').split(',')
		},
		computed: {
			
		},
		methods: {
			connectws() {
				ws.connect();
				let that = this
				ws.subscribe('/topic/order/topic/message/car/control', function(data) {
					console.log(JSON.parse(data.body.trim()));
					// let recData = data.body.replace(/\\/g,"");
					// recData = recData.replace('"{','{');
					// recData = recData.replace('}"','}');
					let resObj = JSON.parse(data.body.trim())
					// JSON.parse(data.body.trim()).carId
					// JSON.parse(data.body.trim()).controlType
					// JSON.parse(data.body.trim()).chargingPileNo
					that.objCarId = resObj.carId
					that.objChargingPileNo = resObj.chargingPileNo
					
					
						that.list.forEach((i)=>{
							i.bsChargingPileList.forEach((j)=>{
								if(resObj.chargingPileNo == j.chargingPileNo){
									i.chargingPileState = resObj.controlType
									that.$u.vuex('ctrlType', resObj.controlType);
									console.log(that.ctrlType);
									that.$u.vuex('ctrlCarId', resObj.carId);
									that.getList();
								}
							})
							
						})
					
					
					// if(JSON.parse(data.body.trim()).controlType == '5'){
					// 	that.isLink = JSON.parse(data.body.trim()).controlType
					// 	that.isOk = false
					// };
				});
				
				ws.subscribe('order.queue.message.charging.stop', function(data) {
					// console.log(data)
					// let recData = data.body.replace(/\\/g,"");
					// recData = recData.replace('"{','{');
					// recData = recData.replace('}"','}');
				});
			},
			getList(){
				let query = {
					customLongitude:'121.536036',
					customLatitude:'38.886597'
				}
				this.$u.api.getHomeList(query).then((res)=>{
					this.list = res.rows
				})
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
			handleScan() {
				uni.scanCode({
					success: res => {
						// this.result = res.result;
						this.$u.toast("扫码成功");
						setTimeout(() => {
							this.$u.route("pages/home")
						}, 2000);
						return
					},
					fail: err => {
						// 需要注意的是小程序扫码不需要申请相机权限
						this.$u.toast("扫码失败");
						setTimeout(() => {
							this.$u.route("pages/home")
						}, 2000);
						return
					}
				});
			},
			handleSearch(val) {
				
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
							console.log(res.data);
							if(this.carIds.includes(res.data+'')){
									uni.setStorageSync('carId',res.data)
									this.$u.route('/pages/detail/pileDetail',{ids,electricityPrice,serviceFee,chargingStationId})
							}else{
								console.log('无连接');
								this.$u.toast('充电桩已占用')
							}
						})
						
					}
				}
			},
			handleStand(id){
				this.$u.route('/pages/detail/stand',{id})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		// background-color: #f2f9f6;
		background:linear-gradient(rgb(231,252,244), rgb(242,249,246));
		height: 100vh;
	}

	.searchBox{
		width: 700rpx;
	}
	
	.stand{
		display: flex;
		background-color: #fff;
		margin-bottom: 10rpx;
		border-radius: 10rpx;
		.stand-left{
			margin: 10rpx;
			image{
				width: 180rpx;
				height: 180rpx;
				border: 6rpx solid #ccc;
				border-radius: 15rpx;
			}
		}
		.stand-right{
			padding: 10rpx;
			line-height: 40rpx;
			>view:nth-child(1) {font-weight: bolder;};
			>view:nth-child(2) {font-size: 24rpx; margin-top: 10rpx};
			>view:nth-child(3) {font-size: 24rpx; margin-bottom: 10rpx};
			>view:nth-child(4) {font-weight: bolder;};
			.power{
				.power-fast{
					width: 160rpx;
					display: flex;
					border-radius: 8rpx;
					background:linear-gradient(to right, rgb(255,211,190) , rgb(255,253,252));
					color: #f78757;
					padding: 10rpx;
					view{
						position: relative;
						left: 12rpx;
						background-color: #fff;
						padding: 4rpx;
						font-size: 24rpx;
						border-radius: 5rpx;
						color: #333;
						margin-left: 10rpx;
					}
				}
				.power-slow{
					display: flex;
					width: 160rpx;
					border-radius: 8rpx;
					background:linear-gradient(to right, rgb(171,255,226) , rgb(255,253,252));
					color: #f78757;
					padding: 10rpx;
					view{
						position: relative;
						left: 12rpx;
						background-color: #fff;
						padding: 4rpx;
						font-size: 24rpx;
						border-radius: 5rpx;
						color: #333;
						margin-left: 10rpx;
					}
				}
			}
			
		}
	}
	.stand-center{
		padding: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		.center-list{
			background-color: #fff;
			border-bottom: 1rpx solid #eee;
			display: flex;
			justify-content: space-around;
			padding: 20rpx 0rpx 20rpx 0rpx;
			margin-bottom: 20rpx;
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
		}
	}
	
	.u-collapse{
		width: calc(100vw - 140px);
		padding-right: 20rpx;
	}
	/deep/ .u-collapse-body{
		margin-left: -220rpx;
	}
	/deep/ .u-collapse-head{
		padding: 0;
	}
	.noWarp{
		width: 400rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	/deep/.u-navbar-inner{
		background-color: #e7fcf4;
	}
</style>
