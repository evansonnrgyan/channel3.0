<!-- 合作信息 -->
<template>
 <div>
    <Form ref="formValidate" :model="value" :rules="ruleValidate" :label-width="130">
        <Row>
            <Col span="24">
                <FormItem label="渠道科目" prop="subjectValue" class="inline-block">
                    <div v-if="edit">
                        <Cascader v-if="subFlag" v-model="value.subjectValue" :data="data4" :load-data="loadData" class="input-width inline-block" @on-change="handleChange"></Cascader>
                    </div>
                    <span v-else>{{returnName(value.subjectValue)}}</span>
                   
                </FormItem>
                
                <FormItem label="" :label-width="1" prop=""  v-if="cooperationFlag" class="inline-block">
                    <div v-if="edit">

                        <!-- 多选 -->
                        <FormItem label="" :label-width="1" prop="cooperativeValue" v-if="cooperativeValue_flag"  class="inline-block">
                            <Select  v-model="value.cooperativeValue" multiple class="input-width inline-block" placeholder="请选择合作项目" label-in-value @on-change="changeCooper">
                                <Option v-for="(item,index) in cooperativeList" :value="item.cooperationCode" :key="index">{{ item.cooperationName }}</Option>
                            </Select>
                        </FormItem>

                        <!-- 单选 -->
                        <FormItem label="" :label-width="1" prop="cooperativeValue_single" v-else  class="inline-block">
                            <Select v-model="value.cooperativeValue_single" class="input-width inline-block" placeholder="请选择合作项目" label-in-value @on-change="changeCooper_single">
                                <Option v-for="(item,index) in cooperativeList" :value="item.cooperationCode" :key="index">{{ item.cooperationName }}</Option>
                            </Select>
                        </FormItem>
                    </div>
                    <span v-else>{{ value.cooperativeName.length>0? ' - ' + value.cooperativeName.join(',') : ''}}</span>
                    
                </FormItem>

                <!-- 差异对比 -->
                <FormItem label="" :label-width="1" prop="" class="inline-block" v-if=" !edit && type === 'changeBusiness'">
                    <span class="colorRed" >&nbsp;{{value.subjectValue_old.length>0 || value.cooperativeName_old.length>0? '（原信息：' : ''}}{{value.subjectValue_old.length>0? returnName(value.subjectValue_old) : ''}}{{value.cooperativeName_old.length>0? '  ' + value.cooperativeName_old.join(',') : ''}}{{value.subjectValue_old.length>0 || value.cooperativeName_old.length>0? '）' : ''}}</span>
                </FormItem>
                
            </Col>
       
        </Row>
        <Row v-for="(item,index) in value.filedArr" :key="index">
            <Col span="24">
                <FormItem :label="item.name" :prop="'filedArr.'+ index + '.defaultValueList'" :rules="{required: true, type: 'array', message: '请选择' + item.name, trigger: 'change'}">
                    <CheckboxGroup v-if="edit"  v-model="item.defaultValueList">
                        <Checkbox v-for="elem in returnArr(item)" :label="elem.value" >{{elem.name}}</Checkbox>
                    </CheckboxGroup>
                    <span v-else>{{returnName2(item.defaultValueList,item.childFieldList)}}</span>

                    <!-- 差异对比 -->
                    <span class="colorRed" v-if=" !edit && type === 'changeBusiness'">&nbsp;{{ item.defaultValueList_old && item.defaultValueList_old.length>0? '（原信息：' + returnName2(item.defaultValueList_old,item.childFieldList) + '）' : ''}}</span>
                </FormItem>
            </Col>
        </Row>

        <Row v-if="type !== 'changeCooperationPeriod'">
            <Col span="24">
                <FormItem label="是否支持评估价上浮" prop="isFloat">
                    <RadioGroup v-model="value.isFloat" v-if="edit">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                    <span v-else>{{value.isFloat === '1'? '是' : '否'}}</span>

                    <!-- 差异对比 -->
                    <span class="colorRed" v-if=" !edit && type === 'changeBusiness'">&nbsp;{{value.isFloat_old? value.isFloat_old==='1'?'（原信息：是）':'（原信息：否）' : ''}}</span>
                </FormItem>
            </Col>
        </Row>
       
        <Row>
            <Col span="24">
                <FormItem label="所属分公司" prop="company">
                    <Select
                        v-if="edit"
                        v-model="value.companyName"
                        filterable
                        remote
                        :remote-method="remoteMethod1"
                        :loading="loading1" class="input-width"
                        @on-change="changeCompany"
                        label-in-value>
                        <Option v-for="(option, index) in options1" :value="option.nodeName" :key="index">{{option.nodeName}}</Option>
                    </Select>
                    <span v-else>{{value.companyName}}</span>

                    <!-- 差异对比 -->
                    <span class="colorRed" v-if=" !edit && type === 'changeBusiness'">&nbsp;{{value.companyName_old? '（原信息：' + value.companyName_old + '）' : ''}}</span>
                </FormItem>
            </Col>
        </Row>
        
        <div v-if="type !== 'changeBusiness' && type !== 'changeCooperationPeriod'">
            <Row >
                <Col span="12">
                    <FormItem label="合作期限"  prop="timesType">
                        <RadioGroup v-model="value.timesType" type="button" @on-change="changeType" v-if="edit">
                            <Radio label="0">一年期</Radio>
                            <Radio label="1">自定义</Radio>
                        </RadioGroup>
                        <span v-else>{{value.startDate + ' 至 ' + value.endDate}}</span>
                    </FormItem>
                </Col>
            </Row>

            <Row v-if="edit">
                <Col span="12">
                    <FormItem label=""  prop="">
                         <div v-if="value.timesType === '0'">
                            {{today + ' 至 ' + onYearToday}}
                        </div>
                        <div v-else>
                            <FormItem label=""  prop="startDate" class="inline-block">
                                <DatePicker v-model="value.startDate" type="date" :options="option1" placeholder="开始日期" style="width: 140px"></DatePicker>
                            </FormItem>
                            <span>&nbsp;至&nbsp;</span>
                            <FormItem label=""  prop="endDate" class="inline-block">
                                <DatePicker  v-model="value.endDate" type="date" :options="option2" placeholder="结束日期" style="width: 140px"></DatePicker>
                            </FormItem>
                            
                        </div>
                    </FormItem>
                </Col>
            </Row> 
        </div>
        

    </Form>
               
