export default {
	getArticleList(query) {
		return uni.$u.get('/cms/article/list', query);
	},

	getArticelDetail(id) {
		return uni.$u.get('/cms/article/detail/' + id);
	},

	getCommentList(query) {
		return uni.$u.get('/cms/comment/list', query);
	},

	addComment(data) {
		return uni.$u.post('/cms/comment', data);
	},

	likeComment(id) {
		return uni.$u.post('/cms/comment/like/' + id);
	},

	unlikeComment(id) {
		return uni.$u.post('/cms/comment/unlike/' + id);
	},

	getCommentInfo(id) {
		return uni.$u.get('/cms/comment/' + id);
	},
}
