<!-- 上线资料 -->
<template>
   
    <Form ref="formValidate" :model="formValidate" :label-width="130">
            <Row v-for="(item,index) in formValidate.list" :key="index">
                <Col span="12">
                    <FormItem :label="edit? item.dictAttachmentDTO.attachemntName : item.dicAttachmentName" :prop="'list.'+index+'.img'"  :rules="{required: true, type: 'object',
                        fields: {
                          attachmentName: {required: true,trigger: 'change',message: '请选择上传文件！'},
                        } 
                    }">
                        <oneFile :value.sync="item.img" :attachmentCode="edit? item.attachemntCode : item.attachmentCode" :btns="edit ? ['show','down','again'] : ['show','down']" @clearValidate="clearValidate(index)"></oneFile>
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
                    list:[]
               }
            }
        },
        watch:{
            formValidate: {
              handler: function (newVal) {
                  this.$emit('update:value', newVal);
                  console.log(newVal)

                },
              deep: true
            },
          
        },
        methods: {
            clearValidate(index){
                this.$refs['formValidate'].validateField('list.'+index+'.img');
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
            this.$emit('update:value', this.formValidate);

        
        }
    } 
</script>
<style scoped lang="less">

</style>



