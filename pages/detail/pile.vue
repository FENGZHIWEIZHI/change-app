<template>
	<view class="content">
		<u-navbar :is-back="true" :title="doctorName"></u-navbar>
		<view class="head">
			<view class="">
				<view class="head-title">
					{{'260'}}
					<text class="head-text">度</text>
				</view>
				<view class="head-content">
					使用电量
				</view>
			</view>
			<view class="">
				<view class="head-title">
					{{'129'}}
					<text class="head-text">单</text>
				</view>
				<view class="head-content">
					订单数
				</view>
			</view>
			<view class="">
				<view class="head-title">
					{{'1265'}}
					<text class="head-text">元</text>
				</view>
				<view class="head-content">
					收益
				</view>
			</view>
		</view>
		<view class="part">
			<view class="part-head">
				基本信息
			</view>
			<view class="">
				<view class="part-title">
					<view class="part-text">
						充电桩编号
					</view>
					<view class="">
						{{'35839232892'}}
					</view>
				</view>
				<view class="part-title">
					<view class="part-text">
						所属充电站
					</view>
					<view class="">
						{{'大山充电站'}}
					</view>
				</view>
				<view class="part-title">
					<view class="part-text">
						充电桩位置
					</view>
					<view class="">
						{{'辽宁省大连市高新区火炬路72号'}}
					</view>
				</view>
				<view class="part-title">
					<view class="part-text">
						充电桩类型
					</view>
					<view class="">
						{{'交流电充电桩'}}
					</view>
				</view>
				<view class="part-title">
					<view class="part-text">
						充电桩功率
					</view>
					<view class="">
						{{92}}KW
					</view>
				</view>
				<view class="part-title">
					<view class="part-text">
						所属加盟商
					</view>
					<view class="">
						{{'飞飞充电桩公司'}}
					</view>
				</view>
			</view>
		</view>
		<view class="part">
			<view class="part-head">
				价格信息
			</view>
			<view class="part-title">
				<view class="part-text">
					正常时段
				</view>
				<view class="">
					8:00-20:00{{'1.123'}}元/度
				</view>
			</view>
			<view class="part-title">
				<view class="part-text">
					特殊时段
				</view>
				<view class="">
					0:00-8:00,20:00-24:00{{'0.923'}}元/度
				</view>
			</view>
		</view>
		<view class="part">
			<view class="part-head">
				耗电分析
			</view>
			<qiun-data-charts 
			      type="area"
			      :opts="opts"
			      :chartData="chartData"
			    />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				doctorName: '',
				chartData: {},
				opts: {
				        color: ["#29E1AF","#91CB74","#1890FF","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				        padding: [15,15,0,15],
				        enableScroll: false,
				        legend: {},
				        xAxis: {
				          disableGrid: true
				        },
				        yAxis: {
						gridType: "dash",
						disableGrid:true,
						showTitle:true,
						          dashLength: 2,
						          data: [
						            {
						              min: 0,
						              max: 120,
									  title:'耗电量/kwh',
						            }
						          ]
				        },
				        extra: {
				          area: {
				            type: "straight",
				            opacity: 0.2,
				            addLine: true,
				            width: 2,
				            gradient: false,
				            activeType: "hollow"
				          }
				        }
				      }
			}
		},
		computed: {
			
		},
		watch: {
			
		},
		onLoad(option) {
			console.log(option);
			this.doctorName = option.title
		},
		onReady() {
		    this.getServerData();
		  },
		methods: {
			getServerData() {
			      //模拟从服务器获取数据时的延时
			      setTimeout(() => {
			        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
			        let res = {
			            categories: ["12.07","12.08","12.09","12.10","12.11","12.12"],
			            series: [
			              // {
			              //   name: "成交量A",
			              //   data: [35,8,25,37,4,20]
			              // },
			              {
			                name: "日期",
			                data: [15,65,35,79,10,38]
			              },
			              // {
			              //   name: "成交量C",
			              //   data: [100,80,95,150,112,132]
			              // }
			            ]
			          };
			        this.chartData = JSON.parse(JSON.stringify(res));
			      }, 500);
			    },
			
				
			
		}
	}
</script>

<style lang="scss" scoped>
	.content{background-color: #F2F9F6;height: 100vh;padding: 20rpx;}
	.head{
		display: flex;
		justify-content: space-around;
		background: linear-gradient(#F4FFFC,#D7FEF1);
		padding: 30rpx 0rpx 30rpx 0rpx;
		border-radius: 20rpx;
		.head-title{
			font-weight: bold;
			font-size: 30rpx;
			line-height: 50rpx;
			text-align: center;
			.head-text{
				font-size: 24rpx;
				color: #666;
				font-weight: normal;
			}
		}
		.head-content{
			color: #666;
			font-style: 24rpx;
			text-align: center;
		}
	}
	.part{
		background-color: #fff;
		margin-top: 20rpx;
		border-radius: 20rpx;
		padding: 30rpx;
		.part-head{
			border-bottom: 1rpx solid #F0F0F0;
			line-height: 80rpx;
			font-weight:bold;
		}
		.part-title{
			display: flex;
			justify-content: space-between;
			line-height: 60rpx;
			.part-text{
				color: #999;
			}
		}
	}
</style>