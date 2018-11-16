<!--渠道管理-列表页-->
<template>
    <div class=" vue-theader">
        <div class="channels-common-search-content clearboth">
            <Row>
                <Col span="8">
                    <span>渠道编号</span>
                    <Input v-model.trim="form.channelCode" placeholder="请输入渠道编号" class="input-width margin-L-8"></Input>
                </Col>
                <Col span="8">
                    <span>渠道名称</span>
                    <Input v-model.trim="form.shopName" placeholder="请输入渠道名称" class="input-width margin-L-8"></Input>
                </Col>
                <Col span="8">
                    <span>主体名称</span>
                    <Input v-model.trim="form.mainName" placeholder="请输入主体名称" class="input-width margin-L-8"></Input>
                </Col>
            </Row>

            <!-- 更多选项  -->
            <moreSelections v-show="flag" :value.sync="moreValueData"/>
            <div class="float-right more" @click="moreInfoEvent">
                <div v-if="!flag">展开更多
                    <Icon type="ios-arrow-down" size="18"/>
                </div>
                <div v-else>收起
                    <Icon type="ios-arrow-up" size="18"/>
                </div>
            </div>

            <div style="padding: 20px 0 0; text-align: center">
                <Button :loading="loading_btn" type="primary" size="large" @click="searchFn">查询</Button>
                <Button size="large" @click="resetFn">重置</Button>
            </div>
        </div>
        <div class="lineDiv"></div>
        <div class="channels-common-body clearboth">
            <div class="channels-common-body-button font-right">
                <div class="float-left"><b>列表总数：{{total}}</b></div>
                <Button v-if="isBrantchSettingsEmployeeEvent" type="primary" size="large" @click="brantchSettingsEmployeeEvent">批量设置负责员工</Button>
                <Button v-if="isExportChannelListEvent" type="primary" :loading="bloading" size="large" @click="exportChannelListEvent">导出渠道列表</Button>
            </div>
            <div style="clear: both;"></div>
            <Table
                    :columns="columns"
                    :loading="loading"
                    @on-select="selectedFn"
                    @on-selection-change="selectedAllFn"
                    :data="data"></Table>
            <Page :total="total" :page-size-opts="pageSizeOpts" :current="current" :page-size="rowCount" @on-change="change_page"
                  @on-page-size-change="change_page_size" show-total show-sizer show-elevator></Page>

        </div>

        <!--批量设置员工-->
        <Modal
                v-model="modal1"
                width="800"
                class-name="vertical-center-modal"
                title="批量设置负责员工"
                :mask-closable=false>
            <p style="margin-left:10px">已选中 <b>{{selectedList.length}}</b> 个渠道，请选择需要设置的负责员工：</p>
            <br>



            <div v-if="isSelected">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="searchValue" placeholder="请输入员工编号或姓名"></Input>
                    </Col>
                    <Col span="2">
                        <Button type="primary" @click="settingsSearch">查询</Button>
                    </Col>
                </Row>
                <br>
                <Row>
                    <Col span="24">
                        <Table
                               :columns="columns1"
                               :loading="loading1"
                               :data="data1"
                               size="small"
                               @on-select="selectedFn"
                               v-model="loading1"
                               @on-selection-change="selectedAllFn"></Table>
                        <Page :page-size-opts="pageSizeOpts" size="small" :total="page1.total" :current="page1.current" :page-size="page1.pageSize" @on-change="changePageNumber1"
                              @on-page-size-change="changePageSize1" show-total show-sizer show-elevator></Page>

                    </Col>
                </Row>
            </div>

            <div v-if="!isSelected">
                <Row>
                    <Col span="12">
                        <Row>
                            <Col span="6" class="font-right">员工编号：</Col>
                            <Col span="18"> {{selectedEmployeeInfo.account_no}}</Col>
                        </Row>
                    </Col>

                    <Col span="12">
                        <Row>
                            <Col span="6" class="font-right">员工姓名：</Col>
                            <Col span="18"> {{selectedEmployeeInfo.account_name}}</Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Row>
                            <Col span="6" class="font-right">员工职位：</Col>
                            <Col span="18"> {{selectedEmployeeInfo.post_title}}</Col>
                        </Row>
                    </Col>

                    <Col span="12">
                        <Row>
                            <Col span="6" class="font-right">员工上级：</Col>
                            <Col span="18"> {{selectedEmployeeInfo.higher_account_name}}</Col>
                        </Row>
                    </Col>
                </Row>
            </div>

            <div slot="footer">
                <div v-if="!isSelected">
                    <Button @click="returnSearch">返回查询</Button>
                    <Button type="primary" @click="settingsSure">确认设置</Button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    import pageTable from '../../../mixins/tablePage'
    export default {
        name: "channelManagement",
        components: {},

        mixins:[pageTable],
        data() {
            return {
                bloading:false,
                loading_btn: false,
                flag: false,
                moreValueData: {
                    //status: "050200000"
                    status: ""
                },
                isBrantchSettingsEmployeeEvent:false,
                isExportChannelListEvent:false,

                loading: false,
                total: 0,
                current: 1,
                rowCount: 10,
                form: {
                    channelCode: '',
                    shopName: '',
                    mainName: '',
                },
                search: {
                    channelCode: '',
                    shopName: '',
                    mainName: '',
                },

                loading_1: false,
                total_1: 0,
                current_1: 1,
                rowCount_1: 10,


                limit: "",
                modal1: false,
                isSelected: true,
                selectedValue: "",
                selectedList: [],
                searchValue: "",
                selectedEmployeeInfo: {},

                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: '渠道编号',
                        key: 'channelCode',
                        width: 140,
                    },
                    {
                        title: '渠道科目',
                        width: 200,
                        className: "row-rel",
                        children: [
                            {
                                title: ' ',
                                key: 'firstSubjectName',
                                width: 80,
                                className: 'row-hidden'
                            },
                            {
                                title: ' ',
                                key: 'secondSubjectName',
                                width: 120,
                                className: 'row-hidden',
                                tooltip:true,
                                ellipsis: true,
                            }
                        ]
                    },
                    {
                        title: '业务类型',
                        key: 'busiClassNames',
                        width: 120,
                        tooltip:true,
                        ellipsis: true,
                    },
                    {
                        title: '渠道名称',
                        key: 'shopName',
                        width: 180,
                        tooltip:true,
                        ellipsis: true,
                    },
                    {
                        title: '主体名称',
                        key: 'mainName',
                        width: 240,
                        tooltip:true,
                        ellipsis: true,
                    },
                    {
                        title: '所属分公司',
                        key: 'branchCompanyName',
                        width: 120,
                        tooltip:true,
                        ellipsis: true,
                    },
                    {
                        title: '负责员工',
                        key: 'chargerNames',
                        width: 140,
                        tooltip:true,
                        ellipsis: true,
                    },
                    {
                        title: '状态',
                        key: 'busiStatusName',
                        minWidth: 100
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 90,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
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
                                        click: () => {
                                            this.toView(params.row);
                                            //this.$router.push({path: '/channelViewInfo', query: {params: new Date().getTime()}})
                                        }
                                    }
                                }, '查看')
                            ]);
                        }
                    }
                ],
                data: [],
                columns1: [
                    {
                        title: "员工编号",
                        key: "account_no"
                    },
                    {
                        title: "员工姓名",
                        key: "account_name"
                    },
                    {
                        title: "员工职位",
                        key: "post_title"
                    },
                    {
                        title: "所属机构",
                        key: "node_name"
                    },
                    {
                        title: "员工上级",
                        key: "higher_account_name"
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 90,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
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
                                        click: () => {
                                            this.selectEmployee(params.row);
                                            this.isSelected = false;
                                        }
                                    }
                                }, '选择')
                            ]);
                        }
                    }
                ],
                data1: [],
                loading1: false,
            }
        },
        methods: {

            moreInfoEvent() {
                this.flag = !this.flag;
            },
            // 加载表格
            loadTable() {
                this.loading = true;
                this.loading_btn = true;

                let obj = {
                    "current": this.current,
                    "rowCount": this.rowCount,
                    "channelCode": this.form.channelCode,
                    "shopName": this.form.shopName,
                    "mainName": this.form.mainName,

                    "firstSubject": this.moreValueData.firstSubjectId,
                    "secondSubjects": this.moreValueData.secondSubjectId,
                    "busiClass": this.moreValueData.busiType,
                    "cooperationName": this.moreValueData.cooperationName,
                    "provinceCode": this.moreValueData.address?this.moreValueData.address[0]:"",
                    "cityCode": this.moreValueData.address?this.moreValueData.address[1]:"",
                    "branchCompanyName": this.moreValueData.branchOffice,
                    "rentLevel": this.moreValueData.agentLevel,
                    "chargerName": this.moreValueData.employeee,
                    "vehicleType": this.moreValueData.carType ,
                    "vehicleFrom": this.moreValueData.carSource,
                    "startBusiStartDate": this.moreValueData.startTime?this.moreValueData.startTime[0]:"",
                    "endBusiStartDate": this.moreValueData.startTime?this.moreValueData.startTime[1]:"",
                    "startBusiEndDate": this.moreValueData.endTime?this.moreValueData.endTime[0]:"",
                    "endBusiEndDate": this.moreValueData.endTime?this.moreValueData.endTime[1]:"",
                    "specialState": this.moreValueData.specialStatus,
                    "busiStatus": this.moreValueData.status

                };
                this.$http.post('/tbChannelBusiness/channelManagementListByPage', obj).then(resp => {
                    this.loading = false;
                    this.loading_btn = false;
                    if (resp.data.success) {
                        let data = resp.data.data;
                        this.data = data.data;
                        this.total = data.total;
                        this.rowCount = data.rowCount;
                    }
                })
            },
            change_page(c) {
                this.current = c;
                this.$nextTick(() => {
                    this.loadTable();
                })
            },
            change_page_size(p) {
                this.current = 1;
                this.rowCount = p;
                this.$nextTick(() => {
                    this.loadTable();
                })
            },
            //查询按钮
            searchFn() {
                this.search.channelCode = this.form.channelCode;
                this.search.shopName = this.form.shopName;
                this.search.mainName = this.form.mainName;

                console.log(this.moreValueData, '搜索条件-------');

                this.current = 1;
                this.$nextTick(() => {
                    this.loadTable();
                })
            },
            //重置按钮
            resetFn() {
                this.form.channelCode = '';
                this.form.shopName = '';
                this.form.mainName = '';
                this.moreValueData = {};
                setTimeout(()=>{
                    //this.$set(this.moreValueData, "status", "050200000");
                    this.$set(this.moreValueData, "status", "");
                },100)
            },

            // 加载表格1
            loadTable_1() {
                this.loading_1 = true;
                let obj = {
                    current: this.current,
                    rowCount: this.rowCount,

                };
                this.$http.post('/tbChannelBusiness/channelManagementListByPage', obj).then(resp => {
                    this.loading_1 = false;
                    if (resp.data.success) {
                        let data = resp.data.data;
                        this.data = data.data;
                        this.total = data.total;
                        this.rowCount = data.rowCount;
                    }
                })
            },
            change_page_1(c) {
                this.current = c;
                this.$nextTick(() => {
                    this.loadTable();
                })
            },
            change_page_size_1(p) {
                this.current = 1;
                this.rowCount = p;
                this.$nextTick(() => {
                    this.loadTable();
                })
            },

            //批量设置负责员工
            brantchSettingsEmployeeEvent() {
                this.selectedEmployeeInfo = {};

                if (this.selectedList.length > 0) {
                    this.isSelected = true;
                    this.modal1 = true;
                    console.log(this.selectedList, '请选择渠道');
                } else {
                    this.$Message.warning(' 请选择渠道');
                }
            },
            //导出渠道列表
            exportChannelListEvent() {

                this.bloading=true;
                this.downLoading();

                // TODO 导出列表

                console.log(this.selectedList,'被选择的渠道');

                let params = {
                    "channelCode": this.search.channelCode,
                    "shopName": this.search.shopName,
                    "mainName": this.search.mainName,

                    "firstSubject": this.moreValueData.firstSubjectId,
                    "secondSubjects": this.moreValueData.secondSubjectId?this.moreValueData.secondSubjectId.join(','):"",
                    "busiClass": this.moreValueData.busiType?this.moreValueData.busiType.join(','):"",
                    "cooperationName": this.moreValueData.cooperationName,
                    "provinceCode": this.moreValueData.address?this.moreValueData.address[0]:"",
                    "cityCode": this.moreValueData.address?this.moreValueData.address[1]:"",
                    "branchCompanyName": this.moreValueData.branchOffice,
                    "rentLevel": this.moreValueData.agentLevel,
                    "chargerName": this.moreValueData.employeee,
                    "vehicleType": this.moreValueData.carType?this.moreValueData.carType.join(','):"",
                    "vehicleFrom": this.moreValueData.carSource,
                    "startBusiStartDate": this.moreValueData.startTime?this.moreValueData.startTime[0]:"",
                    "endBusiStartDate": this.moreValueData.startTime?this.moreValueData.startTime[1]:"",
                    "startBusiEndDate": this.moreValueData.endTime?this.moreValueData.endTime[0]:"",
                    "endBusiEndDate": this.moreValueData.endTime?this.moreValueData.endTime[1]:"",
                    "specialState": this.moreValueData.specialStatus,
                    "busiStatus": this.moreValueData.status

                };

                this.$http.get('/tbChannelBusiness/exportChannelManagementList', {params: params, responseType: 'arraybuffer'}).then(resp=>{
                    // 创建隐藏的可下载链接

                    this.bloading = false;
                    this.$Spin.hide();

                    let content = resp.data;
                    console.info(resp.data);

                    let eleLink = document.createElement('a');
                    let ranTime = new Date().getTime();
                    eleLink.download = '导出列表_'+ranTime+'.xlsx';
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

            selectedFn(options) {
                this.selectedList = options;
            },
            selectedAllFn(options) {
                this.selectedList = options;
            },

            //选择员工
            selectEmployee(data) {
                this.selectedEmployeeInfo = data;
            },
            //设置搜索
            settingsSearch() {
                this.page1.current = 1;
                this.loadList1();
            },
            loadList1(){
                this.data1= [];
                this.loading1 = true;

                if(this.searchValue===""){
                    this.$Message.warning("请输入员工编号或姓名");
                    return false;
                };

                let params = {
                    "accountNoOraccountName": this.searchValue,
                    current: this.page1.current,
                    rowCount: this.page1.pageSize
                };


                this.$http.post('/tbMultipleNodeAccount/getTbMultipleNodeAccountByPage', params).then(resp=>{


                    this.loading1 = false;
                    if(resp.data.success){
                        if(resp.data.data.data.length>0){

                            this.data1 = resp.data.data.data;
                            this.page1.total = resp.data.data.total;
                        }else{
                            //this.$Message.warning("无匹配结果");
                        }
                    }
                });
            },
            //返回查询
            returnSearch() {
                this.modal1 = true;
                this.isSelected = true;
            },
            // 确认设置
            settingsSure() {
                let  _this = this;
                // this.selectedList 批量选择的列表
                // this.selectedEmployeeInfo 被选择的员工
                let params = {

                    "channelCode":function(){
                        return _this.selectedList.map(item=>{
                            return item.channelCode
                        }).join(',');
                    }(),
                    "chargerAccount": this.selectedEmployeeInfo.account
                }
                this.$http.post('/tbChargerInfo/batchSetCharger', params).then(resp=>{
                    if(resp.data.success){
                        this.modal1 = false;
                        this.searchValue = "";
                        this.selectedList = [];
                        this.selectedEmployeeInfo = {};
                        this.loadTable();
                        this.$Message.success("修改成功");

                    }
                })
            },
            submitSetting() {
                let params = {}
                this.$http.post("/tbMultipleNodeAccount/getTbMultipleNodeAccountByName", params).then((resp) => {
                    if (resp.data.success) {
                        this.modal1 = false;
                        this.current = 1;
                        this.loadTable();
                    }
                    ;
                })
            },
            toView(data) {
                data.ramdomTime = new Date().getTime();
                this.$bus.$emit('channelViewInfo', {
                    id: 'channelViewInfo',
                    isShow: true,
                    refresh: true,
                    name: "渠道详情",
                    params: data
                });
            },
            // 修改店面按钮
            returnBtns(){

                //channel3:channelManagement:batchUpdateChanger
                //channel3:channelManagement:exportExcel

                let arr = [
                    {"system":"channel3","page":"channelManagement","element":"batchUpdateChanger"},//批量修改
                    {"system":"channel3","page":"channelManagement","element":"exportExcel"}//导出excel
                ];

                this.$ajax.post('/user/permissions?t='+new Date().getTime(),arr).then(resp => {
                    if (resp.data.success) {
                        this.isBrantchSettingsEmployeeEvent = resp.data.data.batchUpdateChanger || false;
                        this.isExportChannelListEvent = resp.data.data.exportExcel || false;
                    }
                })
            }
        },
        mounted() {
            this.returnBtns();
            this.loadTable();
            //this.loadTable_1();
        }
    }
</script>

<style>
    .padding10 {
        padding: 10px 0 10px 0;
    }

    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .more {
        color: #127efc;
        cursor: pointer;
    }
</style>
