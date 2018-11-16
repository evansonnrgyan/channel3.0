<template>
  <div class="dynamic-work-apply">
      <div :is="componentName" :params.async="params"></div>
  </div>
</template>

<script>
  import workApply from "../workApply";
  import workView from "../view";
  import approval from "../approval";
  export default {
    name:"dynamicWorkApply",
    data () {
      return {
        componentName: "workApply",
        params:""
      }
    },
    components: {
      workApply,
      workView,
      approval
    },
    mounted(){
      this.$bus.$on("linkToView", (data)=>{
        this.params = data;

        this.componentName = "workView"
      });
      //渠道审批
      this.$bus.$on("linkToApproval", (data)=>{
        this.params = data;
        console.log("渠道审批");
        console.log(data);

        this.componentName = "approval";
      })

      this.$bus.$on("linkToWorkApply",(data)=>{
        console.log(data);
        this.componentName = "workApply"
      })

      this.$bus.$on("linkToApprocal", (data)=>{
        console.log(data);
        this.params = data;

        this.componentName = "workView"
      })


    }
  }
</script>
