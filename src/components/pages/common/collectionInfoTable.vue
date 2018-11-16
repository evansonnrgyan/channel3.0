<!-- 收款信息——表格 -->
<template>
  <div>

    <Table :columns="columns" :data="data_table" :loading="loading"></Table>

    <Modal title="查看图片" v-model="visible">
      <img :src="imgSrc" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: "contactInfo",
    props: {
        pid:{
            type:String,
            default:''
        },
        workFlowId:{
            type:String,
            default:''
        },
        type:{
            type:String,
            default:''
        },
    },
    data() {
      return {
        visible:false,
        imgSrc:'',
         url: '/bank/account/getBankAccountAppList',

         loading:false,
        data_table:[],


         columns:[
          {
            title:"自定义收款方名称",
            key:"paymentName",
            width:160,
            fixed:'left',
            tooltip:true,
            //ellipsis: true,
            render: (h, params) => {
                return h('div',[
                        h('span',params.row.paymentName),
                        h('div',{
                            style:{
                                color:'red'
                            }
                        }, params.row.oldValue? this.returnOld(params.row.oldValue.paymentName) : '')
                ])                    
            }
          },
          {
            title:"账号类型",
            key:"paymentName",
            width:90,
            render: (h, params) => {
                return h('div',[
                        h('span',params.row.accountType === '0'? '企业' : '个人'),
                        // h('div',{
                        //     style:{
                        //         color:'red'
                        //     }
                        // }, params.row.accountType && this.type === 'changeBusiness'? params.row.accountType === '0'? '（原：企业）' : '（原：个人）' : '')
                ])                    
            }
          },
          {
            title:"开户名称",
            key:"openAccountName",
            width:200,
            tooltip:true,
            render: (h, params) => {
                return h('div',[
                        h('span',params.row.openAccountName),
                        h('div',{
                            style:{
                                color:'red'
                            }
                        }, params.row.oldValue? this.returnOld(params.row.oldValue.openAccountName) : '')
                ])                    
            }
          },
          {
            title:"开户账号",
            key:"paymentAccount",
            width:200,
            tooltip:true,
            ellipsis: this.type === 'changeBusiness'? false : true,
            render: (h, params) => {
                return h('div',[
                        h('span',params.row.paymentAccount),
                        h('div',{
                            style:{
                                color:'red'
                            }
                        }, params.row.oldValue? this.returnOld(params.row.oldValue.paymentAccount) : '')
                ])                    
            }
          },
          {
            title:"开户支行",
            key:"openBankName",
            width:200,
            tooltip:true,
            render: (h, params) => {
                return h('div',[
                        h('span',params.row.openBankName),
                        h('div',{
                            style:{
                                color:'red'
                            }
                        }, params.row.oldValue? this.returnOld(params.row.oldValue.openBankName) : '')
                ])                    
            }
          },
          {
            title:"开户省市",
            key:"",
            width:150,
            tooltip:true,
            ellipsis: true,
          
            render: (h, params) => {
                return h('div',[
                        h('span',params.row.openBankAccountPro + ' ' + params.row.openBankAccountCity),
                        h('div',{
                            style:{
                                color:'red'
                            }
                        }, params.row.oldValue? this.returnProCity(params.row.oldValue) : '')
                ])                    
            }
          },
          {
            title:"收款联系人/持卡人",
            key:"",
            width:150,
            tooltip:true,
            render: (h, params) => {
                return h('div',[
                        h('span',params.row.accountType === '0'? params.row.receivableContacter : params.row.paymentName),
                        h('div',{
                            style:{
                                color:'red'
                            }
                        }, params.row.oldValue? this.returnInfo(params.row.oldValue, params.row.accountType): '')
                ])                    
            }
          },
          {
            title:"联系电话/持卡人电话",
            key:"",
            width:150,
            render: (h, params) => {
                return h('div',[
                        h('span',params.row.accountType === '0'? params.row.receivablePhone : params.row.receivablePhone),
                        h('div',{
                            style:{
                                color:'red'
                            }
                        }, params.row.oldValue && params.row.oldValue.receivablePhone && this.type === 'changeBusiness'? '（原：'+ params.row.oldValue.receivablePhone +'）' : '')
                ])                    
            }
          },
          {
            title:"收款类型",
            key:"paymentBusiTypeName",
            width:200,
            tooltip:true,
            ellipsis: true,
            render: (h, params) => {
                return h('div',[
                        h('span',params.row.paymentBusiTypeName),
                        h('div',{
                            style:{
                                color:'red'
                            }
                        }, params.row.oldValue? this.returnOld(params.row.oldValue.paymentBusiTypeName) : '')
                ])                    
            }
          },
          {
            title:"证明文件",
            key:"",
            width:180,
            tooltip:true,
            ellipsis: true,
            render: (h, params) => {
                return h('a',{
                    on:{
                        click: () => {
                          this.showImg(params.row.attachmentList[0])
                        }
                    }
                },params.row.attachmentList[0].attachmentName)                        
            }
          },
          {
            title:"其他信息",
            key:"note",
            width:150,
            tooltip:true,
            ellipsis: true,
            render: (h, params) => {
                return h('div',[
                        h('span', params.row.accountType === '1'? params.row.receivableIdentityCard : ''),
                        h('div',{
                            style:{
                                color:'red'
                            }
                        }, params.row.oldValue && params.row.oldValue.receivableIdentityCard && this.type === 'changeBusiness'? '（原：' + params.row.oldValue.receivableIdentityCard + '）' : '')
                ])                    
            }
          },
        ],
       
      }
    },
    watch:{
      pid(nv){
        if(nv !== ''){
          this.loadTable();
        }
      },
    },
    methods:{
      returnInfo(row, num){
        if(this.type === 'changeBusiness'){
          if(row.receivableContacter && num === '0'){
            return '（原：' + row.receivableContacter + '）';
          }else
          if(row.paymentName && num === '1'){
            return '（原：' + row.paymentName + '）';
          }
        }

      },
        returnProCity(row){
          if(this.type === 'changeBusiness'){
            if(row.openBankAccountPro && row.openBankAccountCity){
              return '（原：' + row.openBankAccountPro + ' ' + row.openBankAccountCity + '）';
            }else{
              if(row.openBankAccountPro){
                return '（原：' + row.openBankAccountPro + '）';
              }else
              if(row.openBankAccountCity){
                return '（原：' + row.openBankAccountCity + '）';
              }
            }
          }
        },
         returnOld(val){
              if(val && this.type === 'changeBusiness'){
                  return '（原：'+ val +'）';
              }
          },
       // 查看图片
          showImg(img){
              this.imgSrc = this.$viewURL_PATH + img.serverFileName;
              // this.visible = true;
              this.$showImg(this.imgSrc);
          },

          // 加载表格
      loadTable() {

          this.loading = true;
        
          this.$http.post(this.url, {channelId:this.pid ,workFlowId: this.workFlowId}).then( resp=> {
              this.loading = false;
              if(resp.data.success) {
                  let data = resp.data.data;
                  // this.data_table = data.map(item => {
                  //   item.oldValue = Object.assign({},item);
                  //   return item;
                  // })
                  this.data_table = data;
                  
              }
          })
      },

    },
    mounted(){
      if(this.type === 'changeBusiness'){
          this.columns.push({
              title: '停启用状态',
              width:110,
              key: '',
              render: (h, params) => {
                let flag = params.row.operateType;
                if(flag !== 'add'){
                  return h('div',[
                        h('span',params.row.enabledName),
                        h('div',{
                            style:{
                                color:'red'
                            }
                        }, params.row.oldValue? this.returnOld(params.row.oldValue.enabledName) : '')
                  ]) 
                }

                                   
              }
          });
          this.columns.push({
              title: '变更说明',
              width:150,
              key: '',
              render: (h, params) => {
                    let flag = params.row.operateType;
                    let text,color;

                    if(flag === 'add'){
                        text = '新增';
                        color = 'green';
                    }else
                    if(flag === 'update'){
                        text = '修改';
                        color = 'blue';
                    }else
                    if(flag === 'delete'){
                        text = '删除';
                        color = 'red';
                    }

                    return h('span',{
                        style:{
                            color: color
                        }
                    },text)                        
                }
          });
      }
    }
  }
</script>
