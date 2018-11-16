<!-- 公共头部 -->
<template>
	<div class="channels-common-body-content" style="padding:15px 30px;clear:both">
        <div class="channels-common-body-title">
              <span></span>{{title}}
          </div>
          <div class="channels-common-body-cont">
              <slot></slot>
          </div>
    </div>
</template>
<script>
    export default {
        props: ["title"],
        data() {
            return {
            }
        },
        watch:{
          
        },
        methods: {
         
        },

    } 
</script>

