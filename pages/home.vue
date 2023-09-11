<template>
	<view>
		<u-navbar :is-back="false" :title="title">
			<view class="slot-wrap">
				<view class="u-flex u-row-center u-p-10 searchBox">
					<view class="u-p-l-10" @click="handleCity"> {{cityName}}<u-icon name="map-fill"></u-icon></view>
					<view class="u-flex-11">
						<u-search v-model="keyword" placeholder="请输入医生名" height="56" :show-action="false" @search="handleSearch"></u-search>
					</view>
				</view>
			</view>
			<view slot="right">
				<view class="u-p-r-20">
					<u-icon name="scan" size="38" @click="handleScan"></u-icon>
				</view>
			</view>
		</u-navbar>
		<u-swiper :list="advList"></u-swiper>
		<view class="u-margin-top-20">
			<cmt-nav-icon></cmt-nav-icon>
		</view>
		<u-card v-if="remindList.length > 0">
			<view slot="head">
				<u-section title="预约提醒" :right="false"></u-section>
			</view>
			<view slot="body">
				<scroll-view class="scroll-contain" scroll-x="true">
					<block v-for="item in remindList" :key="item.id">
						<view class="scroll-card" @click="handleRemindInfo(item.id)">
							<view class="scroll-card-item">
								<image class="scroll-card-cover" :src="getBaseUrl()+item.hospitalCover"></image>
								<view class="scroll-card-text-area">
									<text class="scroll-card-title">{{reservDate(item.periodDate)}}
										{{item.periodTime}}</text>
									<text class="scroll-card-content">{{item.hospitalName}}</text>
									<text class="scroll-card-content">{{item.doctorName}} {{item.officeName}}</text>
								</view>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</u-card>
		<u-card>
			<view slot="head">
				<u-section title="推荐医院" :right="false"></u-section>
			</view>
			<view slot="body">
				<scroll-view class="scroll-contain" scroll-x="true">
					<block v-for="item in hospitalList" :key="item.id">
						<view class="scroll-card" @click="handleHospitalInfo(item.id)">
							<view class="scroll-card-item">
								<view class="u-flex-2">
									<image class="scroll-card-cover" :src="getBaseUrl()+item.cover"></image>
								</view>
								<view class="scroll-card-text-area u-flex-10">
									<text class="scroll-card-title">{{item.name}}</text>
									<text class="scroll-card-content">据您{{item.location}}km</text>
								</view>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</u-card>
		<view class="bg-white u-m-30 u-p-20">
			<u-section title="推荐医生" :right="false" class="u-m-b-30"></u-section>
			<u-card :show-head="false" :show-foot="false" padding="0" margin="10rpx" v-for="(item,index) in doctorList"
				:key="item.id" @click="toDoctor(item.id)">
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
									<u-button type="primary" shape="circle" @click.stop="handleAsk(item.id)"
										size="mini">咨询医生
									</u-button>
								</view>
							</view>
							<view>{{item.hospitalLevel}} {{item.hospitalName}}</view>
							<view v-if="item.skill" class="u-line-2 u-tips-color u-m-t-10">擅长：{{item.skill}}</view>
							<view class="u-tips-color u-m-t-10">
								<text>图文 ￥{{item.textAskPrice}}</text>
								<text>电话 ￥{{item.telAskPrice}}</text>
								<text>开药 ￥{{item.prescribePrice}}</text>
							</view>
						</view>
					</view>
				</view>
			</u-card>
		</view>
		<cmt-footer></cmt-footer>
	</view>
</template>

