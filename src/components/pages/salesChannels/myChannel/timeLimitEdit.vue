<!-- 申请修改合作期限 -->
<template>
  <div class="">
    <div class="">
      <Form :model="formValidate1" ref="formValidate1" :rules="ruleValidate1" :label-width="130">
        <!-- 申请说明 -->
        <commonTitle title="申请说明" >
            <div @click="goTo" style="padding: 0 10px 0 0;float:right;color: #2d8cf0;cursor: pointer; position: relative; z-index:100">合同小助手已上线，点击体验>></div>
            <Row>
              <Col span="10">
                <FormItem label="选择申请类型" prop="model1">
                  <Select v-model="formValidate1.model1"  class="input-width">
                    <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span="24" >
                <FormItem label="设置新合作时间"  prop="startTime" >

                    <FormItem label=""  prop="startTime" class="inline-block">
                        <DatePicker :options="startTimeLimited" v-model="formValidate1.startTime" type="date" placeholder="开始日期" style="width:140px;"></DatePicker>
                      </FormItem>
                      <span>&nbsp;-&nbsp;</span>
                      <FormItem prop="endTime" class="inline-block">
                        <DatePicker :options="endTimeLimited" v-model="formValidate1.endTime" type="date" placeholder="结束如期" style="width:140px;"></DatePicker>
                      </FormItem>

                </FormItem>
           
              </Col>

            </Row>

             <!-- 上传新合作协议 -->
              <Row v-if="isNew">
                <FormItem label="上传新合作协议" prop="img">
                  <oneFile :value.sync="formValidate1.img" attachmentCode="0000000011" :btns="['show','down','again']" @clearValidate="clearValidate"></oneFile>
                </FormItem>
              </Row>
        </commonTitle>

        
      </Form>
     
    </div>

    <!-- 店面信息 -->
    <commonTitle title="店面信息">
            <storeInfo :pid="shopId" :channelId="channelId"></storeInfo>
     </commonTitle>

  
      <commonTitle title="合作信息">
                <cooperationInfo ref="cooperationInfo_ref" :value.sync="cooperationInfo_model" :flag.sync="cooperationInfo_flag" :edit="false" ></cooperationInfo>
        </commonTitle>

    <poFooter  v-if="obj.type === 'reject'">
        <Button v-for="item in btnsList" type="primary" size="large" @click="clickFn(item)">{{item.displayName}}</Button>
      </poFooter>

    <poFooter v-else>
      <!-- <Button size="large" @click="back">返回</Button> -->
      <Button type="primary" size="large" @click="save">提交</Button>
    </poFooter>

    <applyCommonModal ref="applyCommonModal" :flag.sync="modal" :remark.sync="remark" @ok="ok" />


  </div>
</template>

