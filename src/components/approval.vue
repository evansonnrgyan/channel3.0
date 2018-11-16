<template>
  <div class="contentner approval">
    <div class="portal_plate_down new_proClass info-bg">
      <crumbs :items="crumbsItems"></crumbs>
      <div class="info-shadow info-box selinput interlaceColorChange">
              <Row>
          <Col span="4">渠道编号：</Col>
          <Col span="8">
            <span>{{channelNum}}</span>
          </Col>
          <Col span="4">渠道名称：</Col>
          <Col span="8">
            <span>{{channelName}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="4">产品编号：</Col>
          <Col span="8">
            <span>{{productNum}}</span>
          </Col>
          <Col span="4">产品名称：</Col>
          <Col span="8">
            <span>{{productName}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="4">主品牌：</Col>
          <Col span="8">
            <span>{{primateMainBrandCode}}</span>
          </Col>
          <Col span="4">品牌：</Col>
          <Col span="8" class="lineStyle">
            <span>{{secondMainBrandCode}}</span>
          </Col>
        </Row>
         <Row>
          <Col span="4">申请人：</Col>
          <Col span="8">
            <span>{{applyUserName}}</span>
          </Col>
          <Col span="4">处理情况：</Col>
          <Col span="8" class="lineStyle">
            <span>{{isDoneName}}</span>
          </Col>
          </Row>
           <div class='btnList'>
            <div v-for="(item,index) in btnList" :key="item.btnId" class='btns'>
                 <Button type="primary" @click="btnClick(item.btnId,item.displayName)">{{item.displayName}}</Button>
            </div>
            <div class='btns'>
               <Button type="ghost" @click="back">返回</Button>
            </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
  import crumbs from './commen/crumbs';
  export default {
    name: "demo",
    data() {
      console.log(this)
      return {
        crumbsItems: [ //导航
          {
            name: '新平台架构组',
            url: '',
          },
          {
            name: '审批',
            url: '',
          }
        ],
        channelNum: this.$attrs.params.channelNum,
        channelName: this.$attrs.params.channelName,
        applyUserName: this.$attrs.params.applyUserName,
        isDoneName: this.$attrs.params.isDoneName,
        primateMainBrandCode: this.$attrs.params.primateMainBrandCode,
        secondMainBrandCode: this.$attrs.params.secondMainBrandCode,
        productNum: this.$attrs.params.productNum,
        productName: this.$attrs.params.productName,
        btnList:[],
        columns: [{
          title: '发生时间',
          key: 'updateTime',
        },
          {
            title: '操作人',
            key: 'dealUserName',

          },
          {
            title: '处理情况',
            key: 'approveName',
          },
          {
            title: '审批情况',
            key: '',
          }
    ],
      data: [],
      current:1,
      total:0,
      pageSize:10,
      }
    },
    methods: {
      //获取按钮
      getBtns(){
        console.log(this.$attrs.params)
        let  list = {"businessId": this.$attrs.params.busWfptId};
            this.$http.post('/yxcode-channel-gateway/demo/channelWfptController/getApprovalBtnList',list,{
                    params: "application"
                }).then(res => {
              if(!res.data.hasErrors){
                this.btnList = res.data.data
              }
            });
      },
      //工作流按钮点击事件
        btnClick(val,name){
          console.log(val,name)
          let  list = {
              "buttonId": val,//按钮id
              "wfPkId": this.$attrs.params.busWfptId,	//流程id
              "taskTodoId": this.$attrs.params.taskTodoId //代办任务id

            };
            this.$http.post('/yxcode-channel-gateway/demo/channelWfptController/dealWorkflow',list,{
                    params: "application"
                }).then(res => {
              console.log(res)
              if(res.data.success){
                 this.$Modal.error({
                    title: '提示',
                    content: name+'成功',
                    onOk: () => {
                        this.$bus.$emit("linkToWorkApply");
                        //this.$router.push( { path: "workApply"})
                      },
                });
              }else{
                 this.$Modal.error({
                    title: '提示',
                    content: res.data.errorMessage
                });
              }
            });
        },
        //返回
        back(){
            this.$bus.$emit("linkToWorkApply");
            //this.$router.push({path: "workApply"});
        },
    },
    components: {
      crumbs
    },
    created() {
      console.log("审批列表页----加载按钮");
      this.getBtns();
    }
  }
</script>

<style lang="less">
.approval{
  html,body{
    overflow: auto;
  }
  .tableStyle .ivu-table table {
    width: 100%!important;
  }
.interlaceColorChange .ivu-row, .interlaceColorChange .ivu-row .ivu-col {
    height: auto;
    line-height: 3.5;
    font-size: 14px;
}
.interlaceColorChange .ivu-row .ivu-col:nth-child(1n) {
    text-align: right;
}
.interlaceColorChange .ivu-row .ivu-col:nth-child(2n) {
    text-align: left;
    color: #000;
}
.btnList {
  text-align: center;
  margin-top: 20px;
  .btns{
    display: inline-block;
      .ivu-btn{
      width: 120px;
      height: 42px!important;
      border-radius: 4px;
      margin-right: 14px;
      font-size: 16px;
      }
  }
}
  .pageT {
    text-align: right;
    margin-top: 10px;
  }
}
</style>
