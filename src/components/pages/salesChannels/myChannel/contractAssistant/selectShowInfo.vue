<template>
    <div class="select-show-info">
        <Row>
            <Col>{{title}}</Col>
        </Row>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="144">
            <Row>
                <Col span="24">
                    <FormItem label="账户名" prop="accountValue">
                        <Select v-model="formValidate.accountValue" style="width:200px" @on-change="changeBankInfo">
                            <Option v-for="item in accountList" :value="item.id" :key="item.id">{{ item.openAccountName }}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <Col span="24">
                    <FormItem label="开户行名称" prop="bankName">
                        {{formValidate.bankName}}
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <Col span="21">
                    <FormItem label="账号" prop="bankName">
                        {{formValidate.accountName}}
                    </FormItem>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
    export default {
        name: "selectIShownfo",
        props: ["title","servicefee",'getFormChannelCode'],
        data(){
            return {
                accountList: [],
                formValidate:{
                    accountValue: "",
                    bankName: "显示选择的收款账号开户行名",
                    accountName: "显示选择的收款账号开户账号",
                    ownerName:'',
                },
                ruleValidate:{
                    accountValue: [{ required: true, message: '请选择装户名', trigger: 'change' }],
                    bankName: [{ required: true}],
                    accountName: [{ required: true}]
                }
            }
        },
        methods:{
          getAccountList(){
            let val = this.getFormChannelCode.channelId;
            this.$http.post('/bank/account/getBankAccountList',{"channelId":val}).then(res => {
              let _data = res.data.data;
              this.accountList = _data;

            });
          },
          changeBankInfo(val){
            this.accountList.forEach((item)=>{
              if(item.id==val) {
                this.formValidate.bankName = item.openBankName;
                this.formValidate.accountName = item.paymentAccount;
                this.formValidate.ownerName = item.openAccountName;
              }
            })
          },
          handleSubmit(){
            return new Promise((resolve,reject)=>{
              this.$refs['formValidate'].validate((valid)=>{
                if(valid){
                  resolve()
                }else {
                  reject()
                }
              })
            })
          },
        },
        watch:{
          formValidate:{
            handler:function(newVal){
              this.$emit('update:servicefee',newVal);
            },
            deep:true,
          }
        },
        mounted(){
          this.getAccountList();
          this.$emit('update:servicefee',this.formValidate);
        }
    }
</script>
