<!--
	**
	评估账号详情
	**
-->
<template>
	<div class="info-bg">
		<div class="content">
			<div class="title">
				<span></span>
				<div>渠道信息</div>
			</div>
			<div class="cont">
				<div class="noEmpty">
					<Form :label-width="80" inline>
						<Row>
							<Col span="12">
								<FormItem label="渠道编号：" col="12">
					                <span>{{show_channelCode}}</span>
					            </FormItem>
							</Col>
							<!--<Col span="12">
								<FormItem label="渠道简称：">
					                <span>{{show_channelShortName}}</span>
					            </FormItem>
							</Col>-->
						</Row>
						<Row>
							<Col span="12">
								<FormItem label="渠道名称：" col="12">
					                <span>{{show_channelName}}</span>
					            </FormItem>
							</Col>
							<Col span="12">
								<FormItem label="主体名称：">
					                <span>{{show_mainName}}</span>
					            </FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<FormItem label="渠道类型：" col="12">
					                <span>{{show_channelModel}}</span>
					            </FormItem>
							</Col>
							<Col span="12">
								<FormItem label="所在省市：">
					                <span>{{show_provinceName}}  {{show_cityName}}</span>
					            </FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<FormItem label="业务类型：" col="12">
								<span>{{show_busiClass}}</span>
							</FormItem>
							</Col>
							<Col span="12">
								<FormItem label="车辆类型：">
									<span>{{show_carType}}</span>
								</FormItem>
							</Col>
						</Row>

			            <!--<h4>业务开通情况</h4>
			             <Table border class="marT10" width="480" style="margin-top:10px"  size="small" :columns="table_columns2" :data="table_data2" :content="self"></Table>-->
			        </Form>


				</div>
			</div>
		</div>
		<div class="content" v-if="company_flag">
			<div class="title">
				<span></span>评估账号
			</div>
			<div class="cont">
				<Table border :columns="table_columns3" :data="table_data3" :content="self"></Table>
			</div>
		</div>

		<div class="content" v-if="isReviewer && selecCompany_flag">
			<div class="title">
				<span></span>
				<div v-if="type == '2'">评估公司配置</div>
				<div v-else>复核结果</div>
			</div>
			<div class="cont">
				<div class="noEmpty">
					<Form :label-width="96" inline>
						<Row>
							<Col span="6">
								<FormItem label="评估公司配置：" >
					                <CheckboxGroup v-model="checkboxVal">
							            <Checkbox label="0">车e估</Checkbox>
							        </CheckboxGroup>
					            </FormItem>
							</Col>
							<Col span="18">
								<Input v-model.trim="remarksCheyigu" style="width:60%" type="textarea" :maxlength="200" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入..."></Input>

							</Col>
						</Row>
						<br>
						<Row>
							<Col span="6">
								<FormItem label="" >
					                <CheckboxGroup v-model="checkboxVal">
							            <Checkbox label="1">精真估</Checkbox>
							        </CheckboxGroup>
					            </FormItem>
							</Col>
							<Col span="18">
								<Input v-model.trim="remarksJingzhengu" style="width:60%" type="textarea" :maxlength="200" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入..."></Input>

							</Col>
						</Row>
			        </Form>
				</div>
			</div>
		</div>


		<!-- 详情 -->
		<poFooter v-if="type == '2'" >
			<Button size="large"  @click="back">返回</Button>
			<Button size="large" v-if="hasCompanys.length !== 2" type="primary"  @click="toApproval">去申请</Button>
			<Button v-if="isReviewer" size="large" type="primary" @click="save">保存</Button>

		</poFooter>

		<!-- 复核 -->
		<poFooter v-if="type == '3'" >
			<Button size="large"  @click="back_approval">取消并返回</Button>
			<Button size="large" :loading="loading" type="primary" @click="pass">复核通过</Button>
		</poFooter>

		<!-- 复核弹框 -->
	    <Modal v-model="pass_modal" title="提示" width="300" @on-cancel="back_approval" :mask-closable="false">
	       	<div v-for="item in companyAttr" style="margin-left:60px;font-size:14px">
				<span v-if="item.show">{{item.name}}开通{{item.flag? '成功！' : '失败！'}}</span>
	       	</div>
	        <div slot="footer">
	        </div>
	    </Modal>


	</div>

