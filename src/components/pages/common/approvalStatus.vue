<!-- 审批状态显示条 -->
<template>
  <div >
     <!-- 状态组件 -->
     
      <Row style="font-weight:bold">
        <Col span="12">
          <Row>
            <Col class="font-right" span="6">当前状态：</Col>
            <Col span="18">
              {{busiStatusJson[value.busiStatus]}}
              {{'（' + $formatDate(value.busiStartDate) + ' - ' + $formatDate(value.busiEndDate) + '）'}}
            </Col>
          </Row>
        </Col>
        <Col span="12">
          <Row>
            <Col class="font-right" span="6">在途审批状态：</Col>
            <Col span="18">{{applyTypeName}}</Col>
          </Row>
        </Col>
      </Row>


  </div>
</template>
<script>
  export default {
    name: "",
    props:["value","pid"],
    data() {
      return {

        busiStatusJson: {
          '050200000':"合作中",
          "050200001":"已关停",
          "050200002":"已退网",
          "050200003":"待验收",
          "050200004":"准入审核中",
          "050200005":"输入中",
          "050200006":"已到期",
        },
        applyTypeName: '',
      }
    },
    watch:{
      pid(nv){
        if(nv !== ''){
          this.getData();
        }
      }
    },
    methods:{
      getData(){
         this.$http.post("/channelWfpt/selectOnTheWay", {channelId: this.pid}).then((resp) => {
              if (resp.data.success) {
                  let name = resp.data.data.applyTypeName;
                  this.applyTypeName = name === '' ? '无' : name;
              };
          })
      },
    },
    mounted(){
    }
  }
</script>