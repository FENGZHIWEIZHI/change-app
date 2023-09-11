<template>
	<view>
		<u-navbar :is-back="false" :title="title"></u-navbar>
		<view class="u-padding-20">
			<view v-for="(item,index) in list" :key="item.id" class="u-body-item">
				<view v-if="index<3" class="u-flex u-border-bottom u-row-between" @click="handleDetail(item.id)">
					<view class="u-flex-10">
						<view class="u-line-2">{{item.title}}</view>
						<view class="u-body-item-subtitle">{{item.commentNum}}评论
							{{$u.timeFrom(item.createTimeMs,'yyyy-mm-dd hh:MM:ss')}}
						</view>
					</view>
					<view class="u-flex-2">
						<image :src="getBaseUrl()+item.cover" class="right-img" mode="aspectFill"></image>
					</view>
				</view>
				<view v-if="index>=3" class="u-border-bottom" @click="handleDetail(item.id)">
					<view class="u-flex u-row-center">
						<view>
							<image :src="getBaseUrl()+item.cover" mode="aspectFill" class="top-img"></image>
						</view>
					</view>
					<view>
						<view class="u-line-2">{{item.title}}</view>
						<view class="u-body-item-subtitle">{{item.commentNum}}评论
							{{$u.timeFrom(item.createTimeMs,'yyyy-mm-dd hh:MM:ss')}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="loadStatus" @loadmore="handleLoadmore" />
		<cmt-footer></cmt-footer>
	</view>
</template>

<script>
	import cmtFooter from '@/pages/footer.vue'
	export default {
		components: {
			cmtFooter
		},
		data() {
			return {
				title: '病例科普',
				list: [],
				loadStatus: 'nomore',
				total: 0,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					category: '1',
				},
			}
		},
		onReachBottom() {
			if (this.list.length < this.total) {
				this.getList();
			} else {
				this.loadStatus = 'nomore';
			}
		},
		onShow() {
			this.reset();
			this.getList();
		},
		onLoad(option) {

		},
		methods: {
			reset() {
				this.list = [];
				this.queryParams.pageNum = 1;
			},
			getList() {
				this.$u.api.getArticleList(this.queryParams).then(res => {
					let list = res.rows;
					list.forEach(item => {
						this.list.push(item);
					})
					this.queryParams.pageNum = this.queryParams.pageNum + 1;
					this.total = res.total;
					if (this.list.length < this.total) {
						this.loadStatus = 'loadmore';
					} else {
						this.loadStatus = 'nomore';
					}
				})
			},
			handleLoadmore() {
				this.getList()
			},
			handleDetail(id) {
				this.$u.route('/pages/cms/detail', {
					id: id,
					category: this.queryParams.category,
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.u-body-item {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 10rpx;

		.right-img {
			width: 135px;
			height: 70px;
			border-radius: 8rpx;
			margin-left: 12rpx;
		}

		.top-img {
			height: 150px;
			border-radius: 10rpx;
			border: 1px solid #eee;
		}
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
</style>
