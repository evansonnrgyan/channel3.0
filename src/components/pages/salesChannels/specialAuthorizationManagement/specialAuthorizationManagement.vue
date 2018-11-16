<!--特殊授权管理-->
<template>
    <div ref="expension-mainterance" class="expension-mainterance" style="overflow-y:auto">
        <div class="channels-common-search-content clearboth">
            <Row>
                <Col span="8">
                    <Row>
                        <Col span="6" class="font-right">被授权人姓名</Col>
                        <Col span="18"><Input v-model.trim="search.options.channelCode" placeholder=""></Input></Col>
                    </Row>
                </Col>
                <Col span="8">
                    <Col span="6" class="font-right">授权机构</Col>
                    <Col span="18"><Input v-model.trim="search.options.shopName" placeholder=""></Input></Col>
                </Col>
            </Row>
            <div style="padding: 20px 0 0; text-align: center">
                <Button type="primary" size="large" @click="searchFn">查询</Button>
                <Button size="large" @click="resetFn">重置</Button>
            </div>
        </div>
        <div class="channels-common-body clearboth">
            <div class="channels-common-body-button font-right">
                <Button type="primary" size="large" @click="addNewAuthorization">新增授权</Button>
            </div>
            <div>共{{page.total}}条</div>
            <Table
                    border
                    :columns="columns"
                    :data="data"></Table>
            <Page :total="page.total"
                  show-total
                  show-sizer
                  show-elevator
                  :page-size-opts="[10, 20, 50, 100]"
                  @on-change="changePageNumber"
                  @on-page-size-change="changePageSize"
            ></Page>
        </div>

        <!-- 单个设置 -->
        <Modal
                v-model="addNewModal"
                scrollable
                width="900px"
                :mask-closable=false
                class-name="vertical-center-modal"
                :title="titleName">

            <div v-show="!isHasSelected" class="select-talbe">
                <Row style="padding: 0 0 10px 0;">
                    <Col span="2" style="line-height: 28px;">查询被授权人</Col>
                    <Col span="1">&nbsp;</Col>
                    <Col span="6">
                        姓名:<Input v-model.trim="searchEmployeeName" placeholder="请输入员工姓名或编号进行查询" style="width:190px"></Input>
                    </Col>
                    <Col span="1">&nbsp;</Col>
                    <Col span="6">
                        编号:<Input v-model.trim="searchEmployeeCode" placeholder="请输入员工姓名或编号进行查询" style="width:190px"></Input>
                    </Col>
                    <Col span="1">&nbsp;</Col>
                    <Col span="6">
                        <Button type="primary" size="large" @click="searchForEmployee">查询</Button>
                    </Col>
                </Row>
                <Table
                        border
                        size="small"
                        :columns="columns1"
                        :data="data1"></Table>
                <Page :total="page1.total"
                      size="small"
                      show-total
                      show-sizer
                      show-elevator
                      @on-change="changePageNumber1"
                      @on-page-size-change="changePageSize1"
                ></Page>
            </div>
            <div v-show="isHasSelected" class="has-selected">
                <Table
                        border
                        :columns="columns2"
                        :data="data2"></Table>
                <Row>
                    <Col span="24">
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                            <FormItem label="选择授权机构" prop="selectDatas">
                                <div class="ivu-input-wrapper ivu-input-type" style="width: 300px;">
                                    <input v-model.trim="formValidate.selectDatas" :title="formValidate.selectDatas"
                                           id="selectDatas" type="text" class="ivu-input" readonly
                                           @focus="ztreeSelectEvent"/>
                                </div>
                            </FormItem>
                        </Form>
                        <!--<div v-show="ztreeShow" style="position: relative;">-->
                        <span v-show="ztreeLoad" style="display: inline-block;padding: 5px 0 5px 100px;font-size:12px">loading...</span>
                        <div style="position: relative;">
                            <ul id="authorization-ztree"
                                class="ztree ztree-style"
                                style="clear:both;position:relative;left:100px;border:none"
                                v-vueZtree="{ztreeData, setting}">
                            </ul>
                            <!--<Icon type="ios-close" style="position: absolute; left: 382px; cursor: pointer;" @click="hiddenTreeEvent"/>-->
                        </div>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <div v-show="isHasSelected">
                    <Button v-if="isAdd" size="large" @click="returnSearch">返回查找</Button>
                    <Button v-if="!isAdd" size="large" @click="channeModify">取消</Button>
                    <Button type="primary" size="large" @click="addAuthorizationEvent('formValidate')">
                        {{titleName}}
                    </Button>
                </div>
            </div>
        </Modal>

        <!--删除授权-->
        <Modal
                v-model="deleteModal"
                scrollable
                :mask-closable=false
                width="300px"
                class-name="vertical-center-modal"
                title="提示"
                @on-ok="deleteSureEvent">
            确认清除授权？
        </Modal>

    </div>
