<!--保证金打款凭证-->
<template>

      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
            <Row>
                <Col span="24">
                    <FormItem label="是否追加保证金" prop="isAdd">
                        <RadioGroup v-model="formValidate.isAdd" v-if="edit">
                            <Radio label="1">是</Radio>
                            <Radio label="0">否</Radio>
                        </RadioGroup>
                        <span v-else>{{formValidate.isAdd === '1'? '是' : '否'}}</span>
                    </FormItem>
                </Col>
            </Row>
            <Row v-if="formValidate.isAdd === '1'">
                <Col span="24">
                    <FormItem label="保证金金额" prop="money">
                        <Input v-if="edit" v-model="formValidate.money" class="input-width" placeholder="请输入金额">
                          <span slot="append"> 元 </span>
                        </Input>
                        
                        <span v-else>{{formValidate.money + '元'}}</span>
                    </FormItem>
                </Col>
            </Row>
            <Row v-if="formValidate.isAdd === '1'">
                <Col span="24">
                    <FormItem label="保证金缴纳凭证" prop="img">
                        <oneFile :value.sync="formValidate.img" attachmentCode="0000000031" :btns="edit? ['show','down','again'] : ['show','down']" @clearValidate="clearValidate"></oneFile>
                    </FormItem>
                </Col>
            </Row>
           
        </Form>

  
</template>

<script>
  export default {
    name: "",
    props:{
      value:{
          type: Object,
          default: {},
      },
      flag:{
          type:Boolean ,
          default:false
      },
      edit:{
          type:Boolean ,
          default:false
      },
    },
    data () {
      return  {
        formValidate:{
          isAdd:'1',
          money:'',
          img:{}
        },
        ruleValidate:{
                isAdd: [
                    { required: true, message: '请选择是否追加保证金', trigger: 'blur' }
                ],
               
                money: [
                    { required: true, message: '请输入金额', trigger: 'blur' },
                    {
                      pattern:/^\d{1,8}(?:\.\d{1,2})?$/,
                      message:'请输入整数或最多2位小数',
                      trigger:'blur'
                    }
                ],
               
                img:{
                  type: "object", required: true,
                  fields: {
                    serverFileName: {type: "string", required: true,  message: "请上传附件"}
                  }
                }
            },
      }
    },
    watch:{
      formValidate: {
              handler: function (newVal) {
                  this.$emit('update:value', newVal);

                },
              deep: true
          },
    },
    methods:{
          clearValidate(){
                this.$refs['formValidate'].validateField('img');
            },
       // 验证
            handleSubmit(){
                return new Promise((resolve, reject)=>{
                    this.$refs['formValidate'].validate((valid) => {
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

            this.$emit('update:value', this.formValidate);

        }
  }
</script>

<style lang="less" scoped>
  .font12{
    font-szie: 12px;
    color: #666666;
  }
  .imgView{
    width:100px;
    height:110px;
  }
</style>