<script>
  export default {
    name: "timeLimitEdit",
    data () {
      var _this = this;
      return {
        modal:false,

        channelId:'',
        shopId:'',

        channelCode: '',
        busiConfigId: '',

        obj:{},

        remark:'',

        btnsList:[],
        currentBtn: {},

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


        
        isNew: false,
        // 选择申请事项
        selectList: [
          {
            value: "050100000",
            label: "原合作时间有误",
          },
          {
            value: "050100001",
            label: "新合同",
          },
          {
            value: "050100002",
            label: "其他原因",
          }
        ],


        // 合作信息
        cooperationInfo_model:{
          subjectArr:[],
          subjectValue:[],
          subjectName:[],
          filedArr:[],
          isFloat:'',
          company:'',
          companyName:'',
          timesType:'1',
          startDate:'',
          endDate:'',
        },
        cooperationInfo_flag:false,
        formValidate1:{
          model1:"",
          startTime:"",
          endTime:"",
          img:{}
        },
        ruleValidate1: {
          model1:[{ required: true, message: '请选择申请类型', trigger: 'change' }],
          startTime:[{ required: true, type: 'date', message: '请选择开始日期', trigger: 'change' }],
          endTime:[{ required: true, type: 'date', message: '请选择结束日期', trigger: 'change' }],
          img:{
              type: "object", required: true,
              fields: {
                serverFileName: {type: "string", required: true,  message: "请上传附件"}
              }
            }
        },
        formValidate: {},
        ruleValidate: {
          serverFileName: [{
            required: true,
            message: '请选择上传文件！',
            trigger: 'change'
          }],
        },

        startTimeLimited:{
            disabledDate (date) {
                if(_this.formValidate1.endTime){
                    let s = new Date(new Date(_this.formValidate1.endTime).toLocaleDateString());
                    return date && date.valueOf() > s.getTime();
                }
            }
        },
        endTimeLimited:{
            disabledDate (date) {
                if(_this.formValidate1.startTime){
                    // 处理成当前0点
                    let s = new Date(new Date(_this.formValidate1.startTime).toLocaleDateString());
                    return date && date.valueOf() < s.getTime();
                }
            }
        },
     
      }
    },
    watch:{
      ['formValidate1.model1'](value){
        if(value === "050100001"){
          // 新合同
          this.isNew = true;
        }else{
          this.isNew = false;
        }
      },
    },
    methods:{
        // 小助手
          goTo(){
              this.$bus.$emit('contractAssistant',{id:"contractAssistant", isShow:true, name: "合同小助手", refresh:true, params:{channelCode: this.channelCode, channelId:this.channelId, busiConfigId: this.busiConfigId}})
          },
        clearValidate(){
                this.$refs['formValidate1'].validateField('img');
            },
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

                        this.channelCode = this.submitObj.channelCode;
                        this.busiConfigId = this.submitObj.busiConfigId;


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
                       

                        this.formValidate1.model1 = this.submitObj.applyBusiType;
                        this.formValidate1.startTime = this.$formatDate(this.submitObj.busiStartDate);
                        this.formValidate1.endTime = this.$formatDate(this.submitObj.busiEndDate);
                        if(this.submitObj.attachments && this.submitObj.attachments.length > 0){
                          this.formValidate1.img = this.submitObj.attachments.filter(item => {
                            return item.attachmentCode === "0000000011";
                          })[0] || {};
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

                        this.carSourceInfo_model.filedArr = data.filter(item => {
                            return item.code === 'vehicleType' || item.code === 'vehicleFrom'
                        })

                        // 返显第一步
                        this.returnOne();

                    }
                })
            },
            // 返回
            back(){
               this.$bus.$emit("editChannel", {id:"editChannel",name:"编辑渠道",closeName:'timeLimitEdit'});
            },

            // 跳转提交页
            submitShow(workFlowId) {
              this.$bus.$emit("submitShow", {id:"submitShow",name:"提交成功",closeName:'timeLimitEdit',refresh:true,params:{channelId: this.channelId, workFlowId: workFlowId,openTo:'editCooperationTerm'}});
            },

            save(){
              this.$refs['formValidate1'].validate((valid) => {
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
            

              let json;

                if(this.isNew){

                  json = {

                    id: this.channelId,
                    applyBusiType: this.formValidate1.model1,
                    applyReason: this.remark,
                    busiStartDate:  this.$formatDate(this.formValidate1.startTime),
                    busiEndDate: this.$formatDate(this.formValidate1.endTime),
                    attachments: [this.formValidate1.img],

                    workFlowId: this.obj.workFlowId || null,
                    buttonId: this.currentBtn.btnId || null,
                    taskId: this.currentBtn.taskId || null,
                  }

                }else{
                   json = {

                    id: this.channelId,
                    applyBusiType: this.formValidate1.model1,
                    applyReason: this.remark,
                    busiStartDate:  this.$formatDate(this.formValidate1.startTime),
                    busiEndDate: this.$formatDate(this.formValidate1.endTime),

                    workFlowId: this.obj.workFlowId || null,
                    buttonId: this.currentBtn.btnId || null,
                    taskId: this.currentBtn.taskId || null,
                  }
                }


                 this.$http.post("/tbChannelBusiness/submitChangeBusiDate",json).then((resp)=>{

                    if (resp.data.success) {
                        this.$Message.success('提交成功');
                        let workFlowId = resp.data.data.workFlowId;
                        this.submitShow(workFlowId);
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
