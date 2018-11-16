<!-- 经销商分级-新增 -->

<template>
<div>
	<commonTitle title="企业信息" >
            <div class="channels-common-search-content clearboth text-center">
            	<span style="color:red">* </span> 
		            <span  class="search-title marginR10">查询企业</span>
		            	<div class="text-left inline-block">
		            		<Select
		                    v-model="inputValue"
		                    filterable
		                    remote
		                    :remote-method="remoteMethod1"
		                    @on-change="changeSelect"
		                    :loading="loading1"  class="inline " style="width: 350px">
		                    <Option v-for="item in options1" :value="item.id" :key="item.id">{{item.mainName}}</Option>
		                </Select>
		            	</div>
		    </div>
     </commonTitle>

     <div v-if="flag">
     	<!-- 企业信息 -->
		    <commonTitle title="企业信息">
		        <companiesInfo ref="companiesInfo_ref"  :pid="selectID" :value.sync="companiesInfo_model" :flag.sync="companiesInfo_flag" :edit="true"></companiesInfo>
		    </commonTitle>

		    <!-- 店面信息 -->
            <commonTitle title="店面信息">
                <storeInfoForm ref="storeInfoForm_ref" :value.sync="storeInfoForm_model" :flag.sync="storeInfoForm_flag" :edit="true"></storeInfoForm>
            </commonTitle>

            <!-- 合作信息 -->
            <commonTitle title="合作信息">
                    <cooperationInfo2 ref="cooperationInfo_ref" :value.sync="cooperationInfo_model" :flag.sync="cooperationInfo_flag" :edit="true" ></cooperationInfo2>
            </commonTitle>

             <!-- 车源信息 -->
            <commonTitle title="车源信息">
                    <carSourceInfo2 ref="carSourceInfo_ref" :value.sync="carSourceInfo_model" :flag.sync="carSourceInfo_flag" :edit="true"></carSourceInfo2>
             </commonTitle>

             <!-- 业务联系人 -->
            <commonTitle title="业务联系人">
                    <businessPerson ref="businessPerson_ref" :value.sync="businessPerson_model" :flag.sync="businessPerson_flag" :edit="true"></businessPerson>
             </commonTitle>

             <!-- 经销商分级 -->
            <commonTitle title="经销商分级">
                    <dealerLevel ref="dealerLevel_ref" :value.sync="dealerLevel_model" :flag.sync="dealerLevel_flag" :edit="true"></dealerLevel>
             </commonTitle>

             <commonTitle title="保证金交付" >
                    <marginDelivery ref="marginDelivery_ref" :value.sync="marginDelivery_model" :flag.sync="marginDelivery_flag" :edit="true"></marginDelivery> 
             </commonTitle>

             <commonTitle title="收款信息" >
                    <shroffNumber ref="shroffNumber_ref" :value.sync="shroffNumber_model" :flag.sync="shroffNumber_flag" :edit="true" type="2"></shroffNumber> 
             </commonTitle>

        	<commonTitle title="店面账号">
                 <satrapUser ref="satrapUser_ref" :value.sync="satrapUser_model" :flag.sync="satrapUser_flag" :edit="true"></satrapUser>
            </commonTitle>

            <!-- 上线资料  -->
            <commonTitle title="上线资料">
                <filesForm ref="filesForm_ref" :value.sync="filesForm_model" :flag.sync="filesForm_flag" :edit="true"></filesForm>
            </commonTitle>
     </div>



     <poFooter>
        <Button type="primary" size="large" @click="submit">提交</Button>
    </poFooter>

    <!-- 选择销售 -->
    <Modal
        v-model="modal"
        title="选择销售"
        @on-cancel="cancel"
        >
        
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
            <Row>
                <Col span="24">
                    <FormItem label="销售经理" prop="salePerson">
                          <Select v-model="formValidate.salePerson"  class="input-width" placeholder="请选择销售经理" @on-change="changeSalePerson" label-in-value>
                                <Option v-for="item in salePersonList" :value="item.chargerAccount" :key="item.chargerAccount">{{ item.chargerName }}</Option>
                          </Select>
                    </FormItem>
                </Col>
            </Row>
       </Form>

       <div slot="footer" class="text-center">
            <Button  @click="cancel">取消</Button>
            <Button  type="primary"  @click="ok">确定</Button>
        </div>
    </Modal>

     

