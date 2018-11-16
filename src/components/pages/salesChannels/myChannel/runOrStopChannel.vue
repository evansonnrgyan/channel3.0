<!-- 申请停用、启用渠道 -->
<template>
  <div class="run-or-stop-channel">
     
    <!-- 申请说明 -->
    <commonTitle title="申请说明" >
      <Form :model="formValidate"  :rules="ruleValidate"   ref="formValidate"  :label-width="130">
        <Row>
          <Col span="12">
            <FormItem label="选择申请事项" prop="applyType">
            <Select v-model="formValidate.applyType" class="input-width">
                <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        </Form>
    </commonTitle>
      
    <!-- 店面信息 -->
    <commonTitle title="店面信息">
            <storeInfo :pid="shopId" :channelId="channelId"></storeInfo>
     </commonTitle>

    <!-- 合作信息 -->
    <commonTitle title="合作信息">
            <cooperationInfo ref="cooperationInfo_ref" :value.sync="cooperationInfo_model" :edit="false" ></cooperationInfo>
    </commonTitle>

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
    name: "runOrStopChannel",
    data () {
      return {

         modal:false,

        channelId:'',
        shopId:'',
        obj:{},

        remark:'',

        btnsList:[],
        currentBtn: {},

        

        formValidate:{
          applyType:'',
        },

        ruleValidate: {
          applyType:[{ required: true, message: '请选择申请类型', trigger: 'change' }],
        
        },

        // 选择申请事项
        selectList: [
          {
            value: "050300000",
            label: "恢复合作",
          },
          {
            value: "050300001",
            label: "设置为关停",
          },
          // {
          //   value: "050300002",
          //   label: "标记为退网",
          // }
        ],

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
        cooperationInfo_flag:false,

        // 车源信息
          carSourceInfo_model:{
               filedArr:[],
               brandList:[]
          },
          carSourceInfo_flag:false,

          busiStatus:'',

       
      }
    },
    watch:{
      busiStatus(v){
        // 合作中
        if(v === '050200000'){
          this.selectList = [
           
            {
              value: "050300001",
              label: "设置为关停",
            },
            // {
            //   value: "050300002",
            //   label: "标记为退网",
            // }
          ]

        }else
        // 已停用
        if(v === '050200001'){
          this.selectList = [
            {
              value: "050300000",
              label: "恢复合作",
            },
          ]

        }else
        // 已退网
        if(v === '050200002'){
          this.selectList = [
            {
              value: "050300000",
              label: "恢复合作",
            },
          ]

        }
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

                      this.formValidate.applyType = this.submitObj.applyBusiType;

                      // 当前状态
                      this.busiStatus = this.submitObj.busiStatus;
                    
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

                      this.carSourceInfo_model.filedArr = data.filter(item => {
                          return item.code === 'vehicleType' || item.code === 'vehicleFrom'
                      })

                      // 返显第一步
                      this.returnOne();

                  }
              })
          },

          back(){
             this.$bus.$emit("editChannel", {id:"editChannel",name:"编辑渠道",closeName:'runOrStopChannel'});
          },

          save(){
              this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                      this.modal = true;
                    } else{
                      this.$Message.error('表单验证失败')
                    }
                })
            },
            ok(){

              if(this.remark === ''){
                this.$Message.error('请填写申请原因');
                return;
              }

              this.$refs['applyCommonModal'].loading_btn = true;

              let json = {

                    id: this.channelId,
                    applyBusiType: this.formValidate.applyType,
                    applyReason: this.remark,

                    workFlowId: this.obj.workFlowId || null,
                    buttonId: this.currentBtn.btnId || null,
                    taskId: this.currentBtn.taskId || null,

                }
                 this.$http.post("/tbChannelBusiness/submitChangeBusiStatus",json).then((resp)=>{
                    if (resp.data.success) {
                        this.$Message.success('提交成功');
                        let workFlowId = resp.data.data.workFlowId;

                        // 跳转提交页
                          this.$bus.$emit("submitShow", {id:"submitShow",name:"提交成功",closeName:'runOrStopChannel',refresh:true,params:{channelId: this.channelId ,workFlowId: workFlowId ,openTo: 'startOrstopBusiness'}});

                    }

                    this.$refs['applyCommonModal'].loading_btn = false;
                  })
              
            }
    },
    mounted(){
            this.obj = Object.assign({},this.$attrs.params);
            this.channelId = this.obj.channelId;
            this.shopId = this.obj.shopId;
            // 新建
            if(this.obj.type === 'new'){

            }else
            // 驳回后编辑
            if(this.obj.type === 'reject'){
                this.getBtns();
            }
            
            this.getOne();

             
    }
  }
</script>

<style>

</style>
