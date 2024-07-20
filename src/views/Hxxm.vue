<template>
    <div class="hxxms">
        <el-space direction="vertical" :size="20" style="width: 100%">
            <h1>横向项目管理</h1>
            <div style="text-align: right">
                <el-button type="primary" @click="onAdd">
                    <el-icon><plus /></el-icon>
                    添加横向项目
                </el-button>
            </div>
        </el-space>
        <el-table :data="hxxms" class="width: 100%" height="700" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <el-table-column 
                v-for="item in columns" :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                width="200px"
                
            >
                <template #default="scope">
                    <!-- 截断文本并显示省略号 -->
                    <span>{{ truncateText(scope.row[item.prop], 35) }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template #default="scope">
                    <el-button size="small" type="info" @click="onEdit(scope.$index)">编辑</el-button>  
                    <el-button size="small" type="danger" @click="onDelete(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <!-- 添加/编辑横向项目 -->
    <el-dialog v-model="FormVisible" :title="FormTitle">
        <el-form :model="form">
            <el-form-item label="项目名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入项目名称"/>
            </el-form-item>
            <el-form-item label="项目描述" prop="description">
                <el-input v-model="form.description" placeholder="请输入项目描述"/>
            </el-form-item>
            <el-form-item label="委托方" prop="client">
                <el-input v-model="form.client" placeholder="请输入委托方"/>
            </el-form-item>
            <el-form-item label="项目开始时间" prop="start_date">
                <el-date-picker v-model="form.start_date" type="date" clearable placeholder="请选择项目开始时间"/>
            </el-form-item>
            <el-form-item label="项目结束时间" prop="end_date">
                <el-date-picker v-model="form.end_date" type="date" clearable placeholder="请选择项目结束时间"/>
            </el-form-item>
            <el-form-item label="项目经理" prop="project_manager">
                <el-input v-model="form.project_manager" placeholder="请输入项目经理"/>
            </el-form-item>
            <el-form-item label="项目预算" prop="budget">
                <el-input v-model="form.budget" placeholder="请输入项目预算"/>
            </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="FormVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmFormSubmit">
              确定
            </el-button>
          </div>
        </template>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog v-model="deleteDialogVisible" title="删除项目" width="30%">
        <span>您确定要删除该项目吗？</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmDelete">
              确定
            </el-button>
          </div>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ElMessage } from "element-plus";
import { onMounted } from "vue";
import { ComponentInternalInstance, getCurrentInstance } from "vue";
import { ref } from "vue";
import type {Hxxm,table_col} from '@/utils/type'
const {proxy}=getCurrentInstance() as ComponentInternalInstance

const truncateText=(text:string,length:number)=>{
    if(text.length>length){
        return text.slice(0,length)+'...'
    }
    return text
}

// 添加横向项目
const initForm=(item?:Hxxm)=>{
    if(item){
        form.value.id=item.id
        form.value.name=item.name
        form.value.description=item.description
        form.value.client=item.client
        form.value.start_date=item.start_date
        form.value.end_date=item.end_date
        form.value.project_manager=item.project_manager
        form.value.budget=item.budget
        FormTitle.value='编辑横向项目'
    }else{
        form.value.name=''
        form.value.description=''
        form.value.client=''
        form.value.start_date=''
        form.value.end_date=''
        form.value.project_manager=''
        form.value.budget=0
        FormTitle.value='添加横向项目'
    }
}
const form=ref<Hxxm>({
    name:'',
    description:'',
    client:'',
    start_date:'',
    end_date:'',
    project_manager:'',
    budget:0
})

const FormVisible=ref(false)
const onAdd=()=>{
    initForm()
    FormVisible.value=true
}


// 编辑横向项目
const FormTitle=ref('添加横向项目')
const edit_index=ref(-1)
const onEdit=(index:number)=>{
    edit_index.value=index
    let hxxm_item=hxxms.value[edit_index.value]
    initForm(hxxm_item)
    FormVisible.value=true
}

const confirmFormSubmit=()=>{
    if(FormTitle.value=='添加横向项目'){
        proxy?.$http.add_hxxm(form.value).then((res:any)=>{
            if(res['data']['code']==200){
                let new_dict=res['data']['data']
                ElMessage.success('添加成功')
                hxxms.value.push(new_dict)
                FormVisible.value=false
            }
        }).catch((err:any)=>{
            ElMessage.error('添加失败')
            FormVisible.value=false
        })
    }else{
        proxy?.$http.edit_hxxm(form.value).then((res:any)=>{
            if(res['data']['code']==200){
                let new_dict=res['data']['data']
                hxxms.value.splice(edit_index.value,1,new_dict)
                ElMessage.success('编辑成功')
                FormVisible.value=false
            }
        }).catch((err:any)=>{
            ElMessage.error('编辑失败')
            FormVisible.value=false
        })
    }
}

// 删除数据集
const del_index=ref(-1)
const deleteDialogVisible=ref(false)
const onDelete=(index:number)=>{
    del_index.value=index
    deleteDialogVisible.value=true
}
const confirmDelete=()=>{
    let item=hxxms.value[del_index.value]
    proxy?.$http.delete_hxxm(item.id as number).then((res:any)=>{
        if(res['data']['code']==200){
            hxxms.value.splice(del_index.value,1)
            ElMessage.success('删除成功')
            deleteDialogVisible.value=false
        }
    }).catch((err:any)=>{
        ElMessage.error('删除失败')
    })
}


const hxxms=ref<Hxxm[]>([])

const getHxxm=()=>{
    proxy?.$http.get_hxxm().then((res:any)=>{
        if(res['data']['code']==200){
            hxxms.value=res['data']['data']
        }
    }).catch((err:any)=>{

    })
}
onMounted(()=>{
    getHxxm()
})


const columns=ref<table_col[]>([
    {
        label:'项目名称',
        prop:'name'
    },
    {
        label:'项目描述',
        prop:'description'
    },
    {
        label:'委托方',
        prop:'client'
    },
    {
        label:'项目开始时间',
        prop:'start_date'
    },
    {
        label:'项目结束时间',
        prop:'end_date'
    },
    {
        label:'项目预算',
        prop:'budget'
    },
    {
        label:'项目负责人',
        prop:'project_manager'
    },
    {
        label:'项目预算',
        prop:'budget'
    }
])
</script>

<style scoped>
.el-space {
    display: block;
}
.center-align {
   text-align: center !important;
}
</style>