<!-- 账号管理 -->
<template>
  <div class="" >

    <Table :columns="columns" :data="data" :loading="loading"></Table>

  </div>
</template>

<script>
  export default {
    name: "accountManagement",
    props:["params","edit"],
    data() {
      return {

        loading:false,

        data:[],

        columnsData:[],
      
        columns:[
          {
            title:"账号等级",
            key:"accountTypeName",
          },
          {
            title:"姓名",
            key:"employeeName"
          },
          {
            title:"账户",
            key:"userName"
          },
          {
            title:"手机号",
            key:"telephone"
          },
          {
            title:"联系邮箱",
            key:"email"
          },
          {
            title:"负责业务",
            key:"businessType"
          },
          {
            title:"最近登录时间",
            key:"latestLoginTime"
          },
          {
            title:"状态",
            key:"accountStatusName",
          },
          {
            title:"操作",
            render: (h, params) => {
              let userName = params.row.userName;
              let accountStatus =  params.row.accountStatus;

                return h('a',{
                  on: {
                        click: () => {
                          this.stopOrStart(userName,accountStatus)
                        }
                      }
                },accountStatus === '1'?'启用':'禁用')
             
              
            }
          },
        ],
      }
    },
    watch:{
      params(nv){
        if(nv){
          // this.loadTable();       
        }
      }
    },
    methods:{

      // 加载表格
      loadTable() {

          this.loading = true;
        
          this.$http.post('/user/account/getAllUserById', {channelId: this.params}).then( resp=> {
              this.loading = false;
              if(resp.data.success) {
                  let data = resp.data;
                  this.data = data.data;
              }
          })
      },
      // 启用禁用
      stopOrStart(userName,accountStatus){

        let flag = accountStatus === '1'? '0' : '1';

        this.$Modal.confirm({
              title: '提示',
              content:  flag === '0'? '确认启用？': '确认禁用？',
              onOk: () => {
                  let json = {
                 
                         "channelId":this.params, 
                         "status": flag,  //启用0，禁用1
                         "userName": userName
                  } 
                  this.$http.post('/user/account/udateAccountStatus',json).then(resp => {
                      if (resp.data.success) {
                          this.$Message.success('操作成功！');
                          this.loadTable();
                      }
                  })
              },
          });
      }
    },
    mounted(){
      if(!this.edit){
        this.columns.pop();
      }
      if(this.params){
        this.loadTable();       
      }
    },
  }
</script>
