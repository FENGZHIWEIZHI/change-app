<template>
	<view>
		<u-navbar :is-back="true" :title="doctorName"></u-navbar>
		<view v-for="(item,index) in list" :key="item.id" class="u-flex u-col-top u-m-t-20">
			<view class="u-flex-2 u-text-center">
				<u-avatar :src="getBaseUrl()+item.doctorPhoto" v-if="item.fromUserType == '2'"></u-avatar>
			</view>
			<view class="u-flex-8">
				<view class="content">{{item.content}}</view>
				<view class="u-m-t-10 u-font-12 u-tips-color u-m-t-10 contentDown">{{createTime(item.sendTime)}}</view>

			</view>
			<view class="u-flex-2 u-text-center">
				<u-avatar :src="getBaseUrl()+userInfo.avatar" v-if="item.fromUserType == '1'"></u-avatar>
			</view>
		</view>
		<view class="u-margin-top-50 u-p-20 position-sticky fixed-bottom u-border-top">
			<view class="u-flex u-row-between">
				<view>
					<u-input v-model="content" placeholder="给医生发送私信" :clearable="false"></u-input>
				</view>
				<view v-if="show">
					<u-button type="success" size="mini" @click="sendMsg()">发送</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				doctorName: '',
				doctorId: '',
				list: [],
				show: false,
				content: ''
			}
		},
		computed: {
			createTime() {
				return val => {
					if (typeof(val) !== 'object') {
						val = val.replace(/-/g, '/');
					}
					let timestamp = new Date(val).getTime();
					return this.$u.timeFrom(timestamp, 'mm月dd日 hh:MM');
				};
			},
		},
		watch: {
			content(newValue, oldValue) {
				if (newValue) {
					this.show = true;
				}
			}
		},
		onLoad(options) {
			this.doctorId = options.doctorId;
			this.doctorName = options.doctorName;
			this.getMsgList();
		},
		methods: {

			getMsgList() {
				this.$u.api.listMsg({
					doctorId: this.doctorId
				}).then(res => {
					this.list = res.data;
				})
			},

			sendMsg() {
				if (!this.content) {
					this.$u.toast("请输入内容")
					return
				}
				let data = {
					doctorId: this.doctorId,
					content: this.content
				}
				this.$u.api.addMessage(data).then(res => {
					this.content ='';
					this.show = false;
					this.getMsgList();
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style lang="scss" scoped>
	.content {
		color: $u-tips-color;
		background-color: $u-bg-color;
		line-height: 1.8;
		padding: 20rpx;
		font-size: 26rpx;
		border-radius: 5px;
	}
	.contentDown{
		font-size: 10rpx;
	}
</style>
