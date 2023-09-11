<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<u-card :show-head="false" :show-foot="false" margin="10rpx" v-for="(item,index) in orderItemList"
			:key="item.id">
			<view slot="body" class="info-body">
				<view class="u-flex u-row-center">
					<view class="u-flex-2">
						<image :src="getBaseUrl()+item.medicineCover" class="cover"></image>
					</view>
					<view class="u-flex-10 content">
						<view class="title">{{item.medicineName}}</view>
						<view>{{item.dosage}}</view>
						<view>{{item.medicineProducer}}</view>
					</view>
				</view>
				<view class="u-flex u-row-between u-col-center">
					<view class="u-flex-11">
						数量
						<u-number-box v-model="item.amount" :min="1" :index="index" @change="valChange"
							:disabled-input="true" @minus="valMinus" @plus="valPlus">
						</u-number-box>
					</view>
					<view class="u-flex-1">
						<u-icon name="trash" @click="handleDelete(item.id)"></u-icon>
					</view>
				</view>
			</view>
		</u-card>
		<view v-if="orderItemList.length>0" class="u-padding-10 position-sticky fixed-bottom">
			<u-button type="primary" @click="handleAdd">提交订单</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '用药清单',
				orderId: '',
				orderItemList: [],
			}
		},
		onLoad(options) {
			this.orderId = options.orderId;
			this.getOrderItem();
		},
		methods: {
			getOrderItem() {
				this.$u.api.getMedicineDetail({
					orderId: this.orderId
				}).then(res => {
					console.log(res);
					this.orderItemList = res.data;
					if(this.orderItemList.length == '0'){
						uni.navigateBack();
					}
				})
			},
			handleAdd() {
				this.$u.route('/pages/prescribe/pay', {
					id: this.orderId
				})
			},
			handleDelete(id) {
				this.$u.api.deletePrescribeOrderItem(id).then(res => {
					this.$u.toast('删除成功！');
					this.getOrderItem();
				})
			},
			valChange(val) {

			},
			valMinus(val) {
				let item = this.orderItemList[val.index];
				this.$u.api.updatePrescribeOrderItem(item).then(res => {

				})
			},
			valPlus(val) {
				let item = this.orderItemList[val.index];
				this.$u.api.updatePrescribeOrderItem(item).then(res => {

				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.info-body {

		.cover {
			width: 100rpx;
			height: 100rpx;
		}

		.title {
			font-size: 35rpx;
			font-weight: bold;
		}

		.content {
			font-size: 30rpx;
		}
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
