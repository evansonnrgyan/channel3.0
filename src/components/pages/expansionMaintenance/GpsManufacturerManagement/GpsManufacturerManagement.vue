<!--GPS厂商管理-->
<template>
    <div class="expension-mainterance vue-theader">
        <div class="channels-common-search-content clearboth">

            <Row>
                <Col span="8">
                    <Row>
                        <Col span="6" class="font-right">渠道编号</Col>
                        <Col span="18"><Input v-model="search.options.channelCode" placeholder="渠道编号"></Input></Col>
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
                <Button type="primary" size="large" @click="configurationPolicyPackage">查看政策包</Button>
                <!--<Button type="primary" size="large" @click="exportList">导出列表</Button>-->
                <Button type="primary" size="large" @click="batchEdit">批量修改</Button>
            </div>
            <div>共{{page.total}}条</div>
            <Table
                    border
                    ref="selection"
                    :columns="columns"
                    @on-select="selectedFn"
                    @on-select-all="selectedAllFn"
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

        <Modal
                :mask-closable=false
                v-model="setModal"
                scrollable
                width="900px"
                class-name="vertical-center-modal"
                :title="isBrantchEidt?'批量设置GPS厂商':'设置GPS厂商'">
            <div class="vue-theader">
                <Table border :columns="setColumns" :data="setData"></Table>
            </div>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <Row class="padding10">
                    <Col span="22">
                        <FormItem label="GPS厂商配置" prop="GPSConfigsId">
                            <CheckboxGroup v-model="formValidate.GPSConfigsId">
                                <Checkbox v-for="item in batch.GPSConfigsList" :label="item.value" :key="item.value">{{item.key}}</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="padding10">
                    <Col span="22">
                        <FormItem label="修改原因说明" prop="modifyInfo">
                            <Input v-model.trim="formValidate.modifyInfo" :maxlength="200" type="textarea" width="500" height="200"
                                   placeholder="允许录入200字备注"></Input>
                        </FormItem>
                    </Col>
                    <Col span="2">
                        <limitLength :value="formValidate.modifyInfo" :max="200" />
                    </Col>
                </Row>
            </Form>
            <Table border height="200" :columns="historyColumns" :data="historyData"></Table>
            <div slot="footer">
                <Button type="primary" @click="setSubmit('formValidate')">提交</Button>
            </div>
        </Modal>

        <Modal
                :mask-closable=false
                v-model="batch.setModal"
                scrollable
                width="900px"
                class-name="vertical-center-modal"
                title="批量设置GPS厂商">
            <div class="vue-theader">
                <Table border height="200" :columns="batch.setColumns" :data="batch.setData"></Table>
            </div>
            <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="100">
                <Row class="padding10">
                    <Col span="22">
                        <FormItem label="GPS厂商配置" prop="GPSConfigsIds">
                            <CheckboxGroup v-model="formValidate1.GPSConfigsIds">
                                <Checkbox v-for="item in batch.GPSConfigsList" :label="item.value" :key="item.value">
                                    {{item.key}}
                                </Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="padding10">
                    <Col span="22">
                        <FormItem label="修改原因说明" prop="modifyInfo">
                            <Input v-model.trim="formValidate1.modifyInfo" :maxlength="200" type="textarea" width="500" height="200"
                                   placeholder="允许录入200字备注"></Input>
                        </FormItem>
                    </Col>

                    <Col span="2">
                        <limitLength :value="formValidate1.modifyInfo" :max="200" />
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="batchSetSubmit('formValidate1')">提交</Button>
            </div>
        </Modal>
        <vue-extend-dialog :show.sync="modifySuccess">
            {{modifySuccessInfo}}
        </vue-extend-dialog>
    </div>
</template>

