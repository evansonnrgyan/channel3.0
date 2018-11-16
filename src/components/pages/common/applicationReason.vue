<!--申请原因-->
<template>
  <div class="margin-delivery">
    <div class="">

          <Row>
            <Col span="3" class="font-right" style="width:125px">申请原因</Col>
            <Col span="21">
              <div class="info">
                {{info.applyReason}}
              </div>
            </Col>
          </Row>

    </div>
  </div>
</template>

<script>
  export default {
    name: "applicationReason",
    props: {
      info:{
          type: Object,
          default: {},
      },
    },
    data () {
      return  {
      }
    }
  }
</script>

<style lang="less" scoped>
  .info{
    width: 96%;
    padding:15px;
    background: #FCFCFC;
    border: 1px solid #e9e9e9;
  }
</style>
