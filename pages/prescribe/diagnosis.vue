<template>
	<view>
		<u-navbar :is-fixed="true" :is-back="true" :title="title" :back-icon-name="backIconName">
		</u-navbar>
		<view class="status u-p-30">
			该处方已审核通过，请在3日内购买，以免过期失效
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
				诊断信息
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">开单时间</view>
				<view class="u-flex-8">{{orderInfo.buyTime}}</view>
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">诊断结果</view>
				<view class="u-flex-8">{{orderInfo.diagnosis?orderInfo.diagnosis:''}}</view>
			</view>
			<view class="u-flex u-col-top u-m-t-20">
				<view class="u-flex-4">处理意见</view>
				<view class="u-flex-8">{{orderInfo.suggest?orderInfo.suggest:''}}</view>
			</view>
			<view class="u-m-t-20 u-font-40 title">
				用药建议
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
		</view>
		<view v-if="orderInfo.valid=='有效'" class="u-p-20 u-flex position-sticky fixed-bottom">
			<view class="u-flex-4">
				<u-button type="primary" @click="handleOldPrescribe">
					原始处方
				</u-button>
			</view>
			<view class="u-flex-4 u-m-l-10">
				<u-button type="primary" @click="handleNewPrescribe">
					新处方
				</u-button>
			</view>
			<view class="u-flex-4 u-m-l-10">
				<u-button type="primary" @click="handleScan">
					扫码开药
				</u-button>
			</view>
		</view>
		<view v-if="orderInfo.valid=='已失效'" class="u-p-20 u-flex position-sticky fixed-bottom">
			<view class="u-flex-6">
				<u-button type="primary" @click="handleOldPrescribe">
					原始处方
				</u-button>
			</view>
			<view class="u-flex-6 u-m-l-10">
				<u-button type="primary" @click="handleNewPrescribe">
					新处方
				</u-button>
			</view>
		</view>
		<u-popup v-model="imgShow" mode="bottom" :closeable="true">
			<image :src="getBaseUrl()+prescribeImg"></image>
		</u-popup>
		<u-popup mode="bottom" v-model="popShow" :closeable="true" border-radius="20">
			<view class="u-flex u-row-center">
				<view class="u-m-t-80">
					<ayQrcode ref="qrcode" :modal="modal_qr" :url="url" @hideQrcode="hideQrcode" :height="150"
						:width="150" />
				</view>
			</view>
			<view class="mwrap">
				<view class="u-flex u-row-around u-padding-40">
					<view class="share">
						<image src="/static/icons/weixin.png"></image>
						<text class="weixin">微信好友</text>
					</view>
					<view class="share" @click="copy()">
						<image src="/static/icons/link.png"></image>
						<text class="copy">复制链接</text>
					</view>
				</view>
				<view class="u-margin-top-20">
					<u-button type="primary" @click.stop="popShow=false"> 取消</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import ayQrcode from "@/components/ay-qrcode/ay-qrcode.vue"
	export default {
		components: {
			ayQrcode,
		},
		data() {
			return {
				title: '处方',
				orderId: '',
				backIconName: 'arrow-leftward',
				orderInfo: {
					id: '',
				},
				patientInfo: {},
				medicineList: [],
				popShow: false,
				imgShow: false,
				prescribeImg: '',
				//二维码相关参数
				modal_qr: false,
				url: 'https://baidu.com/qrcode/scan?reserveNo=', // 要生成的二维码值
			}
		},
		onLoad(options) {
			this.orderId = options.id;
			this.getOrderInfo();
			this.getOrderDetail();
		},
		methods: {
			handleScan() {
				this.popShow = true;
				this.showQrcode();
			},
			// 展示二维码
			showQrcode() {
				this.modal_qr = true;
				// uni.showLoading()
				setTimeout(() => {
					// uni.hideLoading()
					this.$refs.qrcode.crtQrCode()
				}, 50)
			},

			//传入组件的方法
			hideQrcode() {
				this.modal_qr = false;
			},
			handleOldPrescribe() {
				this.prescribeImg = this.orderInfo.oldPrescribe;
				this.imgShow = true;
			},
			handleNewPrescribe() {
				this.prescribeImg = this.orderInfo.newPrescribe;
				this.imgShow = true;
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
					let info = res.data;
					this.$u.api.getDoctor(info.doctorId).then(res => {
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
		font-size: 30rpx;
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

	.mwrap {
		padding: 0rpx 20rpx 40rpx;
		background-color: #FFFFFF;

		image {
			width: 60rpx;
			height: 60rpx;
		}
	}

	.share {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		image {
			width: 100rpx;
			height: 100rpx;
		}

		.weixin {
			color: #70B603;
			margin-top: 10rpx;
		}

		.copy {
			margin-top: 10rpx;
			color: #006ef1;
		}
	}
</style>
