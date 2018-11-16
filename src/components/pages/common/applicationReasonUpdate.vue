<!--申请原因 升级-->
<template>
  <div class="cont">
          <Row>
            <Col span="12">
              <Row>
                <Col class="font-right" span="6">原租赁代理等级</Col>
                <Col span="18">{{rentLevel}}</Col>
              </Row>

              <Row>
                <Col class="font-right" span="6">申请等级</Col>
                <Col span="18">{{oldRentLevel}}</Col>
              </Row>

              <Row>
                <Col class="font-right" span="6">申请原因</Col>
                <Col span="18">{{info.applyReason}}</Col>
              </Row>
            </Col>
            <Col span="12">
              <Row>
                <Col class="font-right" span="6">是否追加保证金</Col>
                <Col span="18">{{approvalStatus}}</Col>
                <Col class="font-right" span="6">新合作协议</Col>
                <Col span="18">
                  <oneFile :value.sync="img"  :btns="['show','down']"></oneFile>
                </Col>
              </Row>
            </Col>
          </Row>
  </div>
</template>

<script>
  // TODO 暂时不做
  export default {
    name: "applicationReasonUpdate",
    props:{
      info:{
          type: Object,
          default:{}
      }
    },
    data(){
        return {
            rentLevel: "",
            oldRentLevel: "",
            approvalStatus: "",
            imgSrc:{}
        }
    },
    watch:{
        ["info"]:{
            handler:function(val){
                if(val){
                    this.info = val;
                    if(this.info.moreInfo){
                        this.rentLevel = this.info.moreInfo.rentLevel;
                        this.oldRentLevel = this.info.moreInfo.oldValue?this.info.moreInfo.oldValue.rentLevel: "暂无";
                        this.approvalStatus = this.info.moreInfo.approvalStatus;
                        this.imgSrc = this.info.moreInfo.attachmentDto.attachmentUrl + this.info.moreInfo.attachmentDto.serverFileName;
                        console.log(this.info, '租赁代理等级详细信息')
                    }
                }
            },
            deep: true
        }
    },
   
  }
</script>

<style lang="less" scoped>
  .cont{
    border: 1px solid #F1F0F0;
    margin: 20px 30px;
    padding: 10px 0 0;
  }
  .info{
    width: 96%;
    padding:15px;
    background: #FCFCFC;
    border: 1px solid #e9e9e9;
  }
  .imgIvew{
    width:100px;
    height:100px;
  }
</style>
