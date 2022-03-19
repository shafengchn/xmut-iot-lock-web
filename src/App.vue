<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
#app {
	min-height: 100vh; 
}

.mr-10 {
	margin-right: 10px;
}
.mt-10 {
	margin-top: 10px;
}

// iview drawer 底部栏样式
.drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}

// iview 页码组件居中
.page-center {
    display: flex;
    justify-content: center;
    margin: 10px 0 0 0;
}

// iview 嵌套表格样式
.inner-table /deep/ .ivu-table-expanded-cell {
    padding: 20px 20px;
}
</style>
