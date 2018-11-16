<!--修改合作期限-详情-->
<template>
  <div>
      <!-- 申请事项 -->
      <headerInfo :info="info" />

      <!--申请原因-->
      <!-- <applicationReason :info="info" /> -->

      <div class="reDiv">
        <Form :label-width="130">
          <Row>
              <Col span="12">
                <Col span="24">
                   <FormItem label="申请类型" prop="">
                     {{selectList[submitObj.applyBusiType]}}
                  </FormItem>
                </Col>

                <Col span="24">
                  <FormItem label="更新合作时间" prop="">
                     {{$formatDate(this.cooperationInfo_model.startDate) + ' - ' + $formatDate(this.cooperationInfo_model.endDate)}}
                  </FormItem>
                </Col>

                <Col span="24">
                <FormItem label="申请原因" prop="">
                   {{info.applyReason}}
                </FormItem>
              </Col>

              </Col>
              <Col span="12" v-if="imgFlag">
                <FormItem label="新合作协议" prop="">
                  <oneFile :value.sync="img"  :btns="['show','down']"></oneFile>
                </FormItem>
              </Col>
            </Row>
           
          </Form>
      </div>

      <!-- 店面信息 -->
       <commonTitle title="店面信息">
              <storeInfo :pid="shopId" :channelId="channelId"></storeInfo>
       </commonTitle>

       <commonTitle title="合作信息">
          <cooperationInfo ref="cooperationInfo_ref" :value.sync="cooperationInfo_model"  :edit="false"  type="changeCooperationPeriod"></cooperationInfo>
      </commonTitle>
     
      <commonTitle title="审批记录">
               <ApprovalTable :workFlowId="obj.workFlowId" />
      </commonTitle>

      <dynamicButtons :pid="shopId" :channelId="channelId"  :obj="obj" closeName="editCooperationTerm"/>  

  </div>
</template>

<script>
  export default {
    name: "",
    data () {
      return {

        obj:{},
        channelId: '',
        shopId:'',
        info:{},
        img:{},

        imgFlag:false,

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
        submitObj:{},

        // 选择申请事项
        selectList: {
            '050100000': "原合作时间有误",
            '050100001': "新合同",
            '050100002': "其他原因",
        }

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

           // 返显第一步数据
            returnOne(){
                let json = {
                    workFlowId: this.obj.workFlowId,
                } 
                this.$http.post('/tbChannelBusiness/getChannelBusinessApp',json).then(resp => {
                    if (resp.data.success) {
                        this.shopId = resp.data.data.shopId;
                        this.submitObj = resp.data.data;


                        this.cooperationInfo_model.subjectValue = [this.submitObj.firstSubject,this.submitObj.secondSubject];
                        this.cooperationInfo_model.cooperativeValue = this.submitObj.cooperationCode? this.submitObj.cooperationCode.split(','): [];
                        this.cooperationInfo_model.cooperativeName = this.submitObj.cooperationName? this.submitObj.cooperationName.split(','): [];
                        this.cooperationInfo_model.isFloat = this.submitObj.evaluationValueFloat;
                        this.cooperationInfo_model.companyName = this.submitObj.branchCompanyName;
                        this.cooperationInfo_model.company = this.submitObj.branchCompanyCode;
                        this.cooperationInfo_model.startDate = this.submitObj.busiStartDate;
                        this.cooperationInfo_model.timesType = '1';
                        this.cooperationInfo_model.endDate = this.submitObj.busiEndDate;

                        this.cooperationInfo_model.filedArr.map(item => {
                            item.defaultValueList = this.submitObj[item.code]? this.submitObj[item.code].split(',') : []
                        })

                        this.cooperationInfo_model.filedArr = this.cooperationInfo_model.filedArr.filter(item => {
                            return item.defaultValueList.length > 0
                        })


                        //this.applyBusiType = this.submitObj.applyBusiType;

                        if(this.submitObj.attachments && this.submitObj.attachments.length > 0){
                           let arr = this.submitObj.attachments.filter(item => {
                            return item.attachmentCode === "0000000011";
                          });
                           if(arr.length > 0){
                              this.img = arr[0];
                              this.imgFlag = true;
                           }else{
                              this.img = {};
                              this.imgFlag = false;
                           }
                           
                        }
                    }
                })
            },
            // 获取第一步
            getOne(){
                let json = {
                    id: this.channelId,
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


                        // 返显第一步
                        this.returnOne();

                    }
                })
            },

    },

    mounted () {

       this.obj = Object.assign({},this.$attrs.params);
       this.channelId = this.obj.channelId;
       this.getOne();
        this.init_data();
       
    }
  }
</script>

<style>

  .reDiv{
    border: 1px solid #F1F0F0;
    margin: 20px 30px;
    padding: 10px 0 0;
  }
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



