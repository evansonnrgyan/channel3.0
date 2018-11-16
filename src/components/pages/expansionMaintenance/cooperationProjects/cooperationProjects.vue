<!-- 合作项目管理 -->
<template>
	<div class="expension-mainterance">
		<div class="channels-common-search-content clearboth">
      <Row>
        <Col span="8">
          <Row>
            <Col span="6" class="font-right">项目编号</Col>
            <Col span="18"><Input v-model.trim="search.options.channelCode" placeholder="模糊查询"></Input></Col>
          </Row>
        </Col>
        <Col span="8">
          <Col span="6" class="font-right">项目名称</Col>
          <Col span="18"><Input v-model.trim="search.options.shopName" placeholder="模糊查询，包括中英文"></Input></Col>
        </Col>
        <Col span="8">
          <Col span="6" class="font-right">项目类型</Col>
          <Col span="18">
              <Select v-model="search.options.TypeId" class="input-width" >
                  <Option v-for="item in projectTypeList" :value="item.key" :key="item.key">{{ item.label }}</Option>
              </Select>
          </Col>
        </Col>
      </Row>
    <Row>
        <Col span="24">
            <Row>
                <Col span="2" class="font-right">项目状态</Col>
                <Col span="22">
            <RadioGroup v-model="search.options.projectState" type="button">
              <Radio label="1">合作中</Radio>
              <Radio label="0">已终止</Radio>
            </RadioGroup>
                    <!--<Select v-model="search.projectState" multiple>
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>-->
                </Col>
            </Row>
        </Col>
    </Row>
<div style="padding: 20px 0 0; text-align: center">
	<Button type="primary"  @click="searchFn">查询</Button>
	<Button @click="resetFn">重置</Button>
</div>
</div>
<div class="channels-common-body clearboth">
	<div class="float-left">共{{page.total}}条</div>
	<div class="channels-common-body-button text-right">
		<Button type="primary" icon="plus" @click="addNewCooperation">新建合作项目</Button>
	</div>
	<Table
	border
	ref="selection"
	:columns="table_columns"
    :loading="tloading"
	:data="table_data"></Table>
	<Page :total="page.total"
        show-total
        show-sizer
        show-elevator
        :page-size-opts="pageSizeOpts"
        @on-change="changePageNumber"
        @on-page-size-change="changePageSize"></Page>
</div>

<Modal
:mask-closable=false
v-model="addModal"
scrollable
width="450"
class-name="vertical-center-modal"
:title="isAddNew?'新建合作项目':'编辑合作项目'">
	<Form :model="formValidate"  :label-width="80"ref="formValidate" :rules="ruleValidate">
          <FormItem label="项目名称" prop="name">
            <Input v-model="formValidate.name" placeholder="项目名称" :disabled="isAddNew?false:true" class="input-width"></Input>
          </FormItem>
          <FormItem label="项目类型"  prop="projectTypeId" style="position: relative;z-index:4">
				<Select v-model="formValidate.projectTypeId" class="input-width" :disabled="isAddNew?false:true">
			        <Option v-for="item in projectTypeList" :value="item.key" :key="item.key">{{ item.label }}</Option>
			    </Select>
			</FormItem>
				<Row>
          <Col v-if="noLimitDate" class="font-right" span="4" style="position: relative;top: 7px;left: -7px;width: 80px;">项目期限</Col>
          <Col span="8" style="width:100px;position: relative;z-index:2">
            <FormItem v-if="!noLimitDate" label="项目期限"  prop="startTime">
              <DatePicker :options="startTimeLimited" v-model="formValidate.startTime" transfer type="date" placeholder="开始日期" style="width:120px;"></DatePicker>
            </FormItem>
            <DatePicker v-else v-model="formValidate.startTime" disabled readonly transfer type="date" placeholder="开始日期" style="margin: 0 0 11px 0;width:120px;"></DatePicker>

          </Col>

          <Col span="1" style="position:relative;top:7px;left:131px;text-align: center;width:20px;">-</Col>

          <Col span="8" style="position:relative;left:10px;width:100px;">
            <FormItem v-if="!noLimitDate" prop="endTime">
              <DatePicker :options="endTimeLimited" v-model="formValidate.endTime" transfer type="date" placeholder="结束如期" style="width:120px;"></DatePicker>
            </FormItem>
            <DatePicker v-else v-model="formValidate.endTime" disabled readonly transfer type="date" placeholder="结束如期" style="margin: 0 0 11px 0;width:120px;"></DatePicker>
          </Col>

          <Col span="4" style="position: absolute; right: 24px; top:6px; padding: 0 0 0 10px;text-align: center">
            <Checkbox v-model="noLimitDate"></Checkbox>不限
          </Col>
        </Row>
			<FormItem label="管理部门"  prop="manage">
				<Select v-model="formValidate.manage" class="input-width">
			        <Option v-for="item in manageTypeList" :value="item.key" :key="item.key">{{ item.label }}</Option>
			    </Select>
			</FormItem>
			<FormItem v-if="!isAddNew" label="主管渠道" prop="store">
            <Input v-model.trim="formValidate.store" style="width:249px">
              <Button type="primary" slot="append" @click="changeMainStroe" class="select-button">选择</Button>
            </Input>
			</FormItem>
				<Row>
          <Col class="font-right" span="4" style="position: relative; top: 7px;  left: -7px;width:80px">关联合同</Col>
          <Col span="16">
            <Input v-model.trim="formValidate.contract" placeholder="关联合同" class="input-width" ></Input>
          </Col>
        </Row>
    </Form>
