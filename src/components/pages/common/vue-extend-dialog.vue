<!-- 公共成功提示框 -->
<template>
    <div v-if="isShow">
        <Modal
                :title="titleName"
                :mask="false"
                v-model="isShow"
                :closable="false"
                width="300" class="vue-extend-dialog">
            <slot style="padding:30px;"></slot>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "vueDialog",
        props: {
            titleName: {
                type: String,
                default: "提示"
            },
            show: {
                type: Boolean,
                required: true,
                default: false
            },
            time: {
                type: Number,
                default: 3
            }

        },
        data() {
            return {
                timer: null
            }
        },
        watch: {
            show(val) {
                clearTimeout(this.timer);
                if (val) {
                    this.isShow = val;
                    this.timer = setTimeout(() => {
                        this.isShow = false;
                        this.$emit("update:show", this.isShow);
                    }, this.time * 1000)
                }
            }
        },
        data() {
            return {
                isShow: false
            }
        }
    }
</script>

<style>
    .vue-extend-dialog .ivu-modal-footer {
        display: none!important;
    }
    .vue-extend-dialog .ivu-modal-body{
        padding:30px;
        font-size: 14px;
    }
</style>