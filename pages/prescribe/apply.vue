<template>
	<view class="main">
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-p-lr-20 form">
			<u-form :model="form" :rules="rules" ref="form" label-width="150" label-position="top">
				<u-form-item label="就诊人信息" prop="patientName" :required="true">
					<u-input v-model="form.patientId" v-show="false">
					</u-input>
					<u-input v-model="form.patientName" @click="handlepatients" placeholder="请选择就诊人" disabled>
					</u-input>
				</u-form-item>
				<view class="u-p-20 tip">请如实填写，便于医生准确了解您的病情和用药需求</view>
				<u-form-item label="所患疾病" prop="sick" :required="true">
					<u-input v-model="form.sick" placeholder="请填写疾病名称,如:高血压">
					</u-input>
				</u-form-item>
				<u-form-item label="肝功能" prop="liverFunction" :required="true">
					<u-radio-group v-model="form.liverFunction" :wrap="false">
						<u-radio shape="circle" v-for="(item, index) in liverList" :key="index" :name="item.dictLabel">
							{{ item.dictLabel }}
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="肾功能" prop="renalFunction" :required="true">
					<u-radio-group v-model="form.renalFunction" :wrap="false">
						<u-radio shape="circle" v-for="(item, index) in renalList" :key="index" :name="item.dictLabel">
							{{ item.dictLabel }}
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="过敏史" prop="allergicHistory" :required="true">
					<u-radio-group v-model="form.allergicHistory" :wrap="false">
						<u-radio shape="circle" v-for="(item, index) in allergicList" :key="index"
							:name="item.dictLabel">
							{{ item.dictLabel }}
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="生育计划或状态" prop="fertilityStatus" :required="true">
					<u-radio-group v-model="form.fertilityStatus" :wrap="false">
						<u-radio shape="circle" v-for="(item, index) in fertilityList" :key="index"
							:name="item.dictLabel">
							{{ item.dictLabel }}
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label=" 病情描述（症状+持续时间+用药情况）" prop="sickDesc" :required="true">
					<u-input v-model="form.sickDesc" type="textarea" height="300" placeholder="请写下病情详情内容，有助于医生快速帮您解决问题">
					</u-input>
				</u-form-item>
				<u-form-item label="上传处方" prop="oldPrescribe" :required="true">
					<u-input v-show="false" v-model="form.oldPrescribe"></u-input>
					<view class="u-flex">
						<view class="u-flex-4">
							<u-upload name="file" :action="upload.action" :header="upload.header"
								:file-list="upload.fileList" :multiple="false" max-count="1"
								@on-success="handleUploadSuccess" @on-error="handleUploadError"
								@on-remove="handleUploadRemove">
							</u-upload>
						</view>
						<view class="u-flex-8">请如实上传处方凭证，否则一切后果由患者自负</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view class="u-padding-10 position-sticky fixed-bottom">
			<u-button type="primary" @click="handleSave">选择药品</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '填写病情',
				liverList: [],
				renalList: [],
				allergicList: [],
				fertilityList: [],
				form: {
					patientId: '',
					sick: '',
					sickDesc: '',
					oldPrescribe: '',
				},
				rules: {
					patientId: [{
						required: true,
						message: '请选择就诊人',
						trigger: ['change', 'blur'],
					}],
					sick: [{
						required: true,
						message: '请填写所患疾病',
						trigger: ['change', 'blur'],
					}],
					liverFunction: [{
						required: true,
						message: '请选择肝功能',
						trigger: ['change', 'blur'],
					}],
					renalFunction: [{
						required: true,
						message: '请选择肾功能',
						trigger: ['change', 'blur'],
					}],
					allergicHistory: [{
						required: true,
						message: '请选择过敏史',
						trigger: ['change', 'blur'],
					}],
					fertilityStatus: [{
						required: true,
						message: '请选择生育计划或状态',
						trigger: ['change', 'blur'],
					}],
					sickDesc: [{
						required: true,
						message: '请输入病情描述',
						trigger: ['change', 'blur'],
					}],
					oldPrescribe: [{
						required: true,
						message: '请上传处方',
						trigger: ['change', 'blur'],
					}]
				},
				upload: {},
				selectedPatientId: '',
				selectedPatientName: '',
			}
		},
		onShow() {
			if (this.selectedPatientId) {
				this.form.patientId = this.selectedPatientId;
				this.form.patientName = this.selectedPatientName;
				this.$forceUpdate();
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules);
		},
		onLoad(options) {
			this.form.doctorId = options.doctorId;
			this.upload = {
				action: this.getBaseUrl() + '/api/common/upload',
				fileList: [],
				header: {
					'Authorization': this.token,
				}
			};
			this.$u.api.getDicts("liver_function").then(response => {
				this.liverList = response.data;
			});
			this.$u.api.getDicts("renal_function").then(response => {
				this.renalList = response.data;
			});
			this.$u.api.getDicts("allergic_history").then(response => {
				this.allergicList = response.data;
			});
			this.$u.api.getDicts("fertility_status").then(response => {
				this.fertilityList = response.data;
			});
		},
		methods: {
			handlepatients() {
				this.$u.route('/pages/patient/index');
			},
			handleUploadRemove(index, lists, name) {
				this.form.oldPrescribe = '';
			},
			handleUploadSuccess(data, index, lists, name) {
				this.form.oldPrescribe = data.fileName;
			},
			handleUploadError(res, index, lists, name) {
				this.$u.toast('上传失败！');
			},
			handleSave() {
				this.$refs.form.validate(valid => {
					if (valid) {
						if (this.form.id) {
							this.$u.api.updatePrescribeOrder(this.form).then(res => {
								//this.$u.toast('提交成功');
								this.$u.route('/pages/prescribe/medicine', {
									orderId: this.form.id
								})
							})
						} else {
							this.$u.api.addPrescribeOrder(this.form).then(res => {
								let order = res.data;
								this.form.id = order.id;
								console.log(order.id);
								//this.$u.toast('提交成功');
								this.$u.route('/pages/prescribe/medicine', {
									orderId: order.id
								})
							})
						}
					} else {
						console.log('验证失败');
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form {
		background-color: #fff;

		.tip {
			background-color: $main-bg-color;
			color: #E54A48;
			font-size: 30rpx;
		}
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
