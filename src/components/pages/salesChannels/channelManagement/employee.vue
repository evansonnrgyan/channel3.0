<!-- 负责员工 -->
<template>
    <div style="margin:-15px -30px;position:relative">
        <div style="position: absolute;right: 30px;top: 5px;" v-if="edit">
            <Button v-if="isAddNewEmployee" type="primary" size="large" @click="addNewEmployee">新增负责员工</Button>
        </div>

        <commonTitle title="当前负责员工">
            <tableAndPage ref="table1" url="/tbChargerInfo/selectChargerCurrent" :columns="columns"
                          :params="{channelId: params}"/>
        </commonTitle>


        <commonTitle title="历史负责员工">
            <tableAndPage ref="table2" url="/tbChargerInfo/selectChargerHistory" :columns="columns1"
                          :params="{channelId: params}"/>
        </commonTitle>


        <!--新增负责员工-->
        <Modal
                v-model="modal"
                title="新增负责员工">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="200">
                <Row>
                    <Col span="24">
                        <FormItem label="请输入员工姓名进行模糊查询" prop="selectedValue">
                            <Select
                                    v-model="formValidate.selectedValue"
                                    filterable
                                    remote
                                    :remote-method="remoteMethod1"
                                    @on-change="changeSelect"
                                    :loading="loading1">
                                <Option v-for="item in options1" :value="item.ID" :key="item.ID">{{item["account_name"]}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col span="24">
                        <Row>
                            <Col class="font-right" span="4">姓名</Col>
                            <Col span="20">{{selectNewEmployee["account_name"]}}</Col>
                        </Row>
                        <Row>
                            <Col class="font-right" span="4">职位</Col>
                            <Col span="20">{{selectNewEmployee["post_title"]}}</Col>
                        </Row>
                        <Row>
                            <Col class="font-right" span="4">所属机构</Col>
                            <Col span="20">{{selectNewEmployee["node_name"]}}</Col>
                        </Row>
                        <Row>
                            <Col class="font-right" span="4">上级姓名</Col>
                            <Col span="20">{{selectNewEmployee["higher_account_name"]}}</Col>
                        </Row>
                        <Row>
                            <Col class="font-right" span="4">业务归属</Col>
                            <Col span="20">
                                {{selectNewEmployee["business_ascription"]?selectNewEmployee["business_ascription"]:""}}
                            </Col>
                        </Row>
                        <!--<Row>
                          <Col span="24" style="position: relative;left:-111px;">
                            <FormItem label="授权业务" prop="adduthorType">
                              <CheckboxGroup v-model="formValidate.adduthorType">
                                <Checkbox v-for="item in adduthorTypeList" :label="item.key" :key="item.key">{{item.value}}</Checkbox>
                              </CheckboxGroup>
                            </FormItem>
                          </Col>
                        </Row>-->
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button :loading="loading" type="primary" @click="addOk('formValidate')">确定</Button>
                <Button @click="addCancel('formValidate')">取消</Button>
            </div>
        </Modal>
        <!--修改授权-->
        <Modal
                v-model="modal1"
                class-name="vertical-center-modal"
                title="修改授权">
            <Row>
                <Col span="24">
                    修改<b>{{employeeName}}</b>的授权业务为：
                </Col>
                <Col span="24">
                    <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="80">
                        <FormItem label="授权业务" prop="adduthorType1">
                            <CheckboxGroup v-model="formValidate1.adduthorType1">
                                <Checkbox v-for="item in adduthorTypeList1" :label="item.key" :key="item.key">{{item.value}}</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="modifyOk('formValidate1')">确定</Button>
                <Button @click="modifyCancel('formValidate1')">取消</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    export default {
        name: "employeeManagement",
        props: ["params", "edit"],
        data() {
            return {
                loading: false,
                isAddNewEmployee: false,
                isStopButton: false,

                columns_one: [],
                handleTime: "",
                modal: false,
                modal1: false,
                title: " 当前负责员工",
                title1: "历史负责员工",
                employeeName: "",
                addAuthorType: [],
                authorType: [],
                loading1: false,
                selectedValue: "",
                selectNewEmployee: {},
                currentEmployee: {},
                options1: [],
                adduthorType: [],
                adduthorTypeList: [],
                adduthorTypeList1: [],
                timer:null,
                columns: [
                    {
                        title: "姓名",
                        key: "chargerName",
                        width: 100,
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "在职状态",
                        key: "positionStatus",
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('span', params.row.positionStatus === "0" ? "离职" : "在职")
                            ]);
                        }
                    },
                    {
                        title: "职位",
                        key: "postTitle",
                    },
                    {
                        title: "所属部门",
                        key: "departmentName",
                        tooltip:true,
                        ellipsis: true,
                    },
                    {
                        title: "业务上级",
                        key: "higerAccountName",
                        tooltip:true,
                        ellipsis: true,
                    },
                    {
                        title: "业务归属",
                        key: "businessAscription",
                        tooltip:true,
                        ellipsis: true,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width:80,
                        // fixed: 'right',
                        render: (h, params) => {
                            if (!this.edit) return
                            return h('div', [
                                h('span', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        color: '#2d8cf0',
                                        cursor: 'pointer',
                                        display:(!this.isStopButton?'none':'inline-block')
                                    },
                                    on: {
                                        click: () => {
                                            if(!this.isStopButton){
                                                return false;
                                            }
                                            this.stopAuthor(params.row)
                                        }
                                    }
                                }, this.isStopButton?'停用':'')/*,
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
                                      this.modifyAuthor(params.row);
                                      this.formValidate1.adduthorType1 = params.row.busiClassCode.split(',');
                                    }
                                  }
                                }, '修改授权')*/
                            ]);
                        }
                    }
                ],
                data: [],
                columns1: [
                    {
                        title: "姓名",
                        key: "chargerName",
                        width: 100
                    },
                    {
                        title: "在职状态",
                        key: "statusName",
                        width: 100
                    },

                    {
                        title: "所属部门",
                        key: "departmentName",
                        ellipsis: true,
                        tooltip: true
                    },

                    {
                        title: "业务归属",
                        key: "businessAscription",
                        tooltip:true,
                        ellipsis: true,
                    },
                    {
                        title: "负责期间",
                        key: "empowerPersonName",
                        render: (h, params) => {
                            return h('div', [
                                h('span', params.row.resposeStartDate + '-' + params.row.resposeEndDate)
                            ]);
                        }
                    },
                    {
                        title: "授权人",
                        key: "empowerPersonName",
                        width: 100
                    }
                ],
                data1: [],
                formValidate: {
                    selectedValue: '',
                    adduthorType: []
                },
                ruleValidate: {
                    selectedValue: [
                        {required: true, message: '员工姓名不能为空', trigger: 'change'}
                    ], /*
          adduthorType: [
            { required: true, type: 'array', min: 1, message: '授权业务不能为空', trigger: 'change' }
          ]*/
                },
                formValidate1: {
                    adduthorType1: []
                },
                ruleValidate1: {
                    adduthorType1: [
                        {required: true, type: 'array', min: 1, message: '授权业务不能为空', trigger: 'change'}
                    ]
                }
            }
        },
        methods: {


            addNewEmployee() {
                this.modal = true;
                //TODO channelId params 传过来
                /*this.$http.get('/tbChannelBusiness/selectBusiClassByChannelId?channelId=' + this.params).then(resp=>{
                  if(resp.data.success){
                    this.adduthorTypeList = [];
                    Object.keys(resp.data.data).map(item=>{
                      this.adduthorTypeList.push({
                          key: item,
                          value: resp.data.data[item]
                        })
                    })
                  };
                })*/
            },
            stopAuthor(data) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认停用？</p>',
                    onOk: () => {
                        let params = {
                            "id": data.id,
                            "channelId": data.channelId
                        }
                        this.$http.post("/tbChargerInfo/stopTbChargerBusinessInfo", params).then(resp => {
                            if (resp.data.success) {
                                this.$Message.success("停用成功");
                                this.$refs.table1.reloadTable();
                                this.$refs.table2.reloadTable();

                            }
                        })
                    }
                });
            },
            modifyAuthor(data) {
                this.modal1 = true;
                this.employeeName = data.chargerName;
                this.currentEmployee = data;
                /*this.$http.get('/tbChannelBusiness/selectBusiClassByChannelId?channelId='+data.channelId).then(resp=>{

                  if(resp.data.success){
                    this.adduthorTypeList1 = [];
                    Object.keys(resp.data.data).map(item=>{
                      this.adduthorTypeList1.push({
                        key: item,
                        value: resp.data.data[item]
                      })
                    });
                  };
                })*/
            },
            addOk(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = {
                            "channelId": this.params,
                            "chargerAccount": this.selectNewEmployee["account"],
                            "chargerName": this.selectNewEmployee["account_name"],
                            "departmentName": this.selectNewEmployee["node_name"],
                            "busiClass": this.formValidate.adduthorType.join(',')
                        }

                        this.$http.post('/tbChargerInfo/createChargerInfo', params).then(resp => {
                            if (resp.data.success) {
                                this.modal = false;
                                this.$Message.success('添加成功!');


                                this.$refs.table1.reloadTable();
                                this.$refs.table2.reloadTable();


                                this.options1 = [];
                                this.$refs["formValidate"].resetFields();
                            } else {
                                //this.$Message.error(resp.data.errorMessage || "请求错误");
                            }
                            this.loading = false;
                        })
                    } else {
                        this.$Message.error('必填项不能为空!');

                    }
                })
            },
            addCancel(name) {
                this.modal = false;
                this.$refs[name].resetFields();
            },
            modifyOk(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {

                        let params = {
                            "id": this.currentEmployee.id,
                            "channelId": this.currentEmployee.channelId,
                            "busiClass": this.formValidate1.adduthorType1.join(',')
                        }

                        this.$http.post('/tbChargerInfo/updateTbChargerBusinessInfo', params).then(resp => {
                            if (resp.data.success) {
                                this.modal1 = false;
                                this.$Message.success('添加成功!');


                                this.$refs.table1.reloadTable();
                                this.$refs.table2.reloadTable();

                                this.options1 = [];
                                this.$refs[name].resetFields();
                            } else {
                                //this.$Message.error(resp.data.errorMessage || "请求错误");
                            }
                        })
                    } else {
                        this.$Message.error('必填项不能为空!');

                    }
                })
            },
            modifyCancel(name) {
                this.modal1 = false;
                this.$refs[name].resetFields();
            },
            changeSelect(ID) {
                this.selectNewEmployee = this.options1.filter((item) => item.ID === ID)[0] || {};
            },
            remoteMethod1(query) {
                clearTimeout(this.timer);
                if (query !== '') {
                    this.loading1 = true;

                    let params = {
                        accountName: query
                    }

                    this.handleTime = new Date().getTime();

                    this.timer = setTimeout(() => {
                        if (new Date().getTime() - this.handleTime >= 500) {
                            this.$http.post("/tbMultipleNodeAccount/getTbMultipleNodeAccountByName", params).then((resp) => {
                                if (resp.data.success) {
                                    this.loading1 = false;
                                    this.options1 = resp.data.data;
                                }
                                ;
                            })
                        }
                    }, 500)

                } else {
                    this.options1 = [];
                }
            },

            // 修改店面按钮
            returnBtns(){

                //brantchSettingsEmployeeEvent
                //exportChannelListEvent
                let arr = [
                    {"system":"channel3","page":"employee","element":"addNewEmployee"},//新增负责员工
                    {"system":"channel3","page":"employee","element":"stopButton"}//停用负责员工
                ];

                this.$ajax.post('/user/permissions?t='+new Date().getTime(),arr).then(resp => {
                    if (resp.data.success) {
                        this.isAddNewEmployee = resp.data.data.addNewEmployee || false;
                        this.isStopButton = resp.data.data.stopButton || false;
                    }
                })
            }
        },
        watch: {},
        mounted() {
            console.log(this.$attrs, '渠道详情页');
            this. returnBtns();
            if (!this.edit) {
                this.columns.pop();
            }

        }
    }
</script>

<style lang="less" scoped>


    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ztree-style {
        position: relative;
        border: 1px solid #ccc;
        left: 146px;
        width: 300px;
    }

    hr {
        border-top: 1px solid #e9eaec;
        border-bottom: none;
        margin: 10px 0;
    }

</style>
