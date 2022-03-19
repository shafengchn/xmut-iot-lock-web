<template>
    <div>
		<Card dis-hover>
			<OptionGroup @on-add="addClick" @on-edit="editClick" @on-delete="deleteClick" size="small"></OptionGroup>
			<Table :columns="columns" :data="tableData" highlight-row stripe size="small" @on-row-click="rowClick" class="inner-table"></Table>
		</Card>
		<FormModal v-model="showModal" :title="action ? '新增' : '修改'" @on-ok="saveClick">
			<Form ref="formItem" :model="formItem" :rules="rules" :label-width="100">
				<FormItem label="参数名" prop="paramName">
					<Input v-model="formItem.paramName" />
				</FormItem>
				<FormItem label="参数值" prop="paramValue">
					<Input v-model="formItem.paramValue" />
				</FormItem>
				<FormItem label="排序" prop="sort">
					<InputNumber v-model="formItem.sort" :max="2147483647" :min="-2147483648" />
				</FormItem>
				<FormItem label="备注" prop="remark">
					<Input v-model="formItem.remark" type="textarea" />
				</FormItem>
			</Form>
		</FormModal>
	</div>
</template>

<script>
import OptionGroup from "@/components/option-group/index";
import FormModal from "@/components/form-modal/index";
import { listParamByParentId, saveOrUpdate, removeById } from "@/api/sys/param";
import ParamPanel from "./index";

export default {
	components: {
		OptionGroup,
		FormModal,
	},
	props: {
		parentId: { 
			type: String,
			default: ''
		}
	},
	data() {
		return {
			showModal: false,
			action: 'add',
			columns: [
				{
					type: 'expand', 
					width: 50,
                    render: (h, { row }) => {
                        return h(ParamPanel, {
                            props: {
                                parentId: row.id
                            }
                        });
                    }
				},
				{ title: '参数名', key: 'paramName' },
				{ title: '参数值', key: 'paramValue' },
				{ title: '更新时间', key: 'updateTime' },
			],
			tableData: [],
			loading: false,
			formItem: {
				paramName: '',
				paramValue: '',
				remark: '',
				parentId: this.parentId,
				sort: 0,
				createTime: '',
				updateTime: '',
			},
			rules: {
				paramName: [
					{ required: true, message: '参数名不能为空', trigger: 'blur' }
				],
				paramValue: [
					{ required: true, message: '参数值不能为空', trigger: 'blur' }
				]
			},
			row: {},
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loading = true;
			listParamByParentId(this.parentId).before(()=>{
				this.loading = false;
			}).then(res => {
				this.tableData = res.data;
			}).catch(err=>{
				console.error(err);
			})
		},
		rowClick(row) {
			this.row = { ...row };
		},
		addClick() {
			this.action = 'add';
			this.showModal = true;
			this.$refs['formItem'].resetFields();
			this.formItem.parentId = this.parentId;
			this.formItem.sort = 0;
		},
		editClick() {
			if(!this.row.id) {
				return this.$Message.warning("请至少选择一行");
			}
			this.action = "edit";
			this.formItem = { ...this.row };
			this.showModal = true;
			this.$refs['formItem'].resetFields();
		},
		saveClick(done) {
			this.$refs['formItem'].validate(valid => {
				console.log(done);
				if(valid) {
					saveOrUpdate(this.formItem).then(res=> {
						done();
						this.$Message.success("保存成功");
						if(this.action == 'add') {
							this.tableData.push(res.data);
						} else {
							this.tableData.replaceByKey("id", res.data.id, res.data);
						}
					}).catch(err=>{
						console.error(err);
						done(false);
					})
				} else {
					done(false);
				}
			})
		},
		deleteClick() {
			if(!this.row.id) {
				return this.$Message.warning("请至少选择一行");
			}
			this.$Modal.confirm({
				title: `您确定要删除[${this.row.paramName}]吗？`,
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
			});
		}
	}
}
</script>

<style lang="less" scoped>
.inner-table /deep/ .ivu-table-expanded-cell {
    padding: 20px 20px;
}
</style>
