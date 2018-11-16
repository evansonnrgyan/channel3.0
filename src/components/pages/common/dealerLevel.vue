<!-- 经销商-分级 -->
<template>
	<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
            <Row>
                <Col span="24">
                    <FormItem label="租赁代理等级" prop="level">
                        <div v-if="edit">
                            <Select v-model="formValidate.level" class="input-width" placeholder="请选择代理等级">
                                <Option  value="050400002">一级代理商</Option>
                                <Option  value="050400003">二级代理商</Option>
                            </Select>
                        </div>
                        
                        <span v-else>{{formValidate.level}}</span>
                    </FormItem>
                </Col>
            </Row>
            
            <Row>
                <Col span="24">
                    <FormItem label="所属代理上级" prop="topLevel">
                        <Input v-if="edit"  v-model="formValidate.topLevel" disabled placeholder="请输入代理上级" class="input-width"></Input>
                        <span v-else>{{formValidate.topLevel}}</span>
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
                formValidate:{
                    level:'',
                    topLevel:'',
                    topLevelCode:'',
                },
                ruleValidate:{
                    level: [
                        { required: true, message: '请选择代理等级', trigger: 'change' }
                    ],
                    topLevel: [
                        { required: true, message: '请输入代理上级',  trigger: 'change' }
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
         
            // 获取所属代理上级
            getTop(){

                this.$http.post("/rentAgentController/selectBranchCompanyByUserChargerAccount",{}).then((resp)=>{
                    if(resp.data.success){
                        let data = resp.data.data;
                        this.formValidate.topLevel = data.channelName;
                        this.formValidate.topLevelCode = data.id;
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
            
            // 父组件有值
            if(!$.isEmptyObject(this.value)){
                
            }


            this.getTop();

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



