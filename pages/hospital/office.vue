<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-menu-wrap">
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
						@tap.stop="handleSearchDoctor(item1.id,item1.name)">
						<text class="u-line-1">{{item1.name}}</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '选择科室',
				firstList: [],
				secondeList: [],
				scrollTop: 0, //tab标题的滚动条位置
				firstCurrent: 0, // 预设当前项的值
				secondCurrent: 0,
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				bizType: '',
				hospitalId: '',
			}
		},
		onLoad(options) {
			this.bizType = options.bizType;
			this.hospitalId = options.hospitalId;
			this.getOfficeList();
		},
		methods: {
			getOfficeList() {
				this.$u.api.getOfficeTree().then(res => {
					this.firstList = res.data;
					if (this.firstList[0]) {
						this.secondeList = this.firstList[0].children;
					}
				});
			},
			handleSearchDoctor(officeId, officeName) {
				let bizType = this.bizType;
				let type = 'hospital';
				let hospitalId = this.hospitalId;
				this.$u.route('/pages/doctor/result', {
					hospitalId,
					officeId,
					officeName,
					type,
					bizType,
				})
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
</style>
