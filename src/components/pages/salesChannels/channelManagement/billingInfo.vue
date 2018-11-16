<!-- 查看——收款信息 -->
<template>
  <div class="" style="margin:-20px">
    <cardList :pid="params" :value.sync="cardList"  :isEdit="false" @reload="getTwo" :show="true"></cardList>
  </div>
</template>

<script>
  export default {
    name: "totalInfo",
    props:["params"],
    data() {
      return {
         cardList:[],
       
      }
    },
    methods:{

      // 加载列表
        getTwo(){
          let json = {
            channelId: this.params
          }
           this.$http.post("/bank/account/getBankAccountList",json).then((resp)=>{
              if(resp.data.success){
                    let data = resp.data.data;
                    data.map(item => {
                      item.enabledBoolean = item.enabled === '0'? false:true;
                    })
                    this.cardList = data;
              };
            })
        },
    },
    mounted(){
      this.getTwo();
    }
  }
</script>
