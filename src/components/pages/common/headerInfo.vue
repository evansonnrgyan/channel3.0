<!--头部用户信息-->
<template>
  <div class="header-info">
    <Row>
      <Col class="border-right" span="5">
        <div class="title">申请事项</div>
        <h2 class="info">{{info.applyTypeName}}</h2>
      </Col>
      <Col class="border-right" span="5">
        <div class="title">审批状态</div>
        <h2 class="info">{{info.statusName}}</h2>
      </Col>
        <Col class="border-right" span="5">
            <div class="title">申请人</div>
            <h2 class="info">{{info.applyUserName}}</h2>
        </Col>
      <Col class="border-right" span="5">
        <div class="title">当前待办人</div>
        <h2 class="info">{{info.currentApproveUserName}}</h2>
      </Col>
      <Col span="4">
        <div class="title">申请时间</div>
        <h2 class="info">{{timer}}</h2>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: "headerInfo",
    props: {
      info:{
          type: Object,
          default: {},
      },
    },
    data () {
      return  {
          timer: ""
      }
    },
      watch:{
        info:{
            handler: function (newVal) {
                this.timer = this.timer = this.$formatDateTime(newVal.lastDealTime, "yyyy-MM-dd hh:mm:ss");
            },
            deep: true
        }
      }
  }
</script>

<style lang="less" scoped>
  .header-info{
    margin: 20px 30px;
    padding: 10px 0 0;
    height: 77px;
    border: 1px solid #F1F0F0;
    text-align: center;
    line-height: 28px;
    .border-right{
      position: relative;
      &::after{
        position: absolute;
        content: "";
        width: 1px;
        background: #EBEBEB;
        top:7px;
        right:0;
        height:40px;
      }
    }
    h2{
      font-size:13px;
    }
  }
</style>
