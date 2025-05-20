<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="list">
			<u-cell-group>
				<u-cell-item title="更改手机号码" @click="handleChangeTel"></u-cell-item>
				<u-cell-item title="修改密码" @click="handleResetPwd"></u-cell-item>
				<u-cell-item title="清除缓存" @click="handleClearCache" :value="cacheValue"></u-cell-item>
				<u-cell-item title="设置IP端口" @click="handleIP"></u-cell-item>
				<u-cell-item title="升级版本" value="当前版本 2.8.9"></u-cell-item>
				<u-cell-item title="关于我们"></u-cell-item>
			</u-cell-group>

		</view>
		<view class="u-margin-40">
			<u-button type='primary' :plain='true' @click="show=true">退出账号</u-button>
		</view>

		<u-modal v-model="show" @confirm="confirm" :show-title='false' show-cancel-button>
			<view class="slot-content">
				<text>确定要退出当前账号吗?</text>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '设置',
				cacheValue: "2.6M",
				show: false,

			}
		},
		methods: {
			
			handleIP(){
				// this.$u.route('/pages/setIp')
			},

			handleChangeTel() {
				// this.$u.route('/pages/my/changeTel')
			},

			handleResetPwd() {
				// this.$u.route('/pages/my/resetPwd')
			},

			handleClearCache() {
				// this.$u.toast("清除成功");
				// this.cacheValue = "0M";
			},

			confirm() {
				this.$u.api.logout().then((res) => {
					this.$u.vuex('token', '');
					this.$u.vuex('isLogin', false);
					this.$u.vuex('userInfo', null);
					uni.setStorageSync('cars',{})
					uni.setStorageSync('roles',{})
					uni.setStorageSync('userId',{})
					uni.setStorageSync('user',{})
					this.show = false;
					this.$u.route('/pages/user/login')
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.slot-content {

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 50rpx 0rpx;
		
		text{
			padding-bottom: 20rpx;
			border-bottom: 1px solid black;
		}
	}

	.list {
		padding: 30rpx;
		background-color: white;
	}
</style>
