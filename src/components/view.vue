<template>
  <div class="contentner view">
    <div class="portal_plate_down new_proClass info-bg">
      <crumbs :items="crumbsItems"></crumbs>
      <div class="info-shadow info-box selinput interlaceColorChange">

        <Tabs value="name1">
            <TabPane label="基本信息" name="name1">
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
            <div class='btns'>
               <Button type="ghost" @click="back">返回</Button>
            </div>
        </div>
            </TabPane>
            <TabPane label="审批记录" name="name2">
                 <div class="info-box">
                  <Table border :columns="columns" ref="table" :data="data" class='tableStyle'></Table>
                  <Page :total="total" :current="current" show-total show-elevator show-sizer @on-change="tableChange" @on-page-size-change='rowCountChange'  class="pageT"></Page>
                </div>
                 <div class='btnList'>
                    <div class='btns'>
                      <Button type="ghost" @click="back">返回</Button>
                    </div>
                 </div>
            </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import crumbs from './commen/crumbs';
  export default {
    name: "view",
    data() {
      return {
        crumbsItems: [ //导航
          {
            name: '新平台架构组',
            url: '',
          },
          {
            name: '查看',
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
            key: 'startName',
          }
    ],
      data: [],
      current:1,
      total:0,
      pageSize:10,
      }
    },
    methods: {
        //返回
        back(){
          if(this.$route.query.backFlag=='information'){
              this.$router.push({path: "information"});
          }else  if(this.$route.query.backFlag=='workApply'){
              this.$router.push({path: "workApply"});
          };
          this.$bus.$emit("linkToWorkApply",this.$attrs.params.current);
        },
        //获取审批记录表格数据
        getTableList(current,rowCount){
          let list = {
            current:current,
            rowCount:rowCount,
            busWfptId: this.$attrs.params.busWfptId
          }
        this.$http.post('/yxcode-channel-gateway/demo/channelWfptController/queryApprovalLog',list,{params: "application"}).then(res => {
          if(!res.data.hasErrors){
            this.total = res.data.data.total;
             this.data = res.data.data.data;
             this.current =  res.data.data.current;
          }
      });
      },
      //点击页码
        tableChange(val){
        this.current = val;
         this.getTableList(val,this.pageSize);
      },
      //点击每条页数
      rowCountChange(val){
        this.pageSize = val;
         this.getTableList(this.current,val);
      },

    },
    components: {
      crumbs
    },
    created() {
      console.log(this.$attrs.params);
      this.getTableList(1,10);
    }
  }
</script>

<style lang="less">
.view{
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
    .ivu-select{
      width: 100%;
    }
  }
}
</style>
