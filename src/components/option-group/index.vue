<template>
    <div>
        <div style="margin-bottom: 10px;">
            <Button type="primary" class="mr-10" icon="ios-add" :size="size" @click="addClick">新增</Button>
            <Button type="primary" class="mr-10" icon="ios-create-outline" :size="size" @click="editClick">编辑</Button>
            <Button type="warning" class="mr-10" icon="ios-trash-outline" :size="size" @click="deleteClick">删除</Button>
            <slot name="append"></slot>
        </div>
        <slot name="default"></slot>
    </div>
</template>

<script>
export default {
    props: {
        size: {
            type: String,
            default: 'default'
        }
    },
    methods: {
        addClick(e) {
            this.$emit('on-add', e);
        },
        editClick(e) {
            this.$emit("on-edit", e);
        },
        deleteClick(e) {
            this.$emit('on-delete', e);
        }
    }
}
</script>

<style>

</style>