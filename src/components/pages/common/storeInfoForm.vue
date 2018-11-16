<!-- 编辑店面信息 -->
<template>

	<div>
		<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
		    <Row>
		        <Col span="12">
		            <FormItem label="店面名称" prop="name">
                        <div v-if="edit">
                            <Input  v-model.trim="formValidate.name" placeholder="请输入店面名称" class="input-width" :maxlength="40"></Input>
                            <limitLength :value="formValidate.name" :max="40"/>
                        </div>
		                  <span v-else>{{formValidate.name}}</span>
		            </FormItem>
		        </Col>
		    </Row>
		    <Row>
		        <Col span="24">
		            <FormItem label="实际展业地址" prop="address">
                        <Cascader v-model="formValidate.address" :data="data4" placeholder="请选择经营地址" :load-data="loadData" class="input-width" :render-format="format"  @on-change="handleChange"></Cascader>
		            </FormItem>
                    <FormItem label="" prop="addressMore">
                        <Input v-model.trim="formValidate.addressMore" placeholder="请录入店面实际展业的地址信息" style="width:400px" :maxlength="100"></Input>
                        <limitLength :value="formValidate.addressMore" :max="100"/>
                    </FormItem>
		        </Col>
		    </Row>
		    <Row>
		        <Col span="12">
		            <FormItem label="店面属性" prop="typeArr">
		                  <Select v-if="edit" v-model="formValidate.typeArr" multiple   class="input-width" placeholder="请选择店面属性">
		                        <Option v-for="item in types" :value="item.code" :key="item.code">{{ item.name }}</Option>
		                  </Select>
		                  <span v-else>{{formValidate.typeArr}}</span>
		            </FormItem>
		        </Col>
		    </Row>
		    <Row>
		        <Col span="12">
		            <FormItem label="店头照片" prop="img">
		                  <oneFile :value.sync="formValidate.img" attachmentCode="0000000020" :btns="edit ? ['show','down','again'] : ['show','down']" @clearValidate="clearValidate"></oneFile>
		            </FormItem>
		        </Col>
		    </Row>

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
    			type:Boolean,
    			default:false
    		},
    		edit:{
    			type:Boolean,
    			default:false
    		},

    	},
        data() {
            return {
                formValidate:{
                    name:'',
                    address:[],
                    addressMore:'',
                    typeArr:[],
                    img:{}
                },
            
            	ruleValidate:{
                    name: [
                        { required: true, message: '请填写店面名称！', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, type: 'array', message: '请选择经营地址！', trigger: 'change' }
                    ],
                    addressMore: [
                        { required: true,  message: '请输入详细地址！', trigger: 'blur' }
                    ],  

                    typeArr: [
                        { required: true, type: 'array', message: '请选择店面属性！', trigger: 'change' },
                        { type: 'array', max: 10, message: '最多选择10项！', trigger: 'change' }
                    ],

                    img: [{
                        type: "object", required: true,
                        fields: {
                          serverFileName: {required: true,trigger: 'change' , message: '请选择上传文件！'},
                        }
                    }],
                   
              	},

                data4:[],
                types:[],
            }
        },
        watch:{
            formValidate:{
            handler: function (newVal) {
                    this.$emit('update:value', newVal);

                  },
            deep: true
          },
        
        },
        methods: {
            clearValidate(){
                this.$refs['formValidate'].validateField('img');
            },
            handleChange (value, selectedData) {
                this.formValidate.addressName = [];
                selectedData.map(item => {
                    this.formValidate.addressName.push(item.label==='无下级'? '' : item.label)
                })
            },
            format(label){
                let arr = label.filter(item => {
                    return item !== '无下级';
                })
                return arr.join(' - ')
            },
            loadData (item, callback) {
                item.loading = true;
                this.$http.get("/api/basicRegion/getSubRegions?regionId=" + item.value).then((resp)=>{
                if(resp.data.success){
                    let data = resp.data.data;
                    item.children = [];

                    if(!data.length>0){
                        item.children.push({
                            value: 0,
                            label: '无下级',
                        })
                    }else{
                        if(item.level === 1){
                            data.map(elem => {
                                item.children.push({
                                    value: elem.regionId,
                                    label: elem.fullName,
                                    children: [],
                                    loading: false
                                })
                            })
                        }else{
                            data.map(elem => {
                                item.children.push({
                                    value: elem.regionId,
                                    label: elem.fullName,
                                })
                            })
                        }
                    }

                    item.loading = false;
                    callback();
                    };
                })
            },
            // 省
            getProvinces(){
                this.$http.post("/api/basicRegion/getProvinces").then((resp)=>{
                    if(resp.data.success){
                         let data = resp.data.data;
                         this.data4 = [];
                         data.map(item => {
                            this.data4.push({
                                value: item.regionId,
                                label: item.fullName,
                                children: [],
                                level: item.level,
                                loading: false
                            })
                         })
                    };
                  })
           },
           // 店面属性
           getTypes(){
                this.$http.get("/tbChannelShopInfo/initShopInfoAttribute").then((resp)=>{
                    if(resp.data.success){
                         this.types = resp.data.data.shopAttributes;
                         
                    };
                  })
           },
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

            // 父组件有值
            if(!$.isEmptyObject(this.value)){
             
            }

            this.getProvinces();
            this.getTypes();

             this.$emit('update:value', this.formValidate);

          
        }
    } 
</script>
