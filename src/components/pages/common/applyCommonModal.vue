
<!-- 申请-原因模态框 -->

<template>
	<div>
		<!-- 说明 -->
        <Modal
          v-model="flag"
          title="申请原因说明"
          :mask-closable="false"
          @on-cancel="cancel">
          <Row :gutter="16">
            <Col span="7" class="text-right">
              <h3>确认提交申请？</h3>
            </Col>
        </Row>
        <br>
          <Row :gutter="16">
            <Col span="6" class="text-right">
              <span style="color:red">* </span> 
              申请原因
            </Col>
            <Col span="16">
                <Input v-model.trim="note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="支持200字录入" :maxlength="200" />
                <limitLength :value="note" :max="200"/>
            </Col>
        </Row>

        <div slot="footer">
          <Button @click="cancel">取消</Button>
          <Button :loading="loading_btn"  type="primary"  @click="ok">确定</Button>
        </div>


        </Modal>
	</div>
</template>
<script>
  export default {
  	props:{
  		flag:{
  			type:Boolean,
  			default:false
  		},
  		remark:{
  			type:String,
  			default:''
  		},
  	},
    name: "",
    data () {
      return {
      	note:'',
        loading_btn:false,
      }
    },
    watch:{
    	flag(newVal){
    		this.$emit('update:flag', newVal);
    	},
    	note(newVal){
    		this.$emit('update:remark', newVal);
    	},
    },

    methods: {
    	ok(){
    		this.$emit('ok');
	    },
	    cancel(){
	    	this.$emit('update:flag', false);
	    }
    },

    mounted () {
    	
    }
  }
</script>