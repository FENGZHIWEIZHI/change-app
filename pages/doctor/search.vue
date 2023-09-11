<template>
	<view class="main">
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-p-20 search">
			<u-search v-model="keyword" height="56" placeholder="请输入医生名" :show-action="false" @search="handleSearch"></u-search>
		</view>
		<u-tabs :list="tabList" :is-scroll="false" :current="tabCurrent" @change="handleTabChange"></u-tabs>
		<u-gap height="5" bg-color="#f6fafd"></u-gap>
		<view v-if="tabCurrent==0||tabCurrent==1" class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in firstList" :key="index" class="u-tab-item"
					:class="[firstCurrent==index ? 'u-tab-item-active' : '']" :data-current="index"
					@tap.stop="swichFirstMenu(index)">
					<text class="u-line-1">{{item.name}}</text>
				</view>
			</scroll-view>
			<view class="u-border-left">
				<scroll-view scroll-y class="u-tab-view" v-if="secondeList.length>0">
					<view v-for="(item1, index1) in secondeList" :key="index1" class="u-tab-item-second"
						:class="[tabCurrent==1&&secondCurrent==index1 ? 'u-tab-item-second-active' : '']"
						@tap.stop="tabCurrent==1?swichSecondMenu(index1):handleSearchDoctor(item1.id,item1.name,'secondOffice')">
						<text class="u-line-1">{{item1.name}}</text>
					</view>
				</scroll-view>
			</view>
			<view v-if="tabCurrent==1" class="u-border-left">
				<scroll-view scroll-y class="u-tab-view" v-if="thirdList.length>0">
					<view v-for="(item1, index1) in thirdList" :key="index1" class="u-tab-item-second"
						@tap.stop="tabCurrent==1?handleSearchDoctor(item1.id,item1.name,'thirdOffice'):''">
						<text class="u-line-1">{{item1.name}}</text>
					</view>
				</scroll-view>
			</view>
		</view>
		<view v-if="tabCurrent==2">
			<u-card v-for="(hospitalInfo,index) in hospitalList" :key="hospitalInfo.id" :show-head="false"
				:show-foot="false" margin="10rpx">
				<view slot="body" class="info-body">
					<view class="u-flex u-row-center"
						@click="handleSearchHosptitalDoctor(hospitalInfo.id,hospitalInfo.name,'hospital')">
						<view class="u-flex-2">
							<image :src="getBaseUrl()+hospitalInfo.cover" class="cover"></image>
						</view>
						<view class="u-flex-8 content">
							<view class="title">{{hospitalInfo.name}}</view>
							<view>{{hospitalInfo.level}} {{hospitalInfo.category}}</view>
							<view v-if="hospitalInfo.address">地址：{{hospitalInfo.address}}</view>
						</view>
						<view class="u-flex-2">
							<view class="u-flex u-col-center u-row-right">
								<view>{{hospitalInfo.location}}km</view>
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
		data() {
			return {
				title: '找医生',
				keyword: '',
				tabList: [{
					name: '按科室'
				}, {
					name: '按疾病'
				}, {
					name: '按医院'
				}],
				tabCurrent: 0,
				firstList: [],
				secondeList: [],
				thirdList: [],
				scrollTop: 0, //tab标题的滚动条位置
				firstCurrent: 0, // 预设当前项的值
				secondCurrent: 0,
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				hospitalList: [],
				bizType: '',
			}
		},
		onLoad(options) {
			this.bizType = options.bizType;
			this.getOfficeList();
			this.getHospitalList();
		},
		methods: {
			getHospitalList() {
				let params = {
					city: this.location
				}
				this.$u.api.getHospitalList(params).then(res => {
					this.hospitalList = res.rows
				})
			},
			handleSearch() {
				this.$u.route('/pages/doctor/find', {
					keyword: this.keyword
				})
			},
			handleSearchDoctor(officeId, officeName, type) {
				let bizType = this.bizType;
				this.$u.route('/pages/doctor/result', {
					officeId,
					officeName,
					type,
					bizType,
				})
			},
			handleSearchHosptitalDoctor(hospitalId, hospitalName, type) {
				let bizType = this.bizType;
				this.$u.route('/pages/hospital/office', {
					hospitalId,
					hospitalName,
					type,
					bizType,
				})
			},
			getOfficeList() {
				this.$u.api.getOfficeTree().then(res => {
					this.firstList = res.data;
					if (this.firstList[0]) {
						this.secondeList = this.firstList[0].children;
						if (this.secondeList[0]) {
							this.thirdList = this.secondeList[0].children;
						}
					}
				});
			},

			handleTabChange(index) {
				this.tabCurrent = index;
			},
			// 点击左边的栏目切换
			async swichFirstMenu(index) {
				if (index == this.firstCurrent) return;
				this.firstCurrent = index;
				this.secondCurrent = 0;
				this.secondeList = this.firstList[index].children;
				if (this.secondeList[this.secondCurrent]) {
					this.thirdList = this.secondeList[this.secondCurrent].children;
				}
				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			async swichSecondMenu(index) {
				if (index == this.secondCurrent) return;
				this.secondCurrent = index;
				this.thirdList = this.firstList[this.firstCurrent].children[index].children;
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		background-color: #f6fafd;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}

	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}

	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.right-box {
		background-color: rgb(250, 250, 250);
	}

	.page-view {
		padding: 16rpx;
	}

	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}

	.u-tab-item-second {
		height: 110rpx;
		background: #fff;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}

	.u-tab-item-second-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
	}

	.info-body {

		.cover {
			width: 100rpx;
			height: 100rpx;
		}

		.title {
			font-size: 40rpx;
			font-weight: bold;
		}

		.content {
			font-size: 30rpx;
		}
	}
</style>
