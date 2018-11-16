<!--

审批-动态按钮 

-->
<template>
  <div>

    <poFooter  v-if="obj.type === 'approve'">
      <Button v-for="item in btnsList" type="primary" size="large" @click="clickFn(item)">{{item.displayName}}</Button>
    </poFooter>

    <!-- 选择指派员工 -->
    <Modal
      v-model="modal_men"
      title="选择指派员工"
      width="700"
      @on-cancel="cancel_men"
      >
      <div v-show="zhipaiFlag">
        <assignStaff :value.sync="selectMen" />
      </div>
      <div v-show="!zhipaiFlag">
        <Row :gutter="16">
            <Col span="8" class="text-right">
              <h3>确认指派给{{selectMen.cnName}}</h3>
            </Col>
          </Row>
          <br>
            <Row :gutter="16">
              <Col span="6" class="text-right">
                <!-- <span style="color:red">* </span>  -->
                指派原因
              </Col>
              <Col span="16">
                  <Input v-model.trim="men_remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="支持200字录入" :maxlength="200" />
                  <limitLength :value="men_remark" :max="200"/>
              </Col>
          </Row>
      </div>
      <div slot="footer">
          <div v-if="zhipaiFlag">
            <Button @click="cancel_men">取消</Button>
            <Button type="primary"  @click="ok_select_men" >确定选择</Button>
          </div>
          <div v-else>
            <Button @click="back_men">返回</Button>
            <Button :loading="loading" type="primary"  @click="ok_men">确定</Button>
          </div>
        </div>

    </Modal>

    <!-- 通过驳回 -->
        <Modal
          v-model="modal"
          title="审批处理"
          >
          <Row :gutter="16">
            <Col span="7" class="text-right">
              <h3>{{modalText}}</h3>
            </Col>
          </Row>
          <br>
            <Row :gutter="16">
              <Col span="6" class="text-right">
                <!-- <span style="color:red">* </span>  -->
                审批意见
              </Col>
              <Col span="16">
                  <Input v-model.trim="remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="支持200字录入" :maxlength="200" />
                  <limitLength :value="remark" :max="200"/>
              </Col>
          </Row>
            <div slot="footer">
            <Button @click="modal = false">取消</Button>
            <Button :loading="loading" type="primary"  @click="ok">确定</Button>
          </div>
        </Modal>

        <!-- 店面重复提示框 -->
        <Modal
          v-model="repModal"
          :title="repType + '重复提示'">
          <p v-if="repModalFlag">
              当前申请的渠道：&nbsp;{{storeInfo.shopName}}&nbsp;名称已被使用！<br> 只可操作驳回。
          </p>

          <p v-else>
              当前申请的渠道：&nbsp;{{storeInfo.shopName}}&nbsp;已开通过&nbsp;{{businessModelName}}&nbsp;业务！<br> 只可操作驳回。
          </p>

          <div slot="footer">
              <Button  @click="repModal = false">取消</Button>
          </div>
        </Modal>


  </div>
</template>

