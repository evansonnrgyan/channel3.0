<!--申请变更业务信息-->
<template>
  <div class="busi-info-edit">
    <!-- 店面信息 -->
    <commonTitle title="店面信息">
            <storeInfo :pid="shopId" :channelId="channelId"></storeInfo>
     </commonTitle>

     <div class="lineDiv"></div>

      <Tabs  :animated="false" class="showDiv">
        <TabPane label="展业信息">

          <!-- 合作信息 -->
          <commonTitle title="合作信息">
            <cooperationInfo ref="cooperationInfo_ref" :value.sync="cooperationInfo_model" :edit="true"  type="changeBusiness"></cooperationInfo>
          </commonTitle>

          <!-- 车源信息 -->
          <commonTitle title="车源信息">
            <carSourceInfo ref="carSourceInfo_ref" :value.sync="carSourceInfo_model" :edit="true"></carSourceInfo>
          </commonTitle>

        </TabPane>
        <TabPane label="收款信息" style="padding: 0px 10px 0px 10px;">

          <cardList :pid="channelId" :value.sync="cardList"  :isEdit="true" :show="true" @reload="getTwo" type="changeBusiness" :shopId="shopId" :subjectValue="cooperationInfo_model.subjectValue"></cardList>

        </TabPane>
      </Tabs>

        <poFooter  v-if="obj.type === 'reject'">
          <Button v-for="item in btnsList" type="primary" size="large" @click="clickFn(item)">{{item.displayName}}</Button>
        </poFooter>

      <poFooter v-else>
        <Button type="primary" size="large" @click="save">提交</Button>
      </poFooter>

      <applyCommonModal ref="applyCommonModal" :flag.sync="modal" :remark.sync="remark" @ok="ok" />

  </div>
</template>

