<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-p-20 search">
			<u-search v-model="keyword" height="56" :show-action="false" @change="handleSearch"></u-search>
		</view>
		<view v-if="keyword">
			<view v-for="(item,index) in resultList" :key="index"
				class="u-border-bottom u-flex u-row-between u-col-center u-p-lr-20">
				<view class="u-flex-10">{{item.name}}</view>
				<view class="u-flex-2">
					<u-button type="primary" :plain="true" size="mini" @click="handleAddResult(item)">加入清单1</u-button>
				</view>
			</view>
		</view>
		<view v-if="!keyword">
			<view class="u-menu-wrap u-flex u-row-left u-col-top">
				<view class="u-flex-4">
					<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view"
						:scroll-top="scrollTop">
						<view v-for="(item,index) in firstList" :key="index" class="u-tab-item"
							:class="[firstCurrent==index ? 'u-tab-item-active' : '']" :data-current="index"
							@tap.stop="swichFirstMenu(index)">
							<text class="u-line-1">{{item.category}}</text>
						</view>
					</scroll-view>
				</view>
				<view class="u-border-left u-flex-8">
					<scroll-view scroll-y class="u-tab-view" v-if="secondeList.length>0">
						<view v-for="(item1, index1) in secondeList" :key="index1"
							class="u-tab-item-second u-border-bottom u-flex u-row-between u-col-center u-p-l-10">
							<view class="u-flex-8">
								<text class="u-line-1">{{item1.name}}</text>
							</view>
							<view class="u-flex-4">
								<u-button v-if="!item1.selected" type="primary" :plain="true" size="mini"
									@click="handleSelected(item1)">
									加入清单</u-button>
								<u-number-box v-if="item1.selected" :min="1" v-model="item1.count" @change="valChange"
									:disabled-input="true" @minus="valMinus" @plus="valPlus">
								</u-number-box>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="u-padding-10 position-sticky fixed-bottom u-flex u-col-center">
				<view class="u-flex-7">
					已选药品<text style="color: #DD524D;">{{orderInfo.medicineList.length}}</text>
				</view>
				<view class="u-flex-5">
					<u-button v-if="orderInfo.medicineList.length>0" type="primary" @click="handleAdd">药品清单</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '查找药品',
				keyword: '',
				firstList: [],
				secondeList: [],
				scrollTop: 0, //tab标题的滚动条位置
				firstCurrent: 0, // 预设当前项的值
				secondCurrent: 0,
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				orderInfo: {
					id: '',
					medicineList: [],
				},
				resultList: [],
			}
		},
		onShow() {

		},
		onLoad(options) {
			this.orderInfo.id = options.orderId;
			this.getCategoryList();
		},
		methods: {
			handleAddResult(medicine) {
				this.keyword = ''
				if(medicine.count > 0){
					medicine.selected = true
					medicine.count++;
				}else{
					medicine.selected = true;
					medicine.count = 1;
					this.orderInfo.medicineList.push(medicine)
				}
				this.$forceUpdate();
			},
			handleAdd() {
				this.$u.api.addPrescribeOrderItem(this.orderInfo).then(res => {
					this.$u.route({
						url: '/pages/prescribe/item',
						type: 'redirect',
						params: {
							orderId: this.orderInfo.id,
						}
					})
				})
			},
			handleSelected(medicine) {
				medicine.selected = true;
				medicine.count = 1;
				this.orderInfo.medicineList.push(medicine)
				this.$forceUpdate();
			},
			valChange(e) {
				console.log(e.value,e);
			},
			valMinus(val) {

			},
			valPlus(val) {

			},
			handleSearch() {
				// let queryParams = {
				// 	pageNum: 1,
				// 	pageSize: 10,
				// 	name: this.keyword,
				// }
				// this.$u.api.searchMedicine(queryParams).then(res => {
				// 	this.resultList = res.rows;
				// })
				this.resultList = this.secondeList.filter((item)=>{
					return item.name.match(this.keyword)
				});
				console.log(this.resultList)
			},
			getCategoryList() {
				this.$u.api.getMedicineTree().then(res => {
					this.firstList = res.data;
					if (this.firstList[0]) {
						this.secondeList = this.firstList[0].medicineList;
					}
				});
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
	.search {
		background-color: #f6fafd;
	}

	.u-menu-wrap {
		overflow: hidden;
	}

	.u-tab-view {
		//width: 200rpx;
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
		//display: flex;
		//align-items: center;
		//justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
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
