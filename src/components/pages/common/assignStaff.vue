<!-- 指派员工列表 -->
<template>
  <div class="">
   <Form :label-width="80">
    <Row>
        <Col span="12">
          <FormItem label="员工姓名" prop="">
             <Input  v-model="forms.name" placeholder="" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="域账号" prop="">
            <Input  v-model="forms.yu" placeholder="" />
         
          </FormItem>
        </Col>
      </Row>
    </Form>
      <div class="text-center" style="margin:10px auto">
        <Button type="primary"  @click="searchFn">查询</Button>
         <Button @click="reset">重置</Button>
      </div>
       <Table highlight-row :columns="columns" :data="data" :loading="loading" @on-row-click="clickTable"></Table>
        <Page v-if="data.length>0" :total="total" :current="current" :page-size="rowCount" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator></Page>

  </div>
</template>

<script>
  export default {
    name: "",
    props:{
      value:{
        type:Object,
        default:{}
      }
    },
    data() {
      return {
        loading:false,

        forms:{
          name:'',
          yu:''
        },
        search:{
          name:'',
          yu:'',
        },
        
      	
        columns:[
          {
            title:"员工姓名",
            key:"cnName",
          },
          {
            title:"所在部门",
            key:"departmentNames"
          },
        ],
        data:[],

        current:1,
        rowCount:10,
        total:0,


     

      }
    },
    watch:{
   
    },
    methods:{

      clickTable(data){
        console.log(data,'______________')
        this.$emit('update:value',data)
      },
      reset(){
        this.forms.name = '';
        this.forms.yu = '';
      },
      searchFn(){
        this.current = 1;
        this.search.name = this.forms.name;
        this.search.yu = this.forms.yu;
        this.$nextTick(()=>{
          this.loadTable();
        })
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

      // 加载表格
      loadTable() {

          this.loading = true;

          let json = {
              cnName:this.search.name,
              domainAccount:this.search.yu,
              current:this.current,
              rowCount:this.rowCount
          }
        
          this.$http.post('/channelWfpt/queryAssignUser', json).then( resp=> {
              this.loading = false;
              if(resp.data.success) {
                  let data = resp.data.data;
                  this.data = data.data;
                  this.total = data.total;
                  this.rowCount = data.rowCount;
              }
          })
      },
    	
  
    },
    mounted(){
      this.loadTable();
    }
  }
</script>