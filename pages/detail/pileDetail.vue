<template>
	<view class="content">
		<u-navbar :is-back="true" :title="chargeName" :borderBottom="false"></u-navbar>
		<view class="part">
			<view class="list-free" v-show="listItem.chargingPileState=='3'">
				{{'空闲'}}
			</view>
			<view class="list-occupation" v-show="listItem.chargingPileState=='2'">
				{{'运行中'}}
			</view>
			<view class="list-alarm" v-show="listItem.chargingPileState=='1'">
				{{'报警'}}
			</view>
			<view class="list-occupation" v-show="listItem.chargingPileState=='5'">
				{{'连接中'}}
			</view>
			<u-button type="primary" @click="handleOp" v-show="listItem.chargingPileState=='5'&&chargingStatus== '7'" :loading="isLoding" >开始充电</u-button>
			<u-button type="primary" @click="handleDw" v-show="listItem.chargingPileState=='2'||isFlag == true">结束充电</u-button>
			<view class="link" v-if="listItem.chargingPileState=='5'||listItem.chargingPileState=='2'">
				{{'充电桩已连接'}}
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
						{{listItem.chargingPileNo}}
					</view>
				</view>
				<view class="part-title">
					<view class="part-text">
						所属充电站
					</view>
					<view class="">
						{{listItem.chargingStationName}}
					</view>
				</view>
				<view class="part-title">
					<view class="part-text">
						充电桩位置
					</view>
					<view class="part-location">
						{{listItem.chargingPileAddr}}
					</view>
				</view>
				<view class="part-title">
					<view class="part-text">
						充电桩类型
					</view>
					<view class="" v-if="listItem.chargingPileType==1">
						{{'直流充电桩'}}
					</view>
					<view class="" v-else>
						{{'交流充电桩'}}
					</view>
				</view>
				<view class="part-title" v-if="listItem.chargingVoltage=='1'">
					<view class="part-text">
						充电功率
					</view>
					<view class="">
						{{listItem.chargingPileCapacity}}KW
					</view>
				</view>
				<view class="part-title" v-if="listItem.chargingVoltage=='2'">
					<view class="part-text">
						充电功率
					</view>
					<view class="">
						{{listItem.chargingPileCapacity}}KW
					</view>
				</view>
				<view class="part-title" v-if="listItem.chargingVoltage=='1'">
					<view class="part-text">
						电压
					</view>
					<view class="">
						{{'220'}}v
					</view>
				</view>
				<view class="part-title" v-if="listItem.chargingVoltage=='2'">
					<view class="part-text">
						电压
					</view>
					<view class="">
						{{'380'}}v
					</view>
				</view>
				<view class="part-title">
					<view class="part-text">
						充电电量统计
					</view>
					<view class="">
						{{listItem.chargingDuration}}度
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
					全时段
				</view>
				<view class="">
					{{(serviceFee*1+electricityPrice*1).toFixed(2)}}元/度
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
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chargeName: '充电桩详情',
				chartData: {},
				ids:'',
				listItem:{},
				isLoding:false,
				isLink:'',
				opts: {
				        color: ["#29E1AF","#91CB74","#1890FF","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				        padding: [15,25,0,15],
				        enableScroll: false,
				        legend: {},
				        xAxis: {
				          disableGrid: true,
						  fontSize:11,
						  title:'日期',
				        },
				        yAxis: {
						gridType: "dash",
						disableGrid:true,
						showTitle:true,
						          dashLength: 2,
						          data: [
						            {
						              // min: 0,
						              // max: 30,
									  title:'每小时耗电量',
									  titleFontSize:13,
									  titleOffsetX:20
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
				      },
					ElectricityList:[],
					ChargingTimeList:[],
					cumpData:[],
					electricityPrice:'',
					serviceFee:'',
					chargingStationId:'',
					carId:'',
					carIds:[],
					isFlag:'',
					Arr5:[],
					Arr6:[],
					Arr7:[],
					Arr8:[],
					Arr9:[],
					Arr10:[],
					Arr11:[],
					chargingStatus:'',
					ctrlTypeNum: 0
			}
		},
		computed: {
			
		},
		watch: {
			
		},
		onLoad(option) {
			this.ids = option.ids
			this.electricityPrice = option.electricityPrice
			this.serviceFee = option.serviceFee
			this.chargingStationId = option.chargingStationId
			// this.carId = uni.getStorageSync('carId')
			this.aa()
			// this.getChargeDetail()
		},
		onShow() {
			this.carIds = uni.getStorageSync('cars').split(',');
			this.getChargeDetail();
		},
		onReady() {
		    this.getServerData();
			
		  },
		watch: {
		    ctrlType:function (newName, oldName){
		        console.log(newName, oldName);
				if(newName!=oldName){
					console.log(888999);
					this.getChargeDetail()
				}
		    },
		},
		methods: {
			getServerData() {
			      //模拟从服务器获取数据时的延时
			      setTimeout(() => {
			        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
			        let res = {
			            categories: this.ElectricityList,
			            series: [
			              {
			                name: "耗电比",
			                data: this.cumpData
			              }
			            ]
			          };
			        this.chartData = JSON.parse(JSON.stringify(res));
			      }, 1500);
			    },
				fun_date(aa){
				    var date1 = new Date(),
				    time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
				    var date2 = new Date(date1);
				    date2.setDate(date1.getDate()+aa);
				    var time2 = date2.getFullYear()+"-"+(date2.getMonth()+1+'').padStart(2,'0')+"-"+(date2.getDate()+'').padStart(2,'0')+' '+'00:00:00';
					return time2
				},
				aa () {
				        var myDate = new Date() // 获取今天日期
				        myDate.setDate(myDate.getDate() - 6)
				        var dateArray = []
				        var dateTemp
				        var flag = 1
				        for (var i = 0; i < 7; i++) {
				        dateTemp = (myDate.getMonth() + 1+'').padStart(2,'0') + '-' + (myDate.getDate()+'').padStart(2,'0')
				        dateArray.push(dateTemp)
				        myDate.setDate(myDate.getDate() + flag)
				        }
				        // console.log('123456+', dateArray)
						return dateArray
				    },
				getChargeDetail(){
					this.$u.api.getChargeDetail(this.ids).then((res)=>{
						this.listItem = res.data
						this.showToast();
					})
					console.log(this.carIds);
					console.log(this.ctrlCarId,this.carIds);
					if(this.carIds.includes(this.ctrlCarId+'')){
						this.carId = this.ctrlCarId
						this.$u.api.getCarType(this.carId).then((res)=>{
							uni.setStorageSync('carId',this.ctrlCarId)
							this.chargingStatus = res.data.chargingStatus
							// if(this.chargingStatus == 7){
							// 	this.isOk = false
							// }
						})
					}
					else{
						uni.setStorageSync('carId','')
					}
					let now = new Date();
					let year = now.getFullYear();
					let month = now.getMonth() + 1+'';
					let day = now.getDate()+'';
					let currentTime = year + "-" +month.padStart(2,'0') + "-" + day.padStart(2,'0')+' '+'23:59:59';
					let query = {
						chargingPileId:this.ids*1,
						beginTime:this.fun_date(-6),
						endTime:currentTime
					}
					console.log(query);
					this.$u.api.getDetailData(query).then((res)=>{
						let tiemArr = this.aa()
						res.data.forEach((i,a)=>{
							if(i.date.substr(5,5) == tiemArr[0]){
								this.Arr5.push(i)
							}else if(i.date.substr(5,5) == tiemArr[1]){
								this.Arr6.push(i)
							}else if(i.date.substr(5,5) == tiemArr[2]){
								this.Arr7.push(i)
							}else if(i.date.substr(5,5) == tiemArr[3]){
								this.Arr8.push(i)
							}else if(i.date.substr(5,5) == tiemArr[4]){
								this.Arr9.push(i)
							}else if(i.date.substr(5,5) == tiemArr[5]){
								this.Arr10.push(i)
							}else if(i.date.substr(5,5) == tiemArr[6]){
								this.Arr11.push(i)
							}
						})
						this.ElectricityList = tiemArr
						let electricity = 0
						let time = 0
						let dt = 0
						this.Arr5.forEach((i)=>{
							electricity+=i.chargingCapacity
							time+=i.time
						})
						dt = electricity/(time/3600)
						if(this.Arr5.length != 0){
							this.cumpData.push(dt.toFixed(2))
						}else{
							this.cumpData.push(0)
						}
						electricity = 0
						time = 0
						dt = 0
						this.Arr6.forEach((i)=>{
							electricity+=i.chargingCapacity
							time+=i.time
						})
						dt = electricity/(time/3600)
						if(this.Arr6.length != 0){
							this.cumpData.push(dt.toFixed(2))
						}else{
							this.cumpData.push(0)
						}
						electricity = 0
						time = 0
						dt = 0
						this.Arr7.forEach((i)=>{
							electricity+=i.chargingCapacity
							time+=i.time
						})
						dt = electricity/(time/3600)
						if(this.Arr7.length != 0){
							this.cumpData.push(dt.toFixed(2))
						}else{
							this.cumpData.push(0)
						}
						electricity = 0
						time = 0
						dt = 0
						this.Arr8.forEach((i)=>{
							electricity+=i.chargingCapacity
							time+=i.time
						})
						dt = electricity/(time/3600)
						if(this.Arr8.length != 0){
							this.cumpData.push(dt.toFixed(2))
						}else{
							this.cumpData.push(0)
						}
						electricity = 0
						time = 0
						dt = 0
						this.Arr9.forEach((i)=>{
							electricity+=i.chargingCapacity
							time+=i.time
						})
						dt = electricity/(time/3600)
						if(this.Arr9.length != 0){
							this.cumpData.push(dt.toFixed(2))
						}else{
							this.cumpData.push(0)
						}
						electricity = 0
						time = 0
						dt = 0
						this.Arr10.forEach((i)=>{
							electricity+=i.chargingCapacity
							time+=i.time
						})
						dt = electricity/(time/3600)
						if(this.Arr10.length != 0){
							this.cumpData.push(dt.toFixed(2))
						}else{
							this.cumpData.push(0)
						}
						electricity = 0
						time = 0
						dt = 0
						this.Arr11.forEach((i)=>{
							electricity+=i.chargingCapacity
							time+=i.time
						})
						dt = electricity/(time/3600)
						if(this.Arr11.length != 0){
							this.cumpData.push(dt.toFixed(2))
						}else{
							this.cumpData.push(0)
						}
						electricity = 0
						time = 0
						dt = 0
					})
				},
				handleOp(){
					this.$u.api.getChargeNoOrders().then((res)=>{
						if(res.code == 200){
							let dataObj = {
								chargingPileId:this.ids,
								chargingStationId:this.chargingStationId,
								carId:this.carId
							}
							this.$u.api.getBeginCharge(dataObj).then((res)=>{
								if(res.code == 500){
									this.isLoding = false
									this.$u.toast(res.msg)
								}else if(res.code == 200){
									this.isLoding = false
									this.$u.toast('开始充电')
									this.getChargeDetail()
									
								}
								
							})
						}
					})
				},
				handleDw(){
					let dataObj = {
						chargingPileId:this.ids,
						chargingStationId:this.chargingStationId,
						carId:this.carId
					}
					this.$u.api.getEndCharge(dataObj).then((res)=>{
						console.log(res);
						this.$u.toast('充电结束');
						this.getChargeDetail();
						this.isLoding = false;
					})
				},
				showToast() {
					if(this.listItem.chargingPileState == 1){
						this.$refs.uToast.show({
							title: '请联系管理员，电话：13604164421',
							type: 'error'
						})
					}
				},
		}
	}
</script>

<style lang="scss" scoped>
	.content{background:linear-gradient(rgb(231,252,244), rgb(242,249,246));height: 100vh;padding: 20rpx;}
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
			.part-location{
				width: 340rpx;
				line-height: 30rpx;
			}
		}
	}
	.list-free{
		color: #19c490;
		text-align: center;
		font-weight: bold;
		font-size: 50rpx;
		margin-bottom: 50rpx;
	}
	.list-occupation{
		color: #f67943;
		text-align: center;
		font-weight: bold;
		font-size: 50rpx;
		margin-bottom: 50rpx;
	}
	.list-alarm{
		color: #EA0000;
		text-align: center;
		font-weight: bold;
		font-size: 50rpx;
		margin-bottom: 50rpx;
	}
	.link{
		margin-top: 20rpx;
		color: #19c490;
		text-align: center;
	}
	/deep/.u-navbar-inner{
		background-color: #e7fcf4;
	}
</style>