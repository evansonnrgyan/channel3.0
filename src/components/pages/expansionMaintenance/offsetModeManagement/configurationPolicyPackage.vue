<!-- 抵放模式政策包配置 -->
<template>
    <div class="configuration-policy-package">
        <div class="channels-common-body">
            <div class="channels-common-body-button font-right paddingtop7">
                <Button type="primary" size="large" @click="addConfiguration">新增政策</Button>
            </div>
            <Table border :columns="columns" :data="data" :loading="tloading"></Table>
        </div>
        <Modal
                v-model="modal.isShow"
                :styles="{top: '0px'}"
                width="1000px"
                :mask-closable=false
                class-name="vertical-center-modal"
                :title="(!!modifyForId)?'修改政策':'新增政策'">
            <div>政策条件</div>
            <div class="packageClass">
                <Form ref="formData" :model="formData" :label-width="0">
                    <row class="padding5" v-for="(item,indx) in formData.conditionList">
                        <Col span="3" v-if="item[0].attrs.name==='firstSubject'" class="font-right paddingtop7"
                             style="position: relative;left:10px;text-align: right"><span style="display:inline-block;color:#ed4014;margin-right:4px;">*</span>{{item[0].attrs.title}}
                            <div v-if="isChanneltStatus" style="float:right;width:59px;color:#ed4014">渠道科目不能为空</div>
                        </Col>
                        <Col span="21">
                            <Row v-for="(subItem, index) in item">
                                <Col span="3" v-if="item[0].attrs.name!=='firstSubject'" class="font-right"
                                     style="width: 72px; padding: 6px 10px 0 0;">&nbsp;
                                </Col>
                                <Col span="1" v-else style="width:20px">&nbsp;</Col>
                                <Col span="21">
                                    <FormItem
                                            :key="index"
                                            :label="subItem.name"
                                            :prop="'conditionList.'+indx+'.'+index+'.checkedValueList'"
                                            :rules="[{required: (item[0].attrs.name==='firstSubject'?false:true), message: subItem.name+'不能为空', type: 'array', trigger: 'change'}]">
                                        <CheckboxGroup v-model="subItem.checkedValueList" @on-change="checkboxGroupEvent">
                                            <Checkbox v-for="items in subItem.childFieldList" :label="items.value"
                                                      :key="items.value">{{items.name}}
                                            </Checkbox>
                                        </CheckboxGroup>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </row>
                </Form>
            </div>

            <!--合作项目-->
            <!--<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="141">-->
                <Row>
                    <Col span="3" class="font-right" style="width:135px">合作项目</Col>
                    <Col span="18" style="position: relative;">
                        <!--<FormItem label="合作项目" prop="model1">-->
                            <Select
                                    v-model="formValidate.model1"
                                    filterable
                                    remote
                                    :remote-method="remoteMethod1"
                                    :loading="loading1"
                                    @on-change="getCooperationData"
                                    placeholder="请输入查询的内容"
                                    style="width:306px;">
                                <Option v-for="(option, index) in options1" :value="option.cooperationName"
                                        :key="index">{{option.cooperationName}}</Option>
                            </Select>
                        <!--</FormItem>-->
                    </Col>
                </Row>

                <Divider class="clearboth"/>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="141">
                <Row style="padding: 0 0 10px 0">
                    <Col span="12">
                        <Row>
                            <Col span="24">
                                <FormItem label="政策名称" prop="policyName">
                                    <Input v-model.trim="formValidate.policyName" :maxlength="20" placeholder="政策名称" style="width: 300px"/>
                                    <limitLength :value="formValidate.policyName" :max="20" />
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                    <Col span="12">
                        <Row>
                            <Col span="24">
                                <FormItem label="新车是否先抵后放" prop="newOffsetModeValue">
                                    <RadioGroup v-model="formValidate.newOffsetModeValue">
                                        <Radio label="1">是</Radio>
                                        <Radio label="0">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style="padding:0">
                    <Col span="12">
                        <Row>
                            <Col span="24">
                                <FormItem label="政策优先级" prop="policyLevel">
                                    <Input v-model.trim="formValidate.policyLevel" placeholder="政策优先级" style="width: 300px"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                    <Col span="12">
                        <Row>
                            <Col span="24">
                                <FormItem label="二手车是否先抵后放" prop="usedOffsetModeValue">
                                    <RadioGroup v-model="formValidate.usedOffsetModeValue">
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
                <Button type="primary" @click="submit('formData')">提交</Button>
            </div>
        </Modal>

        <Modal
               :mask-closable=false
               v-model="modalDefault"
               width="400px"
               class-name="vertical-center-modal"
               @on-ok="defaultOk"
               title="默认抵放政策">
            <Form ref="defaultValidate" :model="defaultValidate" :rules="defaultRuleValidate" :label-width="150">
                <FormItem label="新车是否先抵后放" prop="newOffsetModeValue">
                    <RadioGroup v-model="defaultValidate.newOffsetModeValue">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="二手车是否先抵后放" prop="usedOffsetModeValue">
                    <RadioGroup v-model="defaultValidate.usedOffsetModeValue">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </Modal>

        <Modal
               v-model="del.isShow"
               width="300px"
               class-name="vertical-center-modal"
               :mask-closable=false
               @on-ok="delOk"
               title="删除">
            确认删除？
        </Modal>

    </div>