</template>
<script>
	export default {
		data() {
			const _this = this;
			return {
				/*
					type
						 	2 详情
						 	3 复核
				*/
				/*
					openIn

						2 管理页进入
						3 审批页进入
				*/
				id:'',
				type:'',
				openIn:'',
				self: this,
				size: 'large',
				isReviewer: false,
				flag: true,
				modal_channel:false,
				submitInfo_modal: false,
				loading: false,
				pass_modal: false,

				show_channelCode: '',
				show_channelShortName: '',
				show_channelName: '',
				show_mainName: '',
				show_channelModel: '',
				show_provinceName: '',
				show_cityName: '',
				show_busiClass:'',
				show_carType:'',
				// 搜索值
				search_channelCode: '',
				search_channelName: '',

				// 暂存值
				channelCode: '',
				channelName: '',

				current_channel: 1,
				pageSize_channel: 10,
				total_channel: 0,

				table_columns: [
                    {
                        title: '编号',
                        key: 'channelCode'
                    },
                    {
                        title: '渠道名称',
                        key: 'channelName',
                    },
                    {
                        title: '主体名称',
                        key: 'mainName',
                    },
                    {
                        title: '渠道类型',
                        key: 'channelModel',
                    },
                    {
                        title: '业务类型',
                        key: 'busiType',
                    },
                    {
                        title: '车辆类型',
                        key: 'carType',
                    },
                     {
                        title: '操作',
                        key: 'action',
                        width:80,
						render: (h, params) => {
							let type  = params.row.carType || '';
							if(type.indexOf('二手车') > -1){
								return h('div', [
									h('span', {
										style:{
											color: '#2d8cf0',
											cursor: "pointer"
										},
										on: {
											click: () => {												
												this.selected_ok(params.index);
											}
										}
									}, '选择')
                            	]);
							}else{
								return h('div', [
									h('span', {
										style:{
										color: '#ccc',
										cursor: 'not-allowed',
										pointerEvents: 'none',
									},
									}, '选择')
                            	]);
							}                            
                        }
                    }
                ],
                table_data:[],
                table_columns2: [
                    {
                        title: '业务类型',
                        key: 'busiType'
                    },
                    {
                        title: '业务状态',
                        key: 'busiStatus',
                    },
                    {
                        title: '车辆类型',
                        key: 'carType',
                    },
                ],
                table_data2:[],
                table_columns3: [
                    {
                        title: '评估公司',
                        key: 'evaluationType'
                    },
                    {
                        title: '用户名',
                        key: 'userName',
                    },
                    {
                        title: '预留手机号',
                        key: 'phone',
                    },
                    {
                        title: '预留邮箱',
                        key: 'reserveEmail',
                    },
                    {
                        title: '开通情况',
                        key: 'accountStatus',
                    },
                    {
                        title: '申请时间',
                        key: 'createTime',
                    },
                    {
                        title: '申请人',
                        key: 'creatorName',
                    },
                    {
                        title: '申请备注',
                        key: 'createRemarks',
                        ellipsis: true,
                        tooltip: true, 
                    },
                    {
                        title: '复核时间',
                        key: 'reviewTime',
                    },
                    {
                        title: '复核人',
                        key: 'reviewName',
                    },
                ],
                table_data3:[],
                company_flag: false,
                selecCompany_flag: false,
                checkboxVal: [],
                textarea_0: false,
                textarea_1: false,

                formData: {
                	phone: '',
                	email: '',
                },

                rulesCheck: {
                	phone: [
						{ required: true, message: '手机号不能为空', trigger: 'blur' },
						{ pattern: /^[0-9]{11}$/, trigger: 'blur' ,message: '请输入正确手机号码'}
					],
					email: [
						{ required: true, message: '邮箱不能为空', trigger: 'blur' },
						{
						pattern: /^[a-zA-Z0-9._%+-]+@(?!.*\.\..*)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/,
						message: '请填写正确的邮箱格式', trigger: 'blur'
						},

					],
                },
                remarksJingzhengu: '',
                remarksCheyigu: '',

                disabled_one: false,
                disabled_two: false,
                companyAttr: [{
					name: '车e估',
					flag: false,
					show: false
				},{
					name: '精真估',
					flag: false,
					show: false
				}],
                result_flag: [],
                hasCompanys: [],
				paramsObj:{},//传过来参数obj

			}
		},
		watch: {
			checkboxVal(val){
				if(val.length>1){
					this.textarea_0 = true;
					this.textarea_1 = true;
					this.companyAttr[0].show = true;
					this.companyAttr[1].show = true;

				}else if(val.length<1){
					this.textarea_0 = false;
					this.textarea_1 = false;
					// this.remarksJingzhengu = '';
					// this.remarksCheyigu = '';
					this.companyAttr[0].show = false;
					this.companyAttr[1].show = false;
				}else{
					if(val[0] == '0'){
						this.textarea_0 = true;
						this.textarea_1 = false;
						// this.remarksCheyigu = '';
						this.companyAttr[0].show = true;
						this.companyAttr[1].show = false;
					}else {
						this.textarea_0 = false;
						this.textarea_1 = true;
						// this.remarksJingzhengu = '';
						this.companyAttr[0].show = false;
						this.companyAttr[1].show = true;
					}
				}
			}
		},
		methods: {

			// 处理备注
			returnTitle(str){
				if(str && str.length > 10){
					return str.substring(0,10) + '...'
				}else{
					return str
				}
			},

			// 选择渠道
			selected(){
				this.modal_channel = true;
				this.loadTable();
			},
			// 清除渠道
			clear_channel(){
				this.flag = true;
				this.show_channelCode = '';
				this.show_channelShortName = '';
				this.show_channelName = '';
				this.show_mainName = '';
				this.show_channelModel = '';
				this.show_provinceName = '';
				this.show_cityName = '';
				this.show_busiClass = '';
				this.show_carType = '';
				this.table_data2 = [];

				this.table_data3 = [];
				this.company_flag = false;

				this.checkboxVal = [];
				this.remarksJingzhengu = '';
				this.remarksCheyigu = '';
				this.selecCompany_flag = false;

			},

			// 选择渠道——选择
			selected_ok(index){
				let channelCode = this.table_data[index].channelCode;
				this.getChannelInfo(channelCode);
			},

			// 搜索渠道
			search_ok(){
				this.current_channel = 1;
				this.channelCode = this.search_channelCode;
				this.channelName = this.search_channelName;
				this.$nextTick(()=>{
					this.loadTable();
				})
			},

			// 渠道模态框列表
			loadTable() {
				var json = {
					current: this.current_channel,
					rowCount: this.pageSize_channel,
					channelCode: this.channelCode,
					channelName: this.channelName,
				}
				this.$http.post('/clEvaluation/queryChannelInfo', json).then((resp)=> {
					let data = resp.data;
					if(data.success == true) {
						this.table_data = data.data.data || [];
						this.total_channel = data.data.total;
						this.pageSize_channel = data.data.pageSize;
					}
				}, (resp)=> {
					this.$Modal.error({
                    	content: resp.data.errorMessage
                	});
				})
			},

			changePage_channel(c){
				this.current_channel = c;
				this.$nextTick(()=>{
					this.loadTable();
				})
			},

			pageSizeChange_channel(p){
				this.current_channel = 1;
				this.pageSize_channel = p;
				this.$nextTick(()=>{
					this.loadTable();
				})
			},
			// 数组去重
			dedupe(array){
			 return Array.from(new Set(array));
			},

			// 确认添加
			getChannelInfo(channelCode) {
				//this.$Spin.show();
				var json = {
					channelCode: channelCode,
				}
				this.$http.post('/clEvaluation/queryEvaluationChannelCompanyInfo', json).then((resp)=> {
					if(resp.data.success == true) {
						let data = resp.data.data;

						this.modal_channel = false;
						this.flag = false;
						this.show_channelCode = data.channelCode;
					//	this.show_channelShortName = data.channelShortName; //渠道3.0去掉简称
						this.show_channelName = data.channelName;
						this.show_mainName = data.mainName;
						this.show_channelModel = data.firstSubject+'-'+data.secondSubject;
						this.show_provinceName = data.provinceName;
						this.show_cityName = data.cityName;
						this.show_busiClass = data.busiClass;
						this.show_carType = data.carType;
						this.table_data2 = data.evaluationChannelBusinessDTOList || [];
						this.table_data3 = data.evaluationCompanyInfoDTOList || [];

						this.remarksJingzhengu = data.reviewRemarksJingzhengu;
						this.remarksCheyigu = data.reviewRemarksCheyigu;

						this.isReviewer = data.isReviewer?data.isReviewer:data.reviewer;
						//this.isReviewer = true;
						this.checkboxVal = [];
						if(data.cheyiguEnable && data.cheyiguEnable == '1'){
							this.checkboxVal.push('0');
						}
						if(data.jingzhenguEnable && data.jingzhenguEnable == '1'){
							this.checkboxVal.push('1');
						}

						this.table_data3.length > 0 ? this.company_flag = true : this.company_flag = false;
						this.selecCompany_flag = true;

						let newAttr = [];
						this.table_data3.map(item => {
							if(item.evaluationValue && item.accountCode != '3'){
								newAttr.push(item.evaluationValue)
							}
						})
						this.hasCompanys = this.dedupe(newAttr);
					//	this.$Spin.hide();
					}
					//this.$Spin.hide();
				}, (resp) => {
					this.$Modal.error({
                    	content: resp.data.errorMessage
                	});
					//this.$Spin.hide();
				})
			},
			// 提交申请
			handleSubmit(name) {

				if(this.show_channelCode === '' ){
					this.$Modal.error({
                    	content: '请先选择渠道！'
                	});
                	return;
				}

				if(!this.checkboxVal.length > 0){
					this.$Modal.error({
                    	content: '请选择至少一家评估公司！'
                	});
                	return;
				}


				this.$refs[name].validate((valid) => {
					if(valid) {
						this.submitInfo_modal = true;
					} else {
						this.$Modal.error({
	                    	content: '请完善预留信息！'
	                	});
					}
				})
			},

			back(){
				if(this.paramsObj.openIn == '2'){
					this.$bus.$emit("assessManage", {id:"assessManage",name:"评估账号申请",isShow:true,refresh:true,closeName: "accountDetails"});
				}else if(this.paramsObj.openIn == '3'){
					this.$bus.$emit("assessApproval", {id:"assessApproval",name:"评估账号配置",isShow:true,refresh:true,closeName: "accountDetails"});
				}
			},
			// 去申请
			toApproval(){
				let id = this.show_channelCode;
				this.$bus.$emit('closeTab',{id:'accountApplication'});
				this.$nextTick(()=>{
					 setTimeout(()=>{
						this.$bus.$emit("accountApplication", {id:"accountApplication",name:"账号申请",isShow:true,refresh:true,params:{id: id,openIn:this.paramsObj.openIn}});
					  },1020)
				})
			},
			// 复核通过
			pass(){
				this.loading = true;
				let obj = {
					channelCode: this.show_channelCode,
					checkInfos: this.checkboxVal.join(','),
					reviewRemarksJingzhengu: this.remarksJingzhengu,
          			reviewRemarksCheyigu: this.remarksCheyigu
				};

				this.$http.post('/clEvaluation/reviewToSave', obj).then((resp)=> {
					let data = resp.data;
					if(data.success) {

						let c =  data.data? data.data.cheyiguResult : '';
						let j = data.data? data.data.jingzhenguResult : '';

						this.companyAttr[0].show = c == ''? false:true;
						this.companyAttr[1].show = j == ''? false:true;
						this.companyAttr[0].flag = c == 'true'? true:false;
						this.companyAttr[1].flag = j == 'true'? true:false;

						if(c == '' && j == ''){
							this.$Modal.success({
		                    	content: '操作成功！',
		                    	onOk: () => {
			                        this.back_approval();
			                    }
		                	});
						}else{
							this.pass_modal = true;
						}
	                	this.loading = false;
					}
	                this.loading = false;
					
				}, (resp)=> {
					this.$Modal.error({
                    	content: resp.data.errorMessage
                	});
                	this.loading = false;
				})
			},
			// 取消并返回
			back_approval(){
				this.$bus.$emit("assessApproval", {id:"assessApproval",name:"评估账号配置",isShow:true,refresh:true,closeName: "accountDetails"});

			},
			// 保存
			save(){
				this.loading = true;
				let obj = {
					channelCode: this.show_channelCode,
					checkInfos: this.checkboxVal.join(','),
					reviewRemarksJingzhengu: this.remarksJingzhengu,
          			reviewRemarksCheyigu: this.remarksCheyigu
				};

				this.$http.post('/clEvaluation/detailToSave', obj).then((resp)=> {
					let data = resp.data;
					if(data.success) {
						this.$Modal.success({
	                    	content: '保存成功！',
	                    	onOk: () => {

	                    		if(this.paramsObj.openIn == '2'){
									this.$bus.$emit("assessManage", {id:"assessManage",name:"评估账号申请",isShow:true,refresh:true,closeName: "accountDetails"});

								}else if(this.paramsObj.openIn == '3'){
									this.$bus.$emit("assessApproval", {id:"assessApproval",name:"评估账号配置",isShow:true,refresh:true,closeName: "accountDetails"});

								}
		                    }
	                	});
					}
	                	this.loading = false;
					
				}, (resp)=> {
					this.$Modal.error({
                    	content: resp.data.errorMessage
                	});
                	this.loading = false;
				})
			}

		},
		mounted() {
			if(this.$attrs.params.id){
                this.paramsObj = Object.assign({},this.$attrs.params);
				this.id = this.paramsObj.id;
				this.type = this.paramsObj.type;
				this.openIn = this.paramsObj.openIn;
            }	
			console.log('克隆参数值',this.paramsObj)
			this.getChannelInfo(this.paramsObj.id)


		}
	}
</script>
<style lang="less">
	.content{
		color:#000;
		margin-bottom:10px;
		.title{
			font-size:15px;
			span{
				width:4px;
				height:14px;
				display:inline-block;
				background:#0e75e1;
				margin-right:2px;
				margin-bottom: -1px;

			}
			div{
				display: inline-block
			}
		}
		.cont{
			padding:15px;
			border:1px solid #ddd;
			background:#fff;
			.noEmpty{
				padding-left:12%
			}
		}
	}
</style>
<style scoped>
	.fieldWrap .ivu-select.ivu-select-single,
	.ivu-input-wrapper.ivu-input-type {
		width: 250px;
	}

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
</style>
