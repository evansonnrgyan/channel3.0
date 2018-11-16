<!--我的申请-列表页-->
<template>
  <div class=" vue-theader" >
    <div class="channels-common-search-content clearboth">
      <Row>
        <Col span="8">
          <Row>
            <span>渠道编号</span>
            <Input v-model.trim="form.channelCode" placeholder="请输入渠道编号" class="input-width margin-L-8"></Input>
          </Row>
        </Col>
        <Col span="8">
          <span>渠道名称</span>
          <Input v-model.trim="form.shopName" placeholder="请输入渠道名称" class="input-width margin-L-8"></Input>
        </Col>
        <Col span="8">
          <span>主体名称</span>
          <Input v-model.trim="form.mainName" placeholder="请输入主体名称" class="input-width margin-L-8"></Input>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <span>申请事项</span>
            <Select v-model="form.applyType" class="input-width margin-L-8" placeholder="请选择申请事项">
              <Option value="" >不限</Option>
              <Option value="001" >销售渠道准入</Option>
              <Option value="003" >变更业务信息</Option>
              <Option value="002" >变更渠道状态</Option>
              <!-- <Option value="004" >变更店面信息</Option> -->
              <Option value="005" >修改合作期限</Option>
              <Option value="006" >租赁代理升级</Option>
              <Option value="007" >新增分级经销商</Option>
            </Select>
        </Col>
        <Col span="16">
          <span>审批状态</span>
          <RadioGroup v-model="form.approvalStatus" type="button" class="margin-L-8">
            <!-- <Radio label="0">输入中</Radio>
            <Radio label="1">审批中</Radio>
            <Radio label="2">审批完成</Radio>
            <Radio label="3">已拒绝</Radio>
            <Radio label="4">已驳回</Radio>
            <Radio label="5">已撤销</Radio>
            <Radio label="6">已失效</Radio>
            <Radio label="">不限</Radio> -->
            <Radio label="">不限</Radio>
            <Radio label="1">审批中</Radio>
            <Radio label="2">已批准</Radio>
            <Radio label="4">被驳回</Radio>
            <Radio label="5">已撤销</Radio>

          </RadioGroup>
        
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
        :loading="loading" 
        :columns="columns"
        :data="data"></Table>
      
      <Page :total="total" :page-size-opts="[10,20,50,100]" :current="current" :page-size="rowCount" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator></Page>
    </div>


    <!-- 撤销 -->
        <Modal
          v-model="modal"
          title="操作说明"
          @on-cancel="cancelModal"
          >
          <Row :gutter="16">
            <Col span="9" class="text-right">
              <h3>确认撤回 / 取消该申请？</h3>
            </Col>
          </Row>
          <br>
          <Row :gutter="16">
              <Col span="20" class="text-right">
                <p>注意：操作成功后将结束当前申请，如继续修改需要重新编辑和提交。</p>
              </Col>
          </Row>
          <br>
            <Row :gutter="16">
              <Col span="6" class="text-right">
                说明
              </Col>
              <Col span="16">
                  <Input v-model="remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="支持200字录入" :maxlength="200" />
                  <limitLength :value="remark" :max="200"/>
              </Col>
          </Row>
            <div slot="footer">
            <Button @click="cancelModal">取消</Button>
            <Button type="primary" :loading="loadingOk"  @click="ok">确定</Button>
          </div>
        </Modal>


  </div>
</template>