</div>
	

	
</template>	
<script>
    export default {
        data() {
            return {

                obj: {},
                
                modal: false,
            	inputValue:'',
            	options1: [],
            	loading1:false,
            	selectID:'',
            	flag:false,

                salePersonList: [],
                formValidate:{
                    salePerson:'',
                    salePersonName:'',
                },
                ruleValidate:{
                    salePerson: [
                        { required: true, message: '请选择销售经理', trigger: 'change' }
                    ],
                },

            	companiesInfo_model:{},
                companiesInfo_flag:false,

            	storeInfoForm_model:{},
            	storeInfoForm_flag:false,

            	cooperationInfo_model:{},
            	cooperationInfo_flag:false,

            	carSourceInfo_model:{},
            	carSourceInfo_flag:false,

            	businessPerson_model:{},
            	businessPerson_flag:false,  

            	dealerLevel_model:{},
            	dealerLevel_flag:false,

            	marginDelivery_model:{},
            	marginDelivery_flag:false,

            	shroffNumber_model:{},
            	shroffNumber_flag:false,

            	satrapUser_model:{},
            	satrapUser_flag:false,

            	filesForm_model:{},
            	filesForm_flag:false





            }
        },
   
        methods: {
            // 取消模态框
            cancel(){
                this.$refs['formValidate'].resetFields();
                this.modal = false;
            },
            // 确认提交
            ok(){
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.submitFn();
                    } else{
                        this.$Message.error('表单验证失败')
                    }
                })
            },
            // 切换经理
            changeSalePerson(v){
                this.formValidate.salePersonName = v.label;
            },
        	// 提交
        	submit(){

                Promise.all([

                    this.$refs['companiesInfo_ref'].handleSubmit(),

                    this.$refs['storeInfoForm_ref'].handleSubmit(),
            
                    this.$refs['cooperationInfo_ref'].handleSubmit(),

                    this.$refs['carSourceInfo_ref'].handleSubmit(),

                    this.$refs['businessPerson_ref'].handleSubmit(),

                    this.$refs['marginDelivery_ref'].handleSubmit(),

                    this.$refs['shroffNumber_ref'].handleSubmit(), 

                    this.$refs['satrapUser_ref'].handleSubmit(),

                    this.$refs['dealerLevel_ref'].handleSubmit(),

                    this.$refs['filesForm_ref'].handleSubmit(),

                    ]).then((data)=>{
                           
                    this.modal = true;
               
                }).catch((error) => {

                  this.$Message.error('表单验证失败')

                })
        		
        	},
            // 保存方法
            submitFn(){

                let _this = this;
                let json = {

                    approvalDomain: this.formValidate.salePerson,
                    approvalName: this.formValidate.salePersonName,

                    tbChannelShopInfoDTO: {
                        shopHeadAttachmentObj: this.storeInfoForm_model.img,
                        shopName: this.storeInfoForm_model.name,
                        detailAddress: this.storeInfoForm_model.addressMore,
                        provinceCode: this.storeInfoForm_model.address[0],
                        cityCode: this.storeInfoForm_model.address[1] || '',
                        districtCode: this.storeInfoForm_model.address[2] || '',
                        province: this.storeInfoForm_model.addressName[0],
                        city: this.storeInfoForm_model.addressName[1] || '',
                        district: this.storeInfoForm_model.addressName[2] || '',
                        shopAttribute: this.storeInfoForm_model.typeArr.join(','),
                        
                        mainName: this.companiesInfo_model.mainName,
                        mainType: this.companiesInfo_model.mainType,
                        creditCode: this.companiesInfo_model.creditCode,
                        mainId: this.companiesInfo_model.id,
                        businessAttachmentObj: this.companiesInfo_model.businessAttachmentObj,
                    },

                    tbChannelBusinessInfoDTO:{
                        contacterInfoDto:{
                            name: this.businessPerson_model.name,
                            positionCode: this.businessPerson_model.job,
                            phone: this.businessPerson_model.phone,
                            email: this.businessPerson_model.email
                        },
                        firstSubject: this.cooperationInfo_model.subjectValue[0],
                        secondSubject: this.cooperationInfo_model.subjectValue[1],
                        cashDeposit: this.marginDelivery_model.money * 1,
                        cashDepositAttachment: this.marginDelivery_model.img,
                        unlimitBrand: this.carSourceInfo_model.brandType,
                        busiClass: this.cooperationInfo_model.type.join(','),
                        evaluationValueFloat: this.cooperationInfo_model.isFloat,
                        branchCompanyCode: this.cooperationInfo_model.companyCode,
                        branchCompanyName: this.cooperationInfo_model.company,
                        vehicleFrom: this.carSourceInfo_model.source.join(','),
                        vehicleType: this.carSourceInfo_model.type.join(','),
                        reportSubject: this.cooperationInfo_model.submission.join(','),
                        clueFrom: this.cooperationInfo_model.source.join(','),
                        rentAttribute: this.cooperationInfo_model.lease.join(','),

                        rentLevel: this.dealerLevel_model.level,
                        superiorRent: this.dealerLevel_model.topLevelCode,

                        channelBusinessCarDTOList: function () {
                            return _this.carSourceInfo_model.brandList.map(item => {
                                return {
                                    mastbrandId: item.brand[0],
                                    mastbrand: item.brandName[0],
                                    makeId:item.brand[1],
                                    make:item.brandName[1],
                                    startDate: item.time[0],
                                    endDate:item.time[1],
                                    channelAttachmentDto: item.img
                                }
                            })
                        }()

                    },
                    channelBankAccountDTO:{
                        paymentName: this.shroffNumber_model.customBusinessName,
                        accountType: this.shroffNumber_model.accountType,
                        openAccountName: this.shroffNumber_model.openAccountName,
                        openBankName: this.shroffNumber_model.bankBatchName,
                        ownedBankId: this.shroffNumber_model.bankId,
                        paymentAccount: this.shroffNumber_model.accountCode,
                        ownedBankElectronicLine: this.shroffNumber_model.accountNumber,

                        openBankAccountProId: this.shroffNumber_model.address[0],
                        openBankAccountPro: this.shroffNumber_model.addressName[0],
                        openBankAccountCityId: this.shroffNumber_model.address[1],
                        openBankAccountCity: this.shroffNumber_model.addressName[1],
                        receivableContacter: this.shroffNumber_model.payee,
                        receivablePhone: this.shroffNumber_model.payeePhone,
                        receivableEmail: this.shroffNumber_model.payeeEmail,
                        paymentBusiType: this.shroffNumber_model.receiptType.join(','),
                        attachmentList: [this.shroffNumber_model.receiptAccountImg],
                    },
                    channelDatumDTO:{
                        attachmentList: function(){
                            return  _this.filesForm_model.list.map(item => {
                                return item.img
                            })
                        }()
                    },
                    channelUserAccountDTO:{
                        employeeName: this.satrapUser_model.name,
                        userName: this.satrapUser_model.user,
                        telephone: this.satrapUser_model.phone,
                        email: this.satrapUser_model.email,
                    },




                }

                this.$http.post("/rentAgentController/submitRentAgent", json).then((resp) => {

                    if (resp.data.success) {

                        this.$Message.success({
                            content: '提交成功！',
                            onClose: () => {
                                this.$Modal.remove();
                                this.back();
                            }
                        });
                    }else{
                        this.$Message.error(resp.data.errorMessage);
                    }

                })
            },

            // 销售经理列表
           getSalePerson(){
                this.$http.post("/rentAgentController/selectRentChargerByUserChargerAccount",{}).then((resp)=>{
                    if(resp.data.success){
                         this.salePersonList = resp.data.data;
                    };
                  })
           },
           // 返回
           back(){
                this.$bus.$emit("dealerClassificationList", {
                    id: "dealerClassificationList",
                    name: "经销商一览",
                    refresh: true,
                    closeName: "dealerClassificationAdd"
                });
           },
        
        	
           // 点击模糊搜索项
            changeSelect(id) {
                if (!id) {
                    return;
                }
                this.flag = true;
                this.$nextTick(()=>{
                    this.selectID = id;
                })

            },
            remoteMethod1(query) {
                if (query !== '') {
                    this.loading1 = true;

                    let params = {
                        mainName: query,
                        mainType: '0',
                        current: 1,
                        pageSize: 10000
                    }

                    this.handleTime = new Date().getTime();

                    setTimeout(() => {
                        if (new Date().getTime() - this.handleTime >= 500) {
                            this.$http.post("/tbChannelMainInfo/selectMainInfoByName", params).then((resp) => {
                                if (resp.data.success) {
                                    this.loading1 = false;
                                    this.options1 = resp.data.data.data;
                                    console.log(this.options1)
                                };
                            })
                        }
                    }, 500)

                } else {
                    this.options1 = [];
                }
            },

            
        },
        mounted() {
            this.obj = Object.assign({},this.$attrs.params)

            this.getSalePerson();
        }

    }
</script>
<style type="text/css" scoped>
   .search-title{
        font-weight: bold;
        font-size: 14px
   }
   .imgDiv{
    width:100px;
    height:100px;
   }
   .noResult{
        color:#127efc;
        float:right;
        font-size: 13px;
        cursor: pointer;
   }
 
</style>
 