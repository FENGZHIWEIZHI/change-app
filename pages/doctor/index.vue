<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="top">
			<view class="u-flex u-col-top">
				<view class="u-flex-2">
					<u-avatar :src="getBaseUrl()+info.photo"></u-avatar>
				</view>
				<view class="u-flex-10 content">
					<view class="title"><text class="u-font-15">{{info.name}} </text><text class="u-m-l-20" @click="toDocDetail()">
							查看简介</text></view>
					<view class="u-m-t-10">{{info.level}} <text class="u-m-l-20">{{info.officeName}}</text></view>
					<view class="u-m-t-10">{{info.hospitalLevel}}
						<text class="u-m-l-20" @click="toHospital()">{{info.hospitalName}}</text>
					</view>
					<view class="u-m-t-10">
						擅长：{{info.skill}}
					</view>
					<view class="u-m-t-10">
						咨询量 {{info.askCount}}     <text class="u-m-l-20">平均响应时间 {{info.answerDuration}}分钟</text>
					</view>
				</view>
			</view>
		</view>

		<view class="u-m-t-20 u-p-20 u-flex u-row-around u-col-center">
			<view class=""><u-button type="primary"  @click="handleAsk()">在线问诊</u-button></view>
			<view class=""><u-button type="primary"  @click="handleRegistration()">预约挂号</u-button></view>
			<view class=""><u-button type="primary" @click="handlePrescribe()">复诊/开药</u-button></view>
		</view>
		
		
		<view class="comment-list">
			<view class="u-flex u-row-between u-m-b-20">
				<text class="u-font-bold">患者评价</text>
				<text>好评率{{info.goodRate}}%</text>
			</view>
			<view v-if="commentList.length==0" class="u-text-center u-type-primary">
				<text>暂无评论</text>
			</view>
			<view v-if="commentList.length>0">
				<lj-comment-item v-for="(item, index) in commentList" :key="item.id" :comment="item"> </lj-comment-item>
				<u-loadmore margin-top=" 20" :status="loadStatus" />
			</view>
		</view>
		


	</view>
</template>

<script>
	import ljCommentItem from '@/components/li-comment-item/li-comment-item.vue'
	export default {
		components: {
			ljCommentItem
		},
		data() {
			return {
				title: '医生主页',
				id: '',
				searchDate: this.$u.date(null, 'yyyy-mm-dd'),
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					doctorId: '',
				},
				info:{},
				commentList:[],
				loadStatus: 'loadmore',
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.getInfo();
		},
		computed: {
		},
		
		onShow() {
			this.resetPage();
			this.getCommemtList();
		},
		onReachBottom() {
			if (this.loadStatus !== "nomore") {
				this.loadStatus = "loading";
				this.queryParams.pageNum++;
				this.getCommemtList();
			}
		},
		methods: {

			// 获取医生详情
			getInfo() {
				this.$u.api.getDoctor(this.id).then(res => {
					this.info = res.data;
					this.loaded = true;
					this.info.goodRate = (this.info.score * 100 /5).toFixed(0)
				})
			},
			resetPage() {
				this.pageNum = 1;
				this.pageSize = 10;
				this.commentList = [];
			},
			// 获取评论列表
			getCommemtList() {
				this.queryParams.doctorId = this.id;
				this.$u.api.getDoctorCommentList(this.queryParams).then(res => {
					console.log(res)
					let list = res.rows;
					list.forEach(item => {
						this.commentList.push(item);
					})
					this.total = res.total;
					// 如果是最后一页
					if (this.queryParams.pageSize * this.queryParams.pageNum >= this.total) {
						this.loadStatus = "nomore"
					} else {
						this.loadStatus = "loadmore"
					}
				});
			},
			// 跳转医院
			toHospital() {
				this.$u.route('/pages/hospital/detail', {
					id: this.info.hospitalId
				})
			},

			toDocDetail() {
				this.$u.route('/pages/doctor/detail', {
					id: this.id
				})
			},

			handleAsk() {
				this.$u.route('/pages/ask/index', {
					doctorId: this.id
				})
			},
			handleRegistration() {
				this.$u.route('/pages/registration/index', {
					doctorId: this.id,
					periodDate: this.searchDate
				})
			},
			handlePrescribe() {
				this.$u.route('/pages/prescribe/apply', {
					doctorId: this.id
				})
			},




		}
	}
</script>

<style lang="scss" scoped>
	.top {
		margin-top: 20rpx;
		background-color: rgb(2, 167, 240);
		color: #FFFFFF;
		border-radius: 10rpx;
		padding: 20rpx;
	}
	.comment-list {
		margin-top: 20rpx;
		padding: 30rpx;
		background-color: #FFFFFF;
	}
</style>
