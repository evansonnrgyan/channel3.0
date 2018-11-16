<!-- 销售架构管理 -->
<template>
    <div>
        <div class="">
            <div class="treeWrapper">
            <span class="treePart">
                <span v-if="isChangeLevel" class="treeHeader">
                    <span class="font14 black fLeft magrinLeft20">销售组织架构</span>
                    <span class="fRight marginRight20 font14 light" @click="changeLevel" v-if="!levelStats">解锁</span>
                    <span v-if="levelStats">
                        <span class="fRight marginRight20 font14 light" @click="saveLevalChange">锁定</span>
                    </span>
                </span>
                <div class="tree_content vbl-tree">                   
                     <ul id="bussinessTree" class="ztree" v-editable-tree style="width:auto"></ul>
                </div>
            </span>
                <span class="tablePart">

                <Row>
                    <Col span="24">
                        <span class="block  textRight marginRight8 co666 fLeft">员工</span>
                        <span class="block fLeft" style="width:220px">
                            <Input placeholder="请输入员工姓名查询" v-model.trim="searchTreeUser">
                            </Input>
                        </span>
                        <span class="block  textRight marginRight8 co666 fLeft" style="margin-left:15px">上级</span>
                        <span class="block fLeft marginR10" style="width:220px">
                            <Input placeholder="请输入员工编号查询" v-model.trim="searchTreeHigherLevel">
                            </Input>
                        </span>
                        <Button type="primary" @click="search">查询</Button>
                        <span v-if="showbtn">
                            <Button type="primary" @click="prev">上一个</Button>
                            <Button type="primary" @click="next">下一个</Button>
                        </span>
                        <Button @click="reset">重置</Button>
                    </Col>
                </Row>

                <div class="channels-common-body-button font-right paddingtop7">
                    <div class="float-left"><b>列表总数：{{total}}</b></div>
                    <Button v-if="isBranchModifyEmployee" type="primary" icon="plus" size="small" @click="branchModifyEmployee">批量修改</Button>
                    <Button v-if="isAddEmployee" type="primary" icon="plus" size="small" @click="addEmployee">添加员工</Button>
                </div>
                <div style="position: relative;">
                    <Table
                            :columns="columns"
                            :data="data"
                            @on-selection-change="branchModifyEvent"
                            @on-select-all="branchModifyAllEvent">
                </Table>
                    <Spin size="large" fix v-if="isSpinShow"></Spin>
                </div>

                <div class="allWidth marginTop10 BAM block">
                    <Page :page-size-opts="[10, 20, 50, 100]" :total="total" :current="page" show-sizer
                          :page-size='pagesize' show-total show-elevator @on-change='roleMoreChangePage'
                          @on-page-size-change='roleMoreChangePageSize'>
                    </Page>
                </div>
            </span>
            </div>
        </div>

        <!-- 拖拽提示 -->
        <Modal v-model="dropMessage" title="提示" width="400" :mask-closable="false">
            <p class="font14 black">
                {{infoModalText}}
            </p>
            <div slot="footer">
                <!--  <span class="search block marginRight6" @click="canceldropMessage">确定
                 </span>
                 <span class="reset block" @click="canceldropMessage">取消</span> -->
            </div>
        </Modal>

        <!-- 提示 -->
        <Modal v-model="infoModal" title="提示" width="400" :mask-closable="false">
            <p class="font14 black">
                <!-- {{infoModalText}} -->
                名称不能为空
            </p>
            <div slot="footer">
                <span class="search block marginRight6" @click="cancelTip">确定</span>
                <span class="reset block" @click="cancelTip">取消</span>
            </div>
        </Modal>

        <!-- 删除提示 -->
        <Modal v-model="deleteModal" title="提示" width="400" :mask-closable=false>
            <p class="black font14">确认删除吗？</p>
            <div slot="footer">
                <span class="search block marginRight6" @click="delNode">确定 </span>
                <span class="reset block" @click="cancelDel">取消</span>
            </div>
        </Modal>

        <!-- 添加、编辑机构 -->
        <Modal
                v-model="addModal_bumen"
                :title="title"
                :mask-closable=false>
            <Form ref="formValidate" :model="formValidate" :label-width="130" :rules="ruleValidate">
                <FormItem label="机构名称" prop="name">
                    <Input placeholder="请输入机构名称" v-model.trim="formValidate.name" :maxlength="20"
                           class="input-width"></Input>
                    <limitLength :value="formValidate.name" :max="20"/>
                </FormItem>
                <FormItem label="机构类型" prop="type">
                    <Select v-model="formValidate.type" :label="formValidate.type" @on-change="selectedTypeEvent"
                            placeholder="机构类型" class="input-width">
                        <Option v-for="(item, index) in cityList" :value="item.label" :key="index">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="关联行政树ID" prop="treeId">
                    <Input placeholder="" v-model.trim="formValidate.treeId" class="input-width"></Input>
                </FormItem>
                <FormItem label="ALIX机构ID" prop="alixID">
                    <Input placeholder="" v-model.trim="formValidate.alixID" class="input-width"></Input>
                </FormItem>
                <FormItem label="机构负责人" prop="man">
                    <!--<Input placeholder="" v-model="formValidate.man" class="input-width"></Input>-->
                    <Select
                            v-model="formValidate.man"
                            filterable
                            remote
                            :label="leaderSelected.chargeName"
                            :remote-method="remoteMethod1"
                            :loading="loading1"
                            @on-change="leaderSelectedEvent"
                            placeholder="机构负责人"
                            class="input-width">
                        <Option v-for="(option, index) in leaderList" :value="option.cnName" :key="index">{{option.cnName}}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <span class="search block marginRight6" @click="ok('formValidate')">确定 </span>
                <span class="reset block" @click="cancel('formValidate')">取消</span>
            </div>
        </Modal>


        <!-- 添加员工 -->
        <modal
                v-model="addem_modal"
                width="1000px"
                mask-closable=false
                :mask-closable="false"
                @on-cancel="cancel('ztreeValidate')"
                :title="isModify?'修改员工':'添加员工'">


            <div v-show="isEmSelected">
                <Row style="padding:5px;">
                    <Col span="2" class="font-right">员工姓名</Col>
                    <Col span="6"><Input v-model.trim="addemName" placeholder="员工姓名"/></Col>
                    <Col span="2" style="padding: 0 0 0 10px">
                        <Button type="primary" @click="addemSearch">查询</Button>
                    </Col>
                </Row>

                <Table size="small" border :columns="addem_columns" :loading="addLoading" :data="addem_data"></Table>
                <div class="allWidth marginTop10 BAM block">
                    <Page :total="addem_total" :page-size-opts="[10, 20, 50, 100]" :current="addem_page" show-sizer
                          :page-size='addem_pagesize' size="small" show-total show-elevator @on-change='addemChangePage'
                          @on-page-size-change='addemChangePageSize'>
                    </Page>
                </div>
            </div>

            <div v-show="!isEmSelected"><!--{{'isModify:'+isModify}}-->
                <Table v-if="!isModify" size="small" :columns="addemSelect_columns" :data="addemSelect_data"/>
                <Table v-else size="small" :columns="modify_columns" :data="addemSelect_data"/>

            <Form ref="ztreeValidate" :model="ztreeValidate" :rules="ztreeRules" :label-width="120" style="padding: 10px 0 0;">

                <Row>
                    <!--<Col span="2" class="font-right">业务归属</Col>-->
                    <Col span="24">
                        <FormItem label="设置销售三级类型" prop="busiType">
                            <Poptip trigger="hover" placement="right-start" word-wrap width="300">
                                <Select v-model="ztreeValidate.busiType" class="input-width">
                                    <Option v-for="item in busiTypeList" :value="item.name" :key="item.value">{{ item.name }}</Option>
                                </Select>
                                <div slot="content">
                                    <span>说明：<br>● 金融顾问、驻店金融顾问的上级需设置为正确的金融经理<br>● 金融经理的上级可设置为自己或分公司总经理</span>
                                </div>
                            </Poptip>
                        </FormItem>
                    </Col>
                </Row>

                <Row style="padding: 10px 0;">
                    <!--<Col span="2" class="font-right">确认所属上级</Col>-->
                    <Col span="24">
                        <FormItem label="设置所属上级" prop="searchName">
                            <Select
                                    v-model.trim="ztreeValidate.searchName"
                                    filterable
                                    remote
                                    :label="ztreeValidate.searchName"
                                    :remote-method="remoteMethod2"
                                    :loading="loading2"
                                    @on-change="SelectedEvent2"
                                    placeholder="输入名字联想，必须是树上已有的人"
                                    class="input-width">
                                <Option v-for="(option, index) in optionsList" :value="option.account_name"
                                        :key="index">{{option.account_name}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <!--<Col span="2" class="font-right">业务归属</Col>-->
                    <Col span="24">
                        <FormItem label="确认业务归属" prop="busiAscName">
                            <Select v-model="ztreeValidate.busiAscName" class="input-width">
                                <Option v-for="item in busiAscList" :value="item.name" :key="item.value">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>

                <Row style="padding: 10px 0;">
                    <!--<Col span="2" class="font-right">确认所属机构</Col>-->
                    <Col span="24">
                        <!-- 架构树 -->
                        <div style="position: relative;">
                            <!--<ul id="authorization-ztree"
                                class="ztree ztree-style clearboth"
                                v-vueZtree="{ztreeData, setting}">
                            </ul>-->
                            <FormItem label="确认所属机构" prop="ztreeValue">
                                <input id="authorization-ztree-value" type="text" class="ivu-input" style="width: 250px;"
                                       readonly/>
                                <div v-if="ztreeLoading" style="padding: 5px 0 5px 0px;font-size:12px">loading...</div>
                                <ul v-if="ztreeFlag" id="authorization-ztree"
                                    class="ztree ztree-style"
                                    style="position: relative; top: 4px; left: 0; width: 249px; border: none;"
                                    v-vueZtreeCustom="{ztreeParams: ztreeParams}">
                                </ul>

                                <Input v-model.trim="ztreeValidate.ztreeValue" style="height:0;opacity: 0;position:absolute"/>
                            </FormItem>
                        </div>
                    </Col>
                </Row>
            </Form>

            </div>

            <Spin v-show="isSpin" fix style="z-index: 999999999">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>

            <div slot="footer">
                <div v-show="!isEmSelected">
                    <Button v-if="!isModify" @click="returnSearch">返回查找</Button>
                    <Button v-if="isModify" @click="cancel('ztreeValidate')">取消</Button>
                    <Button type="primary" @click="addemOk('ztreeValidate')">确定</Button>
                </div>
            </div>
        </modal>


        <!-- 修改 批量修改员工 -->

        <!-- 日志 -->
        <modal
                v-model="log_modal"
                width="900px"
                :title="log_title"
                :mask-closable=false>

            <Table :columns="log_columns" :data="log_data">
            </Table>
            <div class="allWidth marginTop10 BAM block">
                <Page :total="log_total" :current="log_page" show-sizer
                      :page-size='log_pagesize':page-size-opts="[10, 20, 50, 100]" size="small" show-total show-elevator @on-change='logChangePage'
                      @on-page-size-change='logChangePageSize'>
                </Page>
            </div>
            <div slot="footer">

            </div>
        </modal>

    </div>
</template>
<script>
    // import vblLoading from '../common/vblLoading/vblLoading';
    import editableTree from './editableTree';
    import tree from './tree';
    import vueZtree from "../../../directives/ztree/vue-ztree";
    import vueZtreeCustom from '../../../directives/ztree/vue-ztree-custom';

    export default {
        name: 'salesTree',
        data() {
            return {
                addLoading:false,
                isBranchModifyEmployee:false,
                isAddEmployee:false,
                isChangeLevel:false,
                isSingleModify:false,

                isSpin: false,
                ztreeLoading: false,
                // 层级规则
                // 1-易鑫、2-大区、3-省份、4-一级分公司、5-二级办事处、6-虚拟部门
                ruleLivelList: [
                    {
                        "label": "易鑫集团",
                        "key": "yixinGroup",
                        "value": 1,
                    },
                    {
                        "label": "大区",
                        "key": "region",
                        "value": 2
                    },
                    {
                        "label": "省份",
                        "key": "province",
                        "value": 3
                    },
                    {
                        "label": "一级分公司",
                        "key": "branchOffice",
                        "value": 4
                    },
                    {
                        "label": "二级办事处",
                        "key": "office",
                        "value": 5
                    },
                    {
                        "label": "虚拟部门",
                        "key": "ualDepartment",
                        "value": 6
                    }
                ],

                // 编辑/添加 当前节点数据
                currentNodeData: {},

                //添加 true, 编辑 false
                isAdd: true,

                // 负责人列表
                leaderList: [],
                leaderSelected: {},

                //被点击的数据点
                clickedNode:{},

                // 用于列表搜索的ztreeNode id
                nodeIdForSearch: "",

                handleTime: "",
                loading1: false,

                getTreeNode: {},
                ztreeFlag: false,
                ztreeValue:"",
                ztreeParams: "",
                isSpinShow: false,


                //添加修改员工校验

                ztreeValidate:{
                    busiType:"",
                    searchName: "",
                    busiAscName: "",
                    ztreeValue: ""
                },

                ztreeRules:{
                    busiType: [
                        { required: true, message: '销售三级类型不能为空', trigger: 'change' }
                    ],
                    searchName: [
                        { required: true, message: '默认所属上级不能为空', trigger: 'change' }
                    ],
                    busiAscName: [
                        { required: true, message: "业务归属不能为空", trigger: 'change' }
                    ],
                    ztreeValue: [
                        { required: true, message: '默认所属机构不能为空', trigger: 'change' }
                    ]
                },

                //添加新员工
                addem_modal: false,
                addem_title: "添加员工",
                addem_total: 0,
                addem_page: 1,
                addem_pagesize: 10,
                addem_account: "",
                isEmSelected: true,

                employeeInfo: {},
                employeeInfoed: {},

                //被选中员工属性
                selectedEmData: {},
                addemName: "",
                addem_columns: [
                    {
                        title: 'ID',
                        key: 'userId',
                        width: 200
                    },
                    {
                        title: '姓名',
                        key: 'cnName',
                        width: 200
                    },
                    {
                        title: '职位',
                        key: 'postTitle',
                        width: 200
                    },
                    {
                        title: '所在部门',
                        key: 'departmentAllName',
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color: "#2d8cf0"
                                    },
                                    on: {
                                        click: () => {
                                            this.currentEm(params.row)
                                        }
                                    }
                                }, '选择')
                            ]);
                        }
                    }
                ],
                addem_data: [],

                // 被选择人详细信息
                addemSelect_columns: [
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

                // 修改 批量修改列表
                modify_columns: [
                    {
                        title: "员工编号",
                        key: "account_no"
                    },
                    {
                        title: "姓名",
                        key: "account_name"
                    },
                    {
                        title: "职位",
                        key: "post_title"
                    },
                    {
                        title: "在职状态",
                        key: "statusName"

                    },
                    {
                        title: "当前机构",
                        key: "node_name"
                    },
                    {
                        title: "当前业务归属",
                        key: "businessAscriptionName"
                    }
                ],

                addemSelect_data: [],

                // vue-ztree

                setting: {
                    check: {
                        enable: true,
                        chkStyle: "radio",
                        radioType: "all"
                    }, /*
                    view: {
                        dblClickExpand: false
                    },*/
                    /*callback: {
                        //onClick: onClick,
                        //onCheck: onCheck
                    }*/
                },
                ztreeData: [],

                // 日志
                log_modal: false,
                log_title: "日志",
                log_total: 0,
                log_page: 1,
                log_pagesize: 10,
                log_account: "",
                log_columns: [
                    {
                        title: '开始时间',
                        key: 'CREATE_TIME',
                    },
                    {
                        title: '开始操作人',
                        key: 'CREATOR_NAME',
                    },
                    {
                        title: '结束时间',
                        key: 'UPDATE_TIME',
                    },
                    {
                        title: '结束操作人',
                        key: 'UPDATOR_NAME',
                    },
                    {
                       title: '销售三级类型',
                       key: 'threeClassName'
                    },
                    {
                        title: '所属上级',
                        key: 'Paccount_name',
                    },
                    {
                        title: '所属机构',
                        key: 'node_name',
                    },

                    {
                        title: '业务归属',
                        key: 'businessAscriptionName',
                    }
                ],
                log_data: [],

                formValidate: {
                    name: '',
                    type: '',
                    treeId: '',
                    alixID: '',
                    man: ''
                },
                ruleValidate: {
                    name: [{required: true, message: '机构名称不能为空！', trigger: 'blur'}],
                    type: [{required: true, message: '机构类型不能为空！', trigger: 'change'}],
                    alixID: [{required: true, message: 'ALIX机构ID不能为空！', trigger: 'blur'}],
                    man: [{required: true, message: '机构负责人不能为空！', trigger: 'blur'}]
                },
                title: '',

                cityList: [],

                treeSarch: false,
                isShowLoading: true,//loading
                self: this,
                roleColumn: [ //表结构
                    {
                        title: 'ID',
                        key: 'userId'
                    },
                    {
                        title: '姓名',
                        key: 'cnName',
                    },
                    {
                        title: '职位',
                        key: 'postTitle',
                    },
                    {
                        title: '所在部门',
                        key: 'departmentAllName',
                        render(row, column, index) {
                            let str = row.departmentAllName;
                            if (str.substring(str.length - 1) === '/') {
                                return str.substring(0, str.length - 1)
                            } else {
                                return str
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        render(row, column, index) {
                            return `<a @click="man_ok(${index})">选择</a>`;
                        }
                    }
                ],
                roleData: [],

                bumenColumn: [ //表结构
                    {
                        title: 'ID',
                        key: 'departmentId'

                    },
                    {
                        title: '名称',
                        key: 'name',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        render(row, column, index) {
                            return `<a @click="bumen_ok(${index})">选择</a>`;
                        }
                    }
                ],
                bumenData: [],

                total: 0,
                columns: [ //表结构
                    {
                        type: 'selection',
                        align: 'center'
                    },
                    {
                        title: '员工编号',
                        key: 'account_no',
                    },
                    {
                        title: '姓名',
                        key: 'account_name',

                    },
                    {
                        title: '职位',
                        key: 'post_title',
                    },
                    {
                        title: '在职状态',
                        key: 'statusName',
                    },
                    {
                        title: '所属上级',
                        key: 'Paccount_name',
                    },
                    {
                        title: '所属机构',
                        key: 'node_name',
                    },
                    {
                        title: '业务归属',
                        key: 'businessAscriptionName',
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color: "#2d8cf0",
                                        display:(!this.isSingleModify?'none':'inline-block')
                                    },
                                    on: {
                                        click: () => {
                                            if(!this.isSingleModify){
                                                return false;
                                            }
                                            this.modify(params.row)
                                        }
                                    }
                                }, this.isSingleModify?'修改':''),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color: "#2d8cf0"
                                    },
                                    on: {
                                        click: () => {
                                            this.logInfo(params.row)
                                        }
                                    }
                                }, '日志')
                            ]);
                        }
                    }
                ],
                data: [],

                index: 0,
                clicklevelChange: false,

                // 弹框
                infoModalText: '',
                searchTreeUser: '',
                searchTreeHigherLevel: "",
                searchTreeUser: '',
                showbtn: false,
                infoModal: false,
                addModal: false,
                addModal_bumen: false,
                deleteModal: false,
                levelStats: false,//层级状态
                dropMessage: false,
                nodeLength: 0,
                page: 1,
                pagesize: 10,
                departmentId: '',

                // 批量修改 true, 单个修改false
                isBranchModify: false,

                //修改true, 新增false
                isModify: true,

                //修改/批量需改选中的员工
                selectedEmployeeList: [],

                total_man: 0,
                current_man: 1,
                pageSize_man: 10,
                cnName: '',

                departmentId: '',
                departmentName: '',
                total_bumen: 0,
                current_bumen: 1,
                pageSize_bumen: 10,

                departmentId_bumen: '',
                departmentName_bumen: '',

                timer: null,

                searchName: "",
                loading2: false,
                optionsList: [],

                // 业务归属
                busiAscList: [],
                // 设置销售三级类型
                busiTypeList:[],
                busiAscName: "",
                businessAscriptionName: "",
                timer:null
            }
        },
        directives: {
            editableTree,
            tree,
            vueZtreeCustom,
        },
        watch: {
            searchName(val) {
                this.remoteMethod2(val);
            }
        },
        methods: {
            nodeLength_fn(len) {
                this.nodeLength = len;
            },
            saveLevelChange(stats) {
                this.levelStats = stats;
            },
            onItemClick(departmentId) {
                this.isShowLoading = true;
                this.departmentId = departmentId;
                this.page = 1;
                this.$nextTick(() => {
                    this.getUserInfoByDpId(this.departmentId);
                })
            },
            dragReset(reset) {
                if (reset) {
                    this.showbtn = false;
                    this.searchTreeUser = '';
                }
            },
            remoteMethod1(query) {

                if (query !== '') {
                    this.loading1 = true;

                    this.handleTime = new Date().getTime();

                    let params = {
                        "cnName": query
                    }

                    setTimeout(() => {
                        if (new Date().getTime() - this.handleTime >= 500) {
                            this.$http.post("/api/uscUser/findUserListByPara", params).then((resp) => {
                                if (resp.data.success) {
                                    this.loading1 = false;
                                    this.leaderList = resp.data.data;
                                }
                            })
                        }
                    }, 500);

                } else {
                    this.leaderList = [];
                }
            },
            // 被选中额的机构类型

            selectedTypeEvent(data) {
                console.log(data, '选择的机构类型');
            },
            //被选择的机构负责人
            leaderSelectedEvent(name) {
                this.leaderSelected = {};
                this.leaderList.map(item => {
                    if (item.cnName === name) {
                        this.leaderSelected = item
                    }
                });
            },
            // 添加人员
            addMan(parentNode) {
                this.$refs["formValidate"].resetFields();
                this.parentNode = parentNode.id;
                this.title = '添加机构';
                this.addModal_bumen = true;
                this.isAdd = true;
                // this.cnName = '';
                // this.current_man = 1;
                // this.pageSize_man = 10;
                this.formValidate = {
                    name: '',
                    type: '',
                    treeId: '',
                    alixID: '',
                    man: ''
                };
                this.getMan(parentNode);

            },
            // 添加部门
            addBumen(parentNode) {
                this.$refs["formValidate"].resetFields();
                this.parentNode = parentNode.id;

                this.title = '编辑机构';
                this.addModal_bumen = true;
                this.isAdd = false;

                this.getBumen(parentNode);
            },

            //新添加  编辑提交
            ok(name) {

                console.log(this.isAdd, 'true 新增，false 编辑');

                this.$refs[name].validate((valid) => {
                    if (valid) {

                        console.log(this.currentNodeData, 'this.currentNodeData - 当前节点的信息');

                        console.log(this.formValidate, 'this.formValidate - 表单提交的信息');

                        let _this = this;

                        let apiURL = '';

                        let params = {};

                        if (this.isAdd) {
                            //新增保存
                            apiURL = '/tbMultipleNode/addTbMultipleNodeTree';

                            params = {
                                "parentCode": this.currentNodeData.id,
                                "dimensionCode": this.currentNodeData.dimensionCode,
                                "nodeName": this.formValidate.name,
                                "nodeType": function () {
                                    let data = "";
                                    _this.ruleLivelList.filter(item => {
                                        if (item.value === _this.currentNodeData.nodeType) {
                                            data = item.value
                                        }

                                    })
                                    return data + 1;
                                }(),
                                "level": this.currentNodeData.level + 2,
                                "administrativeTreeId": this.formValidate.treeId,
                                "alixId": this.formValidate.alixID,
                                "chargeAccount": this.leaderSelected.domainAccount,
                                "chargeName": this.leaderSelected.cnName,
                            }

                        } else {
                            //编辑保存
                            apiURL = '/tbMultipleNode/modifyTbMultipleNodeTree';

                            params = {
                                "nodeCode": this.currentNodeData.id,
                                "nodeName": this.formValidate.name,
                                "nodeType": function () {
                                    let data = "";
                                    _this.ruleLivelList.filter(item => {
                                        if (item.value === _this.currentNodeData.nodeType) {
                                            data = item.value
                                        }
                                    })
                                    return data;
                                }(),
                                "administrativeTreeId": this.formValidate.treeId,
                                "alixId": this.formValidate.alixID,
                                "chargeAccount": this.leaderSelected.chargeAccount || this.leaderSelected.domainAccount,
                                "chargeName": this.formValidate.man || this.leaderSelected.cnName
                            }

                        }

                        console.log(this.leaderSelected, 'this.leaderSelected信息');

                        console.log(params, '入参 新添加');
                        //debugger

                        this.$http.post(apiURL, params).then(resp => {
                            if (resp.data.success) {
                                this.leaderSelected = {};
                                this.$refs[name].resetFields();
                                this.addModal_bumen = false;

                                //TODO 添加/编辑 节点 刷新

                                this.$bus.$emit('addOrEditEvent', this.currentNodeData.id);

                                this.$Message.success("保存成功");

                            }
                        });

                    } else {
                        this.$Message.error('必填项不能为空!');
                    }
                })
            },
            cancel(name) {

                this.addem_modal = false;
                this.employeeInfo = {};
                this.employeeInfoed = {};
                this.searchName = "";
                this.busiAscName = "";
                this.busiAscList = [];
                this.ztreeFlag = false;
                this.ztreeParams = "";
                this.addModal_bumen = false;
                this.selectedEmployeeList = [];
                this.getUserInfoByDpId(this.clickedNode.id);
                this.$refs[name].resetFields();

            },

            //日志
            logChangePage(number) {
                this.log_page = number;
                this.logInfo(this.log_account);
            },
            logChangePageSize(number) {
                this.log_pagesize = number;
                this.logInfo(this.log_account);
            },

            //添加员工
            addEmployee() {
                /*if(!this.getTreeNode.cnName){
                    this.$Message.error("请选择员工的父节点");
                    return false;
                }*/

                this.addem_modal = true;
                this.isEmSelected = true;
                this.isModify = false;
                this.ztreeParams = "";
                this.addemName = "";
                this.busiAscName = "";
                $('#authorization-ztree-value').val('');
                this.ztreeValidate.ztreeValue = "";


                this.employeeInfo = {};
                this.employeeInfoed = {};
                this.searchName = "";

                this.loadEmployeeList();
            },

            //修改 - 单个修改
            modify(params) {
                this.employeeInfo = {};
                this.isBranchModify = false;
                this.isModify = true;

                this.isEmSelected = false;
                this.addem_modal = true;
                this.ztreeFlag = false;
                this.ztreeParams = "";

                this.searchName = "";
                this.optionsList = [];
                this.selectedEmployeeList = [];

                let obj = {
                    "ids": [params.ID]
                };

                //this.isSpin = true;


                this.$http.post('/tbMultipleNodeAccount/getmodfiyData', obj).then(resp => {
                    this.ztreeFlag = false;
                    if (resp.data.success) {

                        this.$nextTick(() => {
                            this.employeeInfo = resp.data.data[0];
                            this.selectedEmployeeList = resp.data.data;
                            this.addemSelect_data = resp.data.data;
                            console.log(resp.data.data, '选中列表项');

                            this.getBusiAscList(() => {
                                this.busiAscName = resp.data.data[0].businessAscriptionName;
                                this.ztreeValidate.busiAscName = resp.data.data[0].businessAscriptionName;

                            });



                            this.getBusiTypeList(() => {
                                this.busiType = resp.data.data[0].threeClassName;
                                this.ztreeValidate.busiType = resp.data.data[0].threeClassName;

                            });

                            this.searchName = resp.data.data[0].Paccount_name;
                            this.ztreeValidate.searchName = resp.data.data[0].Paccount_name;
                        });

                        this.getMultipleTree(() => {
                            this.$nextTick(() => {
                                this.ztreeFlag = true;
                                this.ztreeParams = resp.data.data[0].node_code;
                                console.log(this.ztreeParams, 'this.ztreeParams to vue-ztree-custom.js');
                            })
                        });

                    }
                });
            },

            // 修改 - 批量修改
            branchModifyEmployee() {

                this.isModify = true;
                this.isBranchModify = true;
                this.ztreeFlag = false;
                this.ztreeParams = "";
                //this.searchName="";
                //this.busiAscName="";

                this.employeeInfo = {};
                this.searchName = "";
                this.optionsList = [];


                console.log(this.selectedEmployeeList, '批量修改');
                if (this.selectedEmployeeList.length === 0) {
                    this.$Message.warning("请选择修改项");
                    return false;
                } else {
                    this.addemSelect_data = this.selectedEmployeeList;
                }

                this.isEmSelected = false;
                this.addem_modal = true;

                let _this = this;

                let params = {
                    "ids": function () {
                        let data = [];
                        _this.selectedEmployeeList.map(item => {
                            data.push(item.ID);
                            return item;
                        });
                        return data;
                    }()
                }

                this.isSpin = true;

                this.getBusiAscList();

                this.getMultipleTree(() => {
                    this.isSpin = false;
                });
                this.$http.post('/tbMultipleNodeAccount/getmodfiyData', params).then(resp => {
                    if (resp.data.success) {
                        console.log(resp.data.data, '选中列表项');
                        this.addemSelect_data = resp.data.data;
                        this.ztreeFlag = true;
                    }
                });
            },
            branchModifyEvent(data) {
                this.selectedEmployeeList = data;
            },
            branchModifyAllEvent(data) {
                this.selectedEmployeeList = data;
            },

            loadEmployeeList(cnName) {
                let params = {
                    "cnName": cnName,
                    "current": this.addem_page,
                    "rowCount": this.addem_pagesize
                };
                this.addLoading = true;
                this.$http.post('/api/yxAdminDepartment/getUserInfoByCnNameAndDeptid', params).then(resp => {
                    if (resp.data.success) {
                        this.addLoading = false;
                        this.addem_total = resp.data.data.total;
                        this.addem_data = resp.data.data.data;
                    }
                })
            },
            addemChangePage(number) {
                this.addem_page = number;
                this.loadEmployeeList(this.addemName);
            },
            addemChangePageSize(number) {
                this.addem_pagesize = number;
                this.loadEmployeeList(this.addemName);
            },

            // ----选择的当前员工
            currentEm(data) {
                this.selectedEmData = data;
                this.isModify = false;
                this.ztreeFlag = false;
                this.ztreeParams = false;

                //获取被选择员工的详细信息

                let params = {
                    "account": this.selectedEmData.domainName
                }

                this.$http.post('/tbMultipleNodeAccount/getaddUserInfo', params).then(resp => {
                    if (resp.data.success) {

                        this.isSpin = true;

                        this.addemSelect_data = [resp.data.data];

                        this.getMultipleTree(() => {
                            this.isSpin = false;
                            this.ztreeFlag = true;
                        });


                    } else {
                        this.addemSelect_data = [];
                        this.isSpin = false;

                    }
                });

                //三级类型

                this.getBusiTypeList();

                // 业务归属
                this.getBusiAscList();
            },
            returnSearch() {
                this.isEmSelected = true;
                this.ztreeFlag = false;
                this.ztreeParams = "";

                this.employeeInfo = {};
                this.employeeInfoed = {};
                this.searchName = "";

                this.ztreeValidate.searchName = "";
                this.optionsList = [];

                this.loadEmployeeList();
            },
            addemOk(name) {
                console.log(this.addemSelect_data[0])
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        $(".saveInput").trigger("click");
                        let data = this.addemSelect_data[0];
                        console.log(data);
                        let zTree = $.fn.zTree.getZTreeObj("authorization-ztree");
                        let node = zTree.getCheckedNodes(true)[0];

                        console.log(node, '选中的节点');

                        console.log(this.employeeInfo, '选择的上级人员');

                        let apiURL = '';
                        let params = {};
                        let _this = this;

                        if (this.isModify) {
                            // 修改
                            apiURL = '/tbMultipleNodeAccount/modfityTbMultipleNodeAccount';
                            params = {
                                "ids": function () {
                                    let data = [];
                                    _this.selectedEmployeeList.map(item => {
                                        data.push(item.ID)
                                    })
                                    return data;
                                }(),
                                "higherAccount": this.employeeInfoed.account || this.employeeInfo.Paccount,
                                "nodeCode": function () {
                                    let zTree = $.fn.zTree.getZTreeObj("authorization-ztree");
                                    let node = zTree.getCheckedNodes(true)[0];

                                    console.log(node, '选中的节点');
                                    return node.id
                                }(),
                                "threeClass": function () {
                                    let val = "";
                                    _this.busiTypeList.filter(item => {
                                        if (item.name === _this.ztreeValidate.busiType) {
                                            val = item.value
                                        }
                                    })
                                    return val;
                                }(),
                                "businessAscription": function () {
                                    let val = ""
                                    _this.busiAscList.filter(item => {
                                        if (item.name === _this.ztreeValidate.busiAscName) {

                                            val = item.value
                                        }
                                    })
                                    return val;
                                }()

                            }
                        } else {
                            // 新增
                            apiURL = '/tbMultipleNodeAccount/addTbMultipleNodeAccount';
                            params = {
                                "nodeCode": node.id,
                                "accountNo": data.employeeNumber,
                                "account": data.userAccount,
                                "accountName": data.userName,
                                "postTitle": data.postTitle,
                                "threeClass": function () {
                                    let val = "";
                                    _this.busiTypeList.filter(item => {
                                        if (item.name === _this.ztreeValidate.busiType) {
                                            val = item.value
                                        }
                                    })
                                    return val;
                                }(),
                                "status": data.status,
                                "higherAccount": this.employeeInfoed.account || this.employeeInfo.Paccount,
                                "businessAscription": function () {
                                    let val = "";
                                    _this.busiAscList.filter(item => {
                                        if (item.name === _this.ztreeValidate.busiAscName) {
                                            val = item.value
                                        }
                                    })
                                    return val;
                                }()
                            };
                        }

                        console.log(params, '添加或修改员工入参');

                        console.log(this.employeeInfoed,'选择的所属上级');

                        this.$http.post(apiURL, params).then(resp => {
                            if (resp.data.success) {
                                this.$Message.success(this.isModify ? "修改成功" : "添加成功");

                                //this.$bus.$emit('addOrEditEvent', this.searchName)

                                //添加或修改成功刷新列表

                                this.getUserInfoByDpId(this.clickedNode.id);

                                this.employeeInfoed = {};
                                this.employeeInfo = {};
                                this.searchName = "";
                                this.busiAscName = "";

                                this.busiAscName = "";
                                this.busiAscList = [];
                                this.ztreeParams = "";

                                this.ztreeValidate = {
                                        searchName: "",
                                        busiAscName: "",
                                        ztreeValue: ""
                                    }

                                if (this.isModify) {
                                    this.selectedEmployeeList = [];
                                }

                                //this.getUserInfoByDpId(this.nodeIdForSearch);

                                //this.ztreeFlag = false;
                                this.$refs[name].resetFields();
                                this.addem_modal = false;

                            }
                        });


                    } else {
                        this.$Message.error('必填项不能为空');
                    }
                })

            },

            roleMoreChangePageSize(pagesize) {
                this.page = 1;
                this.pagesize = pagesize;
                this.$nextTick(() => {
                    this.getUserInfoByDpId(this.departmentId);
                })
            },
            roleMoreChangePage(currentRow) {
                this.page = currentRow;

                this.$nextTick(() => {
                    this.getUserInfoByDpId(this.departmentId);
                })

            },
            delNode() {
                this.$emit('onItemDeleted');
                this.deleteModal = false;
            },

            // 当前节点下的人员
            search() {
                this.getUserInfoByDpId(this.nodeIdForSearch);
            },
            getUserInfoByDpId(nodeId, treeNode) {
                var _that = this;

                console.log(nodeId, 'nodeId');

                console.log(this.clickedNode, 'this.clickedNode被点击的树节点');

                _that.isSpinShow = true;
                _that.data = [];
                _that.selectedEmployeeList=[];

                if (!nodeId) {
                    _that.isSpinShow = false;
                    return false;
                }

                if(this.clickedNode.chkDisabled){
                    _that.data = [];
                    _that.isSpinShow = false;
                    return false;
                }

                this.nodeIdForSearch = nodeId;
                this.getTreeNode = treeNode;


                let params = {
                    nodeCode: nodeId,
                    accountName: this.searchTreeUser,
                    higherAccountName: this.searchTreeHigherLevel,
                    current: this.page,
                    rowCount: this.pagesize
                };

                this.$http.post('/tbMultipleNodeAccount/queryTbMultipleNodeAccountBypage', params).then(function (resp) {
                    //debugger
                    let data = resp.data;

                    if (data.success) {
                        _that.total = data.data.total;
                        _that.pageCount = resp.data.data.pageCount;
                        _that.data = data.data.data;
                        _that.isShowLoading = false;
                        _that.isSpinShow = false;
                    }
                });
            },

            // 添加员工
            employeeList() {

            },
            addemSearch() {
                this.addem_page = 1;
                this.loadEmployeeList(this.addemName)
            },

            // 日志
            logInfo(data) {

                this.log_account = data.account || data;
                let params = {
                    "account": data.account || data,
                    "current": this.log_page,
                    "rowCount": this.log_pagesize
                };

                this.$http.post('/tbMultipleNodeAccount/queryTbMultipleNodeAccountLogBypage', params).then((resp) => {
                    let data = resp.data;
                    console.log(data.data.data);
                    if (data.success) {
                        this.log_total = data.data.total;
                        this.log_data = data.data.data;
                        this.log_modal = true;
                    } else {
                        this.log_data = [];
                    }
                });
            },
            reset() {
                this.treeSarch = false;
                this.showbtn = false;

                this.searchTreeUser = ""
                this.searchTreeHigherLevel = ""
                //this.getUserInfoByDpId(this.nodeIdForSearch);
            },
            changeLevel() {
                this.levelStats = !this.levelStats;
                let drive = true;
                //this.$emit('canDrive',drive);

                var treeObj = $.fn.zTree.getZTreeObj("bussinessTree");
                treeObj.cancelSelectedNode();
            },
            cancelChangeLeveal() {
                this.levelStats = !this.levelStats;
                let drive = false;
                // this.$emit('canDrive',drive);
            },
            saveLevalChange() {
                // this.$emit('saveChange');
                this.cancelChangeLeveal();
                var treeObj = $.fn.zTree.getZTreeObj("bussinessTree");
                treeObj.cancelSelectedNode();

            },
            cancelDel() {
                this.deleteModal = false;
            },
            cancelTip() {
                this.infoModal = false;
            },
            canceldropMessage() {
                this.dropMessage = false;
            },
            prev() {
                this.index--;
                let o = {
                    index: this.index,
                    treeSarch: true,
                    searchTreeUser: this.searchTreeUser
                };
                if (this.index > 0 || this.index == 0) {
                    this.$emit('prev', o);
                } else {
                    this.dropMessage = true;
                    this.infoModalText = '没有上一个';
                    this.index = 0;
                }
            },
            next() {
                this.index++;
                let params = {
                    index: this.index,
                    treeSarch: true,
                    searchTreeUser: this.searchTreeUser
                };
                if (this.index > this.nodeLength - 1) {
                    this.dropMessage = true;
                    this.infoModalText = '没有下一个';
                    this.index = this.nodeLength - 1;
                } else {
                    this.$emit('next', params);
                }
            },

            // 新添加
            getMan(treeNode) {
                console.log(treeNode, '添加，获取到的树节点');
                this.currentNodeData = treeNode;
                this.leaderSelected = {
                    cnName: "",
                    domainAccount: "",
                },
                    this.getNodeType(treeNode);

            },
            changePage_man(c) {
                this.current_man = c;
                this.$nextTick(() => {
                    this.getMan();
                })

            },
            pageSizeChange_man(s) {
                this.current_man = 1;
                this.pageSize_man = s;
                this.$nextTick(() => {
                    this.getMan();
                })

            },
            search_man() {
                this.current_man = 1;
                this.$nextTick(() => {
                    this.getMan();
                })

            },
            man_ok(index) {
                let data = this.roleData[index];
                let nodeName = data.cnName;
                let sourceId = data.domainName;
                this.$emit('man_ok', this.parentNode, nodeName, sourceId, 1);
            },

            // 编辑
            getBumen(treeNode) {
                console.log(treeNode, '编辑，获取到的树节点');
                this.currentNodeData = treeNode;
                this.formValidate.man = this.currentNodeData.chargeAccount
                let params = {
                    nodeCode: treeNode.id
                };

                this.$http.post('/tbMultipleNode/getmodifyTbMultipleNodeData', params).then((resp) => {
                    let data = resp.data;
                    if (data.success) {
                        /*this.total_bumen = data.data.total;
                        this.pageSize_bumen = data.data.pageSize;*/

                        this.getNodeType(data.data, 'isEdit');

                    }
                });
            },
            getNodeType(data, isEdit) {

                this.cityList = [];
                this.searchName = "";
                this.employeeInfo = {};
                this.employeeInfoed = {};

                //this.$refs['formValidate'].resetFields();

                if (isEdit !== "isEdit") {
                    //新增
                    if (data.nodeType < 4) {
                        this.cityList = [this.ruleLivelList[data.nodeType]];

                    } else if (data.nodeType === 4) {

                        this.cityList = [this.ruleLivelList[4], this.ruleLivelList[5]];
                    } else if (data.nodeType === 5) {

                        this.cityList = [this.ruleLivelList[5]];
                    } else {
                        this.cityList = [];
                    }
                    ;
                    this.$nextTick(() => {
                        this.formValidate.type = this.cityList[0].label;

                        this.formValidate.name = "";
                        this.formValidate.treeId = "";
                        this.formValidate.alixID = "";
                        this.formValidate.man = "";
                        this.leaderSelected = {
                            cnName: "",
                            domainAccount: ""
                        }
                    });
                } else {
                    //编辑
                    console.log(isEdit, 'isEdit===isEidt 当前状态为编辑状态');
                    this.formValidate.type = "";
                    if (data.nodeType - 1 < 4) {
                        this.cityList = [this.ruleLivelList[data.nodeType - 1]];

                    } else if (data.nodeType - 1 === 4) {

                        this.cityList = [this.ruleLivelList[4], this.ruleLivelList[5]];
                    } else if (data.nodeType - 1 === 5) {

                        this.cityList = [this.ruleLivelList[5]];
                    } else {
                        this.cityList = [];
                    }
                    ;
                    this.$nextTick(() => {


                        this.formValidate.type = this.ruleLivelList[data.nodeType - 1].label || this.cityList[0].label;

                        this.formValidate.name = data.nodeName;
                        this.formValidate.treeId = data.administrativeTreeId;
                        this.formValidate.alixID = data.alixId;
                        this.formValidate.man = data.chargeName;

                        /*let accountData = {
                            cnName: data.chargeName,
                            domainAccount: data.chargeAccount,
                            chargeAccount: data.chargeAccount,
                            chargeName:data.chargeName
                        }
                        this.$set(this.leaderSelected,accountData);*/
                        this.leaderSelected = {
                            cnName: data.chargeAccount,
                            domainAccount: data.chargeAccount,
                            chargeAccount: data.chargeAccount,
                            chargeName: data.chargeName
                        }
                    });
                }


            },
            changePage_bumen(c) {
                this.current_bumen = c;
                this.$nextTick(() => {
                    this.getBumen();
                })
            },
            pageSizeChange_bumen(s) {
                this.current_bumen = 1;
                this.pageSize_bumen = s;
                this.$nextTick(() => {
                    this.getBumen();
                })
            },
            search_bumen() {
                this.current_bumen = 1;
                this.$nextTick(() => {
                    this.getBumen();
                })
            },
            bumen_ok(index) {
                let data = this.bumenData[index];
                let arr = [];
                let nodeName = '';
                if (data.name) {
                    arr = data.name.split('-');
                    nodeName = arr[arr.length - 1];
                }
                let sourceId = data.departmentId;
                this.$emit('man_ok', this.parentNode, nodeName, sourceId, 2);
            },
            getMultipleTree(fn) {
                fn && fn();
                this.isEmSelected = false;
                /*let params = {
                    "dimensionCode": "DM00000003"
                }
                this.$http.post('/tbMultipleNode/tbMultipleNodeTree',params).then(resp=>{
                    if(resp.data.success){
                        this.ztreeData = resp.data.data;
                        fn && fn();
                    }else{
                        this.$Message.error(resp.data.errorMessage || "请求失败")
                    }
                    this.isEmSelected = false;
                })*/
            },
            remoteMethod2(query) {
                if (query !== '') {
                    this.loading2 = true;

                    clearTimeout(this.timer);

                    this.handleTime = new Date().getTime();

                    let params = {
                        "status": false,
                        "accountName": query
                    }

                    this.timer = setTimeout(() => {
                        if (new Date().getTime() - this.handleTime >= 500) {
                            this.$http.post('/tbMultipleNodeAccount/getHigherUsers', params).then((resp) => {
                                if (resp.data.success) {
                                    if(resp.data.data.length===0){

                                        this.loading2 = false;
                                    }else{
                                        this.optionsList = resp.data.data;
                                        this.loading2 = false;
                                    }
                                    //this.searchName = resp.data.data[0].Paccount_name
                                } else {
                                    // this.$Message.error(resp.data.errorMessage || "请求错误");
                                }
                                ;
                            })
                        }
                    }, 500);

                } else {
                    this.optionsList = [];
                }
            },
            SelectedEvent2(name) {

                this.optionsList.map(item => {
                    if (item.account_name === name) {
                        this.employeeInfoed = item
                    }
                });

            },
            // 业务归属
            getBusiAscList(fn) {
                this.$http.post('/enum/getBusinessAscription').then(resp => {
                    if (resp.data.success) {
                        let datas = resp.data.data;
                        this.busiAscList = datas;
                        fn && fn();
                    }
                })
            },

        // 修改店面按钮
        returnBtns(){

            //channel3:multipleNode:lockOrunLock
            //channel3:multipleNode:addPersonnel
            //channel3:multipleNode:batchUpdatePersonnel
            //channel3:multipleNode:UpdatePersonnel
            let arr = [
                {"system":"channel3","page":"multipleNode","element":"lockOrunLock"},//解锁和锁定
                {"system":"channel3","page":"multipleNode","element":"addPersonnel"},//添加人员
                {"system":"channel3","page":"multipleNode","element":"batchUpdatePersonnel"},//批量修改
                {"system":"channel3","page":"multipleNode","element":"UpdatePersonnel"},//单独修改

            ];

            this.$ajax.post('/user/permissions?t='+new Date().getTime(),arr).then(resp => {
                if (resp.data.success) {
                    this.isBranchModifyEmployee = resp.data.data.batchUpdatePersonnel || false;
                    this.isAddEmployee = resp.data.data.addPersonnel || false;
                    this.isChangeLevel = resp.data.data.lockOrunLock || false;
                    this.isSingleModify = resp.data.data.UpdatePersonnel || false;
                }
            })
        },
        getBusiTypeList(fn){
            this.$http.post('/enum/getAccountThreeClass').then(resp=>{
                if(resp.data.success){
                    let datas = resp.data.data;
                    this.busiTypeList = datas;
                    fn && fn();
                }
            })
        }
     },
        components: {
            // vblLoading
        },
        mounted() {

            this.returnBtns()
        }
    };
</script>

<style type="text/css">

    @import './vblTree.css';
    @import './util.css';
    @import './businessTree.less';
    @import './salesTree.css';

    .floatRight {
        float: right;

    }

    .colord {
        color: #1D86F4;
    }

    /*.ivu-tabs-content{
       height:auto!important;
    }*/
    .ztree-style {
        position: absolute;
        left: 0;
        top: 0;
        width: 250px;
        border-radius: 4px;
        background: #FFF;
        max-height: 200px;
        overflow: auto;
    }

    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .demo-spin-col {
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>