<!--
	**
	评估账号配置
	**
-->
<template>
	<div class="fieldWrap info-bg">

		<Row class="info-box info-shadow">
			<Form inline :label-width="80">
				<Col span="24" class="inputB14">
					<Col span="8">
						<FormItem label="渠道编号">
							<Input :maxlength="30"  placeholder="请输入渠道编号" v-model.trim='formSeach.channelCode' class="w300"></Input>
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem label="渠道名称">
							<Input :maxlength="30" placeholder="请输入渠道名称" v-model.trim='formSeach.channelName' class="w300"></Input>
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem label="主体名称">
							<Input :maxlength="30" placeholder="请输入主体名称" v-model.trim='formSeach.mainName' class="w300"></Input>
						</FormItem>
					</Col>
				</Col>
				<Col span="24" class="inputB14">
					<Col span="8">
						<FormItem label="评估公司">
							<CheckboxGroup v-model="formSeach.checkInfos">
					            <Checkbox label="0">车e估</Checkbox>
					            <Checkbox label="1">精真估</Checkbox>
					        </CheckboxGroup>
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem label="所在省市">
							<div class="citycontent">
								<Select v-model="formSeach.provinceName" @on-change="getSubRegions(formSeach.provinceName)" >
									<Option v-for="item in provinceList" :kye="item.value" :value="item.value">{{ item.label }}</Option>
								</Select>
								<Select v-model="formSeach.cityName" :disabled="disCity">
									<Option v-for="item in cityList" :key="item.value" :value="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem label="业务类型">
							<Select placeholder="请选择业务类型" v-model="formSeach.businessType" class="w300">
								<Option v-for="item in businessTypeArr" :key="item.value" :value="item.value">{{ item.name }}</Option>
							</Select>
						</FormItem>
					</Col>
				</Col>
				<Col span="24" class="inputB14">
					<Col span="24">
						<FormItem label="申请时间">
							<DatePicker v-model="formSeach.startDate" :options="option_s" type="date" :editable="false" placeholder="选择开始日期" style="display:inline-block"  ></DatePicker>
							 -
							<DatePicker v-model="formSeach.endDate" :options="option_e" type="date" :editable="false" placeholder="选择结束日期" style="display:inline-block" ></DatePicker>
						</FormItem>
					</Col>

				</Col>
			</Form>
			<Col span="24">
				<div style="margin:6px 0 20px;text-align:center">
					<Button type="primary" @click="serachColumn" :disabled ="disabled_s">查询</Button>
					<Button @click="queryReset">重置</Button>
				</div>
			</Col>
		</Row>
		<div class="info-box info-shadow">

			<div class="">
				<Menu mode="horizontal" :theme="theme1" active-name="0" @on-select="changeMenu">
					<MenuItem name="0" >
						<Badge :count="total">
				        	<span>全部 </span>
					    </Badge>
					</MenuItem>
					<MenuItem name="1">
						<Badge :count="total_d" >
				        	<span>待复核 </span>
					    </Badge>
					</MenuItem>

				</Menu>
			</div>
			<div style="text-align:right;margin:10px 0 10px;">
                <a @click="exportAccount">导出评估账号</a>
                <a style="margin:auto 10px;" @click="exportConfig">导出配置</a>
				<Button v-if="isDisabled" type="primary" @click="bulkEditing" class="width110">启用批量修改</Button>
				<Button v-else type="primary" @click="save" :loading="loading" class="width110">保存</Button>
			</div>
			<div v-show="queryReview == '0'">
				<Table  border :columns="columns1" class="vue-theader" :loading="loading1" :data="data1" :content="self"></Table>
				<Page :total="total" :current="current" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-total show-elevator show-sizer v-if="data1.length>0"></Page>
			</div>

			<div v-show="queryReview != '0'">
				<Table border :columns="columns2" class="vue-theader" :loading="loading2" :data="data2" :content="self1"></Table>
				<Page :page-size-opts="[10,20,50,100]" :total="total_d" :current="current_d" :page-size="pageSize_d" @on-change="changePage_d" @on-page-size-change="changePageSize_d" show-total show-elevator show-sizer v-if="data2.length>0"></Page>
			</div>
		</div>
	</div>
