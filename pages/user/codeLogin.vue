<template>
	<view class="u-padding-20">
		<view class="logo u-flex u-row-center">
			<image src="/static/logo.jpg"></image>
		</view>
		<view class="type">账号密码登录</view>
		<view class="tips">欢迎使用智能充电商用版</view>
		<view class="form">
			<u-form :model="form" :rules="rules" ref="uform" :errorType="errorType" label-position="top">
				<u-form-item label="手机号码" prop="username" :border-bottom="false">
					<u-input v-model="form.username" :border="true" placeholder="请输入手机号码" maxlength="11" />
				</u-form-item>
				<u-form-item label="验证码" prop="code" :border-bottom="false">
					<u-input v-model="form.code" :border="true" placeholder="请输入验证码" type="number" maxlength="6">
					</u-input>
					<u-button slot="right" type="success" size="mini" @click="getCode">{{codeTips}}</u-button>
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
			<u-button :disabled="disabled"  type="primary" @click="login">登录</u-button>
		</view>
		<view class="u-flex u-row-between link u-margin-top-40">
			<text @click="toLogin()">账号密码登录</text>
			<text @click="toRegister()">注册新用户</text>
		</view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
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
				codeTips: '',
				form: {
					username: '',
					code: ''
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
					code: [{
							required: true,
							message: '请输入验证码',
							trigger: ['change', 'blur'],
						},
						{
							type: 'number',
							message: '验证码只能为数字',
							trigger: ['change', 'blur'],
						}
					],
				},
			}
		},
		onReady() {
			this.$refs.uform.setRules(this.rules);
		},
		methods: {
			
			getCode() {
				if (!this.form.username) {
					this.$u.toast("请输入手机号");
					return;
				}
				if (!this.$u.test.mobile(this.form.username)) {
					this.$u.toast("手机号码不正确");
					return;
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码',
						mask: true
					})
					setTimeout(() => {
						uni.hideLoading();
						this.$u.api.getCode(this.form.username).then(res => {
							this.form.code = res.valid_code;
							// 这里此提示会被this.start()方法中的提示覆盖
							this.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						});
					}, 1500);
			
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			codeChange(text) {
				this.codeTips = text;
			},
			
			login() {
				this.$refs.uform.validate(valid => {
					if (valid) {
						this.$u.api.codeLogin(this.form.username, this.form.code).then(res => {
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
			toLogin() {
				this.$u.route('/pages/user/login');
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