<script>
  export default {
    name: "myApplication",
    data () {
      return {
        modal:false,
        remark:'',
        loading_btn: false,
        loading: false,
        loadingOk: false,
        total:0,
        current:1,
        rowCount:10,
        form:{
          channelCode:'',
          shopName:'',
          mainName:'',
          applyType:'',
          approvalStatus:'1'
        },
        search:{
          channelCode:'',
          shopName:'',
          mainName:'',
          applyType:'',
          approvalStatus:'1'
        },
        columns: [
          {
            title: '渠道编号',
            key: 'channelCode',
            fixed: 'left',
            width:120
          },
          {
            title: '渠道科目',
            className: "row-rel",
            children: [
              {
                title: ' ',
                key: 'firstSubjectName',
                className: 'row-hidden',
                width:100
              },
              {
                title: ' ',
                key: 'secondSubjectName',
                className: 'row-hidden',
                width:130
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
            width:250,
            tooltip:true,
            ellipsis: true,
          },
          {
            title: '申请事项',
            key: 'applyTypeName',
            width:120
          },
          {
            title: '申请时间',
            key: 'applyTime',
            width:120
          },
          {
            title: '审批状态',
            key: 'approvalStatusName',
            width:100
          },
          {
            title: '当前待办人',
            key: 'currentApproveUserName',
            minWidth:120,
            tooltip:true,
            ellipsis: true,
          },
          {
            title: '操作',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (h, params) => {

              let d = params.row;

              // 审批中
              if(d.approvalStatus === '1'){

                if(d.IsCancle === '0'){
                  return h('div', [
                    h('a', {
                      style: {
                        marginRight: '10px',
                      },
                      on: {
                        click: () => {
                          this.show(d)
                        }
                      }
                    }, '查看'),
                    h('a', {
                      on: {
                        click: () => {
                          this.cancel(d,'撤销')
                        }
                      }
                    }, '撤销'),
                  ]);

                }else{
                  return h('div', [
                    h('a', {
                      style: {
                        // marginRight: '10px',
                      },
                      on: {
                        click: () => {
                          this.show(d)
                        }
                      }
                    }, '查看'),
                  ]);
                }
                
              }else
              // 已批准
              if(d.approvalStatus === '2' || d.approvalStatus === '5'){
                return h('div', [
                  h('a', {
                    style: {
                      // marginRight: '10px',
                    },
                    on: {
                      click: () => {
                        this.show(d)
                      }
                    }
                  }, '查看'),
                ]);
              }else
              // 被驳回
              if(d.approvalStatus === '4'){
                if(d.IsCancle === '0'){

                  if(d.isEdit === '1'){
                    return h('div', [
                      h('a', {
                        style: {
                          marginRight: '10px',
                        },
                        on: {
                          click: () => {
                            this.edit(d)
                          }
                        }
                      }, '编辑'),
                      h('a', {
                        style: {
                          // marginRight: '10px',
                        },
                        on: {
                          click: () => {
                            this.cancel(d,'取消申请')
                          }
                        }
                      }, '取消申请'),
                    ]);
                  }else{
                    return h('div', [
                      h('a', {
                        style: {
                          // marginRight: '10px',
                        },
                        on: {
                          click: () => {
                            this.cancel(d,'取消申请')
                          }
                        }
                      }, '取消申请'),
                    ]);
                  }
                  
                }else{
                  return h('div', [
                    h('a', {
                      style: {
                        // marginRight: '10px',
                      },
                      on: {
                        click: () => {
                          this.edit(d)
                        }
                      }
                    }, '编辑'),
                  ]);
                }
                
              }
            }
          }
        ],
        data: [],

        // 申请详情
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
        // 驳回编辑页面
        editPageList:{
          '001': 'channelSteps',        //新建渠道
          '002': 'runOrStopChannel',   //变更渠道状态
          '003': 'busiInfoEdit',      //变更业务信息
          '004': 'storeInfoEdit',     //变更店面信息
          '005': 'timeLimitEdit',     //修改合作期限
          '006': 'applyUpdate',       //租赁代理升级
          '007': '',                  //新增分级经销商
          '0011': 'editReupload',     //重传凭证
        },
        currentObj:{},
        modelText:''
      }
    },
    methods: {

      // 查看
      show(d){
        let name = this.pageList[d.applyType];
        let cName = d.applyTypeName + '详情';
        d.type = 'apply';
        this.$bus.$emit(name, {id: name, name: cName, refresh:true, params: d });
      },
      // 编辑
      edit(d){
     
        this.$http.post('/channelWfpt/getChannelApplyType',{id: d.workFlowId, buttonType:"0"}).then( resp=> {
              if(resp.data.success) {
                  let data = resp.data.data;
                  let name = this.editPageList[data.applyType];
                  let cName = data.applyTypeName;
                  d.type = 'reject';
                  this.$bus.$emit(name, {id: name, name: cName, refresh:true, params: d });
              }
          })
      },
      // 撤销
      cancel(d,t){
        this.modelText = t;
        this.modal = true;
        this.currentObj = d;
      },
      cancelModal(){
        this.modal = false;
        this.remark = '';
      },
      
      // 确认撤销
      ok(){

         if(this.remark === ''){
            this.$Message.error('请填写' + this.modelText + '原因');
            return;
          }
          this.loadingOk = true;
          let url,json;
          url = '/channelWfpt/applyCancle';
          json = {
                workFlowId: this.currentObj.workFlowId,
                cancelReason: this.remark
            }
          this.$http.post(url, json).then((resp)=>{
              if (resp.data.success) {
                  this.$Message.success(this.modelText + '成功');
                  this.cancelModal();
                  this.loadTable();
              }
              this.loadingOk = false;
            })
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
              applyType: this.search.applyType,
              approvalStatus: this.search.approvalStatus,
          };
          this.$http.post('/tbChannelBusiness/myApprovalTbChannelBussinessByPage',obj).then( resp=> {
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
    
      //查询按钮
      searchFn(){
        this.search.channelCode = this.form.channelCode;
        this.search.shopName = this.form.shopName;
        this.search.mainName = this.form.mainName;
        this.search.applyType = this.form.applyType;
        this.search.approvalStatus = this.form.approvalStatus;
        this.current = 1;
        this.$nextTick(()=>{
          this.loadTable();
        })
       
      },
      //重置按钮
      resetFn(){
        this.form.channelCode = '';
        this.form.shopName = '';
        this.form.mainName = '';
        this.form.applyType = '';
        this.form.approvalStatus = '1'
      }
    },
    mounted () {
      this.loadTable();
    }
  }
</script>

<style>
  .padding10{
    padding: 10px 0 10px 0;
  }

  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ztree-style{
    position: relative;
    border: 1px solid #ccc;
    left: 146px;
    width: 300px;
  }
</style>



