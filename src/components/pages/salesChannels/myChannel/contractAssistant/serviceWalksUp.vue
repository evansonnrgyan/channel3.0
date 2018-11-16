<!-- 服务费结算周期 -->

<template>
    <div class="service-walks-up">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="144">
            <Row>
                <Col span="24" style="position: relative;top:-2px;left:3px;">
                    <FormItem label="服务费结算周期" prop="timer">
                        <RadioGroup v-model="formValidate.timer">
                            <Radio label="月">月</Radio>
                            <Radio label="季度">季度</Radio>
                            <Radio label="半年">半年</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <Col span="24">
                    <FormItem label="经营性租赁业务报酬支付标准" prop="payment">
                        <RadioGroup v-model="formValidate.payment" @on-change="change_repay">
                            <Radio label="001" style="display: block">以租赁公司服务合同的租金总额为基数，乘以
                                <FormItem style="display: inline-block" prop="value1">
                                    <Input v-model="formValidate.value1" placeholder="小数点两位数字" style="width: 120px" />
                                </FormItem>
                                %的比例。</Radio>
                            <Radio label="002" style="display: block">根据租赁公司出租的车辆台次，乘以
                                <FormItem style="display: inline-block" prop="value2">
                                    <Input v-model="formValidate.value2" placeholder="大于0整数" style="width: 120px" />
                                </FormItem>
                                元/台的费用标准。</Radio>
                            <Radio label="003" style="display: block">根据租赁公司定期或不定期以书面形式发送给经销商的商务政策为准。</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
    export default {
        name: "serviceWalksUp",
        props:{
            serviceinfo:{
                type: Object,
                default: {},
            },

        },
        data(){
            const validatePass = (rule, value, callback) => {
                if(this.formValidate.payment=='001') {
                    if (this.formValidate.value1 !== '') {
                        let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
                        let employ = reg.test(this.formValidate.value1);
                        if (employ) {
                            this.formValidate.value1 = this.formValidate.value1;
                            callback();
                        } else {
                            callback("金额输入不合法");
                        }
                    }else {
                        callback("以租赁公司服务合同的租金总额为基数必填");
                    }
                }else {
                    callback();
                }

            };
            const validateZs = (rule, value, callback) => {
                if(this.formValidate.payment=='002') {
                    if (this.formValidate.value2 !== '') {
                        let reg =  /^[1-9]\d*$/;
                        let employ = reg.test(this.formValidate.value2);
                        if (employ) {
                            this.formValidate.value2 = this.formValidate.value2;
                            callback();
                        } else {
                            callback("金额输入不合法");
                        }
                    }else {
                        callback("根据租赁公司出租的车辆台次必填");
                    }
                }else {
                    callback()
                }

            };
            return {
                formValidate:{
                    timer: "",
                    payment: "",
                    value1:'',
                    value2:'',
                },

                ruleValidate:{
                    timer: [{ required: true, message: '请选择服务费结算周期', trigger: 'change' }],
                    payment:[{ required: true, message: '请选择合同模板', trigger: 'change' }],
                    value1: [{ required: false, message: '以租赁公司服务合同的租金总额为基数必填', trigger: 'blur' },{ validator: validatePass}],
                    value2: [{ required: false, message: '根据租赁公司出租的车辆台次必填', trigger: 'blur' },{validator: validateZs}]
                },
            }
        },
        methods:{
            "change_repay"(val){
//            this.$refs['formValidate'].resetFields();
                if(val=='001') {
                    this.formValidate.value2 = '';
                }else if(val=='002') {
                    this.formValidate.value1 = '';
                }else {
                    this.formValidate.value1 = '';
                    this.formValidate.value2 = '';
                }
            },
            handleSubmit(){
                return new Promise((resolve,reject)=>{
                    this.$refs['formValidate'].validate((valid)=>{
                        if(valid){
                            resolve()
                        }else {
                            reject()
                        }
                    })
                })
            },

        },
        watch:{
            formValidate:{
                handler:function(newVal){
                  let dataStr = newVal.payment=='001'? '以租赁公司服务合同的租金总额为基数，乘以'+newVal.value1+'%的比例':newVal.payment=='002'?'根据租赁公司出租的车辆台次，乘以'+newVal.value2+'元/台的费用标准':'根据租赁公司定期或不定期以书面形式发送给经销商的商务政策为准';
                  this.serviceinfo.textStr = dataStr;
                    this.$emit('update:serviceinfo',newVal);
                },
                deep:true,
            }
        },
        mounted(){
            this.$emit('update:serviceinfo',this.formValidate);
        }


    }
</script>

<style>

</style>
