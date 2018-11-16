<!-- 租赁代理升级-详情 -->
<template>
    <div class="" >
        <!-- 申请事项 -->
        <headerInfo :info="info" />

        <applicationReasonUpdate :info="info" />

        <common-title title="店面信息">
            <storeInfo :pid="shopId" :channelId="channelId"></storeInfo>
        </common-title>

        <commonTitle title="合作信息">
            <cooperationInfo ref="cooperationInfo_ref" :value.sync="cooperationInfo_model" :edit="false" ></cooperationInfo>
        </commonTitle>

        <commonTitle title="保证金交付">
            <marginDelivery ref="marginDelivery_ref" :value.sync="marginDelivery_model" :edit="false"/>
        </commonTitle>


        <commonTitle title="审批记录">
            <ApprovalTable :workFlowId="obj.workFlowId"  />
        </commonTitle>

        <dynamicButtons :pid="shopId" :channelId="channelId"  :obj="obj" closeName="rentalAgent" />  

    </div>
</template>

<script>
    export default {
        name: "",
        data(){
            return {

                obj:{},
                id: "",
                shopId: "",
                channelId: "",
                info: {},

                // 合作信息
                cooperationInfo_model:{
                    subjectArr:[],
                    subjectValue:[],
                    cooperativeValue:[],
                    cooperativeName:[],
                    filedArr:[],
                    isFloat:'',
                    company:'',
                    companyName:'',
                    timesType:'0',
                    startDate:'',
                    endDate:'',
                },

                // 保证金
                marginDelivery_model:{
                    money:'',
                    img:{}
                },
            }
        },
        methods:{
            init_data(){
                let params = {
                    workFlowId: this.id,
                }
                this.$http.post('/channelWfpt/applyInfo', params).then(resp=>{
                    if(resp.data.success){
                        let parentData = resp.data.data
                        this.shopId = parentData.shopId;
                        this.channelId = parentData.channelId;
                        this.getOne(parentData);
                    }
                })
            },
            // 获取第一步
            getOne(parentData){
                let json = {
                    id: this.channelId,
                }
                this.$http.post('/businessConfigure/initBusinessPackage',{id: null}).then(resp => {
                    if (resp.data.success) {
                        let data  = resp.data.data.fieldList;
                        // 渠道科目
                        this.cooperationInfo_model.subjectArr = data.filter(item => {
                            return item.code === 'firstSubject'
                        })

                        // 合作信息其他字段
                        this.cooperationInfo_model.filedArr = data.filter(item => {
                            return item.code !== 'firstSubject' && item.code !== 'guaranteeFlag' && item.code !== 'vehicleType' && item.code !== 'vehicleFrom'
                        })

                        this.carSourceInfo_model.filedArr = data.filter(item => {
                            return item.code === 'vehicleType' || item.code === 'vehicleFrom'
                        })

                        // 返显第一步
                        this.returnOne(parentData);

                    }
                })
            },
            returnOne(parentData){
                let json = {
                    workFlowId: this.id
                }
                this.$http.post('/tbChannelBusiness/getChannelBusinessApp',json).then(resp => {
                    if (resp.data.success) {
                        this.submitObj = resp.data.data;
                        this.info = parentData;
                        this.info.moreInfo = resp.data.data;

                        this.cooperationInfo_model.subjectValue = [this.submitObj.firstSubject,this.submitObj.secondSubject];
                        this.cooperationInfo_model.cooperativeValue = this.submitObj.cooperationCode? this.submitObj.cooperationCode.split(','): [];
                        this.cooperationInfo_model.cooperativeName = this.submitObj.cooperationName? this.submitObj.cooperationName.split(','): [];
                        this.cooperationInfo_model.isFloat = this.submitObj.evaluationValueFloat;
                        this.cooperationInfo_model.companyName = this.submitObj.branchCompanyName;
                        this.cooperationInfo_model.company = this.submitObj.branchCompanyCode;
                        this.cooperationInfo_model.startDate = this.submitObj.busiStartDate;
                        this.cooperationInfo_model.timesType = '1';
                        this.cooperationInfo_model.endDate = this.submitObj.busiEndDate;

                        this.cooperationInfo_model.filedArr.map(item => {
                            item.defaultValueList = this.submitObj[item.code]? this.submitObj[item.code].split(',') : []
                        })

                        this.cooperationInfo_model.filedArr = this.cooperationInfo_model.filedArr.filter(item => {
                            return item.defaultValueList.length > 0
                        })


                        if(this.submitObj.cashDeposit){
                            this.marginDeliveryShow = true;
                            this.$nextTick(()=>{
                                this.marginDelivery_model.money = this.submitObj.cashDeposit + '';
                                this.marginDelivery_model.img = this.submitObj.cashDepositAttachment;
                            })
                            
                        }



                    }
                })
            },

        },
        created(){
            // TODO 参数修改
            this.obj = Object.assign({},this.$attrs.params);
            this.id = this.obj.workFlowId;
            this.init_data();
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
</style>