<script>
  export default {
  	props:{
  		obj:{
  			type:Object,
  			default:{}
  		},
  		closeName:{
  			type:String,
  			default:''
  		},
      pid:{
          type: String,
          default: '',
      },
      channelId:{
          type: String,
          default: '',
      },
  	},
    name: "",
    data () {
      return {
        loading: false,
        repModal:false,
        repType:'',
        repName:'',

        btnsList: [],
        modal:false,
        approveText:'',
        remark:'',
        selectMen:{},
        modal_men:false,

        men_remark: '',

      currentBtn:{},

      modalText:'',


      zhipaiFlag:true,
      storeInfo:{},
      businessModelName:'',

      repModalFlag: false,
      }
    },
    watch:{
    	obj: {
          handler: function (newVal) {
              
		        if(this.obj.type === 'approve'){
		          this.getBtns();
		        }
            },
          deep: true
        },

        pid(newValue){
            if(newValue !== ''){

              this.initShop();

            }
          }
    },
    methods: {

      back_men(){
        this.zhipaiFlag = true;
      },

      cancel_men(){
        this.modal_men = false;
        this.zhipaiFlag = true;
      },

      
      // 确认选择指派人
      ok_select_men(){
        if(this.selectMen.domainName){
            this.zhipaiFlag = false;
          }else{
            this.$Message.error('请选择指派员工')
          }
      },

      // 确定指派
      ok_men(){
          // if(this.men_remark === ''){
          //   this.$Message.error('请填写指派原因');
          //   return;
          // }
          this.loading = true;
          let json = {
                assginUserCode: this.selectMen.domainName,
                assginUserName: this.selectMen.cnName,
                buttonId: this.currentBtn.btnId,
                workFlowId: this.obj.workFlowId,
                approveOpinion: this.men_remark,
                taskId: this.currentBtn.taskId,
            };
            this.$http.post('/channelWfpt/assignUser',json).then(resp => {
                if (resp.data.success) {
                    this.$Message.success('指派成功');
                    this.back();
                }

                this.loading = false;
            })
      },

      // 确认
      ok(){

         // if(this.remark === ''){
         //    this.$Message.error('请填写审批意见');
         //    return;
         //  }

          this.loading = true;

          let url,json;

          // 取消申请驳回
          if(this.obj.type === 'apply'){
            url = ' /channelWfpt/applyCancle';
            json = {
                workFlowId: this.obj.workFlowId,
                cancelReason: this.remark
            }
          }else{
            url = '/channelWfpt/dealWorkflow';
            json = {
                btnIdentify: this.currentBtn.btnIdentify,
                buttonId: this.currentBtn.btnId,
                opreateType: this.currentBtn.btnIdentify === 'reSubmitBtn'? '02' : '00',
                wfPkId: this.obj.workFlowId,
                approveOpinion: this.remark,
                taskId: this.currentBtn.taskId
            }
          }

          this.$http.post(url, json).then((resp)=>{
              if (resp.data.success) {
                  let data = resp.data.data;

                  this.$Message.success('操作成功');
                  this.back();
              }

              this.loading = false;
            })

      	},

      	toSubmit(){
            this.$bus.$emit("submitShow",{id: "submitShow", closeName:this.closeName, refresh:true, isShow:true, name:"提交成功" , params: this.obj });
        },

	      back(){
	        this.$bus.$emit("approvalManagement",{id: "approvalManagement", isShow:true, closeName:this.closeName, refresh:true, name:"审批管理"})
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

              // 指派
              if(item.btnIdentify === 'assignBtn'){
                this.modal_men = true;

              // 通过
              }else 
              if(item.btnIdentify === 'btnAggreeFinish' || item.btnIdentify === 'btnAggree'){

                if(this.closeName === 'applyAddNew'){
                   this.getBtnAggreeClick();
                }else{
                   this.modal = true;
                }


              // 驳回
              }else{
                this.modal = true;
              }

              this.modalText = '确认' + item.displayName + '？';
              this.currentBtn = item;
            },

            getBtnAggreeClick(){
              let json = {
                channelId: this.channelId
              }
              this.$http.post('/channelWfpt/btnAggreeClick',json).then(resp => {
                  if (resp.data.success) {
                      let data = resp.data.data;

                      // 000正常  001店面已存在  002标签已存在

                      if(data.dealCode === '000'){
                        this.modal = true;
                      }else 
                      if(data.dealCode === '001'){
                        this.repModal = true;
                        this.repModalFlag = true;
                        this.repType = '店面';
                        
                      }else
                      if(data.dealCode === '002'){
                        this.repModal = true;
                        this.repModalFlag = false;
                        this.repType = '标签';
                      }
                     
                  }
              })
            },

            // 获取店面信息  编辑
            initShop(){
                  
                this.$http.get('/tbChannelShopInfo/selectShopInfoByIdAndChannelId?id='+ this.pid +'&channelId=' + this.channelId).then(resp => {
                    if (resp.data.success) {
                        this.storeInfo = resp.data.data;
                        this.businessModelName = this.storeInfo.businessConfigModelNames[0].businessModelName;
                    }
                })
            },

    },

    mounted () {
      if(this.obj.type === 'approve'){
          this.getBtns();
        }

    }
  }
</script>

<style>
  
</style>



