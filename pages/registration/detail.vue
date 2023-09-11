<template>
	<view>
		<u-navbar :is-fixed="true" :is-back="true" :title="title" :back-icon-name="backIconName"></u-navbar>
		<view class="content">
			<view class="u-flex u-row-between u-col-top">
				<view class="title ">
					就诊人信息
				</view>
				<text v-if="info.status=='已取消' || info.status=='已支付'" class="u-type-primary u-font-13"
					@click="delModelShow=true">
					删除订单
				</text>
				<text v-if="info.status=='待支付'" class="u-type-primary u-font-13" @click="delModelShow=true">
					取消订单
				</text>
			</view>
			<view class="u-m-t-30">
				<text>{{info.patientName}}</text>
				<text class="u-m-l-30">{{info.patientSex=='0'?'男':'女'}}</text>
				<text class="u-m-l-30">{{info.patientAge}}岁</text>
				<text class="u-m-l-30">{{info.patientTel}}</text>
			</view>
		</view>

		<view class="content">
			<view class="title">
				挂号信息
			</view>
			<view>
				<u-row>
					<u-col span="3">就诊时间</u-col>
					<u-col span="9">
						<text>{{info.periodDate}} ({{info.weekDay}}) {{info.periodTime}}</text>
					</u-col>
				</u-row>
				<u-row>
					<u-col span="3">就诊医院</u-col>
					<u-col span="9">{{info.hospitalName}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">就诊科室</u-col>
					<u-col span="9">{{info.officeName}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">就诊科室</u-col>
					<u-col span="9">{{info.officeName}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">医生</u-col>
					<u-col span="9">{{info.doctorName}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">门诊类型</u-col>
					<u-col span="9">{{info.clinicType}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">医事服务费</u-col>
					<u-col span="9">￥{{info.total}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">挂号单号</u-col>
					<u-col span="9">{{info.reserveNo}}</u-col>
				</u-row>
			</view>

		</view>

		<view class="content">
			<view class="title">
				订单信息
			</view>
			<view>
				<u-row>
					<u-col span="3">订单编号</u-col>
					<u-col span="9">{{info.orderNo}} <text class="u-m-l-40" @click="copyOrderNo(info.orderNo)">复制</text></u-col>
				</u-row>
				<u-row>
					<u-col span="3">创建时间</u-col>
					<u-col span="9">{{info.createTime}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">支付状态</u-col>
					<u-col span="9">{{info.payStatus}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">应付金额</u-col>
					<u-col span="9">￥{{info.total}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">实际金额</u-col>
					<u-col span="9">￥{{info.payTotal}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">支付方式</u-col>
					<u-col span="9">{{info.payType}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">支付时间</u-col>
					<u-col span="9">{{info.payTime}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">支付流水</u-col>
					<u-col span="9">{{info.payNo}}</u-col>
				</u-row>
			</view>

		</view>

		<view class="tips">
			<view class="title">温馨提示</view>
			<view class="u-m-t-10 u-font-13">
				医事服务费是由医院设定，平台不收取额外费用<br>

				1、就诊日前一日23:59:59点前，取消预约全额退款。<br>

				2、门诊号是有效资源，如确定不来就诊，预约者要在前一天下午15：00前取消预约，否则将作为爽约一次，对爽约三次以上（包括三次），将取消网上预约资<br>
			</view>
		</view>


		<view v-if="info.status=='已支付'" class="u-padding-10 position-sticky fixed-bottom">
			<view>
				<u-button type="primary" @click="handleScan()">扫码取号</u-button>
			</view>
		</view>

		<view v-if="info.status=='待支付'" class="u-padding-10 u-flex u-row-between position-sticky fixed-bottom">
			<view>支付金额：<text class="u-type-error-dark u-m-l-10 u-font-15">￥{{info.total}}</text></view>
			<view>
				<u-button type="primary" @click="toPay()" size="medium">支付</u-button>
			</view>
		</view>

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

		<u-modal v-model="delModelShow" @confirm="handleDel()" ref="uDelModal" :show-title="false"
			:show-cancel-button="true" @cancel="delModelShow=false" content="确定要删除该记录吗？"></u-modal>

		<u-modal v-model="cancelModelShow" @confirm="handleCancel()" ref="uCancelModal" :show-title="false"
			:show-cancel-button="true" @cancel="cancelModelShow=false" content="确定要取消该预约吗？"></u-modal>
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
				backIconName: 'arrow-leftward',
				id: '',
				info: {},
				//二维码相关参数
				modal_qr: false,
				url: 'https://baidu.com/qrcode/scan?reserveNo=', // 要生成的二维码值
				modelContent: "确定要删除该记录吗？",
				delModelShow: false,
				cancelModelShow: false,
				maskShow: false,
				popShow: false,
			}
		},
		computed: {
			title() {
				if (this.info.status) {
					return '预约详情-' + this.info.status
				}
				return '预约详情';
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.getInfo();
		},
		methods: {
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

			getInfo() {
				this.$u.api.getReservation(this.id).then(res => {
					this.info = res.data;
					console.log(this.info);
					this.url = this.url + this.info.reserveNo
				})
			},
			// 处理删除
			handleDel() {
				this.$u.api.delReservation(this.id).then(res => {
					this.$u.toast("删除成功")
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				})
			},
			// 处理取消
			handleCancel() {
				let data = {
					id: this.info.id,
					status: '已取消'
				};
				this.$u.api.updateReservation(data).then(response => {
					this.$u.toast("取消成功");
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				});
			},
			// 跳转支付
			toPay() {
				this.$u.route('/pages/registration/pay', {
					id: this.info.id,
					num:'1'
				});
			},
			//扫码取号
			handleScan() {
				this.popShow = true;
				this.showQrcode();
			},
			// 复制订单号
			copyOrderNo(orderNo) {
				uni.setClipboardData({
					data: orderNo, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功'
						})
					}
				});
			},
			// 复制链接
			copy() {
				uni.setClipboardData({
					data: this.url, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功'
						})
					}
				});
			},

		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 30rpx;
		background-color: #FFFFFF;
		margin-top: 30rpx;
		line-height: 26px;
	}

	.title {
		font-size: 15px;
		font-weight: bold;
		margin-bottom: 30rpx;
	}

	.tips {
		margin-top: 20rpx;
		background-color: #FFFFFF;
		padding: 20rpx;
		line-height: 30px;
		padding-bottom: 70px;
	}

	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.navbar-right {
		margin-right: 24rpx;
		display: flex;
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
