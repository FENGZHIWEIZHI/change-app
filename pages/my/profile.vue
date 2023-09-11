<template>
	<view class="main">
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-text-center u-padding-30 avatar">
			<u-avatar :src="getBaseUrl()+userInfo.avatar" size="140" @click="uploadAvatar()"></u-avatar>
		</view>
		<view class="u-padding-20">
			<u-form :model="form" ref="form" label-width="150">
				<u-form-item label="真实姓名" prop="realName">
					<u-input v-model="form.realName" input-align="right" placeholder="请输入真实姓名"></u-input>
				</u-form-item>
				<u-form-item label="身份证号" prop="idCard">
					<u-input v-model="form.idCard" input-align="right" placeholder="请输入身份证号"></u-input>
				</u-form-item>
				<u-form-item label="联系电话" prop="phonenumber">
					<u-input v-model="form.phonenumber" input-align="right" placeholder="请输入联系电话"></u-input>
				</u-form-item>
				<u-form-item label="现居地址" prop="address">
					<u-input v-model="form.address" input-align="right" placeholder="请输入现居地址"></u-input>
				</u-form-item>
				<u-form-item label="户籍地址" prop="registerPlace">
					<u-input v-model="form.registerPlace" input-align="right" placeholder="请输入户籍地址"></u-input>
				</u-form-item>
				<u-form-item label="性别" prop="sex">
					<u-input v-model="form.sexLabel" type="select" :select-open="sexSelectShow" placeholder="请选择性别"
						@click="sexSelectShow = true" input-align="right"></u-input>
				</u-form-item>
				<u-form-item label="出生日期" prop="birthday">
					<u-input placeholder="选择起始时间" v-model="form.birthday" @click="timeShow=true" input-align="right">
					</u-input>
				</u-form-item>
				<u-form-item label="籍贯" prop="nativePlace">
					<u-input v-model="form.nativePlace" input-align="right" placeholder="请输入籍贯"></u-input>
				</u-form-item>
				<u-form-item label="民族" prop="nation">
					<u-input v-model="form.nationLabel" type="select" :select-open="nationSelectShow"
						placeholder="请选择民族" @click="nationSelectShow = true" input-align="right"></u-input>
				</u-form-item>
				<u-form-item label="文化程度" prop="degree">
					<u-input v-model="form.degreeLabel" type="select" :select-open="degreeSelectShow"
						placeholder="请选择文化程度" @click="degreeSelectShow = true" input-align="right"></u-input>
				</u-form-item>
				<u-form-item label="婚姻状况" prop="marriage">
					<u-input v-model="form.marriageLabel" type="select" :select-open="marriageSelectShow"
						placeholder="请选择婚姻状况" @click="marriageSelectShow = true" input-align="right"></u-input>
				</u-form-item>
				<u-form-item label="职业" prop="career">
					<u-input v-model="form.career" input-align="right" placeholder="请输入职业"></u-input>
				</u-form-item>
			</u-form>
			<view class="position-sticky fixed-bottom">
				<u-button type="primary" @click="handleSave">保存</u-button>
			</view>
		</view>
		<u-select mode="single-column" :list="sexOpts" v-model="sexSelectShow" value-name="dictValue"
			label-name="dictLabel" @confirm="selectSexConfirm"></u-select>
		<u-select mode="single-column" :list="degreeOpts" v-model="degreeSelectShow" value-name="dictValue"
			label-name="dictLabel" @confirm="selectDegreeConfirm"></u-select>
		<u-select mode="single-column" :list="nationOpts" v-model="nationSelectShow" value-name="dictValue"
			label-name="dictLabel" @confirm="selectNationConfirm"></u-select>
		<u-select mode="single-column" :list="marriageOpts" v-model="marriageSelectShow" value-name="dictValue"
			label-name="dictLabel" @confirm="selectMarriageConfirm"></u-select>

		<u-calendar v-model="timeShow" ref="calendar" @change="selectTimeCallBack">
		</u-calendar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '个人信息',
				sexOpts: [],
				nationOpts: [],
				degreeOpts: [],
				marriageOpts: [],

				sexSelectShow: false,
				degreeSelectShow: false,
				nationSelectShow: false,
				marriageSelectShow: false,
				form: {},
				rules: {},
				timeShow: false,
				uploadUrl: ''
			}
		},
		onLoad() {
			this.getProfile();
			this.uploadUrl = this.getBaseUrl() + '/api/user/avatar';
		},
		methods: {
			getProfile() {
				this.$u.api.getUserInfo().then(res => {
					this.form = res.userInfo;
					this.getDics();
				})
			},

			uploadAvatar(index) {

				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera', 'album'], //从相册选择
					success: (res) => {
						if (res.tempFilePaths.length > 0) {
							let filePath = res.tempFilePaths[0];
							uni.uploadFile({
								url: this.uploadUrl, // 后端api接口
								filePath: filePath, // uni.chooseImage函数调用后获取的本地文件路劲
								name: 'file', //后端通过'file'获取上传的文件对象
								header: {
									'Authorization': this.token,
								},
								success: (res) => {
									let data = JSON.parse(res.data); //  uni-app上传完返回的是
									this.$u.vuex('userInfo.avatar', data.fileName);
									this.form.avatar = data.fileName;
								}
							})
						}
					}
				})
			},

			getDics() {
				this.$u.api.getDicts("sys_user_sex").then(response => {
					this.sexOpts = response.data;
					if (this.form.sex) {
						this.form.sexLabel = this.selectDictLabel(this.sexOpts, this.form.sex)
					}
				});
				this.$u.api.getDicts("sys_nation").then(response => {
					this.nationOpts = response.data;
					if (this.form.nation) {
						this.form.nationLabel = this.selectDictLabel(this.nationOpts, this.form.nation)
					}
				});
				this.$u.api.getDicts("sys_degree").then(response => {
					this.degreeOpts = response.data;
					if (this.form.degree) {
						this.form.degreeLabel = this.selectDictLabel(this.degreeOpts, this.form.degree)
					}
				});
				this.$u.api.getDicts("sys_marriage").then(response => {
					this.marriageOpts = response.data;
					if (this.form.marriage) {
						this.form.marriageLabel = this.selectDictLabel(this.marriageOpts, this.form.marriage)
					}
				});

			},
			handleSave() {
				this.$u.api.updateUser(this.form).then(res => {
					this.$u.toast("保存成功");
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
					return
				})
			},

			selectSexConfirm(e) {
				if (e[0]) {
					this.form.sexLabel = e[0].label;
					this.form.sex = e[0].value;
				}
			},


			selectNationConfirm(e) {
				if (e[0]) {
					this.form.nationLabel = e[0].label;
					this.form.nation = e[0].value;
				}
			},


			selectDegreeConfirm(e) {
				if (e[0]) {
					this.form.degreeLabel = e[0].label;
					this.form.degree = e[0].value;
				}
			},

			selectMarriageConfirm(e) {
				if (e[0]) {
					this.form.marriageLabel = e[0].label;
					this.form.marriage = e[0].value;
				}
			},

			selectTimeCallBack(e) {
				this.form.birthday = e.result;
			},



		},
	}
</script>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style scoped lang="scss">
	/* 	/deep/ .uni-input-input {
		text-align: right !important;
	} */
	.avatar {
		background-color: rgb(247, 250, 253);
	}

	.position-sticky {
		background-color: #FFFFFF;
		position: -webkit-sticky !important;
		position: sticky !important;
	}

	.fixed-bottom {
		position: fixed;
		right: 0;
		bottom: calc(var(--window-bottom) + 0px);
		left: 0;
		z-index: 9999;
	}
</style>
