<template>
    <div class="hxxms">
        <el-space direction="vertical" :size="20" style="width: 100%">
            <h1>纵向项目管理</h1>
            <div style="text-align: right">
                <el-button type="primary" @click="onAdd">
                    <el-icon><plus /></el-icon>
                    添加纵向项目
                </el-button>
            </div>
        </el-space>
        <el-table :data="zxxms" class="width: 100%" height="700" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
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

     <!-- 添加/编辑纵向项目 -->
     <el-dialog v-model="FormVisible" :title="FormTitle">
        <el-form :model="form">
            <el-form-item label="项目名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入项目名称"/>
            </el-form-item>
            <el-form-item label="项目描述" prop="description">
                <el-input v-model="form.description" placeholder="请输入项目描述"/>
            </el-form-item>
            <el-form-item label="资助机构" prop="funding_agency">
                <el-input v-model="form.funding_agency" placeholder="请输入资助机构"/>
            </el-form-item>
            <el-form-item label="项目开始时间" prop="start_date">
                <el-date-picker v-model="form.start_date" type="date" clearable placeholder="请选择项目开始时间"/>
            </el-form-item>
            <el-form-item label="项目结束时间" prop="end_date">
                <el-date-picker v-model="form.end_date" type="date" clearable placeholder="请输入项目结束时间"/>
            </el-form-item>
            <el-form-item label="项目负责人" prop="principal_investigator">
                <el-input v-model="form.principal_investigator" placeholder="请输入项目负责人"/>
            </el-form-item>
            <el-form-item label="项目预算" prop="budget">
                <el-input v-model="form.budget" placeholder="请输入项目预算"/>
            </el-form-item>
            <el-form-item label="项目状态" prop="status">
                <el-input v-model="form.status" placeholder="请输入项目状态"/>
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
import type {Zxxm,table_col} from '@/utils/type'
const {proxy}=getCurrentInstance() as ComponentInternalInstance
const truncateText=(text:string,length:number)=>{
    if(text.length>length){
        return text.slice(0,length)+'...'
    }
    return text
}

// 添加纵向项目
const initForm=(item?:Zxxm)=>{
    if(item){
        form.value.id=item.id
        form.value.name=item.name
        form.value.description=item.description
        form.value.start_date=item.start_date
        form.value.end_date=item.end_date
        form.value.funding_agency=item.funding_agency
        form.value.principal_investigator=item.principal_investigator
        form.value.status=item.status
        form.value.budget=item.budget
        FormTitle.value='编辑纵向项目'
    }else{
        form.value.name=''
        form.value.description=''
        form.value.start_date=''
        form.value.end_date=''
        form.value.funding_agency=''
        form.value.principal_investigator=''
        form.value.status=''
        form.value.budget=0
        FormTitle.value='添加纵向项目'
    }
}
const form=ref<Zxxm>({
    name:'',
    description:'',
    start_date:'',
    end_date:'',
    funding_agency:'',
    principal_investigator:'',
    status:'',
    budget:0
})


const FormVisible=ref(false)
const onAdd=()=>{
    initForm()
    FormVisible.value=true
}


// 编辑纵向项目
const FormTitle=ref('添加纵向项目')
const edit_index=ref(-1)
const onEdit=(index:number)=>{
    edit_index.value=index
    let zxxm_item=zxxms.value[edit_index.value]
    initForm(zxxm_item)
    FormVisible.value=true
}

const confirmFormSubmit=()=>{
    if(FormTitle.value=='添加纵向项目'){
        proxy?.$http.add_zxxm(form.value).then((res:any)=>{
            if(res['data']['code']==200){
                let new_dict=res['data']['data']
                ElMessage.success('添加成功')
                zxxms.value.push(new_dict)
                FormVisible.value=false
            }
        }).catch((err:any)=>{
            ElMessage.error('添加失败')
            FormVisible.value=false
        })
    }else{
        //console.log(form.value.end_date)
        proxy?.$http.edit_zxxm(form.value).then((res:any)=>{
            if(res['data']['code']==200){
                let new_dict=res['data']['data']
                zxxms.value.splice(edit_index.value,1,new_dict)
                ElMessage.success('编辑成功')
                FormVisible.value=false
            }
        }).catch((err:any)=>{
            ElMessage.error('编辑失败')
            FormVisible.value=false
        })
    }
}


// 删除纵向项目
const del_index=ref(-1)
const deleteDialogVisible=ref(false)
const onDelete=(index:number)=>{
    del_index.value=index
    deleteDialogVisible.value=true
}

const confirmDelete=()=>{
    let item=zxxms.value[del_index.value]
    proxy?.$http.delete_zxxm(item.id as number).then((res:any)=>{
        if(res['data']['code']==200){
            zxxms.value.splice(del_index.value,1)
            ElMessage.success('删除成功')
            deleteDialogVisible.value=false
        }
    }).catch((err:any)=>{
        ElMessage.error('删除失败')
    })
}




const zxxms=ref<Zxxm[]>([])
const getZxxm=()=>{
    proxy?.$http.get_zxxm().then((res:any)=>{
        if(res['data']['code']==200){
            zxxms.value=res['data']['data']
        }
    }).catch((err:any)=>{

    })
}

onMounted(()=>{
    getZxxm()
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
        label:'资助机构',
        prop:'funding_agency'
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
        label:'项目负责人',
        prop:'principal_investigator'
    },
    {
        label:'项目预算',
        prop:'budget'
    },
    {
        label:'项目状态',
        prop:'status'
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