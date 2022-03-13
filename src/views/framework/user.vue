<template>
    <div>
        <Dropdown>
            <Avatar icon="ios-person" />
            <DropdownMenu slot="list">
                <DropdownItem>修改密码</DropdownItem>
                <DropdownItem :style="{color:'#ed4014'}" divided>退出</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>

</style>