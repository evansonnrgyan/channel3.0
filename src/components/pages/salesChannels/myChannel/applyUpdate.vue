<!--申请升级为核心-->
<template>
  <div class="store-info-edit">
    <!-- 店面信息 -->
    <commonTitle title="店面信息">
            <storeInfo :pid="shopId" :channelId="channelId"></storeInfo>
     </commonTitle>

    <commonTitle title="申请升级">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"  :label-width="130" >
            <FormItem label="租赁代理等级" prop="level">
                <Select v-model="formValidate.level" class="input-width" placeholder="请选择租赁代理等级">
                    <Option v-for="(item,index) in levelList" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
    </commonTitle>

    <commonTitle title="保证金打款凭证" >
      <marginCertificate ref="marginCertificate_ref" :value.sync="marginCertificate_model" :edit="true"></marginCertificate> 
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
    name: "",
    data () {
      return {
        obj:{},
        modal:false,
        remark:'',

        // 渠道ID
        channelId: '',
        shopId:'',

        mainType:'0',

        levelList:[
          {
            value: '050400001',
            label: '核心代理商'
          }
        ],
        
        btnsList:[],
        currentBtn: {},

        marginCertificate_model:{},

        formValidate:{
          level:''
        },
        ruleValidate:{
          level: [
              { required: true, message: '请选择租赁代理等级', trigger: 'change' }
          ],
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

        back(){
          this.$bus.$emit("showChannel", {id:"showChannel",name:"渠道详情",closeName:'applyUpdate',refresh:true,params:{id: this.channelId}});
        },

          // 验证
            handleSubmit(){
                return new Promise((resolve, reject)=>{
                    this.$refs['formValidate'].validate((valid) => {
                        if (valid) {
                            resolve();
                        } else{
                            reject();
                        }
                    })
                })
            },
    
          save(){

            Promise.all([this.$refs['marginCertificate_ref'].handleSubmit(),this.handleSubmit()]).then((data)=>{
                this.modal = true;

            }).catch((error) => {

              this.$Message.error('表单验证失败')

            })
          },
          ok(){

            if(this.remark === ''){
                this.$Message.error('请填写申请原因');
                return;
              }

              this.$refs['applyCommonModal'].loading_btn = true;

              let json;

                if(this.marginCertificate_model.isAdd === '1'){

                  json = {

                    id: this.channelId,
                    rentLevel: this.formValidate.level,
                    applyReason: this.remark,
                    addCashDepositStatus: this.marginCertificate_model.isAdd,

                    addCashDeposit: this.marginCertificate_model.money,
                    addCashDepositAttachment: this.marginCertificate_model.img,

                    workFlowId: this.obj.workFlowId || null,
                    buttonId: this.currentBtn.btnId || null,
                    taskId: this.currentBtn.taskId || null,

                  }

                }else{
                   json = {

                    id: this.channelId,
                    rentLevel: this.formValidate.level,
                    applyReason: this.remark,
                    addCashDepositStatus: this.marginCertificate_model.isAdd,

                    workFlowId: this.obj.workFlowId || null,
                    buttonId: this.currentBtn.btnId || null,
                    taskId: this.currentBtn.taskId || null,

                  }
                }


                 this.$http.post("/tbChannelBusiness/submitLeaseAgentLevelUpgrade",json).then((resp)=>{
                    if (resp.data.success) {
                        this.$Message.success('提交成功');
                        let workFlowId = resp.data.data.workFlowId;
                        // 跳转提交页
                          this.$bus.$emit("submitShow", {id:"submitShow",name:"提交成功",closeName:'applyUpdate',refresh:true,params:{channelId: this.channelId, workFlowId: workFlowId, openTo: 'rentalAgent'}});

                    }

                    this.$refs['applyCommonModal'].loading_btn = false;

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

                      this.marginCertificate_model.isAdd = this.submitObj.addCashDepositStatus;
                      this.marginCertificate_model.money = this.submitObj.addCashDeposit;
                      this.marginCertificate_model.img = this.submitObj.addCashDepositAttachment;

                    }
                })
            },
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
            this.returnOne();
        }
    }
  }
</script>

<style>

</style>
