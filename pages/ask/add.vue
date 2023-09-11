<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>

		<view class="content">
			<view class="title"><text class="u-type-error">*</text>就诊人信息</view>
			<view class="u-flex u-row-between u-m-t-30">
				<text class="u-tips-color"> 就诊人</text>
				<text class="u-tips-color" @click="handlepatients" v-if="!form.patientName">请选择就诊人</text>
				<text v-if="form.patientName">{{form.patientName}}</text>
			</view>
		</view>

		<view class="content u-flex u-row-center">
			<view class="u-flex-2">
				<u-avatar :src="getBaseUrl()+doctorInfo.doctorPhoto"></u-avatar>
			</view>
			<view class="u-flex-10">
				<view>{{doctorInfo.name}}</view>
				<view class="u-m-t-20 u-tips-color">
					{{doctorInfo.level}}
					<text class="u-m-l-20">{{doctorInfo.officeName}}</text>
				</view>
			</view>
		</view>

		<view class="content">
			<view class="title"><text class="u-type-error">*</text> 病情描述（症状+持续时间+用药情况）</view>
			<u-input v-model="form.detail" type="textarea" :border="true" height="200" :placeholder="placeText" />

			<view class="u-tips-color u-font-13 u-m-tb-30">上传病例或患处照片；上传化验单、检验报告、CT或核磁照片以便医师全面了解病情（最多9张）</view>
			<u-upload :action="upload.action" :header="upload.header" :file-list="upload.fileList" max-count="9"
				@on-success="handleUploadSuccess" @on-error="handleUploadError" @on-remove="handleUploadRemove">
			</u-upload>

			<view class="u-flex u-m-t-30 u-col-top">
				<u-checkbox v-model="check" @change="checkboxChange"></u-checkbox>
				<text class="tips">授权平台获取病情描述和图片并提供相关服务<text class="link" @click="toProtocal()">《用户授权协议》</text></text>
			</view>
		</view>

		<view class="u-margin-top-50 u-p-20 position-sticky fixed-bottom">
			<u-button :disabled="disabled" type="primary" @click="handleNext()">下一步</u-button>
		</view>

	</view>
</template>

<script>
	export default {


		data() {
			return {
				title: '问诊描述',
				placeText: '请写下病情详情内容，有助于医生快速帮您解决问题',
				disabled: true,
				check: false,
				form: {
					id: '',
					doctorId: '',
					patientId: '',
					type: '',
					total: '',
					payTotal: '',
					detail: '', // 病情描述
					images: '', // 上传图片
					reservTime: '',
					tel: '',
					patientName: ''
				},
				doctorInfo: {},
				upload: {},
				imageList: [],
				selectedPatientId: '',
				selectedPatientName: '',
			}
		},
		onLoad(options) {
			this.form.doctorId = options.doctorId;
			this.form.type = options.type;
			this.getDoctorInfo();
			this.upload = {
				action: this.getBaseUrl() + '/api/common/upload',
				fileList: [],
				header: {
					'Authorization': this.token,
				}
			};

		},
		onShow() {
			if (this.selectedPatientId) {
				this.form.patientId = this.selectedPatientId;
				this.form.patientName = this.selectedPatientName;
				this.$forceUpdate();
			}
		},
		methods: {

			// 获取医生信息
			getDoctorInfo() {
				this.$u.api.getDoctor(this.form.doctorId).then(res => {
					this.doctorInfo = res.data;
				})
			},

			// 选择就诊人
			handlepatients() {
				this.$u.route('/pages/patient/index');
			},

			// 添加问诊
			handleNext() {
				if (!this.form.patientId) {
					this.$u.toast("请选择就诊人");
					return
				}
				if (!this.form.detail) {
					this.$u.toast("请输入病情描述");
					return
				}
				this.form.total = this.form.type == 'text' ? this.doctorInfo.textAskPrice : this.doctorInfo.telAskPrice;
				this.form.type = this.form.type == 'text' ? '图文问诊' : '电话问诊';
				if (this.imageList.length > 0) {
					this.form.images = this.imageList.join()
				}
				if (!this.form.id) {
					this.$u.api.addConsultation(this.form).then(res => {
						console.log(res)
						let order = res.data;
						this.form.id = order.id;
						this.$u.route("/pages/ask/confirm", {
							orderNo: order.orderNo
						});
					})
				} else {
					this.$u.api.updateConsultation(this.form).then(res => {
						console.log(res)
						let order = res.data;
						this.$u.route("/pages/ask/confirm", {
							orderNo: order.orderNo
						});
					})

				}
			},

			// 勾选版权协议
			checkboxChange(e) {
				this.disabled = !this.disabled;
			},

			handleUploadRemove(index, lists, name) {
				this.imageList.splice(index, 1)
			},
			handleUploadSuccess(data, index, lists, name) {
				this.imageList.push(
					data.fileName,
				);
			},


		}
	}
</script>

<style lang="scss" scoped>
	.content {
		margin-top: 20rpx;
		background-color: #FFFFFF;
		padding: 20rpx 30rpx;
	}

	.title {
		font-size: 15px;
		font-weight: bold;
		margin-bottom: 30rpx;
	}


	.tips {
		color: $u-tips-color;
	}

	.link {
		color: $u-type-error-dark;
	}

	.position-sticky {
		background-color: #FFFFFF;
		position: -webkit-sticky !important;
		position: sticky !important;
	}
</style>
