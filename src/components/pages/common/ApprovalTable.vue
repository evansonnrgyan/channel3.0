<!-- 审批记录 -->
<template>
  <div class="">
 
    <Table :columns="columns" :data="data" :loading="loading" ></Table>

  </div>
</template>

<script>
  export default {
    name: "",
    props:{
      workFlowId:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        loading:false,
        data:[],
      	
        columns:[
          {
            title:"时间",
            key:"createTime",
          },
          {
            title:"操作人",
            key:"creatorName"
          },
          {
            title:"操作事件",
            key:"eventStatusName"
          },
          {
            title:"备注",
            key:"eventDetails",
          },
          
        ],
      }
    },
    watch:{
      workFlowId(nv){
        if(nv !== '' ){
          this.loadTable();
        }
      },
    },
    methods:{

      // 加载表格
      loadTable() {

          this.loading = true;
        
          this.$http.post('/log/queryApproveDetails', {id: this.workFlowId}).then( resp=> {
              this.loading = false;
              if(resp.data.success) {
                  let data = resp.data;
                  this.data = data.data;
              }
          })
      },
    },
    mounted(){
      if(this.workFlowId !== '' ){
          this.loadTable();
        }
    }
  }
</script>