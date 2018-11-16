/*

机构组织树

ztree doc:
http://www.treejs.cn/v3/api.php
 */
//import 'assets/js/ztree';
export default {
	bind: function (el, binding, vnode) {
		var _this = vnode.context;
		var Drive;
		var saveInput;
		var editName = false;
		var drageDouble = true;
		var dragArr = [];
		var isRun = true;



		_this.$nextTick(() => {

		    console.log(_this.ztreeData,'数据发生了变化');
			var contextPath = '/channel-web/clMultipleOrgTreeController';
			var bussinessSetting = {
			    view: {
			        addHoverDom: addHoverDom,
			        removeHoverDom: removeHoverDom,
			        selectedMulti: false,
                    fontCss: setFontCss
			    },
			    edit: {
			        enable: true,
			        removeTitle:'删除',
			    	renameTitle:'编辑',
			    	showRenameBtn:false,
			    	showRemoveBtn:false,
					drag:{
						isCopy: false,
						isMove: true,
						inner: true
					}
			    },
			    data: {
			        simpleData: {
			            enable: true	
			        },
			        keep: {
						leaf: false,
						parent: true
					}
			    },
			    callback: {
			        beforeDrag: beforeDrag,
			        beforeDrop: beforeDrop,
			        beforeEditName: beforeEditName,
			        beforeRemove: beforeRemove,
			        beforeRename: beforeRename,
			        onRemove: onRemove,
			        onRename: onRename,
			        onClick: zTreeOnClick,
                    onDrag: onDrag,
                    onDrop: onDrop
					}
				}
			var doId = '';//被操作节点的id
			var doName = '';//被操作节点的name
			function beforeDrag(treeId, treeNodes) {//拖拽前
				if(Drive){
					if(drageDouble){
						for (var i=0,l = treeNodes.length; i < l; i++) {  
				            var  pid = treeNodes[i].pId;  
				            if(pid == "1"||pid== null ||pid == "null"){
				            	_this.infoModalText = '不能拖动根节点';
							    _this.dropMessage = true;// 显示确认弹框
					            return false;
				            }
				     	}
				        return true;
					}else{

						//_this.infoModalText = '不能拖动次数过多';
					    //_this.dropMessage = true;// 显示确认弹框
			            return false;
					}
				}else{
					//_this.infoModalText = '请点击修改部门层级';
					//_this.dropMessage = true;// 显示确认弹框
					return false;
				}  
			};
			/**拖拽释放之后结束前执行  */   
			function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy){
				if(Drive){
                    /*console.log("【目标节点】 节点id:"+targetNode.id+"  父节点id:"+targetNode.pId+"  级层："+targetNode.level+"  名称："+targetNode.name);
                    console.log("【源节点】节点id:"+treeNodes[0].id+"  父节点id:"+treeNodes[0].pId+"  级层："+treeNodes[0].level+"  名称："+treeNodes[0].name);*/
                  	//如果拖拽的是目录
	                if(treeNodes[0].isParent){
	                    $.each(treeNodes[0].children,function(i,treeNode){
	                        //console.log("【源节点】子节点"+i+":"+treeNode.id+"  父节点id:"+treeNode.pId+"  级层："+treeNode.level+"  名称："+treeNode.name);
	                    });
	                }
                      //console.log("treeId:"+treeId+"--treeNodes:"+treeNodes+"--targetNode:"+targetNode+"--moveType:"+moveType+"--isCopy:"+isCopy);
                      //库名不允许拖拽
                      if(treeNodes[0].level== 0){
                      	_this.infoModalText = '不允许拖拽库节点';
						_this.dropMessage = true;// 显示确认弹框
						return false;
                      }
                      //不允许拖拽到表节点下(如果树状图中有空目录，那还是需要在后台进行校验该节点是否是表节点）
                      /*if(!targetNode.isParent){
	                        _this.infoModalText = '不允许拖拽到根节点';
							_this.dropMessage = true;// 显示确认弹框
							return false;
                      }*/
                      return true;
				}else{
            		return false;
				}
            };

            function onDrag(){//拖拽中
            	if(Drive){
               		return true;
            	}else{
            		return false;
            	}
          	};

            function onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy){//拖拽完成

            	console.log(treeNodes[0],'++++++')
            	if(Drive){
                    console.log("【源节点】节点id:"+treeNodes[0].id+" 父节点id:"+treeNodes[0].pId+"  级层："+treeNodes[0].level+"  名称："+treeNodes[0].name);
                  	console.log("【目标节点】 节点id:"+targetNode.id+"  父节点id:"+targetNode.pId+"  级层："+targetNode.level+"  名称："+targetNode.name);
                  	let o = {
                  		// pId:treeNodes[0].pId,
                  		// parent_id: targetNode.id,
                  		// department_id:treeNodes[0].id,
                  		// parent_name:targetNode.name,
                  		// department_name:treeNodes[0].name,
                  		// level:treeNodes[0].level

                  		nodeCode: treeNodes[0].id,
                  		nodeType: treeNodes[0].nodeType,
                  		parentNode: treeNodes[0].parentNode,
                  		moveParentCode: targetNode.id,



                  	};
                  	if(dragArr.length < 5){
                  		dragArr.push(o);
                  		drageDouble = true;
                  		console.log(dragArr);
                  	}else{
                  		drageDouble = false;
                  	}
                  	/*if(treeNodes[0].isParent){//如果拖拽的是目录
                      $.each(treeNodes[0].children,function(i,treeNode){
                           console.log("【源节点】子节点"+i+":"+treeNode.id+"  父节点id:"+treeNode.pId+"  级层："+treeNode.level+"  名称："+treeNode.name);
                      });
	                }*/
                    //console.log("event:"+event+"--treeId:"+treeId+"--treeNodes:"+treeNodes+"--targetNode:"+targetNode+"--moveType:"+moveType+"--isCopy:"+isCopy);
                    return true; 
            	}else{
            		return false;
            	}
			};

			function setRenameBtn(treeId, treeNode){//设置编辑按钮显隐
				if(treeNode.source == '0'){
					return false;
				}else{
					return true;
				}
			};
			function setRemoveBtn(treeId, treeNode){//设置删除按钮显隐
				if(treeNode.source == '0'){
					return false;
				}else{
					return true;
				}
			}
			function beforeRemove(treeId, treeNode) {//删除节点
				return false;
			};
			
			function onRemove(e, treeId, treeNode) {
			};
			
			var renameModalId, renameModalNewName;

			function beforeEditName(treeId, treeNode) {
			    var zTree = $.fn.zTree.getZTreeObj("bussinessTree");
			    zTree.selectNode(treeNode);
			    doId = treeNode.id;//记录当前操作节点的id
			    let tId = treeNode.tId;
				let editDom = $('#'+tId+'_a');
			    editDom.append('<button class="editCancel">取消</button>' + '<button class = "editSave">保存</button>');
			    doName = treeNode.name;//记录当前操作几点的name
			    return true;
			};

			var checkEdit = function (treeId, treeNode, newName, isCancel,parentId){//
				let save = $(".saveInput");
				let del = $(".delInput");
				let editSave = $(".editSave");
				let editCancel = $(".editCancel");
				if(save.length > 0){
					$(".saveInput").click(function(e){//新增
						isAdd = true;
						saveInput = true;
						if (newName.length == 0) {
					        _this.infoModal = true;// 显示确认弹框
					        var zTree = $.fn.zTree.getZTreeObj(treeId);
					        setTimeout(function(){zTree.editName(treeNode)}, 10);
					        return false;
					    }else{
					    	var reg=/^[\s　]|[ ]$/gi;
						    if(reg.test(newName)){
						    	_this.infoModalText = '首尾不允许输入空格';
								_this.dropMessage = true;// 显示确认弹框
								return false;
						    }else if(newName.length > 25){
								_this.infoModalText = '输入字符超出最大限制';
								_this.dropMessage = true;// 显示确认弹框
								return false;
						    }
						    parentId = +parentId;
					    	ywjgs.addNodes(renameModalNewName,parentId);
					    }					
					});
					var zTree = $.fn.zTree.getZTreeObj("bussinessTree");
					setTimeout(function(){zTree.editName(treeNode)},10);
					$(".delInput").click(function(e){//删除
						zTree.removeNode(treeNode);
						parentId = +parentId;
						ywjgs.initYWJG(null,null,parentId);

					});
				}else {
					if(editSave.length > 0){
						$(".editSave").click(function(e){//新增
							if (newName.length == 0) {
						        _this.infoModal = true;// 显示确认弹框
						        var zTree = $.fn.zTree.getZTreeObj(treeId);
						        setTimeout(function(){zTree.editName(treeNode)}, 10);
						        return false;
						    }else if(newName.length >25){
						    	_this.infoModalText = '输入字符超出最大限制';
								_this.dropMessage = true;// 显示确认弹框
								return false;
						    }
						    renameModalId = +renameModalId;
							parentId = +parentId;
					    	ywjgs.editBusinessDepartment(renameModalId,newName,parentId);
					    	 return true;
						});
						$(".editCancel").click(function(e){//取消
							parentId = +parentId;
							ywjgs.initYWJG(null,null,parentId);
						});
					}
					return false;
				};
			};

			function beforeRename(treeId, treeNode, newName, isCancel,e) {//
				let parentId = treeNode.pId;
				renameModalId = treeNode.id;
				renameModalNewName = newName;
				return checkEdit(treeId, treeNode, newName, isCancel,parentId);
				e.stopPragation();
			};
			
			function onRename(e, treeId, treeNode, isCancel) {//
				$('#'+treeNode.tId+'_input').on('focus blur',function(e){
					e.stopPragation();
					return false;
				});
				$('#'+treeNode.tId+'_input').trigger('blur');
			};


			
			function zTreeOnClick(event, treeId, treeNode) {//业务机构的点击事件
			    console.log(treeNode, '被点击的当前节点');

			    _this.clickedNode = treeNode;

			    console.log(_this, '当前组件');

			    if(treeNode.chkDisabled){
			        _this.data = [];
			        return false;
                }
			    if(isRun){
		             _this.onItemClick(treeNode.id, treeNode);
		             isRun=false;
		         }
		         setTimeout(function(){
		             isRun=true;
		         },800) //点击后相隔多长时间可执行
			};
			//添加节点
			function appendDom(treeId, treeNode){
				/*自定义添加项*/
				var ZtreeNode = function ZtreeNode(id, pId,name) {//定义ztree的节点类  
				    this.id = id;
				    this.pId = pId;
				    this.name = name;  
				};
				if(treeNode){
					var orgId = '',parentOrgId = treeNode.id,name = ''; 
					var childZNode = new ZtreeNode(orgId, parentOrgId,name); //构造子节点  
					var zTree = $.fn.zTree.getZTreeObj(treeId);//获取ztree对象  
					zTree.addNodes(treeNode,childZNode, null); 
					if(!!treeNode.children){
						let index = treeNode.children.length -1;
						let arr = treeNode.children[index].tId;
						var node = zTree.getNodeByTId(arr);
						zTree.editName(node);
						var $_root = $('#'+arr);
						$_root.find('a').append('<button class="delInput">删除</button>' + '<button class = "saveInput">保存</button>');
					}
				}
			};
			var newCount = 1;
			var editTreeNode;
			var isAdd = true;

			function addHoverDom(treeId, treeNode) {
				editTreeNode = treeNode;

				//TODO 判断树节点是否可编辑添加

                if(treeNode.chkDisabled){

                    //console.log(treeNode.chkDisabled, 'treeNode.chkDisabled=true不可编辑');
                    return false;
                }else{
                    //console.log(treeNode, 'treeNode.chkDisabled=false可编辑');
                }


				// 添加按钮 
			    var sObj = $("#" + treeNode.tId + "_span");

			    // 添加人员
			    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			    var addStr = "<span class='floatRight colord' id='addBtn_" + treeNode.tId
			            + "' title='添加人员' onfocus='this.blur();' >＋添加</span>";

			    // 添加部门
	            var addbumenStr = "<span class='floatRight colord' style='margin-left:5px' id='addbumenBtn_" + treeNode.tId
	            + "' title='添加部门' onfocus='this.blur();'>编辑</span>";

	            if(_this.levelStats){
	            	sObj.after(addbumenStr,addStr);
	            }

			    // 新增
			    var btn = $("#addBtn_"+treeNode.tId);
			    if (btn) btn.bind("click", function(){
			    	// if(isAdd){
			    		_this.addMan(treeNode);
			    		// appendDom(treeId, treeNode);
			    		isAdd = false;
			        	return false;
			    	// }
			    });

			    // 编辑
			    var btn_bumen = $("#addbumenBtn_"+treeNode.tId);
			    if (btn_bumen) btn_bumen.bind("click", function(){
			    	// if(isAdd){
			    		_this.addBumen(treeNode);
			    		// appendDom(treeId, treeNode);
			    		isAdd = false;
			        	return false;
			    	// }
			    });

			 
				// 删除按钮
				var removeBtn = $('#' + treeNode.tId + '_remove');
				if (removeBtn) removeBtn.bind("click", function(){
				
					_this.deleteModal = true;
	                    isAdd = true;
	                    return false;
                });
			};
			function removeHoverDom(treeId, treeNode) {
			    $("#addBtn_"+treeNode.tId).remove();
			    $("#addbumenBtn_"+treeNode.tId).remove();
				$('#' + treeNode.tId + '_remove').remove();
			};
			function selectAll() {
			    var zTree = $.fn.zTree.getZTreeObj("bussinessTree");
			    zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
			};

			var ywjgs = {};//业务机构树


			function dealWithData(data){
				if(data.length){
					data.map(function(item,i){
						item.newId = item.id;
						item.id = item.id;
						item.pId = item.pId;
						item.name = item.name;

						if(item.children && item.children.length>0){
                            dealWithData(item.children)
                        }

						// if(item.nodeType==1||item.nodeType==3||item.nodeType==6){
						// 	item.iconSkin = 'iconCompany'
						// }else if(item.nodeType==4||item.nodeType==5){
						// 	item.iconSkin = 'iconPerson'
						// }else if(item.nodeType==2){
						// 	item.iconSkin = 'iconChannel'
						// }

						if(item.children){
							item.iconSkin = 'iconHasChildren'
						}

						if(item.subNodeCount>0){
							item.isParent = true ;
						}else{
							item.isParent = false;
						}
					});
				};
				return data;
			};
			function initoption(arr1){
				var newArr = [];
				(function deal(arr){
					arr.map(item => {						
						if(item.pId==''){
							item.pId=0;
						}
						newArr.push(item);
						if(item.children){
							deal(item.children)	
					   }
					})					
				})(arr1);
				return newArr;

			};
			function cancelDrap(){
				_this.levelStats = false;
				Drive = false;
				drageDouble = true;
				dragArr = [];
			};

			// 自定义节点样式
            function setFontCss(treeId, treeNode) {
                return (treeNode.chkDisabled==="true" || treeNode.chkDisabled===true) ? {cursor: "not-allowed"} : "";
            }
			
			//初始化业务机构树--业务机构树是进行增删改和同步的
			ywjgs.initYWJG=function(arg,index,getParentId,isDel){

                $.fn.zTree.init($("#bussinessTree"), bussinessSetting, []);

				let o={
					"dimensionCode": "DM00000003"
				}

				if(arg){

					o.nodeName = arg;
					_this.$http.post('/api/yxAdminDepartment/getUserInfoByCnNameAndDeptid',o).then(function (response) {
						var data = response.data.data;
						if(data==null||data==''){
			                data = {};
			            }
			            let arr = data.filter(item => {
			            	return item.sign === '1'
			            })
			            if(arr.length < 1){
			            	_this.infoModalText = '没有匹配数据！';
							_this.dropMessage = true;// 显示弹框
			            	return;
			            }else if(arr.length == 1){

			            	_this.treeSarch = false;
							_this.showbtn = false;
							cancelDrap();

			            }else{
			            	_this.treeSarch = true;
							_this.showbtn = true;
							cancelDrap();
			            }
			            
						_this.index = 0;

			            $.fn.zTree.init($("#bussinessTree"), bussinessSetting, dealWithData(data));
			            if(!!index){
			            	ywjgs.showNodeSearched(index);
			            }
			            ywjgs.showNodeSearched();
			            _this.isShowLoading = false;
					});
				}else if(getParentId){
					//debugger
					_this.$http.post('/tbMultipleNode/tbMultipleNodeTree',o).then(function (response) {
					
						var data = response.data.data;

						if(data==null||data==''){
			                data = {};
			            }
			            console.log(data, '结构树数据----------');
			            $.fn.zTree.init($("#bussinessTree"), bussinessSetting, dealWithData(data));
			            var treeObj = $.fn.zTree.getZTreeObj("bussinessTree");
						var node = treeObj.getNodeByParam("id",getParentId, null);
						if(isDel){
							treeObj.expandNode(node,true,true,true);
						}else{
							treeObj.expandNode(node,true,false,true);
						}
						treeObj.selectNode(node);
						_this.isShowLoading = false;

						_this.onItemClick(getParentId);
						/*var zTree = $.fn.zTree.getZTreeObj("bussinessTree");
						zTree.selectNode(node);*/
					});

					cancelDrap();
				}else{

					_this.$http.post('/tbMultipleNode/tbMultipleNodeTree',o).then(function (response) {
						
						if(response.data.success){
							var data = response.data.data;
							var ff = data;//initoption(data);
                            console.log(data,'ztree 原始数据');
							$.fn.zTree.init($("#bussinessTree"), bussinessSetting, dealWithData(ff));
							_this.isShowLoading = false;
							_this.treeSarch = false;
							_this.showbtn = false;
							_this.index = 0;
						}else{

						}
						
					 });
					_this.data = [];
					cancelDrap();

				}

				isAdd = true;


				//var data = [{"id":"1000105","pId":"1000104","name":"产品组","open":null,"synId":null,"sort":"0","is_delete":null,"sales":"0"},{"id":"1000293","pId":"1000105","name":"订单","open":null,"synId":null,"sort":null,"is_delete":null,"sales":null},{"id":"1000298","pId":"1000105","name":"好好","open":null,"synId":null,"sort":null,"is_delete":null,"sales":null},{"id":"1000294","pId":"1000298","name":"订单的","open":null,"synId":null,"sort":null,"is_delete":null,"sales":null},{"id":"1000296","pId":"1000294","name":"突然有人","open":null,"synId":null,"sort":null,"is_delete":null,"sales":null},{"id":"1000315","pId":"1000294","name":"1213jj","open":null,"synId":null,"sort":null,"is_delete":null,"sales":null},{"id":"1000314","pId":"1000298","name":"121","open":null,"synId":null,"sort":null,"is_delete":null,"sales":null},{"id":"1000295","pId":"1000105","name":"运营、","open":null,"synId":null,"sort":null,"is_delete":null,"sales":null},{"id":"1000302","pId":"1000295","name":"sj333","open":null,"synId":null,"sort":null,"is_delete":null,"sales":null},{"id":"1000312","pId":"1000302","name":"沙发大厦","open":null,"synId":null,"sort":null,"is_delete":null,"sales":null},{"id":"1000313","pId":"1000302","name":"1","open":null,"synId":null,"sort":null,"is_delete":null,"sales":null},{"id":"1000311","pId":"1000295","name":"订单","open":null,"synId":null,"sort":null,"is_delete":null,"sales":null}]
				/*$.fn.zTree.init($("#bussinessTree"),bussinessSetting,data);*/
			};
			
			ywjgs.showNodeSearched = function (index){//获得选中节点
				var zTree = $.fn.zTree.getZTreeObj("bussinessTree");
				var nodes = zTree.getNodesByParam("sign","1",null);
				if (nodes.length > 0) {
					if(!!index){
						if(index > nodes.length-1){
							index = nodes.length-1;
						}else if(index < 0){
							index = 0;
						}else{
							zTree.expandNode(nodes[index],true, false, true);
							zTree.selectNode(nodes[index]);
						}
					}else{
						zTree.expandNode(nodes[0],true, false, true);
						zTree.selectNode(nodes[0]);
					}
				}
				let nodeLength = nodes.length;
				_this.nodeLength_fn(nodeLength);

			};
			//console.log(_this)
			ywjgs.addNodes = function(parentNode ,nodeName,sourceId,type){//新增节点
				let o = {
						parentNode: parentNode,
						nodeName: nodeName,
						sourceId: sourceId,
						type: type
					};
				// if(saveInput){
					_this.$http.post(contextPath+'/addNodes',o).then(function (response) {
						var data = response.data;
						if(data.success){
								// let getParentId  = data.data.parentId;
								/*var zTree = $.fn.zTree.getZTreeObj(treeId);
								zTree.cancelEditName(name);*/
								_this.addModal = false;
								_this.addModal_bumen = false;
								
								_this.infoModalText = '添加成功！';
								_this.dropMessage = true;// 显示弹框
								setTimeout(()=>{
									ywjgs.initYWJG(null,null,parentNode);
								},1000)
								
								
						}else{

							// _this.infoModalText = data.errorMessage;
							// _this.dropMessage = true;// 显示弹框

							// _this.infoModalText = data.errorMessage;
							// _this.dropMessage = true;// 显示确认弹框
							// return false;
						}
					});
				// }
			};
			ywjgs.addBusinessDepartment=function(name){
				var treeNode = editTreeNode;
			    var Tdata = {"parentId":treeNode.id,"name":name};
				var zTree = $.fn.zTree.getZTreeObj("bussinessTree");
			    $.ajax({
			        type: 'post',
			        async: false,
			        url: contextPath+'/department/addBusinessDepartment' ,
			        data:Tdata,
			        success: function(data){
			            zTree.addNodes(treeNode, {id:data.data, pId:treeNode.id, name:name});
			        } ,
			        dataType: 'json'
			    });
			};
			//删除
			ywjgs.deleteBusinessDepartment = function(){
				var treeNode = editTreeNode;
				var treenodeId = "";
				// 点击节点返回值有可能是String类型也有可能是Object类型
				 treenodeId = treeNode.id;
				if(treenodeId == ''){
					_this.infoModalText = "此时不允许删除";
					_this.dropMessage = true;// 显示确认弹框
					return false;
				}
			     var Tdata = {"department_id": treenodeId};
			     var zTree = $.fn.zTree.getZTreeObj("bussinessTree");
			    $.ajax({
			        type: 'post',
			        async: false,
			        url: contextPath+'/depart/departTreeDel',
			        data:Tdata,
			        success: function(data){
			        	if(data.success == false){
			        		_this.infoModalText = data.errorMessage;
							_this.dropMessage = true;// 显示确认弹框
			        	}else{
			        		let parentId = data.data[0].pId;
			        		ywjgs.initYWJG(null,null,parentId,true);
			        	}
			        },
			        dataType: 'json'
			    });
			}
			//给业务机构树编辑一条数据
			ywjgs.editBusinessDepartment=function(id,name,pId){
			    var Tdata = {"id":id,"name":name};
			    _this.$http.post(contextPath+'/depart/departTreeUpdate',Tdata).then(function (response) {
					var data = response.data;
					if(data.success){
						$('.editSave').remove();
						$('.editCancel').remove();
						ywjgs.initYWJG(null,null,pId);
						editName = true;
					}else{
						_this.infoModalText = data.errorMessage;
						_this.dropMessage = true;// 显示确认弹框
						editName = false;
					}
				});
			};
			//同级向上移动
			ywjgs.upOnSameLevel = function(){
			    //"prev"：成为同级前一个节点，"next"：成为同级后一个节点
			    //获取当前树
			    var zTree = $.fn.zTree.getZTreeObj("bussinessTree");
			    var nodes = zTree.getSelectedNodes();
			    var treeNode = nodes[0];//当前选中节点
			    if(!treeNode||!treeNode.id){
			        _this.infoModalText = '请选择一个节点！';
			        _this.infoModal = true;
			        return;
			    }
			    var id = treeNode.id;//当前选中节点的id\
			    var preId = '';//前面节点的id
			    var node = treeNode.getPreNode();
			    if(!node||node.length<0){//如果为空则说明，此节点在同级是最上面
			        return;
			    }
			    preId = node.id;//前面节点id
			    zTree.moveNode(node, treeNode, "prev");//在同级内往上移动
			    var para = {};
			    para.targetDepartmentId = preId;
			    para.sourceDepartmentId = id;
			    $.ajax({
			        type: 'post',
			        data:para,
			        url: contextPath+'/sspOrganization/moveDepartment.do' ,
			        success: function(data){
			
			        } ,
			        dataType: 'json'
			    });
			}
			//同级向下移动
			ywjgs.downOnSameLevel = function(){
			    //"prev"：成为同级前一个节点，"next"：成为同级后一个节点
			    //获取当前树
			    var zTree = $.fn.zTree.getZTreeObj("bussinessTree");
			    var nodes = zTree.getSelectedNodes();
			    var treeNode = nodes[0];//当前选中节点
			    if(!treeNode||!treeNode.id){
			        _this.infoModalText = '请选择一个节点！';
			        _this.infoModal = true;
			        return;
			    }
			    var id = treeNode.id;//当前选中节点的id
			    var nextId = '';//下个节点id
			    var node = treeNode.getNextNode();
			    //alert("cur"+id+",hou"+nextId);
			    if(!node||node.length<0){//如果为空则说明，此节点在同级是最下面
			        return;
			    }
			    nextId = node.id;
			    zTree.moveNode(node, treeNode, "next");//在同级内往下移动
			    var para = {};
			    para.targetDepartmentId = nextId;
			    para.sourceDepartmentId = id;
			    $.ajax({
			        type: 'post',
			        data:para,
			        url: contextPath+'/sspOrganization/moveDepartment.do' ,
			        success: function(data){} ,
			        dataType: 'json'
			    });
			}
			//左移提高等级
			ywjgs.leftToUpLevel = function(){
			    //"prev"：成为同级前一个节点，"next"：成为同级后一个节点
			    //获取当前树
			    var zTree = $.fn.zTree.getZTreeObj("bussinessTree");
			    var nodes = zTree.getSelectedNodes();
			    var treeNode = nodes[0];//当前选中节点
			    if(!treeNode||!treeNode.id){
			        _this.infoModalText = '请选择一个节点！';
			        _this.infoModal = true;
			        return;
			    }
			    var id = treeNode.id;//当前选中节点的id
			    var nextId = '';//下个节点id
			    var pNode = zTree.getNodeByParam("id", treeNode.pId, null);//父节点
			    if(!pNode){//如果父节点为空就返回
			        return;
			    }
			    var gpNode = zTree.getNodeByParam("id", pNode.pId, null);//爷爷节点
			    if(!gpNode){//如果爷爷节点为空就返回
			        return;
			    }
			    zTree.moveNode(gpNode, treeNode, "inner");
			    var para = {};
			    para.id = id;
			    $.ajax({
			        type: 'post',
			        data:para,
			        url: contextPath+'/sspOrganization/uplevelSspOrganization.do' ,
			        success: function(data){
			            var a_nextNode = pNode.getNextNode();
			            var w = 0;
			            while(true){
			                if(!a_nextNode){
			                    break;
			                }
			                w++;
			                a_nextNode = a_nextNode.getNextNode();
			            }
			            w--;
			            while(true){
			                if(!w){//为0的时候退出
			                    break;
			                }
			                //同级向上移动
			                ywjgs.upOnSameLevel();
			                w--;
			            }
			        } ,
			        dataType: 'json'
			    });
			}
			//右移降低等级
			ywjgs.rightToDownLevel = function(){
			    //"inner"：成为子节点
			    //获取当前树
			    var zTree = $.fn.zTree.getZTreeObj("bussinessTree");
			    var nodes = zTree.getSelectedNodes();
			    var treeNode = nodes[0];//当前选中节点
			    if(!treeNode||!treeNode.id){
			        _this.infoModalText = '请选择一个节点！';
			        _this.infoModal = true;
			        return;
			    }
			    var id = treeNode.id;//当前选中节点的id
			    var nextId = '';//下个节点id
			    //var node = treeNode.getNextNode();
			    var node = treeNode.getPreNode();
			    //alert("cur"+id+",hou"+nextId);
			    if(!node||node.length<0){//如果为空则说明，此节点在同级是最下面
			        return;
			    }
			    nextId = node.id;
			    zTree.moveNode(node, treeNode, "inner");//在同级内往下移动
			    var para = {};
			    para.id = id;
			    $.ajax({
			        type: 'post',
			        data:para,
			        url: contextPath+'/sspOrganization/downlevelSspOrganization.do' ,
			        success: function(data){},
			        dataType: 'json'
			    });
			}
			//移动节点
			ywjgs.moveNode = function(){
				var treeObj = $.fn.zTree.getZTreeObj("tree");
				var nodes = treeObj.getNodes();
				treeObj.moveNode(nodes[0], nodes[1], "inner");
			};
			ywjgs.saveChange = function(o){//保存拖动
				let obj = {
					"changeLevelMap" : JSON.stringify(o)
				};
				// obj = JSON.stringify(obj);
				_this.$http.post(contextPath+'/updateParentName',obj).then(function (response) {
					let data = response.data;
					if(data.success){
						Drive = false;
						dragArr = [];
						drageDouble = true;
						_this.saveLevelChange(Drive);
						_this.dragReset(true);

						_this.infoModalText = '保存成功！';
			        	_this.dropMessage = true;

						setTimeout(()=>{
							ywjgs.initYWJG();
						},1000)
						
						
					}else{
						_this.infoModalText = data.errorMessage;
			        	_this.dropMessage = true;
						_this.dragReset(true);
						drageDouble = true;
						dragArr = [];
						setTimeout(()=>{
							ywjgs.initYWJG();
						},1000)
					}
				});
			};
			
			_this;
			ywjgs.initYWJG();

			// 点击新增保存，点击修改保存

            _this.$bus.$on('addOrEditEvent',function(data){
                if(data){
                    console.log(data, '刷新列表需要展开的节点');
                    ywjgs.initYWJG(null,null,data);
                }
            })
		  /*_this.$on('onItemAdded', function (text) {
                ywjgs.addBusinessDepartment(text);
            });*/
            _this.$on('reset', function (o) {//点击重置
                ywjgs.initYWJG();
            });
            _this.$on('treeSarch', function (o) {//点击查询
                if(o.treeSarch){
                	ywjgs.initYWJG(o.searchTreeDepart,null,null);
                }
            });
            _this.$on('prev',function(o){
            	 if(o.treeSarch){
            	 	ywjgs.showNodeSearched(o.index);
                	//ywjgs.initYWJG(o.searchTreeDepart,o.index,null);
                }
            });

			 _this.$on('next',function(o){
            	 if(o.treeSarch){
            	 	ywjgs.showNodeSearched(o.index);
                	//ywjgs.initYWJG(o.searchTreeDepart,o.index,null);
                }
            });
			/*_this.$on('onItemRenamed', function () {
				ywjgs.editBusinessDepartment(renameModalId, renameModalNewName);
			});*/
			
			_this.$on('onItemDeleted', function () {
				ywjgs.deleteBusinessDepartment();
			});

			// 添加人员或部门
			_this.$on('man_ok', function (parentNode ,nodeName,sourceId,type) {
				ywjgs.addNodes(parentNode ,nodeName,sourceId,type);
			});
			
			/*_this.$on('onTop', function () {
                ywjgs.upOnSameLevel();
            });
			
			_this.$on('onLeft', function () {
				ywjgs.leftToUpLevel();
			});
			
			_this.$on('onRight', function () {
				ywjgs.rightToDownLevel();
			});
			
			_this.$on('onButtom', function () {
				ywjgs.downOnSameLevel();
			});*/
			_this.$on('saveChange', function () {
				ywjgs.saveChange(dragArr);
			});
			_this.$on('canDrive', function (o) {//拖动
				Drive = o;
				if(o == false){
					ywjgs.initYWJG();
					drageDouble = true;
					dragArr = [];
				}
			});
		})	
		
	},
	unbind: function () {
        $.fn.zTree.destroy('bussinessTree');
	}
};
