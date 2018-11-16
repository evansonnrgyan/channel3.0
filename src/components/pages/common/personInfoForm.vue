<template>
	 <Form ref="formValidate" :model="formValidate" :label-width="130" :rules="ruleValidate">
            <Row>
                <Col span="12">
                    <FormItem label="姓名"  prop="name">
                        <div v-if="edit">
                            <Input  v-model.trim="formValidate.name" placeholder="请输入姓名" class="input-width" :maxlength="20"></Input>
                            <limitLength :value="formValidate.name" :max="20"/>
                        </div>
                          
                          <span v-else>{{formValidate.name}}</span>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="身份证号"  prop="code">
                        <div v-if="edit">
                            <Input v-model.trim="formValidate.code" placeholder="请输入身份证号" class="input-width" :maxlength="18"></Input>
                            <limitLength :value="formValidate.code" :max="18"/>
                        </div>
                         <span v-else>{{formValidate.code}}</span>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="身份证"  prop="img">
                          <oneFile :value.sync="formValidate.img" attachmentCode="0000000015" :btns="edit ? ['show','down','again'] : ['show','down']" @clearValidate="clearValidate"></oneFile>
                      </FormItem>
                </Col>
            </Row>

      </Form>
</template>
<script>
    export default {
    	props: {
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
        data() {
            return {
            	formValidate:{
                    name: '',
                    code: '',
                    img: {},
                },
            	ruleValidate:{
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入身份证号', trigger: 'blur' },
                        { pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号不合法', trigger: 'blur' }
                    ],
                    img: [{
                        type: "object", required: true,
                        fields: {
                          attachmentName: {required: true, message: '请选择上传文件'},
                        }
                    }],
                   
              	},
            }
        },
        watch:{
            formValidate:{
            handler: function (newVal) {
                    this.$emit('update:value', newVal);
                  },
            deep: true
          },
        },
        methods: {
            clearValidate(){
                this.$refs['formValidate'].validateField('img');
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
            this.$emit('update:value', this.formValidate);
        }
      
    } 
</script>