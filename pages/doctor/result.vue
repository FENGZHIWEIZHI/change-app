<template>
	<view class="main">
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-border-bottom week">
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
		<view class="u-border-bottom filter">
			<u-dropdown ref="uDropdown" @open="open" @close="close">
				<u-dropdown-item title="地区">
					<view class="slot-content">
						<view class="u-flex u-flex-wrap u-row-left u-col-center area">
							<block v-for="(item,index) in areaList" :key="item.id">
								<view class="u-m-30" :class="[index==areaCurrent ? 'active' : '']"
									@click="handleAreaChange(index)">{{item.name}}</view>
							</block>
						</view>
					</view>
				</u-dropdown-item>
				<u-dropdown-item title="排序" :options="sortList" @change="handleSortChange"></u-dropdown-item>
				<u-dropdown-item title="筛选">
					<view class="slot-content">
						<view class="u-font-40">医院等级</view>
						<view class="u-flex u-flex-wrap u-row-left u-col-center">
							<block v-for="(item,index) in hospitalLevel" :key="item.dictValue">
								<view class="u-m-30" :class="[index==hospitalLevelCurrent ? 'active' : '']"
									@click="handleHospitalLevel(index)">{{item.dictLabel}}</view>
							</block>
						</view>
						<u-gap height="2" bg-color="#f6fafd"></u-gap>
						<view class="u-font-40 u-m-t-20">医生职称</view>
						<view class="u-flex u-flex-wrap u-row-left u-col-center">
							<block v-for="(item,index) in doctorLevel" :key="item.dictValue">
								<view class="u-m-30" :class="[index==doctorLevelCurrent ? 'active' : '']"
									@click="handleDoctorLevel(index)">{{item.dictLabel}}</view>
							</block>
						</view>
						<view class="u-flex u-row-center">
							<view class="u-flex-6 u-p-lr-10">
								<u-button type="primary" :plain="true" @click="handleCancel">重置</u-button>
							</view>
							<view class="u-flex-6 u-p-lr-10">
								<u-button type="primary" @click="handleConfirm">确定</u-button>
							</view>
						</view>
					</view>
				</u-dropdown-item>
			</u-dropdown>
		</view>
		<view>
			<u-card :show-head="false" :show-foot="false" margin="10rpx" v-for="(item,index) in doctorList"
				:key="item.id"  @click="toDoctor(item.id)">
				<view slot="body" class="info-body">
					<view class="u-flex u-row-center u-col-top">
						<view class="u-flex-2">
							<u-avatar :src="getBaseUrl()+item.photo"></u-avatar>
						</view>
						<view class="u-flex-10 content">
							<view class="u-flex u-row-between">
								<view>
								{{item.name}} {{item.level}} {{item.officeName}}
								</view>
								<view>
									<u-button v-if="bizType=='ask'" type="primary" shape="circle"
										@click.stop="handleAsk(item.id)" size="mini">咨询医生</u-button>
									<u-button v-if="bizType=='registration'" type="primary" shape="circle"
										@click.stop="handleRegistration(item.id)" size="mini">预约</u-button>
									<u-button v-if="bizType=='prescribe'" type="primary" shape="circle"
										@click.stop="handlePrescribe(item.id)" size="mini">开药</u-button>
								</view>
							</view>
							<view>{{item.hospitalLevel}} {{item.hospitalName}}</view>
							<view v-if="item.skill" class="u-line-2 u-tips-color u-m-t-10">擅长：{{item.skill}}</view>
							<view v-if="bizType=='ask' || bizType=='prescribe'" class="u-tips-color u-m-t-10" >
								<text>图文 ￥{{item.textAskPrice}}</text>
								<text>电话 ￥{{item.telAskPrice}}</text>
								<text>开药 ￥{{item.prescribePrice}}</text>
							</view>
						</view>
					</view>
				</view>
			</u-card>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				title: '',
				keyword: '',
				areaList: [],
				hospitalLevel: [],
				doctorLevel: [],
				sortList: [{
					value: 'd.score',
					label: '评分',
				}, {
					value: 'd.reserv_count',
					label: '挂号量',
				}],
				queryType: '',
				bizType: '',
				queryParams: {
					//pageNum: 1,
					//pageSize: 10,
					officeId: '',
					hospitalId: '',
					level: '',
					hospitalLevel: '',
					searchDate: '',
					city: '',
					area: '',
					orderByColumn: '',
					isAsc: '',
				},
				hospitalLevelCurrent: -1,
				doctorLevelCurrent: -1,
				weekCurrent: -1,
				areaCurrent: -1,
				doctorList: [],
				weekList: [],
			}
		},
		onLoad(options) {
			//queryTypec查询类型：hospital表示从医院列表进入，secondOffice表示从二级科室进入，thirdOffice表示从三级科室进入
			this.queryType = options.type;
			//bizType业务类型：ask表示问诊，registration表示挂号，prescribe表示开药
			this.bizType = options.bizType;
			if (this.queryType == 'hospital') {
				this.title = options.officeName;
				this.queryParams.hospitalId = options.hospitalId
				this.queryParams.officeId = options.officeId
			} else {
				this.queryParams.officeId = options.officeId;
				this.title = options.officeName;
			}
			this.queryParams.city = this.location;
			this.getTimeandWeek();
			this.weekCurrent = 0;
			this.queryParams.searchDate = this.weekList[0].fullDate;
			this.getAreaList();
			this.getSysDicts();
			this.getDoctorList();
		},
		methods: {
			toDoctor(id){
				this.$u.route('/pages/doctor/index', {
					id: id
				})
			},
			handleAsk(id) {
				this.$u.route('/pages/ask/index', {
					doctorId: id
				})
			},
			handleRegistration(id) {
				this.$u.route('/pages/registration/index', {
					doctorId: id,
					periodDate: this.queryParams.searchDate
				})
			},
			handlePrescribe(id) {
				this.$u.route('/pages/prescribe/apply', {
					doctorId: id
				})
			},
			open(index) {
				// 展开某个下来菜单时，先关闭原来的其他菜单的高亮
				// 同时内部会自动给当前展开项进行高亮
				this.$refs.uDropdown.highlight();
			},
			close(index) {
				// 关闭的时候，给当前项加上高亮
				// 当然，您也可以通过监听dropdown-item的@change事件进行处理
				this.$refs.uDropdown.highlight(index);
			},
			handleAreaChange(index) {
				this.areaCurrent = index;
				if (index == 0) {
					this.queryParams.area = '';
				} else {
					this.queryParams.area = this.areaList[index].name;
				}
				this.getDoctorList();
				this.$refs.uDropdown.close();
			},
			handleWeekChange(index) {
				this.weekCurrent = index;
				this.queryParams.searchDate = this.weekList[index].fullDate;
				this.getDoctorList();
			},
			getTimeandWeek() {
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
			handleSortChange(val) {
				this.queryParams.orderByColumn = val;
				this.queryParams.isAsc = 'desc';
				this.getDoctorList();
			},
			getDoctorList() {
				this.$u.api.listDoctor(this.queryParams).then(res => {
					console.log(res)
					this.doctorList = res.rows;
				})
			},
			resetQuery() {
				this.queryParams = {
					officeId: '',
					hospitalId: '',
					level: '',
					hospitalLevel: '',
					searchDate: '',
					city: '',
					area: '',
					orderByColumn: '',
					isAsc: '',
				}
			},
			getSysDicts() {
				this.hospitalLevel = [];
				this.doctorLevel = [];
				this.$u.api.getDicts("hospital_level").then(response => {
					this.hospitalLevel = response.data;
				});
				this.$u.api.getDicts("doctor_level").then(response => {
					this.doctorLevel = response.data;
				});
			},
			handleHospitalLevel(index) {
				this.queryParams.hospitalLevel = this.hospitalLevel[index].dictValue;
				this.hospitalLevelCurrent = index;
			},
			handleDoctorLevel(index) {
				this.queryParams.level = this.doctorLevel[index].dictValue;
				this.doctorLevelCurrent = index;
			},
			getAreaList() {
				this.$u.api.getAreaList({
					cityName: this.location
				}).then(res => {
					this.areaList = res.rows;
					this.areaList.unshift({
						name: '全部'
					})
				})
			},
			handleCancel() {
				this.getSysDicts();
				this.doctorLevelCurrent = -1;
				this.hospitalLevelCurrent = -1;
				this.queryParams.level = null;
				this.queryParams.hospitalLevel = null;
				this.getDoctorList();
				this.$refs.uDropdown.close();
			},
			handleConfirm() {
				this.getDoctorList();
				this.$refs.uDropdown.close();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.week {
		background-color: #fff;
	}

	.filter {
		background-color: #fff;
	}

	.area {
		.active {
			color: $u-type-primary;
		}
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

	.slot-content {
		background-color: #FFFFFF;
		padding: 24rpx;

		.active {
			color: $u-type-primary;
		}
	}

	.info-body {
		
		.cover {
			width: 100rpx;
			height: 100rpx;
		}

		.title {
			font-size: 30rpx;
			font-weight: bold;
		}

		.content {
			font-size: 28rpx;
		}
	}
</style>
