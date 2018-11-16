<!-- 我的渠道-列表 -->
<template>
  <div class="expension-mainterance">
    <div class="channels-common-search-content clearboth">

      <Row>
        <Col span="8">
            <span>渠道编号</span>
            <Input class="input-width margin-L-8" v-model.trim="form.channelCode" placeholder="请输入渠道编号"></Input>
        </Col>
        <Col span="8">
          <span>渠道名称</span>
          <Input class="input-width margin-L-8" v-model.trim="form.shopName" placeholder="请输入渠道名称"></Input>
        </Col>
        <Col span="8">
          <span>主体名称</span>
          <Input class="input-width margin-L-8" v-model.trim="form.mainName" placeholder="请输入主体名称"></Input>
        </Col>
      </Row>
      <Row>
          <span>当前状态</span>
          <span class="margin-L-8">
            <RadioGroup v-model="form.busiStatus" type="button">
                <Radio label="050200000">合作中</Radio>
                <Radio label="050200001">已停用</Radio>
                <Radio label="050200002">已退网</Radio>
                <Radio label="050200006">已到期</Radio>
                <Radio label="050200004">准入审核中</Radio>
                <Radio label="050200003">待验收</Radio>
                <Radio label="050200005">输入中</Radio>
                <Radio label="">不限</Radio>
            </RadioGroup>
            
          </span>
      </Row>

      <div style="padding: 20px 0 0; text-align: center">
        <Button :loading="loading_btn"  type="primary" size="large"  @click="searchfn">查询</Button>
        <Button class=""  size="large"  @click="reset">重置</Button>
      </div>
    </div>
    <div class="lineDiv"></div>
    <div class="channels-common-body clearboth">
      <div class="float-left"><b>列表总数：{{total}}</b></div>
      <div class="channels-common-body-button text-right">
        <div class="inline-block">
          <Button type="primary" icon="md-add" @click="add" v-if="addChannelBtn_falg">新建渠道</Button>
        </div>
      </div>
      <div class="vue-theader">
        <Table
        :loading="loading"
        :columns="columns" 
        :data="data"></Table>
      </div>
      
      <Page :total="total" :page-size-opts="[10,20,50,100]" :current="current" :page-size="rowCount" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator></Page>
    </div>

    

</div>
</template>

<script>
  export default {
    data () {
      return {
        loading_btn:false,
        loading: false,
        form:{
          channelCode:'',
          shopName:'',
          mainName:'',
          busiStatus: '',
        },
        search:{
          channelCode:'',
          shopName:'',
          mainName:'',
          busiStatus: '',
        },
        total:0,
        current:1,
        rowCount:10,
        columns: [
          {
            title: '渠道编号',
            key: 'channelCode',
            width:120
          },
          {
            title: '渠道科目',
            key: 'channelsName',
            className: "row-rel",
            children:[
              {
                title: '渠道科目',
                key: 'firstSubjectName',
                className: 'row-hidden',
                width:100
            },
            {
              title: '渠道科目',
                key: 'secondSubjectName',
                className: 'row-hidden',
                width:130
            },
            ]
          },
          {
            title: '业务类型',
            key: 'busiClassNames',
            tooltip:true,
            ellipsis: true,
          },
          {
            title: '渠道名称',
            key: 'shopName',
            width:200,
            tooltip:true,
            ellipsis: true,

          },
          {
            title: '主体名称',
            key: 'mainName',
            width:200,
            tooltip:true,
            ellipsis: true,
          },
          {
            title: '状态',
            key: 'busiStatusName',
            width:100
          },
          {
            title: '操作',
            key: 'action',
            width: 100,
            align: 'center',
            render: (h, params) => {
              let s = params.row.busiStatus;

              // 输入中
              if(s === '050200005'){
                return h('div', [
                  h('a', {
                    on: {
                      click: () => {
                        this.edit(params.row.channelId)
                      }
                    }
                  }, '编辑')
                ]);
              }
              else{
                // 准入审核中  // 待验收
                if(s === '050200004' || s === '050200003'){
                  return h('div', [
                    h('a', {
                      style: {
                        // marginRight: '10px',
                      },
                      on: {
                        click: () => {
                          this.show(params.row.channelId)
                        }
                      }
                    }, '查看')
                  ]);
                }else{
                  return h('div', [
                    h('a', {
                      style: {
                        marginRight: '10px',
                      },
                      on: {
                        click: () => {
                          this.show(params.row.channelId)
                        }
                      }
                    }, '查看'),
                    h('a', {
                      on: {
                        click: () => {
                          this.edit2(params.row.channelId)
                        }
                      }
                    }, '编辑')
                  ]);
                }

                
              }
              
            }
          }
        ],
        data:[],
        addChannelBtn_falg: false,




      }
    },
    methods: {

      //新建
      add () {
          //入参 空对象
          let params = {};

          this.$http.post('/tbMultipleNodeAccount/getTbMultipleNodeAccountByAccount', params).then( resp=> {
              if(resp.data.success) {
                  if(resp.data.data){
                      this.$bus.$emit("addChannel", {id:"addChannel",name:"新增渠道",refresh:true});
                  }else{
                    this.$Message.error('您尚不属于任何机构，暂不可创建渠道！')
                  }
              }
          })
      },
      //编辑
      edit (id) {
        this.$bus.$emit("channelSteps", {id:"channelSteps",name:"新增渠道",refresh:true,params:{ type: 'edit',channelId: id}});
      },
      //合作中编辑
      edit2 (id) {
        this.$bus.$emit("editChannel", {id:"editChannel",name:"编辑渠道",refresh:true,params:{ channelId: id}});
      },
      // 查看
      show (id){
        this.$bus.$emit("showChannel", {id:"showChannel",name:"渠道详情",refresh:true,params:{ channelId: id}});
      },
      // 加载表格
      loadTable() {
          this.loading = true;
          this.loading_btn = true;
          let obj = {
              current: this.current,
              rowCount: this.rowCount,
              channelCode: this.search.channelCode,
              shopName: this.search.shopName,
              mainName: this.search.mainName,
              busiStatus: this.search.busiStatus,
          };
          this.$http.post('/tbChannelBusiness/myChannelBusinessList',obj).then( resp=> {
              this.loading = false;
              this.loading_btn = false;
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
        this.form.busiStatus = '';
      },
      // 新建按钮
      returnBtns(){

            let arr = [
              {"system":"channel3","page":"channelBusiness","element":"createChannel"}
            ];

            this.$ajax.post('/user/permissions',arr).then(resp => {
                if (resp.data.success) {
                  this.addChannelBtn_falg = resp.data.data.createChannel || false;
                }
            })
        },
    },
    mounted(){
      this.loadTable();
      this.returnBtns();
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

