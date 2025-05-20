<template>
	<view>
		<u-navbar :is-back="true" title="忘记密码"></u-navbar>
		<view class="u-padding-40">
			<u-form :model="form" :rules="rules" ref="uform" :errorType="errorType" label-position="top">
				<u-form-item label="新密码" prop="password" :border-bottom="false">
					<u-input v-model="form.password" :type="pwdType" :border="true" :password-icon="true"
						placeholder="请输入新密码" />
				</u-form-item>

				<u-form-item label="再次输入" prop="rePassword" :border-bottom="false">
					<u-input v-model="form.rePassword" :type="pwdType" :border="true" :password-icon="true"
						placeholder="请输入新密码" />
				</u-form-item>
			</u-form>
			<view class="u-margin-top-40">
				<u-button :disabled="disabled" type="primary" @click="confirm()">确定</u-button>
			</view>
			
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				errorType: ['toast'],
				pwdType: "password",
				form: {
					phonenumber: '',
					password: '',
					rePassword: ''
				},
				rules: {
					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['change', 'blur'],
					}],
					rePassword: [
						{
							required: true,
							message: '请再次输入密码',
							trigger: ['change','blur'],
						},
						{
							validator: (rule, value, callback) => {
								return value === this.form.password;
							},
							message: '两次输入的密码不相等',
							trigger: ['change','blur'],
						}
					],
				},
			}
		},
		computed: {
			disabled() {
				return this.form.password && this.form.rePassword ? false : true;
			}
		},
		onLoad(option) {
			this.form.phonenumber = option.phonenumber
		},
		onReady() {
			this.$refs.uform.setRules(this.rules);
		},
		methods: {
			confirm() {
				this.$refs.uform.validate(valid => {
					if (valid) {
						console.log(this.form)
						this.$u.api.setPwd(this.form).then(res => {
							this.$refs.uToast.show({
								title: '密码重置成功',
								url: '/pages/user/login',
							})
						});
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>
