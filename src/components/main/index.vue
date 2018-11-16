<template>
	<div class="po-body">
		<po-header></po-header>
		<!-- 左侧 -->
	    <div style="width:200px;background:#fff">
	      <po-nav></po-nav>
	    </div>
		<!-- 右侧 -->
		<po-content></po-content>
		<!-- 底部 -->
	    <po-footer></po-footer>
	</div>
</template>
<script>
	import poNav from '../commen/nav';
	import poContent from '../commen/content';
	import poHeader from '../commen/header';
	export default {
		name:'',
		components: {
			poNav,
			poContent,
			poHeader,
		}
	}
</script>
<style lang="less" scoped>
	.po-body {
		display: flex;
		height: 100%;
		flex-flow: row;
		background:#f4f5f8
	}
</style>
