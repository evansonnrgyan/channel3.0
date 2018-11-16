<template>
  <div class="contentner workApply">
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
         <Tabs value="name1" @on-click = 'tabClick' :animated="false">
            <TabPane label="待审批" name="name1">
               <Table border :columns="columns" ref="table" :data="data" class='tableStyle'></Table>
                <Page :total="total" :current="current" show-total show-elevator show-sizer @on-change="tableChange" @on-page-size-change='pageSizeChange'  class="pageT"></Page>
            </TabPane>
            <TabPane label="已处理" name="name2">
                <Table border :columns="columns1" ref="table1" :data="data1" class='tableStyle'></Table>
                <Page :total="total1" :current="current1" show-total show-elevator show-sizer @on-change="tableChange1" @on-page-size-change='pageSizeChange1'  class="pageT"></Page>
            </TabPane>
        </Tabs>

      </div>
    </div>
  </div>
</template>

<script>
  import crumbs from './commen/crumbs';
  export default {
    name: "workApply",
    data() {
      return {

        crumbsItems: [ //导航
          {
            name: '新平台架构组',
            url: '',
          },
          {
            name: '工作流审批',
            url: '',
          }
        ],
        current: 1,
        pageSize:10,
        total: 0,

        current1: 1,
        pageSize1:10,
        total1: 0,
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
            title: '处理情况',
            key: 'isDoneName',
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

                    this.$bus.$emit("linkToApproval", params.row);
                  //this.approval(params.row)
              }
          }
      }, '审批'),
    ]);
    }
    }
    ],
      data: [],
             columns1: [{
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
            title: '处理情况',
            key: 'isDoneName',
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
                    console.log(params.row);
                    params.row.current = this.current
                    this.$bus.$emit("linkToApprocal", params.row);
                  //this.view(params.row);
              }
          }
      }, '查看'),
    ]);
    }
    }
    ],
      data1: [],
      nameFlag:'name1',
        name: "default"
    }
    },
    methods: {
      //审批
      approval(row){
        console.log(row);
         this.$router.push(
          {
            path: "approval",
           query: {
                taskTodoId:row.taskTodoId,
                channelNum: row.channelNum,
                  channelName: row.channelName,
                  applyUserName:row.applyUserName,
                  isDoneName:row.isDoneName,
                  primateMainBrandCode:row.primateMainBrandName?row.primateMainBrandName:'无',
                  secondMainBrandCode:row.secondMainBrandName?row.secondMainBrandName:'无',
                  productNum:row.productNum?row.productNum:'无',
                  productName:row.productName?row.productNum:'无',
                  businessId:row.busWfptId
            }
          });
      },

       view(row){
        console.log(row);
         this.$router.push(
          {
           path: "view",
           query: {
                  channelNum: row.channelNum,
                  channelName: row.channelName,
                  applyUserName:row.applyUserName,
                  isDoneName:row.isDoneName,
                  primateMainBrandCode:row.primateMainBrandName?row.primateMainBrandName:'无',
                  secondMainBrandCode:row.secondMainBrandName?row.secondMainBrandName:'无',
                  productNum:row.productNum?row.productNum:'无',
                  productName:row.productName?row.productNum:'无',
                  businessId:row.busWfptId,
                  backFlag:'workApply'
            }
          });
      },
      //查询
      search(){
           if(this.nameFlag=='name1'){
              this.getTableList(1,10);
          }else if(this.nameFlag='name2'){
              this.getTableList1(1,10);
          }
      },
      tabClick(val){
        this.nameFlag = val;
        if(val=='name1'){
            this.getTableList(this.current,this.pageSize);
        }else if(val='name2'){
            this.getTableList1(this.current,this.pageSize1);
        }
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
        //切换页码
      tableChange1(val){
          this.current1   = val;
         this.getTableList1(val,this.pageSize);
      },
      //切换每页条数
      pageSizeChange1(val){
        this.pageSize1 = val;
         this.getTableList1(this.current,val);
      },
      //重置
      reset(){
           this.channelName = '';
           this.channelNum = '';
            if(this.nameFlag=='name1'){
            this.getTableList(1,10);
        }else if(this.nameFlag='name2'){
            this.getTableList1(1,10);
        }
      },
      //获取列表
      getTableList(current,rowCount){
        let  list = {
           channelName: this.channelName,
          channelNum: this.channelNum,
          current:current,
          rowCount:rowCount,
          approveState:'0'
        }
        this.$http.post('/yxcode-channel-gateway/demo/channelWfptController/queryApprovalInfo',list,{params: "application"}).then(res => {
          if(!res.data.hasErrors){
            this.total = res.data.data.total;
             this.data = res.data.data.data;
             this.current =  res.data.data.current;
          }
      });
      },
      //获取已处理的列表
      getTableList1(current,rowCount){
        let  list = {
           channelName: this.channelName,
          channelNum: this.channelNum,
          current:current,
          rowCount:rowCount,
          approveState:'1'
        }
        this.$http.post('/yxcode-channel-gateway/demo/channelWfptController/queryApprovalInfo',list,{params: "application"}).then(res => {
          if(!res.data.hasErrors){
            this.total1 = res.data.data.total;
             this.data1 = res.data.data.data;
             this.current1 =  res.data.data.current;
             this.pageSize1 =  res.data.data.pageSize;
          }
      });
      },

    },
    components: {
      crumbs
    },
    created() {
      this.getTableList(1,10);
    }
  }
</script>

<style lang="less">
.workApply{
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
   .ivu-tabs-ink-bar{
    width: 74px!important;
  }
}

</style>
