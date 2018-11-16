<!-- 新建渠道步骤 -->
<template>
	<div>

        <!-- 店面信息 -->
         <commonTitle title="店面信息">
                <storeInfo :pid="shopId" :channelId="channelId"></storeInfo>
         </commonTitle>
        
         <div class="lineDiv"></div>
        <div class="user-Steps">
            <Steps :current="current">
                <Step title="业务信息" @click.native="changeStep(0)" :class="{'pointer':current>0}"></Step>
                <Step title="收款信息" @click.native="changeStep(1)" :class="{'pointer':current>1}"></Step>
                <Step title="用户账号信息" @click.native="changeStep(2)" :class="{'pointer':current>2}"></Step>
                <Step title="合作协议及附件" @click.native="changeStep(3)" :class="{'pointer':current>3}"></Step>
            </Steps>
        </div>

        <div v-if="current === 0">

            <!-- 合作信息 -->
            <commonTitle title="合作信息">
                    <cooperationInfo ref="cooperationInfo_ref" :value.sync="cooperationInfo_model" :edit="true" ></cooperationInfo>
            </commonTitle>
           
            <!-- 车源信息 -->
            <commonTitle title="车源信息">
                    <carSourceInfo ref="carSourceInfo_ref" :value.sync="carSourceInfo_model" :edit="true"></carSourceInfo>
             </commonTitle>

            <!-- 业务联系人 -->
            <commonTitle title="业务联系人">
                    <businessPerson ref="businessPerson_ref" :value.sync="businessPerson_model" :edit="true"></businessPerson>
             </commonTitle>

             <commonTitle title="保证金交付" v-if="marginDeliveryShow">
                    <marginDelivery ref="marginDelivery_ref" :value.sync="marginDelivery_model" :edit="true"></marginDelivery> 
             </commonTitle>

        </div>

        <div v-if="current === 1" style="padding:20px 30px">

            <!-- 收款银行卡 -->
            <cardList :pid="channelId" :value.sync="cardList" :isEdit="true" @reload="getTwo" :shopId="shopId" :subjectValue="cooperationInfo_model.subjectValue"></cardList>
            
        </div>

        <div v-if="current === 2">

            <!-- 主管账号 表格 -->
            <commonTitle title="主管账号" v-if="satrapUserTableFlag">
                 <satrapUserTable  :value.sync="satrapUserTable_model"></satrapUserTable>
                 <div class="color-tip">注：主管账号将自动获得本次申请权限，无需手工设置</div>
            </commonTitle>
           

        	<!-- 主管账号 表单   -->
        	<commonTitle title="主管账号" v-else>
                 <satrapUser ref="satrapUser_ref" :pid="channelId" :value.sync="satrapUser_model" :edit="true"></satrapUser>
            </commonTitle>
            
            
        </div>

        <div v-if="current === 3">
            
            <!-- 上线资料  -->
            <commonTitle title="上线资料">
                <div @click="goto" style="padding: 0 10px 0 0;float:right;color: #2d8cf0;cursor: pointer; position: relative; z-index:100">合同小助手已上线，点击体验>></div>
                <filesForm ref="filesForm_ref" :value.sync="filesForm_model" :edit="true"></filesForm>
            </commonTitle>

            <!-- 其他资料 -->
            <commonTitle title="其他资料（最多10个）" v-if="otherFile_flag">
                <otherAttachments :value.sync="otherAttachments_model" attachmentCode="0000000034" :edit="true"></otherAttachments>
            </commonTitle>
            
        </div>

        <poFooter  v-if="obj.type === 'reject'">
            <Button v-if="current < 3" type="primary" size="large" @click="next(true)">下一步</Button>
            <Button :loading="loading" v-if="current === 3" v-for="item in btnsList" type="primary" size="large" @click="clickFn(item)">{{item.displayName}}</Button>
        </poFooter>

        <poFooter v-else>
            <Button :loading="loading_save" size="large" @click="next(false)">保存</Button>
            <Button :loading="loading" type="primary"  size="large" @click="next(true)">{{nextText}}</Button>
        </poFooter>

    </div>
