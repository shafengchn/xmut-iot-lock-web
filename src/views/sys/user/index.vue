<template>
    <Card dis-hover title="用户管理">
        <Row>
            <Col span="4">
                <Input search v-model="page.keywords" placeholder="用户名、学号/工号" @on-search="searchClick" />
            </Col>
            <Col span="2" offset="1">
                <Button type="warning" @click="roleConfigClick">身份配置</Button>
            </Col>
            <Col span="24" style="margin-top:10px;">
                <Table :loading="loading" :columns="columns" :data="tableData" size="small" @on-row-click="rowClick"></Table>
                <Page class="page-center" :current="page.current" :total="page.total" simple />
            </Col>
        </Row>
        <FormModal v-model="showModal" title="身份配置" @on-ok="saveRoleClick">
            <Form :label-width="100">
                <FormItem label="角色">
                    <RadioGroup v-model="selectRoleId" vertical>
                        <Radio v-for="(item, index) in roles" :key="index" :label="item.id">
                            {{item.roleName}}
                        </Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </FormModal>
    </Card>
    
</template>

<script>
import { pageUser } from "@/api/user/user";
import FormModal from "@/components/form-modal/index";
import { list as listRole, setUserRole } from "@/api/sys/role";

export default {
    components: {
        FormModal
    },
    data() {
        return {
            row: {},
            roles: [],
            selectRoleId: '',
            columns: [
                { title: 'id', key: 'id', width: 250 },
                { title: '姓名', key: 'name', width: 200 },
                { title: '学号/工号', key: 'staffNo', width: 200 },
                { title: '部门', key: 'deptName' },
                { title: '角色', key: 'roleName', width:180},
            ],
            tableData: [],
            loading: false,
            page: {
                keywords: '',
                current: 1,
                size: 30,
                total: 0,
            },
            showModal: false,
        }
    },
    created() {
        listRole().then(res=>{
            this.roles = res.data;
        }).catch(er=>{
            console.error(er);
        })
        this.loadData();
    },
    methods: {
        rowClick(row) {
            this.row = { ...row };
        },
        loadData(page = this.page) {
            this.loading = true;
            pageUser(page).before(() => {
                this.loading = false;
            }).then(res=>{
                this.page.total = parseInt(res.data.total);
                this.tableData = res.data.records;
            }).catch(err=>{
                console.error(err);
            })
        },
        searchClick() {
            this.page.current = 1;
            this.loadData();
        },
        roleConfigClick() {
            if(!this.row.id) {
                return this.$Message.warning("请至少选择一个用户");
            }
            this.selectRoleId = this.row.roleId;
            this.showModal = true;
        },
        saveRoleClick(done) {
            if(this.selectRoleId === '') {
                return this.$Message.warning("请至少选择一个角色");
            }
            setUserRole(this.row.id, this.selectRoleId).then(res=>{
                // 修改table数据
                let curRole = this.roles.filter(item => {
                    return item.id == this.selectRoleId;
                })
                if(curRole && curRole.length == 1) {
                    this.tableData.replaceByKey("id", this.row.id, { ...this.row, roleId: curRole[0].id, roleName: curRole[0].roleName });
                } else {
                    this.loadData();
                }
                done();
                this.$Message.success("保存成功");
            }).catch(err=>{
                done(false);
                console.error(err);
            })
        }
    }
}

/**
 * 
New Entity Creation Error: 15
  :OVA package create subtask failed with err code 4: Traceback (most recent call last):
  File "build/bdist.linux-x86_64/egg/anduril/tasks/anduril_base_rpc_task.py", line 71, in run
  File "build/bdist.linux-x86_64/egg/anduril/ova/create_task.py", line 60, in func_wrapper
  File "build/bdist.linux-x86_64/egg/anduril/ova/create_task.py", line 110, in _run
  File "build/bdist.linux-x86_64/egg/anduril/ova/create_task.py", line 415, in _convert_vm_spec_to_ovf
  File "build/bdist.linux-x86_64/egg/anduril/ova/ovf_descriptor.py", line 104, in convert_spec_to_xml
  File "build/bdist.linux-x86_64/egg/anduril/ova/ovf_descriptor.py", line 664, in _add_nic
  File "build/bdist.linux-x86_64/egg/anduril/ova/ovf_descriptor.py", line 204, in _create_hardware_elem
UnicodeEncodeError: 'ascii' codec can't encode characters in position 0-3: ordinal not in range(128)
 */
</script>

<style>

</style>