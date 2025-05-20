<template>
	<view class="u-p-20 content">
		<u-navbar :is-back="false" :title="title" :borderBottom="false">
			<view class="slot-wrap">
				<view class="u-flex">
					<!-- <image src="../../static/image/cmt.jpg"></image> -->
					<text class="u-font-30 u-m-l-20">我的</text>
				</view>

				<view>
					<u-icon name="setting-fill" class="icon" @click="toSetting()"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="my-info u-padding-20" @click="handleProfile">
			<view class="u-flex u-col-center">
				<view class="u-flex-3">
					<u-avatar :src="profile.avatar" size="140"></u-avatar>
				</view>
				<view class="u-flex-9">
					<view class="name">{{nickName}}</view>
					<view class="sex">
						账号：
						<text>
							{{userName}}
						</text>
					</view>
				</view>
			</view>
		</view>
		<view class="my-up">
			<view class="">
				<view class="">
					<view class="my-size">
						可用余额
					</view>
					<view class="my-title">
						{{money}}
					</view>
				</view>
				<view class="">
					<image class="image" src="/static/image/my-balance.png" mode=""></image>
				</view>
			</view>
			<!-- <view class="" @click="handleAsk">
				<view class="">
					<view class="my-size">
						我的电站
					</view>
					<view class="my-text">
						<text class="my-title">{{'2'}}</text>个
					</view>
				</view>
				<view class="">
					<image class="image" src="../../static/image/my-power.png" mode=""></image>
				</view>
			</view> -->
		</view>
		<view class="u-margin-top-20 menu">
			<u-cell-group>
				<u-cell-item title="我的订单" :arrow="true" @click="handleReg">
					<view slot="icon" class="u-flex">
						<image mode="widthFix" src="/static/icons/my/dingdan.png" class="icon"></image>
					</view>
				</u-cell-item>
				<u-cell-item title="我的爱车" :arrow="true" @click="handleAsk">
					<view slot="icon" class="u-flex">
						<image mode="widthFix" src="/static/icons/my/car.png" class="icon"></image>
					</view>
				</u-cell-item>
				<u-cell-item title="充电记录" :arrow="true" @click="handlePrescribe">
					<view slot="icon" class="u-flex">
						<image mode="widthFix" src="/static/icons/my/lishijilu.png" class="icon"></image>
					</view>
				</u-cell-item>
				<u-cell-item title="客服中心" :arrow="true" @click="handlediagnosis">
					<view slot="icon" class="u-flex">
						<image mode="widthFix" src="/static/icons/my/kefu.png" class="icon"></image>
					</view>
				</u-cell-item>
				<u-cell-item title="设置" :arrow="true" @click="handlediagnosis">
					<view slot="icon" class="u-flex">
						<image mode="widthFix" src="/static/icons/my/set.png" class="icon"></image>
					</view>
				</u-cell-item>
				<!-- <u-cell-item :title="Visits" :arrow="true" @click="handlePatient">
					<view slot="icon" class="u-flex">
						<image mode="widthFix" src="/static/image/icon/Patient_management.png" class="icon"></image>
					</view>
				</u-cell-item> -->
			</u-cell-group>
		</view>
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
				title: "",
				profile: {},
				Visits:'',
				num:{
					box:1
				},
				money:'',
				userName:'',
				nickName:''
			}
		},
		onLoad() {
			// this.getProfile();
		},
		onShow() {
			// this.getProfile();
			this.getBalance()
		},
		methods: {
			getBalance(){
				this.userId = uni.getStorageSync('userId')
				this.userName = uni.getStorageSync('user').userName
				this.nickName = uni.getStorageSync('user').nickName
				this.$u.api.getbalance(this.userId).then((res)=>{
					console.log(res);
					this.money = res.data.money
				})
			},
			handlePatient(){
				this.$u.route('/pages/patient/index',this.num)
			},
			handleProfile() {
				// this.$u.route('/pages/my/profile')
			},
			handleReg() {
				// this.$u.route('/pages/my/registration')
			},
			handleAsk() {
				// this.$u.route('/pages/my/ask')
			},
			handlePrescribe() {
				// this.$u.route('/pages/my/prescribe')
			},
			handlediagnosis() {
				// this.$u.route('/pages/my/diagnosis')
			},
			getProfile() {
				this.$u.api.getUserInfo().then(res => {
					this.$u.vuex('userInfo', res.userInfo);
					this.profile = res.userInfo;
				})
			},
			toSetting() {
				this.$u.route('/pages/my/setting')
			}
		}
	}
</script>



<style scoped lang="scss">
	.content{
		// background-color: red;
		background:linear-gradient( #93FFDA , #F2F9F6);
		height: 100vh;
	}
	/deep/.u-navbar-inner{
		background-color: #93FFDA;
	}
	.slot-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		flex: 1;
		/* 如果您想让slot内容与导航栏左右有空隙 */
		padding: 0 30rpx;

		image {
			width: 60rpx;
			height: 60rpx;
		}

		.icon {
			font-size: 38rpx;
			color: $u-type-primary;
		}
	}

	.my-info {
		border: 1px;
		border-radius: 15rpx;
		// background:linear-gradient(160deg, #93FFDA , #F2F9F6);
		.name {
			color: #333;
			font-weight: bold;
			font-size: 30rpx;
		}

		.sex {
			color: #333;
			font-size: 28rpx;
		}
	}

	.menu {
		background-color: #FFFFFF;

		.icon {
			width: 40rpx;
			margin-right: 10rpx;
		}
	}
	.my-up{
		
		display: flex;
		justify-content: space-around;
		>view:nth-child(1){display: flex;background-color: #fff;padding: 20rpx;justify-content: space-between;flex: 1;border-radius: 20rpx;}
		>view:nth-child(2){display: flex;background-color: #fff;padding: 20rpx;justify-content: space-between;flex: 1;margin-left: 20rpx;border-radius: 20rpx;}
		.my-size{
			font-size: 24rpx;
			color: #666;
		}
		.my-title{
			font-size: 40rpx;
			color: #333;
			line-height: 80rpx;
			font-weight: bold;
			width: 180rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.my-text{
			font-size: 28rpx;
		}
		.image{
			width: 100rpx;
			height: 100rpx;
		}
	}
</style>
