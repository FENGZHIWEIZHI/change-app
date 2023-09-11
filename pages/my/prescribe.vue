<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view>
			<u-dropdown ref="uDropdown" @open="open" @close="close">
				<u-dropdown-item @change="search()" v-model="queryParams.recentMonth" title="创建时间" :options="timeOpts">
				</u-dropdown-item>
				<u-dropdown-item @change="search()" v-model="queryParams.status" title="缴费状态" :options="statusOpts">
				</u-dropdown-item>
			</u-dropdown>
		</view>
		<view v-if="orderList.length==0" class="u-text-center u-tips-color u-m-t-20 u-type-primary">
			<text>暂无信息</text>
		</view>
		<u-card v-for="(item,index) in orderList" :key="item.id">
			<view slot="head">
				<view class="u-flex u-row-between">
					<view class="u-flex">
						<u-avatar :src="getBaseUrl()+item.doctorPhoto"></u-avatar>
						<view class="u-p-l-30">
							<view>
								{{item.doctorName}} {{item.doctorLevel}} {{item.officeName}}
							</view>
							<view v-if="item.total">
								<text class="u-tips-color">开药 ￥{{item.total}}</text>
							</view>
						</view>
					</view>
					<view @click="toDetail(item.id)">
						<text class="u-type-error-dark"
							v-if="item.status=='待支付'||item.status=='未支付'">{{item.status}}</text>
						<text class="u-tips-color" v-else>{{item.status}}</text>
					</view>
				</view>
			</view>
			<view slot="body">
				<text class="u-line-2">病情描述：{{item.sickDesc?item.sickDesc:''}}</text>
			</view>
			<view slot="foot">
				<view class="u-flex u-row-between">
					<view class="u-tips-color u-font-13"> {{item.buyTime?item.buyTime:''}}</view>
					<view v-if="item.status=='已完成' || item.status=='已取消'">
						<view>
							<u-button type="primary" shape="circle" :plain="true" size="mini" @click.stop="deleteOrder(item)">
								删除订单
							</u-button>
						</view>
					</view>
					<view v-if="item.status=='待支付'||item.status=='未支付'||item.status=='待接诊'" class="u-flex">
						<view>
							<u-button type="primary" shape="circle" :plain="true" size="mini" @click.stop="cancelOrder(item)">
								取消订单
							</u-button>
						</view>
						<view class="u-m-l-10" v-if="item.status=='待支付'||item.status=='未支付'">
							<u-button type="primary" shape="circle" size="mini" @click.stop="toPay(item.id)">去支付
							</u-button>
						</view>
					</view>
				</view>
			</view>
		</u-card>
		<u-loadmore :status="loadStatus" @loadmore="handleLoadmore" v-if="orderList.length > 0" />

		<u-modal v-model="delModelShow" @confirm="handleDel()" ref="uDelModal" :show-title="false"
			:show-cancel-button="true" @cancel="delModelShow=false" content="确定要删除该记录吗？"></u-modal>
		<u-modal v-model="cancelModelShow" @confirm="handleCancel()" ref="uCancelModal" :show-title="false"
			:show-cancel-button="true" @cancel="cancelModelShow=false" content="确定要取消该预约吗？"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '开药记录',
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
				selectOrder: null,
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
			search() {
				this.resetPage();
				this.getOrderList();
			},
			deleteOrder(order) {
				this.delModelShow = true;
				this.selectOrder = order;
			},
			cancelOrder(order) {
				this.cancelModelShow = true;
				this.selectOrder = order;
			},
			// 处理删除逻辑
			handleDel() {
				this.$u.api.deletePrescribeOrder(this.selectOrder.id).then(response => {
					this.selectOrder = null;
					this.resetPage();
					this.getOrderList();
					this.$u.toast("删除成功");
				});
			},
			// 处理取消订单逻辑
			handleCancel() {
				this.selectOrder.status = '已取消';
				this.$u.api.updatePrescribeOrder(this.selectOrder).then(response => {
					this.$u.toast("取消成功");
					this.resetPage();
					this.getOrderList();
					this.selectOrder = null;
				});
			},
			toPay(id) {
				this.$u.route('/pages/prescribe/pay', {
					id
				});
			},
			toDetail(id) {
				this.$u.route('/pages/prescribe/detail', {
					id
				});
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


			getStatusOpts() {
				this.$u.api.getDicts("medicine_order_status").then(response => {
					let list = response.data;
					list.forEach(item => {
						this.statusOpts.push({
							label: item.dictLabel,
							value: item.dictValue
						})
					})
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

<style>

</style>
