<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="top">
			<view class="u-flex">
				<view class="u-flex-2">
					<u-avatar :src="getBaseUrl()+doctorInfo.photo"></u-avatar>
				</view>
				<view class="u-flex-10 content">
					<view class="u-flex u-row-between">
						<text @click="toDoctorDetail()">{{doctorInfo.name}}</text>
						<text @click="toRule()" class="u-type-primary">预约规则</text>
					</view>
					<view class="u-tips-color u-font-13 u-m-t-10">
						<text>{{doctorInfo.level}}</text>
						<text class="u-m-l-20"> {{doctorInfo.officeName}}</text>
					</view>
					<view class="u-tips-color u-font-13 u-m-t-10">
						预约量：{{doctorInfo.reservCount}}
					</view>
				</view>
			</view>
		</view>

		<view class="middle">
			<view class="u-font-15 u-font-bold">
				出诊地：{{doctorInfo.hospitalName}}-{{doctorInfo.officeName}}
			</view>
			<view class="u-flex u-row-between u-m-tb-20">
				<view>{{periodDate}}  {{weekList[weekCurrent].week}}</view>
				<view v-if="!dateShow" class="u-tips-color u-font-13" @click="dateShow=!dateShow">更换日期<u-icon name="arrow-down"
						 size="26"></u-icon>
				</view>
				<view v-if="dateShow" class="u-tips-color u-font-13" @click="dateShow=!dateShow">收起日期 <u-icon name="arrow-up"
						 size="26"></u-icon>
				</view>
			</view>
			<view class="u-border-bottom week" v-if="dateShow">
				<scroll-view class="scroll-contain" scroll-x="true">
					<block v-for="(item,index) in weekList" :key="index">
						<view class="u-m-lr-20 scroll-card" @click="handleWeekChange(index)"
							:class="[index==weekCurrent ? 'active' : '']">
							<view>{{item.week}}</view>
							<view class="u-p-tb-10">{{item.date}}</view>
						</view>
					</block>
				</scroll-view>
			</view>
			<view class="u-flex u-p-10 u-font-13" v-for="(item, index) in scheduleList" :key="item.id">
				<text class="u-flex-3 u-tips-color">{{item.periodTime}}</text>
				<view class="u-flex-8 u-tips-color">{{item.type}}:<text class="u-m-l-10">￥{{item.price}}</text></view>
				<view class="u-flex-1">
					<u-button v-if="item.isReserved=='N'" type="primary" size="mini" shape="circle"
						@click="handleReserve(item.id)"> 预约</u-button>
					<u-button v-if="item.isReserved=='Y'" disabled size="mini" shape="circle"
						@click="handleReserve(item.id)"> 约满</u-button>
				</view>
			</view>
			<view class="u-text-center u-tips-color u-m-t-30 u-font-13">
				<text v-if="!allShow" @click="showAll()">查看全部排班</text>
				<text v-if="allShow" @click="showEffect()">查看可约排班</text>
			</view>
		</view>

		<view class="comment-list">
			<view class="u-font-15 u-font-bold u-m-b-20">患者评价</view>
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
				title: '云上门诊',
				allShow: false,
				doctorId: '',
				periodDate: '',
				doctorInfo: {},
				scheduleList: [],
				allList: [],
				effectList: [],
				total: 0,
				commentList: [],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					doctorId: '',
				},
				loadStatus: 'loadmore',
				dateShow: false,
				weekList: [],
				weekCurrent: -1,
			}
		},
		onLoad(options) {
			this.doctorId = options.doctorId;
			this.periodDate = options.periodDate;
			this.getTimeAndWeek();
			for(let i=0; i< this.weekList.length; i++){
				if(this.weekList[i].fullDate == this.periodDate){
					this.weekCurrent = i;
					this.weekday = this.weekList[i].week;
					break;
				}
				
			}
			this.getDoctorInfo();
			this.getScheduleList();
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
			// 获取医生信息
			getDoctorInfo() {
				this.$u.api.getDoctor(this.doctorId).then(res => {
					this.doctorInfo = res.data;
				})
			},

			// 跳转医生详情页
			toDoctorDetail() {
				this.$u.route('/pages/doctor/detail', {
					id: this.doctorId
				})
			},
			// 跳转预约规则页
			toRule() {
				this.$u.route('/pages/registration/rule')
			},

			getScheduleList() {
				let params = {
					doctorId: this.doctorId,
					periodDate: this.periodDate,
				}
				this.effectList=[];
				this.scheduleList=[];
				this.allList=[];
				this.$u.api.getScheduleList(params).then(res => {
					let list = res.rows;
					list.forEach(item => {
						if (item.isReserved == 'N') {
							this.effectList.push(item)
						}
						this.allList.push(item);
					})
					this.scheduleList = this.effectList;
				})
			},
			// 显示全部排班
			showAll() {
				this.allShow = true;
				this.scheduleList = this.allList;
			},
			// 显示可约排班
			showEffect() {
				this.allShow = false;
				this.scheduleList = this.effectList;
			},

			handleReserve(id) {
				this.$u.route('/pages/registration/add', {
					doctorId: this.doctorId,
					scheduleId: id
				})
			},
			resetPage() {
				this.pageNum = 1;
				this.pageSize = 10;
				this.commentList = [];
			},
			// 获取评论列表
			getCommemtList() {
				this.queryParams.doctorId = this.doctorId;
				this.$u.api.getDoctorCommentList(this.queryParams).then(res => {
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
						week: i == 0 ? '今天' : weekDay[date.getDay()],
						today: i == 0 ? true : false,
					});
				}
			},
			handleWeekChange(index) {
				this.weekCurrent = index;
				this.periodDate = this.weekList[index].fullDate;
				this.weekday = this.weekList[index].week;
				this.getScheduleList();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		margin: 20rpx 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		padding: 20rpx 30rpx;
	}

	.middle {
		padding: 30rpx;
		background-color: #FFFFFF;
	}

	.comment-list {
		margin-top: 20rpx;
		padding: 30rpx;
		background-color: #FFFFFF;
	}
	
	.week {
		background-color: #fff;
	}
	
	.scroll-contain {
		width: 100%;
		height: 100rpx;
		white-space: nowrap;
	
		.active {
			color: $u-type-primary;
		}
	}
	
	.scroll-card {
		/*控制横向排列*/
		display: inline-block;
		width: 80rpx;
		height: 80rpx;
	}
</style>
