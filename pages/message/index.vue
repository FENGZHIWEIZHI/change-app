<template>
	<view class="content">
		<u-navbar :is-back="false" :background="background" :borderBottom="false">
			<view class="slot-wrap">
				<view class="text-box">
					<text class="u-font-30">订单</text>
				</view>
			</view>
		</u-navbar>
		<view v-if="list.length==0" class="u-text-center u-tips-color u-m-t-20 u-type-primary">
			<text>暂无消息</text>
		</view>
		<view>
			<view>
				<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
				 swiperWidth="750" barHeight='1000rpx' active-color="#15c38e"></u-tabs-swiper>
			</view>
			<swiper class="swiper" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="scroll-y" @scrolltolower="onreachBottom">
						<view class="noOrders" v-if="listOne.length==0">
							暂无订单
						</view>
						<view class="u-p-20" v-for="item in listOne" :key="item.chargingOrdersId" @click="handleDetail(item.chargingOrdersId)">
							<view class="order-item">
								<view class="order-head">
									<view class="order-head-No">
										订单编号：{{item.chargingOrdersNo}}
									</view>
									<view class="">
										<view class="ongo" >
											进行中
										</view>
									</view>
								</view>
								<view class="order-content">
									<view class="">
										<view class="">
											开始时间
										</view>
										<view class="">
											{{item.beginTime}}
										</view>
									</view>
									<view class="">
										<view class="">
											充电站名称
										</view>
										<view class="">
											{{item.chargingStationName}}
										</view>
									</view>
									<view class="">
										<view class="">
											充电桩名称
										</view>
										<view class="">
											{{item.chargingPileName}}
										</view>
									</view>
									<view class="">
										<view class="">
											充电桩编号
										</view>
										<view class="">
											{{item.chargingPileNo}}
										</view>
									</view>
									<view class="">
										<view class="">
											已充电量
										</view>
										<view class="">
											{{item.chargedQuantity}}度
										</view>
									</view>
									<view class="">
										<view class="">
											充电时长
										</view>
										<view class="">
											{{item.chargingDuration}}h
										</view>
									</view>
									<view class="">
										<template class="" >
											<view class="">
												预计剩余时长
											</view>
											<view class="">
												{{item.estimatedRemainingDuration}}h
											</view>
										</template>
									</view>
								</view>
								<view class="order-foot">
									<u-button class="gradient"  type="success" shape="circle" @click="handleStop(item)">结束充电</u-button>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item" >
					<scroll-view scroll-y class="scroll-y" @scrolltolower="onreachBottom">
						<view class="noOrders" v-if="listTwo.length==0">
							暂无订单
						</view>
						<view class="u-p-20" v-for="items in listTwo" :key="items.chargingOrdersId" @click="handleDetail(items.chargingOrdersId)">
							<view class="order-item">
								<view class="order-head">
									<view class="order-head-No">
										订单编号：{{items.chargingOrdersNo}}
									</view>
									<view class="">
										<view class="pay" >
											待支付
										</view>
									</view>
								</view>
								<view class="order-content">
									<view class="">
										<view class="">
											开始时间
										</view>
										<view class="">
											{{items.beginTime}}
										</view>
									</view>
									<view class="">
										<view class="">
											结束时间
										</view>
										<view class="">
											{{items.endTime}}
										</view>
									</view>
									<view class="">
										<view class="">
											充电站名称
										</view>
										<view class="">
											{{items.chargingStationName}}
										</view>
									</view>
									<view class="">
										<view class="">
											充电桩名称
										</view>
										<view class="">
											{{items.chargingPileName}}
										</view>
									</view>
									<view class="">
										<view class="">
											充电桩编号
										</view>
										<view class="">
											{{items.chargingPileNo}}
										</view>
									</view>
									<view class="">
										<view class="">
											充电量
										</view>
										<view class="">
											{{items.chargedQuantity}}度
										</view>
									</view>
									<view class="">
										<view class="">
											充电时长
										</view>
										<view class="">
											{{items.chargingDuration}}h
										</view>
									</view>
									<view class="">
										<template class="" >
											<view class="">
												待支付金额 
											</view>
											<view class="" style="color:#F6763F;">
												￥{{items.pendingPaymentAmount}}
											</view>
										</template>
									</view>
								</view>
								<view class="order-foot">
									<u-button class="gradient" type="success" shape="circle" @click="handleMoney(items)">支付</u-button>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item" >
					<scroll-view scroll-y class="scroll-y" @scrolltolower="onreachBottom">
						<view class="noOrders" v-if="listThree.length==0">
							暂无订单
						</view>
						<view class="u-p-20" v-for="itemss in listThree" :key="itemss.chargingOrdersId" @click="handleDetail(itemss.chargingOrdersId)">
							<view class="order-item">
								<view class="order-head">
									<view class="order-head-No">
										订单编号：{{itemss.chargingOrdersNo}}
									</view>
									<view class="">
										<view class="done" >
											已完成
										</view>
									</view>
								</view>
								<view class="order-content">
									<view class="">
										<view class="">
											开始时间
										</view>
										<view class="">
											{{itemss.beginTime}}
										</view>
									</view>
									<view class="">
										<view class="">
											结束时间
										</view>
										<view class="">
											{{itemss.endTime}}
										</view>
									</view>
									<view class="">
										<view class="">
											充电站名称
										</view>
										<view class="">
											{{itemss.chargingStationName}}
										</view>
									</view>
									<view class="">
										<view class="">
											充电桩名称
										</view>
										<view class="">
											{{itemss.chargingPileName}}
										</view>
									</view>
									<view class="">
										<view class="">
											充电桩编号
										</view>
										<view class="">
											{{itemss.chargingPileNo}}
										</view>
									</view>
									<view class="">
										<view class="">
											充电量
										</view>
										<view class="">
											{{itemss.chargedQuantity}}度
										</view>
									</view>
									<view class="">
										<view class="">
											充电时长
										</view>
										<view class="">
											{{itemss.chargingDuration}}h
										</view>
									</view>
									<view class="">
										<template class="" >
											<view class="">
												支付金额
											</view>
											<view class="" style="color:#F6763F;">
												￥{{itemss.paymentAmount}}
											</view>
										</template>
									</view>
								</view>
								<view class="order-foot">
									<u-button class="color" :plain="true"  shape="circle" @click="handleDetail(itemss.chargingOrdersId)">查看详情</u-button>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<u-popup v-model="show" mode="bottom" :closeable="false" :mask-close-able="false">
			<view class="pop">
				<view class="pop-head">
					付款详情
				</view>
				<u-icon name="close" class="pop-icon" @click="handleIcon"></u-icon>
				<view class="pop-money">
					<view class="pop-money-one">
						支付金额
					</view>
					<view class="">
						￥{{pendingPaymentAmount}}
					</view>
				</view>
				<view class="pop-manner">
					<view class="">
						交易方式
					</view>
					<view class="">
						{{payment}}
					</view>
				</view>
				<view class="">
					<u-button type="primary" @click="handlePay">确认支付</u-button>
				</view>
			</view>
		</u-popup>
		<u-modal v-model="modalShow" :content="content" @confirm="handleConfirm" :show-cancel-button="true"></u-modal>
		<u-toast ref="uToast" />
		<cmt-footer></cmt-footer>
	</view>
