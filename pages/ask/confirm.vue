<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-p-30 u-text-center u-type-primary">
			请15分钟内完成支付，超时订单自动取消
		</view>
		<view class="bg-white">
			<view class="u-flex u-row-between u-p-30 u-border-bottom">
				<view>
					<text>{{orderInfo.type}}</text>
					<text class="u-m-l-20">{{orderInfo.patientName}}</text>
				</view>
				<view>￥{{orderInfo.total}}</view>
			</view>
			<view class="u-p-lr-30" v-show="orderInfo.type=='电话问诊'">
				<u-form :model="form" :rules="rules" ref="form" label-width="150" label-position="left">
					<u-form-item :required="true" label="预约时间" prop="reservTime" label-width="150">
						<u-input type="select" :select-open="selectShow" v-model="form.reservTime" placeholder="选择时间"
							@click="selectShow = true"></u-input>
					</u-form-item>

					<u-form-item :required="true" label="接听电话" prop="tel" label-width="150">
						<u-input placeholder="请输入接听电话" v-model="form.tel" type="number"></u-input>
					</u-form-item>
				</u-form>
			</view>

		</view>


		<view class="u-m-t-20">
			<lj-pay v-model="form.payType"></lj-pay>
		</view>

		<view class="u-margin-top-50 u-p-20 position-sticky fixed-bottom">
			<u-button type="primary" @click="handlePay()">支付</u-button>
		</view>

		<u-select mode="mutil-column" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>

	</view>
</template>

<script>
	import ljPay from '@/components/lj-pay/lj-pay.vue'
	export default {
		components: {
			ljPay
		},
		data() {
			return {
				title: '选择服务方式',
				orderInfo: {},
				form: {
					orderNo: '',
					payType: '电子钱包',
					reservTime: null,
					tel: null
				},
				selectShow: false,
				rules: {
					reservTime: [{
						required: true,
						message: '请选择预约时间',
						trigger: ['change', 'blur'],
					}],
					tel: [{
							required: true,
							message: '请填写接听电话',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}

					],
				},
				weekList: [],
				selectList: [
					[],
					[{
							value: '8:00-12:00',
							label: '8:00-12:00'
						},
						{
							value: '12:00-18:00',
							label: '12:00-18:00'
						},
						{
							value: '18:00-22:00',
							label: '18:00-22:00'
						}
					],
				],
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules);
		},
		onLoad(options) {
			this.form.orderNo = options.orderNo;
			this.getConsultationOrder();
			this.getTimeAndWeek();
			this.assembleSelectList();
		},
		methods: {
			// 获取订单信息
			getConsultationOrder() {
				this.$u.api.getConsultationOrder(this.form.orderNo).then(res => {
					this.orderInfo = res.data;
				})
			},
			// 支付	
			handlePay() {
				if (this.orderInfo.type == '图文问诊') {
					this.$u.api.payConsultation(this.form).then(res => {
						this.$u.route("/pages/ask/payResult", {
							id: this.orderInfo.id
						});
					})
				}
				if (this.orderInfo.type == '电话问诊') {
					this.$refs.form.validate(valid => {
						if (valid) {
							this.$u.api.payConsultation(this.form).then(res => {
								this.$u.route("/pages/ask/payResult", {
									id: this.orderInfo.id
								});
							})
						}
					})
				}
			},

			getTimeAndWeek() {
				//获取当前时间
				var now = new Date();
				//往后几天就循环几次
				for (let i = 0; i < 7; i++) {
					//24 * 3600 * 1000 就是计算一天的时间  
					var date = new Date(now.getTime() + i * 24 * 3600 * 1000);
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var day = date.getDate();
					month = month >= 1 && month <= 9 ? (month = "0" + month) : month;
					day = day >= 0 && day <= 9 ? (day = "0" + day) : day;
					//var dt2 = new Date(now.getTime() + i * 24 * 3600 * 1000);
					var weekDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
					//把七天的时间和星期添加到数组中
					this.weekList.push({
						date: month + '-' + day,
						fullDate: year + '-' + month + '-' + day,
						week: weekDay[date.getDay()],
						today: i == 0 ? true : false,
					});
				}
			},

			assembleSelectList() {
				let list = this.selectList[0];
				this.weekList.forEach(item => {
					list.push({
						value: item.fullDate,
						label: item.fullDate + ' ' + item.week
					})
				})
			},

			// 选择时间回调
			selectConfirm(e) {
				this.form.reservTime = e[0].value + ' ' + e[1].value
			},
		},
	}
</script>

<style scoped>
	.bg-white {
		background-color: #FFFFFF;
	}

	.position-sticky {
		background-color: #FFFFFF;
		position: -webkit-sticky !important;
		position: sticky !important;
	}
</style>
