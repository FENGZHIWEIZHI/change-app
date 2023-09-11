<template>
	<view class="wrap">
		<view class="u-flex u-row-between u-border-bottom u-p-t-20 u-p-b-20">
			<view class="u-flex">
				<text class="u-m-r-20">{{comment.nickName}}</text>
				<u-rate size="40" :disabled="true" v-model="comment.score":active-color="activeColor" @change.stop></u-rate>
			</view>
			<text class="u-tips-color">{{comment.commentTime}}</text>
			
		</view>
		<view class="u-p-t-20 u-p-b-20">
			<text class="content">
				{{comment.comment}}
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "li-comment-item",
		props: ["comment"],
		data() {
			return {
				activeColor: "#ff9900",

			};
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		background-color: #FFFFFF;
		.content {
			line-height: 1.6;
		}
	}
	*{touch-action: none;}
</style>
