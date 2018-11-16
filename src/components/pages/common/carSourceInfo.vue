<!-- 车源信息 -->
<template>

    <div>
        <Form ref="formValidate" :model="value" :rules="ruleValidate" :label-width="130">
                     
            <Row v-for="(item,index) in value.filedArr" :key="index">
                <Col span="24">
                    <FormItem :label="item.name" :prop="'filedArr.'+ index + '.defaultValueList'" :rules="{required: true, type: 'array', message: '请选择' + item.name, trigger: 'change'}">
                        <CheckboxGroup v-if="edit"  v-model="item.defaultValueList">
                            <Checkbox v-for="elem in returnArr(item)" :label="elem.value">{{elem.name}}</Checkbox>
                        </CheckboxGroup>
                        <span v-else>{{returnName2(item.defaultValueList,item.childFieldList)}}</span>

                        <!-- 差异对比 -->
                        <span class="colorRed" v-if=" !edit && type === 'changeBusiness'">&nbsp;{{item.defaultValueList_old && item.defaultValueList_old.length>0? '（原信息：' + returnName2(item.defaultValueList_old,item.childFieldList) + '）' : ''}}</span>
                    </FormItem>
                </Col>
            </Row>
                
            <Row>
                <Col span="24">
                    <FormItem label="车辆品牌" prop="brandType">
                        <RadioGroup v-if="edit"  v-model="value.brandType" @on-change="changeBrand">
                            <Radio label="1">不限品牌</Radio>
                            <Radio label="0">限定品牌</Radio>
                        </RadioGroup>
                        <span v-else>{{value.brandType === '1'? '不限品牌' : '限定品牌'}}</span>

                        <!-- 差异对比 -->
                        <span class="colorRed" v-if=" !edit && type === 'changeBusiness'">&nbsp;{{value.brandType_old? value.brandType_old==='1'?'（原信息：不限品牌）':'（原信息：限定品牌）' : ''}}</span>

                        <Button  v-if="xiandingFlag && edit" type="primary" @click="addBrand">添加品牌</Button>
                    </FormItem>
                </Col>
            </Row>
            <Row v-if="xiandingFlag">
                <Col span="24">
                    <FormItem label="" prop="">
                        <Table :columns="columns1" :data="value.brandList"></Table>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <Modal
        v-model="addBrandFlag"
        :title="modalTitle"
         width="600"
         @on-cancel="cancel"
        >
        <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="130">
            <Row>
                <Col span="24">
                    <FormItem label="选择品牌" prop="brand">
                         <Cascader v-model="formValidate2.brand"  :data="data4" :load-data="loadData" class="input-width" @on-change="handleChange"></Cascader>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem v-if="timeDiv" label="品牌授权时间" :prop="formValidate2.timeFlag? '' : 'time'">
                        <DatePicker  :disabled="formValidate2.timeFlag" v-model="formValidate2.time"  type="daterange" placement="bottom-end" placeholder="请选择授权时间" class="input-width"></DatePicker>
                        <Checkbox v-model="formValidate2.timeFlag" @on-change="changeTimeFlag">不限</Checkbox>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="品牌授权书" prop="img">
                        <oneFile :value.sync="formValidate2.img" attachmentCode="0000000003" :btns="['show','down','again']" @clearValidate="clearValidate"></oneFile>
                    </FormItem>
                </Col>
            </Row>
           
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary"  @click="ok">确认</Button>
        </div>
    </Modal>
    <Modal title="查看图片" v-model="visible">
      <img :src="imgSrc" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
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
            },
        },
        data() {
            return {
                columns1: [
                    {
                        type:'index',
                        title:'序号',
                        width: 60,
                    },
                    {
                        title: '主品牌',
                        key: 'mainBrand',
                        render: (h, params) => {
                            return h('div',[
                                    h('span',params.row.brandName[0]),
                                    h('div',{
                                        style:{
                                            color:'red'
                                        }
                                    }, params.row.oldValue? this.returnOld(params.row.oldValue.mastbrand) : '')
                            ])                    
                        }
                    },
                    {
                        title: '品牌',
                        key: 'brand',
                        render: (h, params) => {
                            return h('div',[
                                    h('span',params.row.brandName[1]),
                                    h('div',{
                                        style:{
                                            color:'red'
                                        }
                                    }, params.row.oldValue? this.returnOld(params.row.oldValue.make) : '')
                            ])                      
                        }
                    },
                    {
                        title: '品牌授权时间',
                        key: 'time',
                        render: (h, params) => {
                            return h('div',[
                                    h('span', this.returnTimes(params.row)),
                                    h('div',{
                                        style:{
                                            color:'red'
                                        }
                                    }, params.row.oldValue? this.returnOldTime(params.row.oldValue) : '')
                            ]) 
                        }
                    },
                    {
                        title: '品牌授权书',
                        key: 'img',
                        tooltip:true,
                        ellipsis: true,
                        render: (h, params) => {

                            return h('a',{
                                on:{
                                    click: () => {
                                      this.showImg(params.row.img)
                                    }
                                }
                            },params.row.img.attachmentName)                        
                        }
                    },
                    {
                        title: '操作',
                        render: (h, params) => {
                          
                            return h('div', [
                                h('a', {
                                  style: {
                                    marginRight: '10px',
                                  },
                                  on: {
                                    click: () => {
                                      this.Edit(params.index)
                                    }
                                  }
                                }, '编辑'),
                                h('a', {
                             
                                  on: {
                                    click: () => {
                                      this.Deleted(params.index)
                                    }
                                  }
                                }, '删除')
                              ]);
                          

                        }
                    }
                ],
               
                data1:[],
                ruleValidate:{
                    brandType: [
                        { required: true, message: '请选择车辆品牌！', trigger: 'change' }
                    ],
                },
                xiandingFlag:false,
                addBrandFlag:false,
                data4: [],
                modalTitle: '',
                formValidate2: {
                    brand:[],
                    brandName:[],
                    time:[],
                    timeFlag:false,
                    img:{}
                },
                ruleValidate2:{
                    brand: [
                        { required: true, type: 'array', message: '请选择品牌', trigger: 'change' }
                    ],
                    time: [{
                        type: 'array',required:true,
                        fields:{
                            0:{type:'date',required:true,message: '请选择开始结束时间'},
                            1:{type:'date',required:true,message: '请选择开始结束时间'}
                        },
                        message: '请选择开始结束时间'
                    }],
                    img: {
                        type: "object", required: true,trigger: 'change',
                        fields: {
                          attachmentName: {type: "string", required: true,trigger: 'change', message: '请选择上传文件！'},
                        }
                    },
                },
                visible: false,
                imgSrc: '',
                timeDiv:true,
                currentIndex: 0,

            }
        },
        watch:{

            value: {
                handler: function (newVal) {
                    this.xiandingFlag = newVal.brandType === '0'? true : false;
                    this.$emit('update:value', newVal);

                  },
                deep: true
            }
        },
        methods: {
            returnOld(val){
                if(val && this.type === 'changeBusiness'){
                    return '（原：'+ val +'）';
                }
            },
            returnOldTime(row){
                if( row.unlimited && this.type === 'changeBusiness'){
                    if(row.unlimited === '1'){
                        return '（原：不限）';
                    }else{
                        return '（原：' + this.$formatDate(row.startDate) + ' 至 ' + this.$formatDate(row.endDate) + '）';
                    }
                }else{
                    if(row.startDate || row.endDate){
                       return '（原：' + this.$formatDate(row.startDate) + ' 至 ' + this.$formatDate(row.endDate) + '）'; 
                    }
                }
            },

            // 新授权时间
            returnTimes(row){
                if(row.timeFlag){
                    return '不限';
                }else{
                    return this.$formatDate(row.time[0]) + ' 至 ' + this.$formatDate(row.time[1]) 
                }
            },
            clearValidate(){
                this.$refs['formValidate2'].validateField('img');
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

            returnArr(item){
                let v = item.checkedValueList;
                let arr = item.childFieldList;
                return arr.filter(elem => {
                    return v.includes(elem.value)
                })
            },
            // 编辑图片
            Edit(index){
                this.currentIndex = index;
                this.modalTitle = '编辑品牌';
                this.addBrandFlag = true;
                this.formValidate2 = Object.assign({},this.value.brandList[this.currentIndex]);
                this.changeTimeFlag();
            },
            // 删除
            Deleted(index){

                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定删除？</p>',
                    onOk: () => {
                        this.value.brandList.splice(index,1)
                    },
                });
            },
            // 查看图片
            showImg(img){
                this.imgSrc = this.$viewURL_PATH + img.serverFileName;
                // this.visible = true;
                this.$showImg(this.imgSrc);
            },
            // 点击不限
            changeTimeFlag(v){
                this.timeDiv = false;
                this.$nextTick(()=>{
                    this.timeDiv = true;
                })
            },
            // 点击下拉框品牌
            handleChange (value, selectedData) {
                this.formValidate2.brandName = [];
                selectedData.map(item => {
                    this.formValidate2.brandName.push(item.label)
                })
            },

            changeBrand(v){
                if(v === '1'){
                    this.xiandingFlag = false;
                }else{
                    this.xiandingFlag = true;
                }
            },
            // 添加品牌
            addBrand(){
                this.modalTitle = '新增品牌';
                this.addBrandFlag = true;
            },
        
            // 主品牌
            getMainBrand(){
                this.$http.get("/api/vehicleLib/masterBrand").then((resp)=>{
                    if(resp.data.success){
                        let data = resp.data.data;
                        this.data4 = [];
                        data.map(item => {
                            this.data4.push({
                                value: item.id,
                                label: item.name,
                                children: [],
                                loading: false
                            })
                        })
                    };
                })
            },
            // 获取品牌
            loadData (item, callback) {
                item.loading = true;
                this.$http.get("/api/vehicleLib/brand?masterId=" + item.value).then((resp)=>{
                    if(resp.data.success){
                        let data = resp.data.data;
                        item.children = [];
                        data.map(elem => {
                            item.children.push({
                                value: elem.id,
                                label: elem.name,
                            })
                        })
                        
                        item.loading = false;
                        callback();
                    };
                })
            },
            // 确认
            ok (){
                this.$refs['formValidate2'].validate((valid) => {
                    if (valid) {
                        this.saveBrand();
                    } else {

                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            // 取消
            cancel() {
                this.$refs['formValidate2'].resetFields();
                this.formValidate2.time = [];
                this.addBrandFlag = false;
            },
            // 保存新增
            saveBrand(){

                if(this.modalTitle === '编辑品牌'){
                    this.value.brandList[this.currentIndex] = Object.assign({},this.formValidate2);
                    this.xiandingFlag = false;
                    this.$nextTick(()=>{
                        this.xiandingFlag = true;
                    })
                }else{
                    this.value.brandList.push({
                        brand: this.formValidate2.brand,
                        brandName: this.formValidate2.brandName,
                        time: this.formValidate2.time,
                        timeFlag:this.formValidate2.timeFlag,
                        img: this.formValidate2.img
                    })
                }
                
                this.cancel();
            },
            returnTime(arr){
                let newArr = [];
                arr.map(item => {
                    newArr.push(this.$formatDate(item))
                })
                return newArr;
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
            this.getMainBrand();

            if(!this.edit){
                this.columns1.pop();
            }
            if(this.type === 'changeBusiness'){
                this.columns1.push({
                    title: '变更说明',
                    key: '',
                    width:150,
                    render: (h, params) => {
                        let flag = params.row.flag;
                        let text,color;

                        if(flag === 'add'){
                            text = '新增';
                            color = 'green';
                        }else
                        if(flag === 'update'){
                            text = '修改';
                            color = 'blue';
                        }else
                        if(flag === 'delete'){
                            text = '删除';
                            color = 'red';
                        }

                        return h('span',{
                            style:{
                                color: color
                            }
                        },text)                        
                    }
                });
            }

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



