<!-- 经销商分级 -->
<template>
	<div class="content">
        <div class="channels-common-body ">
            <div class="channels-common-body-content">
                <div class="channels-common-body-title">
                    <span></span>经销商分级
                </div>
                <div class="channels-common-body-cont">
                    <Form :model="formItem" :label-width="130">
                        <Row>
                            <Col span="24">
                                <FormItem label="渠道科目">
                                    <span>直营店-直营自拓4S店</span>
                                </FormItem>
                            </Col>

                        </Row>
                        <Row>
                            <Col span="24">
                                <FormItem label="车辆类型">
                                    <CheckboxGroup v-model="fruit">
                                        <Checkbox label="新车"></Checkbox>
                                    </CheckboxGroup>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <FormItem label="车辆来源">
                                    <CheckboxGroup v-model="fruit">
                                        <Checkbox label="非资源车"></Checkbox>
                                    </CheckboxGroup>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <FormItem label="车辆品牌">
                                    <RadioGroup v-model="animal">
                                        <Radio label="不限品牌"></Radio>
                                        <Radio label="限定品牌"></Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        methods: {


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



