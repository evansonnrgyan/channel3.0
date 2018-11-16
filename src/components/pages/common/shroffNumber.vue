<!-- 收款信息 -->
<template>

<div>
	<Form ref="formData" :model="formData" :rules="formDataValidate" :label-width="130">
      <Row class="padding-tb">
            <Col span="24">
              <FormItem label="自定义收款方名称" prop="customBusinessName">
                <Input v-model="formData.customBusinessName" placeholder="自定义企业名称" class="input-width" :maxlength="20"></Input>
                <limitLength :value="formData.customBusinessName" :max="20"/>
                <span>此名称仅用于页面提示，不会影响收款,请自行定义</span>
              </FormItem>
        </Col>
      </Row>

      <Row class="padding-tb" v-if="type !== '2'">
        <Col span="24">
              <FormItem label="账户类型" prop="accountType">
                <Select v-model="formData.accountType" placeholder="账户类型" class="input-width">
                  <Option value="0">企业</Option>
                  <Option value="1">个人</Option>
                </Select>
                <span>注意：新车业务禁止对私放款，不可选择个人账户</span>
              </FormItem>
        </Col>
       
      </Row>

      <Divider>以下信息影响收款，请仔细填写</Divider>
    

      <Row class="padding-tb">
        <Col span="12">
          <Row>
            <FormItem label="开户名称" prop="openAccountName">
              <Input v-model.trim="formData.openAccountName" placeholder="开户名称" class="input-width" :maxlength="40"></Input> 
              <limitLength :value="formData.openAccountName" :max="40"/>
            </FormItem>
          </Row>
        </Col>
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="详细支行名称" prop="bankBatchName">
                 <Input v-model="formData.bankBatchName" class="input-width" readonly placeholder="弹框内列表选择" :title="formData.bankBatchName">
                            <Button type="primary" slot="append" @click="clickBankName" class="select-button">选择</Button>
                        </Input>
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row class="padding-tb">
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="账号" prop="accountCode">
                <Input v-model="formData.accountCode" placeholder="账号" class="input-width"></Input>
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span="12">
          <Row>
            <Col class="font-right sub-title" span="6">电子联行号</Col>
            <Col span="18">{{formData.accountNumber}}</Col>
          </Row>
        </Col>
      </Row>

      <Row class="padding-tb">
        <Col span="12">
                  <FormItem label="开户省市" prop="address" >

                    <Cascader v-model="formData.address" :data="data4" :load-data="loadData" class="input-width" :render-format="format"  @on-change="handleChange"></Cascader>

                  
                  </FormItem>
              
        </Col>
      </Row>

      <Row class="padding-tb">
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="收款联系人" prop="payee" v-if="formData.accountType === '0'">
                <Input v-model="formData.payee" placeholder="收款联系人" class="input-width"></Input>
              </FormItem>
              <FormItem label="持卡人联系电话" prop="receivablePhone" v-else>
                <Input v-model="formData.receivablePhone" placeholder="持卡人联系电话" class="input-width"></Input>
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="收款联系电话" prop="payeePhone" v-if="formData.accountType === '0'">
                <Input v-model="formData.payeePhone" placeholder="收款联系电话" class="input-width"></Input>
              </FormItem>
              <FormItem label="持卡人身份证" prop="receivableIdentityCard" v-else>
                <Input v-model="formData.receivableIdentityCard" placeholder="持卡人身份证" class="input-width"></Input>
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row class="padding-tb">
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="收款联系邮箱" prop="payeeEmail"  v-if="formData.accountType === '0'">
                <Input v-model="formData.payeeEmail" placeholder="收款联系邮箱" class="input-width"></Input>
              </FormItem>
              <FormItem label="持卡人联系邮箱" prop="receivableEmail" v-else>
                <Input v-model="formData.receivableEmail" placeholder="持卡人联系邮箱" class="input-width"></Input>
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row class="padding-tb">
        <Col span="24">
          <Row>
            <Col span="24">
              <FormItem label="收款类型" prop="receiptType">
                <CheckboxGroup v-model="formData.receiptType">
                  <Checkbox :label="item.id" :key="item.id" v-for="item in receiptTypeList">{{item.accountTypeName}}</Checkbox>
                 
                </CheckboxGroup>
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row class="padding-tb">
        <Col span="24">
          <Row>
            <Col span="24">
              <FormItem label="开户名称" prop="receiptAccountImg">
                <oneFile :value.sync="formData.receiptAccountImg" attachmentCode="0000000029" :btns="['show','down','again']" @clearValidate="clearValidate" />
              </FormItem>
              <div class="uploadInfo color-upload" v-if="type === '2'">
                <br /><br /><br />
                  请上传开户许可证
              </div>
              <div class="uploadInfo color-upload"  v-else>
                上传说明：<br />
                1、企业账号可上传开户许可证，以及其他可证明账号有效性的文件；<br />
                2、个人账号可上传银行卡扫描件；<br />
                3、部门内规定的其他证明文件。
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      </Form>

      <!-- 银行信息 -->
        <Modal
        v-model="modal_bank" width="850" class-name="modal-padding" 
        title="银行信息">
        <Form  :label-width="90">
          <Row>
              <Col span="8">
                  <FormItem label="所属银行名称" prop="">
                      <Input v-model="forms.affiliatedBank" placeholder="所属银行名称" class="inline-block"></Input>
                  </FormItem>
              </Col>
              <Col span="8">
                  <FormItem label="电子联行号" prop="">
                      <Input v-model="forms.accountNumber" placeholder="电子联行号"  class="inline-block"></Input>
                  </FormItem>
              </Col>
              <Col span="8">
                  <FormItem label="开户名称" prop="">
                      <Input v-model="forms.accountName" placeholder="开户名称" class="inline-block"></Input>
                  </FormItem>
              </Col>
          </Row>
        </Form>

        <Row class="text-center">
            <Button @click="reset">重置</Button>
            <Button type="primary" @click="search_bank">搜索</Button>
        </Row>
        <br>
        <Table :loading="loading" :columns="columns_bank" :data="data_bank" size="small"></Table>
        <Page size="small" :total="total_bank" :current="current_bank" :page-size="pagesize_bank" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator></Page>
    </Modal>
    </div>
