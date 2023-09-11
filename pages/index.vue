<template>
	<view>
		<u-swiper :list="advList"></u-swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				advList: [],
			}
		},
		methods: {
			getAdvList() {
				this.$u.api.listAdv({
					type: '1'
				}).then(res => {
					this.advList = res.data;
				})
			},
		}
	}
</script>

<style>

</style>
