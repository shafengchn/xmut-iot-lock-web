<template>
    <div>
		<Card dis-hover>
			<OptionGroup @on-add="addClick"></OptionGroup>
			<Table :columns="columns" :data="tableData"></Table>
		</Card>
		<FormModal v-model="showModal" :title="action ? '新增' : '修改'">
			<Form ref="00" :model="formItem" :rules="rules" :label-width="100">
				<FormItem label="参数名" prop="paramName">
					<Input v-model="formItem.paramName" />
				</FormItem>
				<FormItem label="参数值" prop="paramValue">
					<Input v-model="formItem.paramValue" />
				</FormItem>
				<FormItem label="排序" prop="sort">
					<InputNumber v-model="formItem.sort" :max="2147483647" :min="-2147483648" />
				</FormItem>
				<FormItem label="备注" prop="sort">
					<Input v-model="formItem.remark" type="textarea" />
				</FormItem>
			</Form>
		</FormModal>
	</div>
</template>

<script>
import OptionGroup from "@/components/option-group/index";
import FormModal from "@/components/form-modal/index";
import { listParamByParentId } from "@/api/sys/param";

export default {
	components: {
		OptionGroup,
		FormModal
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
				{ type: 'expand', width: 120 },
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

			},
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		addClick() {
			this.action = 'add';
			this.showModal = true;
		},
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
	}
}
</script>

<style>

</style>