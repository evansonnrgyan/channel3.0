<!-- 设置业务包 -->
<template>
	<businessManagementCommon :pid="obj.id" closeName="businessManagementEdit" />
</template>
<script>
	export default {
		data(){
			return {
				obj:{},
			}
		},
		mounted(){
			this.obj = Object.assign({},this.$attrs.params)
		}
	}
</script>