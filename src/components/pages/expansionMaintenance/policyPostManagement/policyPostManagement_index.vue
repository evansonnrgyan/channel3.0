<!-- 保单后置管理 -->
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
                    <Col span="6" class="font-right">主体名称</Col>
                    <Col span="18"><Input v-model.trim="search.options.mainName" placeholder="店面名称"></Input></Col>
                </Col>
            </Row>
            <div style="padding: 20px 0 0; text-align: center">
                <Button type="primary" size="large" @click="searchFn">查询</Button>
                <Button size="large" @click="resetFn">重置</Button>
            </div>
        </div>
        <div class="channels-common-body clearboth">
            <div class="channels-common-body-button font-right">
                <Button type="primary" size="large" @click="policyPostDefaultSet">保单后置默认政策</Button>
                <Button type="primary" size="large" @click="batchEdit">批量修改</Button>
            </div>
            <div>共{{page.total}}条</div>
            <Table
                    border
                    ref="selection"
                    :columns="columns"
                    :loading="tloading"
                    @on-selection-change="selectedFn"
                    @on-select-all="selectedAllFn"
                    :data="data"></Table>
            <Page :total="page.total"
                  show-total
                  show-sizer
                  show-elevator
                  :page-size-opts="pageSizeOpts"
                  @on-change="changePageNumber"
                  @on-page-size-change="changePageSize"
            ></Page>
        </div>

        <!-- 设置 -->
        <Modal
                v-model="setModal"
                scrollable
                width="900px"
                class-name="vertical-center-modal"
                :mask-closable="false"
                :title="isBrantchEidt?'批量设置保单后置':'设置保单后置'">
            <Table border class="vue-theader" :columns="setColumns" :data="setData"></Table>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="180">
                <Row>
                    <Col span="24">
                        <Row>
                            <Col span="24">
                                <FormItem label="新车是否后置保单" prop="newCarOffset">
                                    <RadioGroup v-model="formValidate.newCarOffset">
                                        <Radio label="1">是</Radio>
                                        <Radio label="0">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="24">
                        <Row>
                            <Col span="24">
                                <FormItem label="二车手是否后置保单" prop="newCarOffset">
                                    <RadioGroup v-model="formValidate.oldCarOffset">
                                        <Radio label="1">是</Radio>
                                        <Radio label="0">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
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
            <Table v-if="!isBrantchEidt" border height="200" :columns="historyColumns" :data="historyData"></Table>
            <div slot="footer">
                <Button type="primary" @click="setSubmit('formValidate')">提交</Button>
            </div>
        </Modal>

        <!--保单后置默认政策-->
        <Modal
                v-model="modalDefault"
                class-name="vertical-center-modal"
                :mask-closable="false"
                title="默认政策包">
            <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="180">
                <Row>
                    <Col span="24">
                        <Row>
                            <Col span="24">
                                <FormItem label="新车是否后置保单" prop="newCarOffset">
                                    <RadioGroup v-model="formValidate1.newCarOffset">
                                        <Radio label="1">是</Radio>
                                        <Radio label="0">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="24">
                        <Row>
                            <Col span="24">
                                <FormItem label="二手车是否后置保单" prop="newCarOffset">
                                    <RadioGroup v-model="formValidate1.oldCarOffset">
                                        <Radio label="1">是</Radio>
                                        <Radio label="0">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="modalDefaultEvent('formValidate1')">保存</Button>
            </div>
        </Modal>
        <vue-extend-dialog :show.sync="modifySuccess">
            {{modifySuccessInfo}}
        </vue-extend-dialog>
    </div>
</template>

