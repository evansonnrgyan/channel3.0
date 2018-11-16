<!-- 下属店面列表 -->
<template>
    <div>
        <div class="content_under" v-for="(params,index) in list" :key="index">
            <Row>
                <Col span="18">
                    <div class="line">
                        <span class="title">
                            {{params.shopName}}
                        </span>
                    </div>
                    <div class="line">
                        <Tag v-for="item in params.businessConfigModelNames" type="border" :key="item.id" :color="returnColor(item.busiStatus)">{{item.businessModelName}}</Tag>
                    </div>
                    <div class="line">
                        <span>{{params.province}}</span>
                        <span>{{params.city}}</span>
                        <span>{{params.district}}</span>
                        <span>{{params.detailAddress}}</span>
                        
                    </div>
                    <div class="line">主体名称：{{params.mainName}} <span class="displayNo color-click" style="margin-left:15px;">查看详情>></span></div>
                </Col>
                <Col span="6" >
                    <div  >
                        <span>可选业务：</span>
                        <div>
                            <Tag v-for="item in params.hasRoleModelNames" :key="item.id" type="border" color="primary" @click.native="goSteps(item.id,params.id)">{{item.businessModelName}}</Tag>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
    
            
    	
</template>

<script>
    export default {
        props: {
            list:{
                type:Array,
                default:[]
            }
        },
        data() {
            return {
                
            }
        },
        
        methods: {
            goSteps(id,shopId){
                this.$emit('goSteps',id,shopId);
            },
            returnColor(status){
                if(status === '050200000'){
                    return 'success'
                }else
                if(status === '050200004'){
                    return 'default'
                }else
                if(status === '050200001' || status === '050200002'){
                    return 'error'
                }
            },
            
            
           
        },
        mounted(){
            
        }

    } 
</script>
<style type="text/css" scoped>
    .content_under{
        border-bottom: 1px dashed #ededed;
        padding-bottom: 15px;
        margin-bottom: 15px
    }
    .line{
        line-height: 2.3
    }
    .title{
        font-size: 16px;
        font-weight: bold
    }
</style>



