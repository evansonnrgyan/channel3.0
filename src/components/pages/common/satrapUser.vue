<!-- 主管用户 -->
<template>
    <div>
	<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
            <Row>
                <Col span="24">
                    <FormItem label="姓名" prop="name">
                        <div v-if="edit">
                            <Input  v-model.trim="formValidate.name" placeholder="请输入姓名" class="input-width" :maxlength="20"></Input>
                            <limitLength :value="formValidate.name" :max="20"/>
                        </div>
                        
                        <span v-else>{{formValidate.name}}</span>
                    </FormItem>
                </Col>
            </Row>
            
            <Row>
                <Col span="24">
                    <FormItem label="用户名" prop="user">

                        <div v-if="edit">
                            <Input v-model.trim="formValidate.user" placeholder="请输入" class="input-width" :maxlength="20">
                                <div slot="prefix" style="margin-top:7px;margin-left:2px">kehu</div>
                            </Input>
                             <limitLength :value="formValidate.user" :max="20"/>

                             <span v-if="userflag" class="marginL10">
                                 用户名已存在！建议使用：
                                 <a @click="changeUser">{{newUser}}</a>
                             </span>
                        </div>
                        <span v-else>{{formValidate.user}}</span>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="性别" prop="sex">
                        <div v-if="edit">
                            <RadioGroup v-model="formValidate.sex">
                                <Radio label="1">男</Radio>
                                <Radio label="0">女</Radio>
                            </RadioGroup>
                        </div>
                        <span v-else>{{formValidate.sex}}</span>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="关联角色" prop="role">
                        <Input v-model="formValidate.role" class="input-width" readonly placeholder="弹框内列表选择" :title="formValidate.role">
                            <Button type="primary" slot="append" @click="changeRole" class="select-button">选择</Button>
                        </Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="手机号" prop="phone">
                        <Input v-if="edit" v-model.trim="formValidate.phone" placeholder="用于接受登录账号和密码，请准确填写" class="input-width"></Input>
                        <span v-else>{{formValidate.phone}}</span>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="邮箱" prop="email">
                        <Input v-if="edit" v-model.trim="formValidate.email" placeholder="请输入邮箱" class="input-width"></Input>
                        <span v-else>{{formValidate.email}}</span>
                    </FormItem>
                </Col>
            </Row>
           
           
        </Form>

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
                <Input v-model="roleName" placeholder="请输入角色名称" class="input-width"></Input>
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
        props: {
            value:{
                type: Object,
                default: {},
            },
            flag:{
                type:Boolean ,
                default:false
            },
            edit:{
                type:Boolean ,
                default:false
            },
            pid:{
                type:String ,
                default:''
            },
        },
        data() {
            // 用户名
            const validateUser = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入用户名'));
                } else {
                    this.$http.post("/user/account/checkUser",{channelId: this.pid,userName:'kehu'+value}).then((resp)=>{
                        if(resp.data.success){
                             callback();
                             this.userflag = false;
                        }else{
                            this.newUser = resp.data.data;
                            this.userflag = true;
                            callback(new Error(resp.data.errorMessage));
                        }
                      })
                }
            };

            // 手机号
            const validatePhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号'));
                } else {
                    this.$http.post("/user/account/checkUser",{channelId: this.pid, telephone:value}).then((resp)=>{
                        if(resp.data.success){
                             callback();
                        }else{
                            callback(new Error(resp.data.errorMessage));
                        }
                      })
                }
            };
            return {
                modal_Role:false,
                userflag:false,
                newUser:'',

                formValidate:{
                    name:'',
                    user:'',
                    phone:'',
                    email:'',
                    sex:'',
                    role: '',
                    roleCode: '',
                },
                ruleValidate:{
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    user: [
                        { required: true, validator: validateUser,  trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, validator: validatePhone, trigger: 'blur' },
                        { pattern: /^[0-9]{11}$/, trigger: 'blur' ,message: '号码格式不正确'}
                    ],
                    email: [
                        { required: false, message: '请输入邮箱', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    sex: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    role: [
                        { required: true, message: '请选择角色', trigger: 'change' }
                    ],
                },
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
                current_role: 1,
                pagesize_role: 10,
                total_role: 0,
                roleName: '',
                loading: false,
                roleArr: [],
                roleArr_lin: [],
                onceFlag:true,
            }
        },
        watch:{

            formValidate: {
              handler: function (newVal) {
                  this.$emit('update:value', newVal);

                  if(newVal.roleCode && this.onceFlag){
                    this.getRole(newVal.roleCode)
                    this.onceFlag = false;
                  }
                },
              deep: true
            }
          
        },
        methods: {

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

            // 改变用户名
          changeUser(){
            this.formValidate.user = this.newUser? this.newUser.substring(4,this.newUser.length) : null;
            this.userflag = false;
            this.$refs['formValidate'].validateField('user')
          },
          // 加载关联角色
            load_role() {
                this.loading = true;
                let obj = {
                    role: this.roleName,
                    current: this.current_role,
                    rowCount: this.pagesize_role
                }
                this.$http.post('/user/account/getUnauthorizedRole', obj).then(resp => {
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


        
            handleSubmit(){
                return new Promise((resolve, reject)=>{
                    this.$refs['formValidate'].validate((valid) => {
                        if (valid) {
                            resolve();
                        } else{
                            reject();
                        }
                    })
                })
            }
            
        },
        mounted(){

                this.load_role();

                this.$emit('update:value', this.formValidate);

        }

    } 
</script>
<style type="text/css" scoped>
    .content{
    }
    .line{
        line-height: 2.3
    }
    .title{
        font-size: 16px;
        font-weight: bold
    }

</style>



