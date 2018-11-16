<!-- 库存上级管理 -->
<template>
    <div class="expension-mainterance vue-theader" style="overflow-y:auto">
        <div class="channels-common-search-content clearboth">
            <Row>
                <Col span="8">
                    <Row>
                        <Col span="6" class="font-right">渠道编号</Col>
                        <Col span="18"><Input v-model.trim="search.options.channelCode" placeholder="渠道编号"></Input></Col>
                    </Row>
                </Col>
                <Col span="8">
                    <Col span="6" class="font-right">渠道名称</Col>
                    <Col span="18"><Input v-model.trim="search.options.shopName" placeholder="渠道名称"></Input></Col>
                </Col>
                <Col span="8">
                    <Col span="6" class="font-right">主体名称</Col>
                    <Col span="18"><Input v-model.trim="search.options.mainName" placeholder="主体名称"></Input></Col>
                </Col>
            </Row>
            <div style="padding: 20px 0 0; text-align: center">
                <Button type="primary" size="large" @click="searchFn">查询</Button>
                <Button size="large" @click="resetFn">重置</Button>
            </div>
        </div>
        <div class="channels-common-body clearboth">
            <div class="channels-common-body-button font-right">
                <Button type="primary" size="large" :loading="bloading" @click="exportList">导出列表</Button>
                <Button type="primary" size="large" @click="add">新增</Button>
            </div>
            <div>共{{page.total}}条</div>
            <Table
                    border
                    :loading="tloading"
                    :columns="columns"
                    :data="data"></Table>
            <Page :total="page.total"
                  show-total
                  show-sizer
                  show-elevator
                  :page-size-opts="pageSizeOpts"
                  @on-change="changePageNumber"
                  @on-page-size-change="changePageSize"></Page>
        </div>

        <!-- 新增/编辑 -->
        <Modal
                :mask-closable=false
                v-model="modal1"
                class-name="vertical-center-modal"
                :title="isAdd?'新增库存关系':'编辑库存关系'">
            <Row v-if="isAdd">
                <Col span="4" class="font-right">选择渠道</Col>
                <Col span="20">
                    <Input v-model.trim="channelSelectedName">
                    <Button slot="append" type="primary" @click="channelSeletEvent">选择</Button>
                    </Input>
                </Col>
            </Row>
            <Row style="padding: 10px 0;">
                <Col span="4" class="font-right">
                    渠道编号：
                </Col>
                <Col span="20">
                    {{channelCode}}
                </Col>
            </Row>
            <Row>
                <Col span="4" class="font-right">
                    渠道名称：
                </Col>
                <Col span="20">
                    {{shopName}}
                </Col>
            </Row>
            <Row>
                <Col span="4" class="font-right">
                    主体名称：
                </Col>
                <Col span="20">
                    {{mainName}}
                </Col>
            </Row>
            <Row>
                <Col span="4" class="font-right">
                    渠道科目：
                </Col>
                <Col span="20">
                    {{selectedChannel.firstSubject?selectedChannel.firstSubject +' '+ selectedChannel.secondSubject:""}}
                </Col>
            </Row>
            <hr style="border: 1px solid #fdfdfd"/>
            <Row>
                <Col span="24">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
                        <FormItem label="库存上级" prop="licensePlateName">
                            <Select
                                    v-model="formValidate.licensePlateName"
                                    filterable
                                    remote
                                    :label="formValidate.licensePlateName"
                                    :remote-method="remoteMethod2"
                                    @on-change="getbatchComponyEvent"
                                    :loading="loading2">
                                <Option v-for="(option, index) in options2" :value="option.affiliatedFinancialName"
                                        :key="index">{{option.affiliatedFinancialName}}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </Col>
                <div style="padding:5px;" class="clearboth"></div>
                <Col span="4" class="font-right">
                    设置说明
                </Col>
                <Col span="18">
                    <Input v-model.trim="subOfficeSettingsInfo" :maxlength="200" type="textarea" placeholder="设置说明..."></Input>
                </Col>

                <Col span="2">
                    <limitLength :value="subOfficeSettingsInfo" :max="200" />
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary" size="large" @click="addBatchComponySave">保存</Button>
            </div>
        </Modal>

        <!-- 选择分公司 -->
        <Modal
                :mask-closable=false
                v-model="modal2"
                class-name="vertical-center-modal"
                width=1000
                title="选择渠道">
            <Row style="line-height: 30px">
                <Col span="10">
                    <Row>
                        <Col span="8" class="font-right">渠道编号</Col>
                        <Col span="16">
                            <Input v-model.trim="channelCode_search" placeholder="渠道编号"></Input>
                        </Col>
                    </Row>
                </Col>
                <Col span="10">
                    <Row>
                        <Col span="8" class="font-right">渠道名称</Col>
                        <Col span="16">
                            <Input v-model.trim="shopName_search" placeholder="渠道名称"></Input>
                        </Col>
                    </Row>
                </Col>
                <Col span="4">
                    <Button type="primary" size="large" @click="modalSearchEvent">查询</Button>
                </Col>
            </Row>
            <div class="vue-theader" style="padding: 10px 0 0;">
                <Table
                        border
                        ref="selection"
                        :columns="columns1"
                        :data="data1"></Table>
                <Page :total="page1.total"
                      show-total
                      show-sizer
                      show-elevator
                      :page-size-opts="pageSizeOpts"
                      @on-change="changePageNumber1"
                      @on-page-size-change="changePageSize1"></Page>
            </div>
            <div slot="footer"></div>
        </Modal>

        <!-- 日志 -->
        <Modal
                :mask-closable=false
                v-model="modal3"
                class-name="vertical-center-modal"
                width=1000
                title="查看日志">

            <div style="padding: 10px 0 0;">
                <Table
                        border
                        :columns="columns2"
                        size="small"
                        :data="data2"></Table>
                <Page :total="page2.total"
                      show-total
                      show-sizer
                      show-elevator
                      size="small"
                      :page-size-opts="pageSizeOpts"
                      @on-change="changePageNumber1"
                      @on-page-size-change="changePageSize1"></Page>
            </div>
            <div slot="footer"></div>
        </Modal>
        <vue-extend-dialog :show.sync="modifySuccess">
            {{modifySuccessInfo}}
        </vue-extend-dialog>
    </div>
