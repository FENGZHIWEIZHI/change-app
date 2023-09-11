<template>
	<view>
		<u-navbar :is-back="false" :title="title"></u-navbar>
		<view class="top">
			<view>
				<image src="/static/icons/right.png" class="icon"></image>
			</view>
			<view class="u-font-lg u-margin-top-40 u-font-bold">预约成功</view>
		</view>

		<view class="u-m-t-60 u-p-20 content">
			<view>
				<text class="u-p-l-60">
					{{info.patientName}}您已成功预约到{{info.hospitalName}}{{info.officeName}}{{info.doctorLevel}}号，预约成功短信已发送到手机{{tel}}
				</text>
			</view>
			<view>
				<text class="u-p-l-60">
					请于{{info.periodDate}} {{info.periodTime}}就诊，如不就诊请于{{cancelDate}} 15:00前取消。
				</text>
			</view>
			<view class="u-type-error-dark u-m-t-40">
				<view class="u-m-t-20">
					<text　class="u-p-l-60">取号地点： 门诊6号楼1层挂号处</text>
				</view>
				<view class="u-m-t-20">
					<text class="u-p-l-60">取号时间： {{pickCodeTime}}</text>
				</view>
			</view>
		</view>
		<view class="u-padding-20 u-margin-top-60">
			<view>
				<u-button type='primary' @click="toDetail()">查看预约详情</u-button>
			</view>
			<view class="u-margin-top-40">
				<u-button type='primary' :plain="true" @click="toHome()">返回首页</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '预约成功',
				orderNo:'',
				info: {}
			}
		},
		computed: {
			cancelDate() {
				if (this.info.periodDate) {
					return this.getNextDate(this.info.periodDate, -1);
				}
				return ""
			},
			tel() {
				if (this.info.patientTel) {
					return this.info.patientTel.substring(0, 3) + "****" + this.info.patientTel.substring(7)
				}
				return ''
			},
			pickCodeTime() {
				if (this.info.periodTime) {
					let tmp = this.info.periodTime.substring(0, 2);
					tmp = parseInt(tmp) - 1;
					tmp = tmp < 10 ? "0" + tmp : tmp;
					return this.info.periodDate + ' ' + tmp + ':00-' + this.info.periodTime;
				}
				return ''
			}
		},



		onLoad(options) {
			this.orderNo = options.orderNo;
			this.getOrderInfo();
		},

		methods: {
			// 获取订单详情
			getOrderInfo() {
				this.$u.api.getReservationOrder(this.orderNo).then((res) => {
					console.log(res)
					this.info = res.data;
				})
			},
			// 跳转详情
			toDetail() {
				this.$u.route('/pages/registration/detail', {
					id: this.info.id
				});
			},
			// 返回首页
			toHome() {
				this.$u.route({
					url: '/pages/home',
					type: 'tab'
				})
			},

			getNextDate(date, day) {
				if (typeof(date) !== 'object') {
					date = date.replace(/-/g, '/');
				}
				var dd = new Date(date);
				dd.setDate(dd.getDate() + day);
				var y = dd.getFullYear();
				var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
				var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
				return y + "-" + m + "-" + d;
			},

		}
	}
</script>

<style lang="scss" scoped>
	.top {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 50px;
	}
	.content{
		line-height: 30px;
	}
	.icon{
		width: 50px;
		height: 50px;
	}
	.indent{
		text-indent: 50px;
	}
</style>
