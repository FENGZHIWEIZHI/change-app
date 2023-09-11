<template>
	<view>
		<u-row justify="center" gutter="50">
			<u-col span="4">
				<lj-icon-button src="/static/image/icon/ask-doctor1.png" title="问诊" @click="handleAskDoctor">
				</lj-icon-button>
			</u-col>
			<u-col span="4">
				<lj-icon-button src="/static/image/icon/registration.png" title="挂号" @click="handleRegistration">
				</lj-icon-button>
			</u-col>
			<u-col span="4">
				<lj-icon-button src="/static/image/icon/prescribe1.png" title="复诊开药" @click="handlePrescribe">
				</lj-icon-button>
			</u-col>
		</u-row>
	</view>
</template>

<script>
	import ljIconButton from '@/components/lj-icon-button/lj-icon-button.vue'
	export default {
		components: {
			ljIconButton
		},
		data() {
			return {

			}
		},
		methods: {
			handleAskDoctor() {
				this.$u.route('/pages/doctor/search', {
					bizType: 'ask'
				})
			},
			handleRegistration() {
				this.$u.route('/pages/doctor/search', {
					bizType: 'registration'
				})
			},
			handlePrescribe() {
				this.$u.route('/pages/prescribe/index')
			},
		}
	}
</script>

<style>

</style>
