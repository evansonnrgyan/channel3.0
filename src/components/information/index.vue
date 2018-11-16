<template>
  <div class="dynamic-work-apply">

      <div :is="componentName" :params.async="params"></div>

  </div>
</template>

<script>
  import Information from "../information";
  import InfomationView from "../view";
  export default {
    name:"dynamicInfomationView",
    data () {
      return {
        componentName: "Information",
        params:""
      }
    },
    components: {
      InfomationView,
      Information
    },
    mounted(){
      this.$bus.$on("linkToView", (data)=>{
        this.params = data;

        this.componentName = "InfomationView"
      });

      this.$bus.$on("linkToWorkApply",(data)=>{
       this.params = {"current": data};
        this.componentName = "Information"
      })

    }
  }
</script>
