<!-- 渠道管理 查看-渠道详情 -->
<template>
    <div >
        <!-- 店面信息 -->
        <commonTitle title="店面信息">
            <storeInfo :pid="shopId" :channelId="channelId"></storeInfo>
        </commonTitle>
        <div >

            <div class="lineDiv"></div>

            <!-- 状态组件 -->
            <approvalStatus :value="approvalObj" :pid="channelId"></approvalStatus>


            <div class="lineDiv"></div>

            <Tabs :animated="false" @on-click="handleTabClick" class="showDiv">
                <TabPane v-for="item in tabsList" :key="item.key" :label="item.title" class="padding-15-30">
                    <component v-if="item.index == index" :is="item.key" :params="channelId" :pid="channelId" :edit="item.edit" />
                </TabPane>
            </Tabs>



        </div>
        <poFooter>
            <Button v-if="editShopFlag" type="primary" size="large" @click="editShop">修改店面信息</Button>
            <Button v-if="changeStatusFlag" type="primary" size="large" @click="changeStatus">变更渠道状态</Button>
        </poFooter>
    </div>
</template>

<script>
    export default {
        name: "",
        data () {
            return {

                // 拷贝参数
                obj:{},

                channelId: '',
                shopId: '',

                editShopFlag: false,
                changeStatusFlag: false,


                tabsList:[
                    {
                        title: "展业信息",
                        key: "totalInfo",
                        index: 0,
                        edit: true,
                    },
                    {
                        title: "收款信息",
                        key: "billingInfo",
                        index: 1,
                        edit: false,
                    },
                    {
                        title: "账号管理",
                        key: "accountManagement",
                        index: 2,
                        edit: false,
                    },
                    {
                        title: "联系人",
                        key: "contactInfo",
                        index: 3,
                        edit: false,
                    },
                    {
                        title: "负责员工",
                        key: "employee",
                        index: 4,
                        edit: true,
                    },
                    {
                        title: "附件",
                        key: "annex",
                        index: 5,
                        edit: false,
                    },
                    {
                        title: "操作日志",
                        key: "optionLog",
                        index: 6,
                        edit: false,
                    }
                ],
                index:0,
                approvalObj:{},





            }
        },
        methods: {

            handleTabClick(index){
                this.index = index;
            },
            // 修改店面信息
            editShop(){
              this.$bus.$emit("storeInfoEdit",{id: "storeInfoEdit", isShow:true, name:"修改店面信息", refresh:true,params:{ type:'new', channelId: this.channelId ,shopId:this.shopId}})
            },
            // 变更渠道状态
            changeStatus() {
                this.$bus.$emit("runOrStopChannel",{id: "runOrStopChannel", isShow:true, name:"变更渠道状态", refresh:true,params:{ type:'new', channelId: this.channelId ,shopId:this.shopId}})
            },

            // 动态按钮
            returnBtns(){

                let arr = [
                    {"system":"channel3","page":"channelViewInfo","element":"editShopButton"},  //修改店面信息
                    {"system":"channel3","page":"channelViewInfo","element":"changeStatusButton"} //变更渠道状态
                ];

                this.$ajax.post('/user/permissions?t='+new Date().getTime(),arr).then(resp => {
                    if (resp.data.success) {
                        this.editShopFlag = resp.data.data.editShopButton || false;
                        this.changeStatusFlag = resp.data.data.changeStatusButton || false;
                    }
                })
            },

            // 返显第一步
            returnOne(){
                let json = {
                    id: this.channelId,
                }
                this.$http.post('/tbChannelBusiness/getChannelBusiness',json).then(resp => {
                    if (resp.data.success) {
                        let data = resp.data.data;
                        this.shopId = data.shopId;

                        this.approvalObj = data;
                    }
                })
            },

        },

        mounted(){

            this.obj = Object.assign({},this.$attrs.params);
            console.log(this.obj)
            this.channelId = this.obj.id || this.obj.ID;
            this.shopId = this.obj.shopId;
            this.returnOne();
            this.returnBtns();
        }
    }
</script>

<style>

    .padding10{
        padding: 10px 0 10px 0;
    }

    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    {
        position: relative;
        border: 1px solid #ccc;
        left: 146px;
        width: 300px;
    }
    .cancel-approval{
        padding:10px;
        text-align: center;
        background: rgba(255,255,255,0.9)
    }
    .showDiv .ivu-tabs-bar{
        margin: auto 30px;
        border-bottom: 3px solid #e6e9f1 !important;
    }
</style>



