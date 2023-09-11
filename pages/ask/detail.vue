<template>
	<view>
		<u-navbar :is-fixed="true" :is-back="true" :title="title" :back-icon-name="backIconName"></u-navbar>
		<view class="top">
			<view v-if="info.status == '待支付'">
				待支付 <text class="u-font-13">（请15分钟内完成支付，超时订单自动取消）</text>
			</view>
			<view v-if="info.status == '待接诊'">
				已支付 <text class="u-font-13">{{'（到'+overdue+'仍未接诊,系统自动退款）'}}</text>
			</view>
			<view v-if="info.type=='图文问诊' && info.status == '问诊中'">
				问诊中
			</view>
			<view v-if="info.type=='电话问诊' && info.status == '问诊中'">
				已接诊 — 请注意接听来电
			</view>
			<view v-if="info.status == '已完成'">
				已完成
			</view>
			<view v-if="info.status == '已取消'">
				订单已取消 超时未支付
			</view>
		</view>
		<view class="bg-white u-p-20 u-font-bold">
			专家问诊 — {{info.type}}
		</view>

		<view class="content">
			<view class="title">
				就诊人信息
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
				咨询医生
			</view>
			<view class="u-flex u-row-center">
				<view class="u-flex-2">
					<u-avatar :src="getBaseUrl()+ info.doctorPhoto"></u-avatar>
				</view>
				<view class="u-flex-10 u-m-l-10">
					<view>{{info.doctorName}} <text class="u-m-l-20">{{info.doctorLevel}}</text><text
							class="u-m-l-20">{{info.officeName}}</text></view>
					<view class="u-m-t-20 u-tips-color">
						{{info.hospitalName}}
					</view>
				</view>
			</view>
		</view>

		<view class="content">
			<view class="title">
				病情描述
			</view>
			<view class="detail">
				{{info.detail}}
			</view>
		</view>

		<view class="content">
			<view class="title">
				订单信息
			</view>
			<view>
				<u-row>
					<u-col span="3">订单编号</u-col>
					<u-col span="9">{{info.orderNo}} <text class="u-m-l-40" @click="copyOrderNo(info.orderNo)">复制</text>
					</u-col>
				</u-row>
				<u-row>
					<u-col span="3">创建时间</u-col>
					<u-col span="9">{{info.createTime}}</u-col>
				</u-row>
				<u-row>
					<u-col span="3">支付状态</u-col>
					<u-col span="9">
						<text v-if="info.payStatus=='未支付'" class="u-type-error-dark">{{info.payStatus}}</text>
						<text v-else>{{info.payStatus}}</text>
					</u-col>
				</u-row>
				<u-row>
					<u-col span="3">应付金额</u-col>
					<u-col span="9">￥{{info.total}}</u-col>
				</u-row>
				<u-row v-if="info.status !=='待支付'">
					<u-col span="3">实际金额</u-col>
					<u-col span="9">￥{{info.payTotal}}</u-col>
				</u-row>
				<u-row v-if="info.status !=='待支付'">
					<u-col span="3">支付方式</u-col>
					<u-col span="9">{{info.payType}}</u-col>
				</u-row>
				<u-row v-if="info.status !=='待支付'">
					<u-col span="3">支付时间</u-col>
					<u-col span="9">{{info.payTime}}</u-col>
				</u-row>
				<u-row v-if="info.status !=='待支付'">
					<u-col span="3">支付流水</u-col>
					<u-col span="9">{{info.payNo}}</u-col>
				</u-row>
			</view>

		</view>

		<view v-if="info.type=='图文问诊' && info.status=='问诊中'" class="u-padding-10 position-sticky fixed-bottom">
			<view>
				<u-button type="primary" @click="toIM()">继续沟通</u-button>
			</view>
		</view>

		<view v-if="info.status=='待支付'" class="u-padding-10 u-flex u-row-between position-sticky fixed-bottom">
			<view>支付金额：<text class="u-type-error-dark u-m-l-10 u-font-15">￥{{info.total}}</text></view>
			<view>
				<u-button type="primary" @click="toPay()" size="medium">支付</u-button>
			</view>
		</view>
		
		<view v-if="info.type=='图文问诊' && info.status=='已完成'" class="u-padding-10 u-flex u-row-around position-sticky fixed-bottom">
			<view class="u-flex-4 u-m-r-10">
				<u-button type="primary" :plain="true" @click="handleComment()" >服务评价</u-button>
			</view>
			<view class="u-flex-4 u-m-r-10">
				<u-button type="primary" @click="toIM()" >沟通记录</u-button>
			</view>
			<view class="u-flex-4 u-m-r-10">
				<u-button type="primary" @click="delModelShow=true">删除订单</u-button>
			</view>
		</view>
		
		<view v-if="info.type=='电话问诊' && info.status=='已完成'" class="u-padding-10 u-flex u-row-around position-sticky fixed-bottom">
			<view class="u-flex-6 u-p-r-10">
				<u-button type="primary" @click="handleComment()" :plain="true">服务评价</u-button>
			</view>
			<view class="u-flex-6">
				<u-button type="primary" @click="delModelShow=true" >删除订单</u-button>
			</view>
		</view>


		<u-modal v-model="delModelShow" @confirm="handleDel()" ref="uDelModal" :show-title="false"
			:show-cancel-button="true" @cancel="delModelShow=false" content="确定要删除该记录吗？"></u-modal>

		<u-modal v-model="cancelModelShow" @confirm="handleCancel()" ref="uCancelModal" :show-title="false"
			:show-cancel-button="true" @cancel="cancelModelShow=false" content="确定要取消该订单吗？"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				backIconName: 'arrow-leftward',
				id: '',
				info: {},
				modelContent: "确定要删除该记录吗？",
				delModelShow: false,
				cancelModelShow: false,
				maskShow: false,
			}
		},
		computed: {
			title() {
				if (this.info.status) {
					return '问诊详情-' + this.info.status
				}
				return '问诊详情';
			},
			overdue(){
				let timestamp = Date.parse(new Date(this.info.payTime));
				timestamp = timestamp/1000;
				timestamp += 86400
				let newDate = new Date(timestamp*1000).format('yyyy-MM-dd hh:mm:ss')
				return  newDate
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.getInfo();
		},
		methods: {
			getInfo() {
				this.$u.api.getConsultation(this.id).then(res => {
					this.info = res.data;
				})
			},
			
			 function(format) {
			    var date = {
			        "M+": this.getMonth() + 1,
			        "d+": this.getDate(),
			        "h+": this.getHours(),
			        "m+": this.getMinutes(),
			        "s+": this.getSeconds(),
			        "q+": Math.floor((this.getMonth() + 3) / 3),
			        "S+": this.getMilliseconds()
			    };
			    if (/(y+)/i.test(format)) {
			        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
			    }
			    for (var k in date) {
			        if (new RegExp("(" + k + ")").test(format)) {
			            format = format.replace(RegExp.$1, RegExp.$1.length == 1
			                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
			        }
			    }
			    return format;
			},
			// 处理删除
			handleDel() {
				this.$u.api.delConsultation(this.id).then(res => {
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
				this.$u.route('/pages/ask/pay', {
					id: this.info.id
				});
			},
			
			handleComment(){
				this.$u.route('/pages/doctor/comment', {
					type:'1',
					doctorId:this.info.doctorId,
					referId:this.info.id
				});
			},
			
			toIM(){
				this.$u.route('/pages/message/detail',{
					doctorId:this.info.doctorId,
					doctorName:this.info.doctorName
				})
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
	.top {
		padding: 30rpx;
		background-color: $u-type-primary;
		color: #FFFFFF;
	}

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

	.detail {
		line-height: 30px;
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