</template>

<script>
    export default {
        data() {
            let numberReg = /^[1-9]\d*$/;

            const numberValidate = (rule, value, callback) => {
                if (!numberReg.test(value)) {
                    callback(new Error('只支持大于0的整数'));
                } else {
                    callback();
                }
            };
            return {
                tloading:false,
                handleTime: "",
                modalDefault: false,
                // 渠道枯木是否选择了装填
                isChanneltStatus: false,
                // 新添加 选中的合作项目
                selectCooperationData: {
                    cooperationCode: "",
                    cooperationName: ""
                },
                // 修改配置id
                modifyForId: "",
                //政策条件
                formData: {
                    conditionList: [],
                },
                formValidate: {
                    model1: "",
                    policyName: "",
                    policyLevel: "",
                    newOffsetModeValue: "",
                    usedOffsetModeValue: "",
                },
                ruleValidate: {
                    model1: [{required: true, message: '合作项目不能为空', trigger: 'change'}],
                    policyName: [{required: true, message: '政策名称不能为空', trigger: 'blur'}],
                    policyLevel: [{required: true, validator: numberValidate, trigger: 'blur'}],
                    newOffsetModeValue: [{required: true, message: '新车是否先抵后放不能为空', trigger: 'change'}],
                    usedOffsetModeValue: [{required: true, message: '二手车是否先抵后放不能为空', trigger: 'change'}]
                },
                // 默认
                defaultValidate: {
                    newOffsetModeValue: "",
                    usedOffsetModeValue: ""
                },
                defaultRuleValidate: {
                    newOffsetModeValue: [{required: true, message: '新车是否先抵后放不能为空', trigger: 'blur'}],
                    usedOffsetModeValue: [{required: true, message: '二手车是否先抵后放不能为空', trigger: 'blur'}]
                },
                model1: '',
                loading1: false,
                options1: [],
                modal: {
                    isShow: false,
                    conditionList: [],
                    resultList: [],
                    checkedValueList: [],
                    //合作项目
                    loading1: false,
                    cooperationProjectId: "",
                    cooperationProjectList: []
                },
                //删除
                del: {
                    isShow: false,
                    id: ""
                },
                columns: [
                    {
                        title: '政策名称',
                        key: 'policyName',
                        width: 120
                    },
                    {
                        title: '适配条件',
                        key: 'configuration',
                        width: 300,
                        render: (h, params) => {
                            let data = params.row;
                            let configurationVal = data.firstSubject + ',' + data.secondSubject + ',' + data.busiType + ',' + data.vehicleSource;
                            return h('div', [
                                h('div', data.setDefault ? "无" : configurationVal)
                            ]);
                        }
                    },
                    {
                        title: '新车是否先抵后放',
                        key: 'newOffsetModel',
                        width: 140,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                }, !params.row.newOffsetModel?"":params.row.newOffsetModel === "1"? "是" : "否")
                            ]);
                        }

                    },
                    {
                        title: '二手车是否先抵后放',
                        key: 'usedOffsetModel',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                }, !params.row.usedOffsetModel?"":params.row.usedOffsetModel === "1" ? "是" : "否")
                            ]);
                        }
                    },
                    {
                        title: '优先级',
                        key: 'priority',
                        width: 116,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {}, params.row.priority?params.row.priority:"0")
                            ]);
                        }
                    },
                    {
                        title: '是否默认',
                        key: 'setDefault',
                        width: 130,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                }, params.row.setDefault === true ? "是" : "否")
                            ]);
                        }
                    },
                    {
                        title: '更新人',
                        key: 'updateName',
                        width: 80
                    },
                    {
                        title: '更新时间',
                        key: 'updateTime',
                        minWidth: 180
                    },
                    {
                        title: '操作',
                        key: 'option',
                        fixed: 'right',
                        width: 160,
                        render: (h, params) => {
                            var _this = this;
                            if (params.row.setDefault === true) {
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
                                            click() {
                                                _this.modifyConfiguration(params.row);
                                            }
                                        }
                                    }, '修改配置')
                                ]);
                            } else {
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
                                            click() {
                                                _this.modifyConfiguration(params.row);
                                            }
                                        }
                                    }, '修改配置'),
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        style: {
                                            color: "#2d8cf0"
                                        },
                                        on: {
                                            click() {
                                                _this.deleteConfiguration(params.row);
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }

                        }
                    }
                ],
                data: [],
                //抵放模式管理主页分页
                page: {
                    current: 1,
                    total: 0,
                    pageSize: 10
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //this.$Message.success('Success!');
                    } else {
                        //this.$Message.error('Fail!');
                    }
                })
            },
            //加载列表
            loadList() {
                let params = {
                    current: this.page.current,
                    rowCount: this.page.pageSize
                };
                this.tloading = true;
                this.$http.post('/tbExpOffsetMode/getTbExpOffsetModeList', params).then(resp => {
                    if (resp.data.success) {
                        this.tloading = false;
                        if (resp.data.data.length > 0) {
                            this.page.total = resp.data.total;
                            this.data = resp.data.data;
                        } else {
                            this.page.total = 0;
                            this.data = [];
                            //this.$Message.warning('暂无数据');
                        }
                    } else {
                        //this.$Message.error(resp.data.errorMessage || '请求错误');

                    }
                })
            },
            // 提交默认政策
            defaultOk() {

                let params = {
                    "id": this.modifyForId,
                    "newOffsetModel": this.defaultValidate.newOffsetModeValue,
                    "usedOffsetModel": this.defaultValidate.usedOffsetModeValue

                }
                this.$http.post('/tbExpOffsetMode/updateOmPolicy', params).then(resp => {
                    if (resp.data.success) {
                        this.modifyForId = "";
                        this.$Message.success("修改成功");
                        this.page.current = 1;
                        this.loadList();
                    } else {
                        //this.$Message.error(resp.data.errorMessage || "修改失败");
                    }
                });
            },
            //新增政策
            addConfiguration() {
                console.log('新增政策包');
                this.loadOptionList();
            },
            //修改当前配置
            modifyConfiguration(data) {
                console.log("修改政策包");
                this.resetForm();
                if (data.setDefault) {

                    this.modalDefault = true;

                    let params = {
                        id: data.id
                    }
                    this.modifyForId = data.id;
                    this.defaultValidate.newOffsetModeValue = data.newOffsetModel;
                    this.defaultValidate.usedOffsetModeValue = data.usedOffsetModel;

                } else {
                    this.loadOptionList(data);
                }
            },
            //删除当前配置
            deleteConfiguration(data) {
                this.del.isShow = true;
                this.del.id = data.id;
            },
            delOk() {
                let params = {
                    id: this.del.id
                }

                this.$http({
                    method: 'post',
                    url: '/tbExpOffsetMode/deleteTbExpOffsetMode',
                    data: params,
                }).then((resp) => {
                    this.del.isShow = false;
                    this.$Message.success('删除成功');
                    this.page.current = 1;
                    this.loadList();
                });
            },
            // 获取选中的合作项目
            getCooperationData(data) {
                let datas = this.options1.filter((item) => data === item.cooperationName);
                this.selectCooperationData = datas[0];
            },
            //添加或者修改的提交
            submit() {

                let state1 = false;
                let state2 = false;

                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        state1 = true;
                    } else {
                        state1 = false;
                    }
                });

                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        state2 = true;
                    } else {
                        state2 = false
                    }
                });



                console.log(this.modifyForId, '有值修改，无值新增');

                let params = {};

                if (this.modifyForId) {
                    params = {
                        id: this.modifyForId,
                        "channelsubject": {},
                        "busiType": "",
                        "vehicleSource": "",
                        "cooperationName": this.selectCooperationData.cooperationName,
                        "cooperationCode": this.selectCooperationData.cooperationCode,
                        "policyName": this.formValidate.policyName,
                        "priority": this.formValidate.policyLevel,
                        "newOffsetModel": this.formValidate.newOffsetModeValue,
                        "usedOffsetModel": this.formValidate.usedOffsetModeValue
                    };
                } else {
                    params = {
                        "channelsubject": {},
                        "busiType": "",
                        "vehicleSource": "",
                        "cooperationName": this.selectCooperationData.cooperationName,
                        "cooperationCode": this.selectCooperationData.cooperationCode,
                        "policyName": this.formValidate.policyName,
                        "priority": this.formValidate.policyLevel,
                        "newOffsetModel": this.formValidate.newOffsetModeValue,
                        "usedOffsetModel": this.formValidate.usedOffsetModeValue
                    };
                }
                ;

                this.formData.conditionList.map((item, index) => {

                    if (index === 0) {
                        //渠道科目
                        item.map((items, indx) => {
                            params.channelsubject[items.value] = items.checkedValueList.join(',');
                        })

                    } else if (index === 1) {
                        //业务类型
                        params.busiType = item[0].checkedValueList.join(',');

                    } else if (index === 2) {
                        //车辆来源
                        params.vehicleSource = item[0].checkedValueList.join(',');
                    }
                });

                let values = Object.values(params.channelsubject);
                let flag = false;

                for(let i=0;i<values.length;i++){
                    if(values[i]){
                        this.isChanneltStatus = false;
                        flag = true;
                        break;
                    }else{
                        flag = false;
                        this.isChanneltStatus = true;
                    }
                };

                if(!flag){
                    return false;
                }


                if (state1 && state2 && flag) {
                    console.log(params, '抵放模式政策包入参');

                    this.$http.post((!!this.modifyForId) ? '/tbExpOffsetMode/modifyOffsetPolicy' : '/tbExpOffsetMode/addOffsetPolicy', params).then(resp => {

                        if (resp.data.success) {
                            this.$Message.success("保存成功");
                            this.modal.isShow = false;
                            //清空初始化表单
                            this.$refs['formData'].resetFields();
                            this.$refs['formValidate'].resetFields();
                            this.page.current = 1;
                            this.loadList();
                        } else {
                            //this.$Message.error(resp.data.errorMessage || "保存失败")
                        }
                    })

                } else {
                    this.$Message.error("必填项不能为空");
                }

            },
            //合作项目
            remoteMethod1(query) {
                if (query !== '') {
                    this.modal.loading1 = true;

                    let params = {
                        "cooperationName": query
                    }
                    this.handleTime = new Date().getTime();

                    setTimeout(() => {
                        if (new Date().getTime() - this.handleTime > 500) {

                            this.$http.post('/channelCooperation/queryCooperationName', params).then(resp => {
                                this.loading1 = false;
                                if (resp.data.success) {
                                    console.log(resp.data.data);
                                    if (resp.data.data.length > 0) {
                                        this.options1 = resp.data.data;
                                    } else {
                                        this.options1 = [];
                                        //this.$Message.warning("没有可用的搜索内容");
                                    }
                                } else {
                                    //this.$Message.error("请求错误");
                                }

                            });
                        }
                    }, 500);
                } else {
                    this.modal.options1 = [];
                }
            },
            //抵放模式管理列表页
            changePageNumber(number) {
                this.page.current = number;
                this.loadList();
            },
            changePageSize(number) {
                this.page.pageSize = number;
                this.loadList();
            },
            loadOptionList(propDatas) {
                let params = {};
                this.handleSpinCustom();

                this.$http.post('/tbExpOffsetMode/initBusinessPackage', params).then(resp => {

                    this.formData.conditionList = [];

                    let datas = resp.data.data.fieldList;
                    console.log(datas, '动态政策条件列表');

                    //渠道科目
                    let firstSubject = [];
                    //业务类型
                    let busiClass = [];
                    //租赁属性
                    let rentAttribute = [];
                    //车辆来源
                    let vehicleFrom = [];

                    if (propDatas) {
                        //编辑
                        console.log(propDatas, '传参');

                        let params = {
                            id: propDatas.id,
                        };

                        this.modifyForId = propDatas.id;

                        this.$http.post('/tbExpOffsetMode/getExpOffsetPolicyById', params).then(resp => {
                            if (resp.data.success) {
                                let dataParams = resp.data.data;
                                /*let dataParams = {
                                    "firstSubject": {
                                        "04970002": "0497000200000,0497000200007,0497000200001,0497000200002",
                                        "04970003": "0497000300000",
                                        "04970000": "0497000000000,0497000000001",
                                        "04970001": "0497000100000"
                                    },
                                    "busiType": "0130000100000,01300000,0130000200000",
                                    "vehicleType": "049400001,049400000"
                                };*/
                                datas.map(item => {
                                    //console.log(item);
                                    switch (item.code) {
                                        case "firstSubject":
                                            item.attrs = {
                                                name: "firstSubject",
                                                title: "渠道科目"
                                            };
                                            Object.keys(dataParams.channelsubject).forEach(key => {
                                                if (item.value === key) {
                                                    item.checkedValueList = dataParams.channelsubject ? this.removeAllSpace(dataParams.channelsubject[key]).split(',') : [];
                                                }
                                            });
                                            firstSubject.push(this.matchSelect(item));
                                            break;
                                        case "busiClass":
                                            item.attrs = {
                                                name: "busiClass",
                                                title: "业务类型"
                                            };
                                            item.checkedValueList = dataParams.busiType ? this.removeAllSpace(dataParams.busiType).split(',') : [];
                                            busiClass.push(this.matchSelect(item));
                                            break;
                                        case "vehicleFrom":
                                            item.attrs = {
                                                name: "vehicleFrom",
                                                title: "车辆来源"
                                            };

                                            item.checkedValueList = dataParams.vehicleSource ? this.removeAllSpace(dataParams.vehicleSource).split(',') : [];
                                            vehicleFrom.push(this.matchSelect(item));
                                            break;
                                        default :
                                            break;
                                    }
                                });

                                this.modal.isShow = true;
                                // 政策条件

                                this.formData.conditionList.push(firstSubject);
                                this.formData.conditionList.push(busiClass);
                                this.formData.conditionList.push(vehicleFrom);

                                this.$nextTick(() => {
                                    //dataParams 返显操作

                                    // 合作项目
                                    this.formValidate.model1 = dataParams.cooperationName;
                                    this.selectCooperationData = {
                                        cooperationName: dataParams.cooperationName,
                                        cooperationCode: dataParams.cooperationCode
                                    };

                                    // 政策名称
                                    this.formValidate.policyName = dataParams.policyName;

                                    // 政策优先级
                                    this.formValidate.policyLevel = dataParams.priority;

                                    // 新车是否先抵后放
                                    this.formValidate.newOffsetModeValue = dataParams.newOffsetModel;

                                    // 二手车是否先抵后放
                                    this.formValidate.usedOffsetModeValue = dataParams.usedOffsetModel;

                                    this.$Spin.hide();
                                })

                            } else {
                                this.$Message.error(resp.data.errorMessage || "请求失败");
                            }
                        });


                    } else {
                        //新增
                        //初始化修改配置id
                        this.modifyForId = "";

                        datas.map(item => {
                            //console.log(item);
                            switch (item.code) {
                                case "firstSubject":
                                    item.attrs = {
                                        name: "firstSubject",
                                        title: "渠道科目"
                                    };
                                    firstSubject.push(this.matchSelect(item));
                                    break;
                                case "busiClass":
                                    item.attrs = {
                                        name: "busiClass",
                                        title: "业务类型"
                                    };
                                    busiClass.push(this.matchSelect(item));
                                    break;
                                case "vehicleFrom":
                                    item.attrs = {
                                        name: "vehicleFrom",
                                        title: "车辆来源"
                                    };
                                    vehicleFrom.push(this.matchSelect(item));
                                    break;
                                default:
                                    break;
                            }
                        });

                        this.formData.conditionList.push(firstSubject);
                        this.formData.conditionList.push(busiClass);
                        this.formData.conditionList.push(vehicleFrom);

                        this.$refs['formData'].resetFields();
                        this.$refs['formValidate'].resetFields();

                        this.$Spin.hide();

                        this.modal.isShow = true;

                        this.formData.conditionList = this.formData.conditionList.map((item) => {
                            item.map((items) => {
                                items.checkedValueList = [];
                                return items;
                            })
                            return item;
                        });
                    }

                })
            },
            matchSelect(obj) {
                return obj;
            },
            checkboxGroupEvent() {
                console.log(this.formData);
                console.log(this.formData.conditionList)
            },
            // 删除多余空格
            removeAllSpace(str) {
                return str.replace(/\s+/g, "");
            },
            handleSpinCustom() {
                this.$Spin.show();
            },
            // 初始化表单验证
            resetForm(){
                this.$refs['formData'].resetFields();
                this.$refs['formValidate'].resetFields();
            }
        },
        watch: {
            conditionList: {
                handler: function (val) {
                    this.modal.resultList = [...val[0], ...val[1], ...val[2], ...val[3]];
                    console.log(this.modal.resultList)
                },
                deep: true
            }
        },
        mounted() {

            this.loadList();
        }
    }
</script>

<style>
    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .padding5 {
        padding: 0;
    }

    .paddingtop7 {
        padding-top: 7px;
    }

    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    .packageClass .ivu-form-item-label{
        width:auto!important;
    }
</style>
