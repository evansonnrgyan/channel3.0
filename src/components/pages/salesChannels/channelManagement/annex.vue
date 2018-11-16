<!-- 附件资料 -->

<template>
  <div class="" style="margin:-15px -30px">

  <!-- 上线资料  -->
  <commonTitle title="上线资料">
      <a style="float:right;position: relative;z-index: 1;" @click="showLog">附件上传记录</a>
      <filesForm ref="filesForm_ref" :value.sync="filesForm_model" :flag.sync="filesForm_flag" :edit="false"></filesForm>
  </commonTitle>

  <!-- 其他资料 -->
  <commonTitle title="其他资料（最多10个）" v-if="otherFile_flag">
      <otherAttachments :value.sync="otherAttachments_model" attachmentCode="0000000034" :edit="false"></otherAttachments>
  </commonTitle>

  <!-- 上传记录 -->
  <Modal
      v-model="modal"
      title="附件上传记录"
      width="700"
      >
      <Table :columns="columns" :data="data"></Table>
      <Page style="margin-top:5px" :total="total" :current="current" :page-size="rowCount" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator></Page>
      <div slot="footer">
     
      </div>
    </Modal>

    <Modal title="查看图片" v-model="visible">
      <img :src="imgSrc" style="width: 100%">
      <div slot="footer"></div>
    </Modal>

  </div>
</template>

<script>
  export default {
    name: "",
    props:["params"],
    data(){
      return {
          modal:false,
          visible:false,
          imgSrc:'',
        // 上线资料
          filesForm_model:{
              list:[]
          },
          filesForm_flag:false,

          // 其他附件
          otherAttachments_model:{
              list:[]
          },
          otherFile_flag:false,

          submitObj:{},
          subjectValue:[],

          columns:[
          {
            title:"时间",
            key:"attachmentUploadTime",
          },
          {
            title:"操作人",
            key:"attachmentUploader"
          },
          {
            title:"附件类型",
            key:"dicAttachmentName"
          },
          {
            title:"文件",
            render: (h, params) => {
              return h('a',{
                      on:{
                          click: () => {
                            this.showImg(params.row)
                          }
                      }
                  },params.row.attachmentName) 
            }
          },
          
        ],
        data:[],

        current:1,
        rowCount:10,
        total:0,
      }
    },
    methods:{

      // 查看图片
      showImg(img){
          this.imgSrc = this.$viewURL_PATH + img.serverFileName;
          // this.visible = true;
          this.$showImg(this.imgSrc);
      },
      // 查看附件上传记录
      showLog(){
        let json = {
            channelId: this.params,
            current: this.current,
            rowCount: this.rowCount
        }
        this.$http.post('/channelDatumController/queryDatumLogByChannelId', json).then(resp => {
            if (resp.data.success) {
                
                let data = resp.data.data;
                this.data = data.data;
                this.total = data.total;
                this.rowCount = data.rowCount;
                this.modal = true;
            }
        })
      },
      change_page(c) {
          this.current = c;
          this.$nextTick(()=>{
            this.showLog();
          })
      },
      change_page_size(p) {
          this.current = 1;
          this.rowCount = p;
          this.$nextTick(()=>{
            this.showLog();
          })
      },
      // 返显第四步
            returnFour(){
                let json = {
                    channelId: this.params
                }
                this.$http.post('/channelDatumController/queryDatumByChannelId', json).then(resp => {
                    if (resp.data.success) {
                        let data = resp.data.data;

                        let arr1 = data.filter(item => {
                            return item.attachmentCode !== '0000000034'
                        })

                        this.filesForm_model.list = arr1.map(item => {
                            item.img = item
                            return item;
                        })

                        let arr = data.filter(item => {
                            return item.attachmentCode === '0000000034'
                        })
                        if(arr.length>0){
                            this.otherFile_flag = true
                        }else{
                            this.otherFile_flag = false
                        }

                        this.otherAttachments_model.list = arr;

                    }
                })
            },
    },
    mounted(){
      this.returnFour();
    }
  }
</script>

<style lang="less" scoped>

</style>
