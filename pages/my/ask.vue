<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view>
			<u-dropdown ref="uDropdown" @open="open" @close="close">
				<u-dropdown-item @change="search()" v-model="queryParams.recentMonth" title="创建时间" :options="timeOpts">
				</u-dropdown-item>
				<u-dropdown-item @change="search()" v-model="queryParams.status" title="问诊状态" :options="statusOpts">
				</u-dropdown-item>
			</u-dropdown>
		</view>
		<view v-if="orderList.length==0" class="u-text-center u-tips-color u-m-t-20 u-type-primary">
			<text>暂无问诊记录</text>
		</view>
		<u-card v-for="(item,index) in orderList" :key="item.id">
			<view slot="head">
				<view class="u-flex u-row-between">
					<view class="u-flex">
						<u-avatar :src="getBaseUrl()+item.doctorPhoto"></u-avatar>
						<view class="u-p-l-30">
							<view>{{item.doctorName}}</view>
							<view class="u-tips-color u-font-13 u-m-t-10"><text>{{item.doctorLevel}}</text><text
									class="u-m-l-20">{{item.officeName}}</text></view>
						</view>
					</view>
					<view @click="toDetail(item.id)">
						<text class="u-type-error-dark u-m-r-10" v-if="item.status=='待支付'">{{item.status}}</text>
						<text class="u-tips-color u-m-r-10" v-else>{{item.status}}</text>
						<u-icon name="arrow-right" size="32"></u-icon>
					</view>
				</view>
			</view>
			<view slot="body">
				<view>
					
					<view class="u-margin-top-10 u-line-2 lh">病情描述：{{item.detail}}</view>
				</view>
			</view>
			<view slot="foot">
				<view class="u-flex u-row-between">
					<view class="u-tips-color u-font-13"> {{item.createTime}}</view>
					
					<view v-if="item.status=='待接诊'">
						<view class="u-m-l-20">
							<u-button type="primary" shape="circle" :plain="true" size="mini" @click.stop="cancelOrder(item.id, index)">取消订单</u-button>
						</view>
					</view>
					
					<view v-if="item.status=='已完成'">
						<view class="u-m-l-20">
							<u-button type="primary" shape="circle" :plain="true" size="mini" @click.stop="deleteOrder(item.id, index)">删除订单</u-button>
						</view>
					</view>
					
					<view v-if="item.status=='已支付' || item.status=='已取消'">
						<view>
							<u-button type="primary" shape="circle" :plain="true" size="mini" @click.stop="deleteOrder(item.id, index)">删除订单</u-button>
						</view>
					</view>
					<view v-if="item.status=='待支付'" class="u-flex">
						<view>
							<u-button type="primary" shape="circle" :plain="true" size="mini" @click.stop="cancelOrder(item.id, index)">取消订单</u-button>
						</view>
						<view class="u-m-l-20">
							<u-button type="primary" shape="circle" size="mini" @click.stop="toPay(item.id)">去支付</u-button>
						</view>
					</view>
				</view>
			</view>
		</u-card>
		<u-loadmore :status="loadStatus" @loadmore="handleLoadmore" v-if="orderList.length > 0"/>
		<view></view>

		<u-modal v-model="delModelShow" @confirm="handleDel()" ref="uDelModal" :show-title="false"
			:show-cancel-button="true" @cancel="delModelShow=false" content="确定要删除该记录吗？"></u-modal>


		<u-modal v-model="cancelModelShow" @confirm="handleCancel()" ref="uCancelModal" :show-title="false"
			:show-cancel-button="true" @cancel="cancelModelShow=false" content="确定要取消该订单吗？"></u-modal>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '问诊记录',
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
					status: '',
					recentMonth: 0,
				},
				orderList: [],
				statusOpts: [{
					label: '全部状态',
					value: ''
				}],
				selectId: null,
				selectIdx: null,
				delModelShow: false,
				cancelModelShow: false,
			}
		},
		onLoad() {
			this.getStatusOpts();
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

			resetPage() {
				this.queryParams.pageNum = 1;
				this.queryParams.pageSize = 10;
				this.orderList = [];
			},

			handleLoadmore() {
				this.queryParams.pageNum++;
				this.loadStatus = "loading";
				this.getOrderList();
			},

			getOrderList() {
				this.$u.api.listConsultation(this.queryParams).then((res) => {
					let list = res.rows;
					list.forEach(item => {
						this.orderList.push(item);
					})
					this.total = res.total;
					// 如果是最后一页
					if (this.queryParams.pageSize * this.queryParams.pageNum >= this.total) {
						this.loadStatus = "nomore"
					} else {
						this.loadStatus = "loadmore"
					}
				});
			},


			getStatusOpts() {
				this.$u.api.getDicts("consultation_order_status").then(response => {
					let list = response.data;
					list.forEach(item => {
						this.statusOpts.push({
							label: item.dictLabel,
							value: item.dictValue
						})
					})
				});
			},

			search() {
				this.queryParams.pageNum = 1;
				this.orderList = [];
				this.getOrderList();
			},

			deleteOrder(id, index) {
				this.delModelShow = true;
				this.selectId = id;
				this.selectIdx = index;
			},

			cancelOrder(id, index) {
				this.cancelModelShow = true;
				this.selectId = id;
				this.selectIdx = index;
			},

			// 处理删除逻辑
			handleDel() {
				this.$u.api.delConsultation(this.selectId).then(response => {
					this.orderList.splice(this.selectIdx, 1);
					this.selectId = null;
					this.selectIdx = null;
					this.$u.toast("删除成功");
				});
			},
			// 处理取消订单逻辑
			handleCancel() {
				let data = {
					id: this.selectId,
					status: '已取消'
				};
				this.$u.api.updateConsultation(data).then(response => {
					this.$u.toast("取消成功");
					this.orderList[this.selectIdx].status = "已取消";
					this.selectId = null;
					this.selectIdx = null;
				});
			},

			toDetail(id) {
				this.$u.route('/pages/ask/detail', {
					id: id
				});
			},

			toPay(id) {
				this.$u.route('/pages/ask/pay', {
					id
				});
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

<style scoped>
	.lh{
		line-height: 1.8;
	}
</style>
