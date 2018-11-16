<!-- 厂商、直营-汽车融资及服务业务合作协议（通用版） -->
<template>
    <div class="direct-sales">
        <div v-if="isShow">
            <Row>
                <Col span="11" style="padding: 0 20px 0 0;" >
                    <Row>
                        <Col span="24">
                            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="144">
                                <FormItem label="请选择易鑫签约方" prop="contractValue">
                                    <Select v-model="formValidate.contractValue" @on-change="changeContractFn">
                                        <Option v-for="item in contractorList" :value="item.key" :key="item.key">{{ item.title }}</Option>
                                    </Select>
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>

                    <Row v-if="isOtherShow">
                        <Col span="6" class="font-right" style="line-height:21px">如有第三方签约，请在此录入第三方企业名称</Col>
                        <Col span="18">
                            <Input v-model.trim="formValidate1.componyName" type="textarea" :rows="4" placeholder="如有第三方签约，请在此录入第三方企业名称" />
                        </Col>
                    </Row>
                </Col>
                <Col span="12" style="border-left: 1px solid #cdcdcd;">
                    <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="120">
                        <Row>
                            <!--<Col span="6" class="font-right">签约经销商 </Col>-->
                            <Col span="24">
                                <FormItem label="签约经销商" prop="mainName" >
                                    {{ formValidate1.mainName }}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row>
                            <!--<Col span="6" class="font-right">经销商法人姓名 </Col>-->
                            <Col span="24">
                                <FormItem label="经销商法人姓名" prop="legalPersonName" >
                                    {{ formValidate1.legalPersonName }}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row>
                            <!--<Col span="6" class="font-right">经销商地址 </Col>-->
                            <Col span="18">
                                <FormItem label="经销商地址" prop="registeredAddress">
                                    {{ formValidate1.registeredAddress }}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                        <!--<Row>
                            <Col span="6" class="font-right">签约经销商 </Col>
                            <Col span="24">
                                <FormItem>
                                    {{ agencyInfo.mainName }}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row>
                            <Col span="6" class="font-right">经销商法人姓名 </Col>
                            <Col span="18">{{ agencyInfo.legalPersonName }}</Col>
                        </Row>

                        <Row>
                            <Col span="6" class="font-right">经销商地址 </Col>
                            <Col span="18">{{ agencyInfo.registeredAddress }}</Col>
                        </Row>-->
                </Col>
            </Row>
        </div>

        <div v-if="isShow && agentStatus">
            <Divider />
            <!-- 服务费结算周期 -->
            <serviceWalksUp :serviceinfo.sync="service_modal" ref="serviceWalksUp_ref"/>
            <Divider />
            <!-- 乙方收取服务费的账户信息为 -->
            <selectShowInfo :getFormChannelCode="getFormChannelCode" title="乙方收取服务费的账户信息为：" :servicefee.sync="servicefeeO_modal" ref="selectShowInfoO_ref"/>
            <!-- 经销商收取融资款的账户信息为 -->
            <selectShowInfo :getFormChannelCode="getFormChannelCode" title="经销商收取融资款的账户信息为：" :servicefee.sync="servicefeeT_modal" ref="selectShowInfoT_ref"/>
            <!-- 抵押登记及车辆交付 -->
            <mortgageDelivery  :deliveryTypes.sync="deliveryType" :typeValues.sync="typeValues"/>
        </div>

        <div v-if="isShow && !agentStatus">
            <Divider />
            <Row v-if="cashDepositStatus!='0'">
                <Col span="2">预缴保证金金额</Col>
                <Col span="22">{{ cashDeposit }}</Col>
            </Row>
        </div>

        <!-- 担保人 -->
        <div v-if="!isShow && contractorStatus">
            <guarantor ref="guarantor_ref" :params.sync="getParams" :getFormChannelCode="getFormChannelCode"  />
        </div>

    </div>
</template>