</template>

<script>
    export default {
        name:'channelSteps',
        data() {
            return {
                // 渠道ID
                channelId: '',

                // channelCode
                channelCode:'',

                nextText: '下一步',

                otherFile_flag:false,

                current: 0,
                addCardFlag: false,

                satrapUserTableFlag: false,
                satrapUserTable_model: [],

                cardList:[],

                loading:false,
                loading_save:false,


                // 合作信息
                cooperationInfo_model:{
                    subjectArr:[],
                    subjectValue:[],
                    cooperativeValue:[],
                    cooperativeValue_single: '',
                    cooperativeName:[],
                    filedArr:[],
                    isFloat:'',
                    company:'',
                    companyName:'',
                    timesType:'0',
                    startDate:'',
                    endDate:'',
                },

                // 车源信息
                carSourceInfo_model:{
                     filedArr:[],
                     brandList:[]
                },

                // 业务联系人
                businessPerson_model:{},

                // 保证金
                marginDelivery_model:{
                    money:'',
                    img:{}
                },

                // 主管用户
                satrapUser_model:{},

                // 上线资料
                filesForm_model:{
                    list:[]
                },

                // 其他附件
                otherAttachments_model:{
                    list:[]
                },

                obj:{},

                marginDeliveryShow:false,

                busiConfigId:'',
                shopId:'',
                submitObj:{},
                nextFlag:false,
                returnOneFlag: false,
                returnFourFlag: false,

                btnsList:[],
                currentBtn:{},
                satrapFlag:false,

                // 返显主管账号标识
                returnSatrapUser_model:false,

                // 动态字段
                AllfieldList: [],
                
            }
        },
        watch:{
            current(newVal){
                this.nextText = '下一步';

                if(newVal === 0){

                    this.getOne(); 

                }else
                if(newVal === 1){

                    this.getTwo();

                }else 
                if(newVal === 2){
                  
                    this.getThree();

                }else
                if(newVal === 3){
                    this.getFour();
                    this.nextText = '提交';
                }
            }
        },
        methods: {

            // 切换step步骤条
            changeStep(index){
                if(this.current > index){
                    this.current = index
                }else{
                    return
                }
            },
            resetFn(){},
            searchFn(){},

            addCard(){
                this.addCardFlag = true
            },
            next(nextFlag){

                this.nextFlag = nextFlag;

                // 保存第一步
                if(this.current === 0){

                    if(this.marginDeliveryShow){


                        Promise.all([this.$refs['cooperationInfo_ref'].handleSubmit(),this.$refs['carSourceInfo_ref'].handleSubmit(),this.$refs['businessPerson_ref'].handleSubmit(),this.$refs['marginDelivery_ref'].handleSubmit()]).then((data)=>{
                           
                            this.saveOne();
                       
                        }).catch((error) => {

                          this.$Message.error('表单验证失败')

                        })
                     
                    }else{

                        Promise.all([this.$refs['cooperationInfo_ref'].handleSubmit(),this.$refs['carSourceInfo_ref'].handleSubmit(),this.$refs['businessPerson_ref'].handleSubmit()]).then((data)=>{
                           
                            this.saveOne();
                       
                        }).catch((error) => {

                          this.$Message.error('表单验证失败')

                        })

                    }
                    
                }else
                // 保存第二步
                if(this.current === 1){

                    if(this.cardList.length > 0){
                        this.$Message.success('保存成功！')
                        if(this.nextFlag){
                            this.current = 2;
                        }
                    }else{
                        this.$Message.error('请添加收款信息！')
                    }
                    
                }else
                // 保存第三步
                if(this.current === 2){

                    if(this.satrapFlag){

                        this.$Message.success('保存成功！')
                        this.current = 3;

                    }else{

                        Promise.all([this.$refs['satrapUser_ref'].handleSubmit()]).then((data)=>{
                           
                            this.saveThree();
                       
                        }).catch((error) => {

                          this.$Message.error('表单验证失败')

                        })

                    }

                }else
                // 保存第四步
                if(this.current === 3){

                    if(this.filesForm_model.list.length > 0){
                        Promise.all([this.$refs['filesForm_ref'].handleSubmit()]).then((data)=>{
                           
                            this.saveFour();
                       
                        }).catch((error) => {

                          this.$Message.error('表单验证失败')

                        })
                    }else{
                        this.$Message.success('保存成功！')
                        this.returnFourFlag = true;

                        if(this.nextFlag){
                            this.loading = true;
                            this.loading_save = true;
                            this.submitFn();
                        }
                    }

                    
                }

            },

            // 加载银行信息列表
              getTwo(){
              
                let url,json;
                if(this.obj.type === 'new' || this.obj.type === 'edit'){
                  url = "/bank/account/getBankAccountList";
                  json = {
                      channelId: this.channelId,
                  } 
                }else
                if(this.obj.type === 'reject'){
                  url = "/bank/account/getBankAccountAppList";
                  json = {
                    channelId: this.channelId,
                    workFlowId: this.obj.workFlowId,
                  }
                } 

                 this.$http.post(url, json).then((resp)=>{
                    if(resp.data.success){
                        let data = resp.data.data;
                        data.map(item => {
                            item.closeFlag = true;
                            item.enabledBoolean = true;
                        })

                        this.cardList = data;
                    };
                  })
              },
            // 获取第三部 
            getThree(){
                let json = {
                    channelId: this.channelId
                };
                this.$http.post('/user/account/getManagerById',json).then(resp => {
                    if (resp.data.success) {

                    	let data = resp.data.data;

                        this.satrapUser_model.roleCode = this.$roleCode;

                    	if(data){

                    		this.returnSatrapUser_model = true;

                    		// 返显 表单格式
	                    	if(data.state === '1011001' || data.state === '1013001'){
	                    		this.satrapUserTableFlag = false;
	                            this.satrapFlag = false;

	                            this.satrapUser_model.name = data.employeeName;
	                            this.satrapUser_model.user = data.userName.substring(4,data.userName.length);
	                            this.satrapUser_model.sex = data.sex;
	                            this.satrapUser_model.roleCode = data.roleIds;
	                            this.satrapUser_model.phone = data.telephone;
	                            this.satrapUser_model.email = data.email;

	                    	}else
	                    	// 列表格式
	                    	if(data.state === '1015001'){
	                    		this.satrapUserTableFlag = true;
	                            this.satrapFlag = true;
	                            this.satrapUserTable_model = [data];
	                    	}
                    	}else{
                    		this.satrapUserTableFlag = false;
	                        this.satrapFlag = false;

	                        this.returnSatrapUser_model = false;
                    	}
                    }
                })
            },
            // 提交发起流程
            submitFn(){
                
                let json = {
                    channelId: this.channelId,
                    buttonId: this.currentBtn.btnId || null,
                    taskId: this.currentBtn.taskId || null,
                };
                this.$http.post('/channelAdmittance/channelAdmittanceCommit',json).then(resp => {
                    if (resp.data.success) {
                        this.$Message.success('提交成功！');

                        let workFlowId = resp.data.data;

                        // 跳转提交页
                        this.$bus.$emit("submitShow", {id:"submitShow",name:"提交成功",closeName:'channelSteps', refresh:true, params:{channelId: this.channelId, workFlowId: workFlowId, openTo:'applyAddNew'}});

                    }

                    this.loading = false;
                    this.loading_save = false;
                })
            },
            // 保存第四部
            saveFour(){

                this.loading = true;
                this.loading_save = true;
                
                let newArr = this.filesForm_model.list.map(item => {
                    return item.img
                })

                let json = {
                 channelId: this.channelId,
                 attachmentList: [...newArr,...this.otherAttachments_model.list]
                }


                this.$http.post('/channelDatumController/saveChannelDatum',json).then(resp => {
                    if (resp.data.success) {
                        
                        this.returnFourFlag = true;

                        if(this.nextFlag){
                            this.submitFn();
                        }else{
                            this.$Message.success('保存成功！');

                            this.loading = false;
                            this.loading_save = false;
                        }
                    }else{
                        this.loading = false;
                        this.loading_save = false;
                    }

                    
                })
            },
            // 保存第三部
            saveThree(){

                this.loading_save = true;

                let json = {
                 "employeeName":this.satrapUser_model.name,
                 "userName": 'kehu' + this.satrapUser_model.user,
                 "telephone":this.satrapUser_model.phone,
                 "email":this.satrapUser_model.email,
                 "channelId":this.channelId,
                 "sex": this.satrapUser_model.sex,
                 "roleIds": this.satrapUser_model.roleCode,
                }

                let url;

                if(this.returnSatrapUser_model){
                	url = '/user/account/updateManager';  // 更新
                }else{
                	url = '/user/account/creatManager';		//新增   
                }

                this.$http.post(url, json).then(resp => {
                    if (resp.data.success) {
                        this.$Message.success('保存成功！');
                        this.satrapFlag = true;
                        
                        if(this.nextFlag){
                            this.current = 3;
                            
                        }
                    }

                    this.loading_save = false;
                })
            },

            // 保存第一步
            saveOne(){

                this.loading_save = true;

                let json = {
                    firstSubject: this.cooperationInfo_model.subjectValue[0],
                    secondSubject: this.cooperationInfo_model.subjectValue[1],
                    cooperationCode: this.cooperationInfo_model.subjectValue[1] === '0497000300000'? this.cooperationInfo_model.cooperativeValue.join(',') : this.cooperationInfo_model.cooperativeValue_single,
                    cooperationName: this.cooperationInfo_model.cooperativeName.join(','),
                    evaluationValueFloat: this.cooperationInfo_model.isFloat,
                    branchCompanyName: this.cooperationInfo_model.companyName,
                    branchCompanyCode: this.cooperationInfo_model.company,
                    busiStartDate:this.cooperationInfo_model.startDate,
                    busiEndDate: this.cooperationInfo_model.endDate,
                    unlimitBrand: this.carSourceInfo_model.brandType,
                    channelBusinessCarDTOList: [],
                    contacterInfoDto: {
                        name: this.businessPerson_model.name,
                        positionCode: this.businessPerson_model.job,
                        phone: this.businessPerson_model.phone,
                        email: this.businessPerson_model.email,
                    },
                }

                this.cooperationInfo_model.filedArr.map(item => {
                    json[item.code] = item.defaultValueList.join(',')
                })
                this.carSourceInfo_model.filedArr.map(item => {
                    json[item.code] = item.defaultValueList.join(',')
                })

                if(this.carSourceInfo_model.brandType === '0'){
                    this.carSourceInfo_model.brandList.map(item => {
                        json.channelBusinessCarDTOList.push({
                            mastbrandId: item.brand[0],
                            mastbrand: item.brandName[0],
                            makeId:item.brand[1],
                            make:item.brandName[1],
                            startDate: this.$formatDate(item.time[0]),
                            endDate:this.$formatDate(item.time[1]),
                            channelAttachmentDto: item.img,
                            unlimited: item.timeFlag? '1' : '0'
                        })
                    })
                }else{
                    json.channelBusinessCarDTOList = [];
                }

                if(this.marginDeliveryShow){
                    json.cashDeposit = this.marginDelivery_model.money * 1;
                    json.cashDepositStatus = '1';
                    json.cashDepositAttachment = this.marginDelivery_model.img;
                }else{
                    json.cashDeposit = null;
                    json.cashDepositStatus = '0';
                    json.cashDepositAttachment = null;
                }

                // 动态字段清空
                this.AllfieldList.map(item => {
                    this.submitObj[item.code] = '';
                })

                this.submitObj = Object.assign(this.submitObj,json)

                this.$http.post('/tbChannelBusiness/saveChannelBusiness',this.submitObj).then(resp => {
                    if (resp.data.success) {
                        this.$Message.success('保存成功！');

                        if(this.nextFlag){
                            this.current = 1;
                            this.returnOneFlag = true;
                        }

                    }
                    this.loading_save = false;
                })
            },

            // 选择业务标签之后
            initChannelBusiness(){
                let json = {
                    shopId: this.obj.shopId,
                    busiConfigId: this.obj.busiConfigId
                } 
                this.$http.post('/tbChannelBusiness/initChannelBusiness',json).then(resp => {
                    if (resp.data.success) {
                        this.channelId = resp.data.data.id;
                        this.shopId = resp.data.data.shopId;
                        this.submitObj = resp.data.data;
                        this.channelCode = this.submitObj.channelCode;
                        this.busiConfigId = this.submitObj.busiConfigId;
                        this.getOne();
                    }
                })
            },

            // 返显第一步数据
            returnOne(){
             
                let url,json;
                if(this.obj.type === 'new' || this.obj.type === 'edit'){
                  url = "/tbChannelBusiness/getChannelBusiness";
                  json = {
                      id: this.channelId,
                  } 
                }else
                if(this.obj.type === 'reject'){
                  url = "/tbChannelBusiness/getChannelBusinessApp";
                  json = {
                    workFlowId: this.obj.workFlowId,
                  }
                } 

                this.$http.post(url,json).then(resp => {
                    if (resp.data.success) {
                        this.shopId = resp.data.data.shopId;
                        this.submitObj = resp.data.data;
                        this.channelCode = this.submitObj.channelCode;
                        this.busiConfigId = this.submitObj.busiConfigId;


                        this.cooperationInfo_model.subjectValue = this.submitObj.firstSubject? [this.submitObj.firstSubject,this.submitObj.secondSubject] : [];

                        // 多选
                        if(this.submitObj.secondSubject === '0497000300000'){
                            this.cooperationInfo_model.cooperativeValue = this.submitObj.cooperationCode? this.submitObj.cooperationCode.split(','):[];

                        // 单选
                        }else{
                            this.cooperationInfo_model.cooperativeValue_single = this.submitObj.cooperationCode;
                        }
                        this.cooperationInfo_model.cooperativeName = this.submitObj.cooperationName? this.submitObj.cooperationName.split(','): [];
                        this.cooperationInfo_model.isFloat = this.submitObj.evaluationValueFloat;
                        this.cooperationInfo_model.companyName = this.submitObj.branchCompanyName;
                        this.cooperationInfo_model.company = this.submitObj.branchCompanyCode;
                        this.cooperationInfo_model.startDate = this.submitObj.busiStartDate;
                        this.cooperationInfo_model.timesType = '1';
                        this.cooperationInfo_model.endDate = this.submitObj.busiEndDate;
                        this.carSourceInfo_model.brandType = this.submitObj.unlimitBrand;

                        this.cooperationInfo_model.filedArr.map(item => {

                            let newArr = this.submitObj[item.code]? this.submitObj[item.code].split(',') : [];
                            item.defaultValueList = newArr.filter(elem => {
                                return item.checkedValueList.includes(elem)
                            })
                        })

                        this.carSourceInfo_model.filedArr.map(item => {

                            let newArr = this.submitObj[item.code]? this.submitObj[item.code].split(',') : [];
                            item.defaultValueList = newArr.filter(elem => {
                                return item.checkedValueList.includes(elem)
                            })
                        })

                        this.businessPerson_model.name = this.submitObj.contacterInfoDto? this.submitObj.contacterInfoDto.name: '';
                        this.businessPerson_model.job = this.submitObj.contacterInfoDto? this.submitObj.contacterInfoDto.positionCode : '';
                        this.businessPerson_model.phone = this.submitObj.contacterInfoDto? this.submitObj.contacterInfoDto.phone : '';
                        this.businessPerson_model.email = this.submitObj.contacterInfoDto? this.submitObj.contacterInfoDto.email : '';

                        if(this.carSourceInfo_model.brandType === '0' && this.submitObj.channelBusinessCarDTOList.length > 0){
                            this.carSourceInfo_model.brandList = [];
                            this.submitObj.channelBusinessCarDTOList.map(item => {
                                this.carSourceInfo_model.brandList.push({
                                    brand: [item.mastbrandId,item.makeId],
                                    brandName: [item.mastbrand,item.make],
                                    time: [item.startDate,item.endDate],
                                    img: item.channelAttachmentDto,
                                    timeFlag: item.unlimited === '1' ? true : false
                                })
                            })
                        }
                        if(this.marginDeliveryShow){
                            this.marginDelivery_model.money = this.submitObj.cashDeposit || this.submitObj.cashDeposit === 0 ? this.submitObj.cashDeposit+'' : '';
                            this.marginDelivery_model.img = this.submitObj.cashDepositAttachment || {};
                        }
                    }
                })
            },
            // 获取第一步
            getOne(){
                let json = {
                    id: this.channelId,
                } 
                this.$http.post('/tbChannelBusiness/initPage',json).then(resp => {
                    if (resp.data.success) {
                        let data  = resp.data.data.fieldList;

                        this.AllfieldList = data;

                        // 渠道科目
                        this.cooperationInfo_model.subjectArr = data.filter(item => {
                            return item.code === 'firstSubject' && item.checkedValueList.length>0
                        })
                        // 合作信息其他字段
                        this.cooperationInfo_model.filedArr = data.filter(item => {
                            return item.enabled === '1' && item.code !== 'firstSubject' && item.code !== 'guaranteeFlag' && item.code !== 'vehicleType' && item.code !== 'vehicleFrom' && item.checkedValueList.length>0
                        })

                        let arr1 = data.filter(item => {
                            return item.enabled === '1' && item.code === 'vehicleType' && item.checkedValueList.length>0
                        })

                        let arr2 = data.filter(item => {
                            return item.enabled === '1' &&  item.code === 'vehicleFrom' && item.checkedValueList.length>0
                        })
                        this.carSourceInfo_model.filedArr = [...arr1,...arr2];

                        // 保证金
                        let marginDelivery = data.filter(item => {
                            return item.enabled === '1' && item.code === 'guaranteeFlag' 
                        });
                        if(marginDelivery.length>0){
                            this.marginDeliveryShow = true
                        }else{
                            this.marginDeliveryShow = false
                        }

                        if(this.returnOneFlag){
                            // 返显第一步
                            this.returnOne();
                        }

                    }
                })
            },

            // 返显第四步
            returnFour(){

                let url,json;
                if(this.obj.type === 'new' || this.obj.type === 'edit'){
                  url = "/channelDatumController/queryDatumByChannelId";
                  json = {
                      channelId: this.channelId,
                  } 
                }else
                if(this.obj.type === 'reject'){
                  url = "/channelDatumController/queryDatumByWorkFlowId";
                  json = {
                    workFlowId: this.obj.workFlowId,
                  }
                } 

                this.$http.post(url, json).then(resp => {
                    if (resp.data.success) {
                        let data = resp.data.data;


                        this.filesForm_model.list = this.filesForm_model.list.map(item => {
                            item.img = data.filter(elem => {
                                return elem.attachmentCode === item.attachemntCode
                            })[0] || {};

                            return item;
                        })

                        this.otherAttachments_model.list = data.filter(elem => {
                            return elem.attachmentCode === '0000000034'
                        })

                    }
                })
            },
            // 获取第四步
            getFour(){
               
                this.$http.get('/businessAttachment/getBusinessAttachmentByChannelSubject?firstSubject=' + this.cooperationInfo_model.subjectValue[0]+'&secondSubject='+this.cooperationInfo_model.subjectValue[1]).then(resp => {
                    if (resp.data.success) {
                        let data = resp.data.data;

                        
                        let arr1 = data.filter(item => {
                            return item.attachemntCode !== '0000000034'
                        })
                        this.filesForm_model.list = arr1.map(item => {
                            item.img = {}
                            return item;
                        })
                        
                        let arr = data.filter(item => {
                            return item.attachemntCode === '0000000034'
                        })
                        if(arr.length>0){
                            this.otherFile_flag = true
                        }else{
                            this.otherFile_flag = false
                        }
                        // 返显第四步
                        if(this.returnFourFlag){
                            this.returnFour();
                        }
                         
                    }
                })
            },
             // 获取按钮
            getBtns(){
              let json = {
                    workFlowId: this.obj.workFlowId,
                };
                this.$http.post('/channelWfpt/getApprovalBtnList',json).then(resp => {

                    if (resp.data.success) {
                     this.btnsList = resp.data.data || [];
                    }
                })
            },
            // 直接提交
            clickFn(item){

                // this.loading = true;

                this.nextFlag = true;
                this.currentBtn = item;

                this.saveFour();
                
            },
            // 小助手
            goto(){
                this.$bus.$emit('contractAssistant',{id:"contractAssistant", isShow:true,name: "合同小助手", refresh:true, params:{channelCode: this.channelCode, channelId:this.channelId, busiConfigId: this.busiConfigId}})
            }
        },
        mounted(){

            this.obj = Object.assign({},this.$attrs.params);
            this.channelId = this.obj.channelId;
            console.log(this.obj)

            // 新建
            if(this.obj.type === 'new'){
                this.initChannelBusiness();
            }else
            // 输入中 编辑
            if(this.obj.type === 'edit'){
                
                this.returnOneFlag = true;
                this.returnFourFlag = true;
                this.getOne();
            }else
            // 驳回后编辑
            if(this.obj.type === 'reject'){
                this.returnOneFlag = true;
                this.returnFourFlag = true;
                this.getOne();
                this.getBtns();
            }
            
        }

    } 