<script>
  export default {
    name: "busiInfoEdit",
    data () {
      return {
        obj:{},

        // 渠道ID
        channelId: '',
        shopId:'',

        // 合作信息
        cooperationInfo_model:{
            subjectArr:[],
            subjectValue:[],
            cooperativeValue:[],
            cooperativeValue_single: '',
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

          cardList:[],

          modal:false,

          remark:'',

          btnsList:[],
          currentBtn: {},

          submitObj:{},

          // 动态字段
          AllfieldList: [],
    
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

      // 返显第一步数据
            returnOne(){

                let url,json;
                if(this.obj.type === 'new'){
                  url = "/tbChannelBusiness/getChannelBusiness";
                  json = {
                      id: this.channelId,
                  } 
                }else
                if(this.obj.type === 'reject'){
                  url = "/tbChannelBusiness/getChannelBusinessApp";
                  json = {
                    workFlowId: this.obj.workFlowId,
                  }
                } 

                this.$http.post(url, json).then(resp => {
                    if (resp.data.success) {
                        this.shopId = resp.data.data.shopId;
                        this.submitObj = resp.data.data;


                        this.cooperationInfo_model.subjectValue = [this.submitObj.firstSubject,this.submitObj.secondSubject];

                        // 多选
                        if(this.submitObj.secondSubject === '0497000300000'){
                            this.cooperationInfo_model.cooperativeValue = this.submitObj.cooperationCode? this.submitObj.cooperationCode.split(','):[];
                            
                        // 单选
                        }else{
                            this.cooperationInfo_model.cooperativeValue_single = this.submitObj.cooperationCode;
                        }

                        this.cooperationInfo_model.cooperativeName = this.submitObj.cooperationName? this.submitObj.cooperationName.split(','): [];
                        this.cooperationInfo_model.isFloat = this.submitObj.evaluationValueFloat;
                        this.cooperationInfo_model.companyName = this.submitObj.branchCompanyName;
                        this.cooperationInfo_model.company = this.submitObj.branchCompanyCode;
                        this.cooperationInfo_model.startDate = this.submitObj.busiStartDate;
                        this.cooperationInfo_model.timesType = '1';
                        this.cooperationInfo_model.endDate = this.submitObj.busiEndDate;
                        this.carSourceInfo_model.brandType = this.submitObj.unlimitBrand;

                        this.cooperationInfo_model.filedArr.map(item => {
                            let newArr = this.submitObj[item.code]? this.submitObj[item.code].split(',') : [];
                            item.defaultValueList = newArr.filter(elem => {
                                return item.checkedValueList.includes(elem)
                            })
                        })

                        this.carSourceInfo_model.filedArr.map(item => {
                            let newArr = this.submitObj[item.code]? this.submitObj[item.code].split(',') : [];
                            item.defaultValueList = newArr.filter(elem => {
                                return item.checkedValueList.includes(elem)
                            })
                        })


                        if(this.carSourceInfo_model.brandType === '0' && this.submitObj.channelBusinessCarDTOList.length > 0){
                            this.carSourceInfo_model.brandList = [];
                            if(this.obj.type === 'reject'){
                              this.submitObj.channelBusinessCarDTOList = this.submitObj.channelBusinessCarDTOList.filter(item => {
                                  return item.operateType !== 'delete';
                              })
                            }
                            this.submitObj.channelBusinessCarDTOList.map(item => {
                                this.carSourceInfo_model.brandList.push({
                                    brand: [item.mastbrandId,item.makeId],
                                    brandName: [item.mastbrand,item.make],
                                    time: [item.startDate,item.endDate],
                                    img: item.channelAttachmentDto,
                                    timeFlag: item.unlimited === '1' ? true : false,
                                    id: item.id,
                                    businessCarId: item.businessCarId || null,
                                })
                            })
                        }
                     

                        // 判断拓展模块 -租赁代理评级 显示
                        // this.rentLevel = this.submitObj.rentLevel;
                      
                    }
                })
            },
            // 获取第一步
            getOne(){
                let json = {
                    id: this.channelId,
                } 
                this.$http.post('/tbChannelBusiness/initPage',json).then(resp => {
                    if (resp.data.success) {
                        let data  = resp.data.data.fieldList;

                        this.AllfieldList = data;

                        // 渠道科目
                        this.cooperationInfo_model.subjectArr = data.filter(item => {
                            return item.code === 'firstSubject' && item.checkedValueList.length>0
                        })
                        // 合作信息其他字段
                        this.cooperationInfo_model.filedArr = data.filter(item => {
                            return item.enabled === '1' && item.code !== 'firstSubject' && item.code !== 'guaranteeFlag' && item.code !== 'vehicleType' && item.code !== 'vehicleFrom' && item.checkedValueList.length>0
                        })

                        let arr1 = data.filter(item => {
                            return item.enabled === '1' && item.code === 'vehicleType' && item.checkedValueList.length>0
                        })

                        let arr2 = data.filter(item => {
                            return item.enabled === '1' &&  item.code === 'vehicleFrom' && item.checkedValueList.length>0
                        })
                        
                        this.carSourceInfo_model.filedArr = [...arr1,...arr2];

                        // 保证金
                        let marginDelivery = data.filter(item => {
                            return item.enabled === '1' && item.code === 'guaranteeFlag' 
                        });
                        if(marginDelivery.length>0){
                            this.marginDeliveryShow = true
                        }else{
                            this.marginDeliveryShow = false
                        }

                        // 返显第一步
                        this.returnOne();

                    }
                })
            },
            // 加载收款信息列表
              getTwo(){

                let url,json;
                if(this.obj.type === 'new'){
                  url = "/bank/account/getBankAccountList";
                  json = {
                      channelId: this.channelId,
                  } 
                }else
                if(this.obj.type === 'reject'){
                  url = "/bank/account/getBankAccountAppList";
                  json = {
                    channelId: this.channelId,
                    workFlowId: this.obj.workFlowId,
                  }
                } 

                 this.$http.post(url, json).then((resp)=>{
                    if(resp.data.success){
                        let data = resp.data.data;
                       
                        if(this.obj.type === 'new'){
                          data.map(item => {
                             item.closeFlag = false;
                             item.enabledBoolean = item.enabled === '0'? false : true;
                          })
                        }else
                        if(this.obj.type === 'reject'){
                          data.map(item => {
                             item.closeFlag = item.bankAccountId? false : true;
                             item.enabledBoolean = item.enabled === '0'? false : true;
                          })
                        }
                        
                        this.cardList = data;
                    };
                  })
              },

              back(){
                 this.$bus.$emit("editChannel", {id:"editChannel",name:"编辑渠道",closeName:'busiInfoEdit'});
              },

              save(){

                Promise.all([this.$refs['cooperationInfo_ref'].handleSubmit(),this.$refs['carSourceInfo_ref'].handleSubmit()]).then((data)=>{

                  if(!this.cardList.length>0){

                      this.$Message.error('收款信息不能为空')
                    }else{

                      let arr = this.cardList.filter(item => {
                          return item.enabledBoolean === true
                      })
                      if(arr.length>0){
                        this.modal = true;
                      }else{
                        this.$Message.error('收款信息不能都为停用状态！')
                      }
                      
                    }
                }).catch((error) => {
                  this.$Message.error('展业信息填写不全！')
                })

              },

              ok(){
                if(this.remark === ''){
                  this.$Message.error('请填写申请原因');
                  return;
                }

                this.$refs['applyCommonModal'].loading_btn = true;

                this.cardList.map(item => {
                    item.enabled = item.enabledBoolean? '1' : '0';
                    item.operateType = item.id? 'update' : 'add';
                })


                // 动态字段清空
                this.AllfieldList.map(item => {
                    this.submitObj[item.code] = '';
                })

                this.submitObj.firstSubject = this.cooperationInfo_model.subjectValue[0];
                this.submitObj.secondSubject = this.cooperationInfo_model.subjectValue[1];
                this.submitObj.cooperationCode = this.cooperationInfo_model.subjectValue[1] === '0497000300000'? this.cooperationInfo_model.cooperativeValue.join(',') : this.cooperationInfo_model.cooperativeValue_single,
                this.submitObj.cooperationName = this.cooperationInfo_model.cooperativeName.join(',');
                this.submitObj.evaluationValueFloat = this.cooperationInfo_model.isFloat;
                this.submitObj.branchCompanyName = this.cooperationInfo_model.companyName;
                this.submitObj.branchCompanyCode = this.cooperationInfo_model.company;
                this.submitObj.busiStartDate = this.cooperationInfo_model.startDate;
                this.submitObj.busiEndDate = this.cooperationInfo_model.endDate;
                this.submitObj.unlimitBrand = this.carSourceInfo_model.brandType;
                this.submitObj.channelBankAccountDTOList = this.cardList;
                this.submitObj.applyReason = this.remark;

                // this.submitObj.workFlowId = this.obj.workFlowId || null,
                this.submitObj.buttonId = this.currentBtn.btnId || null;
                this.submitObj.taskId = this.currentBtn.taskId || null;
                  

                 this.cooperationInfo_model.filedArr.map(item => {
                    this.submitObj[item.code] = item.defaultValueList.join(',');
                })
                this.carSourceInfo_model.filedArr.map(item => {
                    this.submitObj[item.code] = item.defaultValueList.join(',');
                })

                if(this.carSourceInfo_model.brandType === '0'){
                    this.submitObj.channelBusinessCarDTOList = [];
                    this.carSourceInfo_model.brandList.map(item => {
                        this.submitObj.channelBusinessCarDTOList.push({
                            mastbrandId: item.brand[0],
                            mastbrand: item.brandName[0],
                            makeId:item.brand[1],
                            make:item.brandName[1],
                            startDate: this.$formatDate(item.time[0]),
                            endDate:this.$formatDate(item.time[1]),
                            channelAttachmentDto: item.img,
                            unlimited: item.timeFlag? '1' : '0',
                            operateType: item.id? 'update' : 'add',
                            id: item.id,
                            businessCarId: item.businessCarId || null
                        })
                    })
                }else{
                  this.submitObj.channelBusinessCarDTOList = [];
                }

            
                 this.$http.post("/tbChannelBusiness/submitChangeChannelBusiness",this.submitObj).then((resp)=>{
                    if (resp.data.success) {
                        this.$Message.success('提交成功');
                        let workFlowId = resp.data.data.workFlowId;

                        // 跳转提交页
                          this.$bus.$emit("submitShow", {id:"submitShow",name:"提交成功",closeName:'busiInfoEdit',refresh:true,params:{channelId: this.channelId , workFlowId: workFlowId, openTo:'modifyBusiInfo'}});

                    }

                    this.$refs['applyCommonModal'].loading_btn = false;
                  })
              }
    },
    mounted(){
  
       
  
            this.obj = Object.assign({},this.$attrs.params);
            this.channelId = this.obj.channelId;
            this.shopId = this.obj.shopId;
            
             // 首次变更
            if(this.obj.type === 'new'){

            }else
            // 驳回后编辑
            if(this.obj.type === 'reject'){
                this.getBtns();
            }

            this.getOne();
            this.getTwo();
    }
  }
</script>

<style>
  .showDiv .ivu-tabs-bar{
    margin: auto 30px;
    border-bottom: 3px solid #e6e9f1 !important;
  }
</style>