</template>

<script>
    export default {
      props:{
        value:{
            type: Object,
            default: {},
        },
        flag:{
            type: Boolean,
            default:false
        },
        edit:{
            type: Boolean,
            default: false
        },
        type:{
            type: String,
            default: ''
        },
      },
        data() {
            return {
              modal_bank:false,
                formData:{
                    accountCode:'',//账号
                    address:[],//开户省市ID
                    addressName:[],//开户省市名称
                    customBusinessName: "", //自定义企业名称
                    accountType: "0", //账户类型
                    openAccountName: "", //开户名称
                    bankBatchName: "",//详细支行名称
                    bankId:'',//详细支行ID
                    accountNumber: "", //电子联行号
                    province: "",//开户省
                    city: "",//开户市
                    payee: "",//收款联系人
                    payeePhone: "",//收款联系电话
                    payeeEmail: "",//收款联系邮箱
                    receiptType:[],//收款类型
                    receiptAccountImg:{},//收款账号凭证

                    // 个人
                    receivablePhone:'',
                    receivableIdentityCard:'',
                    receivableEmail:'',
                },
                formDataValidate: {
                    customBusinessName: [{ required: true, type: 'string', message: '自定义收款方名称不能为空,2-20个字符', min:2,max:20, trigger: 'blur' }],
                    accountType: [{ required: true, message: '账户类型不能为空', trigger: 'blur' }],
                    openAccountName: [{ required: true, type: 'string', message: '开户名称不能为空,2-40个字符', min:2,max:40, trigger: 'blur' }],
                    bankBatchName: [{ required: true, message: '详细支行名称不能为空', trigger: 'blur' }],
                    accountNumber: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
                    province: [{ required: true, message: '选择省不能为空', trigger: 'change' }],
                    city: [{ required: true, message: '选择市不能为空', trigger: 'change' }],
                    payee:[{ required: true, message: '收款联系人不能为空', trigger: 'blur' }],
                    payeePhone:[{ required: true, message: '收款联系不能为空', trigger: 'blur' }],
                    payeeEmail:[{ required: true, message: '收款联系邮箱不能为空', trigger: 'blur' }],
                    receiptType:[{ required: true,type:'array', message: '收款类型不能为空', trigger: 'blur' }],
                    accountCode:[{ required: true, message: '账号不能为空', trigger: 'blur' }],
                    address:[{ required: true, type:'array', message: '省市不能为空', trigger: 'blur' }],
                    payee:[{ required: true,  message: '收款联系人不能为空', trigger: 'blur' }],
                    payeePhone:[{ required: true,  message: '收款联系电话不能为空', trigger: 'blur' }],
                    receiptAccountImg: [{
                        type: "object", required: true,
                        fields: {
                          attachmentName: {required: true,trigger: 'change',message: '请选择上传文件！'},
                        }
                    }],

                    receivablePhone:[{ required: true,  message: '持卡人联系电话不能为空', trigger: 'blur' }],
                    receivableIdentityCard:[{ required: true,  message: '持卡人身份证不能为空', trigger: 'blur' }],
                    receivableEmail:[{ required: true,  message: '持卡人邮箱不能为空', trigger: 'blur' }],
                  },
                  columns_bank: [
                {
                    title: '电子联行号',
                    key: 'accountNumber',
                }, 
                {
                    title: '所属银行',
                    key: 'affiliatedBank',
                },
                {
                    title: '详细支行名称',
                    key: 'accountName',
                },
               {
                    title: '操作',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                style: {
                                    color: "#2d8cf0"
                                },
                                on: {
                                    click: () => {
                                        this.select_bank(params.row)
                                    }
                                }
                            }, '选择')
                        ]);
                    }
                }],
                data_bank:[],
                current_bank:1,
              pagesize_bank:10,
              total_bank:0,
              forms:{
                affiliatedBank:'',
                accountNumber:'',
                accountName:'',
              },
              search:{
                affiliatedBank:'',
                accountNumber:'',
                accountName:'',
              },
              data4:[],
              receiptTypeList:[],
              loading:false,
            }
        },
        watch:{

            formData: {
                handler: function (newVal) {
                    this.$emit('update:value', newVal);

                  },
                deep: true
            }
        },
        methods: {

          clearValidate(){
                this.$refs['formData'].validateField('receiptAccountImg');
            },
            
          // 选中银行
          select_bank(data){
              this.formData.bankBatchName = data.accountName;
              this.formData.accountNumber = data.accountNumber;
              this.formData.bankId = data.id;
              this.modal_bank=false;
          },

          // 加载银行信息
            load_bank() {
                this.loading = true;
                let obj = {

                    affiliatedBank:this.search.affiliatedBank,
                    accountNumber:this.search.accountNumber,
                    accountName:this.search.accountName,
                    current: this.current_bank,
                    rowCount: this.pagesize_bank
                }
                this.$http.post('/api/bank/yxBankAccountListNew', obj).then(resp => {
                    this.loading = false;
                    if (resp.status === 200) {
                        let data = resp.data;
                        this.data_bank = data.data;
                        this.pagesize_bank = data.rowCount;
                        this.total_bank= data.total;
                    }
                })
            },

            // 搜索角色
            search_bank() {
                this.current_role = 1;
                this.search.affiliatedBank = this.forms.affiliatedBank;
                this.search.accountNumber = this.forms.accountNumber;
                this.search.accountName = this.forms.accountName;
                this.load_bank();
            },
            change_page(c){
                this.current_bank = c;
                this.load_bank();
            },
            change_page_size(c){
                this.current_bank = 1;
                this.pagesize_bank = c;
                this.load_bank();
            },
            reset() {
              this.forms.affiliatedBank = '';
              this.forms.accountNumber = '';
              this.forms.accountName = '';
            },

          // 选择支行
          clickBankName(){
            this.modal_bank=true;
           
          },

          handleChange (value, selectedData) {
                this.formData.addressName = [];
                selectedData.map(item => {
                    this.formData.addressName.push(item.label)
                })
            },

            // 加载市
            loadData (item, callback) {
                item.loading = true;
                this.$http.get("/api/basicRegion/getSubRegions?regionId=" + item.value).then((resp)=>{
                if(resp.data.success){
                    let data = resp.data.data;
                    item.children = [];
                    data.map(elem => {
                        item.children.push({
                            value: elem.regionId,
                            label: elem.fullName,
                        })
                    })
                    item.loading = false;
                    callback();
                    };
                })
            },
            // 显示格式化
            format(label){
                return label.join(' - ')
            },

       

          // 省
            getProvinces(){
                this.$http.post("/api/basicRegion/getProvinces").then((resp)=>{
                    if(resp.data.success){
                         let data = resp.data.data;
                         this.data4 = [];
                         data.map(item => {
                            this.data4.push({
                                value: item.regionId,
                                label: item.fullName,
                                children: [],
                                level: item.level,
                                loading: false
                            })
                         })
                    };
                  })
           },
           // 收款类型
           getReceiptTypeList(){
                this.$http.post("/bank/account/getBankAccountReceivetypeList").then((resp)=>{
                    if(resp.data.success){
                         this.receiptTypeList = resp.data.data;
                        
                    };
                  })
           },

          
            handleSubmit(){
                return new Promise((resolve, reject)=>{
                    this.$refs['formData'].validate((valid) => {
                        if (valid) {
                            resolve();
                        } else{
                            reject();
                        }
                    })
                })
            }
           
        },
         mounted(){

          // 父组件有值
            if(!$.isEmptyObject(this.value)){
                
            }

          this.getProvinces();
          this.getReceiptTypeList();
           this.load_bank();

        }

    } 
</script>
<style type="text/css" lang="less" scoped>
   
  .color-click{
    cursor: pointer;
  }

 
    .vertical-center-modal{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  .sub-title{
    color: #666666
  }

    .xian {
      height: 1px;
      margin-top: 40px;
      text-align: center;
      border-top: 1px solid #e2e2e2;
    }
    .txt{
      position: relative;
      top:-22px;
      background: #fff;
      font-size:16px;
      display: inline-block;
    }
  .imgSrc{
    width: 110px;
    height: 110px;
  }
  .padding-tb{
    padding: 5px 0;
  }
  .uploadInfo{
    position: absolute;
    left:238px;
    top:7px;
    line-height: 22px;
  }
  .emptyCard{
        text-align: center;
        width:26%;
        margin:20px;
        display: inline-block;
        height:178px;
        float:left;
    }

</style>