</script>
<style lang="less">

    .user-Steps{
        margin-top: 30px;

        .ivu-steps-title{
            display: block !important
        }
        .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner span, .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner>.ivu-steps-icon{
            color: #1279e6;
             font-size: 18px
        }
        .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner{
            background: #fff;
        }
        .ivu-steps .ivu-steps-head-inner{
            border: 2px solid #ccc;
            width: 46px;
            height:46px;
            line-height: 42px
        }
        .ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner span, .ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner>.ivu-steps-icon{
            font-size: 18px
        }
        .ivu-steps-item.ivu-steps-status-process .ivu-steps-title{
            color:#1279e6;

        }
        .ivu-steps .ivu-steps-title{
            margin-left: -4px;
            margin-top: 5px
        }
        .ivu-steps{
            width:70%;
            margin-left:18%;
        }

        .ivu-steps .ivu-steps-tail>i:after{
            width: 0;
            height: 100%;
            background: none; 
            opacity: 1; 
            position: absolute;
            top: -7px;
            right: -16px;
            width: 0;
            height: 0;
            border: 10px solid #e9eaec;
            z-index: 1;
            border-right: 8px solid transparent;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
        }  
        .ivu-steps .ivu-steps-tail>i{
            height:2px;
            width:98%;
        }
        .ivu-steps .ivu-steps-tail{
            top:23px;
        }
        .ivu-steps-item.ivu-steps-status-finish .ivu-steps-tail>i{
            background: #aee4d6;
        }
        .ivu-steps-item.ivu-steps-status-finish .ivu-steps-tail>i:after{
            width:auto;
            background: none;
            border: 10px solid #aee4d6;
            border-right: 8px solid transparent;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
        }
        .ivu-steps .ivu-steps-head-inner>.ivu-steps-icon.ivu-icon{
            font-size: 40px
        }
        .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner{
            border-color: #aee4d6;
        }
        .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner span, .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner>.ivu-steps-icon{
            color: #aee4d6;
        }
        .ivu-steps-item.ivu-steps-status-finish .ivu-steps-title{
            color: #aee4d6;
        }
        .ivu-steps-item:nth-child(3) .ivu-steps-title{
            margin-left: -15px
        }
        .ivu-steps-item:nth-child(4) .ivu-steps-title{
            margin-left: -21px
        }
    }
    
</style>




