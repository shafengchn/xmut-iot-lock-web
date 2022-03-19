<template>
    <Card dis-hover title="角色配置">
        <Row>
            <Col span="10">
                <Button type="primary" class="mr-10" icon="ios-add" @click="addClick">新增</Button>
                <Button type="warning" class="mr-10" icon="ios-build" @click="permissionClick">权限配置</Button>
                <Button class="mr-10" @click="defaultClick"><span class="ivu-tag-dot-inner ivu-tag-primary"></span>设为默认角色</Button>
                <Table highlight-row stripe :loading="loading" :columns="columns" :data="tableData" @on-row-click="rowClick" size="small" class="mt-10">
                    <template slot="roleName" slot-scope="{ row }">
                        <span class="ivu-tag-dot-inner ivu-tag-primary" v-if="row.isDefault" ></span>
                        {{row.roleName}}
                    </template>
                    <template slot="opt" slot-scope="{ row }">
                        <Button size="small" type="text" class="mr-10" @click="editClick(row)">编辑</Button>
                        <Button size="small" type="text" style="color:red" @click="deleteClick(row)">删除</Button>
                    </template>
                </Table>
            </Col>
            <Col span="14">
                <UserList v-if="this.row.id" :roleId="row.id"></UserList>
				<div v-else>请选择一个角色</div>
            </Col>
            <FormModal v-model="showModal" :title="action=='add'?'新增':'修改'" @on-ok="saveClick">
                <Form ref="formItem" :model="formItem" :label-width="80" :rules="rules">
                    <FormItem label="角色名称" prop="roleName">
                        <Input v-model="formItem.roleName" />
                    </FormItem>
                    <FormItem label="角色编码" prop="roleCode">
                        <Input v-model="formItem.roleCode" :disabled="action!='add'" />
                    </FormItem>
                </Form>
            </FormModal>
            <Drawer :title="row.roleName + ' 权限配置'" width="500" v-model="showPermission">
                <Tree ref="role-tree" :data="treeData" show-checkbox multiple></Tree>
                <div class="drawer-footer">
                    <Button style="margin-right: 8px" @click="showPermission = false">Cancel</Button>
                    <Button type="primary" @click="savePermissionClick">Submit</Button>
                </div>
            </Drawer>
        </Row>
    </Card>
</template>

<script>
import FormModal from "@/components/form-modal";
import { list, saveOrUpdate, removeById, setDefaultRole } from "@/api/sys/role";
import { treeMenu, listMenuIdsByRoleId, saveRoleMenu } from "@/api/user/menu";
import { parseTree, checkTree } from "@/common/utils/tree.js";
import UserList from "./user-list.vue";

export default {
    components: {
        FormModal,
        UserList
    },
    data() {
        return {
            row: {},
            columns: [
                { title: '角色名称', slot: 'roleName' },
                // { title: '角色编码', key: 'roleCode' },
                { title: '操作', slot: 'opt', width: 200 }
            ],
            loading: false,
            tableData: [],
            showModal: false,
            action: '',
            formItem: {
                roleName: '',
                roleCode: '',
                isDefault: false
            },
            rules: {
                roleName: [
                    { required: true, message: '角色名称不能为空' },
                ],
                roleCode: [
                    { required: true, message: '角色编码不能为空' },
                ],
            },
            showPermission: false,
            treeData: [],
        }
    },
    created() {
        this.loadData();
        this.loadTree();
    },
    methods: {
        rowClick(row, index) {
            this.row = row;
            console.log({ ...row });
            this.$emit('input', row);
        },
        loadData() {
            this.loading = true;
            list().before(()=>{
                this.loading = false;
            }).then(res=>{
                this.tableData = res.data;
            }).catch(err=>{
                console.error(err);
            })
        },
        addClick() {
            this.action = 'add';
            this.formItem = {};
            this.$refs['formItem'].resetFields();
            this.showModal = true;
        },
        editClick(row) {
            this.formItem = { ...row };
            this.action = 'edit';
            this.$refs['formItem'].resetFields();
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
                        done();
                        this.$Message.success("保存成功");
                    }).catch(err=>{
                        done(false);
                        console.error(err);
                    })
                } else {
					done(false);
				}
            });
            
        },
        deleteClick(row) {
            this.$Modal.confirm({
                title: `您确定要删除[${row.roleName}]吗？`,
                content: '此操作不可逆！',
                loading: true,
                onOk: () => {
                    removeById(row.id).before(rs=>{
                        this.$Modal.remove();
                    }).then(res=>{
                        this.$Message.success("删除成功");
                        this.tableData.removeByKey('id', res.data);
                    }).catch(err=>{
                        console.error(err);
                    })
                    
                }
            })
        },
        defaultClick() {
            if(!this.row.id) {
                return this.$Message.warning("请至少选择一个角色");
            }
            this.$Modal.confirm({
                title: `确定要将[${this.row.roleName}]设置为默认角色吗？`,
                content: '用户首次登录将会被分配到此角色组！',
                loading: true,
                onOk: () => {
                    setDefaultRole(this.row.id).before(rs=>{
                        this.$Modal.remove();
                    }).then(res=>{
                        this.$Message.success("设置成功");
                        this.loadData();
                        // this.tableData.removeByKey('id', res.data);
                    }).catch(err=>{
                        console.error(err);
                    })
                    
                }
            })
        },
        permissionClick() {
            if(!this.row.id) {
                return this.$Message.warning("请至少选择一个角色");
            }
            // 获取当前用户的身份
            this.showPermission = true;
            checkTree(this.treeData, "id", []);
            listMenuIdsByRoleId(this.row.id).then(res=>{
                checkTree(this.treeData, "id", res.data);
            }).catch(err=>{
                console.error(err);
            })
        },
        loadTree() {
            treeMenu().then(res=>{
                this.treeData = parseTree(res.data, "menuTitle", "children", ["id"]);
            }).catch(err=>{
                console.error(err);
            })
        },
        savePermissionClick() {
            let checkedNode = this.$refs['role-tree'].getCheckedAndIndeterminateNodes();
            let menuIds = checkedNode.map(item=>item.id);
            saveRoleMenu(this.row.id, menuIds).then(res=>{
                this.$Message.success("保存成功")
                this.showPermission = false;
            }).catch(err=>{
                console.error(err);
            })
        }
    }
}
</script>

<style>

</style>