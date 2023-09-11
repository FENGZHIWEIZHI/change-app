<template>
	<view>
		<u-navbar :is-back="false" :title="title">
			<view class="slot-wrap">
				<view class="u-flex">
					<image src="../../static/image/cmt.jpg"></image>
					<text class="u-font-30 u-m-l-20">我的</text>
				</view>

				<view>
					<u-icon name="setting-fill" class="icon" @click="toSetting()"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="my-info u-margin-20 u-padding-20" @click="handleProfile">
			<view class="u-flex u-col-center">
				<view class="u-flex-3">
					<u-avatar :src="getBaseUrl()+profile.avatar" size="140"></u-avatar>
				</view>
				<view class="u-flex-9">
					<view class="name">{{profile.realName}}</view>
					<view class="sex">{{profile.sex=='0'?'男':profile.sex=='1'?'女':'保密'}} <text
							v-if="profile.age">{{profile.age}}岁</text></view>
				</view>
			</view>
		</view>
		<view class="u-margin-top-20 menu">
			<u-cell-group>
				<u-cell-item title="挂号记录" :arrow="true" @click="handleReg">
					<view slot="icon" class="u-flex">
						<image mode="widthFix" src="/static/image/icon/register.png" class="icon"></image>
					</view>
				</u-cell-item>
				<u-cell-item title="问诊记录" :arrow="true" @click="handleAsk">
					<view slot="icon" class="u-flex">
						<image mode="widthFix" src="/static/image/icon/Consultation.png" class="icon"></image>
					</view>
				</u-cell-item>
				<u-cell-item title="开药记录" :arrow="true" @click="handlePrescribe">
					<view slot="icon" class="u-flex">
						<image mode="widthFix" src="/static/image/icon/Prescribe_medicine.png" class="icon"></image>
					</view>
				</u-cell-item>
				<u-cell-item title="我的处方" :arrow="true" @click="handlediagnosis">
					<view slot="icon" class="u-flex">
						<image mode="widthFix" src="/static/image/icon/prescription.png" class="icon"></image>
					</view>
				</u-cell-item>
				<u-cell-item :title="Visits" :arrow="true" @click="handlePatient">
					<view slot="icon" class="u-flex">
						<image mode="widthFix" src="/static/image/icon/Patient_management.png" class="icon"></image>
					</view>
				</u-cell-item>
			</u-cell-group>
		</view>
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
				title: "",
				profile: {},
				Visits:'就诊人管理',
				num:{
					box:1
				}
			}
		},
		onLoad() {
			this.getProfile();
		},
		onShow() {
			this.getProfile();
		},
		methods: {
			handlePatient(){
				this.$u.route('/pages/patient/index',this.num)
			},
			handleProfile() {
				this.$u.route('/pages/my/profile')
			},
			handleReg() {
				this.$u.route('/pages/my/registration')
			},
			handleAsk() {
				this.$u.route('/pages/my/ask')
			},
			handlePrescribe() {
				this.$u.route('/pages/my/prescribe')
			},
			handlediagnosis() {
				this.$u.route('/pages/my/diagnosis')
			},
			getProfile() {
				this.$u.api.getUserInfo().then(res => {
					this.$u.vuex('userInfo', res.userInfo);
					this.profile = res.userInfo;
				})
			},
			toSetting() {
				this.$u.route('/pages/my/setting')
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>

<style scoped lang="scss">
	.slot-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		flex: 1;
		/* 如果您想让slot内容与导航栏左右有空隙 */
		padding: 0 30rpx;

		image {
			width: 60rpx;
			height: 60rpx;
		}

		.icon {
			font-size: 38rpx;
			color: $u-type-primary;
		}
	}

	.my-info {
		background-color: $u-type-primary;
		border: 1px;
		border-radius: 15rpx;

		.name {
			color: #FFFFFF;
			font-weight: bold;
			font-size: 15px;
		}

		.sex {
			color: #FFFFFF;
			font-size: 14px;
		}
	}

	.menu {
		background-color: #FFFFFF;

		.icon {
			width: 24px;
		}
	}
</style>
