<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view>
			<u-card :show-head="false" :show-foot="false" :body-style="infoBodyStyle" margin="10rpx">
				<view slot="body" class="info-body">
					<view class="title">{{hospitalInfo.name}}</view>
					<view class="u-flex u-row-center">
						<view class="u-flex-2">
							<image :src="getBaseUrl()+hospitalInfo.cover" class="cover"></image>
						</view>
						<view class="u-flex-7 content">
							<view>{{hospitalInfo.level}} {{hospitalInfo.category}}</view>
							<view v-if="hospitalInfo.rank">综合排名：第{{hospitalInfo.rank}}名</view>
							<view class="u-flex">
								<view class="u-p-r-10" v-if="hospitalInfo.appointCount">预约量：{{hospitalInfo.appointCount}}万</view>
								<view v-if="hospitalInfo.askCount">问诊量：{{hospitalInfo.askCount}}万</view>
							</view>
							<view v-if="hospitalInfo.address">地址：{{hospitalInfo.address}}</view>
						</view>
						<view class="u-flex-3">
							<view class="u-flex u-col-center u-row-right">
								<view @click="handleDoctorDetail">医院简介></view>
							</view>
						</view>
					</view>
				</view>
			</u-card>
		</view>
		<view class="u-flex">
			<view class="u-flex-1">
				<u-card :show-head="false" :show-foot="false" box-shadow="2px 2px 5px #888888"
					@click="handleSearchHosptitalDoctor('registration')">
					<view slot="body">
						<view class="u-flex">
							<view>
								<image src="/static/image/icon/registration.png" class="bt-cover"></image>
							</view>
							<view>
								<view class="bt-title">预约挂号</view>
								<view class="bt-ask">{{registDoctorCount}}位医生可挂号</view>
							</view>
						</view>
					</view>
				</u-card>
			</view>
			<view class="u-flex-1">
				<u-card :show-head="false" :show-foot="false" box-shadow="2px 2px 5px #888888"
					@click="handleSearchHosptitalDoctor('ask')">
					<view slot="body">
						<view class="u-flex">
							<view>
								<image src="/static/image/icon/ask-doctor1.png" class="bt-cover"></image>
							</view>
							<view>
								<view class="bt-title">在线问诊</view>
								<view class="bt-ask">{{askDoctorCount}}位医生可问诊</view>
							</view>
						</view>
					</view>
				</u-card>
			</view>
		</view>
		<view>
			<u-section title="推荐医生" :right="false" font-size="40"></u-section>
			<view class="u-m-t-20">
				<scroll-view class="scroll-contain" scroll-x="true">
					<block v-for="item in doctorList" :key="item.id">
						<view class="scroll-card u-border" @click="handleDoctorInfo(item.id)">
							<view class="scroll-card-item">
								<view class="u-flex-2 u-p-l-10">
									<u-avatar :src="getBaseUrl()+item.photo"></u-avatar>
								</view>
								<view class="scroll-card-text-area u-flex-10">
									<view class="u-flex">
										<view class="u-flex-8">
											<text class="scroll-card-title">{{item.name}}</text>
										</view>
										<view class="u-flex-4">
											<view class="u-flex">
												<view v-if="item.canReserv=='Y'" class="u-p-lr-10">
													<u-tag text="号" mode="dark" type="warning"></u-tag>
												</view>
												<view v-if="item.canConsult=='Y'" class="u-p-lr-10">
													<u-tag text="问" mode="dark" type="warning"></u-tag>
												</view>
											</view>
										</view>
									</view>
									<text class="scroll-card-content">{{item.officeName}} {{item.level}}</text>
									<text class="scroll-card-content">评分：{{item.score}} 诊疗量：{{item.cureCount}}</text>
								</view>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '医院主页',
				hospitalInfo: {},
				infoBodyStyle: {
					backgroundColor: 'rgba(2, 167, 240, 1)',
				},
				registDoctorCount: 0,
				askDoctorCount: 0,
				doctorList: [],
			}
		},
		onLoad(options) {
			this.hospitalInfo.id = options.id;
			this.getHospitalInfo();
			this.getDoctorCount();
			this.getRecommendDoctorList();
		},
		methods: {
			handleDoctorInfo(id) {
				this.$u.route('/pages/doctor/detail', {
					id
				})
			},
			handleSearchHosptitalDoctor(bizType) {
				let type = 'hospital';
				let hospitalId = this.hospitalInfo.id;
				let hospitalName = this.hospitalInfo.name;
				this.$u.route('/pages/hospital/office', {
					hospitalId,
					hospitalName,
					type,
					bizType,
				})
			},
			handleDoctorDetail() {
				this.$u.route('/pages/hospital/detail', {
					id: this.hospitalInfo.id
				})
			},
			getRecommendDoctorList() {
				let params = {
					hospitalId: this.hospitalInfo.id,
					isRecommend: 'Y',
				}
				this.$u.api.listDoctor(params).then(res => {
					this.doctorList = res.rows;
				})
			},
			getDoctorCount() {
				let params1 = {
					hospitalId: this.hospitalInfo.id,
					canConsult: 'Y',
				}
				this.$u.api.listDoctor(params1).then(res => {
					this.askDoctorCount = res.rows.length;
				});
				let params2 = {
					hospitalId: this.hospitalInfo.id,
					canReserv: 'Y',
				}
				this.$u.api.listDoctor(params2).then(res => {
					this.registDoctorCount = res.rows.length;
				});
			},
			getHospitalInfo() {
				this.$u.api.getHospitalInfo(this.hospitalInfo.id).then(res => {
					this.hospitalInfo = res.data;
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.info-body {
		color: #FFFFFF;

		.cover {
			width: 130rpx;
			height: 130rpx;
			border-radius: 10px;
			margin-right: 10rpx;
		}

		.title {
			margin-bottom: 10px;
			font-size: 40rpx;
			font-weight: bold;
		}

		.content {
			font-size: 26rpx;
		}
	}

	.bt-cover {
		width: 80rpx;
		height: 80rpx;
	}

	.bt-title {
		font-size: 35rpx;
		font-weight: bold;
		text-align: center;
	}

	.bt-ask {
		font-size: 20rpx;
		color: #999;
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
		width: 500rpx;
		height: 180rpx;
		margin-left: 20rpx;
		box-shadow: 2px 2px 5px #888888;
	}

	.scroll-card-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 180rpx;
		border-radius: 15rpx;
	}

	.scroll-card-cover {
		height: 100rpx;
		width: 100rpx;
		margin-left: 10rpx;
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
</style>
