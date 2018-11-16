<!-- 新增业务包 -->
<template>
	<businessManagementCommon :pid='obj.id' closeName="businessManagementAdd" />
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