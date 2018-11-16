<!-- 抵押 交付 -->

<template>
    <div class="mortgage-delivery">

        <Row>
            <Col span="24"><span class="required"></span>抵押登记及车辆交付方式：</Col>
        </Row>

        <Row>
            <Col span="24">
                (一)本协议下合作的汽车服务业务中，如需办理车辆抵押登记的，
                包括但不限于租赁业务、贷款业务、保险类业务，
                经销商选择如下的第<Select style="width:100px" v-model="typeValue" @on-change="changeContractFn">
                <Option v-for="(item,index) in 3" :value="item" :key="index">{{ item }}</Option>
            </Select>项：
            </Col>
        </Row>
        <Row style="padding: 0 0 0 20px;">
            <Col span="24">1、代租赁公司办理融资车辆抵押登记手续。</Col>
        </Row>
        <Row style="padding: 0 0 0 20px;">
            <Col span="24">
                2、不代租赁公司办理融资车辆抵押登记手续，但提供融资车辆上牌服务（在这种情况下，经销商应将上完牌后的所有资料以及融资车辆交付给租赁公司）。
            </Col>
        </Row>
        <Row style="padding: 0 0 0 20px;">
            <Col>
                3、不代租赁公司办理融资车辆抵押登记手续，也不提供融资车辆上牌服务（在这种情况下，经销商应将上牌、抵押所需资料以及融资车辆交付给租赁公司）。
            </Col>
        </Row>

        <Row>
            <Col span="24">
                (二)客户与租赁公司签订服务合同用于客户向经销商购买车辆的，未经租赁公司同意，经销商不得向客户交付车辆。经销商选择按以下哪种方式交付融资车辆（可多项勾选）：
            </Col>
        </Row>
        <Row style="padding: 0 0 0 20px;">
            <Col span="24">
                <CheckboxGroup v-model="deliveryType">
                    <Checkbox style="display: block;" label="1">1、应当事先经租赁公司书面（包括电子邮件）确认。</Checkbox>
                    <Checkbox style="display: block;" label="2">2、经销商向租赁公司交付车辆，再由租赁公司向客户交付车辆。</Checkbox>
                    <Checkbox style="display: block;" label="3">3、经销商向客户交付车辆的，应有租赁公司人员在场，并且租赁公司人员与经销商、客户一起签署《车辆交接单》。</Checkbox>
                    <Checkbox style="display: block;" label="4">4、经销商、客户、租赁公司三方现场交付车辆，《车辆交接单》等交接手续由客户和经销商自行安排。</Checkbox>
                </CheckboxGroup>
            </Col>
        </Row>


    </div>
</template>

<script>
    export default {
        name: "mortgageDelivery",
        data(){
            return {
                typeValue: "",
                deliveryType:[],
            }
        },
        props:['deliveryTypes','typeValues'],
        methods:{
            changeContractFn(data){
                console.log(data, '抵押及交付');
            }
        },
        watch:{
          deliveryType:{
            handler:function(newVal){
              this.$emit('update:deliveryTypes',newVal)
            },
            deep:true
          },
          typeValue:{
            handler:function(newVal){
              this.$emit('update:typeValues',newVal)
            },
            deep:true
          }
        },
        mounted(){
          this.$emit('update:deliveryTypes',this.deliveryType)
        }

    }
</script>

<style scoped>
    .required:before{
        content: '*';
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed4014;
    }
</style>