</template>
<script>

    import tablePage from '../../../mixins/tablePage'

	export default {

		name: "assessApproval",
        mixins:[tablePage],
		data() {
			const _this = this;
			return {
				self:this,
				self1:this,
				tableFlag: true,
				loading: false,
				theme1: 'light',
				disabled_s: true,
				disCity: true,
				provinceList:[],
				cityList:[],
				businessTypeArr:[],//业务类型
				loading1:false,
				loading2:false,
				option_s:{
					disabledDate (date) {
						if(_this.formSeach.endDate){
							return date && date.valueOf() > _this.formSeach.endDate.getTime();
						}
                    }
				},
				option_e:{
					disabledDate (date) {
						if(_this.formSeach.startDate){
							// 处理成当前0点
							let s = new Date(new Date(_this.formSeach.startDate).toLocaleDateString());
							return date && date.valueOf() < s.getTime();
						}
                    }
				},

				// 搜索值
				formSeach: {
					channelCode: '',
					channelName: '',
					mainName: '',
					checkInfos: [],
					provinceName: '',
					cityName: '',
					businessType: '',
					startDate: '',
					endDate: '',
				},

				// 暂存搜索值
				channelCode: '',
				channelName: '',
				mainName: '',
				checkInfos: [],
				provinceName: '',
				cityName: '',
				businessType: '',
				startDate: '',
				endDate: '',

				//查待复核状态 1是，0否(全部)
				queryReview: '0',
				isDisabled: true,

				demoFlag:true,

				columns1: [
					{
						title: '编号',
						key: 'channelCode',
						fixed:'left',
						width:120,
					},
					 {
                        title: '渠道科目',
                        width:200,
                        className: "row-rel",
                        children: [
                            {
                                title: ' ',
                                key: 'firstSubject',
                                width: 120,
                                className: 'row-hidden'
                            },
                            {
                                title: ' ',
                                key: 'secondSubject',
                                width: 120,
                                className: 'row-hidden'
                            }
                        ]
                    },
					{
						title: '业务类型',
						key: 'busiClass',
						width:120,
					},
					{
						title: '渠道名称',
						key: 'channelName',
						width:120,
					},
					{
						title: '主体名称',
						key: 'mainName',
						width:200,
					},
					{
						title: '车辆类型',
						key: 'carType',
						width:120,
					},
					
					{
						title: '车e估开通情况',
						key: 'cheyiguStatus',
						width:120,
					},

					{
						title: '车e估配置',
						key: 'cheyiguEnable',
						width:120,
						renderHeader: (h, params) =>{													
								return h('div', [
									h('Checkbox', {
										props: {
											disabled:_this.isDisabled,
											value:_this.init_checkAll('cheyiguEnable',1),
										},
										on: {
											'on-change': (event) => {
												_this.data1.forEach(function(value, index, array) {
													value.cheyiguEnable = event? '1' : '0';
													_this.init_checkAll('cheyiguEnable',1);
												});
												
											}											
										}
									},'车e估配置')
								]);						
                        },
						render: (h, params) => {
							if(_this.tableFlag){							
								return h('div', [
									h('Checkbox', {
										props: {
											disabled:_this.isDisabled,
											value:params.row.cheyiguEnable == '1'? true : false
										},
										on: {
											'on-change': (event) => {
												_this.data1[params.index].cheyiguEnable = event? '1' : '0';
												_this.init_checkAll('cheyiguEnable',1);
											}
										}
									})
								]);
							}
                        }
					},
					{
						title: '精真估开通情况',
						key: 'jingzhenguStatus',
						minWidth:130,
					},
					{
						title: '精真估配置',
						width:130,
						key: 'jingzhenguEnable',
						renderHeader: (h, params) =>{													
								return h('div', [
									h('Checkbox', {
										props: {
											disabled:_this.isDisabled,
											value:_this.init_checkAll('jingzhenguEnable',1),
										},
										on: {
											'on-change': (event) => {
												_this.data1.forEach(function(value, index, array) {
													value.jingzhenguEnable = event? '1' : '0';
													_this.init_checkAll('jingzhenguEnable',1);
												});
												
											}											
										}
									},'精真估配置')
								]);
						
                        },
						render: (h, params) => {
							if(_this.tableFlag){							
								return h('div', [
									h('Checkbox', {
										props: {
											disabled:_this.isDisabled,
											value:params.row.jingzhenguEnable == '1'? true : false
										},
										on: {
											'on-change': (event) => {
												_this.data1[params.index].jingzhenguEnable = event? '1' : '0';
												_this.init_checkAll('jingzhenguEnable',1);
											}
										}
									})
								]);
							}
                        }
					},
					{
						title: '免评估',
						key: 'allEnable',
						width:120,
						renderHeader: (h, params) =>{													
								return h('div', [
									h('Checkbox', {
										props: {
											disabled:_this.isDisabled,
											value:_this.init_checkAll('allEnable',1),
										},
										on: {
											'on-change': (event) => {
												_this.data1.forEach(function(value, index, array) {
													value.allEnable = event? '1' : '0';
													_this.init_checkAll('allEnable',1);
												});
											}											
										}
									},'免评估')
								]);
						
                        },
						render: (h, params) => {
							if(_this.tableFlag){							
								return h('div', [
									h('Checkbox', {
										props: {
											disabled:_this.isDisabled,
											value:params.row.allEnable == '1'? true : false
										},
										on: {
											'on-change': (event) => {
												_this.data1[params.index].allEnable = event? '1' : '0';
												_this.init_checkAll('allEnable',1);
											}
										}
									})
								]);
							}
                        }
					},
					{
						title: '操作',
						key: 'action',
						width: 120,
						fixed:'right',
						align: 'center',
						render: (h, params) => {
							let type  = params.row.carType || '';
							if(params.row.cheyiguStatus == '待复核' || params.row.jingzhenguStatus == '待复核'){
								return h('div', [
									h('span', {
										style:{
											color: '#2d8cf0',
											cursor: "pointer",
											marginRight:'10px'
										},
										on: {
											click: () => {
												this.show(params.index);
											}
										}
									}, '详情'),
									h('span', {
										style:{
											color: '#2d8cf0',
											cursor: "pointer"
										},
										on: {
											click: () => {
												this.review(params.index);
											}
										}
									}, '复核')
                            	]);
							}else{
								return h('div', [
									h('a', {
										style:{
											color: '#2d8cf0',
											cursor: "pointer"
										},
										on: {
											click: () => {
												this.show(params.index);
											}
										}
									}, '详情')
                            	]);
							}                            
                        }
					}
				],
				data1: [],

				columns2: [
					{
						title: '编号',
						key: 'channelCode',
						fixed:'left',
						width:120,
					},
					 {
                        title: '渠道科目',
                        width:200,
                        className: "row-rel",
                        children: [
                            {
                                title: ' ',
                                key: 'firstSubject',
                                width: 120,
                                className: 'row-hidden'
                            },
                            {
                                title: ' ',
                                key: 'secondSubject',
                                width: 120,
                                className: 'row-hidden'
                            }
                        ]
                    },
					{
						title: '业务类型',
						key: 'busiClass',
						width:120,
					},
					{
						title: '渠道名称',
						key: 'channelName',
						width:120,
					},
					{
						title: '主体名称',
						key: 'mainName',
						width:200,
					},
					{
						title: '车辆类型',
						key: 'carType',
						width:120,
					},
					{
						title: '车e估开通情况',
						key: 'cheyiguStatus',
						width:120,
					},

					{
						title: '车e估配置',
						key: 'cheyiguEnable',
						width:120,
						renderHeader: (h, params) =>{													
								return h('div', [
									h('Checkbox', {
										props: {
											disabled:_this.isDisabled,
											value:_this.init_checkAll('cheyiguEnable',2),
										},
										on: {
											'on-change': (event) => {
												_this.data2.forEach(function(value, index, array) {
													console.log(value, index, array)
													value.cheyiguEnable = event? '1' : '0';
													_this.init_checkAll('cheyiguEnable',2);
												});
											}											
										}
									},'车e估配置')
								]);
						
                        },
						render: (h, params) => {
							if(_this.tableFlag){							
								return h('div', [
									h('Checkbox', {
										props: {
											disabled:_this.isDisabled,
											value:params.row.cheyiguEnable == '1'? true : false
										},
										on: {
											'on-change': (event) => {
												_this.data2[params.index].cheyiguEnable = event? '1' : '0';
													_this.init_checkAll('cheyiguEnable',2);
											}
										}
									})
								]);
							}
                        }
					},
					{
						title: '精真估开通情况',
						key: 'jingzhenguStatus',
						minWidth:130,
					},
					{
						title: '精真估配置',
						key: 'jingzhenguEnable',
						width:130,
						renderHeader: (h, params) =>{													
								return h('div', [
									h('Checkbox', {
										props: {
											disabled:_this.isDisabled,
											value:_this.init_checkAll('jingzhenguEnable',2),
										},
										on: {
											'on-change': (event) => {
												_this.data2.forEach(function(value, index, array) {
													console.log(value, index, array)
													value.jingzhenguEnable = event? '1' : '0';
													_this.init_checkAll('jingzhenguEnable',2);
												});
											}											
										}
									},'精真估配置')
								]);
						
                        },
						render: (h, params) => {
							if(_this.tableFlag){							
								return h('div', [
									h('Checkbox', {
										props: {
											disabled:_this.isDisabled,
											value:params.row.jingzhenguEnable == '1'? true : false
										},
										on: {
											'on-change': (event) => {
												_this.data2[params.index].jingzhenguEnable = event? '1' : '0';
												_this.init_checkAll('jingzhenguEnable',2);
											}
										}
									})
								]);
							}
                        }
					},
					{
						title: '免评估',
						key: 'allEnable',
						width:120,
						renderHeader: (h, params) =>{													
								return h('div', [
									h('Checkbox', {
										props: {
											disabled:_this.isDisabled,
											value:_this.init_checkAll('allEnable',2),
										},
										on: {
											'on-change': (event) => {
												_this.data2.forEach(function(value, index, array) {
													console.log(value, index, array)
													value.allEnable = event? '1' : '0';
													_this.init_checkAll('allEnable',2);
												});
											}											
										}
									},'免评估')
								]);
						
                        },
						render: (h, params) => {
							if(_this.tableFlag){							
								return h('div', [
									h('Checkbox', {
										props: {
											disabled:_this.isDisabled,
											value:params.row.allEnable == '1'? true : false
										},
										on: {
											'on-change': (event) => {
												_this.data2[params.index].allEnable = event? '1' : '0';
												_this.init_checkAll('allEnable',2);
											}
										}
									})
								]);
							}
                        }
					},
					{
						title: '操作',
						key: 'action',
						width: 120,
						fixed:'right',
						align: 'center',
						render: (h, params) => {
							let type  = params.row.carType || '';
							if(params.row.cheyiguStatus == '待复核' || params.row.jingzhenguStatus == '待复核'){
								return h('div', [
									h('span', {
										style:{
											color: '#2d8cf0',
											cursor: "pointer",
											marginRight:'10px'
										},
										on: {
											click: () => {
												this.show2(params.index);
											}
										}
									}, '详情'),
									h('span', {
										style:{
											color: '#2d8cf0',
											cursor: "pointer"
										},
										on: {
											click: () => {
												this.review2(params.index);
											}
										}
									}, '复核')
                            	]);
							}else{
								return h('div', [
									h('a', {
										style:{
											color: '#2d8cf0',
											cursor: "pointer"
										},
										on: {
											click: () => {
												this.show2(params.index);
											}
										}
									}, '详情')
                            	]);
							}                            
                        }
					}
				],
				data2: [],

				current: 1,
				pageSize: 10,
				total: 0,

				current_d: 1,
				pageSize_d: 10,
				total_d: 0,
			}
		},
		methods: {

			changeBox(index, label, id, num){
				let data;
				if(num == 1){
					data = this.data1;
				}else{
					data = this.data2;
				}

				if(data[index][label] == '0'){
					data[index][label] = '1'
				}else{
					data[index][label] = '0'
				}


				// $('#'+id).prop('checked',true);

				// data.map(item => {
				// 	if(item[label] == '0'){
				// 		$('#'+id).prop('checked',false)
				// 	}
				// })
				this.tableFlag = false;
				this.$nextTick(()=>{
					this.tableFlag = true;
				})
			},
			// 批量修改
			bulkEditing(){
				this.isDisabled = false;
			},

			//导出账号
            exportAccount(){
            	var url = "/clEvaluation/exportEvaluationInfo?channelCode="+this.channelCode+'&channelName='+this.channelName+'&mainName='+this.mainName+'&provinceName='+this.provinceName+'&cityName='+this.cityName+'&busiClass='+this.businessType+'&startDate='+this.changeDate(this.startDate)+'&endDate='+this.changeDate(this.endDate)+'&queryReview='+this.queryReview+'&checkInfos='+this.checkInfos.join(',');
				this.$http.get(url,{params: "application",responseType: 'arraybuffer'}).then(resp=>{
				// 创建隐藏的可下载链接

				let content = resp.data;
				console.info(resp.data);

				let eleLink = document.createElement('a');
				let ranTime = new Date().getTime();
				eleLink.download = '导出评估账号列表.xlsx';
				eleLink.style.display = 'none';
				// 字符内容转变成blob地址
				var blob = new Blob([content],{ type: 'application/force-download;charset=UTF-8'});
				console.group(blob)
				eleLink.href = URL.createObjectURL(blob);
				console.group(eleLink);
				// 触发点击
				document.body.appendChild(eleLink);
				eleLink.click();
				// 然后移除
				document.body.removeChild(eleLink);
				})
            },
            //导出配置
            exportConfig(){
                var url = "/clEvaluation/exportEvaluationConfInfo?channelCode="+this.channelCode+'&channelName='+this.channelName+'&mainName='+this.mainName+'&provinceName='+this.provinceName+'&cityName='+this.cityName+'&busiClass='+this.businessType+'&startDate='+this.changeDate(this.startDate)+'&endDate='+this.changeDate(this.endDate)+'&queryReview='+this.queryReview+'&checkInfos='+this.checkInfos.join(',');
				//处理二进制流导出
				this.$http.get(url,{params: "application",responseType: 'arraybuffer'}).then(resp=>{
				// 创建隐藏的可下载链接

				let content = resp.data;
				console.info(resp.data);

				let eleLink = document.createElement('a');
				let ranTime = new Date().getTime();
				eleLink.download = '导出配置列表.xlsx';
				eleLink.style.display = 'none';
				// 字符内容转变成blob地址
				var blob = new Blob([content],{ type: 'application/force-download;charset=UTF-8'});
				console.group(blob)
				eleLink.href = URL.createObjectURL(blob);
				console.group(eleLink);
				// 触发点击
				document.body.appendChild(eleLink);
				eleLink.click();
				// 然后移除
				document.body.removeChild(eleLink);
				})
            },

			// 日期转化
			changeDate(time){
				if(time && time != ''){
					return new Date(time).toLocaleDateString().replace(/\//g,"-")
				}else{
					return ''
				}
			},

			//初始化获取所有省
			getProvinces(){
				this.$http.post('/clEvaluation/getProvinces').then((resp)=> {
					for(var i = 0; i < resp.data.data.length; i++) {
						this.provinceList.push({
							'value': resp.data.data[i].RegionId,
							'label': resp.data.data[i].FullName
						})
					}
				}, (error)=> {
					console.log(error.errorMessage);
				});
			},
			//初始化获取业务类型
			getbusinessTypes(){
				this.$http.post('/enum/getBusinessClass').then((resp)=> {
					let _data = resp.data;
					if(_data.success){
						this.businessTypeArr = _data.data;
					}
				});
			},
			//根据RegionId市
			getSubRegions(val) {
				this.disCity = false;
				this.cityName = '';
				this.formSeach.cityName = '';
				this.cityList = [];
				if(val==''){
					this.disCity = true;
					return false;
				}
				this.$http.get('/clEvaluation/getCitys?regionId='+val).then((resp)=> {
					for(var i = 0; i < resp.data.data.length; i++) {
						this.cityList.push({
							'value': resp.data.data[i].RegionId,
							'label': resp.data.data[i].FullName
						})
					}
				}, (error)=> {
					console.log(error.errorMessage);
				})
			},

			// 搜索
			serachColumn() {
				this.channelCode = this.formSeach.channelCode;
				this.channelName = this.formSeach.channelName;
				this.mainName = this.formSeach.mainName;
				this.checkInfos = this.formSeach.checkInfos;
				this.provinceName = this.formSeach.provinceName;
				this.cityName = this.formSeach.cityName;
				this.businessType = this.formSeach.businessType;
				this.startDate = this.formSeach.startDate;
				this.endDate = this.formSeach.endDate;

				this.current = 1;
				this.current_d = 1;
				this.$nextTick(()=>{
					this.loadTable();
					this.loadTable_d();
				})
			},

			// 重置
			queryReset(){
				this.formSeach.channelCode = '';
				this.formSeach.channelName = '';
				this.formSeach.mainName = '';
				this.formSeach.checkInfos = [];
				this.formSeach.provinceName = '';
				this.formSeach.cityName = '';
				this.formSeach.businessType = '';
				this.formSeach.startDate = '';
				this.formSeach.endDate = '';

				// this.serachColumn();
			},

			changePage(c){
				this.current = c;
				this.$nextTick(()=>{
					this.loadTable();
				})
			},

			changePageSize(p){
				this.current = 1;
				this.pageSize = p;
				this.$nextTick(()=>{
					this.loadTable();
				})
			},

			changeMenu(key){
				this.queryReview = key;

				if(key == '0'){
					this.loadTable();
				}else{
					this.loadTable_d();
				}
			},
			// 加载表格  全部
			loadTable() {
				this.loading1 = true;
				this.total = 0;
				var json = {
					current: this.current,
					rowCount: this.pageSize,
					channelCode: this.channelCode,
					channelName: this.channelName,
					mainName: this.mainName,
					checkInfos: this.checkInfos.join(','),
					provinceName: this.provinceName,
					cityName: this.cityName,
					busiClass: this.businessType,
					startDate: this.changeDate(this.startDate),
					endDate: this.changeDate(this.endDate),
					queryReview: '0' //全部
				}
				this.$http.post('/clEvaluation/queryEvaluationChannelConfInfo', json).then((resp)=> {
					let data = resp.data;
					if(data.success == true) {
						this.data1 = data.data.data || [];
						this.total = data.data.total;
						this.pageSize = data.data.pageSize;
						this.disabled_s = false;
						this.tableFlag = false;
						this.$nextTick(()=>{
							this.tableFlag = true;
						})
					}
					this.loading1 = false;
				})
			},

			changePage_d(c){
				this.current_d = c;
				this.$nextTick(()=>{
					this.loadTable_d();
				})
			},

			changePageSize_d(p){
				this.current_d = 1;
				this.pageSize_d = p;
				this.$nextTick(()=>{
					this.loadTable_d();
				})
			},

			// 加载表格  待复核
			loadTable_d() {
				this.loading2 = true;
				this.total_d = 0;
				var json = {
					current: this.current_d,
					rowCount: this.pageSize_d,
					channelCode: this.channelCode,
					channelName: this.channelName,
					mainName: this.mainName,
					checkInfos: this.checkInfos.join(','),
					provinceName: this.provinceName,
					cityName: this.cityName,
					busiClass: this.businessType,
					startDate: this.changeDate(this.startDate),
					endDate: this.changeDate(this.endDate),
					queryReview: '1',
				}
				this.$http.post('/clEvaluation/queryEvaluationChannelConfInfo', json).then((resp)=> {
					
					let data = resp.data;
					if(data.success == true) {
						this.data2 = data.data.data || [];
						
						this.total_d = data.data.total;
						this.pageSize_d = data.data.pageSize;
						this.disabled_s = false;

						this.tableFlag = false;
						this.$nextTick(()=>{
							this.tableFlag = true;
						})
					}
					this.loading2 = false;
				})
			},
			// 批量保存
			save(){
				this.loading = true;
				let data;
				if(this.queryReview == '0'){
					data = this.data1;
				}else{
					data = this.data2;
				}
		        var dataList = [];
		        for ( var i = 0; i <data.length; i++){
		          var dataObj = {};
		          dataObj.channelCode = data[i].channelCode;
		          dataObj.cheyiguEnable = data[i].cheyiguEnable;
		          dataObj.jingzhenguEnable = data[i].jingzhenguEnable;
		          dataObj.allEnable = data[i].allEnable;
		          dataList.push(dataObj);
		        }
				this.$http.post('/clEvaluation/batUpdateToSave', {infoList:JSON.stringify(dataList)}).then((resp)=> {
					let data = resp.data;
					if(data.success == true) {
						this.isDisabled = true;
						this.loading = false;
						this.$Modal.success({
	                    	content: '保存成功！',
							onOk: () => {
                                if(this.queryReview == '0'){
							 		this.loadTable();
								}else{
									this.loadTable_d();
								}
                            },
	                	});
						
					}
	                	this.loading = false;
					
				}, (resp)=> {
					this.$Modal.error({
                    	content: resp.data.errorMessage
                	});
                	this.loading = false;
				})
			},

			// 全部——查看详情
			show(index) {
				let id = this.data1[index].channelCode;
				this.$bus.$emit("accountDetails", {id:"accountDetails",name:"评估账号详情",isShow:true,refresh:true,params:{id: id,type:2,openIn:3}});

			},
			// 全部——复核
			review(index){
				let id = this.data1[index].channelCode;
				this.$bus.$emit("accountDetails", {id:"accountDetails",name:"评估账号复核",isShow:true,refresh:true,params:{id: id,type:3}});

			},
			// 待复核——查看详情
			show2(index) {
				let id = this.data2[index].channelCode;
				this.$bus.$emit("accountDetails", {id:"accountDetails",name:"评估账号详情",isShow:true,refresh:true,params:{id: id,type:2,openIn:3}});

			},
			// 待复核——复核
			review2(index){
				let id = this.data2[index].channelCode;
				this.$bus.$emit("accountDetails", {id:"accountDetails",name:"评估账号复核",isShow:true,refresh:true,params:{id: id,type:3}});

			},
			// 初始化表格全选状态
			init_checkAll(label, num){
				let flag;
				let _this = this;
				var data;
				var arr = [];
				if(num == 1){
					data = _this.data1;
				}else{
					data = _this.data2;
				}
				if(data.length){
					data.forEach(function(value, index, array) {
						arr.push(value[label]);
						if(arr.indexOf('0')>-1){
							flag = false;
						}else{
							flag = true;
						}
					});
				}else{
					flag = false;
				}

				return flag;
			},

		},
		mounted() {
			 this.getProvinces();//获取省份
			 this.getbusinessTypes();//获取业务类型
			 this.loadTable();
			 this.loadTable_d();
		}
	}
</script>
<style scoped>
	.width110{
		width:120px;
	}
	.citycontent{
		width:248px;
	}
	.citycontent > div{
		display:inline-block;
		width: 48% ;
	}
	/*.fieldWrap .ivu-select.ivu-select-single,
	.ivu-input-wrapper.ivu-input-type {
		width: 250px;
	}*/

	.fieldWrap .ivu-FormItem {
		margin-bottom: 0;
	}

	.fieldWrap .topCol {
		position: relative;
		border-bottom: 1px solid #d7dde4;
	}

	.fieldWrap .topBtn {
		top: 5px;
		left: 900px;
		position: absolute;
	}

	.fieldWrap .topBtn button {
		width: 96px;
		margin-bottom: 10px;
	}

	.padT20 {
		padding-top: 20px;
	}

	.viewIco,
	.editIco {
		font-size: 20px;
		cursor: pointer;
		margin-right: 10px;
	}

	.interlaceColorChange .ivu-row:nth-child(2n) {
		background-color: #f5f7f9;
	}

	.interlaceColorChange .ivu-row .ivu-col.ivu-col-span-12:nth-child(1n) {
		border-right: 1px solid #e3e8ee;
	}

	.interlaceColorChange .ivu-row .ivu-col.ivu-col-span-12:nth-child(2n) {
		border-right: none;
	}

	.interlaceColorChange .ivu-row .ivu-col.ivu-col-span-12 {
		padding-top: 5px;
		padding-bottom: 5px;
	}

	.interlaceColorChange .ivu-row .ivu-FormItem {
		margin-bottom: 0;
	}

	.fieldWrap thead .ivu-table-cell {
		display: block;
	}

	.borderOne {
		border: 1px solid #d7dde4;
	}

	.fieldWrap .ivu-modal {
		top: 0;
	}

	.inputB14{
		margin-bottom: 14px;
	}
	.w300{
		width:240px!important;
	}
	/* icon */
	.batchModifyresponsibelStaff{
	    background-color: #1d86f4;
	    padding: 0 16px;
	    display: inline-block;
	    height: 28px;
	    line-height: 28px;
	    color: #fff;
	    border-radius: 2px;
	    width:110px;
	    text-align: center
	}
	.batchModifyresponsibelStaff:hover{
		background-color: #0e75e1;
		color: #fff;
	}
	.batchModifyresponsibelStaff i{
		display: inline-block;
		width: 12px;
		height: 12px;
		margin-right: 6px;
		background: url(../../../../assets/images/bianji.png) no-repeat center;
	}
	.batchModifyresponsibelStaffExport i{
		background: url(../../../../assets/images/daochu.png) no-repeat center;
	}
	.batchModifyresponsibelStaffBtn i{
		background: url(../../../../assets/images/tianjia.png) no-repeat center;
	}
	.ivu-menu{
		z-index:800;
	}
</style>
