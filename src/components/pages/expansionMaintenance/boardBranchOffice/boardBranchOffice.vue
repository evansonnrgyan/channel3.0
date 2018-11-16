<!--上牌分公司-->
<template>
    <div ref="expension-mainterance" class="expension-mainterance vue-theader" style="overflow-y:auto">
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
                    <Col span="6" class="font-right">上牌分公司</Col>
                    <Col span="18"><Input v-model.trim="search.options.licensePlateName" placeholder="上牌分公司"></Input></Col>
                </Col>
            </Row>
            <div style="padding: 20px 0 0; text-align: center">
                <Button type="primary" size="large" @click="searchFn">查询</Button>
                <Button size="large" @click="resetFn">重置</Button>
            </div>
        </div>
        <div class="channels-common-body clearboth">
            <div class="channels-common-body-button font-right">
                <Button type="primary" :loading="bloading" size="large" @click="exportList">导出列表</Button>
                <Button type="primary" size="large" @click="add">新增</Button>
            </div>
            <div>共{{page.total}}条</div>
            <Table
                    border
                    ref="selection"
                    :columns="columns"
                    :loading="tloading"
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
                :title="isAdd?'新建上牌分公司关系':'编辑上牌分公司关系'">
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
                    渠道类型：
                </Col>
                <Col span="20">
                    {{channelProjectName}}
                </Col>
            </Row>
            <hr style="border: 1px solid #fdfdfd"/>
            <Row>
                <Col span="24">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
                        <FormItem label="上牌分公司" prop="licensePlateName">
                            <Select
                                    v-model="formValidate.licensePlateName"
                                    filterable
                                    remote
                                    :label="formValidate.licensePlateName"
                                    :remote-method="remoteMethod2"
                                    @on-change="getbatchComponyEvent"
                                    :loading="loading2">
                                <Option v-for="(option, index) in options2" :value="option.licensePlateName" :key="index">{{option.licensePlateName}}</Option>
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
                    <limitLength :value="formValidate.modifyInfo" :max="200" />
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary" size="large" @click="addBatchComponySave('formValidate')">保存</Button>
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
                        size="small"
                        ref="selection"
                        :columns="columns1"
                        :loading="tloading"
                        :data="data1"></Table>
                <Page :total="page1.total"
                      show-total
                      show-sizer
                      size="small"
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
                title="选择渠道">

            <div style="padding: 10px 0 0;">
                <Table
                        border
                        size="small"
                        :columns="columns2"
                        :loading="tloading"
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
    </div>
</template>

