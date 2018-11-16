<!--申请修改店面信息-->
<template>
  <div class="store-info-edit">
    <!-- 店面信息 -->
    <commonTitle title="店面信息">
            <storeInfo :pid="shopId" :channelId="channelId" type="1"></storeInfo>
     </commonTitle>

    <!-- 编辑店面信息 -->
    <commonTitle title="编辑店面信息">
      <storeInfoForm ref="storeInfoForm_ref" :value.sync="storeInfoForm_model" :edit="true"></storeInfoForm>
    </commonTitle>

    <!-- 企业信息 -->
    <commonTitle title="企业信息" v-if="mainType === '0'">
      <companiesInfo :value.sync="companiesInfo_model"  :edit="true" :update="true"></companiesInfo>
    </commonTitle>

    <!-- 个人信息 -->
      <commonTitle title="个人信息" v-else>
          <personInfoForm ref="personInfoForm_ref" :value.sync="personInfoForm_model"  :edit="true"></personInfoForm>
      </commonTitle>


      <poFooter  v-if="obj.type === 'reject'">
        <Button v-for="item in btnsList" type="primary" size="large" @click="clickFn(item)">{{item.displayName}}</Button>
      </poFooter>

    <poFooter v-else>
      <Button type="primary" size="large" @click="save">保存</Button>
    </poFooter>
    
    <applyCommonModal ref="applyCommonModal" :flag.sync="modal" :remark.sync="remark" @ok="ok" />

  </div>
</template>

<script>
  export default {
    name: "storeInfoEdit",
    data () {
      return {
        obj:{},
        modal:false,
        remark:'',

        // 渠道ID
        channelId: '',
        shopId:'',

        mainType:'0',
        mainId: '',
        
        // 店面信息
        storeInfoForm_model: {},

        //企业信息
        companiesInfo_model: {},

        personInfoForm_model:{},

        btnsList:[],
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

      // 获取店面信息
          initShop(){
               
              this.$http.get('/tbChannelShopInfo/selectShopInfoByIdAndChannelId?id='+ this.shopId +'&channelId=' + this.channelId).then(resp => {
                  if (resp.data.success) {
                      let data = resp.data.data;
                      this.storeInfoForm_model.name = data.shopName;
                      this.storeInfoForm_model.address = [Number(data.provinceCode),Number(data.cityCode),Number(data.districtCode)];
                      this.storeInfoForm_model.addressName = [data.province,data.city,data.district];
                      this.storeInfoForm_model.addressMore = data.detailAddress;
                      this.storeInfoForm_model.typeArr = data.shopAttribute? data.shopAttribute.split(',') : [];
                      this.storeInfoForm_model.img = data.shopHeadAttachmentObj || {};

                      this.mainType = data.mainInfo.mainType;
                      this.mainId = data.mainId;

                      this.$nextTick(()=>{
                        if(this.mainType === '0'){
                          this.companiesInfo_model = data.mainInfo;
                        }else{
                          this.personInfoForm_model.name = data.mainInfo.mainName;
                          this.personInfoForm_model.code = data.mainInfo.creditCode;
                          this.personInfoForm_model.img = data.mainInfo.idCardAttachmentObj;
                        }
                      })
                  }
              })
          },
          save(){
            if(this.mainType === '0'){
              Promise.all([this.$refs['storeInfoForm_ref'].handleSubmit()]).then((data)=>{
                this.modal = true;
              }).catch((error) => {
                this.$Message.error('表单验证失败')
              })
            }else{
              Promise.all([this.$refs['storeInfoForm_ref'].handleSubmit(),this.$refs['personInfoForm_ref'].handleSubmit()]).then((data)=>{
                this.modal = true;
              }).catch((error) => {
                this.$Message.error('表单验证失败')
              })
            }

            
          },
          ok(){
            if(this.remark === ''){
              this.$Message.error('请填写申请原因');
              return;
            }

            this.$refs['applyCommonModal'].loading_btn = true;

             let json;
             console.log(this.storeInfoForm_model.address)

             // 企业
              if (this.mainType === '0') {
                  json = {
                      shopHeadAttachmentObj: this.storeInfoForm_model.img,
                      shopName: this.storeInfoForm_model.name,
                      detailAddress: this.storeInfoForm_model.addressMore,
                      provinceCode: this.storeInfoForm_model.address[0],
                      province: this.storeInfoForm_model.addressName[0],
                      cityCode: this.storeInfoForm_model.address[1] || '',
                      city: this.storeInfoForm_model.addressName[1] || '',
                      districtCode: this.storeInfoForm_model.address[2] || '',
                      district: this.storeInfoForm_model.addressName[2] || '',
                      shopAttribute: this.storeInfoForm_model.typeArr.join(','),
                      mainName: this.companiesInfo_model.mainName,
                      mainType: this.mainType,
                      mainId: this.mainId,
                      businessAttachmentObj: this.companiesInfo_model.businessAttachmentObj,
                      id: this.shopId,
                      applyReason: this.remark,
                      channelId: this.channelId,

                      workFlowId: this.obj.workFlowId || null,
                      buttonId: this.currentBtn.btnId || null,
                  }
              // 个人
              } else {
                  json = {
                      shopHeadAttachmentObj: this.storeInfoForm_model.img,
                      shopName: this.storeInfoForm_model.name,
                      detailAddress: this.storeInfoForm_model.addressMore,
                      provinceCode: this.storeInfoForm_model.address[0],
                      province: this.storeInfoForm_model.addressName[0],
                      cityCode: this.storeInfoForm_model.address[1] || '',
                      city: this.storeInfoForm_model.addressName[1] || '',
                      districtCode: this.storeInfoForm_model.address[2] || '',
                      district: this.storeInfoForm_model.addressName[2] || '',
                      shopAttribute: this.storeInfoForm_model.typeArr.join(','),
                      mainName: this.personInfoForm_model.name,
                      mainType: this.mainType,
                      mainId: this.mainId,
                      creditCode: this.personInfoForm_model.code,
                      idCardAttachmentObj: this.personInfoForm_model.img,
                      id: this.shopId,
                      applyReason: this.remark,
                      channelId: this.channelId,

                      workFlowId: this.obj.workFlowId || null,
                      buttonId: this.currentBtn.btnId || null,
                  }
              }

            this.$http.post('/tbChannelShopInfo/updateShopInfo',json).then(resp => {
                  if (resp.data.success) {
                      this.$Message.success('提交成功');
                      let workFlowId = resp.data.data.workFlowId;

                      // 跳转提交页
                      // this.$bus.$emit("submitShow", {id:"submitShow",name:"提交成功",closeName:'storeInfoEdit',refresh:true,params:{channelId: this.channelId ,workFlowId: workFlowId,openTo: 'modifyStoreInfo'}});

                      // 跳转我的渠道列表页
                      this.$bus.$emit("myChannel", {id:"myChannel",name:"我的渠道", closeName:'storeInfoEdit', refresh:true});
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

            this.initShop();
    }
  }
</script>

<style>

</style>
