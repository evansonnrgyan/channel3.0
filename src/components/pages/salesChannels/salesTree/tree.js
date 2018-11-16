import ztree from './jquery.ztree.all.js';

export default {
	params: ['ztreechecks'],
	deep: true,
	bind: function (data) {
	// zTreeObj = $.fn.zTree.init($(this.el), setting, zNodes);
	// 准备工作
	// 例如，添加事件处理器或只需要运行一次的高耗任务

	},
	update: function (newValue, oldValue) {
	// 值更新时的工作
	// 也会以初始值为参数调用一次
	let _this = this;
	var zTreeObj;
	// 收集多选数组
	let arrId = [];
	let arrObj = [];
	var setting = {
		check: {
			enable: _this.params.ztreechecks == 'true' ? true : false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeClick: beforeClick,
			onCheck: zTreeOnCheck
		}
	};
	// 获取节点方法
	function zTreeOnCheck (event, treeId, treeNode) {
		arrId.push(treeNode.id)
		arrObj.push(treeNode)
		_this.vm.$dispatch('treeValueArr',arrId,arrObj)
	}
	// 点击节点方法
	function beforeClick (treeId,treeNode) {
		if (_this.params.ztreechecks) {
			// 单选
			_this.vm.$dispatch('treeValue',treeNode)
		}
	}
		zTreeObj = $.fn.zTree.init($(this.el), setting, newValue);
	},
	unbind: function () {
	// 清理工作
	// 例如，删除 bind() 添加的事件监听器
	//this.zTreeObj.destroy();
	}
};