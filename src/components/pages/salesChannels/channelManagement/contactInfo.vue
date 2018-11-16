<!-- 联系人 -->
<template>
  <div class="" >
    <div class="text-right" v-if="edit" style="margin-bottom:5px">
      <Button type="primary" size="large" @click="add">新增联系人</Button>
    </div>

    <!--联系人-->
    <Modal
      v-model="modal"
      width="850"

      :title="title" @on-cancel="cancel">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
      <Row>
        <Col span="12">
          <FormItem label="姓名" prop="name">
            <Input class="input-width" v-model="formValidate.name" placeholder="" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="办公电话" prop="gongPhone">
           <Input class="input-width" v-model="formValidate.gongPhone" placeholder="" />
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="12">
          <FormItem label="职务" prop="job">
            <Select v-model="formValidate.job" class="input-width" placeholder="">
                      <Option v-for="item in jobList" :value="item.itemCode" :key="item.itemCode">{{ item.itemName }}</Option>
                  </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="性别" prop="sex">
            <RadioGroup v-model="formValidate.sex">
                        <Radio label="1">男</Radio>
                        <Radio label="0">女</Radio>
                    </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="12">
          <FormItem label="手机" prop="phone">
             <Input class="input-width" v-model="formValidate.phone" placeholder="" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="部门" prop="bumen">
            <Select v-model="formValidate.bumen" class="input-width" placeholder="">
                      <Option v-for="item in bumenList" :value="item.itemCode" :key="item.itemCode">{{ item.itemName }}</Option>
                  </Select>
          </FormItem>
        </Col>
      </Row>


      <Row>
        <Col span="12">
          <FormItem label="email" prop="email">
            <Input class="input-width" v-model="formValidate.email" placeholder="" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="备注" prop="remark">
            <Input v-model="formValidate.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"  class="input-width" placeholder="" />
          </FormItem>
        </Col>
      </Row>
      </Form>
      <div slot="footer" class="text-center">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="addOk('formValidate')">保存</Button>
        
      </div>
    </Modal>

    <!-- <tableAndPage ref="table" url="/contacterInfo/queryContacter" :columns="columns" :params="{channelId: pid}" /> -->

    <Table :columns="columns" :data="data" :loading="loading"></Table>
    <Page v-if="data.length>0" :total="total" :current="current" :page-size="rowCount" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator></Page>

  </div>
