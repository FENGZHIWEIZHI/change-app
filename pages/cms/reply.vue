<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="comment">
			<view class="top">
				<view class="left">
					<view class="heart-photo">
						<u-avatar :src="getBaseUrl()+comment.avatar" mode=""></u-avatar>
					</view>
					<view class="user-info">
						<view class="name">{{ comment.name }}</view>
						<view class="date">{{ comment.date }}</view>
					</view>
				</view>
				<view class="right" :class="{ highlight: comment.isLike }">
					{{ comment.likeNum }}
					<u-icon v-if="!comment.isLike" name="thumb-up" class="like" color="#9a9a9a" :size="30"
						@click="getLike"></u-icon>
					<u-icon v-if="comment.isLike" name="thumb-up-fill" class="like" :size="30" @click="getLike">
					</u-icon>
				</view>
			</view>
			<view class="content">{{ comment.contentText }}</view>
		</view>
		<view class="all-reply">
			<view class="all-reply-top">全部回复（{{ comment.allReply }}）</view>
			<view class="item" v-for="(item, index) in commentList" :key="index">
				<view class="comment">
					<view class="top">
						<view class="left">
							<view class="heart-photo">
								<u-avatar :src="item.avatar" mode=""></u-avatar>
							</view>
							<view class="user-info">
								<view class="name">{{ item.userName }}</view>
								<view class="date">{{ item.createTime }}</view>
							</view>
						</view>
						<view class="right" :class="{ highlight: item.isLike }">
							<view class="num">{{ item.goodNum?item.goodNum:0}}</view>
							<u-icon v-if="!item.isLike" name="thumb-up" class="like" :size="30" color="#9a9a9a"
								@click="getLike(index,item.id)"></u-icon>
							<u-icon v-if="item.isLike" name="thumb-up-fill" class="like" :size="30"
								@click="getLike(index,item.id)"></u-icon>
						</view>
					</view>
					<view class="content">{{ item.content }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				commentId: '',
				title: '评论详情',
				commentList: [],
				comment: {},
			}
		},
		onLoad(option) {
			this.commentId = option.commentId;
			this.getComment();
			this.getReply();
		},
		methods: {
			// 点赞
			getLike(index, commentId) {
				if (index === 0 || index > 0) {
					this.commentList[index].isLike = !this.commentList[index].isLike;
					if (this.commentList[index].isLike == true) {
						this.$u.api.likeComment(commentId).then(res => {
							this.commentList[index].goodNum++;
						})
					} else {
						this.$u.api.unlikeComment(commentId).then(res => {
							this.commentList[index].goodNum--;
						})
					}
				} else {
					if (this.comment.isLike == true) {
						this.$u.api.unlikeComment(this.commentId).then(res => {
							this.comment.isLike = !this.comment.isLike;
							this.comment.likeNum--;
						})
					} else {
						this.$u.api.likeComment(this.commentId).then(res => {
							this.comment.isLike = !this.comment.isLike;
							this.comment.likeNum++;
						})
					}
				}
			},
			getComment() {
				this.$u.api.getCommentInfo(this.commentId).then(res => {
					let item = res.data;
					this.comment = {
						id: item.id,
						name: item.userName,
						date: item.createTime,
						contentText: item.content,
						avatar: item.avatar,
						allReply: item.replyNum ? item.replyNum : 0,
						likeNum: item.goodNum ? item.goodNum : 0,
						isLike: item.isLiked == '1' ? true : false,
					}
				})
			},
			// 回复列表
			getReply() {
				let params = {
					parentId: this.commentId
				};
				this.$u.api.getCommentList(params).then(res => {
					this.commentList = res.rows;
					this.commentList.forEach(item => {
						item.isLike = item.isLiked == '1' ? true : false;
					})
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.comment {
		padding: 30rpx;
		font-size: 32rpx;
		background-color: #ffffff;

		.top {
			display: flex;
			justify-content: space-between;
		}

		.left {
			display: flex;

			.heart-photo {
				image {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					background-color: #f2f2f2;
				}
			}

			.user-info {
				margin-left: 10rpx;

				.name {
					color: #5677fc;
					font-size: 28rpx;
					margin-bottom: 4rpx;
				}

				.date {
					font-size: 20rpx;
					color: $u-light-color;
				}
			}
		}

		.right {
			display: flex;
			font-size: 20rpx;
			align-items: center;
			color: #9a9a9a;

			.like {
				margin-left: 6rpx;
			}

			.num {
				font-size: 26rpx;
				color: #9a9a9a;
			}
		}

		.highlight {
			color: #5677fc;

			.num {
				color: #5677fc;
			}
		}
	}

	.all-reply {
		margin-top: 10rpx;
		padding-top: 20rpx;
		background-color: #ffffff;

		.all-reply-top {
			margin-left: 20rpx;
			padding-left: 20rpx;
			border-left: solid 4rpx #5677fc;
			font-size: 30rpx;
			font-weight: bold;
		}

		.item {
			border-bottom: solid 2rpx $u-border-color;
		}

		.reply {
			padding: 20rpx;
			background-color: rgb(242, 242, 242);
			border-radius: 12rpx;
			margin: 10rpx 0;

			.username {
				font-size: 24rpx;
				color: #7a7a7a;
			}
		}
	}
</style>