</template>

<script>
    import TablePage from '@/components/mixins/tablePage';

    export default {
        name: "inventoryManagement",
        mixins: [TablePage],
        data() {
            return {
                modal1: false,
                modal2: false,
                modal3: false,
                isAdd: true,
                bloading: false,
                channelSelectedName: "",
                channelCode: "",
                shopName: "",
                mainName: "",
                channelProjectName: "",
                subOfficeSettingsInfo: "",
                relationId:"",

                loading2: false,
                options2: [],
                selectedBatchCompony: [],
                branchOfficeId: "",


                licensePlateName: "",
                formValidate: {
                    licensePlateName: ""
                },
                ruleValidate: {
                    licensePlateName: [
                        {required: true, message: '库存上级不能为空', trigger: "change"}
                    ]
                },
                channelCode_search: "",
                shopName_search: "",
                selectedChannel: {},
                search: {
                    state: {
                        type: "ios-arrow-down",
                        isShow: false,
                        words: "更多选项"
                    },
                    options: {
                        //基本搜索条件
                        channelCode: "",
                        shopName: "",
                        licensePlateName: ""
                    }
                },
                columns: [
                    {
                        title: '渠道编号',
                        key: 'channelCode',
                        width: 160,
                        //fixed: 'left'
                    },
                    {
                        title: '渠道科目',
                        width: 200,
                        className: "row-rel",
                        children: [
                            {
                                title: ' ',
                                key: 'firstSubject',
                                width: 100,
                                className: 'row-hidden'
                            },
                            {
                                title: ' ',
                                key: 'secondSubject',
                                width: 100,
                                className: 'row-hidden'
                            }
                        ]
                    },
                    {
                        title: '业务类型',
                        key: 'busiClass',
                        width: 120
                    },
                    {
                        title: '渠道名称',
                        key: 'shopName',
                        width: 180
                    },
                    {
                        title: '主体名称',
                        key: 'mainName',
                        width: 240
                    },
                    {
                        title: '库存大区',
                        key: 'areaName',
                        width: 200
                    },
                    {
                        title: '库存上级',
                        key: 'affiliatedFinancialName',
                        width: 140
                    },
                    {
                        title: '更新人',
                        key: 'updateName',
                        width: 90
                    },
                    {
                        title: '最近操作时间',
                        key: 'updateTime',
                        minWidth: 200
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 160,
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

                                            this.modify(params.row);
                                        }
                                    }
                                }, '修改'),
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
                                            console.log(params)
                                            this.showHistory(params.row)
                                        }
                                    }
                                }, '日志')
                            ]);
                        }
                    }
                ],
                data: [],
                columns1: [
                    {
                        title: '渠道编号',
                        key: 'channelCode',
                        width: 160,
                        //fixed: 'left'
                    },
                    {
                        title: '渠道科目',
                        width: 200,
                        className: "row-rel",
                        children: [
                            {
                                title: ' ',
                                key: 'firstSubject',
                                width: 100,
                                className: 'row-hidden'
                            },
                            {
                                title: ' ',
                                key: 'secondSubject',
                                width: 100,
                                className: 'row-hidden'
                            }
                        ]
                    },
                    {
                        title: '业务类型',
                        key: 'busiClass',
                        width: 120
                    },
                    {
                        title: '渠道名称',
                        key: 'shopName',
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
                        width: 160,
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
                                            console.log(params)
                                            this.options(params.row)
                                        }
                                    }
                                }, '选择')
                            ]);
                        }
                    }
                ],
                data1: [],
                columns2: [
                    {
                        title: '发生时间',
                        key: 'createTime'
                    },
                    {
                        title: '操作人',
                        key: 'updatorName'
                    },
                    {
                        title: '操作事件',
                        key: 'eventTypeName'
                    },
                    {
                        title: '处理结果',
                        key: 'eventDetails'
                    },
                    {
                        title: '设置说明',
                        key: 'updateReason'
                    }
                ],
                data2: []
            }
        },
        methods: {
            //加载列表
            loadList() {
                let params = {
                    channelCode: this.search.options.channelCode||"",
                    shopName: this.search.options.shopNam||"",
                    mainName: this.search.options.mainName||"",
                    current: this.page.current,
                    rowCount: this.page.pageSize
                };
                this.tloading = true;
                this.$http.post('/channelStockInfoController/getClChannelStockInfoList', params).then(resp => {
                    if (resp.data.success) {
                        this.tloading = false;
                        if (resp.data.data.data.length > 0) {
                            this.page.total = resp.data.data.total;
                            this.data = resp.data.data.data;
                        } else {
                            this.page.total = 0;
                            this.data = [];
                            //this.$Message.error('暂无数据');
                        }
                    } else {
                        //this.$Message.error('请求错误');
                    }
                })

            },
            //选择渠道列表
            loadList1() {
                let params = {
                    channelCode: this["channelCode_search"],
                    shopName: this["shopName_search"],
                    current: this.page1.current,
                    rowCount: this.page1.pageSize
                };
                this.$http.post('/ChooseChannelController/queryChannelList', params).then(resp => {
                    if (resp.data.success) {

                        if (resp.data.data.data.length > 0) {
                            this.page1.total = resp.data.data.total;
                            this.data1 = resp.data.data.data;
                        } else {
                            this.page1.total=0;
                            this.data1 = [];
                            //this.$Message.error('暂无数据');
                        }
                    } else {
                        //this.$Message.error('请求错误');
                    }
                })

            },
            //导出列表
            exportList() {

                this.bloading = true;
                this.downLoading();

                //处理二进制流导出

                let params = "channelCode="+(this.search.options.channelCode||"")+"&shopName=" + (this.search.options.shopName||"") +"&mainName=" + (this.search.options.mainName||"");

                this.$http.get('/channelStockInfoController/export/stockInfoList?'+params, {
                    params: "application",
                    responseType: 'arraybuffer'
                }).then(resp => {

                    this.bloading = false;
                    this.$Spin.hide();
                    // 创建隐藏的可下载链接

                    let content = resp.data;
                    console.info(resp.data);

                    let eleLink = document.createElement('a');
                    let ranTime = new Date().getTime();
                    eleLink.download = '库存上级列表_' + ranTime + '.xlsx';
                    eleLink.style.display = 'none';
                    // 字符内容转变成blob地址
                    var blob = new Blob([content], {type: 'application/force-download;charset=UTF-8'});
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
            // 新增
            add() {
                this.modal1 = true;
                this.isAdd = true;

                this.channelSelectedName = "";
                this.channelCode = "";
                this.shopName = "";
                this.mainName = "";
                this.channelProjectName = "";
                this.licensePlateName = "";
                this.formValidate.licensePlateName="";
                this.selectedChannel.firstSubject = "";
                this.$refs['formValidate'].resetFields();

            },
            channelSeletEvent() {
                this.modal2 = true;
                this.loadList1();
            },
            // 选择
            options(data) {
                this.modal2 = false;

                this.selectedChannel = data;

                console.log(this.selectedChannel, '被选择的渠道');

                this.channelSelectedName = data.shopName;
                this.channelCode = data.channelCode;
                this.shopName = data.shopName;
                this.mainName = data.mainName;
                this.channelProjectName = data.firstSubject;
            },
            //修改
            modify(data) {
                console.log(data);
                this.relationId = data.relationId;
                this.modal1 = true;

                this.isAdd = false;

                let params = {
                    channelId: data.channelId
                }

                this.$refs['formValidate'].resetFields();

                this.formValidate.licensePlateName = "";

                this.$http.post('/channelStockInfoController/getClChannelStockInfoById', params).then(resp => {
                    if (resp.data.success) {


                        console.log(resp.data.data[0], '返显数据');
                        let datas = resp.data.data[0];

                        this.selectedChannel = datas;

                        this.channelCode = datas.channelCode;
                        this.shopName = datas.shopName || datas.channelName;
                        this.mainName = datas.mainName;
                        this.channelProjectName = datas.firstSubject;
                        this.formValidate.licensePlateId = datas.licensePlateId;

                        this.formValidate.licensePlateName = datas.affiliatedFinancialName

                    }
                })
            },
            // 日志
            showHistory(data) {
                console.log('查看日志');
                this.modal3 = true;

                let params = {
                    "channelId": data.channelId,
                    "eventType": "0007000"
                }

                this.$http.post('/log/queryLogByGroupCode', params).then(resp => {

                    if (resp.data.success) {
                        this.data2 = resp.data.data;
                    } else {
                        //this.$Message.error("请求错误");
                    }
                })
            },
            // 查询
            searchFn() {
                this.page.current;
                this.loadList();
            },
            // 重置
            resetFn() {
                this.search.options.channelCode = "";
                this.search.options.shopName = "";
                this.search.options.mainName = "";
                //this.loadList();
            },
            //新增保存
            modalSearchEvent() {
                this.page1.current = 1;
                this.loadList1();
            },
            remoteMethod2(query) {
                let _this = this;

                if (query !== '') {
                    this.loading2 = true;

                    this.handleTime = new Date().getTime();

                    let params = {
                        affiliatedFinancialName: query
                    }

                    setTimeout(() => {
                        if (new Date().getTime() - this.handleTime >= 500) {
                            this.$http.post('/channelStockInfoController/queryClchannelStockInfoByAffName', params).then(resp => {
                                this.loading2 = false;
                                if (resp.data.success) {

                                    if (resp.data.data && resp.data.data.data.length > 0) {
                                        this.options2 = resp.data.data.data;

                                        this.selectedBatchCompony = this.options2.filter(item => item.affiliatedFinancialName === query);

                                        console.log(this.selectedBatchCompony, '选中的分公司 返显');

                                        if(_this.selectedBatchCompony.length){
                                            this.formValidate.licensePlateId = this.selectedBatchCompony?this.selectedBatchCompony[0].affiliatedFinancialName:""
                                        }

                                    } else {
                                        this.options2 = [];
                                        //this.$Message.warning(resp.data.errorMessage || "暂无数据");
                                    }
                                } else {
                                    //this.$Message.error(resp.data.errorMessage || "请求错误");
                                }
                            })
                        }
                    }, 500)

                } else {
                    this.options2 = [];
                }
            },
            addBatchComponySave() {

                console.log(this.selectedChannel, '选择的上牌分公司');
                let _this = this;
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {

                        let params = {};
                        let url = "";

                        if (_this.isAdd) {
                            // 添加
                            url = "/channelStockInfoController/saveChanenlStockInfo";
                            params = {
                                "channelId": _this.selectedChannel.channelId,
                                "channelCode": _this.selectedChannel.channelCode,
                                "stockId": _this.selectedBatchCompony[0].stockId,
                                "affiliatedFinancialName": _this.selectedBatchCompony[0].affiliatedFinancialName,
                                "remark": _this.subOfficeSettingsInfo
                            }
                            console.log(params, '新增 - 入参');
                        } else {
                            // 修改
                            url = "/channelStockInfoController/updateChanenlStockInfo"
                            params = {
                                "channelId":_this.selectedChannel.channelId,
                                "channelCode": _this.selectedChannel.channelCode,
                                "relationId": _this.relationId,
                                "stockId": _this.selectedBatchCompony[0].stockId,
                                "affiliatedFinancialName": _this.selectedBatchCompony[0].affiliatedFinancialName,
                                "remark": _this.subOfficeSettingsInfo
                            }
                            console.log(params, '修改 - 入参');
                        }

                        this.$http.post(url, params).then(resp => {
                            if (resp.data.success) {

                                if(_this.isAdd){
                                    this.$Message.success("保存成功");
                                }else{
                                    this.modifySuccess = true;
                                    this.modifySuccessInfo = "修改成功，本次共修改 1 家渠道！";
                                }

                                this.loadList();
                                this.page.current = 1;
                                this.modal1 = false;
                                this.selectedChannel = [];
                                this.subOfficeSettingsInfo = "";
                                this.formValidate.licensePlateName = "";
                                this.$refs['formValidate'].resetFields();

                            } else {
                                //this.$Message.error(resp.data.errorMessage || "保存失败");
                            }
                        })

                    } else {
                        this.$Message.error('必填项不能为空');
                    }
                })
            },
            getbatchComponyEvent(data) {
                if(!data)return;

                this.selectedBatchCompony = this.options2.filter(item => item.affiliatedFinancialName === data);

                console.log(this.selectedBatchCompony, '选中的分公司 选择');

                this.formValidate.licensePlateId = this.selectedBatchCompony?this.selectedBatchCompony[0].affiliatedFinancialName:""

            }
        },
        mounted() {
            this.loadList();
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

</style>
