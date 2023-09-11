<template>
	<view>
		<u-navbar :is-back="false">
			<view class="slot-wrap">
				<view class="u-flex">
					<image src="../../static/image/cmt.jpg"></image>
					<text class="u-font-30 u-m-l-20">消息</text>
				</view>
			</view>
		</u-navbar>
		<view v-if="list.length==0" class="u-text-center u-tips-color u-m-t-20 u-type-primary">
			<text>暂无消息</text>
		</view>

		<u-card v-for="(item,index) in list" :key="item.id" :show-head="false" border-radius="22" @click="toDetail(item.doctorId, item.doctorName)">
			<view slot="body">
				<view class="u-flex">
					<u-avatar :src="getBaseUrl()+item.doctorPhoto"></u-avatar>
					<view class="u-p-l-30">
						<view>
							<text>{{item.doctorName}}</text>
							<text class="u-p-l-30">{{item.doctorLevel}}</text>
							<text class="u-p-l-30">{{item.officeName}}</text>
						</view>
						<view class="u-tips-color u-m-t-10">{{item.content}}</view>
					</view>
				</view>
			</view>
		</u-card>
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
				list: [],
			}
		},
		onShow() {
			this.getDoctorMsgList();
		},
		methods: {
			getDoctorMsgList() {
				this.$u.api.listDoctorMsg().then(res => {
					this.list = res.data;
				})
			},

			toDetail(doctorId, doctorName) {
				this.$u.route('/pages/message/detail', {
					doctorId,
					doctorName
				})


			}

		}
	}
</script>

<style lang="scss" scoped>
	.list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	.wrap {

		width: 50%;

		.item {
			border-radius: 8px;
			margin: 5px;
			background-color: #ffffff;
		}
	}

	.slot-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex: 1;
		padding: 0 30rpx;

		image {
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>
