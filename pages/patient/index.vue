<template>
	<view>
		<u-navbar :is-back="true" :title="boxState=='1'?title1:title" :custom-back="handleTop"></u-navbar>
		<u-card v-for="item in list" :key="item.id" :show-foot="false" :show-head="false" @click="handleSelect(item)">
			<view slot="body">
				<u-row>
					<u-col span="3">
						<image v-if="item.relation=='本人'" class="icon" src="/static/image/myself.png"></image>
						<image v-if="item.relation=='父母'" class="icon" src="/static/image/parents.png"></image>
						<image v-if="item.relation=='夫妻'" class="icon" src="/static/image/couple.png"></image>
					</u-col>
					<u-col span="9">
						<u-row>
							<u-col span="10">
								<view class="u-flex">
									<view class="u-margin-right-5">
										{{item.name}}
									</view>
									<u-tag :text="item.relation" type="success" shape="circle">
									</u-tag>
								</view>
								<view>
									{{item.tel}}
								</view>
							</u-col>
							<u-col span="1">
								<u-button size="mini" type="primary" :plain="true" @click.stop="handleEdit(item.id)">编辑
								</u-button>
							</u-col>
						</u-row>
						<u-row>
							<u-col span="12">
								<view>
									身份证号：{{item.idCard}}
								</view>
							</u-col>
						</u-row>
					</u-col>
				</u-row>
			</view>
		</u-card>
		<view class="u-padding-10 position-sticky fixed-bottom">
			<u-button type="primary" @click="handleAdd">新增就诊人</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '选择就诊人',
				title1:'就诊人管理',
				list: [],
				queryParams: {},
				boxState:''
			}
		},
		onLoad(options) {
			this.boxState = options.box
		},
		onShow() {
			this.getList()
		},
		methods: {
			handleAdd() {
				this.$u.route('/pages/patient/add');
			},
			handleSelect(item) {
				if(this.boxState=='1'){
					return
				}else{
					let pages = getCurrentPages();
					let prevPage = pages[pages.length - 2];
					prevPage.$vm.selectedPatientId = item.id;
					prevPage.$vm.selectedPatientName = item.name;
					uni.navigateBack();
				}
			},
			getList() {
				this.$u.api.listPatient(this.queryParams).then(res => {
					this.list = res.rows;
				})
			},
			handleEdit(id) {
				this.$u.route('/pages/patient/add', {
					id
				});
			},
			handleTop(){
				uni.navigateBack({
					delta:3
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.icon {
		height: 50px;
		width: 50px;
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
