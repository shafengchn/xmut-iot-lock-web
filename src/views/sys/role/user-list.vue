<template>
    <Row style="padding: 10px">
        <Col span="24">
            <Button type="warning" size="small" @click="bindClick">绑定用户</Button>
            <Table :loading="loading" :data="tableData" :columns="columns" class="mt-10" size="small">
                <template slot="opt" slot-scope="{ row }">
                    <Button type="error" size="small" @click="removeClick(row)">移除</Button>
                </template>
            </Table>
        </Col>
        <FromModal v-model="showModal" title="绑定用户"></FromModal>
    </Row>
</template>

<script>
import { pageUserByRoleId } from "@/api/user/user";
import FromModal from "@/components/form-modal";

export default {
    components: {
        FromModal
    },
    props: {
        roleId: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            columns: [
                { title: '姓名', key:'name',  },
                { title: '部门', key:'deptName',  },
                { title: '操作', slot:'opt', width: 180  },
            ],
            loading: false,
            page: {
                current: 1,
                size: 30,
                total: 0,
            },
            tableData: [],
            showModal: false,
        }
	},
    watch: {
		roleId (newVal, oldVal) {
			if(newVal !== oldVal) {
				this.loadData();
            }
        }
    },
	created() {
		this.loadData();
	},
    methods: {
        loadData() {
            this.loading = true;
            pageUserByRoleId({ ...this.page, roleId: this.roleId }).before(() => {
                this.loading = false;
            }).then(res=>{
                this.tableData = res.data.records;
                this.page.total = parseInt(res.data.total);
                this.page.current = parseInt(res.data.current);
            }).catch(err=>{
                console.error(err);
            })
        },
        bindClick() {
            this.showModal = true;
        },
        removeClick(item) {
            
        }
    }
}
</script>

<style lang="less" scoped>

</style>