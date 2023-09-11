<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="top">
			<view class="u-font-15 u-font-bold">
				预约信息
			</view>
			<view class="u-flex u-border-bottom doctor">
				<view class="u-flex-2">
					<u-avatar :src="getBaseUrl()+doctorInfo.photo"></u-avatar>
				</view>
				<view class="u-flex-10 u-m-l-30">
					<view>
						{{doctorInfo.name}}
					</view>
					<view class="u-tips-color">
						<text>{{doctorInfo.level}}</text>
						<text class="u-m-l-20"> {{doctorInfo.officeName}}</text>
					</view>
				</view>
			</view>

			<view class="u-m-t-20">
				<view class="u-m-t-10">就诊医院：{{doctorInfo.hospitalName}}</view>
				<view class="u-m-t-10">就诊科室：{{doctorInfo.officeName}}</view>
				<view class="u-m-t-10">门诊时间：{{clinicTime}}</view>
				<view class="u-m-t-10">门诊类型：{{scheduleInfo.type}}</view>
				<view class="u-m-t-10">费用：￥{{scheduleInfo.price}}(医事服务费)</view>
			</view>
		</view>

		<view class="patient">
			<view class="u-font-15 u-font-bold">就诊人信息</view>
			<view class="u-flex u-row-between u-m-t-30">
				<text  class="u-tips-color"> 就诊人</text>
				<text class="u-tips-color" @click="handlepatients" v-if="!form.patientName">请选择就诊人</text>
				<text v-if="form.patientName">{{form.patientName}}</text>
			</view>
		</view>
		<view class="u-m-t-20">
			<lj-pay v-model="form.payType"></lj-pay>
		</view>

		<view class="tips">
			<view class="u-font-15 u-font-bold">温馨提示</view>
			<view class="u-m-t-20 u-font-13">
				医事服务费是由医院设定，平台不收取额外费用<br>

				1、就诊日前一日23:59:59点前，取消预约全额退款。<br>

				2、门诊号是有效资源，如确定不来就诊，预约者要在前一天下午15：00前取消预约，否则将作为爽约一次，对爽约三次以上（包括三次），将取消网上预约资<br>

				3、爽约，不予退款
			</view>
		</view>

		<view class="u-padding-20 u-flex u-row-between position-sticky fixed-bottom">
			<view>支付金额：<text class="u-type-error-dark u-m-l-10 u-font-15">￥{{scheduleInfo.price}}</text></view>
			<view>
				<u-button type="primary" @click="handleAdd" size="medium">支付</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import ljPay from '@/components/lj-pay/lj-pay.vue'
	export default {
		components: {
			ljPay
		},
		onLoad(options) {
			this.form.doctorId = options.doctorId;
			this.form.scheduleId = options.scheduleId;
			this.getDoctorInfo();
			this.getScheduleInfo();
		},
		data() {
			return {
				title: '预约信息',
				form: {
					doctorId: '',
					patientId: '',
					payType: '电子钱包',
					total: '',
					payTotal: '',
					scheduleId: ''
				},

				doctorInfo: {},
				scheduleInfo: {},
				
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

		computed: {
			clinicTime() {
				if (this.scheduleInfo.periodDate) {
					let weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
					let periodDate = this.scheduleInfo.periodDate;
					if (typeof(periodDate) !== 'object') {
						periodDate = periodDate.replace(/-/g, '/');
					} else {
						return "";
					}
					let date = new Date(periodDate);
					return this.scheduleInfo.periodDate + '(' + weekday[date.getDay()] + ')' + this.scheduleInfo
					.periodTime;
				}
				return ""
			}
		},

		methods: {
			// 选择就诊人
			handlepatients() {
				this.$u.route('/pages/patient/index');
			},
			// 获取医生信息
			getDoctorInfo() {
				this.$u.api.getDoctor(this.form.doctorId).then(res => {
					this.doctorInfo = res.data;
				})
			},
			// 获取时间安排信息
			getScheduleInfo() {
				this.$u.api.getSchedule(this.form.scheduleId).then(res => {
					console.log(res)
					this.scheduleInfo = res.data;
				})
			},
			// 添加预约
			handleAdd() {
				if(!this.form.patientId){
					this.$u.toast("请选择就诊人")
					return
				}
				console.log(this.form)
				this.form.total = this.scheduleInfo.price;
				this.form.payTotal = this.scheduleInfo.price;
				this.$u.api.addReservation(this.form).then(res => {
					let orderNo = res.orderNo;
					this.$u.route("/pages/registration/payResult", {
						orderNo
					});
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		padding: 20rpx;
		margin-top: 20rpx;
		background-color: #FFFFFF;
	}

	.patient {
		margin-top: 20rpx;
		background-color: #FFFFFF;
		padding: 20rpx 30rpx;
	}

	.doctor {
		padding: 20rpx 30rpx;
	}

	.tips {
		margin-top: 20rpx;
		background-color: #FFFFFF;
		padding: 20rpx;
		line-height: 30px;
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