<div slot="footer" class="text-center">
	<Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
</div>
</Modal>
    <Modal
      :mask-closable=false
      v-model="modal1"
      scrollable
      width="900"
      class-name="vertical-center-modal"
      title="选择渠道">
      <Row style="padding: 5px 0;">
        <Col span="10">
          <Row>
            <Col span="6">渠道编号</Col>
            <Col span="18">
              <Input v-model.trim="channelCode" placeholder="渠道编号" class="input-width" ></Input>
            </Col>
          </Row>
        </Col>
        <Col span="10">
          <Row>
            <Col span="6">渠道名称</Col>
            <Col span="18">
              <Input v-model.trim="channelName" placeholder="渠道名称" class="input-width" ></Input>
            </Col>
          </Row>
        </Col>
        <Col span="4">
          <Button type="primary" @click="changeSearchEvent">查询</Button>
        </Col>
      </Row>
      <Row>
        <Col span="24" class="vue-theader">
          <Table
            border
            size="small"
            :columns="change_columns"
            :loading="tloading"
            :data="change_data"></Table>
          <Page :total="page1.total"
                show-total
                show-sizer
                size="small"
                show-elevator
                :page-size-opts="pageSizeOpts"
                @on-change="changePageNumber"
                @on-page-size-change="changePageSize"></Page>
        </Col>
      </Row>
      <div slot="footer"></div>
    </Modal>

</div>
</template>

