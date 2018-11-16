<!-- 业务标签管理 -->
<template>
    <div>
        <Form ref="formValidate"  :model="formValidate" :rules="ruleValidate"  :label-width="130">
            <commonTitle title="业务包定义">
                <Row>
                    <Col span="12">
                        <FormItem label="定义标签名称" prop="tag">
                            <Input v-model="formValidate.tag" placeholder="请输入标签名称" class="input-width" :maxlength="6"></Input>
                            <limitLength :value="formValidate.tag" :max="6"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="关联角色" prop="role">
                            <Input v-model="formValidate.role" class="input-width" readonly placeholder="弹框内列表选择" :title="formValidate.role">
                                <Button type="primary" slot="append" @click="changeRole" class="select-button">选择</Button>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="自定义说明">
                            <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="不超过200字" style="width:85%" :maxlength="200"></Input>
                            <limitLength :value="formValidate.remark" :max="200"/>
                        </FormItem>
                    </Col>
                </Row>
            </commonTitle>

            <commonTitle title="渠道科目配置">
                <Row v-for="item in projectList">
                    <Col span="12">
                        <FormItem :label="item.name">
                            <CheckboxGroup v-model="item.checkedValueList">
                                <Checkbox :label="elem.value" v-for="elem in item.childFieldList">{{elem.name}}</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </Col>
                </Row>
            </commonTitle>

            <commonTitle title="字段包设置">
                <Table  :columns="columns_field" :data="data_field"></Table>
            </commonTitle>

            <commonTitle title="功能模块扩展">
                <Row v-for="item in otherList">
                    <Col span="12">
                        <FormItem :label="item.name">
                            <RadioGroup v-model="item.checkedValueList.join()" @on-change="changeRadio">
                                <Radio v-for="elem in item.childFieldList" :label="elem.value">{{elem.name}}</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
            </commonTitle>
        </Form>

        <poFooter>
            <Button size="large" @click="back">返回</Button>
             <Button type="primary" size="large" @click="submit">提交</Button>
        </poFooter>


        <!-- 关联角色 -->
        <Modal
        v-model="modal_Role" width="800" class-name="modal-padding" @on-ok="ok"
        title="角色列表">
        <Row>
            <h3>已选择角色</h3>
            <Tag closable v-for="item in roleArr_lin" :key="item.roleId" :name="item.role" @on-close="handleClose">{{ item.role }}</Tag>
        </Row>
        <div class="lineDiv" style="margin: 12px auto;height:1px"></div>
        <Row>
            角色名称&nbsp;
            <Input v-model="roleName" placeholder="请输入标签名称" class="input-width"></Input>
            <Button type="primary" @click="search">搜索</Button>
        </Row>
        <br>
        <Table :loading="loading" :columns="columns_role" :data="data_role" size="small"></Table>
        <Page size="small" :total="total_role" :current="current_role" :page-size="pagesize_role" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator></Page>
    </Modal>
</div>
</template>

