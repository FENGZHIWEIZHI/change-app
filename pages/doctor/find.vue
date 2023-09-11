<template>
	<view class="main">
		<u-navbar title-color="#fff" back-icon-color="#606266" :is-fixed="isFixed" :is-back="isBack"
			:back-icon-name="backIconName">
			<view class="slot-wrap">
				<view class="search-wrap">
					<!-- 如果使用u-search组件，必须要给v-model绑定一个变量 -->
					<u-search v-model="keyword" :show-action="false" height="56" :action-style="{color: '#fff'}"
						@search="handleSearch" :clearabled="true">
					</u-search>
				</view>
			</view>
		</u-navbar>
		<view>
			<view class="bg-white">
				<view class="item u-border-bottom" v-for="(item, index) in doctorList" :key="item.id"
					@click="toDetail(item.id)">
					<text>{{item.name}}</text>
				</view>
			</view>
			<u-loadmore margin-top="20" :status="loadStatus" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isFixed: true,
				// background: {
				// 	'background-image': 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
				// },
				isBack: true,
				backText: '',
				backIconName: 'arrow-leftward',

				keyword: '',
				loadStatus: 'loadmore',
				total: 0,
				doctorList: [],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					name: '',
				},
			}
		},
		onLoad(options) {
			this.keyword = options.keyword;
		},
		onShow() {
			this.resetPage();
			this.getDoctorList();
		},
		onReachBottom() {
			if (this.loadStatus !== "nomore") {
				this.loadStatus = "loading";
				this.queryParams.pageNum++;
				this.getDoctorList();
			}
		},
		methods: {
			resetPage() {
				this.pageNum = 1;
				this.pageSize = 10;
				this.doctorList = [];
			},
			handleSearch() {
				this.resetPage();
				this.getDoctorList();
			},
			// 获取医生
			getDoctorList() {
				this.queryParams.name = this.keyword;
				this.$u.api.listDoctor(this.queryParams).then(res => {
					console.log(res)
					let list = res.rows;
					list.forEach(item => {
						this.doctorList.push(item);
					})
					this.total = res.total;
					// 如果是最后一页
					if (this.queryParams.pageSize * this.queryParams.pageNum >= this.total) {
						this.loadStatus = "nomore"
					} else {
						this.loadStatus = "loadmore"
					}
				})
			},

			toDetail(id) {
				this.$u.route('/pages/doctor/index', {
					id: id
				})
			}

		}
	}
</script>


<style lang="scss" scoped>

	.search-wrap {
		margin: 0 20rpx;
		flex: 1;
	}

	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
	}
	
	.item {
		padding: 20rpx 40rpx;
	}
</style>
