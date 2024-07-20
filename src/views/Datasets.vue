<template>
    <div id="groups">
        <el-space direction="vertical" :size="20" style="width: 100%">
            <h1>数据集管理</h1>
            <div style="text-align: right">
                <el-button type="primary" @click="onAdd">
                    <el-icon><plus /></el-icon>
                    添加数据集
                </el-button>
            </div>
        </el-space>
        <el-table :data="datasets" class="width: 100%" height="700" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <el-table-column 
                v-for="item in columns" :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                width="200px"
            >
                <template #default="scope">
                    <span>{{ truncateText(scope.row[item.prop],50) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="数据集图片" width="220px" >
                <template #default="scope">
                <img :src="formatImageUrl(scope.row.data_image_url)" alt="" style="height: 100px; width: auto; object-fit: cover;">
                </template>
            </el-table-column>
            <el-table-column label="数据集链接" width="220px">
                <template #default="scope">
                    <a :href="scope.row.data_link" target="_blank">{{
                    scope.row.data_link
                    }}</a>
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

    <!-- 添加数据集 -->
    <el-dialog v-model="FormVisible" :title="FormTitle">
        <el-form :model="form">
            <el-form-item label="数据集名称" prop="data_title">
                <el-input v-model="form.data_title" placeholder="请输入数据集名称"/>
            </el-form-item>
            <el-form-item label="数据集简介" prop="data_abstract">
                <el-input v-model="form.data_abstract" type="textarea" rows="3" placeholder="请输入数据集简介"/>
            </el-form-item>
            <el-form-item label="数据集内容" prop="data_content">
                <el-input v-model="form.data_content" type="textarea" rows="5" placeholder="请输入数据集内容"/>
            </el-form-item>
            <el-form-item label="数据集作者" prop="data_author">
                <el-input v-model="form.data_author" placeholder="请输入数据集作者"/>
            </el-form-item>
            <el-form-item label="数据集类型" prop="data_type">
                <el-select v-model="form.data_type" placeholder="请选择数据集类型">
                    <el-option label="医学图像" value="medicalimage"></el-option>
                    <el-option label="多组学分析" value="multiomicsanalysis"></el-option>
                    <el-option label="关联预测" value="correlationprediction"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据集链接" prop="data_link">
                <el-input v-model="form.data_link" placeholder="请输入数据集链接"/>
            </el-form-item>
            <el-form-item label="数据集图片"  prop="data_image_url">
                <div style="display: flex;">
                        <el-input v-model="form.data_image_url" autocomplete="off" style="margin-right: 10px;"/>
                        <el-upload
                        :action="$http.server_host+'/cmsapi/datasets/img/upload'"
                        name="image"
                        :show-file-list="false"
                        accept="image/jpeg,image/png"
                        :on-success="onImageUploadSuccess"
                        :on-error="onImageUploadError"
                        >
                        <el-button type="primary" >上传图片</el-button>
                        </el-upload>
                </div>
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
    <el-dialog v-model="deleteDialogVisible" title="删除数据集" width="30%">
        <span>您确定要删除该数据集吗？</span>
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

<style scoped>
.el-space {
    display: block;
}
.center-align {
   text-align: center !important;
}
</style>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted } from "vue";
import { ComponentInternalInstance, getCurrentInstance } from "vue";
import { ref } from "vue";
import type { table_col,Dataset} from '../utils/type'
import {truncateText} from '../utils/hooks'

const columns=ref<table_col[]>([
    {label:'数据集名称',prop:'data_title'},
    {label:'数据集简介',prop:'data_abstract'},
    {label:'数据集内容',prop:'data_content'},
    {label:'数据集作者',prop:'data_author'},
    {label:'数据集日期',prop:'data_date'},
    {label:'数据集阅读量',prop:'data_read_count'},
    {label:'数据集类型',prop:'data_type'}
])

// 删除数据集
const del_index=ref(-1)
const deleteDialogVisible=ref(false)
const onDelete=(index:number)=>{
    del_index.value=index
    deleteDialogVisible.value=true
}
const confirmDelete=()=>{
    let item=datasets.value[del_index.value]
    proxy?.$http.deleteDataset(+item.data_id).then((res:any)=>{
        if(res['data']['code']==200){
            datasets.value.splice(del_index.value,1)
            ElMessage.success('数据集删除成功')
            deleteDialogVisible.value=false
        }else{
            ElMessage.info(res['message'])
        }
    })
}
// 修改数据集
const FormTitle=ref('添加数据集')
const edit_index=ref(-1)
const onEdit=(index:number)=>{
    edit_index.value=index
    let datasets_item=datasets.value[edit_index.value]
    initForm(datasets_item)
    FormVisible.value=true
}
const initForm=(item?:Dataset)=>{
    if(item){
        form.value.data_id=item.data_id
        form.value.data_title=item.data_title
        form.value.data_abstract=item.data_abstract
        form.value.data_content=item.data_content
        form.value.data_author=item.data_author
        form.value.data_link=item.data_link
        form.value.data_image_url=item.data_image_url
        form.value.data_type=item.data_type
        FormTitle.value='修改数据集'
    }else{
        form.value.data_title=''
        form.value.data_abstract=''
        form.value.data_content=''
        form.value.data_author=''
        form.value.data_link=''
        form.value.data_image_url=''
        form.value.data_type=''
        FormTitle.value='添加数据集'
    }
}

// 添加数据集
const onAdd=()=>{
    initForm()
    FormVisible.value=true
}
const FormVisible=ref(false)

const form=ref<Dataset>({
    data_id:'',
    data_title:'',
    data_abstract:'',
    data_content:'',
    data_author:'',
    data_link:'',
    data_image_url:'',
    data_type:''
})
const onImageUploadSuccess=(res:any)=>{
    form.value.data_image_url=res.data.image_url
    ElMessage.success('图片上传成功')
}
const onImageUploadError=(err:any)=>{
    console.log(err)
    ElMessage.error('图片上传失败')
}
const confirmFormSubmit=()=>{
    if(FormTitle.value=='添加数据集'){
        proxy?.$http.addDataset(form.value).then((res:any)=>{
            if(res['data']['code']==200){
                let new_dict=res.data.data
                ElMessage.success('添加数据集成功')
                FormVisible.value=false
                datasets.value.push(new_dict)
            }
        }).catch((err:any)=>{
            console.log(err)
            ElMessage.error('添加数据集失败')
            FormVisible.value=false
        })
    }else{
        proxy?.$http.editDataset(form.value).then((res:any)=>{
            if(res['data']['code']==200){
                let new_dict=res.data.data
                datasets.value.splice(edit_index.value,1,new_dict)
                ElMessage.success('修改数据集成功')
                FormVisible.value=false
            }
        }).catch((err:any)=>{
           console.log(err)
           ElMessage.error('修改数据集失败')
           FormVisible.value=false
        })
    }
}

const {proxy}=getCurrentInstance() as ComponentInternalInstance
// 图片地址规范化
const formatImageUrl=(image_url:string)=>{
    if(image_url.startsWith('http')){
         return image_url
    }else{
         return proxy?.$http.server_host+image_url
    }
}

const datasets=ref<Dataset[]>([])
const get_datasets=(()=>{
    proxy?.$http.getDatasetsList().then((res:any)=>{
        let result=res.data
        let code=result.code
        if(code==200){
            datasets.value=result.data
        }
    })
})

onMounted(()=>{
    get_datasets()
})
</script>

