<!-- 业务联系人 -->
<template>
	<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
        <Row>
            <Col span="24">
                <FormItem label="姓名" prop="name">
                    <Input v-if="edit" v-model.trim="formValidate.name" placeholder="请输入姓名" class="input-width"></Input>
                    <span v-else>{{formValidate.name}}</span>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <FormItem label="职务" prop="job">
                    <Select v-if="edit" v-model="formValidate.job" class="input-width" placeholder="请选择职务">
                        <Option v-for="item in jobList" :value="item.itemCode" :key="item.itemCode">{{ item.itemName }}</Option>
                    </Select>
                    <span v-else>{{formValidate.job}}</span>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <FormItem label="手机" prop="phone">
                    <Input v-if="edit" v-model.trim="formValidate.phone" placeholder="请输入手机" class="input-width"></Input>
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
        },
        data() {
            return {
                jobList: [],
                formValidate: {
                    name:'',
                    job:'',
                    phone:'',
                    email:'',
                },
                ruleValidate:{
                        name: [
                            { required: true, message: '请输入姓名', trigger: 'blur' }
                        ],
                        job: [
                            { required: true, message: '请选择职务', trigger: 'change' }
                        ],
                        phone: [
                            { required: true, message: '请输入手机号', trigger: 'blur' },
                            { pattern: /^[0-9]{11}$/, trigger: 'blur' ,message: '号码格式不正确'}
                        ],
                        email: [
                            { required: true, message: '请输入邮箱', trigger: 'blur' },
                            { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                        ],
                     
                    }
                }
        },
        watch:{

            formValidate: {
                handler: function (newVal) {
                    this.$emit('update:value', newVal);

                  },
                deep: true
            }
        },
        methods: {
            getJobList(){
                this.$http.post("/contacterInfo/getPositionCode").then((resp)=>{
                    if(resp.data.success){
                        let data = resp.data.data;
                        this.jobList = data;
                    };
                })
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
            this.getJobList();
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



