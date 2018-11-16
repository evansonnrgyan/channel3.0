<!-- 企业信息 -->
<template>
	<Form ref="formValidate" :model="formValidate" :rules="ruleValidate"  :label-width="130">
                <Row>
                    <Col span="12">
                        <FormItem label="主体类型">
                              {{formValidate.mainType === "0"? '企业' : '个人'}}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="企业名称">
                              {{formValidate.mainName}}
                        </FormItem>
                    </Col>
                    
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="统一社会信用代码">
                              {{formValidate.creditCode}}
                          </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="注册地址">
                              {{formValidate.registeredAddress}}
                        </FormItem>
                    </Col>
                    
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="法定代表人">
                              {{formValidate.legalPersonName}}
                          </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="注册资本">
                              {{formValidate.registeredCapital? formValidate.registeredCapital + formValidate.registeredCapitalUnit : ''}}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="营业期限">
                              {{$formatDate(formValidate.busiStartTime)}} 
                              至
                              {{$formatDate(formValidate.busiEndTime)}}
                          </FormItem>
                    </Col>
                </Row>
                <Row v-if="formValidate.businessAttachmentObj">
                    <Col span="12">
                        <FormItem label="营业执照电子版" prop="businessAttachmentObj">
                             <oneFile :value="formValidate.businessAttachmentObj" attachmentCode="0000000004" :btns="['show','down','again']"></oneFile>
                             <Button v-if="update"  :disabled="disabled"  type="primary"  @click="updateData">更新信息</Button>
                        </FormItem>
                    </Col>
                </Row>
                <Row v-if="update">
                    <Col span="12">
                        <FormItem label="" prop="">
                             <Button :disabled="disabled"  type="primary"  @click="updateData">更新信息</Button>
                        </FormItem>
                    </Col>
                </Row>
          </Form>
</template>
<script>
    export default {
        props: {
          value:{
            type:Object,
            default:{}
          },
          flag:{
              type:Boolean ,
              default:false
          },
          edit:{
              type:Boolean ,
              default:false
          },
          update:{
          	type:Boolean,
             default:false
          }
        },
        data() {
            return {
            	disabled:false,
            	formValidate: {
            		id:'',
	                mainTyp:'0',
	                mainName:'',
	                creditCode:'',
	                registeredAddress:'',
	                legalPersonName:'',
	                registeredCapital:'',
	                registeredCapitalUnit:'',
	                busiStartTime:'',
	                busiEndTime:'',
	                businessAttachmentObj:{}

              },
              ruleValidate: {
                    businessAttachmentObj: [{
                        type: "object", required: true,
                        fields: {
                          attachmentName: {required: true, message: '请选择上传文件！'},
                        }
                    }],
              }
            }
        },
        watch:{
          formValidate:{
            handler: function (newVal) {
                    this.$emit('update:value', newVal);
                  },
            deep: true
          },     
          value:{
            handler: function (newVal) {
                    this.formValidate = newVal
                  },
            deep: true
          }
        },
        methods: {

        	updateData(){

        		let json = {
        			mainType: this.formValidate.mainTyp,
        			mainName: this.formValidate.mainName,
        			id: this.formValidate.id
        		}  
        		this.$http.post("/tbChannelMainInfo/updateMainInfoCompany",json).then((resp)=>{
                    if(resp.data.success){
                      this.disabled = true;
                    	 this.$Message.success('更新成功');
                          this.formValidate = resp.data.data;
                         
                    };
                  })
        	},
           
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
        }

    } 
</script>