</template>

<script>
    import TablePage from '../../../../components/mixins/tablePage';
    import vueZtree from "../../../directives/ztree/vue-ztree";

    export default {
        name: "specialAuthorizationManagement",
        mixins: [TablePage],
        directives: {
            vueZtree,
        },
        data() {
            let _this = this;
            return {
                isAdd: false,
                isHasSelected: false,
                addNewModal: false,
                ztreeShow: false,
                deleteModal: false,
                submitStatus: true,
                titleName:"新增授权",
                ztreeLoad:true,
                searchEmployeeName: "",
                searchEmployeeCode: "",
                checkedNodes: [],
                formValidate: {
                    selectDatas: [],
                },
                ruleValidate: {
                    selectDatas: [
                        {required: false, message: '授权机构不能为空'}
                    ]
                },
                deleteId: "",
                setting: {
                    check: {
                        enable: true,
                        chkboxType : { "Y" : "", "N" : "" }
                    },
                    view: {
                        dblClickExpand: false
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onCheck: _this.onCheck
                    }
                },
                ztreeData: [],
                returnNodes: [],
                search: {
                    options: {
                        //基本搜索条件
                        channelCode: "",
                        shopName: "",
                        mainName: ""
                    }
                },
                columns: [
                    {
                        title: '被授权人姓名',
                        key: 'target_name'
                    },
                    {
                        title: '授权机构',
                        key: 'node_name',
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: '授权日期',
                        key: 'CREATE_TIME'
                    },
                    {
                        title: '授权人',
                        key: 'source_name'
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
                                            this.authorModify(params.row)
                                        }
                                    }
                                }, '修改授权'),
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
                                            this.deleteModal = true;
                                            this.deleteId = params.row;

                                        }
                                    }
                                }, '清除授权')
                            ]);
                        }
                    }
                ],
                data: [],
                columns1: [
                    {
                        title: "ID",
                        key: "userId"
                    },
                    {
                        title: "姓名",
                        key: "cnName"
                    },
                    {
                        title: "职位",
                        key: "postTitle"
                    },
                    {
                        title: "所在部门",
                        key: "departmentAllName",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "操作",
                        key: 'action',
                        align: 'center',
                        width: 80,
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
                                            this.selectEvent(params.row)
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
                        title: "员工编号",
                        key: "employeeNumber"
                    },
                    {
                        title: "姓名",
                        key: "userName"
                    },
                    {
                        title: "职位",
                        key: "postTitle"
                    },
                    {
                        title: "在职状态",
                        key: "statusName"
                    }
                ],
                data2: []
            }
        },
        methods: {
            onCheck(e, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj('authorization-ztree');
                let nodes = zTree.getCheckedNodes(true);


                //this.checkedNodes = [];
                let ztreeNames = [];
                let ztreeIds = [];
                nodes.map(item => {

                    ztreeNames.push(item.name);
                    ztreeIds.push(item.id);
                });
                $('#selectDatas').val(ztreeNames).attr("ztree-ids", ztreeIds);
                return false;
            },
            loadList() {
                let params = {
                    current: this.page.current,
                    rowCount: this.page.pageSize,
                    "targetName": this.search.options.channelCode,
                    "nodeName": this.search.options.shopName
                };
                this.$http.post('/tbChannelEmpower/tbChannelEmpowerList', params).then(resp => {
                    if (resp.data.success) {
                        if (resp.data.data.data.length > 0) {
                            this.page.total = resp.data.data.total;
                            this.data = resp.data.data.data;
                        } else {
                            this.data = [];
                            //this.$Message.warning('暂无数据');
                        }
                    } else {
                        //this.$Message.error(resp.data.errorMessage || '请求错误');
                    }
                })
            },
            loadList1() {
                let params = {
                    current: this.page1.current,
                    rowCount: this.page1.pageSize,
                    "cnName": this.searchEmployeeName,
                    "employeeNumber": this.searchEmployeeCode

                }

                this.page1.current = 1;

                this.$http.post('/api/yxAdminDepartment/getUserInfoByCnNameAndDeptid', params).then(resp => {

                    if (resp.data.success) {
                        if (resp.data.data.data.length > 0) {
                            this.data1 = resp.data.data.data;
                            this.page1.total = resp.data.data.total;
                        } else {
                            this.data1 = [];
                            //this.$Message.warning("暂无数据");
                        }
                    } else {
                        //this.$Message.error(this.data.errorMessage || "请求错误");
                    }
                })
            },
            //查询按钮
            searchFn() {
                let params = this.search.options;
                //数组格式参数转换为支付串数组格式
                this.loadList();
            },
            //重置按钮
            resetFn() {
                this.search.options = {
                    channelCode: "",//编号
                    shopName: "",//渠道名称
                }
            },
            //新增授权
            addNewAuthorization() {
                this.isAdd = true;
                this.addNewModal = true;
                this.isHasSelected = false;
                this.submitStatus = true;
                this.formValidate.selectDatas = "";
                this.searchEmployeeName="";
                this.searchEmployeeCode="";
                this.returnNodes = [];
                this.titleName = "新增授权";
                this.ztreeData=[];
                this.loadList1();

            },
            //新增授权提交按钮
            addAuthorizationEvent(name) {

                var zTree = $.fn.zTree.getZTreeObj("authorization-ztree");
                let nodes = zTree.getCheckedNodes(true);
                //this.checkedNodes = [];
                //let ztreeNames = [];
                let ztreeIds = [];
                //let ztreePIds = [];
                nodes.map(item => {
                    //let halfCheck = item.getCheckStatus();
                    //if (!halfCheck.half) {
                        //ztreeNames.push(item.name);
                        ztreeIds.push(item.id);
                        /*ztreePIds.push({
                            nodeCode: item.id,
                            pnodeCodes: item.pId
                        });*/
                    //}
                });
                console.log(nodes, '选中的树节点');
                console.log(ztreeIds, '选中ztreeIds节点id集合');
                //console.log(ztreePIds, 'ztreeIds父节点节点集合');

                if (this.submitStatus === true) {
                    this.$refs[name].validate((valid) => {
                        if (valid) {

                            let params = {
                                "targetName": this.data2[0].userName,
                                "targetAccount": this.data2[0].userAccount,
                                "nodeCodes": ztreeIds
                                //"nodeCodesAndPnodeCodes": ztreePIds
                            }

                            this.$http.post('/tbChannelEmpower/addTBChannelEmpower', params).then(resp => {
                                if (resp.data.success) {
                                    this.addNewModal = false;
                                    this.isHasSelected = false;
                                    this.$Message.success(this.data.data || "保存成功");
                                    this.$refs[name].resetFields();
                                    this.data2 = [];
                                    this.checkedNodes = [];

                                    this.page.current = 1;
                                    this.loadList();

                                    this.search.options.channelCode = "";
                                    this.search.options.shopMain = "";
                                } else {
                                    //this.$Message.error(resp.data.errorMessage || "保存失败")
                                }
                            })
                        } else {
                            this.$Message.error('授权机构不能为空');
                        }
                    })
                } else {
                    this.$refs[name].validate((valid) => {
                        if (valid) {

                            let params = {
                                "sourceAccount": this.data2[0].sourceAccount,
                                "targetName": this.data2[0].userName,
                                "targetAccount": this.data2[0].userAccount,
                                "nodeCodes": ztreeIds
                                //"nodeCodesAndPnodeCodes": ztreePIds
                            }

                            this.$http.post('/tbChannelEmpower/editTBChannelEmpower', params).then(resp => {
                                if (resp.data.success) {
                                    this.addNewModal = false;
                                    this.isHasSelected = false;
                                    this.$Message.success(this.data.data || "保存成功");
                                    this.$refs[name].resetFields();
                                    this.data2 = [];
                                    this.checkedNodes = [];

                                    this.page.current = 1;
                                    this.loadList();

                                    this.search.options.channelCode = "";
                                    this.search.options.shopMain = "";
                                } else {
                                    //this.$Message.error(resp.data.errorMessage || "保存失败")
                                }
                            })
                        } else {
                            this.$Message.error('授权机构不能为空');
                        }
                    })
                }
            },
            //修改授权
            authorModify(data) {
                this.isAdd = false;
                this.addNewModal = true;
                this.isHasSelected = true;
                this.submitStatus = false;
                this.ztreeData=[];
                this.titleName = "修改授权";
                this.ztreeLoad = true;


                let params = {
                    "sourceAccount": data["source_account"],
                    "targetAccount": data["target_account"]
                }

                this.$http.post('/tbChannelEmpower/getModifyUserInfo', params).then(resp => {
                    if (resp.data.success) {
                        let datas = resp.data.data;
                        this.data2 = [datas];

                        this.checkedNodes = datas.nodeCode.split(',');
                        this.formValidate.selectDatas = datas.nodeNames;
                        $('#selectDatas').val(datas.nodeNames);

                        this.returnNodes = datas.nodeCode.split(',');

                        //授权机构树
                        let treeParams = {
                            "dimensionCode": "DM00000003"
                        }
                        this.$http.post('tbMultipleNode/tbMultipleNodeTree', treeParams).then(resp => {

                            if (resp.data.success) {
                                this.isHasSelected = true;
                                if (resp.data.data.length > 0) {
                                    this.ztreeData = resp.data.data;
                                    this.ztreeLoad = false;

                                    this.$nextTick(() => {
                                        setTimeout(()=>{
                                            let zTree = $.fn.zTree.getZTreeObj("authorization-ztree");

                                            this.returnNodes.map(item => {
                                                let node = zTree.getNodeByParam("id", item, null);

                                                zTree.checkNode(node,true,true)
                                                //zTree.expandNode(node, true, true, true);

                                            })
                                        },500)
                                    })

                                } else {
                                    //this.$Message.warning("暂无数据");
                                    this.data1 = [resp.data.data];
                                }
                            } else {
                                //this.$Message.error(resp.data.errorMessage || "请求错误");
                            }
                        })


                    } else {
                        //this.$Message.error("请求错误");
                    }
                })

            },
            //删除授权
            deleteEmployeeAuthor(data) {
                console.log(data)
                let params = {
                    "sourceAccount": data["source_account"],
                    "targetAccount": data["target_account"]

                };

                this.$http.post('tbChannelEmpower/clearTBChannelEmpower', params).then(resp => {
                    if (resp.data.success) {
                        this.$Message.success(resp.data.data || "删除成功");
                        this.loadList();
                    } else {
                        //this.$Message.error(resp.data.errorMessage || "删除失败");
                    }
                })
            },
            //确定选择
            selectEvent(data) {
                //获取详情
                let employeeId = {
                    targetAccount: data.domainName
                }
                this.ztreeLoad=true;

                this.$http.post('tbChannelEmpower/getaddUserInfo', employeeId).then(resp => {
                    //debugger
                    if (resp.data.success) {
                        if (resp.data.data) {
                            this.data2 = [resp.data.data];

                            //授权机构树
                            let treeParams = {
                                "dimensionCode": "DM00000003"
                            }
                            this.$http.post('tbMultipleNode/tbMultipleNodeTree', treeParams).then(resp => {

                                console.log(resp, 'tree');
                                if (resp.data.success) {
                                    this.ztreeLoad = false;
                                    this.isHasSelected = true;
                                    if (resp.data.data.length > 0) {
                                        this.ztreeData = resp.data.data;
                                    } else {
                                        //this.$Message.warning("暂无数据");
                                        this.data1 = [resp.data.data];
                                    }
                                } else {
                                    //this.$Message.error(resp.data.errorMessage || "请求错误");
                                }
                            })


                        } else {
                            //this.$Message.warning("暂无数据");
                            this.data1 = [resp.data.data];
                        }
                    } else {
                        //this.$Message.error(resp.data.errorMessage || "请求错误");
                    }
                });



            },
            // 取消修改
            channeModify() {
                this.addNewModal = false;
            },
            // 返回查找
            returnSearch(data) {
                this.isHasSelected = false;
                this.data1 = [];
                this.loadList1();
            },
            //查询人员
            searchForEmployee() {
                this.loadList1();
                //this.addNewAuthorization();
            },
            //ztree的显示隐藏
            ztreeSelectEvent() {
                this.ztreeShow = true
            },
            ztreeHidden() {
                //this.ztreeShow= false

            },
            //清除授权
            deleteSureEvent() {
                this.deleteEmployeeAuthor(this.deleteId);
            },
            hiddenTreeEvent() {
                this.ztreeShow = false;
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

    .ztree-style {
        position: absolute;
        border: 1px solid #dcdee2;
        left: 100px;
        top: -5px;
        width: 300px;
        background: #FFF;
        border-radius: 4px;
        padding-bottom: 10px;
        max-height: 300px;
        overflow: auto;
    }
</style>