</div>
            
	   
</template>

<script>
    export default {
    	props: {
    		value:{
    			type: Object,
    			default: {},
    		},
            flag:{
                type:Boolean ,
                default:false
            },
    		edit:{
    			type:Boolean ,
    			default:false
    		},
            type:{
                type:String,
                default:''
            }
    	},
        data() {
            const _this = this;
            return {

                today: this.$formatDateTime(new Date(), "yyyy-MM-dd"),
                onYearToday: this.$formatDateTime(new Date().getTime() + 3600 * 1000 * 24 * 365, "yyyy-MM-dd"),

                option1:{
                    disabledDate (date) {
                        if(_this.value.endDate){
                            let s = new Date(new Date(_this.value.endDate).toLocaleDateString());
                            return date && date.valueOf() > s.getTime();
                        }
                    }
                },
                option2:{
                    disabledDate (date) {
                        if(_this.value.startDate){
                            // 处理成当前0点
                            let s = new Date(new Date(_this.value.startDate).toLocaleDateString());
                            return date && date.valueOf() < s.getTime();
                        }
                    }
                },
            	ruleValidate:{

                    cooperativeValue:[
                        { required: true, type: 'array', message: '请选择合作项目', trigger: 'change' },
                    ],
                    cooperativeValue_single:[
                         { required: true, message: '请选择合作项目', trigger: 'change' },
                    ],
                    subjectValue: [
                        { required: true, type: 'array', message: '请选择渠道科目', trigger: 'change' }
                    ],
                    isFloat: [
                        { required: true,  message: '请选择是否支持上浮', trigger: 'change' }
                    ],
                    company: [
                        { required: true,  message: '请输入所属分公司', trigger: 'change' }
                    ],
                    timesType: [
                        { required: true, message: '请填写额胡总期限', trigger: 'blur' }
                    ],
                    startDate: [
                        { required: true, message: '请选择开始时间', trigger: 'change' }
                    ],
                    endDate: [
                        { required: true, message: '请选择结束时间', trigger: 'change' }
                    ],
                   
              	},

                cooperativeList: [],
                cooperationFlag: false,
              	data4: [],
              	loading1: false,
              	options1:[],
              	handleTime: '',
                startDate_old:'',
                endDate_old:'',
                subFlag:true,
                cooperativeValue_flag:false,
                         
              }
        },
      
        watch:{

            value: {
                handler: function (newVal) {
                    this.data4 = this.returnData();
                   
                    newVal.startDate = newVal.startDate? this.$formatDateTime(newVal.startDate,"yyyy-MM-dd") : '';
                    newVal.endDate = newVal.endDate? this.$formatDateTime(newVal.endDate,"yyyy-MM-dd") : '';

                    this.$emit('update:value', newVal);

                    this.subFlag = false;
                    this.$nextTick(()=>{
                        this.subFlag = true;
                    })

                    if(newVal.subjectValue[1] === '0497000300000'){

                        this.cooperativeValue_flag = true;
                       
                    }else{
                        this.cooperativeValue_flag = false;
                       
                    }

                    

                  },
                deep: true
            },
            ['value.subjectValue']:{
                handler: function (newVal) {
                    if(newVal[1] === '0497000300000' || newVal[1] === '0497000200003' || newVal[1] === '0497000000001'){
                        this.$nextTick(()=>{
                           this.getList(); 
                        })
                            
                    }else{
                        this.cooperationFlag = false;
                    }
                    this.subFlag = false;
                    this.$nextTick(()=>{
                        this.subFlag = true;
                    })

                },
                deep:true
            },
            ['value.timesType']:{
                handler: function (newVal) {
                    if(newVal === '0'){
                        this.value.startDate =  this.today;
                        this.value.endDate =  this.onYearToday;
                    }

                },
                deep:true
            }
        },
        methods: {

            // 返显科目名称
            returnName(arr){

                let one = this.value.subjectArr.filter(item =>{
                    return item.value === arr[0]
                })[0];

                if(one){
                    let two = one.childFieldList.filter(item =>{
                        return item.value === arr[1]
                    })[0];

                    if(two){
                        return one.name + ' - ' + two.name;
                    }
                }
            },
            returnName2(arr,arrAll){
                let result = [];
                arr.map(item => {
                    let m = arrAll.filter(elem => {
                        return elem.value === item
                    })[0];
                    result.push(m.name)
                })
                return result.join(',');
            },

            changeCompany(v){
                let val = v.value;
                this.value.company  = this.options1.filter(item => item.nodeName === val)[0].nodeCode;
            },
             handleChange (value, selectedData) {

                if(value[1] === '0497000300000' || value[1] === '0497000200003' || value[1] === '0497000000001'){

                    this.$nextTick(()=>{
                        // this.getList();
                    })
                    
                }else{
                    this.cooperationFlag = false;
                }

                this.$nextTick(()=>{
                   this.value.cooperativeValue = [];
                   this.value.cooperativeValue_single = '';
                   this.value.cooperativeName = [];
                })

                
            },
             changeType(v){
                this.value.timesType = v;
                if(v === '0'){
                    this.value.startDate =  this.today;
                    this.value.endDate =  this.onYearToday;
                }else{
                    // this.value.startDate =  this.startDate_old;
                    // this.value.endDate =  this.endDate_old;
                }
            },

        	remoteMethod1 (query) {
               if (query !== '') {
                    this.loading1 = true;
                    
                    this.handleTime = new Date().getTime();

                    setTimeout(() => {
                        if (new Date().getTime() - this.handleTime >= 500) {
                            this.$http.post("/tbMultipleNode/queryBranchCompany?nodeName="+query).then((resp) => {
                                if (resp.data.success) {
                                    this.loading1 = false;
                                    this.options1 = resp.data.data;
                                };
                            })
                        }
                    }, 500)

                } else {
                    this.options1 = [];
                }
            },

        	loadData (item, callback) {
                item.loading = true;

            	item.children = [];

            	let obj = this.value.subjectArr.filter(e => {return e.value === item.value})[0];

                let v = obj.checkedValueList;

                let arr = obj.childFieldList;

                let newArr = arr.filter(elem => {
                    return v.includes(elem.value)
                })

                newArr.map(i => {

                    item.children.push({
                        value:i.value,
                        label:i.name,
                    })
            	})
                
            	item.loading = false;
            	callback();
               
                
                
            },
            // 切换合作项目-----多选
            changeCooper(data){

                this.value.cooperativeName = [];
                console.log(data)

                data.map(item => {
                    this.value.cooperativeName.push(item.label)
                })
            },
            // 切换合作项目------单选
            changeCooper_single(data){
                if(!data) return;
                console.log(data)
                this.value.cooperativeName = [];
                this.value.cooperativeName.push(data.label)
            },
            // 加载合作项目
            getList(){
                    this.cooperationFlag = true;

                    let json = {
                        firstSubject: this.value.subjectValue[0],
                        secondSubject: this.value.subjectValue[1],
                    }
                    this.$http.post("/tbChannelBusiness/queryCooperation", json).then((resp) => {
                        if (resp.data.success) {
                            this.cooperativeList = resp.data.data.cooperationList;
                        };
                    })
            },
            returnData(){
            	let arr = [];
            	this.value.subjectArr.map(item => {
            		arr.push({
            			value:item.value,
            			label:item.name,
            			children: [],
                        loading: false,
                        type:0
            		})
            	})
            	return arr;
            },
            returnArr(item){
            	let v = item.checkedValueList;
            	let arr = item.childFieldList;
            	return arr.filter(elem => {
            		return v.includes(elem.value)
            	})
            },
             // 验证
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
            }
           
         
       
           
        },
        mounted(){
        	this.value.startDate =  this.today;
            this.value.endDate =  this.onYearToday;
        }

    } 
</script>
<style type="text/css" scoped>
    .content{
    }
    .line{
        line-height: 2.3
    }
    .title{
        font-size: 16px;
        font-weight: bold
    }

</style>



