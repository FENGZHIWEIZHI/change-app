<template>
	<view class="startUp">
		<swiper class="swiper" :autoplay="autoplay" indicator-dots="true" indicator-color="rgba(255,255,255,.4)"
			indicator-active-color="#2979ff" @change="guideChange" :duration="duration">
			<swiper-item v-for="(item, index) in advList" :key-="index">
				<view class="swiper-item">
					<view class="swiper-item-img">
						<image :src="item.image" mode="scaleToFill"></image>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view v-show="guideBtn" class="jump-over u-p-r-10">
			<!-- <navigator url="setIp">
				<view class="ip-btn">IP端口设置</view>
			</navigator> -->
		</view>
		<view v-show="guideBtn" class="experience" @tap="toExp()">立即体验</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				autoplay: false,
				duration: 500,
				guideBtn: false,
				advList: [{
						image: '/static/image/guide/guide2.jpg'
					},
				],
			}
		},
		onLoad() {
			// 从本地缓存中同步获取指定 key 对应的内容，用于判断是否是第一次打开应用
			const launchFlag = uni.getStorageSync('launchFlag');
			if (launchFlag) {
				// 如何已经有，直接去home首页
				uni.switchTab({
					url: '/pages/home'
				});
			} else {
				if (this.advList.length == 1) {
					this.guideBtn = true
				}
			}
		},
		methods: {

			getAdvList() {
				this.$u.api.listAdv({
					type: '1'
				}).then(res => {
					this.advList = res.data;
				})
			},

			guideChange(e) {
				this.guideBtn = e.detail.current == this.advList.length - 1 ? true : false;
			},

			toExp() {
				let serverIp = uni.getStorageSync('serverIp');
				if (serverIp && serverIp.length > 0) {
					uni.setStorage({
						key: 'launchFlag',
						data: true
					});
					uni.switchTab({
						url: '/pages/home'
					});
				} else {
					// uni.showToast({
					// 	title: '请先设置IP端口！',
					// 	icon: 'none',
					// 	duration: 1000
					// })
					uni.switchTab({
						url: '/pages/home'
					});
				}
			}
		}
	}
</script>

<style>
	.ip-btn {
		background-color: white;
		padding: 0 20rpx;
		border-radius: 20rpx;
		height: 30px;
		line-height: 30px;
		font-size: 14px;
	}

	.startUp {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
	}

	.entry {
		position: absolute;
		left: 50%;
		bottom: 40px;
		transform: translate3d(-50%, 0, 0);
		background-color: rgba(241, 234, 9, 0.8);
		border-radius: 22px;
		padding: 0 24px;
		color: #fff;
	}

	page,
	.content {
		width: 100%;
		height: 100%;
		padding: 0;
	}

	.swiper {
		width: 100%;
		height: 100%;
		background: #000;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
		text-align: center;
		position: relative;
		display: flex;
		/* justify-content: center; */
		align-items: flex-end;
		flex-direction: column-reverse
	}

	.swiper-item-img {
		width: 100%;
	}

	.swiper-item-img image {
		width: 100%;
		height: 100vh;
	}

	.jump-over,
	.experience {
		position: absolute;
		height: 80upx;
		line-height: 80upx;
		padding: 0 60upx;
		font-size: 32upx;
		color: #007AFF;
		z-index: 99;
	}

	.jump-over {
		right: 30upx;
		top: 80upx;
	}

	.experience {
		color: #fff;
		/* color:#007AFF; */
		border-radius: 20upx;
		right: 50%;
		margin-right: -120upx;
		bottom: 50px;
		border: 1px solid #FFFFFF;
		/* background-color: #007AFF; */
		/* background-color: #FFFFFF; */
	}
</style>
