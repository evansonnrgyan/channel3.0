<!-- 新建渠道 -->
<template>
    <div >
       
        <Spin fix v-if="spinFlag" >
            <Icon type="ios-loading" size=20 class="demo-spin-icon-load"></Icon>
            <div style="margin-top:-10px">搜索中</div>
        </Spin>
        <div class="channels-common-search-content clearboth text-center">
            <span style="color:red">* </span> 
            <span v-if="mainType === '0'" class="search-title marginR10">查询企业</span>
            <span v-else class="search-title marginR10">查询个人</span>

            <div style="display:inline-block;width:450px;vertical-align: bottom;" >
                <div class="text-left inline-block">
                    <Input v-model="inputValueName" placeholder="请输入关键字" class="inline" style="width: 400px" />

                    <!-- <Select
                    v-if="selectFlag"
                    v-model="inputValue"
                    filterable
                    remote
                    :remote-method="remoteMethod1"
                    @on-change="changeSelect"
                    @on-query-change="changeQuery"
                    :loading="loading1"  class="inline " style="width: 350px" placeholder="请输入关键字">
                        <Option v-for="item in options1" :value="item.id" :key="item.id">{{ mainType === '0'? item.mainName : item.mainName + '&nbsp;&nbsp;&nbsp;' + item.creditCode}}</Option>
                    </Select> -->

            </div>  

            <!-- <Select class="inline" v-model="mainType" style="width: 80px" @on-change="changeType">
                <Option value="0">查企业</Option>
                <Option value="1">查个人</Option>
            </Select> -->
        </div>

        <Button v-if="mainType === '0'" type="primary" size="large" icon="ios-search" @click="search">查询</Button>
        <Button v-else type="primary" icon="md-add" size="large" @click="addPerson">新增个人主体</Button>
    </div>
    <div class="">

        <!-- 企业列表 -->
        <div v-if="businessFlag" class="padding-15-30">
            <companiesList :pid="selectValue" @addStore="addStore" @showStore="showStore" :flag.sync="spinFlag"></companiesList>   
        </div>

        <!-- 查看企业信息 -->
        <div v-if="showStoreFlag">

            <!-- 企业信息 -->
            <commonTitle title="企业信息" v-if="mainType === '0'">
                <companiesInfo  :value.sync="companiesInfo_model" :flag.sync="companiesInfo_flag" :edit="true"></companiesInfo>
            </commonTitle>

            <!-- 个人信息 -->
            <commonTitle title="个人信息" v-else>
                <personInfo :value.sync="companiesInfo_model" :flag.sync="companiesInfo_flag" :edit="true"></personInfo>
            </commonTitle>

            <!-- 下属店面信息 -->
            <div class="channels-common-body-content padding-15-30">
                <div class="channels-common-body-title">
                    <span></span>下属店面信息
                    <div class="noResult" @click="addNewStore">没有找到需要店面？点此新建>></div>
                </div>
                <div class="channels-common-body-cont">
                    <div v-if="underStoreList.length>0">
                        <underStore :list.sync="underStoreList" @goSteps="goSteps"></underStore>  
                        <Page :total="total" :current="current" :page-size="rowCount" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator size="small"></Page> 
                    </div>
                    
                    <p v-else class="text-center color-upload">暂无数据</p>
                </div>
            </div>
        </div>

        <!-- 新建店面 -->
        <div v-if="addStoreFlag">

            <!-- 企业信息 -->
            <commonTitle title="企业信息" v-if="mainType === '0'">
                <companiesInfo :value.sync="companiesInfo_model" :flag.sync="companiesInfo_flag" :edit="true"></companiesInfo>
            </commonTitle>

            <!-- 个人信息 -->
            <commonTitle title="个人信息" v-else>
                <personInfo :value.sync="companiesInfo_model" :flag.sync="companiesInfo_flag" :edit="true"></personInfo>
            </commonTitle>

            <!-- 上传营业执照 -->
            <!-- <commonTitle title="上传营业执照" v-if="businessImgFlag">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"  :label-width="140" >
                    <FormItem label="营业执照电子版" prop="serverFileName">
                        <oneFile :value.sync="formValidate" attachmentCode="0000000004" :btns="['show','down','again']"></oneFile>
                    </FormItem>
                </Form>
            </commonTitle> -->

            <!-- 编辑店面信息 -->
            <commonTitle title="新建店面信息">
                <storeInfoForm ref="storeInfoForm_ref" :value.sync="storeInfoForm_model" :flag.sync="storeInfoForm_flag" :edit="true"></storeInfoForm>
            </commonTitle>

        </div>

        <!-- 新增个人主体-->
        <div v-if="addPersonFlag">

            <!-- 个人信息 -->
            <commonTitle title="个人信息">
                <personInfoForm ref="personInfoForm_ref" :value.sync="personInfoForm_model" :flag.sync="personInfoForm_flag" :edit="true"></personInfoForm>
            </commonTitle>

            <!-- 新建店面信息 -->
            <commonTitle title="新建店面信息">
                <storeInfoForm ref="storeInfoForm_ref" :value.sync="storeInfoForm_model" :flag.sync="storeInfoForm_flag" :edit="true"></storeInfoForm>
            </commonTitle>

        </div>
    </div>




    <poFooter v-show="btnFlag">
        <Button :loading="loading"  type="primary" size="large" @click="next">下一步</Button>
    </poFooter>


    <!-- 选择申请业务 -->
    <Modal
    v-model="ModalBusiness"
    width="400px"
    class-name="select-business"
    title="选择申请业务">
    <div>请点击标签进行选择</div>
    <div style="margin:10px auto 30px">
        <span >
            <Tag type="border" v-for="item in tags" :key="item.id" color="primary" @click.native="goChannelSteps(item.id)">{{item.businessModelName}}</Tag>
        </span>

    </div>

    <div slot="footer" >
    </div>