</template>

<script>
	import cmtFooter from '@/pages/footer.vue'
	export default {
		components: {
			cmtFooter
		},
		data() {
			return {
				listOne:[],
				listTwo:[],
				listThree:[],
				background:{
					backgroundColor:'#dbfef2'
				},
				list: [{
						name: '进行中'
					}, {
						name: '待支付'
					}, {
						name: '已完成'
					}],
				current:0,
				swiperCurrent: 0,
				show:false,
				modalShow:false,
				content:'确认放弃支付？',
				payment:'在线钱包',
				pendingPaymentAmount:''
				
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.getProgress(1)
			this.getProgress(2)
			this.getProgress(3)
		},
		methods: {
			getProgress(type){
				let query = {
					chargingOrdersType:type,
					// carId:uni.getStorageSync('cars')
				}
				this.$u.api.getOrders(query).then((res)=>{
					if(type == 1){
						this.listOne = res.data
						console.log(this.listOne);
					}else if(type == 2){
						this.listTwo = res.data
					}else if(type == 3){
						this.listThree = res.data
					}
				})
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
				this.getProgress(index+1)
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				
			},
			handleDetail(chargingOrdersId){
				this.$u.route('/pages/message/detail', {
						chargingOrdersId,
					})
			},
			handleStop(item){
				console.log(item);
				let dataObj = {
					// chargingOrdersId:item.chargingOrdersId
					chargingPileId:item.chargingPileId,
					chargingStationId:item.chargingStationId,
					carId:uni.getStorageSync('carId')
				}
				this.$u.api.getEndCharge(dataObj).then((res)=>{
					if(res.code == 200){
						this.$u.toast('充电已结束')
						this.tabsChange(1)
					}
				})
			},
			handleMoney(items){
				this.pendingPaymentAmount = items.pendingPaymentAmount
				this.show = true
			},
			handleIcon(){
				this.modalShow = true
			},
			handleConfirm(){
				this.show = false
			},
			handlePay(){
				let query = {
					chargingOrdersId:this.listTwo[0].chargingOrdersId
				}
				this.$u.api.getPay(query).then((res)=>{
					console.log(res);
					if(res.code == 200){
						this.$refs.uToast.show({
							title: '支付成功',
							type: 'success',
						})
						this.show = false
						this.tabsChange(2)
					}
				})
			},

		}
	}
</script>



<style lang="scss" scoped>
	.content{
		height: 100vh;
		background-color: #f2f9f6;
	}
	/deep/ .u-tabs-scorll-flex{
		background-color: #dbfef2;
	}
	.slot-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex: 1;
		padding: 0 30rpx;
	}
	
	.text-box{
		margin: 0 auto;
	}
	
	.order-item{
		padding: 50rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		.order-head{
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #ccc;
			padding-bottom: 20rpx;
			color: #888;
			.ongo{color: #66d8b5;}
			.pay{color: #F6763F;}
			.done{color: #999999;}
			.order-head-No{
				width: 400rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
		.order-content{
			>view:nth-child(n){display: flex;justify-content: space-between;line-height: 80rpx;>view:nth-child(1){color: #999;}}
			
		}
	}
	.scroll-y{
		height: calc(100vh - 268rpx);
	}
	.swiper{
		height: calc(100vh - 268rpx);
	}
	.gradient{
		background:linear-gradient(to right, #15C38E , #29E1AF);
	}
	.color{
		color: #15C38E;
	}
	// /deep/.u-navbar-inner{
	// 	background-color: #dbfef2;
	// 	margin-bottom: -88rpx;
	// }
	.pop{
		padding: 20rpx;
		.pop-head{
			text-align: center;
			color: #666;
		}
		.pop-icon{
			position: relative;
			top: -36rpx;
			left: 668rpx;
		}
		.pop-money{
			font-size: 50rpx;
			font-weight: bold;
			text-align: center;
			margin: 70rpx 0 70rpx 0;
			.pop-money-one{
				color: #666;
				font-size: 28rpx;
				font-weight: normal;
				line-height: 50rpx;
			}
		}
		.pop-manner{
			display: flex;
			justify-content: space-between;
			padding: 0 150rpx 0 150rpx;
			margin: 20rpx 0 100rpx 0;
		}
	}
	.noOrders{
		text-align: center;
		margin-top: 200rpx;
	}
</style>
