<template>
	<view>
		<u-navbar :is-back="true" title=""></u-navbar>
		<view class="wrap">
			<view class="type">注册</view>
			<view class="tips">欢迎使用智能充电商用版</view>
			<view class="form">
				<u-form :model="form" :rules="rules" ref="uform" :errorType="errorType" label-position="top">
					<u-form-item label="手机号码" prop="username" :border-bottom="false">
						<u-input v-model="form.username" :border="true" placeholder="请输入手机号码"
							:border-color="borderColor" maxlength="11" />
					</u-form-item>
					<u-form-item label="验证码" prop="code" :border-bottom="false">
						<u-input v-model="form.code" :border="true" placeholder="请输入验证码" type="number"
							:border-color="borderColor" maxlength="6"></u-input>
						<u-button slot="right" type="success" size="mini" @click="getCode">{{codeTips}}</u-button>
					</u-form-item>
					<u-form-item label="密码" prop="password" :border-bottom="false">
						<u-input v-model="form.password" :type="pwdType" :border="true" :password-icon="true"
							placeholder="请输入密码" :border-color="borderColor" />
					</u-form-item>
				</u-form>
			</view>
			<view class="u-flex u-margin-top-40">
				<view class="u-flex">
					<u-checkbox v-model="check" @change="checkboxChange"></u-checkbox>
					<text class="tips">我已阅读并同意<text class="link" @click="toProtocal()">《用户隐私政策》</text></text>
				</view>
			</view>
			<view class="u-margin-top-40">
				<u-button :disabled="disabled" type="primary" @click="register()">立即注册</u-button>
			</view>
			<view class="u-flex u-row-right link u-margin-top-40">
				<text @click="toLogin()">已有账号？立即登录</text>
			</view>
		</view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				errorType: ['toast'],
				pwdType: "password",
				phStyle: "color:#2979ff",
				borderColor: "",
				check: false,
				disabled: true,
				codeTips: '',
				form: {
					username: '',
					code: '',
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
					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['change', 'blur'],
					}],
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
							this.form.code = res.verifyCode;
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
			toProtocal() {
				this.$u.route('/pages/protocal');
			},
			toLogin() {
				this.$u.route('/pages/user/login');
			},
			register() {
				this.$refs.uform.validate(valid => {
					if (valid) {
						console.log('验证通过');
						console.log(this.form)
						this.$u.api.register(this.form).then(res => {
							this.$u.toast("注册成功")
							setTimeout(() => {
								this.$u.route('/pages/user/login');
							}, 1000);
						});
					}
				})
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
	.wrap {
		padding: 30rpx;
	}

	.type {
		font-size: 46rpx;
		margin-bottom: 20rpx;
		color: $u-content-color;
	}

	.tips {
		color: $u-tips-color;
	}

	.form {
		margin-top: 80rpx;
	}

	.link {
		color: $u-type-primary;
	}
</style>
