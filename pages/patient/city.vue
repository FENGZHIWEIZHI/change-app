<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-m-lr-20">
			<view class="list-cell u-border-bottom" @click="handleCity(location)">
				<u-icon name="map"></u-icon>当前定位城市：{{location}}
			</view>
			<u-index-list :scrollTop="scrollTop" :index-list="indexList">
				<view v-for="(item, index) in cityList" :key="index">
					<u-index-anchor :index="item.letter" />
					<view class="list-cell u-border-bottom" v-for="(item1, index1) in item.data" :key="index1">
						<view @click="handleCity(index,index1)">{{item1.name}}</view>
					</view>
				</view>
			</u-index-list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '选择城市',
				scrollTop: 0,
				indexList: [],
				cityList: [],
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			this.getCityList();
		},
		methods: {
			getCityList() {
				this.$u.api.getCityLetterTree().then(res => {
					this.cityList = res.data;
					this.indexList = this.cityList.map(val => {
						return val.letter;
					})
				})
			},
			handleCity(index, subIndex) {
				let city = this.cityList[index].data[subIndex].name;
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				prevPage.$vm.selectedCity = city;
				prevPage.$vm.cityName = city
				uni.navigateBack();
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: $u-content-color;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}
</style>