<script>
    import tablePage from '@/components/mixins/tablePage';
    export default {
        name: "cooperationProjects",
        mixins: [tablePage],
        data() {
            let _this = this;
            return {
                limitValue: "",
                smin: 0,
                max: 20,
                selectSearchData:{},
                noLimitDate: false,
                isAddNew: true,
                modal1: false,
                channelCode: "",
                channelName: "",
                editSelectedId: "",
                //编辑选中项Id
                changeSearchId: "",
                //主体店面选中项Id
                cooperationCode: "",
                //编辑选中项code
                search: {
                    options: {
                        //基本搜索条件
                        channelCode: "",
                        shopName: "",
                        mainName: "",
                        TypeId: "",
                        projectState: "1",
                    }
                },
                // 编辑 获取 主体店面
                getCooperationCode: "",
                store:"",
                loading1: false,
                options1: [],
                loading2: false,
                options2: [],
                loading3: false,
                options3: [],

                // 项目类型
                projectTypeList: [],

                // 管理部门
                manageTypeList: [],

                table_data: [],
                table_columns: [{
                    title: '项目编号',
                    key: 'cooperationCode',
                    width: 160
                },
                {
                    title: '项目名称',
                    key: 'cooperationName',
                    width: 200
                },
                {
                    title: '项目类型',
                    key: 'cooperationTypeName',
                    width: 120
                },
                {
                    title: '管理部门',
                    key: 'departmentName',
                    width: 120
                },
                {
                    title: '项目期限',
                    key: 'cooperationTime',
                    width: 200,
                    render: (h, params)=>{
                    return h('div', [h('span', (params.row.cooperationStartTime===null)?"不限":params.row.cooperationStartTime + ' — ' + params.row.cooperationEndTime)]);
                }
            },
            {
                title: '主管渠道',
                    key: 'channelName',
                width: 120
            },
            {
                title: '状态',
                key: 'status',
                width: 120
            },
            {
                title: '更新人',
                key: 'updateName',
                width: 120
            },
            {
                title: '更新时间',
                key: 'updateTime',
                minWidth: 200
            },
            {
                title: '操作',
                key: 'action',
                width: 160,
                align: 'center',
                fixed: 'right',
                render: (h, params)=>{
                return h('div', [h('span', {
                    props: {
                        type: 'primary',
                        size: 'small'
                    },
                    style: {
                        marginRight: '5px',
                        color: '#2d8cf0',
                        cursor: 'pointer'
                    },
                    on: {
                        click: ()=>{
                            console.log(params.row)
                        this.getCooperationCode = params.row.cooperationCode;
                        this.edit(params.row)
                }
            }
            },
                '编辑')]);
            }
            }],
            change_data: [],
                change_columns: [{
                title: '渠道编号',
                key: 'channelCode',
                width: 160
            },
                {
                    title: '渠道科目',
                    width: 200,
                    className: "row-rel",
                    children: [{
                        title: ' ',
                        key: 'firstSubject',
                        width: 100,
                        className: 'row-hidden'
                    },
                        {
                            title: ' ',
                            key: 'secondSubject',
                            width: 160,
                            className: 'row-hidden'
                        }]
                },
                {
                    title: '业务类型',
                    key: 'busiClass',
                    width: 160
                },
                {
                    title: '渠道名称',
                    key: 'channelName',
                    width: 180
                },
                {
                    title: '主体名称',
                    key: 'mainName',
                    width: 240
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 90,
                    align: 'center',
                    fixed: 'right',
                    render: (h, params)=>{
                    return h('div', [h('span', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px',
                                color: '#2d8cf0',
                                cursor: 'pointer'
                            },
                            on: {
                                click: ()=>{
                                this.changeSearch(params.row)
                        }
                    }
                },'选择')]);
            }
        }],
            addModal: false,

                formValidate: {
                    name: '',
                    projectTypeId: '',
                    deadline: [],
                    manage: '',
                    store: '',
                    contract: '',
                    startTime: "",
                    endTime: ""
                },
                ruleValidate: {
                name: [{
                    required: true,
                    message: '项目名称不能为空',
                    trigger: 'blur'
                }],
                    type: [{
                    required: true,
                    message: '项目类型不能为空',
                    trigger: 'change'
                }],
                    startTime: [{
                    required: true,
                    type: 'date',
                    message: '请选择开始日期',
                    trigger: 'change'
                }],
                    endTime: [{
                    required: true,
                    type: 'date',
                    message: '请选择结束日期',
                    trigger: 'change'
                }],
                    manage: [{
                    required: true,
                    message: '管理部门不能为空',
                    trigger: 'change'
                }],
                    contract: [{
                    required: true,
                    message: '关联合同不能为空',
                    trigger: 'change'
                }],
            },
            startTimeLimited: {
                disabledDate(date){
                    return date && date.valueOf() > new Date(_this.formValidate.endTime).getTime();
                }
            },
            endTimeLimited: {
                disabledDate(date){
                    return date && date.valueOf() < new Date(_this.formValidate.startTime).getTime();
                }
            }
        }
        },
        watch: {
            noLimitDate:function(val) {
                console.log(val)
                this.islimited = val;
                if (val) {
                    this.formValidate.startTime = "";
                    this.formValidate.endTime = "";
                    this.noLimitDate = true;
                }else{
                    this.noLimitDate = false;
                };
            }
        },
        methods: {
            loadList() {
                let params = {
                    current: this.page.current,
                    rowCount: this.page.pageSize,
                    cooperationCode: this.search.options.channelCode,
                    cooperationName: this.search.options.shopName,
                    cooperationType: this.search.options.mainName,
                    cooperationType: this.search.options.TypeId,
                    status: this.search.options.projectState
                };
                this.tloading = true;
                this.$http.post('/channelCooperation/queryChannelCooperationPage', params).then(resp=>{
                    this.tloading = false;
                    if (resp.data.success) {
                    if (resp.data.data.data.length > 0) {
                        this.page.total = resp.data.data.total;
                        this.table_data = resp.data.data.data;
                    } else {
                        this.page.total = 0;
                        this.table_data = [];
                        //this.$Message.error('暂无数据');
                    }
                } else {
                    //this.$Message.error('请求错误');
                }
            })

            },
            // 编号搜索
            remoteMethod1(query) {
                if (query !== '') {
                    this.loading1 = true;
                    setTimeout(()=>{
                        this.loading1 = false;
                    const list = this.list.map(item=>{
                        return {
                            value: item,
                            label: item
                        };
                });
                    this.options1 = list.filter(item=>item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
                },
                    200);
                } else {
                    this.options1 = [];
                }
            },

            // 名称搜索
            remoteMethod2(query) {
                if (query !== '') {
                    this.loading2 = true;
                    setTimeout(()=>{
                        this.loading2 = false;
                    const list = this.list.map(item=>{
                        return {
                            value: item,
                            label: item
                        };
                });
                    this.options2 = list.filter(item=>item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
                },
                    200);
                } else {
                    this.options2 = [];
                }
            },

            // 类型搜索
            remoteMethod3(query) {
                if (query !== '') {
                    this.loading3 = true;
                    setTimeout(()=>{
                        this.loading3 = false;
                    const list = this.list.map(item=>{
                        return {
                            value: item,
                            label: item
                        };
                });
                    this.options3 = list.filter(item=>item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
                },
                    200);
                } else {
                    this.options3 = [];
                }
            },
            // 新建合作项目
            addNewCooperation() {
                this.addModal = true;
                this.isAddNew = true,
                this.formValidate.contract = "";
                this.noLimitDate = false;
                this.$refs['formValidate'].resetFields();

                this.promiseAll([this.getProType(), this.getManDiff()]);


            },

            handleSubmit(name) {
                console.log(this.selectSearchData, 'this.selectSearchData');
                debugger
                let params = {};
                if (!this.isAddNew) {
                    //编辑
                    params = {
                        id: this.editSelectedId,

                        channelId: this.selectSearchData.channelId,
                        channelName: this.selectSearchData.channelName,

                        cooperationCode: this.cooperationCode,
                        cooperationName: this.formValidate.name,
                        cooperationType: this.formValidate.projectTypeId,
                        departmentCode: this.formValidate.manage,
                        shopId: this.changeSearchId,
                        cooperationStartTime: this.noLimitDate ? "": this.$formatDate(this.formValidate.startTime),
                        cooperationEndTime: this.noLimitDate ? "": this.$formatDate(this.formValidate.endTime),
                        cooperativeCode: this.formValidate.contract,
                        unlimited: this.noLimitDate?"1":""
                    };
                } else {
                    //新添加
                    params = {
                        cooperationName: this.formValidate.name,
                        cooperationType: this.formValidate.projectTypeId,
                        departmentCode: this.formValidate.manage,
                        cooperationStartTime: this.noLimitDate ? "": this.$formatDate(this.formValidate.startTime),
                        cooperationEndTime: this.noLimitDate ? "": this.$formatDate(this.formValidate.endTime),
                        cooperativeCode: this.formValidate.contract,
                        unlimited: this.noLimitDate?"1":""
                    };
                }
                this.$refs[name].validate((valid) =>{
                    if (valid) {
                        this.$http.post('/channelCooperation/saveChannelCooperation', params).then(resp =>{

                            if (resp.data.success) {
                            this.editSelectedId = "";
                            this.formValidate = {
                                name: "",
                                projectTypeId  : "",
                                manage: "",
                                startTime: "",
                                endTime: "",
                                contract: ""
                            }
                            this.addModal = false;
                            this.page.current = 1;
                            this.loadList();
                            this.$Message.success('保存成功');
                        } else {
                            //this.$Message.error(resp.data.errorMessage || '请求失败');
                        }
                    })
                    } else {
                        //this.$Message.error('请求失败');
            }
            })
            },
            searchFn() {
                this.page.current = 1;
                this.loadList();
            },
            resetFn() {
                this.page.current = 1;
                this.search.options = {
                    channelCode: "",
                    channelsName: "",
                    mainName: "",
                    projectState: "1",
                    TypeId: ""
                }

                //this.loadList();
            },
            getFormatDate(date, pattern) {
                if (date == undefined) {
                    date = new Date(date);
                }
                if (pattern == undefined) {
                    pattern = "yyyy-MM-dd hh:mm:ss";
                }
                return date.format(pattern);
            },
            edit(data) {

                this.$refs['formValidate'].resetFields();
                this.isAddNew = false;

                let getShopId = data.shopId

                this.editSelectedId = data.id;
                this.cooperationCode = data.cooperationCode;
                let params = {
                    id: data.id
                }

                this.promiseAll([this.getProType(), this.getManDiff()], (data)=>{

                    console.log(data);
                    this.projectTypeList = data[0];
                    this.manageTypeList = data[1];


                    this.$http.post('/channelCooperation/getChannelCooperation', params).then(resp =>{
                        if (resp.data.success) {
                            this.addModal = true;
                            debugger
                            this.$nextTick(()=>{

                                this.selectSearchData = resp.data.data;
                                this.formValidate = {
                                    name: resp.data.data.cooperationName,
                                    projectTypeId: resp.data.data.cooperationType,
                                    manage: resp.data.data.departmentCode,
                                    startTime: this.$formatDate(resp.data.data.cooperationStartTime),
                                    endTime: this.$formatDate(resp.data.data.cooperationEndTime),
                                    contract: resp.data.data.cooperativeCode,
                                    store: resp.data.data.channelName
                                }

                                this.changeSearchId = resp.data.data.shopId;
                                this.unlimited = resp.data.data.unlimited;
                                this.noLimitDate = this.unlimited==="1"?true:false;

                                this.store = "";

                                if(getShopId){
                                    this.$http.post('/channelCooperation/queryShopName', {"shopId": getShopId}).then(resp=>{

                                        this.store = resp.data.data[0].shopName;
                                    })
                                }
                            })


                        };
                    });

                })

            },
            changeMainStroe() {
                this.modal1 = true;
                let params = {
                    current: this.page1.current,
                    rowCount: this.page1.pageSize,
                    cooperationCode: this.cooperationCode,
                    channelCode: this.channelCode,
                    channelName: this.channelName
                };
                this.tloading = true;
                this.$http.post('/channelCooperation/queryShopList', params).then(resp =>{
                    this.tloading = false;
                    if (resp.data.success) {
                    if (resp.data.data.data.length > 0) {
                        this.page1.total = resp.data.data.total;
                        this.change_data = resp.data.data.data;
                    } else {
                        this.change_data = [];
                        //this.$Message.warning('暂无数据');
                    }
                } else {
                    //this.$Message.error('请求错误');
                }
            })
            },
            changeSearch(data) {
                console.log(data);
                this.selectSearchData = data;
                this.formValidate.store = data.channelName;
                this.changeSearchId = data.shopId;
                this.modal1 = false;

            },
            changeSearchEvent() {
                this.changeMainStroe();
            },

            // 项目类型 管理部门 接口
            promiseAll(fnCollection,fn){
                Promise.all(fnCollection).then((data)=>{
                    fn && fn(data);
                })
            },
            // 项目类型
            getProType(){
                return new Promise((resolve, reject)=>{
                    this.$http.post('/channelCooperation/getCooperationType').then(resp=>{
                        this.projectTypeList = [];
                        if(resp.data.success){
                            let datas = resp.data.data;
                            Object.keys(datas).forEach(item=>{
                                this.projectTypeList.push({
                                    key: item,
                                    label:datas[item]
                                })
                            })
                            console.log(this.projectTypeList)
                            resolve(this.projectTypeList);
                        }else{
                            //this.$Message.error("请求错误");
                        }
                    })
                })
            },
            getManDiff(){
                // 管理部门
                return new Promise((resolve, reject)=>{
                    this.$http.post('/channelCooperation/getDepartmentCode').then(resp=>{
                        if(resp.data.success){
                            this.manageTypeList = [];
                            let datas = resp.data.data;
                            Object.keys(datas).forEach(item=>{
                                this.manageTypeList.push({
                                    key: item,
                                    label:datas[item]
                                })
                            })
                            resolve(this.manageTypeList);

                        }else{
                            //this.$Message.error("请求错误");
                        }
                    })
                })
            }


        },
        mounted() {
            this.loadList();
            this.getProType();
        }

    }
</script>

<style>
	.displayNo{
		display: none;
	}
  .padding10{
    padding: 10px 0 10px 0;
  }

  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
   z-indexa:1000!important;
  }
  .ivu-form-item-error-tip{
    white-space: nowrap;
    word-break: keep-all;
  }
  .select-button{
    color: #fff;
    border-color: #2d8cf0!important;
    background-color: #2d8cf0!important;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color:#fff!important;
  }
    .ivu-date-picker-transfer{
        z-index:99999999!important;
    }
</style>

