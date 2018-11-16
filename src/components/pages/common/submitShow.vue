<!-- 提交页面 -->
<template>
<div class="text-center" style="padding-top:50px">
    <div class="inline-block" >
        <Icon type="md-list-box" style=" vertical-align: inherit;" size="60"/>
    </div>
    <div class="inline-block" >
        <h2>恭喜！您的申请已成功提交！</h2>
        <span>您可以随时在 <a @click="myList">我的申请</a> 页面查看详细申请进度！</span>
        
    </div>
    <br>
    <div>
            <Button  size="large" @click="back" class="marginR10">返回列表</Button>
            <Button type="primary" size="large" @click="show">查看详情</Button>
    </div>
</div>
</template>

<script>
    export default {
        props: {
    
           
        },
        data() {
            return {
                obj: {},
                pageList:{
                  'applyAddNew': '新建渠道',
                  'startOrstopBusiness': '停用启用业务',
                  'modifyBusiInfo': '变更业务信息',
                  'modifyStoreInfo': '修改店面信息',
                  'editCooperationTerm': '修改合作期限',
                  'rentalAgent': '租赁代理升级',
                  '007': '',
                  'editReupload': '驳回重传打款凭证',
                },
            }
        	
        },
        watch:{
         
        },
        methods: {
            back(){
                
                this.$bus.$emit("myChannel", {id:"myChannel",name:"我的渠道", closeName:'submitShow', refresh:true});
            },

            // 查看详情
            show(){
                let name = this.obj.openTo;
                let cname = this.pageList[this.obj.openTo] + '详情'; 
                this.obj.type = 'apply';
                this.$bus.$emit(name, {id:name, name:cname, closeName:'submitShow', refresh:true, params: this.obj });
                
                
            },
            // 我的申请
            myList(){
                this.$bus.$emit("myApplication", {id:"myApplication",name:"我的申请",closeName:'submitShow', refresh:true});
            },

        },
        mounted(){
                
	       this.obj = Object.assign({},this.$attrs.params);
        }

    } 
</script>