<script>
    import TablePage from '@/components/mixins/tablePage';

    export default {
        name: "policyPostManagement_index",
        mixins: [TablePage],
        data() {
            return {
                isBrantchEidt: false,
                selectedList: [],
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
                        mainName: ""
                    }
                },
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
                        title: '新车是否后置保单',
                        key: 'newCarOffset',
                        width: 140,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                }, !params.row.newCarOffset?"":params.row.newCarOffset === "1" ? "是" : "否")
                            ]);
                        }
                    },
                    {
                        title: '二手车是否后置保单',
                        key: 'usedCarOffset',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                }, !params.row.usedCarOffset?"":params.row.usedCarOffset === "1" ? "是" : "否")
                            ]);
                        }
                    },
                    {
                        title: '更新人',
                        key: 'updateName',
                        width: 90
                    },
                    {
                        title: '最近操作时间',
                        key: 'updateTime',
                        minWidth: 120
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
                                    style: {
                                        marginRight: '5px',
                                        color: '#2d8cf0',
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            this.isBrantchEidt = false;
                                            this.options(params.row);
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
                currentSetSelectId: "",
                GPSConfigsId: [],
                GPSConfigsList: [
                    {
                        id: "1",
                        name: "广联"
                    },
                    {
                        id: "2",
                        name: "中端"
                    },
                    {
                        id: "3",
                        name: "车晓"
                    },
                    {
                        id: "4",
                        name: "四维"
                    }
                ],
                //批量修改选中的列表
                GPSConfigss: [],
                GPSConfigsList: [
                    {
                        id: "1",
                        name: "广联"
                    },
                    {
                        id: "2",
                        name: "中端"
                    },
                    {
                        id: "3",
                        name: "车晓"
                    },
                    {
                        id: "4",
                        name: "四维"
                    }
                ],
                //审放模式
                reviewModeId: "",
                reviewModeList: [
                    {
                        id: "1",
                        name: "先审后放"
                    },
                    {
                        id: "2",
                        name: "先放后审"
                    }
                ],
                //融保放款模式
                loanModeId: "",
                loanModeList: [
                    {
                        id: "1",
                        name: "直放"
                    },
                    {
                        id: "2",
                        name: "报销"
                    }
                ],
                modifyInfo: "",
                //抵放模式管理-设置modal数据列表
                setColumns: [
                    {
                        title: '渠道编号',
                        key: 'channelCode',
                        //fixed: 'left'
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
                        title: '新车是否后置保单',
                        key: 'newCarOffset',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                }, !params.row.newCarOffset?"":params.row.newCarOffset === "1" ? "是" : "否")
                            ]);
                        }
                    },
                    {
                        title: '二手车是否后置保单',
                        key: 'usedCarOffset',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                }, !params.row.usedCarOffset?"":params.row.usedCarOffset === "1" ? "是" : "否")
                            ]);
                        }
                    },
                ],
                setData: [],
                setChannelId: "",
                formValidate: {
                    newCarOffset: "",
                    oldCarOffset: "",
                    modifyInfo: ""
                },
                ruleValidate: {
                    newCarOffset: [{required: true, message: '新车是否后置保单不能为空', trigger: 'change'}],
                    oldCarOffset: [{required: true, message: '二手车是否后置保单不能为空', trigger: 'change'}],
                    modifyInfo: [{required: true, message: '修改原因说明', trigger: 'blur'}]
                },
                //抵放模式管理-设置modal历史数据列表
                historyColumns: [
                    {
                        title: '修改内容',
                        key: 'eventDetails',
                        width: 205,
                        render: (h, params) => {
                            return h('div', [
                                h('div', {
                                    style: {
                                        textAlign: "right"
                                    }
                                }, params.row.eventDetails.split(',')[0]),
                                h('div', {
                                    style: {
                                        textAlign: "right"
                                    }
                                }, params.row.eventDetails.split(',')[1])
                            ]);
                        }
                    },
                    {
                        title: '修改原因说明',
                        key: 'updateReason'
                    },
                    {
                        title: '修改人',
                        key: 'creatorName',

                    },
                    {
                        title: '最近操作时间',
                        key: 'updateTime'
                    }
                ],
                historyData: [],
                modalDefault: false,
                formValidate1: {
                    newCarOffset: "",
                    oldCarOffset: "",
                    modifyInfo: ""
                },
                ruleValidate1: {
                    newCarOffset: [{required: true, message: '新车是否后置保单不能为空', trigger: 'change'}],
                    oldCarOffset: [{required: true, message: '二手车是否后置保单不能为空', trigger: 'change'}],
                    modifyInfo: [{required: true, message: '修改原因说明', trigger: 'blur'}]
                },
            }
        },
        methods: {
            loadList() {
                let params = {
                    current: this.page.current,
                    rowCount: this.page.pageSize,
                    channelCode: this.search.options.channelCode,
                    shopName: this.search.options.shopName,
                    mainName: this.search.options.mainName
                };
                this.tloading = true;
                this.$http.post('/warrantyOffsetPolicyRelationController/queryWarrantyOffsetPolicyList', params).then(resp => {
                    if (resp.data.success) {
                        this.tloading=false;
                        if (resp.data.data.data.length > 0) {
                            this.page.total = resp.data.data.total;
                            this.data = resp.data.data.data;
                        } else {
                            this.page.total = resp.data.data.total;
                            this.data = [];
                            //this.$Message.error('暂无数据');
                        }
                    } else {
                        this.$Message.error('请求错误');
                    }
                })

            },
            //业务类型列表
            businessCollection(data) {
                console.log(data);
            },
            //默认政策包
            policyPostDefaultSet() {
                this.modalDefault = true;
                this.$http.post("warrantyOffsetPolicyRelationController/getDefault").then(resp => {
                    console.log(resp.data.data)
                    this.formValidate1.newCarOffset = resp.data.data.newCarOffset;
                    this.formValidate1.oldCarOffset = resp.data.data.usedCarOffset;
                })
            },
            //批量修改
            batchEdit() {
                this.isBrantchEidt = true;

                if (this.selectedList.length === 0) {
                    this.$Message.error("批量修改列表不能为空。");
                    return false;
                }

                let arr = this.selectedList.map((item) => {
                    return item.channelId;
                });

                let params = {
                    channelId: arr.join(',')
                };

                this.$http.post("/warrantyOffsetPolicyRelationController/queryWarrantyOffsetPolicyListbyId", params).then((resp) => {
                    if (resp.data.success) {
                        if (resp.data.data.length > 0) {
                            this.setModal = true;

                            this.setData = resp.data.data;
                            this.formValidate.newCarOffset = "";
                            this.formValidate.oldCarOffset = "";

                            this.modifyInfo = "";

                        } else {
                            this.setData = [];
                            //this.$Message.warning("暂无数据");
                        }
                    } else {
                        this.$Message.error("请求失败");
                    }
                })

            },

            //设置 返显
            options(data) {

                this.setChannelId = data.channelId;

                this.historyData = [];

                let params = {
                    channelId: this.setChannelId
                };

                this.historyData = [];

                this.$http.post("/warrantyOffsetPolicyRelationController/queryWarrantyOffsetPolicyListbyId", params).then((resp) => {
                    if (resp.data.success) {
                        if (resp.data.data.length > 0) {

                            this.setData = resp.data.data;
                            this.formValidate.newCarOffset = resp.data.data[0].newCarOffset;
                            this.formValidate.oldCarOffset = resp.data.data[0].usedCarOffset;

                            this.formValidate.modifyInfo = "";

                            let paramsData = {
                                channelId: this.setChannelId,
                                eventType: "0005001"
                            }

                            this.$http.post("/log/queryLogByGroupCode", paramsData).then((resp) => {

                                if (resp.data.success) {
                                    if (resp.data.data.length > 0) {
                                        this.historyData = resp.data.data;
                                    } else {
                                        this.historyData = [];
                                        //this.$Message.warning("日志暂无数据");
                                    }
                                } else {
                                    this.$Message.error("日志请求失败");
                                }
                                this.setModal = true;
                            })

                        } else {
                            this.setData = [];
                            //this.$Message.warning("暂无数据");
                        }
                    } else {
                        this.$Message.error("请求失败");
                    }
                })
            },
            //设置提交按钮
            setSubmit(name) {

                let params = {};

                if (this.isBrantchEidt) {
                    //批量设置
                    let arr = this.selectedList.map((item) => {
                        return item.channelId;
                    });

                    params = {
                        channelId: arr.join(','),
                        newCarOffset: this.formValidate.newCarOffset,
                        usedCarOffset: this.formValidate.oldCarOffset,
                        remark: this.formValidate.modifyInfo
                    };
                } else {
                    //单个设置
                    params = {
                        channelId: this.setChannelId,
                        newCarOffset: this.formValidate.newCarOffset,
                        usedCarOffset: this.formValidate.oldCarOffset,
                        remark: this.formValidate.modifyInfo
                    };
                }


                this.$refs["formValidate"].validate((valid) => {
                    if (valid) {
                        this.$http.post("/warrantyOffsetPolicyRelationController/updateExpWarrantyOffsetPolicy", params).then((resp) => {
                            if (resp.data.success) {

                                this.modifySuccess = true;
                                this.modifySuccessInfo = "修改成功，本次共修改 "+(this.isBrantchEidt?this.selectedList.length:1)+" 家渠道！";

                                this.setChannelId = "";

                                this.selectedList = [];

                                this.formValidate.newCarOffset = "";
                                this.formValidate.modifyInfo = "";

                                this.page.current = 1;
                                this.loadList();

                                this.setModal = false;
                                //this.$Message.success('修改成功');
                                this.$refs[name].resetFields();
                            } else {
                                //this.$Message.error('修改成功');
                            }
                        })
                    } else {
                        this.$Message.error('必填项不能为空');
                    }
                })
            },
            selectedFn(options) {
                console.log(options)
                this.selectedList = options;
            },
            selectedAllFn(options) {
                this.selectedList = options;
            },
            //查询按钮
            searchFn() {
                this.page.current = 1;
                this.loadList();
            },
            //重置按钮
            resetFn(name) {
                this.page.current = 1;
                this.search.options = {
                    //基本搜索条件
                    channelCode: "",//编号
                    shopName: "",//渠道名称
                    mainName: "",//店面名称
                }
                //this.loadList();
                this.$refs[name].resetFields();
            },
            modalDefaultEvent(name) {
                let params = {
                    newCarOffset: this.formValidate1.newCarOffset,
                    usedCarOffset: this.formValidate1.oldCarOffset,
                };

                this.$refs["formValidate1"].validate((valid) => {
                    if (valid) {
                        this.$http.post("/warrantyOffsetPolicyRelationController/setDefaultTbExpWarrantyOffsetPolicy", params).then(resp => {
                            if (resp.data.success) {
                                this.modalDefault = false;
                                this.$Message.success("设置成功");
                                this.$refs[name].resetFields();
                            } else {
                                //this.$Message.error("设置失败")
                            }
                        })
                    } else {
                        this.$Message.error('必填项不能为空');
                    }
                })
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
