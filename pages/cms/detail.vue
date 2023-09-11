<template>
	<view>
		<u-navbar :is-back="true" :title="title"></u-navbar>
		<view class="u-padding-20 article-content">
			<view class="title">
				{{articleInfo.title}}
			</view>
			<view class="u-font-10 u-margin-top-10">
				{{articleInfo.createTime}}
			</view>
			<view class="u-margin-top-10 u-text-center">
				<image :src="getBaseUrl()+articleInfo.cover" mode="aspectFit" class="cover"></image>
			</view>
			<view>
				<u-parse :html="articleInfo.content"></u-parse>
			</view>
		</view>
		<view>
			<u-section :title="'评论（共'+articleInfo.commentNum+'条）'" :right="false" font-size="35"></u-section>
		</view>
		<view class="comment" v-for="(res, index) in commentList" :key="res.id">
			<view class="left">
				<u-avatar :src="getBaseUrl()+res.avatar" mode="aspectFill"></u-avatar>
			</view>
			<view class="right">
				<view class="top">
					<view class="name">{{ res.name }}</view>
					<view class="like" :class="{ highlight: res.isLike }">
						<view class="num">{{ res.likeNum }}</view>
						<u-icon v-if="!res.isLike" name="thumb-up" :size="30" color="#9a9a9a"
							@click="getLike(index,res.id)">
						</u-icon>
						<u-icon v-if="res.isLike" name="thumb-up-fill" :size="30" @click="getLike(index,res.id)">
						</u-icon>
					</view>
				</view>
				<view class="content">
					<u-parse :html="res.contentText"></u-parse>
				</view>
				<view class="reply-box">
					<view class="item" v-for="(item, replyIndex) in res.replyList" v-if="replyIndex<3" :key="item.id">
						<view class="username">{{ item.userName }}</view>
						<view class="text">
							<u-parse :html="item.content"></u-parse>
						</view>
						<view class="bottom">{{item.createTime}}</view>
					</view>
					<view class="all-reply" @tap="toAllReply(res)"
						v-if="res.replyList != undefined&&res.replyList.length>2">
						共{{ res.allReply}}条回复
						<u-icon class="more" name="arrow-right" :size="26"></u-icon>
					</view>
				</view>
				<view class="bottom">
					{{ res.date }}
					<view class="reply" @click="openleReplyModal(res)">回复</view>
				</view>
			</view>
		</view>
		<view class="u-padding-10 position-sticky fixed-bottom">
			<view class="u-flex u-row-between u-p-lr-20">
				<view class="u-col-10">
					<view class="u-flex">
						<view>
							<u-input v-model="comment.content" placeholder="发表你的评论" :border="true"></u-input>
						</view>
						<view class="u-margin-left-5 u-p-l-10">
							<u-button type="primary" size="medium" @click="handleSave">提交</u-button>
						</view>
					</view>
				</view>
				<view class="u-col-2 u-p-r-20">
					<u-icon name="share" size="50" @click="sharePopShow=true"></u-icon>
				</view>
			</view>
		</view>
		<u-popup v-model="sharePopShow" mode="bottom">
			<view class="u-text-center u-padding-20">分享</view>
			<view class="u-flex">
				<view class="u-flex-4 u-text-center">
					<image src="/static/image/wx.png" class="share-img" @click="handleShare"></image>
				</view>
				<view class="u-flex-4 u-text-center">
					<image src="/static/image/friends.png" class="share-img" @click="handleShare"></image>
				</view>
				<view class="u-flex-4 u-text-center">
					<image src="/static/image/qq.png" class="share-img" @click="handleShare"></image>
				</view>
			</view>
			<view class="u-padding-10">
				<u-button type="primary" @click="sharePopShow=false">取消</u-button>
			</view>
		</u-popup>
		<u-modal v-model="replyModalShow" title="回复" @confirm="handleReply" :show-cancel-button="true">
			<view class="u-slot-content">
				<u-form :model="reply" ref="form" :rules="rules">
					<u-form-item prop="content">
						<u-input type="textarea" v-model="reply.content" />
					</u-form-item>
				</u-form>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				category: '',
				title: '科普详情',
				sharePopShow: false,
				replyModalShow: false,
				articleInfo: {},
				comment: {
					articleId: '',
					content: '',
				},
				reply: {
					parentId: '',
					content: '',
				},
				commentList: [],
				loadStatus: 'nomore',
				total: 0,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					articleId: '',
				},
				currentComment: null,
				rules: {
					content: [{
						required: true,
						message: '回复内容不能为空',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onLoad(option) {
			this.queryParams.articleId = option.id;
			this.comment.articleId = option.id;
			this.getInfo();
			this.getComment();
		},
		// onReachBottom() {
		// 	if (this.commentList.length < this.total) {
		// 		// this.getList();
		// 		this.getComment()
		// 	} else {
		// 		this.loadStatus = 'nomore';
		// 	}
		// },
		methods: {
			reset() {
				this.comment.content = '';
				this.commentList = [];
				this.queryParams.pageNum = 1;
			},
			handleSave() {
				if (this.comment.content) {
					this.$u.api.addComment(this.comment).then(res => {
						this.$u.toast('发布成功')
						this.reset();
						this.getInfo();
						this.getComment();
					})
				}
			},
			openleReplyModal(comment) {
				this.currentComment = comment;
				this.reply.parentId = comment.id;
				this.reply.content = '';
				this.replyModalShow = true;
				this.$nextTick(()=>{
					this.$refs.form.setRules(this.rules);
				})
				
			},
			handleReply() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.$u.api.addComment(this.reply).then(res => {
							this.$u.toast('回复成功');
							this.replyModalShow = false;
							this.getReply(this.currentComment);
						})
					} else {
						this.replyModalShow = true;
					}
				});
			},
			handleShare() {
				this.sharePopShow = false;
				this.$u.toast('分享成功');
			},
			toAllReply(comment) {
				this.$u.route('/pages/cms/reply', {
					commentId: comment.id
				})
			},
			getInfo() {
				this.$u.api.getArticelDetail(this.queryParams.articleId).then(res => {
					let info = res.data;
					this.articleInfo = {
						id: info.id,
						title: info.title,
						createTime: info.createTime,
						cover: info.cover,
						content: info.content,
						commentNum: info.commentNum ? info.commentNum : 0,
					}
				})
			},
			// 点赞
			getLike(index, commentId) {
				this.commentList[index].isLike = !this.commentList[index].isLike;
				if (this.commentList[index].isLike == true) {
					this.$u.api.likeComment(commentId).then(res => {
						this.commentList[index].likeNum++;
					})
				} else {
					this.$u.api.unlikeComment(commentId).then(res => {
						this.commentList[index].likeNum--;
					})
				}
			},
			getReply(comment) {
				let params = {
					parentId: comment.id
				};
				this.$u.api.getCommentList(params).then(res => {
					comment.replyList = res.rows;
					comment.allReply = res.rows.length;
				});
			},
			// 评论列表
			getComment() {
				this.$u.api.getCommentList(this.queryParams).then(res => {
					let list = res.rows;
					this.total = res.total;
					list.forEach(item => {
						this.commentList.push({
							id: item.id,
							name: item.userName,
							date: item.createTime,
							contentText: item.content,
							avatar: item.avatar,
							allReply: item.replyNum ? item.replyNum : 0,
							likeNum: item.goodNum ? item.goodNum : 0,
							replyList: item.replyList,
							isLike: item.isLiked == '1' ? true : false,
						});
					});
					this.queryParams.pageNum = this.queryParams.pageNum + 1;
					this.total = res.total;
					if (this.commentList.length < this.total) {
						this.loadStatus = 'loadmore';
					} else {
						this.loadStatus = 'nomore';
					}
				})

			},
			handleLoadmore() {
				this.getComment()
			},
		}
	}
