<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="wrap">
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
				<u-button class="u-margin-top-40" type="primary" @click="confirm()">确定</u-button>
			</view>
		</view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "更改手机号码",
				errorType: ['toast'],
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
				}
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
			confirm() {
				this.$u.api.changeTel(this.form).then(res => {
					this.$u.toast("修改成功")
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 50rpx 30rpx;
	}
</style>
