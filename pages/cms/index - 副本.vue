<template>
	<view>
		<u-navbar :is-back="false" :title="title" :borderBottom="false"></u-navbar>
		<u-dropdown>
			<u-dropdown-item v-model="value1" title="充电站" :options="options1" @change="handleSite(value1)"></u-dropdown-item>
			<u-dropdown-item v-model="value2" title="充电桩" :options="options2" @change="getShoeyiData(value2)"></u-dropdown-item>
		</u-dropdown>
		<view class="content" v-if="user">
			<view class="analyse">
				<view class="analyse-head">
					耗电分析
				</view>
				<view class="" v-if="oneDataDetail.length">
					 <qiun-data-charts 
					      type="column"
					      :opts="opts"
					      :chartData="chartData"
						  :ontouch="true"
					    />
				</view>
				<view class="analyse-foot" v-else>
					暂无数据
				</view>
			</view>
			<view class="analyse">
				<view class="analyse-head">
					收益分析
				</view>
				<view class="">
					{{beginTime1}}~{{endTime1}}
				</view>
				<view class="" v-if="twoDataDetail.length">
					  <qiun-data-charts 
						type="rose"
						:opts="option"
						:chartData="chartDatas"
					/>
				</view>
				<view class="analyse-foot" v-else>
					暂无数据
				</view>
			</view>
		</view>
		<view class="user" v-else>
			{{'您名下没有关联充电站!'}}
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
				title: '数据分析',
				oneDataDetail:[],
				twoDataDetail:[],
				chartData: {},
				itemMonth:[],
				beginTime1:'2023-07-01',
				beginTime:'2023-07-01 00:00:00',
				endTime:'2023-12-31 23:59:59',
				endTime1:'2023-12-31',
				opts: {
					enableScroll: true,
					color: ["#27FFBD"],
					padding: [25,15,20,5],
					legend: {show:false},
					xAxis: {
					  itemCount:3,
					  disableGrid: true,
					  title:'日期',
					  titleOffsetX:-10,
					  fontSize:12,
					},
					yAxis: {
						gridType: "dash",
						showTitle:true,
						dashLength: 2,
						
					  data: [
						{
						  title:'每小时耗电量',
						  titleOffsetX:20,
						  titleOffsetY:-10
						}
					  ]
					},
					extra: {
					  column: {
						type: "group",
						width: 40,
						activeBgColor: "#000000",
						activeBgOpacity: 0.01,
						// linearType: "custom"
					  }
					}
				},
				chartDatas:{},
				option: {
				        color: ["#28FFBE","#FFAD49","#20F0FF","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				        padding: [5,5,5,5],
				        enableScroll: false,
				        legend: {
				          show: true,
				          position: "bottom",
				          lineHeight: 25
				        },
						series:{
							legendShape:'square'
						},
				        extra: {
				          rose: {
				            type: "area",
				            minRadius: 50,
				            activeOpacity: 0.5,
				            activeRadius: 10,
				            offsetAngle: 0,
				            labelWidth: 15,
				            border: false,
				            borderWidth: 2,
				            borderColor: "#FFFFFF",
				          },
						  tooltip:{
							  showBox:false
						  }
				        }
				      },
					user:false,
					value1: '0',
					value2: '0',
					options1: [
					],
					options2: [
					],
					userId:'',
					chargingStationId:'',
					SiteList:[],
					pileList:[],
					monthList:[]
			}
		},
		onReachBottom() {
			
		},
		onShow() {
			this.user = uni.getStorageSync('roles').includes('businessman')
			this.getSite()
		},
		onHide(){
			this.options1 = [];
			this.options2 = []
		},
		onLoad(option) {

		},
		onReady() {
		   this.getServerData();
		   this.getServerDatas();
		},
		methods: {
			// getDaysInMonth(year, month) {
			//   const daysOfMonth = [];
			//   month = parseInt(month, 10);
			//   const lastDayOfMonth = new Date(year, month, 0).getDate();
			//   for (let i = 1; i <= lastDayOfMonth; i++) {
			//     if (i < 10) {
			//       daysOfMonth.push(year+"-"+month+"-"+"0" + i);
			//     } else {
			//       daysOfMonth.push(year+"-"+month+"-"+i);
			//     }
			//   }
			//   return daysOfMonth;
			// },
			getSite(){
				this.userId = uni.getStorageSync('userId')
				this.$u.api.getSite(this.userId).then((res)=>{
					this.SiteList = res.data
					this.SiteList.forEach((i,index)=>{
						let obj = {}
						obj.label = i.chargingStationName
						obj.value = index
						this.options1.push(obj)
					})
					this.handleSite(this.value1)
				})
			},
			handleSite(value1){
				this.options2 = []
				this.value2 = '0'
				let query = {
					userId:this.userId,
					chargingStationId:this.SiteList[value1].chargingStationId
				}
				this.$u.api.getPile(query).then((res)=>{
					this.pileList = res.data
					this.pileList.forEach((i,index)=>{
						let obj1 = {}
						obj1.label = i.chargingPileName
						obj1.value = index
						this.options2.push(obj1)
					})
					this.getShoeyiData(this.value2)
					
				})
				
			},
			getShoeyiData(value2) {
				this.monthList = []
				this.oneDataDetail = []
				this.twoDataDetail = []
				let query1 = {
					chargingPileId:this.pileList[value2].chargingPileId,
					beginTime:'2023-01-01 00:00:00',
					endTime:'2023-07-01 23:59:59'
				}
				this.$u.api.getColumnar(query1).then((res)=>{
					if(res.code == 200) {
						let shouyiByDate = [];
						let filterData = res.data.filter(item =>{
							return item.createTime.indexOf('2023-02')>=0 || item.createTime.indexOf('2023-06')>=0
						});
						
						shouyiByDate = this.GroupBy(filterData, function (item) {
							return [item.createTime.split(' ')[0]];
						});
						console.log(shouyiByDate);
						shouyiByDate.forEach((item)=>{
							this.monthList.push(item.letter)
							this.oneDataDetail.push((item.data.reduce((sum, e) => sum + Number(e.chargingCapacity || 0), 0)/(item.data.length*3/3600).toFixed(6)).toFixed(2))
						})
					}
				})
				
				let query2 = {
					chargingPileId:this.pileList[value2].chargingPileId,
					beginTime:this.beginTime,
					endTime:this.endTime,
					chargingOrdersType:'3'
				}
				this.$u.api.getCake(query2).then((res)=>{
					console.log(res);
					let electricity = []  //成本费
					let electricityCost = []  //电费
					let serviceFee = []  //服务费
					res.data.forEach((i)=>{
						electricity.push(i.electricity)
						electricityCost.push(i.electricityCost)
						serviceFee.push(i.serviceFee)
					})
					let gains = {
						name:"收益",
						value:''
					}
					let serve = {
						name:"服务费",
						value:''
					}
					let cost = {
						name:"耗电成本",
						value:''
					}
					let total = eval(electricity.join("+")).toFixed(2)*1 + eval(serviceFee.join("+")).toFixed(2)*1 + eval(electricityCost.join("+")).toFixed(2)*1 - eval(electricity.join("+")).toFixed(2)*1
					cost.value = (eval(electricity.join("+")).toFixed(2)/total*100).toFixed(2)*1
					serve.value = (eval(serviceFee.join("+")).toFixed(2)/total*100).toFixed(2)*1
					gains.value = (100-(cost.value+serve.value)).toFixed(2)*1
					let arrbox = []
					this.twoDataDetail.push(gains)
					this.twoDataDetail.push(serve)
					this.twoDataDetail.push(cost)
				})
				
				this.getServerData();
				this.getServerDatas();
			},
			// getChange(){
			// 	this.userId = uni.getStorageSync('userId')
			// 	this.$u.api.getSite(this.userId).then()
			// },
			GroupBy(array, fn) {
				const groups = {};
				array.forEach(function (item) {
					 const group = JSON.stringify(fn(item));
					 //这里利用对象的key值唯一性的，创建数组
					 groups[group] = groups[group] || [];
					 groups[group].push(item);
				});
				//最后再利用map循环处理分组出来
				return Object.keys(groups).map(function (group) {
					 return {letter: group.replace(/\[|]|"/g,''),data:groups[group]};
				});
			},
			 getServerData() {
			      //模拟从服务器获取数据时的延时
				  console.log(this.oneDataDetail);
			      setTimeout(() => {
			        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
			        let res = {
			            categories: this.monthList,
			            series: [
			              {
			                name: "",
			                data: this.oneDataDetail
			                // data: [180,140,260,230,190,40]
			              }
			            ]
			          };
			        this.chartData = JSON.parse(JSON.stringify(res));
			      }, 1500);
			    },
			getServerDatas() {
				console.log(this.twoDataDetail);
			      //模拟从服务器获取数据时的延时
			      setTimeout(() => {
			        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
			        let res = {
			            series: [
			              {
							data: this.twoDataDetail.map(item => ({...item,legendShape: 'square'}))
			                // data: [{"name":"收益","value":50},{"name":"服务费","value":30},{"name":"耗电成本","value":20}]
			              }
			            ]
			          };
			        this.chartDatas = JSON.parse(JSON.stringify(res));
			      }, 1500);
			    },
				
		}
	}
</script>

<style scoped lang="scss">
	.content{
		background:linear-gradient(rgb(231,252,244), rgb(242,249,246));
		padding: 20rpx;
		height: 100vh;
	}
	.analyse{
		background-color: #fff;
		padding: 30rpx;
		border-radius: 10rpx;
		margin-top: 30rpx;
		.analyse-head{
			font-weight: 500;
			font-size: 40rpx
		}
		.analyse-foot{
			text-align: center;
			line-height: 200rpx;
		}
	}
	/deep/.u-navbar-inner{
		background-color: #e7fcf4;
	}
	.user{
		font-size: 28rpx;
		text-align: center;
		margin-top: 100rpx;
	}
	.u-dropdown{
		background-color:#e7fcf4 ;
	}
</style>
