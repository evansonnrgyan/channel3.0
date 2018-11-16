<template>
	 <Form ref="formValidate" :model="formValidate" :label-width="130">
            <Row>
                <Col span="12">
                    <FormItem label="主体类型"  prop="name">
                          <span>{{formValidate.mainType === '1'? '个人': '企业'}}</span>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="个人姓名"  prop="name">
                          <span >{{formValidate.mainName}}</span>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="身份证号"  prop="code">
                         <span>{{formValidate.creditCode}}</span>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="性别"  prop="code">
                         <span >{{formValidate.sexual === 'M'? '男': '女'}}</span>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="最后更新时间"  prop="code">
                         <span>{{formValidate.updateTime}}</span>
                    </FormItem>
                </Col>
            </Row>
            <Row v-if="formValidate.idCardAttachmentObj">
                <Col span="12">
                    <FormItem label="身份证电子版"  prop="img">
                          <oneFile :value="formValidate.idCardAttachmentObj"  :btns="['show','down']"></oneFile>
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
    	},
        data() {
            return {
            	formValidate:{
                    mainType:'',
                    mainName:'',
                    creditCode:'',
                    sexual:'',
                    updateTime:'',
                    idCardAttachmentObj: {}
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
          },
        },
        methods: {
          
        },
        mounted(){

            // 父组件有值
            if(!$.isEmptyObject(this.value)){
                
            }
        }
  
    } 
</script>