<!-- 收款信息 -->
<template>
  <div class="cardList" >
    <Card v-for="(item,index) in value" :key="index" class="card"  >
      <div slot="title" >
        <Row>
          <Col span="13" style="line-height:2.3;font-weight:bold">
            <span :title="item.paymentName">{{item.paymentName.length>9? item.paymentName.substring(0,8) + '...' : item.paymentName}}</span>
          </Col>
          <Col span="9" style="cursor:auto">
            <Button style="cursor:auto" shape="circle"  v-if="item.accountType === '0'">企业账户</Button>
            <Button style="cursor:auto"  shape="circle"  v-else>个人账户</Button>
          </Col>
          <Col span="2">
            <Icon v-if="isEdit && item.closeFlag" @click="closeCard(item.id,item.flag, index)" class="" type="md-close" size="20" style="margin-top: 6px;cursor:pointer" />
          </Col>
        </Row>
        
        
        
      </div>
      <div :title="item.openAccountName">{{item.openAccountName.length>30? item.openAccountName.substring(0,30) + '...' : item.openAccountName}}</div>
      <div>{{item.paymentAccount}}</div>
      <!-- <div>{{item.openBankName}}</div> -->

      <div class="stopBtn" v-if="show && !item.closeFlag">
        <i-switch v-model="item.enabledBoolean" size="large" :disabled="show && !isEdit">
            <span slot="open">启用</span>
            <span slot="close">停用</span>
        </i-switch>
      </div>
      <div class="editText">
        
        <span class="color-click" @click="editOrView(item.id, item.flag, 1, index)" v-if="isEdit && item.enabledBoolean">编辑</span>
        <span class="color-click" @click="editOrView(item.id, item.flag, 2, index)" v-else>查看</span>
      </div>
    </Card>

    <!-- 添加按钮 -->
      <Card  v-if="isEdit" class="emptyCard" @click.native="addCard">
         
          <Icon type="md-add" size="50"></Icon>
          <div>添加银行卡</div>
      </Card>


    <!-- 新增或编辑 -->
    <Modal
      v-model="modal"
      width="900px"
      :title="addFlag?'新增收款账号':'编辑收款账号'" @on-cancel="handleFormcancel" :mask-closable="false">
      <Form ref="formData" :model="formData" :rules="formDataValidate" :label-width="130">
      <Row class="padding-tb">
            <Col span="24">
              <FormItem label="自定义收款方名称" prop="customBusinessName">
                <Input v-model.trim="formData.customBusinessName" placeholder="自定义收款方名称" class="input-width" :maxlength="20"></Input>
                <limitLength :value="formData.customBusinessName" :max="20"/>
                <span>此名称仅用于页面提示，不会影响收款,请自行定义</span>
              </FormItem>
        </Col>
      </Row>

      <Row class="padding-tb">
        <Col span="24">
              <FormItem label="账户类型" prop="accountType">
              <!-- :disabled="type === 'changeBusiness' && !formData.closeFlag && !addFlag ? true : false" -->
                <Select v-model="formData.accountType" placeholder="账户类型" class="input-width" >
                  <Option v-for="item in accountTypeList" :value="item.value">{{item.label}}</Option>
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
                <Input v-model.trim="formData.accountCode" placeholder="账号" class="input-width"></Input>
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="电子联行号" prop="accountNumber">
                {{formData.accountNumber}}
              </FormItem>
            </Col>
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
                <Input v-model.trim="formData.payee" placeholder="收款联系人" class="input-width"></Input>
              </FormItem>
              <FormItem label="持卡人联系电话" prop="receivablePhone" v-else>
                <Input v-model.trim="formData.receivablePhone" placeholder="持卡人联系电话" class="input-width"></Input>
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="收款联系电话" prop="payeePhone" v-if="formData.accountType === '0'">
                <Input v-model.trim="formData.payeePhone" placeholder="收款联系电话" class="input-width"></Input>
              </FormItem>
              <FormItem label="持卡人身份证" prop="receivableIdentityCard" v-else>
                <Input v-model.trim="formData.receivableIdentityCard" placeholder="持卡人身份证" class="input-width"></Input>
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
                <Input v-model.trim="formData.payeeEmail" placeholder="收款联系邮箱" class="input-width"></Input>
              </FormItem>
              <FormItem label="持卡人联系邮箱" prop="receivableEmail" v-else>
                <Input v-model.trim="formData.receivableEmail" placeholder="持卡人联系邮箱" class="input-width"></Input>
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
              <FormItem label="收款账号凭证" prop="receiptAccountImg">
                <oneFile :value.sync="formData.receiptAccountImg" @clearValidate="clearValidate" attachmentCode="0000000029" :btns="['show','down','again']" />
              </FormItem>
              <div class="uploadInfo">
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
      <div slot="footer" class="text-center">
        <Button  @click="handleFormcancel">取消</Button>
        <Button type="primary" @click="handleFormSubmit('formData')">提交</Button>
      </div>
    </Modal>

    <!-- 查看-->
    <Modal
      v-model="modal2"
      :width="740"
      title="查看收款账号" @on-cancel="handleFormcancel">
      <Form  :label-width="130">
      <Row >
            <Col span="12">
              <FormItem label="自定义收款方名称" prop="customBusinessName">
                <span>{{formData.customBusinessName}}</span>
              </FormItem>
        </Col>
        <Col span="12">
              <FormItem label="账户类型" prop="accountType">
                <span>{{formData.accountType === '0'? '企业' : '个人'}}</span>
              </FormItem>
        </Col>
      </Row>

      <Divider>详细银行卡信息</Divider>
    

      <Row >
        <Col span="12">
          <Row>
            <FormItem label="开户名称" prop="openAccountName">
              <span>{{formData.openAccountName}}</span>
            </FormItem>
          </Row>
        </Col>
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="详细支行名称" prop="bankBatchName">
                  <span>{{formData.bankBatchName}}</span>
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row >
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="账号" prop="accountCode">
                {{formData.accountCode}}
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="电子联行号" prop="accountNumber">
                {{formData.accountNumber}}
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row >
        <Col span="12">
                  <FormItem label="开户省市" prop="address" >

                  {{formData.addressName[0] + '  ' + formData.addressName[1] }}
                  </FormItem>
              
        </Col>
      </Row>

      <Row >
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="收款联系人" prop="payee" v-if="formData.accountType === '0'">
                {{formData.payee}}
              </FormItem>
              <FormItem label="持卡人联系电话" prop="receivablePhone" v-else>
                {{formData.receivablePhone}}
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="收款联系电话" prop="payeePhone" v-if="formData.accountType === '0'">
                {{formData.payeePhone}}
              </FormItem>
              <FormItem label="持卡人身份证" prop="receivableIdentityCard" v-else>
                {{formData.receivableIdentityCard}}
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col span="12">
          <Row>
            <Col span="24">
              <FormItem label="收款联系邮箱" prop="payeeEmail"  v-if="formData.accountType === '0'">
                {{formData.payeeEmail}}
              </FormItem>
              <FormItem label="持卡人联系邮箱" prop="receivableEmail" v-else>
                {{formData.receivableEmail}}
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col span="24">
          <Row>
            <Col span="24">
              <FormItem label="收款类型" prop="receiptType">
               
                {{returnReceiptType(formData.receiptType)}}
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col span="24">
          <Row>
            <Col span="24">
              <FormItem label="收款账号凭证" prop="receiptAccountImg">
                <oneFile :value.sync="formData.receiptAccountImg" attachmentCode="0000000029" :btns="['show','down']" />
              </FormItem>
            
            </Col>
          </Row>
        </Col>
      </Row>
      </Form>
      <div slot="footer" class="text-center">
      </div>
    </Modal>

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
        name:"",
        props:{
          value:{
            type:Array,
            default:[]
          },
          pid:{
            type:String,
            default:''
          },
          isEdit:{
            type: Boolean,
            default:false
          },
          show:{
            type: Boolean,
            default:false
          },
          type:{
            type:String,
            default:''
          },
          shopId:{
            type:String,
            default:''
          },
          subjectValue:{
            type:Array,
            default:[]
          }
        },
        data() {
            return {
              modal2: false,

              accountTypeList:[
                {
                  label:'企业',
                  value:'0'
                },
                {
                  label:'个人',
                  value:'1'
                }
              ],

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
              loading:false,
              modal_bank:false,
             
              data4:[],
              receiptTypeList:[],
              addFlag:false,
              modal: false,
              modal1: false,
              loading1: false,
              options1: [],
              formData:{
                closeFlag:true,
                accountCode:'',//账号
                address:[],//开户省市ID
                addressName:[],//开户省市名称
                customBusinessName: "", //自定义企业名称
                accountType: "0", //账户类型
                openAccountName: "", //开户名称
                bankBatchName: "",//详细支行名称
                bankId:'',//详细支行ID
                affiliatedBank:'',
                bankEnName:'',
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
                customBusinessName: [{ required: true, type: 'string', message: '请输入自定义收款方名称', trigger: 'blur' }],
                accountType: [{ required: true, message: '账户类型不能为空', trigger: 'blur' }],
                openAccountName: [{ required: true, type: 'string', message: '请输入开户名称', trigger: 'blur' },{ required: true, min:4, message: '不能小于4个字', trigger: 'blur' }],
                bankBatchName: [{ required: true, message: '详细支行名称不能为空', trigger: 'change' }],
                accountNumber: [{ required: false, message: '账号不能为空', trigger: 'blur' }],
                province: [{ required: true, message: '选择省不能为空', trigger: 'change' }],
                city: [{ required: true, message: '选择市不能为空', trigger: 'change' }],
            
                
                receiptType:[{ required: true,type:'array', message: '收款类型不能为空', trigger: 'change' }],
                accountCode:[
                   { required: true, message: '账号不能为空', trigger: 'blur' },
                   { message: '账号只支持数字和特殊字符',pattern: /(^[0-9,\.#%'\+\*\-:;^_`]+$)/, trigger: 'blur'}
                ],
                address:[{ required: true, type:'array', message: '省市不能为空', trigger: 'change' }],
                payee:[{ required: true,  message: '收款联系人不能为空', trigger: 'blur' },],
                payeePhone:[{ required: true,  message: '收款联系电话不能为空', trigger: 'blur' },{ message: '电话格式不正确',pattern: /^[0-9]{11}$/, trigger: 'blur'}],
                payeeEmail:[{ required: true, message: '收款联系邮箱不能为空', trigger: 'blur' },{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
                receiptAccountImg: [{
                    type: "object", required: true,
                    fields: {
                      attachmentName: {required: true,trigger: 'change',message: '请选择上传文件！'},
                    }
                }],

                receivablePhone:[{ required: true,  message: '持卡人联系电话不能为空', trigger: 'blur' },{ message: '电话格式不正确',pattern: /^[0-9]{11}$/, trigger: 'blur'}],
                receivableIdentityCard:[{ required: true,  message: '持卡人身份证不能为空', trigger: 'blur' },{pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号不合法', trigger: 'blur' }],
                receivableEmail:[{ required: true,  message: '持卡人邮箱不能为空', trigger: 'blur' },{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
              },
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
              id:'',
              flag:'',
              currentIndex:0,

            }
        },
        watch:{
          ['formData.accountType'](val){
            if(val === '0'){
              this.formDataValidate.openAccountName = [
                { required: true, type: 'string', message: '请输入开户名称', trigger: 'blur' },
                { required: true, min:4, message: '不能小于4个字', trigger: 'blur' }
              ]
            }else{
              this.formDataValidate.openAccountName = [
                { required: true, type: 'string', message: '请输入开户名称', trigger: 'blur' },
              ]
            }
          },
          value(newVal){
            this.$emit('update:value',newVal)
          },
          shopId(nv){
            if(nv && this.pid){
              this.initShop();

            }
          },
        },
        methods: {
          clearValidate(){
                this.$refs['formData'].validateField('receiptAccountImg');
            },
          returnReceiptType(arr){
            let result = [];
            arr.map(item => {

              let a = this.receiptTypeList.filter(elem=> {
                return elem.id === item
              })[0];

              if(a){
                result.push(a.accountTypeName)
              }
              
            })
            return result.join(',')
          },

          // 删除card
          closeCard(id,flag,index){

            this.$Modal.confirm({
                  title: '提示',
                  content: '<p>确认删除？</p>',
                  onOk: () => {

                    // 本地删除
                    if(this.type === 'changeBusiness'){

                      this.value.splice(index,1);
                      this.$Message.success('删除成功！');
                      return;
                    }


                      let json = {
                        id: id,
                        flag: flag
                      }
                      this.$http.post('/bank/account/delBankAccount', json).then(resp => {
                           if (resp.data.success) {
                                this.$Message.success('删除成功！')
                                this.$emit('reload');
                              }else{
                                this.$Message.success(resp.data.errorMessage)
                              }
                        })
                  },
               
              });
            
          },

          // 选中银行
          select_bank(data){
              this.formData.bankBatchName = data.accountName;
              this.formData.accountNumber = data.accountNumber;
              this.formData.affiliatedBank = data.affiliatedBank;
              this.formData.bankEnName = data.bankEnName;
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
                    if (resp.data.success) {
                        let data = resp.data.data;
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
          addCard(){
            this.modal = true;
            this.addFlag = true;

            this.initShop();
          },
          format(label){
                return label.join(' - ')
            },

            // 编辑
          editOrView (id,flag,num,index){


            if(num === 1){
              this.modal = true;
            }else{
              this.modal2 = true;
            }
            
            this.addFlag = false;

            // 本地返显
            if(this.type === 'changeBusiness'){

              this.currentIndex = index;

              let data = this.value[index];
              let form = this.formData;


              if(data.accountType === '0'){
                form.payee = data.receivableContacter;
                form.payeePhone = data.receivablePhone;
                form.payeeEmail = data.receivableEmail;
              }else{
                form.receivablePhone = data.receivablePhone;
                form.receivableIdentityCard = data.receivableIdentityCard;
                form.receivableEmail = data.receivableEmail;
              }
              form.enabledBoolean = data.enabledBoolean;
              form.customBusinessName = data.paymentName;
              form.accountType = data.accountType;
              form.openAccountName = data.openAccountName;
              form.bankBatchName = data.openBankName;
              form.affiliatedBank = data.ownedBankName;
              form.bankEnName = data.ownedBankBrief;
              form.accountCode = data.paymentAccount;
              form.accountNumber = data.ownedBankElectronicLine;
              form.bankId = data.ownedBankId;
              form.address = [Number(data.openBankAccountProId),Number(data.openBankAccountCityId)];
              form.addressName = [data.openBankAccountPro,data.openBankAccountCity];
              form.receiptType = data.paymentBusiType? data.paymentBusiType.split(',') : [];
              form.receiptAccountImg = data.attachmentList[0] || {};
              form.closeFlag = data.closeFlag;
              form.id = data.id;
              form.bankAccountId = data.bankAccountId;

              // 如果是新增的数据点击编辑
              if(data.closeFlag){
                this.initShop();
              // 历史数据编辑
              }else{
                this.initShop();
                // this.accountTypeList = [
                //   {
                //     label:'企业',
                //     value:'0'
                //   },
                //   {
                //     label:'个人',
                //     value:'1'
                //   }
                // ]
              }

              return;

            }
            

            this.id=id;
            this.flag=flag;
            let json = {
              id: id,
              flag: flag
            }
            this.$http.post('/bank/account/getChannelBankAccountById', json).then(resp => {
                 if (resp.data.success) {

                   

                    var data = resp.data.data;
                    var form = this.formData;


                    if(data.accountType === '0'){
                      form.payee = data.receivableContacter;
                      form.payeePhone = data.receivablePhone;
                      form.payeeEmail = data.receivableEmail;
                    }else{
                      form.receivablePhone = data.receivablePhone;
                      form.receivableIdentityCard = data.receivableIdentityCard;
                      form.receivableEmail = data.receivableEmail;
                    }
                    form.customBusinessName = data.paymentName;
                    form.accountType = data.accountType;
                    form.openAccountName = data.openAccountName;
                    form.bankBatchName = data.openBankName;
                    form.accountCode = data.paymentAccount;
                    form.accountNumber = data.ownedBankElectronicLine;
                    form.bankId = data.ownedBankId;
                    form.affiliatedBank = data.ownedBankName;
                    form.bankEnName = data.ownedBankBrief;
                    form.address = [Number(data.openBankAccountProId),Number(data.openBankAccountCityId)];
                    form.addressName = [data.openBankAccountPro,data.openBankAccountCity];
                  
                    form.receiptType = data.paymentBusiType? data.paymentBusiType.split(',') : [];
                    form.receiptAccountImg = data.attachmentList[0] || {};
                    form.closeFlag = true;


                    }else{
                      this.$Message.success(resp.data.errorMessage)
                    }
              })


          },
       
          // 提交
          handleFormSubmit(name) {
            this.$refs[name].validate((valid) => {
              if (valid) {
                this.saveForm();
              } else {
                this.$Message.error('表单验证失败!');
              }
            })
          },
          // 提交方法
          saveForm(){

            let url,json;
            // 新增
            if(this.addFlag){


              url = 'createBankAccount';

              json = {
                "channelId":this.pid,
                "paymentName":this.formData.customBusinessName,
                "accountType":this.formData.accountType,
                "openAccountName":this.formData.openAccountName,
                "openBankName":this.formData.bankBatchName,
                "ownedBankId":this.formData.bankId,
                "ownedBankName":this.formData.affiliatedBank,
                "ownedBankBrief":this.formData.bankEnName,
                "paymentAccount":this.formData.accountCode,
                "ownedBankElectronicLine":this.formData.accountNumber,
                "openBankAccountProId":this.formData.address[0],
                "openBankAccountPro":this.formData.addressName[0],
                "openBankAccountCityId":this.formData.address[1],
                "openBankAccountCity":this.formData.addressName[1],
                "paymentBusiType":this.formData.receiptType.join(','),
                "attachmentList":[this.formData.receiptAccountImg],
                "closeFlag" : true,
              }

              if(this.formData.accountType === '0'){

                json.receivableContacter = this.formData.payee;
                json.receivablePhone = this.formData.payeePhone;
                json.receivableEmail = this.formData.payeeEmail;
              }else{
                json.receivablePhone = this.formData.receivablePhone;
                json.receivableIdentityCard = this.formData.receivableIdentityCard;
                json.receivableEmail = this.formData.receivableEmail;
              }

              // 本地新增
              if(this.type === 'changeBusiness'){

                // let newarr =  this.value.filter(item => {
                //   return item.paymentAccount === this.formData.accountCode
                // })

                // if(newarr.length > 0){
                //   this.$Message.error('此账号已存在！');
                // }else{
                //   json.enabledBoolean = true;
                //   this.value.push(json);
                //   this.$Message.success('添加成功！');
                //   this.handleFormcancel();
                // }

                json.enabledBoolean = true;
                this.value.push(json);
                this.$Message.success('添加成功！');
                this.handleFormcancel();

                return;
              }

              // 编辑
            }else{
              url = "updateBankAccount";
              json = {

                "id": this.id,
                "flag":this.flag,

                "channelId":this.pid,
                "paymentName":this.formData.customBusinessName,
                "accountType":this.formData.accountType,
                "openAccountName":this.formData.openAccountName,
                "openBankName":this.formData.bankBatchName,
                "ownedBankId":this.formData.bankId,
                "ownedBankName":this.formData.affiliatedBank,
                "ownedBankBrief":this.formData.bankEnName,
                "paymentAccount":this.formData.accountCode,
                "ownedBankElectronicLine":this.formData.accountNumber,
                "openBankAccountProId":this.formData.address[0],
                "openBankAccountPro":this.formData.addressName[0],
                "openBankAccountCityId":this.formData.address[1],
                "openBankAccountCity":this.formData.addressName[1],
                "paymentBusiType":this.formData.receiptType.join(','),
                "attachmentList":[this.formData.receiptAccountImg],
                "closeFlag": this.formData.closeFlag,
              }

              if(this.formData.accountType === '0'){

                json.receivableContacter = this.formData.payee;
                json.receivablePhone = this.formData.payeePhone;
                json.receivableEmail = this.formData.payeeEmail;
              }else{
                json.receivablePhone = this.formData.receivablePhone;
                json.receivableIdentityCard = this.formData.receivableIdentityCard;
                json.receivableEmail = this.formData.receivableEmail;
              }

              // 本地修改
              if(this.type === 'changeBusiness'){

                  delete json.id;
                  delete json.flag;

                  json.enabledBoolean = true;
                  json.id = this.formData.id || '';
                  json.bankAccountId = this.formData.bankAccountId || '';
                  
                  this.$set(this.value, this.currentIndex, json)

                  this.$Message.success('修改成功！');
                  this.handleFormcancel();

                  return;
              }
            }
            
              this.$http.post("/bank/account/"+url,json).then((resp)=>{
                    if(resp.data.success){
                        this.$Message.success('提交成功！');
                        this.handleFormcancel();
                          this.$emit('reload');
                    }
                  })

          },

          // 获取店面信息  编辑
          initShop(){
                
              this.$http.get('/tbChannelShopInfo/selectShopInfoByIdAndChannelId?id='+ this.shopId +'&channelId=' + this.pid).then(resp => {
                  if (resp.data.success) {
                      let data = resp.data.data;
                      let tag = data.businessConfigModelNames[0].busiConfigId;

                      //如果为销售直营 且二级科目不是直营综合店
                     if(tag === '0000000065570e9b01655b1eb9eb001e' && this.subjectValue[1] !== '0497000200005'){
                        this.accountTypeList = [
                          {
                            label:'企业',
                            value:'0'
                          },
                        ]

                      }else{
                        this.accountTypeList = [
                          {
                            label:'企业',
                            value:'0'
                          },
                          {
                            label:'个人',
                            value:'1'
                          }
                        ]
                      }

                  }
              })
          },
          handleFormcancel(){
            this.$refs['formData'].resetFields();
            this.modal = false;
          }
        },
        mounted(){
          this.getProvinces();
          this.getReceiptTypeList();
           this.load_bank();

           if(this.shopId && this.pid){
              this.initShop();

            }
           
        }
    }
</script>

<style lang="less">
    .card{
        width:26%;
        display: inline-block;
        float:left;
        margin:20px;
        text-align: left;
        height:178px;
        box-shadow: 0 1px 9px 3px rgba(0,0,0,0.05);

        .ivu-card-head{
            background: #ededed;
            padding: 4px 15px
        }
        .ivu-icon-close{
            float:right;
            margin-top:10px
        }
        .ivu-card-body{
            padding:10px 15px 15px 15px;
            div{
                line-height:2
            }
        }
        .editText{
          position: absolute;
          right: 20px;
          bottom: 15px;
        }
        .stopBtn{
          position: absolute;
          bottom: 15px;
        }
    }
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
    left:240px;
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
        padding-top: 30px;
        color:#e7e7e7;
        font-size: 16px;
        box-shadow: 0 1px 9px 3px rgba(0,0,0,0.05);
    }
</style>



