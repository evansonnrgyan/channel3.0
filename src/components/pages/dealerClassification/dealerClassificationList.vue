<!-- 经销商分级-列表 -->
<template>
  <div class="expension-mainterance">
    <div class="channels-common-search-content clearboth">

      <Row>
        <Col span="8">
          <Row>
            <Col span="4" >渠道编号</Col>
            <Col span="20"><Input class="input-width" v-model="form.channelCode" placeholder="请输入渠道编号"></Input></Col>
          </Row>
        </Col>
        <Col span="8">
          <Col span="4">渠道名称</Col>
          <Col span="20"><Input class="input-width" v-model="form.shopName" placeholder="请输入渠道名称"></Input></Col>
        </Col>
        <Col span="8">
          <Col span="4" >主体名称</Col>
          <Col span="20"><Input class="input-width" v-model="form.mainName" placeholder="请输入主体名称"></Input></Col>
        </Col>
      </Row>
      <Row>
          <Col span="2" >审批状态</Col>
          <Col span="22" style="margin-left:-2.8%">
            <RadioGroup v-model="form.busiStatus" type="button">
                <Radio label="050200000">合作中</Radio>
                <Radio label="050200001">已关停</Radio>
                <Radio label="050200002">已退网</Radio>
                <Radio label="050200003">待验收</Radio>
                <Radio label="050200004">准入审核中</Radio>
                <Radio label="050200005">输入中</Radio>
                <Radio label="">不限</Radio>
            </RadioGroup>
            
          </Col>
      </Row>

      <div style="padding: 20px 0 0; text-align: center">
        <Button class="marginR10"   @click="reset">重置</Button>
        <Button  type="primary"  @click="searchfn">查询</Button>
      </div>
    </div>
    <div class="channels-common-body clearboth">
      <div class="float-left"><b>列表总数：{{total}}</b></div>
      <div class="channels-common-body-button text-right">
        <Button type="primary" icon="md-add" @click="add">新建经销商</Button>
      </div>
      <div class="">
        <Table
        :columns="columns" 
        :data="data"></Table>
      </div>
      
      <Page :total="total" :current="current" :page-size="rowCount" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator></Page>
    </div>

    

</div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        form:{
          channelCode:'',
          shopName:'',
          mainName:'',
          busiStatus: '050200000',
        },
        search:{
          channelCode:'',
          shopName:'',
          mainName:'',
          busiStatus: '050200000',
        },
        total:0,
        current:1,
        rowCount:10,
        columns: [
          {
            title: '渠道编号',
            key: 'channelCode',
          },
          
          {
            title: '代理级别',
            key: 'rentLevelName',
          },
          {
            title: '渠道名称',
            key: 'shopName',
          },
          {
            title: '主体名称',
            key: 'mainName',
          },
          {
            title: '主管租赁经理',
            key: 'mainName',
          },

          {
            title: '审批状态',
            key: 'approvalStatusName',
          },
          {
            title: '操作',
            key: 'action',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '10px',
                    color: '#2d8cf0',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.show(params.row.id)
                    }
                  }
                }, '查看'),
                h('span', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    color: '#2d8cf0',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row.channelId)
                    }
                  }
                }, '编辑')
              ]);
            }
          }
        ],
        data:[]




      }
    },
    methods: {
      //新建经销商
      add () {
        this.$bus.$emit("dealerClassificationAdd", {id:"dealerClassificationAdd", refresh:true, name:"新建经销商"});
      },
      // 编辑
      edit(id){
        this.$bus.$emit("dealerClassificationAdd", {id:"dealerClassificationAdd", refresh:true, name:"编辑经销商",params:{id: id}});
      },
      // 加载表格
      loadTable() {
          this.loading = true;
          let obj = {
              current: this.current,
              rowCount: this.rowCount,
              channelCode: this.search.channelCode,
              shopName: this.search.shopName,
              mainName: this.search.mainName,
              busiStatus: this.search.busiStatus,
          };
          this.$http.post('/tbChannelBusiness/queryDistributorChannelListByPage',obj).then( resp=> {
              this.loading = false;
              if(resp.data.success) {
                  let data = resp.data.data;
                  this.data = data.data;
                  this.total = data.total;
                  this.rowCount = data.rowCount;
              }
          })
      },
      change_page(c) {
          this.current = c;
          this.$nextTick(()=>{
            this.loadTable();
          })
      },
      change_page_size(p) {
          this.current = 1;
          this.rowCount = p;
          this.$nextTick(()=>{
            this.loadTable();
          })
      },
      // 搜索
      searchfn(){
        this.search.channelCode = this.form.channelCode;
        this.search.shopName = this.form.shopName;
        this.search.mainName = this.form.mainName;
        this.search.busiStatus = this.form.busiStatus;
        this.current = 1;
        this.$nextTick(()=>{
          this.loadTable();
        })
      },
      // 重置
      reset(){
        this.form.channelCode = '';
        this.form.shopName = '';
        this.form.mainName = '';
        this.form.busiStatus = '050200000';
      }
    },
    mounted(){
      this.loadTable();
    }

  }
</script>

<style>
  .displayNo{
    display: none;
  }
  .padding10{
    padding: 10px 0 10px 0;
  }

  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

