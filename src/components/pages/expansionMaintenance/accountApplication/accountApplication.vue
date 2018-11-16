<!--
	**
	评估账号申请
	**
-->
<template>
	<div class="info-bg">

		<div class="content">
			<div class="title">
				<span></span>
				<div v-if="flag">选择渠道</div>
				<div v-else>渠道信息</div>
			</div>
			<div class="cont">
				<div class="noEmpty" v-if="flag">
					<div>
						<span>申请渠道</span>
						<Button type="primary" icon="ios-checkmark-circle-outline" style="margin-left:10px !important" @click="selected">选择</Button>
					</div>
					<br>
					<p>
						申请条件说明：<br>
						1、渠道已开通联合贷、消费贷、车抵贷业务线中任意一个，且状态为启用；<br>
						3、业务信息内的【车辆类型】勾选了选项“二手车”。
					</p>
					<br><br>
				</div>
				<div class="noEmpty" v-else>
					<Form :label-width="80" inline>
						<Row>
							<Col span="12">
								<FormItem label="渠道编号：" col="12">
                    <span>{{show_channelCode}}</span>
                    <Button @click="clear_channel()" class="addStaffSeachBtn" style="margin-left:10px !important">清除</Button>
                </FormItem>
							</Col>
							<!-- 渠道3.0 渠道简称去掉-->
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
								<FormItem label="渠道科目：" col="12">
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
				<span></span>已开通评估账号
			</div>
			<div class="cont">
				<Table border :columns="table_columns3" :data="table_data3" :content="self"></Table>
			</div>
		</div>

		<div class="content" v-if="selecCompany_flag">
			<div class="title">
				<span></span>选择评估公司
			</div>
			<div class="cont">
				<div class="noEmpty">
					<Form :label-width="80" inline>
						<Row>
							<Col span="6">
								<FormItem label="申请开通：" >
					                <CheckboxGroup v-model="checkboxVal">
							            <Checkbox label="0" :disabled="disabled_one">车e估</Checkbox>
							        </CheckboxGroup>
					            </FormItem>
							</Col>
							<Col span="18">
								<Input v-if="textarea_0 && textarea_0_flag" v-model.trim="remarksCheyigu" :disabled="disabled_one" style="width:60%" type="textarea" :maxlength="200" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入..."></Input>

							</Col>
						</Row>
						<br>
						<Row>
							<Col span="6">
								<FormItem label="" >
					                <CheckboxGroup v-model="checkboxVal">
							            <Checkbox label="1" :disabled="disabled_two">精真估</Checkbox>
							        </CheckboxGroup>
					            </FormItem>
							</Col>
							<Col span="18">
								<Input v-if="textarea_1 && textarea_1_flag" v-model.trim="remarksJingzhengu" :disabled="disabled_two" style="width:60%" type="textarea" :maxlength="200" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入..."></Input>

							</Col>
						</Row>
			        </Form>
				</div>
				<div style="height:1px ;background:#eee;margin:10px auto;"></div>
				<div class="noEmpty" v-if="checkboxVal_old.length !== 2">
					<Form ref="formData"  :label-width="100" inline :model="formData" :rules="rulesCheck">
						<Row>
							<Col span="12">
								<FormItem label="预留手机号" prop="phone" >
					                <Input placeholder="收取初始密码的手机号" v-model.trim='formData.phone' class="w300"></Input>
					            </FormItem>
							</Col>
							<Col span="12">
								<FormItem label="预留邮箱" prop="email" >
					                <Input placeholder="收取初始密码的邮箱地址" v-model.trim='formData.email' class="w300"></Input>
					            </FormItem>
							</Col>
						</Row>
			        </Form>
				</div>
				<div v-else style="text-align:center;color:#ccc">
					<span>所有评估公司均已申请，无需重复操作！</span>
				</div>

			</div>
		</div>

		<!-- 申请 -->
		<poFooter>
			<Button size="large"  @click="back">返回</Button>
			<Button size="large" type="primary" @click="handleSubmit('formData')" v-if="checkboxVal_old.length !== 2">提交申请</Button>
		</poFooter>



		<!-- 添加渠道 -->
	    <Modal v-model="modal_channel" title="渠道查询" width="800" :mask-closable="false" class-name="channelModel">
	        <Form :label-width="80" inline>
	            <FormItem label="渠道编号">
	                <Input placeholder="" :maxlength="30"  v-model.trim="search_channelCode"></Input>
	            </FormItem>
	            <FormItem label="渠道名称">
	                <Input placeholder="" :maxlength="30"  v-model.trim="search_channelName"></Input>
	                <Button type="primary" @click="search_ok" class="addStaffSeachBtn" style="margin: 0 0 0 10px">查询</Button>
	            </FormItem>
	        </Form>

	        <Table border class="marT10 vue-theader" :loading ='table_loading' :columns="table_columns" :data="table_data"  :content="self"></Table>
	        <div class='marT10 '>
	            <Page :page-size-opts="[10,20,50,100]" :total="total_channel" :current="current_channel" :page-size="pageSize_channel" @on-change="changePage_channel" @on-page-size-change='pageSizeChange_channel' show-total show-elevator show-sizer v-if="table_data.length>0"></Page>
	        </div>
	        <div slot="footer" >

	        </div>
	    </Modal>

	    <!-- 提交详情 -->
	    <Modal v-model="submitInfo_modal" title="提示" width="600" :mask-closable="false">
	       	<div style="padding-left:110px;line-height: 2;">
	       		请确认以下申请内容：<br>
	       		申请开通评估公司账号：{{show_company}}<br>
	       		预留手机号：{{formData.phone}}<br>
	       		预留邮箱：{{formData.email}}<br>
	       		<span style="color:red">注意：预留手机号及邮箱将用于收取初始账号密码，请仔细核对！</span>
	       	</div>
	        <div slot="footer" style="text-align:center">
	        	<Button size="large"  @click="submitInfo_modal = false">返回</Button>
				<Button size="large" :loading="loading" type="primary" @click="submit">确认提交</Button>
	        </div>
	    </Modal>
	</div>

