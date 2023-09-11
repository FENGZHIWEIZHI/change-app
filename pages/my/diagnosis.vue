<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view>
			<u-dropdown ref="uDropdown" @open="open" @close="close">
				<u-dropdown-item @change="search()" v-model="queryParams.recentMonth" title="开单时间" :options="timeOpts">
				</u-dropdown-item>
				<u-dropdown-item @change="search()" v-model="queryParams.valid" title="状态" :options="statusOpts">
				</u-dropdown-item>
			</u-dropdown>
		</view>
		<view v-if="orderList.length==0" class="u-text-center u-tips-color u-m-t-20 u-type-primary">
			<text>暂无信息</text>
		</view>
		<u-card v-for="(item,index) in orderList" :key="item.id">
			<view slot="body">
				<view class="u-flex u-col-center">
					<view class="u-flex-10">
						诊断结果：{{item.diagnosis?item.diagnosis:''}}
					</view>
					<view class="u-flex-2" :class="[item.valid=='有效'?'valid':'unvalid']" @click="handleDetail(item.id)">
						{{item.valid}}>
					</view>
				</view>
				<view class="u-line-2">
					处理意见：{{item.suggest?item.suggest:''}}
				</view>
			</view>
			<view slot="foot">
				<view class="u-tips-color">
					医生：{{item.doctorName?item.doctorName:''}}
				</view>
				<view>
					<view class="u-tips-color">开单时间：{{item.buyTime?item.buyTime:''}}</view>
				</view>
			</view>
		</u-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '我的处方',
				loadStatus: 'loadmore',
				total: 0,
				timeOpts: [{
						label: '近1个月',
						value: 1,
					},
					{
						label: '近3个月',
						value: 3,
					},
					{
						label: '近6个月',
						value: 6,
					},
					{
						label: '6个月之前',
						value: -1,
					},
				],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					status: '已完成',
					recentMonth: 0,
				},
				orderList: [],
				statusOpts: [{
						label: '全部状态',
						value: '',
					}, {
						label: '有效',
						value: '1',
					},
					{
						label: '已无效',
						value: '0',
					}
				],
			}
		},
		onLoad() {

		},
		onShow() {
			this.resetPage();
			this.getOrderList();
		},
		onReachBottom() {
			if (this.loadStatus !== "nomore") {
				this.loadStatus = "loading";
				this.queryParams.pageNum++;
				this.getOrderList();
			}
		},
		methods: {
			handleDetail(id) {
				this.$u.route('/pages/prescribe/diagnosis', {
					id
				})
			},
			search() {
				this.resetPage();
				this.getOrderList();
			},
			resetPage() {
				this.queryParams.pageNum = 1;
				this.queryParams.pageSize = 10;
				this.orderList = [];
			},

			getOrderList() {
				this.$u.api.getPrescribeOrderList(this.queryParams).then((res) => {
					let list = res.rows;
					this.total = res.total;
					list.forEach(item => {
						this.$u.api.getDoctor(item.doctorId).then(res => {
							let doctor = res.data;
							item.doctorName = doctor.name;
							item.doctorPhoto = doctor.photo;
							item.doctorLevel = doctor.level;
							item.officeName = doctor.officeName;
							this.orderList.push(item);
						})
					})
					// 如果是最后一页
					if (this.queryParams.pageSize * this.queryParams.pageNum >= this.total) {
						this.loadStatus = "nomore"
					} else {
						this.loadStatus = "loadmore"
					}
				});
			},
			handleLoadmore() {
				this.queryParams.pageNum++;
				this.loadStatus = "loading";
				this.getOrderList();
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
		}
	}
</script>

<style lang="scss" scoped>
	.valid {
		color: $uni-color-success;
	}

	.unvalid {
		color: #909399;
	}
</style>
