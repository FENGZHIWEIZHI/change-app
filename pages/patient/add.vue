<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-padding-20">
			<u-form :model="form" ref="form" label-width="200">
				<u-form-item label="姓名" prop="name" :required="true">
					<u-input v-model="form.name" placeholder="请输入姓名">
					</u-input>
				</u-form-item>
				<u-form-item label="性别" prop="sexLabel" :required="true">
					<u-input type="select" v-model="form.sexLabel" @click="sexActionSheetShow = true" placeholder="请选择">
					</u-input>
				</u-form-item>
				<u-form-item label="与本人关系" prop="relationLabel" :required="true">
					<u-input type="select" v-model="form.relationLabel" @click="relatActionSheetShow = true"
						placeholder="请选择">
					</u-input>
				</u-form-item>
				<u-form-item label="身份证号" prop="idCard" :required="true">
					<u-input v-model="form.idCard">
					</u-input>
				</u-form-item>
				<u-form-item label="出生日期" prop="birthday" :required="true">
					<u-input v-model="form.birthday" type="select" @click="birthdayShow = true" placeholder="请选择">
					</u-input>
				</u-form-item>
				<u-form-item label="社保卡号" prop="securityNo" :required="true">
					<u-input v-model="form.securityNo">
					</u-input>
				</u-form-item>
				<u-form-item label="联系电话" prop="telephone" :required="true">
					<u-input v-model="form.tel">
					</u-input>
				</u-form-item>
				<u-form-item label="所在地区" prop="district" :required="true">
					<u-input type="select" v-model="form.district" placeholder="请选择" @click="handleCity">
					</u-input>
				</u-form-item>
			</u-form>
			<view class="u-flex u-m-30">
				<u-button class="u-flex-1 u-m-r-10" type="primary" size="medium" :plain="true" @click="handleDelete">删除</u-button>
				<u-button class="u-flex-1 u-m-l-10" type="primary" size="medium" @click="handleSave">保存</u-button>
			</view>
		</view>
		<u-action-sheet :list="relationOptions" v-model="relatActionSheetShow" @click="handleRelationChange">
		</u-action-sheet>
		<u-action-sheet :list="sexOptions" v-model="sexActionSheetShow" @click="handleSexChange">
		</u-action-sheet>
		<u-calendar v-model="birthdayShow" mode="date" @change="handleBirthdayChange"></u-calendar>
		<u-modal v-model="delModelShow" @confirm="handleDel()" ref="uDelModal" :show-title="false"
			:show-cancel-button="true" @cancel="delModelShow=false" content="确定要删除该就诊人吗？">
		</u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				title: '编辑就诊人',
				relatActionSheetShow: false,
				sexActionSheetShow: false,
				birthdayShow: false,
				relationOptions: [],
				relationDict: [],
				sexDict: [],
				sexOptions: [],
				form: {
					name: '',
					telephone: '',
					idCard: '',
				},
				rules: {
					relationLabel: [{
						required: true,
						message: '与本人关系不能为空',
						trigger: ['change', 'blur'],
					}],
					name: [{
						required: true,
						message: '姓名不能为空',
						trigger: ['change', 'blur'],
					}],
					sexLabel: [{
						required: true,
						message: '性别不能为空',
						trigger: ['change', 'blur'],
					}],
					tel: [{
						required: true,
						message: '手机号不能为空',
						trigger: ['change', 'blur'],
					}],
					idCard: [{
						required: true,
						message: '身份证号不能为空',
						trigger: ['change', 'blur'],
					}],
					securityNo: [{
						required: true,
						message: '社保卡号不能为空',
						trigger: ['change', 'blur'],
					}],
					birthday: [{
						required: true,
						message: '出生日期不能为空',
						trigger: ['change', 'blur'],
					}],
				},
				selectedCity: '',
				delModelShow: false,
				patientId:''
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReady() {
			this.$refs.form.setRules(this.rules);
		},
		onShow() {
			if (this.selectedCity) {
				this.form.district = this.selectedCity;
				this.$forceUpdate();
			}
		},
		onLoad(options) {
			this.$u.api.getDicts("family_relation").then(response => {
				let dictList = response.data;
				this.relationOptions = [];
				this.relationDict = dictList;
				dictList.forEach(dict => {
					this.relationOptions.push({
						text: dict.dictLabel,
						value: dict.dictValue,
					})
				})
			});
			this.$u.api.getDicts("sys_user_sex").then(response => {
				let dictList = response.data;
				this.sexOptions = [];
				this.sexDict = dictList;
				dictList.forEach(dict => {
					this.sexOptions.push({
						text: dict.dictLabel,
						value: dict.dictValue,
					})
				})
			});
			this.$nextTick(function() {
				if (options.id) {
					this.id = options.id
					this.getPatientInfo();
				}
			})
		},
		methods: {
			getPatientInfo() {
				this.$u.api.getPatient(this.id).then(res => {
					this.form = res.data;
					this.form.sexLabel = this.sexFormater(this.form.sex);
					this.form.relationLabel = this.relationFormater(this.form.relation);
					this.patientId = res.data.id;
				})
			},
			sexFormater(value) {
				return this.selectDictLabel(this.sexDict, value);
			},
			relationFormater(value) {
				return this.selectDictLabel(this.relationDict, value);
			},
			handleCity() {
				this.$u.route('/pages/patient/city');
			},
			handleBirthdayChange(date) {
				this.form.birthday = date.result;
			},
			handleSave() {
				this.$refs.form.validate(valid => {
					if (valid) {
						if (this.form.id) {
							this.$u.api.updatePatient(this.form).then(res => {
								this.$u.toast('提交成功');
								uni.navigateBack();
							})
						} else {
							this.$u.api.addPatient(this.form).then(res => {
								this.$u.toast('提交成功');
								uni.navigateBack();
							})
						}
					} else {
						console.log('验证失败');
					}
				});
			},
			handleDelete(){
				this.delModelShow = true;
			},
			handleDel() {
				this.$u.api.delPatient(this.patientId).then(response => {
					this.$refs.uToast.show({
										title: '删除成功',
										type: 'success',
										url: '/pages/patient/index'
									})
				});
			},
			handleRelationChange(index) {
				this.form.relationLabel = this.relationOptions[index].text;
				this.form.relation = this.relationOptions[index].value;
			},
			handleSexChange(index) {
				let sex = this.sexOptions[index].value;
				this.form.sexLabel = this.sexOptions[index].text;
				this.form.sex = sex;
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
