<template>
  <div class="limit-length">
    <span class="min">{{value.length}}</span>/<span class="limit-total">{{max}}</span>
  </div>
</template>

<script>
  export default {
    name: "limit-length",
    props:{
      value:{
        type: String,
        default:''
      },
      max:{
        type:Number,
        default:20
      }
    }
  }
</script>

<style scoped>
  .limit-length{
    display: inline-block;
  }
  .min{
    margin-left: 3px
  }
</style>