<script>
    import TablePage from '@/components/mixins/tablePage'

    export default {
        name: "gpsManufacturerManagement_index",
        components: {},

        mixins: [TablePage],
        data() {
            return {
                isBrantchEidt:false,
                channelId: "",
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
                        mainName: "",
                    }
                },
                //抵放模式管理数据列表
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
                        title: '省份',
                        key: 'province',
                        width: 120
                    },
                    {
                        title: '市',
                        key: 'city',
                        width: 120
                    },
                    {
                        title: 'GPS厂商',
                        key: 'gpsName',
                        width: 160
                    },
                    {
                        title: '更新人',
                        key: 'updateName',
                        width: 100
                    },
                    {
                        title: '更新时间',
                        key: 'updateTime',
                        minWidth: 160
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
                                            this.options(params.row)
                                        }
                                    }
                                }, '设置')
                            ]);
                        }
                    }
                ],
                data: [],
                //设置当前条目
                setModal: false,
                formValidate:{
                    modifyInfo:"",
                    GPSConfigsId:[]
                },
                ruleValidate:{
                    modifyInfo: [ {required: true, message: '修改原因说明不能为空', trigger: 'blur' } ],
                    GPSConfigsId: [ {required: true, type: 'array', message: 'GPS厂商配置不能为空', trigger: 'change' } ]
                },
                formValidate1:{
                    modifyInfo:"",
                    GPSConfigsIds:[]
                },
                ruleValidate1:{
                    modifyInfo: [ {required: true, message: '修改原因说明不能为空', trigger: 'blur' } ],
                    GPSConfigsIds: [ {required: true, type: 'array', message: 'GPS厂商配置不能为空', trigger: 'change' } ]
                },
                currentSetSelectId: "",
                //抵放模式管理-设置modal数据列表
                setColumns: [
                    {
                        title: '渠道编号',
                        key: 'channelCode'
                    },
                    {
                        title: '渠道科目',
                        className: "row-rel",
                        children: [
                            {
                                title: ' ',
                                key: 'firstSubject',
                                className: 'row-hidden'
                            },
                            {
                                title: ' ',
                                key: 'secondSubject',
                                className: 'row-hidden'
                            }
                        ]
                    },
                    {
                        title: '业务类型',
                        key: 'busiClass'
                    },
                    {
                        title: '渠道名称',
                        key: 'shopName'
                    },
                    {
                        title: '主体名称',
                        key: 'mainName'
                    },
                    {
                        title: '所在省市',
                        key: 'province&city',
                        render: (h, params) => {
                            console.log(params)
                            return h('div', [
                                h('span', params.row.province + ' ' + params.row.city)
                            ]);
                        }
                    },
                    {
                        title: 'GPS厂商',
                        key: 'gpsName'
                    }
                ],
                setData: [],
                //抵放模式管理-设置modal历史数据列表
                historyColumns: [
                    {
                        title: "修改内容",
                        key: "eventDetails"
                    },
                    {
                        title: "修改原因说明",
                        key: "updateReason"
                    },
                    {
                        title: "修改人",
                        key: "creatorName"
                    },
                    {
                        title: '最近操作时间',
                        key: 'updateTime'
                    }
                ],
                historyData: [],
                //批量修改
                batch: {
                    setModal: false,
                    setColumns: [
                        {
                            title: '渠道编号',
                            key: 'channelCode'
                        },
                        {
                            title: '渠道科目',
                            className: "row-rel",
                            children: [
                                {
                                    title: ' ',
                                    key: 'firstSubject',
                                    className: 'row-hidden'
                                },
                                {
                                    title: ' ',
                                    key: 'secondSubject',
                                    className: 'row-hidden'
                                }
                            ]
                        },
                        {
                            title: '业务类型',
                            key: 'busiClass'
                        },
                        {
                            title: '渠道名称',
                            key: 'shopName'
                        },
                        {
                            title: '主体名称',
                            key: 'mainName'
                        },
                        {
                            title: '所在省市',
                            key: 'province&city',
                            render: (h, params) => {
                                console.log(params)
                                return h('div', [
                                    h('span', params.row.province + ' ' + params.row.city)
                                ]);
                            }
                        },
                        {
                            title: 'GPS厂商',
                            key: 'gpsName'
                        }
                    ],
                    setData: [],
                    modifyInfo: "",
                    //批量修改选中的列表
                    GPSConfigss: [],
                    //gps厂商配置
                    GPSConfigsList: [],

                    selectedList: []
                },
                //列表页
                page: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                }
            }
        },
        methods: {
            //加载列表
            loadList() {
                let params = {
                    current: this.page.current,
                    rowCount: this.page.pageSize,
                    channelCode: this.search.options.channelCode,
                    shopName: this.search.options.shopName,
                    mainName: this.search.options.mainName,
                };
                this.tloading = true;
                this.$http.post('/gpsPolicyController/getGpsPolicyList', params).then(resp => {
                    this.tloading = false;
                    if (resp.data.success) {
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
            //点击设置加载列表
            loadListForSettings(channelId) {
                let params = {
                    channelId: channelId
                }
                this.$http.post('/gpsPolicyController/getGpsPolicyListById', params).then(resp => {
                    if (resp.data.success) {
                        console.log(resp.data.data)
                        if (resp.data.data.length > 0) {
                            console.log(resp.data.data)
                            this.setData = resp.data.data;

                            this.formValidate.GPSConfigsId = resp.data.data[0].gpsCode?resp.data.data[0].gpsCode.split(','):[];

                        } else {
                            this.setData = [];
                            //this.$Message.error('暂无数据');
                        }
                    } else {
                        //this.$Message.error('请求错误');
                    }
                })
            },
            //业务类型列表
            businessCollection(data) {
                console.log(data);
            },
            //配置政策包
            configurationPolicyPackage() {
                this.$bus.$emit("GpsManufacturerSettings", {
                    id: "GpsManufacturerSettings",
                    isShow: true,
                    name: "GPS厂商政策配置"
                });
            },
            //导出列表
            /* exportList () {
               this.$refs.selection.exportCsv({
                 filename: '抵放模式管理列表'
               });
             },*/
            //批量修改
            batchEdit() {

                this.isBrantchEidt = true;
                this.batch.setData = [];

                this.batch.setData = this.batch.selectedList;

                if (this.batch.setData.length === 0) {

                    this.$Message.warning('无编辑选项');
                    return false;
                }

                this.batch.setModal = true;
            },

            //批量修改提交
            batchSetSubmit(name) {
                let ids = [];

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.batch.setData.map(item => {
                            ids.push(item.channelId);
                        })
                        console.log(ids);
                        let params = {
                            "channelId": ids.join(','),
                            "gpsCode": this.formValidate1.GPSConfigsIds.join(','),
                            "remark": this.formValidate1.modifyInfo
                        };

                        this.$http.post('/gpsPolicyController/updateBatchGpsInfo', params).then(resp => {
                            if (resp.data.success) {
                                this.modifySuccess = "true";
                                this.modifySuccessInfo = "修改成功，本次共修改 "+ this.batch.setData.length +" 家渠道！";
                                this.formValidate1.GPSConfigsIds = [];
                                this.formValidate1.modifyInfo = "";
                                //this.$Message.success('成功');
                                this.batch.setModal = false;
                                this.loadList();
                            }
                        })
                    } else {
                        this.$Message.error('必填项不能为空');
                    }
                })

            },
            //设置
            options(data) {
                console.log(data);
                this.isBrantchEidt = false;
                this.setModal = true;
                this.channelId = data.channelId;
                this.loadListForSettings(data.channelId);
                this.logFn(data.channelId);

            },
            //设置提交按钮
            setSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let params = {
                            "channelId": this.channelId,
                            "gpsCode": this.formValidate.GPSConfigsId.join(','),
                            "remark": this.formValidate.modifyInfo
                        };

                        this.$http.post('/gpsPolicyController/updateBatchGpsInfo', params).then(resp => {
                            this.channelId = "";
                            this.modifySuccess = "true";
                            this.modifySuccessInfo = "修改成功，本次共修改 1 家渠道！";
                            this.formValidate.GPSConfigsId = [];
                            this.formValidate.modifyInfo = "";
                            //this.$Message.success('成功');
                            this.setModal = false;
                            this.loadList();
                        })
                    } else {
                        this.$Message.error('必填项不能为空');
                    }
                })

            },
            selectedFn(options) {
                this.batch.selectedList = options;
            },
            selectedAllFn(options) {
                this.batch.selectedList = options;
            },
            //查询按钮
            searchFn() {
                let params = this.search.options;
                this.page.current = 1;
                this.loadList();
            },
            //重置按钮
            resetFn() {
                this.page.current = 1;
                this.search.options = {
                    //基本搜索条件
                    channelCode: "",//编号
                    shopName: "",//渠道名称
                    mainName: "",//店面名称
                }
                //this.loadList();
            },
            logFn(channelId) {
                let params = {
                    eventType: "0002",
                    channelId: channelId
                }
                this.$http.post('/log/queryLogByGroupCodePage.do', params).then(resp => {
                    if (resp.data.data.data.length > 0) {
                        this.historyData = resp.data.data.data;
                    }
                })
            }
        },
        created() {
            this.$http.post('/gpsPolicyController/getGPSCodeName').then(resp => {
                if (resp.data.success) {
                    if (resp.data.data.length > 0) {
                        this.GPSConfigsList = resp.data.data;
                        this.batch.GPSConfigsList = resp.data.data;
                    } else {
                        this.batch.GPSConfigsList = [];
                        // this.$Message.warning("暂无数据");
                    }
                } else {
                    //this.$Message.error(resp.data.errorMessage || "请求错误");
                }

            })
        },
        mounted() {
            let bodyHeight = $(document).height() - $('.po-header').height() - $('.ivu-tabs-nav-scroll').height();
            $('.expension-mainterance').css({"overflow-y": "auto", "over-flow-x": "visible", "height": bodyHeight});
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
