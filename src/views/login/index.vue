<template>
    <div class="system">
        <div class="system-title">欢迎使用电子门禁控制系统</div>
        <Card dis-hover class="login-card">
            <div class="login-title">登 录</div>
			<div class="login-content">
				<Form ref="formItem" :label-width="80" :model="formItem" :rules="rules">
					<FormItem label="账户" prop="username">
						<Input size="large" maxlength="20" placeholder="用户名/手机号/邮箱" v-model="formItem.username"/>
					</FormItem>
					<FormItem label="密码" prop="password">
						<Input size="large" type="password" maxlength="20" placeholder="密码" v-model="formItem.password"/>
					</FormItem>
					<div class="login-forget">
						<Button size="small" type="text">忘记密码？</Button>
					</div>
				</Form>
			</div>
			<div class="login-footer">
				<Button size="large" type="primary" :loading="loading" @click="clickLogin">立 即 登 录</Button>
			</div>
        </Card>
    </div>
</template>

<script>
import { login } from "@/api/user/auth";
import { setToken } from "@/common/utils/token";

export default {
	data() {
		return {
			loading: false,
			formItem: {
				username: '',
				password: '',
			},
			rules: {
				username: [ { required: true, message: '请输入账户', trigger: 'blur' } ],
				password: [ { required: true, message: '请输入密码', trigger: 'blur' } ],
			}
		}
	},
	methods: {
		clickLogin() {
			this.checkForm().before(()=>{
				this.loading = true;
			}).then(res=>{
				return login(this.formItem);
			}).then(res=> {
				setToken(res.access_token, res.expires_in / 3600);
				this.$router.push({ name: 'home' })
			}).catch(err=>{
				console.error(err);
			}).finally(rs=>{
				this.loading = false;
			})
		},
		checkForm() {
			return new Promise((resolve, reject) => {
				this.$refs['formItem'].validate((valid) => {
					return valid ? resolve() : reject();
				});
			})
			
		}
	}
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
	
	.login-card {
		width: 512px;
		margin-top: 30px;
		.login-title {
			font-size: 20px;
			text-align: center;
			font-weight: bold;
		}
		.login-content {
			padding: 20px 20px 0;
			.login-forget {
				display: flex;
				justify-content: right;
			}
			/deep/ .ivu-form-item:nth-child(2) {
				margin-bottom: 0;
			}
		}
		.login-footer {
			margin-top: 30px;
			display: flex;
			justify-content: center;
		}
	}
}


</style>