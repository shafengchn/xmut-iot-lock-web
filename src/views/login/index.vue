<template>
    <div class="system">
        <div class="system-title">欢迎使用电子门禁控制系统</div>
        <Card dis-hover class="login-card">
            <div class="login-title">登 录</div>
        </Card>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.system {
    background-color: dodgerblue;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .system-title {
        font-size: 30px;
        color: #fff;
        font-weight: bold;
        line-height: 2;
    }
}
.login-card {
    width: 512px;
    .login-title {
        font-size: 20px;
        text-align: center;
    }
}

</style>