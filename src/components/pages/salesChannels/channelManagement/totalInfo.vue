<!-- 展业信息 -->
<template>
  <div class="" style="margin:-15px -30px">

    <!-- 查看 渠道详情 -->
    <div v-if="edit">
        <commonTitle title="合作信息">
            <cooperationInfo ref="cooperationInfo_ref" :value.sync="cooperationInfo_model"  :edit="false" ></cooperationInfo>
        </commonTitle>

        <commonTitle title="车源信息">
                <carSourceInfo ref="carSourceInfo_ref" :value.sync="carSourceInfo_model"  :edit="false"></carSourceInfo>
         </commonTitle>

         <commonTitle title="保证金交付" v-if="marginDeliveryShow">
                <marginDelivery ref="marginDelivery_ref" :value.sync="marginDelivery_model"  :edit="false"></marginDelivery> 
         </commonTitle>

         <commonTitle title="拓展信息">
            <extensInfo :channelId="params" :shopId="shopId"  :rentLevel="rentLevel" /> 
         </commonTitle>
    </div>

    <!-- 编辑 渠道详情 -->
    <div v-else>

         <commonTitle title="合作信息">
                <cooperationInfo ref="cooperationInfo_ref" :value.sync="cooperationInfo_model"  :edit="false" ></cooperationInfo>
        </commonTitle>

        <commonTitle title="车源信息">
                <carSourceInfo ref="carSourceInfo_ref" :value.sync="carSourceInfo_model" :edit="false"></carSourceInfo>
         </commonTitle>
    </div>


     


  </div>
</template>

<script>
  export default {
    name: "",
    props: {
        params:{
            type:String,
            default:''
        },
        edit:{
            type:Boolean ,
            default:false
        },
    },
    data() {
      return {
        submitObj:{},

        shopId:'',

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
        cooperationInfo_flag:false,

         // 车源信息
          carSourceInfo_model:{
               filedArr:[],
               brandList:[]
          },
          carSourceInfo_flag:false,

          // 保证金
          marginDelivery_model:{
              money:'',
              img:{}
          },
          marginDelivery_flag: false,
          marginDeliveryShow:false,

          rentLevel: '',
      }
    },
    watch:{
        params(nv){
            if(nv !== ''){
                this.getOne();
            }
        }
    },
    methods:{
       
      // 返显第一步数据
            returnOne(){
                let json = {
                    id: this.params,
                } 
                this.$http.post('/tbChannelBusiness/getChannelBusiness',json).then(resp => {
                    if (resp.data.success) {
                        this.shopId = resp.data.data.shopId;
                        this.submitObj = resp.data.data;


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

                        this.cooperationInfo_model.filedArr.map((item,index) => {
                            item.defaultValueList = this.submitObj[item.code]? this.submitObj[item.code].split(',') : [];
                        })

                        this.carSourceInfo_model.filedArr.map((item,index) => {
                            item.defaultValueList = this.submitObj[item.code]? this.submitObj[item.code].split(',') : [];
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
                                    timeFlag: item.unlimited === '1' ? true : false
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
                      
                    }
                })
            },
            // 获取第一步
            getOne(){
                let json = {
                    id: this.params,
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
    },
    mounted(){

        if(this.params !== ''){
                this.getOne();
            }
    }
  }
</script>
