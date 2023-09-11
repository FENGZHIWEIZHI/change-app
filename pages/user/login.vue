<template>
	<view class="u-padding-20">
		<view class="logo u-flex u-row-center">
			<image src="/static/image/cmt.jpg"></image>
		</view>
		<view class="type">账号密码登录</view>
		<view class="tips">欢迎使用云上门诊App</view>
		<view class="form">
			<u-form :model="form" :rules="rules" ref="uform" :errorType="errorType" label-position="top">
				<u-form-item label="手机号码" prop="username" :border-bottom="false">
					<u-input v-model="form.username" :border="true" placeholder="请输入手机号码" maxlength="11" />
				</u-form-item>
				<u-form-item label="密码" prop="password" :border-bottom="false">
					<u-input v-model="form.password" :type="pwdType" :border="true" :password-icon="true" placeholder="请输入密码" />
				</u-form-item>
			</u-form>
		</view>
		<view class="u-flex u-row-between">
			<view class="u-flex">
				<u-checkbox v-model="check" @change="checkboxChange"></u-checkbox>
				<text class="tips">我已阅读并同意<text class="link" @click="toProtocal()">《用户隐私政策》</text></text>
			</view>
			<view @click="toForgetPwd()">忘记密码？</view>
		</view>
		<view class="u-margin-top-50">
			<u-button :disabled="disabled" type="primary" @click="login">登录</u-button>
		</view>
		<view class="u-flex u-row-between link u-margin-top-40">
			<text @click="toCodeLogin()">免密登录</text>
			<text @click="toRegister()">注册新用户</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				border: true,
				errorType: ['toast'],
				pwdType: "password",
				check: false,
				disabled: true,
				form: {
					username: '',
					password: ''
				},
				rules: {
					username: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						}
					],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['change', 'blur'],
					}, ],
				},
			}
		},
		onReady() {
			this.$refs.uform.setRules(this.rules);
		},
		methods: {
			login() {
				this.$refs.uform.validate(valid => {
					if (valid) {
						this.$u.api.login(this.form.username, this.form.password).then(res => {
							this.$u.vuex('token', res.token);
							this.$u.vuex('isLogin', true);
							this.$u.api.getUserInfo().then(res => {
								this.$u.vuex('userInfo', res.userInfo);
								this.$u.route({
									url: '/pages/home',
									type: 'tab'
								});
							})
						});
					}
				})
			},
			toProtocal() {
				this.$u.route('/pages/protocal');
			},
			toForgetPwd() {
				this.$u.route('pages/user/forgetPwd');
			},
			toCodeLogin() {
				this.$u.route('/pages/user/codeLogin');
			},
			toRegister() {
				this.$u.route('/pages/user/register');
			},
			// 勾选版权协议
			checkboxChange(e) {
				if (this.disabled) {
					this.disabled = false
				} else {
					this.disabled = true
				}
			},
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>

<style lang="scss" scoped>
	.logo {
		image {
			margin-top: 40rpx;
			width: 280rpx;
			height: 280rpx;
		}
	}

	.type {
		font-size: 46rpx;
		margin-top: 80rpx;
		margin-bottom: 20rpx;
		color: $u-content-color;
	}

	.tips {
		color: $u-tips-color;
	}

	.link {
		color: $u-type-primary;
	}

	.form {
		margin-top: 80upx;
		padding: 20rpx;
	}
</style>
