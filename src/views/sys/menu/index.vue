<template>
    <Card dis-hover style="height:100%">
        <OptionGroup @on-add="addClick" size="small" @on-edit="editClick" @on-delete="deleteClick"></OptionGroup>
        <Table :loading="tableLoading" highlight-row stripe :columns="columns" size="small" :data="tableData" @on-row-click="rowClick" class="my-table">
            <template slot="icon" slot-scope="{ row }">
                <Icon :type="row.menuIcon"></Icon>
            </template>
        </Table>
        <FormModal v-model="showModal" :title="action=='add'?'新增':'修改'" @on-ok="saveClick">
            <Form ref="formItem" :model="formItem" :label-width="80" :rules="rules">
                <FormItem label="菜单图标" prop="menuIcon">
                    <Input v-model="formItem.menuIcon">
                        <span slot="prepend">
                            <Icon :type="formItem.menuIcon"></Icon>
                        </span>
                    </Input>
                </FormItem>
                <FormItem label="菜单标题" prop="menuTitle">
                    <Input v-model="formItem.menuTitle" />
                </FormItem>
                <FormItem label="路由路径" prop="routePath">
                    <Input v-model="formItem.routePath" />
                </FormItem>
                <FormItem label="路由名称" prop="routeName">
                    <Input v-model="formItem.routeName" />
                </FormItem>
                <FormItem label="页面路径" prop="pagePath">
                    <Input v-model="formItem.pagePath">
                        <span slot="prepend">@/views/</span>
                        <span slot="append">.vue</span>
                    </Input>
                </FormItem>
                <FormItem label="是否显示到侧边栏" prop="isShow">
                    <iSwitch v-model="formItem.isShow" />
                </FormItem>
            </Form>
        </FormModal>
    </Card>
</template>

<script>
import OptionGroup from "@/components/option-group";
import FormModal from "@/components/form-modal";
import { listByParent, saveOrUpdate, removeById } from "@/api/user/menu";
import MenuPanel from "./index";

export default {
    name: 'MenuPanel',
    props: {
        parentId: {
            type: String,
            default: () => null
        }
    },
    components: {
        OptionGroup,
        FormModal
    },
    data() {
        return {
            columns: [
                { 
                    type: 'expand',
                    width: 50,
                    render: (h, { row }) => {
                        return h(MenuPanel, {
                            props: {
                                parentId: row.id
                            }
                        });
                    }
                },
                { title: '图标', slot: 'icon', width: 80 },
                { title: '菜单标题', key: 'menuTitle', width: 200 },
                { title: '路由路径', key: 'routePath' },
                { title: '路由名称', key: 'routeName' },
                { title: '页面路径', key: 'pagePath' },
                { title: '更新时间', key: 'updateTime' },
            ],
            tableData: [],
            tableLoading: false,
            showModal: false,
            action: 'add',
            formItem: {
                menuIcon: '',
                menuTitle: '',
                routePath: '',
                routeName: '',
                pagePath: '',
                isShow: true,
                updateTime: '',
                parentId: this.parentId
            },
            row: {},
            rules: {
                menuTitle: [
                    { required: true, message: '菜单标题不能为空', trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        rowClick(row, index) {
            this.row = row;
        },
        loadData() {
            this.tableLoading = true;
            listByParent(this.parentId).before(res=>{
                this.tableLoading = false;
            }).then(res=>{
                this.tableData = res.data;
            }).catch(err => {
                console.error(err);
            })
        },
        addClick() {
            this.action = 'add';
            this.formItem = {
                parentId: this.parentId
            };
            this.showModal = true;
        },
        saveClick(done) {
            this.$refs['formItem'].validate(valid=>{
                if(valid) {
                    saveOrUpdate(this.formItem).then(res=>{
                        if(this.action == 'add') {
                            this.tableData.push(res.data);
                        } else {
                            this.tableData.replaceByKey("id", res.data.id, res.data);
                        }
                        this.$Message.success("保存成功");
                        done();
                    }).catch(err=>{
                        console.error(err);
                        done(false);
                    })
                }
            })
        },
        editClick() {
            if(!this.row.id) {
                return this.$Message.warning("请至少选择一行")
            }
            this.action = 'edit';
            this.formItem = { ...this.row };
            console.log(this.$refs['formItem'])
            this.$refs['formItem'].resetFields();
            this.showModal = true;
        },
        deleteClick() {
            if(!this.row.id) {
                return this.$Message.warning("请至少选择一行")
            }
            this.$Modal.confirm({
                title: `您确定要删除[${this.row.menuTitle}]吗？`,
                content: '此操作不可逆！',
                loading: true,
                onOk: () => {
                    removeById(this.row.id).before(rs=>{
                        this.$Modal.remove();
                    }).then(res=>{
                        this.$Message.success("删除成功");
                        this.tableData.removeByKey('id', res.data);
                    }).catch(err=>{
                        console.error(err);
                    })
                    
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.my-table /deep/ .ivu-table-expanded-cell {
    padding: 20px 20px;
}
</style>