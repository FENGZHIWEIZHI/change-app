<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-padding-20">
			<u-form :model="form" :rules="rules" ref="uform" :errorType="errorType" label-position="top">
				<u-form-item label="旧密码" prop="oldPassword" :border-bottom="false">
					<u-input v-model="form.oldPassword" :type="pwdType" :border="true" :password-icon="true"
						placeholder="请输入旧密码" />
				</u-form-item>

				<u-form-item label="新密码" prop="newPassword" :border-bottom="false">
					<u-input v-model="form.newPassword" :type="pwdType" :border="true" :password-icon="true"
						placeholder="请输入新密码" />
				</u-form-item>

				<u-form-item label="再次输入" prop="reNewPassword" :border-bottom="false">
					<u-input v-model="form.reNewPassword" :type="pwdType" :border="true" :password-icon="true"
						placeholder="请再次输入密码" />
				</u-form-item>
			</u-form>
			<u-button class="u-margin-top-40" type="primary" @click="confirm()">确定</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "修改密码",
				errorType: ['toast'],
				pwdType: "password",
				form: {
					oldPassword: '',
					newPassword: '',
					reNewPassword: '',
				},
				rules: {
					oldPassword: [{
						required: true,
						message: '请输入密码',
						trigger: ['change', 'blur'],
					}],
					newPassword: [{
						required: true,
						message: '请输入新密码',
						trigger: ['change', 'blur'],
					}],
					reNewPassword: [{
							required: true,
							message: '请再次输入密码',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return value === this.form.newPassword;
							},
							message: '两次输入的密码不相等',
							trigger: ['change', 'blur'],
						}
					]
				},
			}
		},
		onReady() {
			this.$refs.uform.setRules(this.rules);
		},
		methods: {
			confirm() {
				this.$refs.uform.validate(valid => {
					if (valid) {
						this.$u.api.resetPwd(this.form).then(res => {
							this.$u.toast("密码修改成功")
							setTimeout(() => {
								uni.navigateBack();
							}, 1500);
						});
					}
				})
			}

		}
	}
</script>