<script>
    export default {
        name: '',
        props:{
            pid:{
                type:String,
                default:''
            },
            closeName:{
                type:String,
                default:''
            }
        },
        watch:{
            pid(nv){
                nv = nv === 'no'? '' : nv;
                this.init_Id()
            }
        },
        data() {
            // 标签名称验重
            const validatePass = (rule, value, callback) => {
                if (value === '' || !value) {
                    callback(new Error('请输入标签名称！'));
                } else if(value === this.formValidate.old_tag){
                    callback();
                } else {
                    this.$http.get('/businessConfigure/checkBusinessConfigureModelName?businessModelName='+ value).then(resp => {
                        if (resp.data.success) {
                            if(resp.data.data){
                                callback();
                            }else{
                                callback(new Error('名称重复！'));
                            }
                        }
                    })
                }
            };
            return {
                disabledGroup: [],
                formValidate: {
                    old_tag: '',
                    tag: '',
                    role: '',
                    roleCode: '',
                    remark: '',
                },
                ruleValidate: {
                    tag: [{
                        validator: validatePass,
                        trigger: 'blur',
                        required: true
                    }],
                    role: [{
                        required: true,
                        message: '请选择关联角色！',
                        trigger: 'change'
                    }],
                },
                modal_Role: false,
                loading: false,
                roleName: '',
                current_role: 1,
                pagesize_role: 10,
                total_role: 0,
                columns_role: [{
                    title: '角色名称',
                    key: 'role',
                }, {
                    title: '角色说明',
                    key: 'description',
                }, {
                    title: '操作',
                    width: 100,
                    align: 'center',
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
                                        this.select_role(params.row)
                                    }
                                }
                            }, '选择')
                        ]);
                    }
                }],
                data_role: [],
                projectList: [],

                columns_field: [{
                    title: '字段名称',
                    key: 'name',
                    width: 150,
                }, {
                    title: '启用',
                    width: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('Checkbox', {
                                props: {
                                    value: this.data_field[params.index].enabled === '1'? true:false,
                                },
                                on: {
                                    'on-change': (event) => {
                                        this.data_field[params.index].enabled = event? '1' : '0';
                                        if(!event){
                                            this.data_field[params.index].checkedValueList = [];
                                            this.data_field[params.index].defaultValueList = [];
                                        }
                                    }
                                }
                            })
                        ]);
                    }
                }, {
                    title: '可选项',
                    render: (h, params) => {
                        return h('CheckboxGroup', {
                                props: {
                                    value: this.data_field[params.index].checkedValueList,
                                },
                                on: {
                                    'on-change': (event) => {
                                        this.data_field[params.index].checkedValueList = event;


                                       let arr = [];
                                       this.data_field[params.index].defaultValueList.map(item => {
                                            if(this.data_field[params.index].checkedValueList.includes(item)){
                                                arr.push(item)
                                            }
                                       })
                                       this.data_field[params.index].defaultValueList = arr;

                                    }
                                }
                            },

                            this.data_field[params.index].childFieldList.map(item => {
                                return h('Checkbox', {
                                    props: {
                                        label: item.value,
                                        disabled: this.data_field[params.index].enabled === '1'? false:true
                                    }
                                }, item.name)
                            }),

                        );
                    }
                }, {
                    title: '默认选项',
                    key: 'explain',
                    render: (h, params) => {

                        let arr = [];
                        this.data_field[params.index].checkedValueList.map(item => {

                            let n = this.data_field[params.index].childFieldList.filter(elem => {
                                return elem.value === item
                            })[0];
                            arr.push(n)
                        })
                        return h('CheckboxGroup', {
                                props: {
                                    value: this.data_field[params.index].defaultValueList
                                },
                                on: {
                                    'on-change': (event) => {
                                        this.data_field[params.index].defaultValueList = event;
                                    }
                                }
                            },

                            arr.map(item => {
                                return h('Checkbox', {
                                    props: {
                                        label: item.value,
                                    }
                                }, item.name)
                            }),

                        );


                    }
                }, ],
                data_field: [

                ],
                moneyFlag: false,
                dealerFlag: false,
                roleArr: [],
                roleArr_lin: [],
                otherList: [],
                allData: {},




            }
        },
        methods: {


            // 根据ID初始化
            init_Id() {
                this.$http.post('/businessConfigure/initBusinessPackage',{id:this.pid}).then(resp => {
                    if (resp.data.success) {

                        this.allData = resp.data.data;

                        this.formValidate.tag = this.allData.businessModelName || '';
                        this.formValidate.old_tag = this.allData.businessModelName;
                        this.formValidate.roleCode = this.allData.roleCode;
                        this.formValidate.remark = this.allData.remarks || '';

                        if(this.formValidate.roleCode){
                            this.getRole(this.formValidate.roleCode)
                        }

                        let fieldList = this.allData.fieldList;
                        this.projectList = fieldList.filter(item => {
                            return item.code === 'firstSubject';
                        });

                        this.data_field = fieldList.filter(item => {
                            return item.code !== 'firstSubject' && item.code !== 'guaranteeFlag';
                        });

                        this.otherList = fieldList.filter(item => {
                            return item.code === 'guaranteeFlag';
                        });




                    }
                })
            },
            getRole(ids){
                this.$http.post('/api/uscUser/getRoleName?roleId='+ ids).then(resp => {
                    if (resp.data.success) {
                        let data = resp.data.data;

                        this.roleArr = [];
                        let arr = [];
                        Object.keys(data).map(item => {
                            this.roleArr.push({
                                role: data[item],
                                roleId: Number(item)
                            })
                            arr.push(data[item])
                        })

                        this.formValidate.role = arr.join(',');
                    }
                })
            },
            changeRadio(v){
                this.otherList[0].checkedValueList = v.split();
            },

            // 加载关联角色
            load_role() {
                this.loading = true;
                let obj = {
                    roleId: "",
                    role: this.roleName,
                    current: this.current_role,
                    rowCount: this.pagesize_role
                }
                this.$http.post('/api/uscUser/pageUserRole', obj).then(resp => {
                    this.loading = false;
                    if (resp.data.success) {
                        let data = resp.data.data;
                        this.data_role = data.data;
                        this.pagesize_role = data.rowCount;
                        this.total_role = data.total;
                    }
                })
            },

            // 选择关联角色
            changeRole() {
                this.roleArr_lin = Object.values(this.roleArr);
                this.modal_Role = true;
            },

            // 搜索角色
            search() {
                this.current_role = 1;
                this.load_role();
            },
            change_page(c){
                this.current_role = c;
                this.load_role();
            },
            change_page_size(c){
                this.current_role = 1;
                this.pagesize_role = c;
                this.load_role();
            },
            select_role(data){

                var a = this.roleArr_lin.filter(item => { return item.roleId === data.roleId});

                if(a.length > 0){
                    this.$Message.error('已存在此角色！');
                }else{
                    this.roleArr_lin.push({
                        role: data.role,
                        roleId: data.roleId
                    })
                }
            },
            handleClose(event, role){
                this.roleArr_lin.map((item,index) => {
                    if(item.role === role){
                        this.roleArr_lin.splice(index,1);
                    }
                })
            },
            ok() {
                this.modal_Role = false;
                let arr1 = [];
                let arr2 = [];
                this.roleArr_lin.map(item => {
                    arr1.push(item.role)
                    arr2.push(item.roleId)
                })
                this.roleArr = Object.values(this.roleArr_lin);
                this.formValidate.role = arr1.join(',');
                this.formValidate.roleCode = arr2.join(',');
            },
            // 返回列表
            back() {
                this.$bus.$emit("businessManagement", {
                    id: "businessManagement",
                    name: "业务标签管理",
                    refresh: true,
                    closeName: this.closeName
                });
            },
            // 确认提交
            submit(){

                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: '确认提交？',
                            loading: true,
                            onOk: () => {
                                this.submitFn();
                            },
                        });
                    }else{
                        this.$Message.error('表单验证失败！');
                    }
                })
            },
            // 提交方法
            submitFn(){

                this.allData.businessModelName = this.formValidate.tag;
                this.allData.roleCode = this.formValidate.roleCode;
                this.allData.remarks = this.formValidate.remark;

                this.allData.fieldList = [];
                this.allData.fieldList.push(...this.projectList,...this.data_field,...this.otherList);


                this.$http.post('/businessConfigure/saveBusinessPackage', this.allData).then(resp => {
                    if (resp.data.success) {

                        this.$Message.success({
                            content: '提交成功！',
                            onClose: () => {
                                this.$Modal.remove();
                                this.back();
                            }
                        });
                    }else{
                        this.$Message.error({
                            content: resp.data.errorMessage,
                            onClose: () => {
                                this.$Modal.remove();
                            }
                        });

                    }
                })
            }



        },
        mounted() {
            this.load_role();
        }
    }
</script>

