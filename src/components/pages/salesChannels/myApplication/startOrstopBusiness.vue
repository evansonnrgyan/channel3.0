<!--停用启用业务-详情-->
<template>
  <div >

      <!-- 审批事项 -->
      <headerInfo :info="info" />

      <div class="reDiv">
        <Form :label-width="130">
          <Row>
                <Col span="24">
                   <FormItem label="申请事项" prop="">
                     {{selectList[applyBusiType]}}
                  </FormItem>
                </Col>
            </Row>
            <Row>
              <Col span="24">
                <FormItem label="申请原因" prop="">
                   {{info.applyReason}}
                </FormItem>
              </Col>
            </Row>
           
          </Form>
      </div>


      <!-- 店面信息 -->
     <commonTitle title="店面信息">
            <storeInfo :pid="shopId" :channelId="obj.channelId"></storeInfo>
     </commonTitle>

     <commonTitle title="合作信息">
        <cooperationInfo ref="cooperationInfo_ref" :value.sync="cooperationInfo_model"  :edit="false" ></cooperationInfo>
    </commonTitle>
   
    <commonTitle title="审批记录">
             <ApprovalTable :workFlowId="obj.workFlowId" />
    </commonTitle>

    <dynamicButtons :pid="shopId" :channelId="obj.channelId"  :obj="obj" closeName="startOrstopBusiness" />  
      

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

        selectList: {
            "050300000": "恢复合作",
            "050300001": "设置为关停",
            "050300002": "标记为退网",
        },
        applyBusiType:'',

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
                        

                        this.applyBusiType = this.submitObj.applyBusiType;
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


                        // 返显第一步
                        this.returnOne();

                    }
                })
            },

    },

    mounted () {

    
       this.obj = Object.assign({},this.$attrs.params);
       this.getOne();
      this.init_data();



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



