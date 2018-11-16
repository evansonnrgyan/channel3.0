<!--收款信息 注：此table表格可以复用-->
<template>
  <div class="margin-delivery">
    <div class="content">
      <div class="channels-common-body  ">
        <div class="channels-common-body-content">
          <div class="channels-common-body-title">
            <span></span>{{title?title:"保证金交付"}}
          </div>
          <div class="channels-common-body-cont">
            <Table :columns="billingColumns" :data="billingData"></Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "marginDelivery",
    props:["billingColumns", "billingData","title"],
    data () {
      return  {

      }
    }
  }
</script>

<style lang="less" scoped>
  .font12{
    font-szie: 12px;
    color: #666666;
  }
  .imgView{
    width:100px;
    height:110px;
  }
</style>