<script>
    export default {
        name: "directSales",
        props:{
            params: {
                type: Object,
                default: {},
            },
            getFormChannelCode:{
                type:Object,
                default: {},
            },
            formData:{
                type:Object,
                default:{
                    agencyInfo:this.formValidate1,
                    service_modal:this.service_modal,
                    servicefeeO_modal:this.servicefeeO_modal,
                    servicefeeT_modal:this.servicefeeT_modal,
                    deliveryType:this.deliveryType,
                    yxSign:this.formValidate,
                    typeValues:this.typeValues,
                    cashDeposit:this.cashDeposit
                }
            }
        },
        data(){
            return {
                //
                isOtherShow:true,
                //
                getParams:{},
                //
                isShow: false,
                //
                agentStatus: false,
                //
                contractorStatus:false,

                parentData:{},
                isContractor: "",

                formValidate:{
                    contractValue: "01"
                },
                ruleValidate:{
                    contractValue:[{ required: true, message: '请选择合同模板', trigger: 'change' }]
                },
                formValidate1:{
                    legalPersonName: "",
                    registeredAddress: "",
                    mainName: "",
                },

                ruleValidate1:{
                    legalPersonName:[{ required: true, message: '签约经销商不能为空' }],
                    registeredAddress:[{ required: true, message: '经销商法人姓名不能为空' }],
                    mainName:[{ required: true, message: '经销商地址不能为空' }],
                },
                timer: "",
                payment: "",
                value1: "",
                value2: "",
                // TODO 签约公司列表
                contractorList: [
                    {
                        key: "01",
                        title: "上海易鑫融资租赁有限公司"
                    }
                ],
                agencyInfo:{
                  componyName: "",
                },
                service_modal:{},
                servicefeeO_modal:{},
                servicefeeT_modal:{},
                deliveryType:[],
                typeValues:'',
                cashDepositStatus:'0',
                cashDeposit:'',
            }
        },
        methods:{
            changeContractFn(data){
                console.log(data);
            },
            getguarantorType(keyId){
                if(keyId==="005"){

                    this.isShow = false;
                    this.agentStatus = false;
                    this.contractorStatus = false;
                }else if(keyId==="003"){

                    this.isShow = true;
                    this.agentStatus = true;
                    this.contractorStatus = false;
                    this.isOtherShow = true;
                }else if(keyId==="001" || keyId==="002"){

                    this.isShow = true;
                    this.agentStatus = false;
                    this.contractorStatus = false;
                    this.isOtherShow = false;
                }else if(keyId==="004"){

                    this.isShow = false;
                    this.agentStatus = false;
                    this.contractorStatus = true;
                }else{

                }
            },
            fetchMainInfo(){
                let val = this.getFormChannelCode.channelId;
                this.$http.get('/tbChannelMainInfo/selectMainInfoByChannelId?channelId='+val).then(res => {
                    let _data = res.data.data;
                    /*this.agencyInfo = {
                        "legalPersonName":_data.legalPersonName,
                        "registeredAddress":_data.registeredAddress,
                        "mainName":_data.mainName,
                    }*/

                    this.formValidate1 = {
                        "legalPersonName":_data.legalPersonName||"",
                        "registeredAddress":_data.registeredAddress||"",
                        "mainName":_data.mainName||"",
                    }

                });
            },
            getDepositNum(){
              let val = this.getFormChannelCode.channelId;
              this.$http.post('/tbChannelBusiness/getChannelBusiness',{'id':val}).then(res => {
                let _data = res.data.data;
                this.cashDepositStatus = _data.cashDepositStatus;
                this.cashDeposit = _data.cashDeposit;
                this.formData.cashDeposit = _data.cashDeposit;
                this.$emit('update:formData',this.formData);
              });
            },
            submitForm(){
                return new Promise((resolve,reject)=>{
                    Promise.all([this.$refs['serviceWalksUp_ref'].handleSubmit(), this.$refs['selectShowInfoO_ref'].handleSubmit(), this.$refs['selectShowInfoT_ref'].handleSubmit(), this.handleSubmit(),this.handleSubmit2()]).then(()=>{
                        resolve();
                    }).catch((error) => {
                        console.log("验证失败");
                        this.$Message.error('表单验证失败')
                    })
                })
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
            handleSubmit1(){
                return new Promise((resolve,reject)=>{
                    Promise.all([this.$refs['guarantor_ref'].handleSubmit()]).then((data)=>{
                        resolve(data)
                    })

                })
            },
            handleSubmit2(){
                return new Promise((resolve,reject)=>{
                    this.$refs['formValidate1'].validate((valid)=>{
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
            params:{
                handler(val){
                    let keyId = val.key;

                    console.log(val.key, '选择的合同类型');

                    this.getParams = val;

                    this.getguarantorType(keyId);

                },
                deep: true
            },
            agencyInfo:{
                handler:function(newVal){
                    this.formData.agencyInfo = newVal;
                    this.$emit('update:formData',this.formData);
                },
                deep:true
            },
            formValidate1:{
                handler:function(newVal){
                    this.formData.agencyInfo = newVal;
                    this.$emit('update:formData',this.formData);
                },
                deep:true
            },
            service_modal:{
                handler:function(newVal){
                    this.formData.service_modal = newVal;
                    this.$emit('update:formData',this.formData);
                },
                deep:true
            },
            servicefeeO_modal:{
                handler:function(newVal){
                    this.formData.servicefeeO_modal = newVal;
                    this.$emit('update:formData',this.formData);
                },
                deep:true
            },
            servicefeeT_modal:{
                handler:function(newVal){
                    this.formData.servicefeeT_modal = newVal;
                    this.$emit('update:formData',this.formData);
                },
                deep:true
            },
            deliveryType:{
                handler:function(newVal){
                    this.formData.deliveryType = newVal;
                    this.$emit('update:formData',this.formData);
                },
                deep:true
            },
            formValidate:{
                handler:function(newVal){
                    this.formData.yxSign = newVal;
                    this.$emit('update:formData',this.formData);
                },
                deep:true
            },
          typeValues:{
            handler:function(newVal){
              this.formData.typeValues = newVal;
              this.$emit('update:formData',this.formData);
            },
            deep:true
          },

        },
        mounted(){
            this.getguarantorType(this.params.key);

            this.$nextTick(()=>{

                this.fetchMainInfo();
                this.getDepositNum();

                console.log(this)

                console.log(this.getFormChannelCode, 'from contractAssistant.vue')
            })

        }
    }
</script>
