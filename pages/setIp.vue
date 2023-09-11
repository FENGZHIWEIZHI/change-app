<template>
	<view class="loginWrapper">
		<u-navbar :is-back="true" :title="title" ></u-navbar>
		<view class="lgCenter">
			<u-input v-model="serverIp" :border="true" placeholder="请输入IP和端口, 格式*.*.*.*:*"/>
			<view class="u-m-t-30 u-font-14">请输入服务端IP和端口,例如：192.168.1.2:8080</view>
			
			<view class="u-m-t-20 u-font-14">
				<u-form-item  label="应用类型:" label-width="150">
					<u-radio-group v-model="type">
						<u-radio name="app">安卓APP</u-radio>
						<u-radio name="mini-app">微信小程序</u-radio>
					</u-radio-group>
				</u-form-item>
			</view>
			<view class="u-m-t-60">
				<u-button type="primary" @click="saveIp()">保存</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serverIp: '',
				title:'IP端口设置',
				type:"app"
			}
		},
		methods: {
			saveIp() {
				if(this.serverIp.length>0){
					let prefix = this.type=='app' ? 'http://' : 'https://';
					uni.setStorage({
					    key: 'serverIp',
						data: prefix + this.serverIp,
					    success: function () {
							// uni.removeStorageSync('token');
							uni.showToast({
								title: '设置成功！',
								duration: 1000
							})
					    }
					});
					setTimeout(function() {
						uni.navigateBack({
							delta:1
						})
					},1000);
				} else {
					uni.showToast({
						title: '请设置Ip端口！',
						icon: 'none'
					})
				}
			},
			isValidIP(ip) {
			    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
			    return reg.test(ip);
			} 
		}
	}
</script>

<style>
	.loginWrapper{
		width: 100%;
		position: fixed;
		left: 0; top: 0; bottom: 0;
		background-color: #fff;
	}
	.lgCenter{
		width: calc(100% - 50px);
		margin: 50px auto 0;
	}
	.lgAvatarICon{
		width: 80px;
		height: 80px;
		margin: 0 auto;
	}
	.lgAvatarICon span{
		font-size: 80px;
		color: #E0E0E0;
	}
	.mui-btn {
		font-size: 18px;
		padding: 10px;
	}
	#loginForm{
		margin-top: 30px;
	}
	.form-item{
		width: 100%;
		display: flex;
		align-items: center;
		border-bottom: 1px #eaeaea solid;
		padding: 4px 0;
	}
	.form-item span{
		font-size: 30px;
		color: #b3b3b3;
		padding: 0 5px;
	}
	.form-item input{
		border: none;
		margin: 0;
		font-size: 16px;
	}
	.form-item input::placeholder{
		color: #b3b3b3;
	}
	.loginBtm{
		margin-top: 20px;
	}
	.loginBtm button{
		border: none;
		border-radius: 10px;
	}
	.link-area{
		padding: 15px 10px;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}
</style>
