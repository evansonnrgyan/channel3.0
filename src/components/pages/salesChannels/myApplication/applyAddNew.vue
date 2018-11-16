<!--新增渠道 - 详情-->
<template>
  <div >
      <!-- 申请事项 -->
      <headerInfo :info="info" />

      <!--申请原因-->
      <!-- <applicationReason :info="info" /> -->

      <!-- 店面信息 -->
     <commonTitle title="店面信息">
            <storeInfo :pid="shopId" :channelId="obj.channelId" ></storeInfo>
     </commonTitle>

     <commonTitle title="合作信息">
        <cooperationInfo ref="cooperationInfo_ref" :value.sync="cooperationInfo_model" :edit="false" ></cooperationInfo>
    </commonTitle>

    <commonTitle title="车源信息">
            <carSourceInfo ref="carSourceInfo_ref" :value.sync="carSourceInfo_model" :edit="false"></carSourceInfo>
     </commonTitle>

     <commonTitle title="保证金交付" v-if="marginDeliveryShow">
            <marginDelivery ref="marginDelivery_ref" :value.sync="marginDelivery_model" :edit="false"></marginDelivery> 
     </commonTitle>

     <commonTitle title="联系人">
            <contactInfo :pid="obj.channelId" :edit="false" ></contactInfo>
     </commonTitle>

     <commonTitle title="收款信息">
            <collectionInfoTable :pid="obj.channelId" :workFlowId="obj.workFlowId" />
     </commonTitle>

     <commonTitle title="主管账号">
             <satrapUserTable :value.sync="satrapUserTable_model"></satrapUserTable>
     </commonTitle>

     <!-- 上线资料  -->
    <commonTitle title="上线资料">
        <filesForm ref="filesForm_ref" :value.sync="filesForm_model" :edit="false"></filesForm>
    </commonTitle>

    <!-- 其他资料 -->
    <commonTitle title="其他资料（最多10个）" v-if="otherFile_flag">
        <otherAttachments :value.sync="otherAttachments_model" attachmentCode="0000000034" :edit="false"></otherAttachments>
    </commonTitle>

    <commonTitle title="审批记录">
             <ApprovalTable :workFlowId="obj.workFlowId" />
    </commonTitle>

    <dynamicButtons :pid="shopId" :channelId="obj.channelId"  :obj="obj" closeName="applyAddNew" />  

  </div>
</template>

<script>
  export default {
    name: "",
    data () {
      return {

        obj:{},
        shopId:'',
        info:{},

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
          marginDeliveryShow:false,

        satrapUserTable_model: [],

         // 上线资料
          filesForm_model:{
              list:[]
          },

          // 其他附件
          otherAttachments_model:{
              list:[]
          },
          otherFile_flag:false,

         
      }
    },
    methods: {

          // 获取审批状态
          init_data(){
              let params = {
                  workFlowId: this.obj.workFlowId,
              }
              this.$http.post('/channelWfpt/applyInfo', params).then(resp=>{
                  if(resp.data.success){
                      this.info = resp.data.data;

                  }
              })
          },

        // 获取主管账号
            getThree(){
                let json = {
                    channelId: this.obj.channelId
                };
                this.$http.post('/user/account/getManagerById',json).then(resp => {
                    if (resp.data.success) {
                      this.satrapUserTable_model = resp.data.data? [resp.data.data] : [];
                    }
                })
            },

             // 返显第四步
            returnFour(){
                let json = {
                    workFlowId: this.obj.workFlowId
                }
                this.$http.post('/channelDatumController/queryDatumByWorkFlowId', json).then(resp => {
                    if (resp.data.success) {
                        let data = resp.data.data;

                        let arr1 = data.filter(item => {
                            return item.attachmentCode !== '0000000034'
                        })

                        this.filesForm_model.list = arr1.map(item => {
                            item.img = item
                            return item;
                        })

                        let arr = data.filter(item => {
                            return item.attachmentCode === '0000000034'
                        })
                        if(arr.length>0){
                            this.otherFile_flag = true
                        }else{
                            this.otherFile_flag = false
                        }

                        this.otherAttachments_model.list = arr;

                    }
                })
            },
              

          // 返显第一步数据
            returnOne(){
                let json = {
                    workFlowId: this.obj.workFlowId,
                } 
                this.$http.post('/tbChannelBusiness/getChannelBusinessApp',json).then(resp => {
                    if (resp.data.success) {
                        this.submitObj = resp.data.data;
                        this.shopId = resp.data.data.shopId;

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
                                this.marginDelivery_model.money = this.submitObj.cashDeposit + '';
                                this.marginDelivery_model.img = this.submitObj.cashDepositAttachment;
                            })
                            
                        }

                        // 判断拓展模块 -租赁代理评级 显示
                        this.rentLevel = this.submitObj.rentLevel;

                        this.returnFour();
                      
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
    },

    mounted () {

       this.obj = Object.assign({},this.$attrs.params);

       this.init_data();
       this.getOne();
        this.getThree();
     
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



