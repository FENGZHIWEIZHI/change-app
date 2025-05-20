<template>
	<view class="content">
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-p-20">
			<view class="" >
				<view class="stand" v-for="items in 4">
					<view class="stand-left">
						<image src="../../static/image/suoluetu.png" mode=""></image>
					</view>
					<view class="stand-right ">
						<view class="">
							{{'充电站名称'}}
						</view>
						<view class="">
							<u-icon name="map"></u-icon>
							{{'大连市高新园区火炬路78号'}}
						</view>
						<view class="">
							<u-icon name="tags"></u-icon>
							距离我{{'1'}}km
						</view>
						<u-collapse>
							<u-collapse-item>
								<view class="" slot="title">
									<view class="power">
										<view class="">
											<view class="u-flex">
												<view class="u-m-r-20 power-fast">
													快
													<view class="">
														闲{{1}}/10
													</view>
												</view>
												<view class="u-m-l-20 power-slow">
													慢
													<view class="">
														闲{{1}}/10
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="stand-center">
									<view class="center-list" @click.stop="handlePile" v-for="itmes in 5">
										<view class="">
											<view class="list-free">
												<image src="../../static/image/1.png" mode=""></image>
											</view>
											<!-- <view class="list-occupation">
												<image src="../../static/image/2.png" mode=""></image>
											</view>
											<view class="list-alarm">
												<image src="../../static/image/3.png" mode=""></image>
											</view> -->
										</view>
										<view class="center-title">
											<view class="title-head">
												{{'充电桩1号'}}
											</view>
											<view class="title-content">
												<view class="">
													<view class="">
														终端类型
													</view>
													<view class="">
														{{'直流电'}}
													</view>
													<view class="title-fast">
														{{'快'}}
													</view>
													<!-- <view class="title-slow">
														{{'慢'}}
													</view> -->
												</view>
												<view class="">
													<view class="">
														终端编号
													</view>
													<view class="">
														{{'2683264396496'}}
													</view>
												</view>
												<view class="">
													<view class="">
														充电功率
													</view>
													<view class="">
														{{90}}kw
													</view>
												</view>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '我经营的充电站',
				
			}
		},
		onLoad() {
			
		},
		onShow() {
			
		},
		onReachBottom() {
			// if (this.loadStatus !== "nomore") {
			// 	this.loadStatus = "loading";
			// 	this.queryParams.pageNum++;
			// 	this.getOrderList();
			// }
		},
		methods: {
			handlePile(){
				console.log(123); 
				this.$u.route('/pages/detail/pile',{title:'充电桩1号'})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.content{
		background-color: #F2F9F6;
		height: 100vh;
	}
	.stand{
		display: flex;
		background-color: #fff;
		margin: 20rpx 0;
		border-radius: 10rpx;
		.stand-left{
			margin: 10rpx;
			image{
				width: 180rpx;
				height: 180rpx;
				border: 6rpx solid #ccc;
				border-radius: 10rpx;
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
					}
				}
				.power-slow{
					display: flex;
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
			align-items: center;
			.list-free{
				image{
					width: 120rpx;
					height: 150rpx;
				}
			}
			.list-occupation{
				image{
					width: 120rpx;
					height: 150rpx;
				}
			}
			.list-alarm{
				image{
					width: 120rpx;
					height: 150rpx;
				}
			}
			.center-title{
				width: 440rpx;
				line-height: 50rpx;
				.title-head{color: #333;font-size: 32rpx;}
				.title-content{
					.title-fast{color: #f60;}
					.title-slow{color: #15C38E;}
					>view:nth-child(n){
						display: flex;
						>view:nth-child(1){margin-right: 20rpx;color: #999;font-weight: normal;}
						>view:nth-child(2){margin-right: 20rpx;color: #333;font-weight: normal;}
						}
				}
			}
			
			
		}
	}
	.u-collapse{
		width: calc(100vw - 140px);
	}
	/deep/ .u-collapse-body{
		margin-left: -220rpx;
	}
	/deep/ .u-collapse-head{
		padding: 0;
	}
</style>
