<!--审批管理-列表页-->
<template>
  <div class="expension-mainterance vue-theader" >
    <div class="channels-common-search-content clearboth">
      <Row>
        <Col span="8">
          <Row>
            <Col span="6" class="font-right">渠道编号</Col>
            <Col span="18"><Input v-model.trim="form.channelCode" placeholder="请输入渠道编号" class="input-width"></Input></Col>
          </Row>
        </Col>
        <Col span="8">
          <Col span="6" class="font-right">渠道名称</Col>
          <Col span="18"><Input v-model.trim="form.shopName" placeholder="请输入渠道名称" class="input-width"></Input></Col>
        </Col>
        <Col span="8">
          <Col span="6" class="font-right">店面名称</Col>
          <Col span="18">
            <Input v-model.trim="form.mainName" placeholder="请输入店面名称" class="input-width"></Input>
          </Col>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <Col span="6" class="font-right">提交申请时间</Col>
          <Col span="18">
            <Row class="date-picker">
                <DatePicker type="date" v-model="form.startTime" :editable="false" :options="option1"  placeholder="开始时间" style="width: 115px"></DatePicker>
                <span>&nbsp;-&nbsp;</span>
                <DatePicker type="date" v-model="form.endTime" :editable="false" :options="option2" placeholder="结束时间" style="width: 115px"></DatePicker>
            </Row>
          </Col>
        </Col>


        <Col span="8">
          <Col span="6" class="font-right">申请人姓名</Col>
          <Col span="18"><Input v-model.trim="form.applyUserName" placeholder="请输入申请人姓名" class="input-width"></Input></Col>
        </Col>

        <Col span="8">
          <Col span="6" class="font-right">申请事项</Col>
          <Col span="18">
            <Select v-model="form.applyType" class="input-width" placeholder="请选择申请事项">
              <Option v-for="item in applicationTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </Col>
        </Col>

        <Col span="16">
          <Col span="3" class="font-right">处理状态</Col>
          <Col span="18">
            <RadioGroup v-model="form.handlerStatus" type="button">
              <!-- <Radio label="00">待处理</Radio>
              <Radio label="01">已通过</Radio>
              <Radio label="02">已驳回</Radio>
              <Radio label="03">已撤销</Radio>
              <Radio label="04">已拒绝</Radio>
              <Radio label="05">已提交</Radio> -->
              <Radio label="">不限</Radio>
              <Radio label="00">待处理</Radio>
              <Radio label="01">已通过</Radio>
              <!-- <Radio label="04">已拒绝</Radio> -->
              <Radio label="02">已驳回</Radio>
              
            </RadioGroup>
          </Col>
        </Col>
      </Row>
      <div style="padding: 20px 0 0; text-align: center">
        <Button :loading="loading_btn" type="primary" size="large" @click="searchFn">查询</Button>
        <Button size="large" @click="resetFn">重置</Button>
      </div>
    </div>
    <div class="lineDiv"></div>
    <div class="channels-common-body clearboth">
      <div><b>列表总数：{{total}}</b></div>
      <Table
        :columns="columns"
        :data="data" :loading="loading"></Table>
      <Page :total="total" :page-size-opts="[10,20,50,100]" :current="current" :page-size="rowCount" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator></Page>

    </div>

  </div>
</template>

