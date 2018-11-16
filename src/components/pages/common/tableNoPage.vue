<!-- table 不带分页 -->
<template>
  <Table :columns="columns" :data="data" :loading="loading"></Table>
</template>

<script>
  export default {
    name: "",
    props:{
        columns:{
            type:Array,
            default:[]
        },
        url:{
            type:String,
            default:''
        },
        params:{
            type:Object,
            default:{}
        }
    },
    data () {
      return  {
        loading:false,
        data:[],
      }
    },
    watch:{
      params: {
            handler: function (newVal) {
                // this.loadTable();
              },
            deep: true
        }
    },
    methods:{
      // 加载表格
      loadTable() {

          this.loading = true;
        
          this.$http.post(this.url, this.params).then( resp=> {
              this.loading = false;
              if(resp.data.success) {
                  let data = resp.data;
                  this.data = data.data;
              }
          })
      },
    },
    mounted(){
      if(!$.isEmptyObject(this.params)){
        this.loadTable();       
      }
      

      
    }
  }
</script>

