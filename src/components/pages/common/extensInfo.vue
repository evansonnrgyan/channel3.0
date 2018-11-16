<!--拓展信息-->
<template>
  <div>
    <Form ref="formValidate" :label-width="130" v-if="flag">
      <Row>
          <Col span="24">
              <FormItem label="新车是否先抵后放" prop="">
                 <span>{{formValidate.newOffsetModel | filters}}</span>
              </FormItem>
          </Col>
      </Row>
      <Row>
          <Col span="24">
              <FormItem label="二手车是否先抵后放" prop="">
                 <span>{{formValidate.usedOffsetModel | filters}}</span>
              </FormItem>
          </Col>
      </Row>
      <Row>
          <Col span="24">
              <FormItem label="GPS厂商" prop="">
                 <span>{{formValidate.gpsName}}</span>
              </FormItem>
          </Col>
      </Row>
      <Row>
          <Col span="24">
              <FormItem label="保险是否直放" prop="">
                 <span>{{formValidate.insuranceModel | filters}}</span>
              </FormItem>
          </Col>
      </Row>
      <Row>
          <Col span="24">
              <FormItem label="GPS升级方案" prop="">
                 <span>{{formValidate.upgradeSchemeType | gpsfilters}}</span>
              </FormItem>
          </Col>
      </Row>
      <Row>
          <Col span="24">
              <FormItem label="新车是否后置GPS" prop="">
                 <span>{{formValidate.newCarGpsType | filters}}</span>
              </FormItem>
          </Col>
      </Row>
      <Row>
          <Col span="24">
              <FormItem label="二手车是否后置GPS" prop="">
                 <span>{{formValidate.usedCarGpsType | filters}}</span>
              </FormItem>
          </Col>
      </Row>
      <Row>
          <Col span="24">
              <FormItem label="发票是否先审后放" prop="">
                 <span>{{formValidate.invoiceModel | filters}}</span>
              </FormItem>
          </Col>
      </Row>
      <Row v-if="rentLevel && rentLevel !== ''">
          <Col span="24">
              <FormItem label="租赁代理评级" prop="">
                 <!-- <span> {{list[rentLevel]}} &nbsp; <a v-if="rentLevel !== '050400001'" @click="updateHe">升级为核心</a></span> -->
                 <span>{{list[rentLevel]}}</span>
              </FormItem>
          </Col>
      </Row>
    </Form>

    <div v-else style="padding-left:60px">暂无配置</div>
    </div>
</template>

<script>
  export default {
    name: "",
    props:{
      channelId:{
          type: String,
          default: '',
      },
      shopId:{
          type: String,
          default: '',
      },
      rentLevel:{
        type:String,
        default:'',
      }
    },
    data () {
      return  {
          formValidate: {},
          list:{
           '050400000':'普通代理商',
           '050400001':'核心代理商',
           '050400002':'一级代理商',
           '050400003':'二级代理商',
          },
          flag:false,
      }
    },
    watch:{
      channelId(nv){
        if(nv !== ''){
           this.getData()
        }

      }
    },
    filters: {
      filters: function (value) {
        if(value === '1'){
          return '是'
        }else
        if(value === '0'){
          return '否'
        }else{
          return '暂未设置'
        }
      },
      gpsfilters: function(value){
        if(value === '1'){
          return '直放'
        }else
        if(value === '0'){
          return '报销'
        }else{
          return '暂未设置'
        }      
      }
    },
    methods:{
      updateHe(){
        this.$bus.$emit("applyUpdate",{id: "applyUpdate", isShow:true, name:"申请升级为核心", refresh:true,params:{ type: 'new', id: this.channelId ,shopId:this.shopId}})
      },
      // 获取数据
      getData(){
          let json = {
                id: this.channelId,
            } 
            this.$http.post('/ChooseChannelController/extendMessage',json).then(resp => {
                if (resp.data.success) {
                  if(resp.data.data && resp.data.data.length > 0 ){
                    this.flag = true;
                    this.formValidate = resp.data.data[0];
                  }else{
                    this.flag = false;
                  }
                }else{
                  this.flag = false;
                }
            })
      },
    },
    mounted(){
      if(this.channelId !== ''){
           this.getData()
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
