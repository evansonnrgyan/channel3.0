<!-- 驳回重传打款凭证 -编辑-详情-->
<template>
    <div class="" >
        <!-- 申请事项 -->
        <headerInfo :info.sync="info" />

        <common-title title="店面信息">
            <storeInfo :pid="shopId" :channelId="obj.channelId"></storeInfo>
        </common-title>

        <commonTitle title="合作信息">
            <cooperationInfo ref="cooperationInfo_ref" :value.sync="cooperationInfo_model" :edit="false" ></cooperationInfo>
        </commonTitle>

        <commonTitle title="保证金交付">
            <marginDelivery ref="marginDelivery_ref" :value.sync="marginDelivery_model" :edit="editFlag" />
        </commonTitle>

        <commonTitle title="审批记录">
            <ApprovalTable :workFlowId="obj.workFlowId" />
        </commonTitle>

        <poFooter  v-if="obj.type === 'reject'">
          <Button :loading="loading" v-for="item in btnsList" type="primary" size="large" @click="clickFn(item)">{{item.displayName}}</Button>
        </poFooter>

        <div v-else>
          <dynamicButtons :pid="shopId" :channelId="obj.channelId"  :obj="obj" closeName="editReupload"/>  
        </div>

       
    </div>
</template>

<script>
    export default {
        name: "",
        data(){
            return {
                loading: false,
                obj:{},
                editFlag:false,

                id: "",
                shopId: "",
                channelId: "",
                info: {},
              
                // 合作信息
                cooperationInfo_model:{
                    subjectArr:[],
                    subjectValue:[],
                    cooperativeValue:[],
                    cooperativeName:[],
                    filedArr:[],
                    isFloat:'',
                    company:'',
                    companyName:'',
                    timesType:'0',
                    startDate:'',
                    endDate:'',
                },

                // 车源信息
                carSourceInfo_model:{
                    filedArr:[],
                    brandList:[]
                },

                // 保证金
                marginDelivery_model:{
                    money:'',
                    img:{}
                },

                btnsList: [],
                currentBtn: {},
            }
        },
        methods:{

             // 获取按钮
            getBtns(){
              let json = {
                    workFlowId: this.obj.workFlowId,
                };
                this.$http.post('/channelWfpt/getApprovalBtnList',json).then(resp => {

                    if (resp.data.success) {
                       this.btnsList = resp.data.data || [];
                    }
                })
            },
            // 点击按钮
            clickFn(item){
                this.currentBtn = item;
                this.save();
            },

          // 跳转提交页
            toSubmit(){
                this.obj.openTo = 'editReupload';
                this.$bus.$emit("submitShow",{id: "submitShow", closeName:'editReupload', refresh:true, isShow:true, name:"提交成功" , params: this.obj });
            },


            init_data(){
                let params = {
                    workFlowId: this.obj.workFlowId,
                }
                this.$http.post('/channelWfpt/applyInfo', params).then(resp=>{
                    if(resp.data.success){
                        let parentData = resp.data.data;
                        this.shopId = parentData.shopId;
                        this.info = parentData;

                        this.getOne();
                    }
                })
            },
            // 获取第一步
            getOne(){
                let json = {
                    id: this.obj.channelId,
                }
                this.$http.post('/businessConfigure/initBusinessPackage',{id: null}).then(resp => {
                    if (resp.data.success) {
                        let data  = resp.data.data.fieldList;
                        // 渠道科目
                        this.cooperationInfo_model.subjectArr = data.filter(item => {
                            return item.code === 'firstSubject'
                        })

                        // 合作信息其他字段
                        this.cooperationInfo_model.filedArr = data.filter(item => {
                            return item.code !== 'firstSubject' && item.code !== 'guaranteeFlag' && item.code !== 'vehicleType' && item.code !== 'vehicleFrom'
                        })

                        this.carSourceInfo_model.filedArr = data.filter(item => {
                            return item.code === 'vehicleType' || item.code === 'vehicleFrom'
                        })


                        // 返显第一步
                        this.returnOne();

                    }
                })
            },
            returnOne(){
                let json = {
                    workFlowId: this.obj.workFlowId
                }
                this.$http.post('/tbChannelBusiness/getChannelBusinessApp',json).then(resp => {
                    if (resp.data.success) {
                        this.submitObj = resp.data.data;

                        console.log(this.submitObj, '合作信息')

                        this.cooperationInfo_model.subjectValue = [this.submitObj.firstSubject,this.submitObj.secondSubject];
                        this.cooperationInfo_model.cooperativeValue = this.submitObj.cooperationCode? this.submitObj.cooperationCode.split(','): [];
                        this.cooperationInfo_model.cooperativeName = this.submitObj.cooperationName? this.submitObj.cooperationName.split(','): [];
                        this.cooperationInfo_model.isFloat = this.submitObj.evaluationValueFloat;
                        this.cooperationInfo_model.companyName = this.submitObj.branchCompanyName;
                        this.cooperationInfo_model.company = this.submitObj.branchCompanyCode;
                        this.cooperationInfo_model.startDate = this.submitObj.busiStartDate;
                        this.cooperationInfo_model.timesType = '1';
                        this.cooperationInfo_model.endDate = this.submitObj.busiEndDate;
                        this.carSourceInfo_model.brandType = this.submitObj.unlimitBrand;

                        this.cooperationInfo_model.filedArr.map(item => {
                            item.defaultValueList = this.submitObj[item.code]? this.submitObj[item.code].split(',') : []
                        })

                        this.carSourceInfo_model.filedArr.map(item => {
                            item.defaultValueList = this.submitObj[item.code]? this.submitObj[item.code].split(',') : []
                        })

                        this.cooperationInfo_model.filedArr = this.cooperationInfo_model.filedArr.filter(item => {
                            return item.defaultValueList.length > 0
                        })

                        this.carSourceInfo_model.filedArr = this.carSourceInfo_model.filedArr.filter(item => {
                            return item.defaultValueList.length > 0
                        })

                        if(this.carSourceInfo_model.brandType === '0' && this.submitObj.channelBusinessCarDTOList.length > 0){
                            this.carSourceInfo_model.brandList = [];
                            this.submitObj.channelBusinessCarDTOList.map(item => {
                                this.carSourceInfo_model.brandList.push({
                                    brand: [item.mastbrandId,item.makeId],
                                    brandName: [item.mastbrand,item.make],
                                    time: [item.startDate,item.endDate],
                                    img: item.channelAttachmentDto,
                                    timeFlag: item.unlimited === '1' ? true : false
                                })
                            })
                        }
                        if(this.submitObj.cashDepositStatus && this.submitObj.cashDepositStatus === '1'){
                            this.marginDeliveryShow = true;
                            this.$nextTick(()=>{
                                this.marginDelivery_model.money = this.submitObj.cashDeposit || this.submitObj.cashDeposit === 0 ? this.submitObj.cashDeposit+'' : '';
                                this.marginDelivery_model.img = this.submitObj.cashDepositAttachment || {};
                            })
                            
                        }

                        // 判断拓展模块 -租赁代理评级 显示
                        this.rentLevel = this.submitObj.rentLevel;


                    }
                })
            },
           
            // 提交
            save(){
               Promise.all([this.$refs['marginDelivery_ref'].handleSubmit()]).then((data)=>{

                    this.loading = true;

                    let json = {
                        id: this.obj.channelId,
                        workFlowId: this.obj.workFlowId,
                        cashDepositStatus: '1',
                        cashDeposit: this.marginDelivery_model.money * 1,
                        cashDepositAttachment: this.marginDelivery_model.img,
                    };
                    this.$http.post('/tbChannelBusiness/updateCashDeposit',json).then(resp => {
                        if (resp.data.success) {
                            this.submitFn();
                        }

                        this.loading = false;
                    })

               }).catch((error) => {
                  this.$Message.error('表单验证失败')
                })
            },
            // 提交发起流程
            submitFn(){
                let json = {
                    channelId: this.obj.channelId,
                    buttonId: this.currentBtn.btnId || null,
                    taskId: this.currentBtn.taskId || null,
                };
                this.$http.post('/channelAdmittance/channelAdmittanceCommit',json).then(resp => {
                    if (resp.data.success) {
                        this.$Message.success('提交成功！');
                        // 跳转提交页
                        this.toSubmit();
                    }
                })
            },

        },
        created(){
            this.obj = Object.assign({},this.$attrs.params);
            if(this.obj.type === 'reject'){
                this.editFlag = true;
            }else{
                this.editFlag = false;
            }
        },
        mounted(){
            // TODO 参数修改
            this.init_data();

            // 驳回后编辑
            if(this.obj.type === 'reject'){
                this.getBtns();
            }
        }
    }
</script>

<style>
    .padding10{
    padding: 10px 0 10px 0;
  }

  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ztree-style{
    position: relative;
    border: 1px solid #ccc;
    left: 146px;
    width: 300px;
  }
  .cancel-approval{
    padding:10px;
    text-align: center;
    background: rgba(255,255,255,0.9)
  }

  
</style>
