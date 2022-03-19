<template>
    <Modal v-model="value" :title="title" draggable scrollable sticky reset-drag-position mask :closable="false" :width="width">
        <slot name="default"></slot>
        <template slot="footer">
            <Button type="text" @click="cancelClick">取消</Button>
            <Button type="primary" @click="saveClick" :loading="saving">保存{{saveProgress}}</Button>
        </template>
    </Modal>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '',
        },
        width: {
            type: [String, Number],
            default: 520
        },
        saveProgress: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            saving: false,
        }
    },
    watch: {
        value() {
            this.saving = false;
        }
    },
    methods: {
        cancelClick(e) {
            if(this.saving) {
                return;
            }
            this.$emit('on-cancel', e);
            if(this.saveProgress !== '') {
                this.$emit('update:saveProgress', '');
            }
            this.$emit('input', false);
        },
        saveClick(e) {
            this.saving = true;
            // closeModal是否继续显示Modal框
            let done = closeModal => {
                this.saving = false;
                if(this.saveProgress !== '') {
                    this.$emit('update:saveProgress', '');
                }
                if(closeModal !== false) {
                    this.$emit('input', false);
                }
            }
            this.$emit('on-ok', done);
        
        }
    }
}
</script>

<style>

</style>