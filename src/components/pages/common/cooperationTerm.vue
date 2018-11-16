<!-- 合作有效期 -->
<template>

    <Form ref="formValidate" :label-width="130">
        <Row>
            <Col span="12">
                <FormItem :label="label"  prop="">
                    <RadioGroup v-model="timesType" type="button" @on-change="changeType">
                        <Radio label="0">一年期</Radio>
                        <Radio label="1">自定义</Radio>
                    </RadioGroup>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label=""  prop="">
                     <div v-if="timesType === '0'">
                        {{$formatDate(today) + ' 至 ' + $formatDate(onYearToday)}}
                    </div>
                    <div v-else>
                        <DatePicker v-model="startDate" type="date" :options="option1" placeholder="Select date" style="width: 140px"></DatePicker>
                        <span>&nbsp;至&nbsp;</span>
                        <DatePicker  v-model="endDate" type="date" :options="option2" placeholder="Select date" style="width: 140px"></DatePicker>
                    </div>
                </FormItem>
            </Col>
        </Row>
    </Form>
</template>

<script>
    export default {
        props:{
            value:{
                type:Array,
                default:[]
            },
            label:{
                type:String,
                default:''
            },
            timesType:{
                type:String,
                default:''
            }
        },
        data() {
            const _this = this;
            return {
                today: this.$formatDate(new Date()),
                onYearToday: this.$formatDate(new Date().getTime() + 3600 * 1000 * 24 * 365),

                startDate : new Date(),
                endDate: this.$formatDate(new Date().getTime() + 3600 * 1000 * 24 * 365),

             

                option1:{
                    disabledDate (date) {
                        if(_this.endDate){
                            let s = new Date(new Date(_this.endDate).toLocaleDateString());
                            return date && date.valueOf() > s.getTime();
                        }
                    }
                },
                option2:{
                    disabledDate (date) {
                        if(_this.startDate){
                            // 处理成当前0点
                            let s = new Date(new Date(_this.startDate).toLocaleDateString());
                            return date && date.valueOf() < s.getTime();
                        }
                    }
                },
            }
        },
        methods: {
          changeType(v){
            this.timesType = v;
            this.$nextTick(()=>{
                if(v === '0'){
                    this.value = [this.today,this.onYearToday]
                }else{
                    this.value = [this.$formatDate(this.startDate),this.$formatDate(this.endDate)]
                }
            })
       
            
          },
          init(){
            if(this.timesType === '1'){

                console.log(this.value)

                this.startDate = this.value[0];
                this.endDate = this.value[1];
            }
          }
           
        },
        watch:{
            value: {
                handler: function (newVal) {
                    this.init();
                    alert()
                    this.$emit('update:value', newVal);
                  },
                deep: true
            }
        
        },
        mounted(){
            
            this.init();

        }
    } 
</script>
<style scoped lang="less">

</style>



