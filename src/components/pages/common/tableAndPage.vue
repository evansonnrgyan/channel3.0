<!-- table 带分页 -->
<template>
<div >
  <Table :columns="columns" :data="data" :loading="loading"></Table>
  <Page v-if="data.length>0" :total="total" :current="current" :page-size="rowCount" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator></Page>
</div>
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
        },
    },
    data () {
      return  {
        loading:false,
        total:0,
        current:1,
        rowCount:10,
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
          
          this.params.current = this.current;
          this.params.rowCount = this.rowCount;
          
          this.$http.post(this.url, this.params).then( resp=> {
              this.loading = false;
              if(resp.data.success) {
                  let data = resp.data.data;
                  this.data = data.data;
                  this.total = data.total;
                  this.rowCount = data.rowCount;
              }
          })
      },
      // 刷新列表
      reloadTable(){
        this.current = 1;
        this.loadTable();
      },
      change_page(c) {
          this.current = c;
          this.$nextTick(()=>{
            this.loadTable();
          })
      },
      change_page_size(p) {
          this.current = 1;
          this.rowCount = p;
          this.$nextTick(()=>{
            this.loadTable();
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

<style lang="less" scoped>
  .font12{
    font-szie: 12px;
    color: #666666;
  }
  .imgView{
    width:100px;
    height:110px;
  }
</style>
