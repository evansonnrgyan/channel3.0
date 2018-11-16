<!--
	**
	评估账号管理
	**
-->
<template>
	<div class="fieldWrap info-bg">
		<Row class="info-box info-shadow">
			<Form inline :label-width="80">
				<Col span="24" class="inputB14">
					<Col span="8">
						<FormItem label="渠道编号">
							<Input :maxlength="30" placeholder="请输入渠道编号" v-model.trim='formSeach.channelCode' class="w300"></Input>
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
				</Col>
			</Form>
			<Col span="24">
				<div style="margin:6px 0 20px;text-align:center">
					<Button type="primary" @click="serachColumn" :disabled="disabled_s">查询</Button>
					<Button @click="queryReset">重置</Button>
				</div>
			</Col>
		</Row>
		<div class="info-box info-shadow">
			<div style="text-align:right;margin:0 0 10px;">
				<a class="batchModifyresponsibelStaff batchModifyresponsibelStaffBtn" @click="addNewModalFn">
					<i></i>
					<span>申请评估账号</span>
				</a>
			</div>
			<Table :loading="tableloading" class="vue-theader" border :columns="columns1" :data="data1" :content="self"></Table>
			<div>
				<Page :page-size-opts="[10,20,50,100]" :total="total"  :current="current" :page-size="rowCount" @on-change="changePage" @on-page-size-change="changePageSize" show-total show-elevator show-sizer v-if="data1.length>0"></Page>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
	  name: "assessManage",
		data() {
			return {
				tableloading:false,
				self: this,
				disabled_s: true,

				// 搜索值
				formSeach: {
					channelCode: '',
					channelName: '',
					mainName: '',
					checkInfos: [],
				},

				// 暂存暂存值
				channelCode: '',
				channelName: '',
				mainName: '',
				checkInfos: [],

				current: 1,
				rowCount: 10,
				total: 0,

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
                        ellipsis: true,
                        tooltip: true,
						width: 180,
                    },
					{
						title: '车e估开通情况',
						key: 'cheyiguStatus',
						width: 120,
					},
					{
						title: '精真估开通情况',
						key: 'jingzhenguStatus',
						minWidth: 140,
					},
					{
						title: '操作',
						key: 'action',
						width: 80,
						align: 'center',
						fixed: 'right',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style:{
                                        color: '#2d8cf0',
                                       // textDecoration: "underline",
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
				],
				data1: [],
			}
		},
		methods: {

			// 搜索
			serachColumn() {
				this.channelCode = this.formSeach.channelCode;
				this.channelName = this.formSeach.channelName;
				this.mainName = this.formSeach.mainName,
				this.checkInfos = this.formSeach.checkInfos,
				this.current = 1;
				this.$nextTick(()=>{
					this.loadTable();
				})
			},

			// 重置
			queryReset(){
                this.channelCode = "";
                this.channelName = "";
                this.mainName = "",
                this.checkInfos = [],
                this.current = 1;
				this.formSeach.channelCode = '';
				this.formSeach.channelName = '';
				this.formSeach.mainName = '';
				this.formSeach.checkInfos = [];
                this.$nextTick(()=>{
                    //this.loadTable();
                })
			},

			// 切换分页
			changePage(c){
				this.current = c;
				this.$nextTick(()=>{
					this.loadTable();
				})
			},

			// 切换页条数
			changePageSize(r){
				this.current = 1;
				this.rowCount = r;
				this.$nextTick(()=>{
					this.loadTable();
				})
			},

			// 加载表格
			loadTable() {
				this.tableloading = true;
				var json = {
					current: this.current,
					rowCount: this.rowCount,
					channelCode: this.channelCode,
					channelName: this.channelName,
					mainName: this.mainName,
					checkInfos: this.checkInfos.join(','),

				}
				this.$http.post('/clEvaluation/queryEvaluationChannelInfo', json).then((resp)=>{
					let data = resp.data;
					this.data1 = [];
					if(data.hasErrors == false) {
						this.data1 = data.data.data || [];
						this.total = data.data.total;
						this.rowCount = data.data.rowCount;
						this.disabled_s = false;
					}
					this.tableloading = false;
				}, (resp)=> {
                    this.$Message.error(resp.data.errorMessage);
					this.tableloading = false;
				})
			},
			// 新增申请
            addNewModalFn() {
				
                this.$bus.$emit("accountApplication", {id: "accountApplication",refresh:true,isShow: true, name: "申请评估账号",params: {id: undefined,openIn:undefined}});
				
			},

			/*
				type
					 	2 详情
					 	3 复核
			*/

			/*openIn

					2 管理页进入
					3 审批页进入
			*/

			// 查看详情
			show(index) {
				let id = this.data1[index].channelCode;
                this.$bus.$emit("accountDetails", {id:"accountDetails", isShow: true,refresh:true, name: "评估账号详情",params: {id: id,type: 2,openIn:2}});
			}
		},
		mounted () {
			this.loadTable();
		}
	}
</script>
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
