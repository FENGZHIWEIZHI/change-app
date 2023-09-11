<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="top" v-if="loaded">
			<view class="u-flex u-row-center u-col-top">
				<view class="u-flex-2">
					<u-avatar :src="getBaseUrl()+info.photo"></u-avatar>
				</view>
				<view class="u-flex-10">
					<view class="title">{{info.name}} {{info.level}} {{info.officeName}}</view>
					<view class="u-m-t-10">{{info.hospitalLevel}}
						<text class="u-m-l-20">{{info.hospitalName}}</text>
					</view>
					<view v-if="info.skill" class="u-m-t-10 u-line-2 u-tips-color u-font-13">{{info.skill}}</view>
				</view>
			</view>
		</view>
		<view class="bg-white u-p-tb-20">
			<view class="u-p-tb-20 u-border-bottom u-flex u-font-16">
				<text class="u-m-lr-40">总体评分:</text>
				<u-rate size="40" :disabled="isDisabled1" v-model="score" min-count="1" :active-color="activeColor" ></u-rate>
				<text class="u-m-l-60 right">{{level}}</text>
			</view>
			<view class="u-m-t-30 u-p-20">
				<u-input type="textarea" v-model="form.comment" height="200" :auto-height="true"
					:placeholder="placeText" :clearable="false"></u-input>
			</view>
		</view>

		<view class="u-margin-top-50 u-p-20 position-sticky fixed-bottom">
			<u-button v-if="isDisabled" type="primary" @click="handleSubmit()">提交评价</u-button>
		</view>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				loaded: false,
				title: '评价',
				info: {},
				activeColor: "#ff9900",
				level: "评分",
				placeText: '您可以从服务人员的专业知识、服务态度、服务效果等方面说说自己的感受~',
				score: 0,
				form: {
					doctorId: '',
					type: '',
					referId:'',
					score: '',
					comment: ''
				},
				levelList: ['评分', '非常差', '差', '一般', '好', '非常好'],
				isDisabled:false,
				isDisabled1:false

			}
		},
		onLoad(options) {
			this.form.doctorId = options.doctorId;
			this.form.type = options.type;
			this.form.referId = options.referId;
			this.getInfo();
		},
		watch: {
			score(newValue, oldValue) {
				this.level = this.levelList[newValue]
			}
		},
		methods: {
			// 获取医生详情
			getInfo() {
				this.$u.api.getDoctor(this.form.doctorId).then(res => {
					this.info = res.data;
					this.loaded = true;
					if(res.data.doctorScore){
						this.score = res.data.doctorScore
						this.isDisabled = false
						this.isDisabled1 = true
					}else{
						this.isDisabled = true
						this.isDisabled1 = false
					}
				})
			},
			// 跳转医院
			handleSubmit() {
				if (!this.form.comment) {
					this.$u.toast("请输入评价")
				}
				if (this.score == 0) {
					this.$u.toast("请评分")
				}
				this.form.score = this.score;
				this.$u.api.addDoctorComment(this.form).then(res => {
					this.$u.toast("评价成功")
					setTimeout(() => {
						uni.navigateBack();
					}, 2000);
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		margin: 20rpx 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		padding: 20rpx 30rpx;
	}

	.right {
		border-bottom: 1px solid $u-content-color;
	}
	*{touch-action: none;}
</style>