</script>

<style scoped lang="scss">
	.article-content {
		.title {
			font-size: 15px;
			font-weight: bold;
		}

		.cover {
			height: 221px;
		}
	}

	.comment {
		display: flex;
		padding: 30rpx;

		.left {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}

		.right {
			flex: 1;
			padding-left: 20rpx;
			font-size: 30rpx;

			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;

				.name {
					color: #5677fc;
				}

				.like {
					display: flex;
					align-items: center;
					color: #9a9a9a;
					font-size: 26rpx;

					.num {
						margin-right: 4rpx;
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

			.content {
				margin-bottom: 10rpx;
			}

			.reply-box {
				background-color: rgb(242, 242, 242);
				border-radius: 12rpx;

				.item {
					padding: 20rpx;
					border-bottom: solid 2rpx $u-border-color;

					.username {
						font-size: 24rpx;
						color: #999999;
					}
				}

				.all-reply {
					padding: 20rpx;
					display: flex;
					color: #5677fc;
					align-items: center;

					.more {
						margin-left: 6rpx;
					}
				}
			}

			.bottom {
				margin-top: 20rpx;
				display: flex;
				font-size: 24rpx;
				color: #9a9a9a;

				.reply {
					color: #5677fc;
					margin-left: 10rpx;
				}
			}
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

	.share-img {
		height: 50px;
		width: 50px;
	}
</style>
