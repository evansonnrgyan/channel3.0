<!-- 企业信息列表 -->
<template>
    <div>
        <div >
            <div class="contents" v-for="(params,index) in list" :key="index">
                <Row>
                    <Col span="13">
                        <div class="line">
                            <span class="title">
                                {{params.mainName}}
                            </span>
                            <span>{{params.creditCode}}</span>
                        </div>
                        <!-- <div class="line">
                            <Tag type="border" color="green">体验店</Tag>
                            <Tag type="border" color="#ccc">体验店</Tag>
                            <Tag type="border" color="red">体验店</Tag>
                        </div> -->
                        <div class="line">
                            <Row>
                                <Col span="6">
                                    <Col span="12">
                                        法定代表人:
                                    </Col>
                                    <Col span="12">
                                        {{params.legalPersonName}}
                                    </Col>
                                </Col>
                                <Col span="9">
                                    <Col span="7">
                                        注册资本:
                                    </Col>
                                    <Col span="17">
                                        {{params.registeredCapital? params.registeredCapital + params.registeredCapitalUnit : ''}}
                                    </Col>
                                </Col>
                                <Col span="9">
                                    <Col span="7">
                                        注册时间:
                                    </Col>
                                    <Col span="17">
                                        {{$formatDate(params.busiStartTime)}}
                                    </Col>
                                </Col>
                            </Row>
                        </div>
                        <div class="line">地址信息:{{params.registeredAddress}}</div>
                    </Col>
                    <Col span="11" >
                        <div class="float-right text-center" >

                            <!-- 没有店面 -->
                            <div v-if="!params.count > 0">
                                <div class="line">
                                   尚无店面 
                                </div>
                                <Button type="primary" size="large" @click="addStore(params.id)">新建店面</Button>
                            </div>
                            <!-- 已有店面 -->
                            <div v-else>
                                <div class="line">
                                    <b>
                                        已经有
                                        <span style="color:#127efc">{{params.count}}</span>
                                        家店面
                                    </b>
                                </div>
                                <Button  size="large" @click="showStore(params.id)">查看店面</Button>
                            </div>
                            
                        </div>

                    </Col>
                </Row>
            </div>

            <!-- <Page :total="total" :current="current" :page-size="rowCount" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator size="small"></Page> -->
        </div>
        

    </div>
	
</template>

<script>
    export default {
        props: {
            pid:{
                type:String,
                default:''
            },
            flag:{
                type:Boolean,
                default:false,
            }
        },
        data() {
            return {
                list:[],
                total:0,
                current:1,
                rowCount:10
            }
        },
        watch:{
            pid (newVal){
                if(newVal !== ''){
                    this.getList();
                }
            }
        },
        methods: {
            // 新建店面
            addStore(id){
                this.$emit('addStore',id);
            },
            // 查看店面
            showStore(id){
                this.$emit('showStore',id);
            },
            // 获取企业信息列表
            getList() {

                let json = {
                    "mainName": this.pid,
                    "current": this.current,
                    "rowCount": this.rowCount,
                }
                this.$http.post("/tbChannelMainInfo/fuzzyQuery", json).then((resp) => {
                    if (resp.data.success) {
                        let data = resp.data.data;
                        this.list = data.data;
                        this.total = data.total;
                        this.rowCount = data.rowCount;
                    }
                    this.$emit('update:flag',false)
                })
            },
            change_page(c){
                this.current = c;
                this.getList();
            },
            change_page_size(p){
                this.current = 1;
                this.rowCount = p;
                this.getList();
            },
           
        }

    } 
</script>
<style type="text/css" scoped>
    .contents{
        border-bottom: 1px dashed #ededed;
        padding-bottom: 15px;
        margin-bottom: 15px;
    }
    .line{
        line-height: 2.3
    }
    .title{
        font-size: 16px;
        font-weight: bold
    }
</style>