<script>
    import TablePage from '@/components/mixins/tablePage';

    export default {
        name: "boardBranchOffice",
        mixins: [TablePage],
        data() {
            return {
                modal1: false,
                modal2: false,
                modal3: false,
                isAdd: true,
                bloading:false,
                channelSelectedName: "",
                channelCode: "",
                shopName: "",
                mainName: "",
                channelProjectName: "",
                subOfficeSettingsInfo: "",

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
                        {required: true, message: '上牌分公司不能为空'}
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
                        width: 200
                    },
                    {
                        title: '主体名称',
                        key: 'mainName',
                        width: 240
                    },
                    {
                        title: '上牌分公司',
                        key: 'licensePlateName',
                        width: 200
                    },
                    {
                        title: '更新人',
                        key: 'updateName',
                        width: 90
                    },
                    {
                        title: '最近操作时间',
                        key: 'updateTime',
                        minWidth: 160
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
                                            this.modify(params.row)
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
                                ellipsis:true,
                                tooltip:true,
                                className: 'row-hidden'
                            },
                            {
                                title: ' ',
                                key: 'secondSubject',
                                width: 100,
                                ellipsis:true,
                                tooltip:true,
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
                        width: 200
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
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
                        key: 'creatorName'
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
                    channelCode: this.search.options.channelCode,
                    shopName: this.search.options.shopName,
                    licensePlateName: this.search.options.licensePlateName,
                    current: this.page.current,
                    rowCount: this.page.pageSize
                };
                this.tloading = true;
                this.$http.post('/clLicensePlateBranchOfficeController/getClChannelStockInfoList', params).then(resp => {
                    if (resp.data.success) {
                        if (resp.data.data.data.length > 0) {
                            this.data = resp.data.data.data;
                            this.tloading = false;
                        } else {
                            this.data = [];
                            //this.$Message.warning('暂无数据');
                        }

                        this.page.total = resp.data.data.total;
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
                this.tloading = true;
                this.$http.post('/ChooseChannelController/queryChannelList', params).then(resp => {
                    if (resp.data.success) {
                        this.tloading = false;
                        if (resp.data.data.data.length > 0) {
                            this.data1 = resp.data.data.data;
                        } else {
                            this.data1 = [];
                            //this.$Message.error('暂无数据');
                        }

                        this.page1.total = resp.data.data.total;
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

                let params = "channelCode="+this.search.options.channelCode+"&shopName="+this.search.options.shopName+"&licensePlateName="+this.search.options.licensePlateName;


                this.$http.get('/clLicensePlateBranchOfficeController/export/branchOfficeList?'+params, {
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
                    eleLink.download = '上牌分公司_' + ranTime + '.xlsx';
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
                this.subOfficeSettingsInfo = "";
                this.licensePlateName = "";
                this.options2 = [];
                this.$set(this.options2,[])

            },
            channelSeletEvent() {
                this.modal2 = true;
                this.loadList1();
            },
            // 选择
            options(data) {
                this.modal2 = false;

                this.selectedChannel = data;

                this.channelSelectedName = data.shopName;
                this.channelCode = data.channelCode;
                this.shopName = data.shopName;
                this.mainName = data.mainName;
                this.channelProjectName = data.firstSubject;
            },
            //修改
            modify(data) {
                this.modal1 = true;

                this.isAdd = false;

                this.licensePlateName = "";

                let params = {
                    channelId: data.channelId
                }

                this.$http.post('/clLicensePlateBranchOfficeController/getLicensePlateBranchOfficeById', params).then(resp => {
                    if (resp.data.success) {

                        console.log(resp.data.data[0], '返显数据');
                        let datas = resp.data.data[0];

                        this.selectedChannel = datas;

                        this.channelCode = datas.channelCode;
                        this.shopName = datas.shopName;
                        this.mainName = data.mainName;
                        this.channelProjectName = data.firstSubject;
                        this.formValidate.licensePlateId = datas.licensePlateId;
                        this.branchOfficeId = datas.branchOfficeId;

                        //this.$refs.setQuery.setQuery(datas.licensePlateName);
                        this.formValidate.licensePlateName = datas.licensePlateName;

                    }
                })
            },
            // 日志
            showHistory(data) {
                console.log('查看日志');
                console.log(data.channelId, '打印渠道channelId')
                this.modal3 = true;

                this.data2 = [];

                let params = {
                    "channelId": data.channelId,
                    "eventType": "0008000"
                }

                this.tloading=true;
                this.$http.post('/log/queryLogByGroupCodePage', params).then(resp => {
                    if (resp.data.success) {
                        this.tloading=false;
                        this.data2 = resp.data.data.data;
                        console.log(resp.data.data.data)
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
                this.search.options.licensePlateName = "";
                //this.loadList();
            },
            //新增保存
            modalSearchEvent() {
                this.page1.current = 1;
                this.loadList1();
            },
            remoteMethod2(query) {
                if (query !== '') {
                    this.loading2 = true;

                    this.handleTime = new Date().getTime();

                    let params = {
                        licensePlateName: query
                    }

                    setTimeout(() => {
                        if (new Date().getTime() - this.handleTime >= 500) {
                            this.$http.post('/clLicensePlateBranchOfficeController/getLicensePlateNameListByVagueName', params).then(resp => {
                                this.loading2 = false;
                                if (resp.data.success) {

                                    if (resp.data.data && resp.data.data.data.length > 0) {
                                        this.options2 = resp.data.data.data;
                                        this.selectedBatchCompony = this.options2.filter(item => item.licensePlateName === query)
                                        console.log(this.selectedBatchCompony, '选中的分公司');
                                        this.formValidate.licensePlateId = this.selectedBatchCompony[0].licensePlateId
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
            addBatchComponySave(name) {

                console.log(this.selectedChannel, '选择的上牌分公司');
                console.log(this.selectedBatchCompony, 'this.selectedBatchCompony');

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let params = {};
                        if (this.isAdd) {
                            // 添加
                            params = {
                                "channelId": this.selectedChannel.channelId,
                                "channelCode": this.selectedChannel.channelCode,
                                "licensePlateId": this.formValidate.licensePlateId,
                                "licensePlateName": this.selectedBatchCompony[0].licensePlateName,
                                "remark": this.subOfficeSettingsInfo,
                            }
                        } else {
                            // 修改
                            params = {
                                "branchOfficeId": this.selectedChannel.branchOfficeId,
                                "channelId": this.selectedChannel.channelId,
                                "channelCode": this.selectedChannel.channelCode,
                                "licensePlateId": this.formValidate.licensePlateId,
                                "licensePlateName": this.selectedBatchCompony[0].licensePlateName,
                                "remark": this.subOfficeSettingsInfo,
                            }

                        }

                        console.log(params);

                        this.$http.post('/clLicensePlateBranchOfficeController/createLicensePlate', params).then(resp => {
                            if (resp.data.success) {
                                this.$Message.success("保存成功");
                                this.loadList();
                                this.page.current = 1;
                                this.modal1 = false;
                                this.selectedChannel = [];
                                this.$refs[name].resetFields();

                                this.channelSelectedName = "";
                                this.channelCode = "";
                                this.shopName = "";
                                this.mainName = "";
                                this.channelProjectName = "";
                                this.licensePlateName = "";
                                this.subOfficeSettingsInfo = ""
                                //this.$refs.setQuery.value = this.licensePlateName;


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
                console.log(data,'data');
                if(!data)return;
                this.selectedBatchCompony = this.options2.filter(item => item.licensePlateName === data)
                console.log(this.selectedBatchCompony, '选中的分公司');
                this.formValidate.licensePlateId = this.selectedBatchCompony[0].licensePlateId
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