<script>
  export default {
    name: "approvalManagement",
    data () {
      const _this = this;
      return {
        loading_btn: false,
        loading: false,
        total:0,
        current:1,
        rowCount:10,
        form:{
          channelCode:'',
          shopName:'',
          mainName:'',
          startTime:'',
          endTime:'',
          applyUserName:'',
          applyType:'',
          handlerStatus:'00',
        },
        search:{
          channelCode:'',
          shopName:'',
          mainName:'',
          startTime:'',
          endTime:'',
          applyUserName:'',
          applyType:'',
          handlerStatus:'00',
        },
        option1:{
            disabledDate (date) {
                if(_this.form.endTime){
                    let s = new Date(new Date(_this.form.endTime).toLocaleDateString());
                    return date && date.valueOf() > s.getTime();
                }
            }
        },
        option2:{
            disabledDate (date) {
                if(_this.form.startTime){
                    // 处理成当前0点
                    let s = new Date(new Date(_this.form.startTime).toLocaleDateString());
                    return date && date.valueOf() < s.getTime();
                }
            }
        },
        applicationTypeList:[
        {
          label:'新增渠道',
          value:'001'
        },
        {
          label:'变更业务信息',
          value:'003'
        },
        {
          label:'变更店面信息',
          value:'004'
        },
        {
          label:'变更渠道状态',
          value:'002'
        },
        {
          label:'修改合作期限',
          value:'005'
        },
        {
          label:'租赁代理升级',
          value:'006'
        }
        ],
        columns: [
          {
            title: '渠道编号',
            key: 'channelCode',
            fixed: 'left',
            width:140
          },
          {
            title: '渠道科目',
            width:200,
            className: "row-rel",
            children: [
              {
                title: ' ',
                key: 'firstSubjectName',
                width: 100,
                className: 'row-hidden'
              },
              {
                title: ' ',
                key: 'secondSubjectName',
                width: 140,
                className: 'row-hidden'
              }
            ]
          },
          {
            title: '渠道名称',
            key: 'shopName',
            width:250,
            tooltip:true,
            ellipsis: true,
          },
          {
            title: '主体名称',
            key: 'mainName',
            width:240,
            tooltip:true,
            ellipsis: true,
          },
          {
            title: '申请事项',
            key: 'applyTypeName',
            width:140
          },
          {
            title: '审批状态',
            key: 'approvalStatusName',
            width:90
          },
          {
            title: '申请时间',
            key: 'applyTime',
            width:130,
            render: (h, params) => {
              return h('div',this.$formatDate(params.row.applyTime)) 
            }
          },
          {
            title: '处理状态',
            key: 'handlerStatusName',
            minWidth:100
          },
          {
            title: '操作',
            key: 'action',
            width: 100,
            align: 'center',
            fixed: 'right',
            render: (h, params) => {

              if(params.row.handlerStatus === '00'){
                  return h('div', [
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
                          this.toHandle(params.row)
                        }
                      }
                    }, '处理'),
                  ]);
              }else{
                return h('div', [
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
                      this.toView(params.row)
                    }
                  }
                }, '查看')
              ]);
              }
              
            }
          }
        ],
        data: [],

        pageList:{
          '001': 'applyAddNew',
          '002': 'startOrstopBusiness',
          '003': 'modifyBusiInfo',
          '004': 'modifyStoreInfo',
          '005': 'editCooperationTerm',
          '006': 'rentalAgent',
          '007': '',
          '0011': 'editReupload',
        },
      }
    },
    methods: {

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
              applyType: this.search.applyType,
              startTime: this.$formatDate(this.search.startTime),
              endTime: this.$formatDate(this.search.endTime),
              applyUserName: this.search.applyUserName,
              handlerStatus:this.search.handlerStatus,
          };
          this.$http.post('/tbChannelBusiness/myExamineApprovalTbChannelBussinessByPage',obj).then( resp=> {
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
      // 切换页数
      change_page(c) {
          this.current = c;
          this.$nextTick(()=>{
            this.loadTable();
          })
      },
      // 切换条数
      change_page_size(p) {
          this.current = 1;
          this.rowCount = p;
          this.$nextTick(()=>{
            this.loadTable();
          })
      },
      // 查询按钮
      searchFn(){
        this.search.channelCode = this.form.channelCode;
        this.search.shopName = this.form.shopName;
        this.search.mainName = this.form.mainName;
        this.search.applyType = this.form.applyType;
        this.search.startTime = this.form.startTime;
        this.search.endTime = this.form.endTime;
        this.search.applyUserName = this.form.applyUserName;
        this.search.handlerStatus = this.form.handlerStatus;
        this.current = 1;
        this.$nextTick(()=>{
          this.loadTable();
        })

      },
      // 重置按钮
      resetFn(){
        this.form.channelCode = '';
        this.form.shopName = '';
        this.form.mainName = '';
        this.form.applyType = '';
        this.form.startTime = '';
        this.form.endTime = '';
        this.form.applyUserName = '';
        this.form.handlerStatus = '00'
      },

      // 处理
      toHandle(d){

        this.$http.post('/channelWfpt/getChannelApplyType',{id: d.workFlowId, buttonType:"1"}).then( resp=> {
            if(resp.data.success) {
                let data = resp.data.data;
                let name = this.pageList[data.applyType];
                let cName = data.applyTypeName + '审批';
                d.type = 'approve';

                if(data.applyType === '0011'){
                  cName = '销售渠道准入-保证金财务审批';
                }

                this.$bus.$emit(name, {id: name, name: cName, refresh:true, params: d });
            }
        })
      },
      // 查看
      toView(d){

        let name = this.pageList[d.applyType];
        let cName = d.applyTypeName + '详情';
        d.type = 'apply';
        this.$bus.$emit(name, {id: name, name: cName, refresh:true, params: d });

        // this.$http.post('/channelWfpt/getChannelApplyType',{id: d.workFlowId, buttonType:"2"}).then( resp=> {
        //     if(resp.data.success) {
        //         let data = resp.data.data;
        //         let name = this.pageList[data.applyType];
        //         let cName = data.applyTypeName + '详情';
        //         d.type = 'apply';
        //         this.$bus.$emit(name, {id: name, name: cName, refresh:true, params: d });
        //     }
        // })
      }
    },
    mounted () {
      this.loadTable();
    }
  }
</script>







