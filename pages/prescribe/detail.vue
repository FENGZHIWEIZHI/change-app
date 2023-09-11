<template>
	<view>
		<u-navbar :is-fixed="true" :is-back="true" :title="title" :back-icon-name="backIconName">
		</u-navbar>
		<view class="status u-p-30">
			{{orderInfo.status}}
		</view>
		<view class="info u-p-l-30 info">
			<view class="u-font-40 u-p-t-30 title">
				开药
			</view>
			<view class=" u-font-40 u-m-t-20 title">
				就诊人信息
			</view>
			<view class="u-m-t-20">
				{{patientInfo.name}} {{patientInfo.sex=='0'?'男':'女'}} {{patientInfo.age?(patientInfo.age+'岁'):''}}
				{{patientInfo.tel}}
			</view>
			<view class="u-m-t-20 u-font-40 title">
				咨询医生
			</view>
			<view class="u-flex u-m-t-20">
				<view class="u-flex-2">
					<u-avatar :src="getBaseUrl()+orderInfo.doctorPhoto"></u-avatar>
				</view>
				<view class="u-flex-10 u-m-l-10">
					<view>
						{{orderInfo.doctorName}} {{orderInfo.doctorLevel}} {{orderInfo.officeName}}
					</view>
					<view>
						{{orderInfo.hospitalName}}
					</view>
				</view>
			</view>
			<view class="u-m-t-20 u-font-40 title">
				开药清单
			</view>
			<view v-for="(item,index) in medicineList" :key="index" class="u-flex u-border-bottom u-m-t-20">
				<view class="u-flex-2">
					<image :src="getBaseUrl()+item.medicineCover" class="cover"></image>
				</view>
				<view class="u-flex-10">
					<view>{{item.medicineName}}</view>
					<view>{{item.dosage}}</view>
					<view>{{item.price}}×{{item.amount}}</view>
				</view>
			</view>
			<view class="u-m-t-20 u-font-40 title">
				病情描述
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">所患疾病</view>
				<view class="u-flex-8">{{orderInfo.sick}}</view>
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">肝功能</view>
				<view class="u-flex-8">{{orderInfo.liverFunction}}</view>
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">肾功能</view>
				<view class="u-flex-8">{{orderInfo.renalFunction}}</view>
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">过敏史</view>
				<view class="u-flex-8">{{orderInfo.allergicHistory}}</view>
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">生育计划或状态</view>
				<view class="u-flex-8">{{orderInfo.fertilityStatus}}</view>
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">病情描述</view>
				<view class="u-flex-8">{{orderInfo.sickDesc}}</view>
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">处方</view>
				<view class="u-flex-8">
					<image :src="getBaseUrl()+orderInfo.oldPrescribe" class="chufang"></image>
				</view>
			</view>
			<view class="u-m-t-20 u-font-40 u-m-t-20 title">
				订单信息
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">订单编号</view>
				<view class="u-flex-8">{{orderInfo.orderNo}}</view>
			</view>
			<view v-if="orderInfo.buyTime" class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">创建时间</view>
				<view class="u-flex-8">{{orderInfo.buyTime}}</view>
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">支付状态</view>
				<view class="u-flex-8">{{orderInfo.payStatus}}</view>
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">应付金额</view>
				<view class="u-flex-8">￥{{orderInfo.total?orderInfo.total:0}}</view>
			</view>
			<view v-if="orderInfo.payTotal" class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">实付金额</view>
				<view class="u-flex-8">￥{{orderInfo.payTotal}}</view>
			</view>
			<view v-if="orderInfo.payType" class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">支付方式</view>
				<view class="u-flex-8">￥{{orderInfo.payType}}</view>
			</view>
			<view v-if="orderInfo.payNo" class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">支付流水</view>
				<view class="u-flex-8">￥{{orderInfo.payNo}}</view>
			</view>
			<view v-if="orderInfo.payTime" class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">支付日期</view>
				<view class="u-flex-8">￥{{orderInfo.payTime}}</view>
			</view>
		</view>
		<view v-if="orderInfo.status=='已取消' || orderInfo.status=='已完成'" class="u-p-20 position-sticky fixed-bottom">
			<u-button type="primary" @click="delModelShow=true">
				删除订单
			</u-button>
		</view>
		<view v-if="orderInfo.status=='待支付'||orderInfo.status=='未支付'||orderInfo.status=='待接诊'"
			class="u-p-20 position-sticky fixed-bottom u-flex">
			<view v-if="orderInfo.status=='待支付'||orderInfo.status=='未支付'" class="u-flex-6 u-p-r-10">
				<u-button type="primary" :plain="true" @click="toPay">支付</u-button>
			</view>
			<view v-if="orderInfo.status=='待支付'||orderInfo.status=='未支付'||orderInfo.status=='待接诊'" class="u-flex-6">
				<u-button type="primary" @click="cancelModelShow=true">
					取消订单
				</u-button>
			</view>
		</view>
		<u-modal v-model="delModelShow" @confirm="handleDel()" ref="uDelModal" :show-title="false"
			:show-cancel-button="true" @cancel="delModelShow=false" content="确定要删除该记录吗？"></u-modal>

		<u-modal v-model="cancelModelShow" @confirm="handleCancel()" ref="uCancelModal" :show-title="false"
			:show-cancel-button="true" @cancel="cancelModelShow=false" content="确定要取消该预约吗？"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '开药详情',
				orderId: '',
				backIconName: 'arrow-leftward',
				orderInfo: {
					id: '',
				},
				patientInfo: {},
				medicineList: [],
				delModelShow: false,
				cancelModelShow: false
			}
		},
		onLoad(options) {
			console.log(options);
			this.orderId = options.id;
			this.getOrderInfo();
			this.getOrderDetail();
		},
		methods: {
			// 处理删除逻辑
			handleDel() {
				this.$u.api.deletePrescribeOrder(this.orderInfo.id).then(response => {
					this.$u.toast("删除成功");
					uni.navigateBack();
				});
			},
			// 处理取消订单逻辑
			handleCancel() {
				this.orderInfo.status = '已取消';
				this.$u.api.updatePrescribeOrder(this.orderInfo).then(response => {
					this.$u.toast("取消成功");
					uni.navigateBack();
				});
			},
			toPay() {
				this.$u.route({
					url: '/pages/prescribe/pay',
					type: 'redirect',
					params: {
						id: this.orderInfo.id
					}
				});
			},
			getOrderInfo() {
				this.$u.api.getPrescribeOrderInfo(this.orderId).then(res => {
					console.log(res.data);
					let info = res.data;
					this.$u.api.getDoctor(info.doctorId).then(res => {
						// console.log(res.data);
						let doctor = res.data;
						info.doctorName = doctor.name;
						info.doctorPhoto = doctor.photo;
						info.doctorLevel = doctor.level;
						info.officeName = doctor.officeName;
						info.hospitalName = doctor.hospitalName;
						this.orderInfo = info;
						this.$u.api.getPatient(this.orderInfo.patientId).then(res => {
							this.patientInfo = res.data;
						})
					})
				})
			},
			getOrderDetail() {
				this.$u.api.getMedicineDetail({
					orderId: this.orderId
				}).then(res => {
					this.medicineList = res.data;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.status {
		background-color: $uni-color-primary;
		color: #fff;
		font-size: 40rpx;
	}

	.info {
		.cover {
			width: 100rpx;
			height: 100rpx;
		}

		.title {
			font-weight: bold;
		}

		.chufang {
			width: 400rpx;
			height: 300rpx;
		}
	}

	.navbar-right {
		margin-right: 24rpx;
		display: flex;
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
