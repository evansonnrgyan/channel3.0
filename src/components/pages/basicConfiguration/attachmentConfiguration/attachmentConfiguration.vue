<!-- 附件配置管理 -->
<template>
    <div class="attachment-configuration">
        <Table :columns="columns" :data="data"></Table>

        <Modal
            v-model="att_modal"
            width="800px"
            title="修改附件配置">
            <CheckboxGroup v-model="checkboxValue" @on-change="changeLabelFn">
                <Checkbox style="width:180px; padding:5px" v-for="item in checkboxList" :key="item.id" :label="item.attachemntCode">{{item.attachemntName}}</Checkbox>
            </CheckboxGroup>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" @click="sure">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "attachmentConfiguration",
        data(){
            return {
                att_modal: false,
                // 被修改条目信息
                currentInfo: {},

                changeCalue: [],
                // 附件列表
                checkboxList: [],
                // 被选中的附件集合
                checkboxValue: [],
                columns: [
                    {
                        title: "渠道科目一级",
                        key: "fistSubject",
                        width:300,
                        render: (h, params) => {
                            return h("div", [
                                h("span",  params.row.fistSubject.name)
                            ]);
                        }
                    },
                    {
                        title: "渠道科目二级",
                        key: "secondSubject",
                        width:300,
                        render: (h, params) => {
                            return h("div", [
                                h("span",  params.row.secondSubject.name)
                            ]);
                        }
                    },
                    {
                        title: "必选附件名称",
                        key: "attachment",
                        render: (h, params) => {
                            return h("div", [
                                h("span",  this.attachmentInit(params.row.attachment))
                            ]);
                        }
                    },
                    {
                        title: "操作",
                        key: "option",
                        width:100,
                        render: (h, params) => {
                            return h("div", [
                                h("span", {
                                    props: {
                                        type: "text",
                                        size: "small"
                                    },
                                    style:{
                                        color: "#57a3f3",
                                        cursor: "pointer"
                                    },
                                    on: {
                                        click: () => {
                                            this.modify(params.row)
                                        }
                                    }
                                }, "修改")
                            ]);
                        }
                    }
                ],
                data: []
            }
        },
       methods:{
           loadList(){
              this.$http.post("/businessAttachment/initChannelSubjectList").then(resp=>{
                  if(resp.data.success){
                      this.data = resp.data.data;
                  }
              })
           },
           attachmentInit(data){
              let list = data.map(item=>item.dictAttachmentDTO.attachemntName).join(', ');
               return list;
           },
           modify(data){
               this.currentInfo = data;
               this.$http.post("/businessAttachment/listDictAttachment").then(resp=>{

                   if(resp.data.success){
                        this.checkboxList = resp.data.data;

                        console.log(data,'入参');
                        let params = "firstSubject="+data.fistSubject.value+"&secondSubject=" + data.secondSubject.value;

                        this.$http.get('/businessAttachment/getBusinessAttachmentByChannelSubject?'+params).then(resp=>{
                            if(resp.data.success){
                                this.checkboxValue = resp.data.data.map(item=>item.attachemntCode);
                                this.att_modal = true;
                            }
                        })
                   }
               });
           },
           changeLabelFn(data){
                this.checkboxValue = data;
                console.log(this.checkboxValue, '被选中的选项');
           },
            sure(){
                let params = {
                    "firstSubject": this.currentInfo.fistSubject.value,
                    "secondSubject": this.currentInfo.secondSubject.value,
                    "attachemntCodeList": this.checkboxValue,
                }

                this.$http.post('/businessAttachment/updateBusinessAttachmentByChannelSubject', params).then(resp=>{
                    if(resp.data.success){
                        this.$Message.success("修改成功");
                        this.checkboxValue = [];
                        this.currentInfo = {};
                        this.att_modal = false;
                        this.loadList();
                    }else{
                        this.$Message.error( resp.data.errorMessage || '请求错误');
                    }
                })
                this.att_modal = false;
            },
           cancel(){
               this.checkboxValue = [];
               this.currentInfo = {};
               this.att_modal = false;
           }
       },
        mounted(){
            this.loadList();
        }
    }
</script>

<style>
    .attachment-configuration{
        padding:20px;
    }
</style>