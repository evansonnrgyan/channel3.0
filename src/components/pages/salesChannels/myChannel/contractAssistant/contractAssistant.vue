<template>
    <div class="expension-mainterance" style="overflow-y:auto" ref="contractAss_ref">
        <div class="channels-common-body clearboth">
            <div class="contract-assistant">
                <commonTitle title="合同小助手">
                    <Row>
                        <Col span="22">
                            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                                <FormItem label="选择合同模板" prop="contractValue">
                                    <Select v-model.sync="formValidate.contractValue" @on-change="changecontractFn" style="width:600px">
                                        <Option v-for="item in contractList" :value="item.key" :key="item.key">{{ item.title }}</Option>
                                    </Select>
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                </commonTitle>

                <directSales v-if="contractBySelected.key!=='005'" :getFormChannelCode="getFormChannelCode" :params.sync="params" ref="directSales_ref" :formData.sync="formData"/>


            </div>
        </div>
        <poFooter>
            <Button size="large" @click="closeCurrentTab">关闭</Button>
            <Button type="primary" size="large" @click="createContract">生成电子合同</Button>
        </poFooter>

        <Modal
                v-model="createModal"
                width="300px"
                title="提示">
            <p v-if="loading">系统正在为您努力生成合同，请不要关闭页面……</p>
            <p v-if="successed"><Icon type="md-checkmark-circle-outline" style="color:#2d8cf0" /> 电子合同已生成，请点击下载 <Button size="small" type="primary" @click="downloadPdf">下载</Button></p>
            <p v-if="errored"><Icon type="md-outlet" style="color:#2d8cf0" />很抱歉，合同未能成功生成，请稍后再次尝试</p>
            <div slot="footer">
                <Button v-if="errored" size="small" @click="createClosed">关闭</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    export default {
        name:"contractAssistant",
        data(){
            return {
                createModal:false,
                loading:false,
                successed:false,
                errored:false,
                pdfUrl:"",
                formData:{},
                params: {},
                getFormChannelCode:{},
                formValidate:{
                    // 合同模板列表
                    contractValue: "",
                },
                ruleValidate:{
                    contractValue:[{ required: true, message: '请选择合同模板', trigger: 'change' }]
                },
                // 选中的合同模板
                contractBySelected: {
                    key: ""
                },
                contractList: [
                    {
                        key: "005",
                        title: "根据当前申请的渠道自动匹配"
                    },
                    {
                        key: "003",
                        title: "厂商、直营-汽车融资及服务业务合作协议（通用版）"
                    },
                    {
                        key: "001",
                        title: "代理商-通用版本"
                    },
                    {
                        key: "002",
                        title: "代理商-专用（新业务部）"
                    },
                    {
                        key: "004",
                        title: "连带责任保证合同"
                    }
                ]
            }
        },
        methods:{
            // 选中的合同模板类型
            changecontractFn(value){
                this.contractBySelected = this.contractList.filter(item=>item.key===value)[0];
                this.showInfoBycontractValue(this.contractBySelected);
            },
            // 选中的合同模板类型对应的信息
            showInfoBycontractValue(value){
                this.params = value;

            },
            createContract(){
                  if(!this.formData.agencyInfo.legalPersonName || !this.formData.agencyInfo.registeredAddress){
                      this.$Message.error("很抱歉，此类渠道暂时不支持电子合同！");
                      return false;
                  }else if(this.contractList.length===0){
                      this.$Message.error("很抱歉，此类渠道暂时不支持电子合同！");
                      return false;
                  }

                this.loading = false,
                this.successed = false,
                this.errored = false,
                this.$refs['formValidate'].validate((valid)=>{

                    if(valid){
                        if(this.formValidate.contractValue=='003') {
                            Promise.all([this.$refs['directSales_ref'].submitForm(), this.$refs['directSales_ref'].handleSubmit2()]).then(()=>{
                                if(this.formData.deliveryType.length===0 || !this.formData.typeValues ){
                                    this.$Message.error('抵押登记及车辆交付不能为空');
                                    return false;
                                }
                                this.submitInfo();
                            })
                        }else if(this.formValidate.contractValue=='001'||this.formValidate.contractValue=='002'){
                            Promise.all([this.$refs['directSales_ref'].handleSubmit2()]).then(()=>{
                                this.submitInfo();
                            })
                        }else {
                            Promise.all([this.$refs['directSales_ref'].handleSubmit1()]).then((data)=>{
                                //TODO 暂时关闭 添加catch判断
                                this.submitInfo1(data);
                            }).catch(()=>{
                                console.log('保单合同展示关闭++++++++++++++++++++');
                                this.$Message.error("很抱歉，此类渠道暂时不支持电子合同！");
                            })
                        }
                    }else {
                        //debugger
                        this.createModal = false;
                        this.$Message.error('必填项不能为空')
                    }
                })
            },
            submitInfo(){
                let param = {
                    "channelCode": this.getFormChannelCode.channelCode,
                    "contractTempNo": this.formValidate.contractValue,
                    "yxcontractParty": '01',
                    "contractedReseller":this.formData.agencyInfo.mainName, //"签约经销商",
                    "distributorName": this.formData.agencyInfo.legalPersonName, //"经销商法人姓名",
                    "dealerAddress": this.formData.agencyInfo.registeredAddress, //"经销商地址",
                    "thirdPartyContract": this.formData.agencyInfo.componyName?this.formData.agencyInfo.componyName:'', //"第三方签约",
                };
                let param_part = {};
                if(this.formValidate.contractValue=='003') {
                    param_part = {
                        "serviceFeeSettlementCycle": this.formData.service_modal.timer, //"季度",
                        "partyBaccountName": this.formData.servicefeeO_modal.ownerName, //"乙方账户名",
                        "partyBbankName": this.formData.servicefeeO_modal.bankName, //"乙方开户行名称",
                        "partyBaccountNumber": this.formData.servicefeeO_modal.accountName, //"乙方账号",
                        "distributoraccountName": this.formData.servicefeeT_modal.ownerName, //"经销商账户名",
                        "distributorbankName": this.formData.servicefeeT_modal.bankName, //"经销商开户行名称",
                        "distributoraccountNumber": this.formData.servicefeeT_modal.accountName, //"经销商账号",
                        "mortgageVehicleDeliveryMode":this.formData.typeValues?this.formData.typeValues:'', //"1",
                        "financingVehicleDeliveryMode":this.formData.deliveryType.sort(), //["2","3","4"]
                        "paymentStandard": this.formData.service_modal.textStr, //"以租赁公司服务合同的租金总额为基数，乘以10%的比例。"
                    }
                }else if(this.formValidate.contractValue=='001'||this.formValidate.contractValue=='002') {
                    param_part = {
                        "advanceDepositAmount": this.formData.cashDeposit?this.formData.cashDeposit:'',
                    }
                }else if(this.formValidate.contractValue=='004'){
                        this.$bus.$on('fourThParmas',(data)=>{
                            console.log(data,'担保人入参')
                        })
                }else {

                }
                let data = Object.assign(param, param_part);
                this.submit(data);


            },
            submitInfo1(data){
                this.submit(data[0][0]);
            },
            submit(params){

              this.createModal = true;
              this.loading = true;

              this.$http.post('/contractAssistant/contractGeneration',params).then(res => {
                if(res.data.success) {
                  let hrefData = res.data.data;
                  console.log(hrefData+"hrefData")
                  //window.open(hrefData);
                  this.pdfUrl = hrefData;
                  this.successed = true;
                  this.errored = false;
                }else{
                   this.createModal = false;
                    this.successed = false;
                    this.errored = true;
                }
                this.loading = false;
              });

            },
            // 开始生成
            createClosed(){
                this.createModal = false;
                this.loading = false;
                this.successed = false;
                this.errored = false;
            },
            // 下载 pdf
            downloadPdf(){
                window.open(this.pdfUrl);
            },
            // 关闭当前页
            closeCurrentTab(){
                this.$bus.$emit('closeTab',{id:'contractAssistant'});
            }
        },
        mounted(){
            // $('.expension-mainterance').css("height", $(document).height()-300);

            //渠道传入的参数 channelCode, busiConfigId

            console.log(this.$attrs.params, '渠道传入的参数 channelCode, busiConfigId');

            this.getFormChannelCode = Object.assign({},this.$attrs.params);

            if(this.getFormChannelCode){
                let busiConfigId = this.getFormChannelCode.busiConfigId

                if(busiConfigId === "0000000065570e9b01655b1eb9eb001e" || busiConfigId === "00000000655b4c0401655b5a6af50002"){
                    //直营新车 直营二手车
                    this.contractList = [
                        {
                            key: "003",
                            title: "厂商、直营-汽车融资及服务业务合作协议（通用版）"
                        }
                    ]
                }else if(busiConfigId === "0000000065570eb001655b2387c60014" || busiConfigId ==="0000000065570eb101655b2d8cf80000" ){
                    //租赁代理 销售代理
                    this.contractList = [
                        {
                            key: "001",
                            title: "代理商-通用版本"
                        }
                    ]
                }else if(busiConfigId === "0000000065570eb101655b5c7363001d"){
                    //新业务代理
                    // TODO 新业务代理有调整 暂定注释掉
                    this.contractList = [];
                    this.contractList = [
                        {
                            key: "002",
                            title: "代理商-专用（新业务部）"
                        },
                        {
                            key: "004",
                            title: "连带责任保证合同"
                        }
                    ]
                }else {
                    //没有以上规则为空
                    this.contractList = [];
                }
            }

        }

    }
</script>

<style>
    .contract-assistant{
        margin: 0 0 100px 0;
        padding: 0 0 0 20px;
    }
    .channels-common-body{
        margin: 0 0 600px 0;
    }
</style>
