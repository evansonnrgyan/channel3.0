<template>
  <div class="contentner information">
    <div class="portal_plate_down new_proClass info-bg">
      <crumbs :items="crumbsItems"></crumbs>
      <div class="info-shadow info-box selinput">
        <Row class="bot14">
          <Col span="8">
          <label for="">渠道名称</label>
          <Input v-model="channelName" placeholder="请输入"></Input>
          </Col>
          <Col span="8">
          <label for="">渠道编号</label>
          <Input v-model="channelNum" placeholder="请输入"></Input>
          </Col>
          <Col span="8">
           <div class='btns'>
            <Button type="primary" @click="search">查询</Button>
            <Button type="ghost" @click="reset">重置</Button>
          </div>
          </Col>
        </Row>
      </div>
      <div class="info-shadow info-box">
        <Table border :columns="columns" ref="table" :data="data" class='tableStyle'></Table>
        <Page :total="total" :current="current" show-total show-elevator show-sizer @on-change="tableChange" @on-page-size-change='pageSizeChange'  class="pageT"></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import crumbs from './commen/crumbs';
  export default {
    name: "information",
    data() {
      return {

        crumbsItems: [ //导航
          {
            name: '新平台架构组',
            url: '',
          },
          {
            name: '工作流申请',
            url: '',
          }
        ],
        current: 1,
        pageSize:10,
        total: 0,
          channelName: '',
          channelNum: '',

        columns: [{
          title: '渠道名称',
          key: 'channelName',
        },
          {
            title: '渠道编号',
            key: 'channelNum',

          },
          {
            title: '申请人',
            key: 'applyUserName',
          },
          {
            title: '当前审批人',
            key: 'currentApproveUserName',
          },
          {
            title: '处理情况',
            key: 'isEndName',
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
            return h('div', [
              h('a', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                  this.$bus.$emit("linkToView", params.row);
                  //this.view(params.row)
              }
          }
      }, '查看'),
    ]);
    }
    }
    ],
      data: [],
    }
    },
    methods: {
      //查看
      view(row){
         this.$router.push(
          {
            path: "view",
           query: {
                  channelNum: row.channelNum,
                  channelName: row.channelName,
                  applyUserName:row.applyUserName,
                  isDoneName:row.isEndName,
                  primateMainBrandCode:row.primateMainBrandName?row.primateMainBrandName:'无',
                  secondMainBrandCode:row.secondMainBrandName?row.secondMainBrandName:'无',
                  productNum:row.productNum?row.productNum:'无',
                  productName:row.productName?row.productNum:'无',
                  businessId:row.busWfptId,
                  backFlag:'information'
            }
          });
      },
      //查询
      search(){
         this.getTableList(this.current,this.pageSize);
      },
      //切换页码
      tableChange(val){
          this.current   = val;
         this.getTableList(val,this.pageSize);
      },
      //切换每页条数
      pageSizeChange(val){
        this.pageSize = val;
         this.getTableList(this.current,val);
      },
      //重置
      reset(){
           this.channelName = ''
           this.channelNum = ''
          this.getTableList(1,10);
      },
      //获取列表
      getTableList(current,rowCount){
        let  list = {
           channelName: this.channelName,
          channelNum: this.channelNum,
          current:current,
          rowCount:rowCount
        }
        this.$http.post('/yxcode-channel-gateway/demo/channelWfptController/queryApplyInfo',list,{params: "application"}).then(res => {
          if(!res.data.hasErrors){
            this.total = res.data.data.total;
             this.data = res.data.data.data;
             this.current =  res.data.data.current;
          }
      });
      },


    },
    components: {
      crumbs
    },
    created() {
      this.getTableList(1,10);
      this.current = this.$attrs.params.current;

    }
  }
</script>

<style lang="less">
.information{
  .selinput .ivu-input-wrapper,
  .selinput .ivu-select {
    width: 50%;
  }


  .bot14 {
    margin-bottom: 14px;
  }


  .btns {
    text-align: center;
    .ivu-btn {
      margin-right: 2%;
      font-size: 14px;
    }
  }

  .pageT {
    text-align: right;
    margin-top: 10px;
  }
  .tableStyle .ivu-table table {
    width: 100%!important;
  }
}
</style>