<script>
	import cmtNavIcon from '@/pages/navIcon.vue'
	import cmtFooter from '@/pages/footer.vue'
	export default {
		components: {
			cmtNavIcon,
			cmtFooter
		},
		data() {
			return {
				title: '',
				current: '',
				keyword: '',
				//轮播广告列表
				advList: [],
				remindList: [],
				hospitalList: [],
				doctorList: [],
				cityName:'北京市',
			}
		},
		onLoad() {
			this.getLocation();
		},
		onShow() {
			if (!this.isLogin) {
				this.$u.route({
					url: '/pages/user/login',
					type: 'redirect',
				})
				return
			}
			this.getLocation();
			console.log(456);
			this.resetPage()
			this.getAdvList()
			this.getRemindList()
			this.getDoctorList()
			this.getHospitalList()
		},
		computed: {
			reservDate() {
				return val => {
					if (!val) {
						return '';
					}
					if (typeof(val) !== 'object') {
						val = val.replace(/-/g, '/');
					}
					let timestamp = new Date(val).getTime();
					return this.$u.timeFormat(timestamp, 'yyyy年mm月dd日');
				};
			}
		},
		methods: {
			handleHospitalInfo(id) {
				this.$u.route('/pages/hospital/index', {
					id: id
				})
				
			},
			handleCity() {
				this.$u.route('/pages/patient/city');
			},
			handleScan() {
				uni.scanCode({
					success: res => {
						// this.result = res.result;
						this.$u.toast("扫码成功");
						setTimeout(() => {
							this.$u.route("pages/home")
						}, 2000);
						return
					},
					fail: err => {
						// 需要注意的是小程序扫码不需要申请相机权限
						this.$u.toast("扫码失败");
						setTimeout(() => {
							this.$u.route("pages/home")
						}, 2000);
						return
					}
				});
			},
			handleSearch(val) {
				this.$u.route('/pages/doctor/find', {
					keyword: val
				})
			},
			getLocation() {
				this.$u.api.getLocation().then(res => {
					console.log(res.data.location);
					
					this.$u.vuex('location', this.cityName);
				})
			},
			resetPage() {
				this.advList = [];
				this.remindList = [];
				this.hospitalList = [];
				this.doctorList = [];
			},
			handleRemindInfo(id) {
				this.$u.route('/pages/registration/detail', {
					id,
				})
			},
			getAdvList() {
				this.$u.api.listAdv({
					type: '2'
				}).then(res => {
					this.advList = res.data;
					this.advList.forEach(item => {
						item.image = this.getBaseUrl() + item.image;
					})
				})
			},
			getHospitalList() {
				let query = {
					recommend: 'Y',
					city:this.cityName
				}
				this.$u.api.getHospitalList(query).then(res => {
					this.hospitalList = res.rows;
				})
			},
			getDoctorList() {
				let query = {
					isRecommend: 'Y',
					city:this.cityName
				}
				this.$u.api.listDoctor(query).then(res => {
					this.doctorList = res.rows;
				})
			},
			getRemindList() {
				this.$u.api.getRemindList().then(res => {
					this.remindList = res.data;
				})
			},
			handleAsk(id) {
				this.$u.route('/pages/ask/index', {
					doctorId: id
				})
			},
			toDoctor(id) {
				this.$u.route('/pages/doctor/index', {
					id: id
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.search-wrap {
		margin: 0 20rpx;
		flex: 1;
	}
	
	.searchBox{
		width: 700rpx;
	}
	.right-item {
		margin: 0 12rpx;
		position: relative;
		color: #ffffff;
		display: flex;
	}

	.navbar-right {
		margin-right: 24rpx;
		display: flex;
	}

	.u-card-wrap {
		background-color: $u-bg-color;
		padding: 1px;
	}

	.u-body-item {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 10rpx;
	}

	.u-body-item-title {
		word-wrap: normal;
		text-overflow: ellipsis;
	}

	.u-body-item-subtitle {
		font-size: 25rpx;
		color: #959595;
		padding: 20rpx 10rpx;
	}

	.u-body-item image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-left: 12rpx;
	}

	.scroll-contain {
		width: 100%;
		height: 200rpx;
		white-space: nowrap;
	}

	.scroll-card {
		/*控制横向排列*/
		display: inline-block;
		border-radius: 20rpx;
		width: 450rpx;
		height: 180rpx;
		margin-left: 20rpx;
		border: 1px solid #ccc;
	}

	.scroll-card-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 180rpx;
		// border-radius: 15rpx;
	}

	.scroll-card-cover {
		height: 130rpx;
		width: 130rpx;
		margin:0 10rpx 0 10rpx;
		border-radius: 5px;
	}

	.scroll-card-text-area {
		margin-left: 10rpx;
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.scroll-card-title {
		white-space: normal;
		text-overflow: ellipsis;
		font-size: 30rpx;
	}

	.scroll-card-content {
		color: #959595;
		font-size: 23rpx;
	}

	.info-body {
		border: 1px solid #ccc;
		padding: 10px;
		border-radius: 10px;
		
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