</Modal>


</div>
</template>

<script>
    export default {
        data() {
            return {
                spinFlag:false,
                loading:false,
                selectValue: '',
                inputValueName:'',
                inputValue: '',
                options1: [],
                loading1: false,
                handleTime: '',
                selectID: '',
                current: 1,
                rowCount: 10,
                total: 0,
                selectFlag: true,
                businessImgFlag: true,
                shopId: '',
                underStoreList:[],

                storeInfoJson: {},


                storeInfoEdit_flag: false,
                newDate: '',
                tags: [],

                personInfoForm_model: {},
                personInfoForm_flag: false,

                formValidate: {},

                ruleValidate: {
                    serverFileName: [{
                        required: true,
                        message: '请选择上传文件！',
                        trigger: 'change'
                    }],
                },

                // 店面信息
                storeInfoForm_model: {},
                storeInfoForm_flag: false,

                // 个人信息
                personInfo: {},

                personInfo_flag: false,

                value12: '',
                mainType: '0',
                placeholder: '请输入企业名称关键词',

                companiesInfo_model: {},
                companiesInfo_flag: false,

                addPersonFlag: false,
                btnFlag: false,
                ModalBusiness: false,
                businessFlag: false,
                addStoreFlag: false,
                showStoreFlag: false,
                companiesList: [],
                underStore: [],
                businessLicenseFile: 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar',
            }
        },

        methods: {

            // 验证营业执照
            handleSubmit(){
                 return new Promise((resolve, reject)=>{
                    this.$refs['formValidate'].validate((valid) => {
                        if (valid) {
                            resolve();
                        } else{
                            reject();
                        }
                    })
                })
            },

            // 获取企业信息或个人信息
            getcompanyOrPerson() {
                if(!this.selectID) return;
                this.spinFlag = true;
                this.$http.post("/tbChannelMainInfo/selectMainInfoById", {
                    id: this.selectID
                }).then((resp) => {
                    if (resp.data.success) {
                         this.companiesInfo_model = resp.data.data;
                    };
                    this.spinFlag = false;
                })
            },

            //关闭所有组件
            closeFlag() {
                this.addPersonFlag = false;
                this.btnFlag = false;
                this.businessFlag = false;
                this.addStoreFlag = false;
                this.showStoreFlag = false;
                this.businessImgFlag = false;
                this.shopId = '';
            },
            // 点击模糊搜索项
            changeSelect(id) {
                this.closeFlag();
                this.showStoreFlag = true;

                this.selectID = id;
                this.getcompanyOrPerson();
                this.current = 1;
                this.rowCount = 10;
                this.getList();
            },
            // 修改关键字
            changeQuery(query){
                this.inputValueName = query;
                this.inputValue = '';
                this.options1 = [];
            },
            // 获取下属店面
            getList() {
                if(!this.selectID) return;
                let json = {
                    "mainId": this.selectID,
                    "current": this.current,
                    "rowCount": this.rowCount,
                }
                this.$http.post("/tbChannelShopInfo/selectShopInfoByMainIdPage", json).then((resp) => {
                    if (resp.data.success) {
                        let data = resp.data.data;
                        this.underStoreList = data.data;
                        this.total = data.total;
                        this.rowCount = data.rowCount;
                    };
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
            // 异步搜索
            remoteMethod1(query) {

                if (query !== '') {
                    this.loading1 = true;

                    let params = {
                        mainName: query,
                        mainType: this.mainType,
                        current: 1,
                        rowCount: 10000
                    }

                    this.handleTime = new Date().getTime();

                    setTimeout(() => {
                        if (new Date().getTime() - this.handleTime >= 500) {
                            this.$http.post("/tbChannelMainInfo/selectMainInfoByName", params).then((resp) => {
                                if (resp.data.success) {
                                    this.options1 = resp.data.data.data || [];
                                }
                                this.loading1 = false;
                            })
                        }
                    }, 500)

                } else {
                    this.options1 = [];
                }
            },

            changeType(v) {
                this.closeFlag();
                this.selectFlag = false;
                this.$nextTick(() => {
                    this.selectFlag = true;
                })
                this.inputValue = '';
                this.inputValueName = '';
                this.selectValue = '';
                this.options1 = [];
                this.placeholder = v === '0' ? '请输入企业名称关键词' : '请输入个人姓名进行查询';
            },
            // 新增个人主体
            addPerson() {
                this.closeFlag();
                this.addPersonFlag = true;
                this.btnFlag = true;
            },
            // 下一步
            next() {

                // 新增个人主体
                if (this.addPersonFlag) {


                    Promise.all([this.$refs['personInfoForm_ref'].handleSubmit(),this.$refs['storeInfoForm_ref'].handleSubmit()]).then((data)=>{
                      this.save();
                    }).catch((error) => {
                      this.$Message.error('表单验证失败')
                    })


                } else {
                    
                        Promise.all([this.$refs['storeInfoForm_ref'].handleSubmit()]).then((data)=>{
                            this.save();

                        }).catch((error) => {

                          this.$Message.error('表单验证失败')

                        })
                }
            },
            // 保存新增
            save() {

                this.loading = true;

                let json;
                if (this.mainType === '0') {
                    json = {
                        shopHeadAttachmentObj: this.storeInfoForm_model.img,
                        shopName: this.storeInfoForm_model.name,
                        detailAddress: this.storeInfoForm_model.addressMore,
                        provinceCode: this.storeInfoForm_model.address[0],
                        province: this.storeInfoForm_model.addressName[0],
                        cityCode: this.storeInfoForm_model.address[1] || '',
                        city: this.storeInfoForm_model.addressName[1] || '',
                        districtCode: this.storeInfoForm_model.address[2] || '',
                        district: this.storeInfoForm_model.addressName[2] || '',
                        shopAttribute: this.storeInfoForm_model.typeArr.join(','),
                        mainName: this.companiesInfo_model.mainName,
                        mainType: this.mainType,
                        mainId: this.companiesInfo_model.id,
                        // businessAttachmentObj: this.companiesInfo_model.businessAttachmentObj 
                    }
                } else {

                    if(this.addStoreFlag){
                        json = {
                            shopHeadAttachmentObj: this.storeInfoForm_model.img,
                            shopName: this.storeInfoForm_model.name,
                            detailAddress: this.storeInfoForm_model.addressMore,
                            provinceCode: this.storeInfoForm_model.address[0],
                            province: this.storeInfoForm_model.addressName[0],
                            cityCode: this.storeInfoForm_model.address[1] || '',
                            city: this.storeInfoForm_model.addressName[1] || '',
                            districtCode: this.storeInfoForm_model.address[2] || '',
                            district: this.storeInfoForm_model.addressName[2] || '',
                            shopAttribute: this.storeInfoForm_model.typeArr.join(','),
                            // mainName: this.companiesInfo_model.mainName,
                            mainType: this.mainType,
                            mainId: this.companiesInfo_model.id,
                            // creditCode: this.companiesInfo_model.creditCode,
                            idCardAttachmentObj: this.companiesInfo_model.idCardAttachmentObj,
                        }
                    }else{
                        json = {
                            shopHeadAttachmentObj: this.storeInfoForm_model.img,
                            shopName: this.storeInfoForm_model.name,
                            detailAddress: this.storeInfoForm_model.addressMore,
                            provinceCode: this.storeInfoForm_model.address[0],
                            province: this.storeInfoForm_model.addressName[0],
                            cityCode: this.storeInfoForm_model.address[1] || '',
                            city: this.storeInfoForm_model.addressName[1] || '',
                            districtCode: this.storeInfoForm_model.address[2] || '',
                            district: this.storeInfoForm_model.addressName[2] || '',
                            shopAttribute: this.storeInfoForm_model.typeArr.join(','),
                            mainName: this.personInfoForm_model.name,
                            mainType: this.mainType,
                            creditCode: this.personInfoForm_model.code,
                            idCardAttachmentObj: this.personInfoForm_model.img,
                        }
                    }
                    
                }

                if(this.shopId && this.shopId !== ''){
                    json.id = this.shopId;
                }


                this.$http.post("/tbChannelShopInfo/saveTbChannelShopInfo", json).then((resp) => {
                    if (resp.data.success) {
                        this.ModalBusiness = true;
                        this.shopId = resp.data.data.id;
                        this.getTags();
                    }
                    this.loading = false;
                })
            },

            getTags() {
                this.$http.post("/businessConfigure/selectBusinessConfigByRoleList", {}).then((resp) => {
                    if (resp.data.success) {
                        this.tags = resp.data.data;
                    };
                })
            },
            
            // 企业查询
            search() {
                if (this.inputValueName === '') {
                    this.$Message.error('请输入查询内容！');
                    return;
                }else if(this.inputValueName.length >= 4){
                    this.closeFlag();
                    this.businessFlag = true;
                    this.selectValue = '';
                    this.spinFlag = true;
                    this.$nextTick(()=>{
                        this.selectValue = this.inputValueName;
                    })
                    
                }else{
                    this.$Message.error('查询字数至少4个字！');
                    return;
                }
                
            },
            // 新建店面
            addStore(id) {
                this.closeFlag();
                this.selectID = id;
                this.addStoreFlag = true;
                this.btnFlag = true;

                this.$nextTick(()=>{
                    this.getcompanyOrPerson();
                })
            },
            // 查看店面
            showStore(id) {
                this.closeFlag();
                this.showStoreFlag = true;

                this.selectID = id;
                this.getcompanyOrPerson();
                this.current = 1;
                this.rowCount = 10;
                this.getList();
                
            },
            // 没有找到需要店面？点此新建
            addNewStore() {
                this.closeFlag();
                this.addStoreFlag = true;
                this.btnFlag = true;

                // if(!this.companiesInfo_model.businessAttachmentObj && this.mainType === '0'){
                //     this.businessImgFlag = true;
                // }
            },
            // 下属店面可选业务进入
            goSteps(id,shopId){
                this.$bus.$emit("channelSteps", {
                    id: "channelSteps",
                    name: "新增渠道",
                    closeName: 'addChannel',
                    refresh:true,
                    params:{
                        type: 'new',
                        shopId: shopId,
                        busiConfigId: id
                    }
                });
            },
            // 进入新建步骤
            goChannelSteps(id) {
                this.ModalBusiness = false;
                this.$bus.$emit("channelSteps", {
                    id: "channelSteps",
                    name: "新增渠道",
                    closeName: 'addChannel',
                    refresh:true,
                    params:{
                        type: 'new',
                        shopId: this.shopId,
                        busiConfigId: id
                    }
                });
            }
        },
        mounted() {

        }

    }
</script>
<style type="text/css" scoped>
   .search-title{
        font-weight: bold;
        font-size: 14px
   }
   .imgDiv{
    width:100px;
    height:100px;
   }
   .noResult{
        color:#127efc;
        float:right;
        font-size: 13px;
        cursor: pointer;
   }
 
</style>
<style type="text/css">
    .select-business .ivu-modal-body{
        padding:20px 30px 30px;
    }
    .select-business .ivu-modal-footer{
        border:none;
    }

    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>



