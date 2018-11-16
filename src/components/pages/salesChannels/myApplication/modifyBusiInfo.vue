<!-- 变更业务信息-详情 -->
<template>
    <div class="modifyBusiInfo" >
        <!-- 申请事项 -->
        <headerInfo :info="info" />

        <!--申请原因-->
        <applicationReason :info="info" />

        <common-title title="店面信息">
            <storeInfo :pid="shopId" :channelId="channelId"></storeInfo>
        </common-title>

        <commonTitle title="合作信息">
            <cooperationInfo ref="cooperationInfo_ref" :value.sync="cooperationInfo_model"  :edit="false" type="changeBusiness"></cooperationInfo>
        </commonTitle>

        <commonTitle title="车源信息">
            <carSourceInfo ref="carSourceInfo_ref" :value.sync="carSourceInfo_model" :edit="false" type="changeBusiness"></carSourceInfo>
        </commonTitle>

        <commonTitle title="收款信息">
            <collectionInfoTable :pid="channelId" :workFlowId="obj.workFlowId" type="changeBusiness" />
        </commonTitle>

        <commonTitle title="审批记录">
            <ApprovalTable :workFlowId="obj.workFlowId" />
        </commonTitle>

        <dynamicButtons :pid="shopId" :channelId="channelId"  :obj="obj" closeName="modifyBusiInfo"/>  
       
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
                submitObj:{},

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

                    // 历史值
                    subjectValue_old:[],
                    cooperativeName_old:[],
                    isFloat_old:'',
                    companyName_old:'',

                },

                // 车源信息
                carSourceInfo_model:{
                    filedArr:[],
                    brandList:[],
                    brandType:'',

                    // 历史值
                    brandType_old:'',
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
                    workFlowId: this.obj.workFlowId,
                }
                this.$http.post('/channelWfpt/applyInfo', params).then(resp=>{
                    if(resp.data.success){
                        this.info = resp.data.data;
                        this.shopId = this.info.shopId;
                        this.channelId = this.info.channelId;

                        this.getOne();
                    }
                })
            },
            // 获取第一步
            getOne(){
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
                        this.returnOne();

                    }
                })
            },
            returnOne(){
                let json = {
                    workFlowId: this.obj.workFlowId
                }
                this.$http.post('/tbChannelBusiness/getChannelBusinessApp',json).then(resp => {
                    if (resp.data.success) {
                        this.shopId = resp.data.data.shopId;
                        this.submitObj = resp.data.data;


                        // 历史信息
                        if(this.submitObj.oldValue){
                            let oldValue = this.submitObj.oldValue;
                           
                            this.cooperationInfo_model.subjectValue_old = oldValue.secondSubject? [oldValue.firstSubject? oldValue.firstSubject: this.submitObj.firstSubject, oldValue.secondSubject] : [];
                            this.cooperationInfo_model.cooperativeName_old = oldValue.cooperationName? oldValue.cooperationName.split(','): [];
                            this.cooperationInfo_model.isFloat_old = oldValue.evaluationValueFloat? oldValue.evaluationValueFloat: '';
                            this.cooperationInfo_model.companyName_old = oldValue.branchCompanyName? oldValue.branchCompanyName: '';
                            this.carSourceInfo_model.brandType_old = oldValue.unlimitBrand? oldValue.unlimitBrand: '';

                            this.cooperationInfo_model.filedArr.map(item => {
                                item.defaultValueList_old = oldValue[item.code]? oldValue[item.code].split(',') : [];
                            })
                            this.carSourceInfo_model.filedArr.map(item => {
                                item.defaultValueList_old = oldValue[item.code]? oldValue[item.code].split(',') : [];
                            })
                        }

                        this.cooperationInfo_model.subjectValue = [this.submitObj.firstSubject,this.submitObj.secondSubject];
                        this.cooperationInfo_model.cooperativeValue = this.submitObj.cooperationCode? this.submitObj.cooperationCode.split(','): [];
                        this.cooperationInfo_model.cooperativeName = this.submitObj.cooperationName? this.submitObj.cooperationName.split(','): [];
                        this.cooperationInfo_model.isFloat = this.submitObj.evaluationValueFloat;
                        this.cooperationInfo_model.companyName = this.submitObj.branchCompanyName;
                        this.cooperationInfo_model.company = this.submitObj.branchCompanyCode;
                        this.cooperationInfo_model.startDate = this.submitObj.busiStartDate;
                        this.cooperationInfo_model.timesType = '1';
                        this.cooperationInfo_model.endDate = this.submitObj.busiEndDate;
                        this.carSourceInfo_model.brandType = this.submitObj.unlimitBrand;

                        this.cooperationInfo_model.filedArr.map(item => {
                            item.defaultValueList = this.submitObj[item.code]? this.submitObj[item.code].split(',') : []
                        })

                        this.carSourceInfo_model.filedArr.map(item => {
                            item.defaultValueList = this.submitObj[item.code]? this.submitObj[item.code].split(',') : []
                        })

                        this.cooperationInfo_model.filedArr = this.cooperationInfo_model.filedArr.filter(item => {
                            return item.defaultValueList.length > 0
                        })

                        this.carSourceInfo_model.filedArr = this.carSourceInfo_model.filedArr.filter(item => {
                            return item.defaultValueList.length > 0
                        })

                        if(this.carSourceInfo_model.brandType === '0' && this.submitObj.channelBusinessCarDTOList.length > 0){
                            this.carSourceInfo_model.brandList = [];
                            this.submitObj.channelBusinessCarDTOList.map(item => {
                                this.carSourceInfo_model.brandList.push({
                                    brand: [item.mastbrandId,item.makeId],
                                    brandName: [item.mastbrand,item.make],
                                    time: [item.startDate,item.endDate],
                                    img: item.channelAttachmentDto,
                                    timeFlag: item.unlimited === '1' ? true : false,
                                    oldValue: item.oldValue || {},
                                    flag: item.operateType,
                                })
                            })
                        }
                        if(this.submitObj.cashDeposit){
                            this.marginDeliveryShow = true;
                            this.$nextTick(()=>{
                                this.marginDelivery_model.money = this.submitObj.cashDeposit + '';
                                this.marginDelivery_model.img = this.submitObj.cashDepositAttachment;
                            })
                            
                        }

                        // 判断拓展模块 -租赁代理评级 显示
                        this.rentLevel = this.submitObj.rentLevel;

                        console.log( this.submitObj.channelBusinessCarDTOList,'+++++++++++')


                    }
                })
            },

        },
        mounted(){

            // TODO 参数修改
            this.obj = Object.assign({},this.$attrs.params);
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
