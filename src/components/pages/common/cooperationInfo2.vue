<!-- 合作信息-经销商 -->
<template>
 <div>
    <Form ref="formValidate" :model="defaultValue" :rules="ruleValidate" :label-width="130">
        <Row>
            <Col span="24">
                <FormItem label="渠道科目" prop="subjectValue">
                      <Cascader v-model="defaultValue.subjectValue" :data="data4" disabled class="input-width" ></Cascader>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <FormItem label="业务类型" prop="type">
                    <CheckboxGroup  v-model="defaultValue.type">
                        <Checkbox label="01300000">消费贷</Checkbox>
                        <Checkbox label="0130000500000">经营性租赁</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Col>
        </Row>
         <Row>
            <Col span="24">
                <FormItem label="租赁属性" prop="lease">
                    <CheckboxGroup  v-model="defaultValue.lease">
                        <Checkbox label="0130000000000">正租</Checkbox>
                        <Checkbox label="0130000000001">回租</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Col>
        </Row>
         <Row>
            <Col span="24">
                <FormItem label="线索来源" prop="source">
                    <CheckboxGroup  v-model="defaultValue.source">
                        <Checkbox label="030100001" disabled>线下</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Col>
        </Row>
         <Row>
            <Col span="24">
                <FormItem label="提报主体" prop="submission">
                    <CheckboxGroup  v-model="defaultValue.submission">
                        <Checkbox label="03001">上海易鑫</Checkbox>
                        <Checkbox label="07001">北京易鑫</Checkbox>
                        <Checkbox label="14001">广州易鑫</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Col>
        </Row>

        <Row>
            <Col span="24">
                <FormItem label="所属分公司" prop="company">
                    <Input v-model="defaultValue.company" class="input-width" disabled></Input> 
                </FormItem>
            </Col>
        </Row>

        <Row>
            <Col span="24">
                <FormItem label="是否支持评估价上浮" prop="isFloat">
                    <RadioGroup v-model="defaultValue.isFloat">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
            </Col>
        </Row>
      
 

    </Form>
               
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
    	},
        data() {
            return {

                defaultValue:{
                    subjectValue: ['04970000','0497000000000'],
                    source: ['030100001'],
                    type: [],
                    lease: [],
                    submission: [],
                    company:'',
                    companyCode:'',
                    isFloat:'',
                },

            	ruleValidate:{
                    subjectValue: [
                        { required: true, type: 'array', message: '请选择渠道科目', trigger: 'change' }
                    ],
                    type: [
                        { required: true, type: 'array',  message: '请选择业务类型', trigger: 'change' }
                    ],
                    lease: [
                        { required: true, type: 'array',  message: '请选择租赁属性', trigger: 'change' }
                    ],
                    source: [
                        { required: true, type: 'array',  message: '请选择线索来源', trigger: 'change' }
                    ],
                    submission: [
                        { required: true, type: 'array',  message: '请选择提报主体', trigger: 'change' }
                    ],
                    company: [
                        { required: true,  message: '请输入所属分公司', trigger: 'change' }
                    ],
                    isFloat: [
                        { required: true,  message: '请选择是否支持上浮', trigger: 'change' }
                    ],
                  
                   
              	},
              	data4: [
                    {
                        label:'代理商',
                        value: '04970000',
                        children:[
                            {
                                label:'区域代理商',
                                value:'0497000000000'
                            }
                        ]
                    }
                ],
              	loading1: false,
              	options1:[],
              	handleTime: '',
                startDate_old:'',
                endDate_old:'',
                         
              }
        },
      
        watch:{

            defaultValue: {
                handler: function (newVal) {
          
                    this.$emit('update:value', newVal);
                  },
                deep: true
            }
        },
        methods: {

            // 获取分公司
            getcompany(){

                this.$http.post("/rentAgentController/selectBranchCompanyByUserChargerAccount",{}).then((resp)=>{
                    if(resp.data.success){
                        let data = resp.data.data;
                        this.defaultValue.companyCode = data.branchCompanyCode;
                        this.defaultValue.company = data.branchCompanyName;
                    };
                })
            },
        	
            
             // 验证
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



            this.getcompany();
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