</template>
<script>
  export default {
    name: "",
    props:{
      pid:{
        type:String,
        default:'',
      },
      edit:{
        type:Boolean,
        default:false
      },
     
    },
    data() {
      return {
        title:'',
        modal:false,
        columns:[
          {
            title:"标记",
            key:"contacterType",
            width:100,
            fixed:'left',
            render: (h, params) => {
              if(params.row.contacterType && params.row.contacterType !== '00'){
                return h('div','主联系人');
              }
            }
          },
          {
            title:"姓名",
            key:"name",
            fixed:'left',
            width:110
          },
          {
            title:"职务",
            key:"positionName",
            width:130
          },
          {
            title:"手机号",
            key:"phone",
            width:130
          },
          {
            title:"办公电话",
            key:"officeTel",
            width:130
          },
          {
            title:"联系邮箱",
            key:"email",
            width:180
          },
          {
            title:"性别",
            key:"sex",
            width:80,
            render: (h, params) => {
              if(params.row.sex  === '1'){
                return h('div','男');
              }else
              if(params.row.sex  === '0'){
                return h('div','女');
              }
            }
          },
          {
            title:"部门",
            key:"departmentName",
            width:130
          },
          {
            title:"备注",
            key:"note",
            width:200,
            tooltip:true,
            ellipsis: true,
          },
          {
            title:"修改人",
            key:"updatorName",
            width:100
          },
          {
            title:"最近修改时间",
            key:"updateTime",
            minWidth:200
          },
          {
            title:"操作",
            fixed:'right',
            width:200,
            render: (h, params) => {

              let d = params.row;

              if(d.contacterType === '00'){
                return h('div', [
                  h('a', {
                    style: {
                      marginRight: '10px',
                    },
                    on: {
                      click: () => {
                        this.setMain(d.id)
                      }
                    }
                  }, '设为主联系人'),
                  h('a', {
                    style: {
                      marginRight: '10px',
                    },
                    on: {
                      click: () => {
                        this.Edit(d.id)
                      }
                    }
                  }, '编辑'),
                  h('a', {
                    on: {
                      click: () => {
                        this.dele(d.id)
                      }
                    }
                  }, '删除')
                ]);
              }else{
                return h('div', [
                  h('a', {
                    style: {
                      marginRight: '10px',
                    },
                    on: {
                      click: () => {
                        this.Edit(d.id)
                      }
                    }
                  }, '编辑'),
                  // h('a', {
                  //   on: {
                  //     click: () => {
                  //       this.dele(d.id)
                  //     }
                  //   }
                  // }, '删除')
                ]);
              }
            }
          },
        ],

      
        jobList:[],
        bumenList:[],
        bumenList:[],
        formValidate:{
          id:'',
          name:'',
          job:'',
          phone:'',
          email:'',
          gongPhone:'',
          sex:'',
          bumen:'',
          remark:'',
          contacterType:'00'
        },
        ruleValidate:{
              name: [
                  { required: true, message: '请输入姓名', trigger: 'blur' }
              ],
              job: [
                  { required: true, message: '请选择职务',  trigger: 'change' }
              ],
              phone: [
                  { required: true, message: '请输入手机', trigger: 'blur' },
                  { pattern: /^[0-9]{11}$/, trigger: 'blur' ,message: '号码格式不正确'}
              ],
              email: [
                  { required: true, message: '请输入邮箱', trigger: 'blur' },
                  { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
              ],
              gongPhone: [
                  { message: '电话格式不正确',pattern: /(^[0-9,\.#%'\+\*\-:;^_`]+$)/, trigger: 'blur'}
              ]
            
          },

          loading:false,
          total:0,
          current:1,
          rowCount:10,
          data:[],
      }
    },
    watch:{
      pid(nv){
        if(nv !== ''){
          this.loadTable();
        }
      }
    },
    methods:{

      // 加载表格
      loadTable() {
          this.loading = true;
          
          let json = {
            channelId: this.pid,
            current: this.current,
            rowCount: this.rowCount
          }
          
          this.$http.post('/contacterInfo/queryContacter', json).then( resp=> {
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


      getJobList(){
                this.$http.post("/contacterInfo/getPositionCode").then((resp)=>{
                    if(resp.data.success){
                        let data = resp.data.data;
                        this.jobList = data;
                    };
                })
            },

            getbumenList(){
                this.$http.post("/contacterInfo/getDepartmentCode").then((resp)=>{
                    if(resp.data.success){
                        let data = resp.data.data;
                        this.bumenList = data;
                    };
                })
            },

            Edit(id){
              this.modal = true;
              this.title="编辑联系人";
              this.$http.post("/contacterInfo/getContacter",{id: id}).then((resp)=>{
                    if(resp.data.success){
                        let data = resp.data.data;
                        this.formValidate.id = data.id;
                        this.formValidate.name = data.name;
                        this.formValidate.gongPhone = data.officeTel;
                        this.formValidate.sex = data.sex;
                        this.formValidate.job = data.positionCode;
                        this.formValidate.phone = data.phone;
                        this.formValidate.bumen = data.departmentCode;
                        this.formValidate.email = data.email;
                        this.formValidate.remark = data.note;
                        this.formValidate.contacterType = data.contacterType;
                    };
                })
            },
            setMain(id){

              this.$Modal.confirm({
                  title: '提示',
                  content: '<p>确认设置为主联系人？</p>',
                  onOk: () => {
                      this.$http.post("/contacterInfo/setPrimaryContacter",{id:id,channelId:this.pid}).then((resp)=>{
                          if(resp.data.success){
                               this.$Message.success('设置成功！');
                                this.loadTable();
                          }
                      })
                  },
              });
              
            },
            dele(id){

              this.$Modal.confirm({
                  title: '提示',
                  content: '<p>确认删除？</p>',
                  onOk: () => {
                      this.$http.post("/contacterInfo/delContacter",{id:id,channelId:this.pid}).then((resp)=>{
                          if(resp.data.success){
                               this.$Message.success('删除成功！');
                                this.loadTable();
                            }
                      })
                  },
              });

            },
            cancel(){
              this.modal = false;
              this.$refs['formValidate'].resetFields();
            },
            addOk(name){
              this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.save();
                    } else {
                        this.$Message.error('表单验证失败');
                    }
                })
            },
            add(){
              this.title="新增联系人";
              this.modal = true;
            },
            save(){
              let json={
                  id: this.formValidate.id,
                  channelId: this.pid,
                  name:this.formValidate.name,
                  officeTel:this.formValidate.gongPhone,

                  sex:this.formValidate.sex,
                  positionCode:this.formValidate.job,

                  phone:this.formValidate.phone,
                  departmentCode:this.formValidate.bumen,

                  email:this.formValidate.email,
                  note:this.formValidate.remark,
                  contacterType: this.formValidate.contacterType
              }
              this.$http.post("/contacterInfo/saveContacter",json).then((resp)=>{
                    if(resp.data.success){
                        this.$Message.success('操作成功！');
                        this.loadTable();
                        this.cancel();
                    };
                })
            }
          },
          mounted(){
            if(this.edit){

              this.getJobList();
             this.getbumenList();
            }else{
              this.columns.pop();
            }

            if(this.pid !== ''){
              this.loadTable();
            }
            
          }
  }
</script>
