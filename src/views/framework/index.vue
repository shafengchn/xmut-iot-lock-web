<template>
    <div class="layout">
        <Layout>
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" style="height:calc(100vh - 2px);">
                <Menu :active-name="active" theme="dark" width="auto" :class="menuitemClasses" @on-select="selectMenu">
                    <template v-for="(item, index) in menus">
                        <template v-if="item.children && item.children.length > 0">
                            <Submenu :name="item.id" :key="index" :class="{ 'hide-submenu-arrow': isCollapsed }">
                                <div slot="title">
                                    <Icon :type="item.menuIcon" />
                                    <span>{{item.menuTitle}}</span>
                                </div>
                                <template v-for="(item2, index2) in item.children">
                                    <MenuItem :name="item2.id" :to="item2.routeName" :key="index2" :class="{ 'submenu-collapsed': isCollapsed }">
                                        <Icon :type="item2.menuIcon" />
                                        <span>{{item2.menuTitle}}</span>
                                    </MenuItem>
                                </template>
                            </Submenu>
                        </template>
                        <template v-else>
                            <MenuItem :name="item.id" :to="item.routeName" :key="index">
                                <Icon :type="item.menuIcon" />
                                <span>{{item.menuTitle}}</span>
                            </MenuItem>
                        </template>
                    </template>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{ padding: 0 }" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{ margin: '0 20px' }" type="md-menu" size="24"></Icon>
                    <User :style="{ marginRight: '50px'}"></User>
                </Header>
                <Breadcrumb :style="{margin: '20px 0 0 20px'}">
                    <BreadcrumbItem v-for="(item, index) in breadcrumb" :key="index">{{item}}</BreadcrumbItem>
                </Breadcrumb>
                <Content :style="{ margin: '20px' }">
                    <router-view></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
import User from "./user.vue";

export default {
    components: {
        User
    },
    data() {
        return {
            isCollapsed: false,
            menus: this.$store.getters.menuList,
            active: (this.$store.getters.menuList && this.$store.getters.menuList.length > 0) ? this.$store.getters.menuList[0].id : '',
            breadcrumb:[],
        };
    },
    created() {
        this.breadcrumb = this.findMenuPath(this.active);
    },
    computed: {
        rotateIcon() {
            return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
        },
        menuitemClasses() {
            return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
        },
    },
    methods: {
        collapsedSider() {
            this.$refs.side1.toggleCollapse();
        },
        selectMenu(name) {
            this.breadcrumb = this.findMenuPath(name);
        },
        findMenuPath(name, menus = this.menus) {
            let arr = [];
            for(let menu of menus) {
                arr.push(menu.menuTitle);
                if(menu.id == name) {
                    return arr;
                }

                let child = [];
                if(menu.children && menu.children.length > 0) {
                    child = this.findMenuPath(name, menu.children);
                }
                if(child.length != 0) {
                    arr.push(child[0]);
                    return arr;
                }
                arr.pop();
            }
            return arr;
        },
    },
};
</script>

<style lang="less" scoped>
.layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height: 100%;
}
.layout-header-bar {
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
}
.menu-icon {
    transition: all 0.3s;
}
.rotate-icon {
    transform: rotate(-90deg);
}
.menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width 0.2s ease 0.2s;
}
.menu-item i {
    transform: translateX(0px);
    transition: font-size 0.2s ease, transform 0.2s ease;
    vertical-align: middle;
    font-size: 16px;
}
.collapsed-menu span {
    width: 0px;
    transition: width 0.2s ease;
}
.collapsed-menu i {
    transform: translateX(5px);
    transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
    vertical-align: middle;
    font-size: 22px;
}

.submenu-collapsed {
	padding: 14px 24px !important;
}
.hide-submenu-arrow /deep/ .ivu-menu-submenu-title-icon {
	display: none;
}
</style>