</template>
<script>
	export default {
		data() {
			const _this = this;
			return {
				openIn:  '',
				id: '',
				self: this,
				size: 'large',
				flag: true,
				modal_channel:false,
				submitInfo_modal: false,
				loading: false,

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
				busiId: '',

				current_channel: 1,
				pageSize_channel: 10,
				total_channel: 0,
				table_loading:false,
				table_columns: [
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
						width: 120,
                    },
                    {
                        title: '渠道名称',
                        key: 'channelName',
						width: 180,
                    },
                    {
                        title: '主体名称',
                        key: 'mainName',
						width: 180,
                    },                    
                    {
                        title: '车辆类型',
                        key: 'carType',
						width: 120,
                    },
                     {
                        title: '操作',
                        key: 'action',
						width: 80,
						align: 'center',
						fixed: 'right',
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
                checkboxVal_old: [],
                textarea_0: false,
                textarea_1: false,

                formData: {
                	phone: '',
                	email: '',
                },

                rulesCheck: {
                	phone: [
						{ required: true, message: '手机号不能为空', trigger: 'blur' },
						{ pattern: /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/, trigger: 'blur' ,message: '请输入正确手机号码'}
					],
					email: [
						{ required: true, message: '邮箱不能为空', trigger: 'blur' },
						{
						pattern: /^[a-zA-Z0-9._%+-]+@(?!.*\.\..*)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/,
						message: '请填写正确的邮箱格式', trigger: 'blur'
						},
						{
							message: '最大长度32位', max: 32, trigger: 'blur'
						}

					],
                },
                remarksJingzhengu: '',
                remarksCheyigu: '',

                disabled_one: false,
                disabled_two: false,
                show_company: '',
                textarea_0_flag: true,
                textarea_1_flag: true,
				paramsObj:{}

			}
		},
		watch: {
			checkboxVal(val){
				if(val.length>1){
					this.textarea_0 = true;
					this.textarea_1 = true;

					if(this.disabled_one){
						this.show_company = '精真估';
					}else if(this.disabled_two){
						this.show_company = '车e估';
					}else{
						this.show_company = '车e估，精真估';
					}

				}else if(val.length<1){
					this.textarea_0 = false;
					this.textarea_1 = false;
					// this.remarksJingzhengu = '';
					// this.remarksCheyigu = '';
					this.show_company = '';
				}else{
					if(val[0] == '0'){
						this.textarea_0 = true;
						this.textarea_1 = false;
						// this.remarksCheyigu = '';
						this.show_company = '车e估';
					}else {
						this.textarea_0 = false;
						this.textarea_1 = true;
						// this.remarksJingzhengu = '';
						this.show_company = '精真估';
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
			// 数组去重
			dedupe(array){
			 return Array.from(new Set(array));
			},

			// 选择渠道
			selected(){
				this.search_channelCode = '';
				this.search_channelName = '';
				this.channelCode = '';
				this.channelName = '';
				this.modal_channel = true;
				this.loadTable();
			},
			// 清除渠道
			clear_channel(){
				this.flag = true;
				this.busiId = '';
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
				this.checkboxVal_old = [];
				this.remarksJingzhengu = '';
				this.remarksCheyigu = '';
				this.selecCompany_flag = false;

				this.disabled_one = false;
                this.disabled_two = false;

			},

			// 选择渠道——选择
			selected_ok(index){
				let channelCode = this.table_data[index].channelCode;
				// this.busiId = this.table_data[index].busiId;
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
				this.table_loading = true;
				var json = {
					current: this.current_channel,
					rowCount: this.pageSize_channel,
					channelCode: this.channelCode,
					channelName: this.channelName,
				}
				this.$http.post('/clEvaluation/queryChannelInfo', json).then((resp)=> {
					let data = resp.data;
					var _this = this;
					if(data.success == true) {
						this.table_data = data.data.data || [];
						this.total_channel = data.data.total;
						this.pageSize_channel = data.data.pageSize;
					}
					this.table_loading = false;
				}, (resp)=> {
					this.$Modal.error({
                    	content: resp.data.errorMessage
                	});
					this.table_loading = false;
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
					//	this.show_channelShortName = data.channelShortName; //渠道简称需求去掉
						this.show_channelName = data.channelName;
						this.show_mainName = data.mainName;
						this.show_channelModel = data.firstSubject+'-'+data.secondSubject;
						this.show_provinceName = data.provinceName;
						this.show_cityName = data.cityName;
						this.show_busiClass = data.busiClass;
						this.show_carType = data.carType;
						this.table_data2 = data.evaluationChannelBusinessDTOList || [];
						this.table_data3 = data.evaluationCompanyInfoDTOList || [];

						this.table_data3.length > 0 ? this.company_flag = true : this.company_flag = false;
						this.selecCompany_flag = true;

						let newAttr = [];

						// 获取busiID
						
						let busiJson = this.table_data2.filter(item => {
							return item.busiStatus == '启用' && item.carType.indexOf('二手车') > -1
						})[0];
						this.busiId = busiJson? busiJson.busiId : '';

						this.table_data3.map(item => {
							if(item.evaluationValue && item.accountCode != '3'){
								newAttr.push(item.evaluationValue)
							}
							if(item.evaluationValue === '0' && item.accountCode != '3'){
								this.disabled_one = true;
								this.textarea_0_flag = false;
							}else if(item.evaluationValue === '1' && item.accountCode != '3'){
								this.disabled_two = true;
								this.textarea_1_flag = false;
							}
						})
						this.checkboxVal = this.dedupe(newAttr);
						this.checkboxVal_old = this.dedupe(newAttr);

					}
				//	this.$Spin.hide();
				}, (resp) => {
					this.$Modal.error({
                    	content: resp.data.errorMessage
                	});
					//this.$Spin.hide();
				})
			},
			// 提交申请
			handleSubmit(name) {
				let _this = this;
				if(this.show_channelCode === '' ){
					this.$Modal.error({
                    	content: '请先选择渠道！'
                	});
                	return;
				}

				// if(this.busiId === ''){
				// 	this.$Modal.error({
                //     	content: '没有可满足条件的业务线！'
                // 	});
                // 	return;
				// }

				if(this.checkboxVal.length == this.checkboxVal_old.length){
					this.$Modal.error({
                    	content: '请选择至少一家评估公司！'
                	});
                	return;
				}
				_this.$refs[name].validate((valid) => {
					if(valid) {
						this.submitInfo_modal = true;
					} else {
						this.$Modal.error({
	                    	content: '请完善预留信息！'
	                	});
					}
				})
			},
			submit(){
				this.loading = true;
				// 排除已选
				let arr = this.checkboxVal.filter(item => {
					return item !== this.checkboxVal_old[0]
				});
				let obj = {
					channelCode: this.show_channelCode,
					phone: this.formData.phone,
					reserveEmail: this.formData.email,
					checkInfos: arr.join(','),
					createRemarksJingzhengu: this.remarksJingzhengu,
          			createRemarksCheyigu: this.remarksCheyigu,
          			//busiId: this.busiId
          		}

				this.$http.post('/clEvaluation/applyForEvaluation', obj).then((resp) =>{
					let data = resp.data;
					if(data.success) {
						this.$Modal.success({
	                    	content: '提交成功！',
	                    	onOk: () => {
	                    		this.back();
		                    }
	                	});
					}
					this.loading = false;
				}, (resp)=> {
                	this.loading = false;
				})
			},
			back(){
				if(this.id){
					let id = this.id;
					this.$bus.$emit("accountDetails", {id:"accountDetails",name:"评估账号详情",refresh:true,closeName: "accountApplication",isShow:true,params:{id: id,type:2,openIn:this.openIn}});

				}else{
					this.$bus.$emit("assessManage", {id:"assessManage",isShow:true,name:"评估账号申请",refresh:true,closeName: "accountApplication"});

				}
			},

		},
		mounted() {
			if(this.$attrs.params.id){
                this.paramsObj = Object.assign({},this.$attrs.params);
				this.id = this.paramsObj.id;
				this.openIn = this.paramsObj.openIn;
            }	
			console.log('克隆参数值',this.paramsObj)
			
			if(this.id){
				this.getChannelInfo(this.id)
			}
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
	.channelModel {
		.ivu-modal-footer{
			display: none;
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
