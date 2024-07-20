<template>
    <div id="groups">
        <el-space direction="vertical" :size="20" style="width: 100%">
            <h1>新闻动态管理</h1>
            <div style="text-align: right">
                <el-button type="primary" @click="onAdd">
                    <el-icon><plus /></el-icon>
                    添加新闻动态
                </el-button>
            </div>
        </el-space>
        <el-table :data="news" class="width: 100%" height="700" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column 
                v-for="item in columns" :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                width="180px"
            />
            <el-table-column label="新闻图片" width="220px" >
                <template #default="scope">
                <img :src="formatImageUrl(scope.row.news_image_url)" alt="" style="height: 100px; width: auto; object-fit: cover;">
                </template>
            </el-table-column>
            <el-table-column label="新闻链接" width="220px">
                <template #default="scope">
                    <a :href="scope.row.news_link" target="_blank">{{
                    scope.row.news_link
                    }}</a>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template #default="scope">
                    <el-button size="small" type="info" @click="onEdit(scope.$index)">编辑</el-button>  
                    <!-- @click="handleEdit(scope.$index, scope.row)" -->
                    <el-button size="small" type="danger" @click="onDelete(scope.$index)">删除</el-button>
                    <!-- @click="handleDelete(scope.$index, scope.row)" -->
                </template>
              <!-- <template #default>
                <el-button link type="primary" size="small">编辑</el-button>
                <el-button link type="danger" size="small">删除</el-button>
              </template> -->
            </el-table-column>
        </el-table>
    </div>

<!-- 添加新闻表单 -->
<el-dialog v-model="FormVisible" :title="FormTitle">
    <el-form :model="form" >
        <el-form-item label="新闻标题" prop="news_title">
            <el-input v-model="form.news_title" placeholder="请输入新闻标题" />
        </el-form-item>
        <el-form-item label="新闻作者" prop="news_author">
            <el-input v-model="form.news_author" placeholder="请输入新闻作者" />
        </el-form-item>
        <el-form-item label="新闻内容" prop="news_content">
            <el-input v-model="form.news_content" type="textarea" rows="7" placeholder="请输入新闻内容" />
        </el-form-item>
        <!-- type="textarea" rows="5" -->
        <el-form-item label="新闻链接" prop="news_link">
            <el-input v-model="form.news_link" placeholder="请输入新闻链接" />
        </el-form-item>
        <el-form-item label="新闻标签" prop="label_id">
            <el-input v-model="form.label_id" placeholder="请输入新闻标签" />
        </el-form-item>
        <el-form-item label="数据集图片"  prop="news_image_url">
                <div style="display: flex;">
                        <el-input v-model="form.news_image_url" autocomplete="off" style="margin-right: 10px;"/>
                        <el-upload
                        :action="$http.server_host+'/cmsapi/news/img/upload'"
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
    <el-dialog
        v-model="deleteDialogVisible"
        title="提示"
        width="30%"
    >
        <span>您确定要删除该文章吗？</span>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="deleteDialogVisible=false">取消</el-button>
            <el-button type="primary" @click="confirmDelete">确定</el-button>
        </span>
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
import type {table_col,New} from "../utils/type"
const columns=ref<table_col[]>([
    {label:'新闻标题',prop:'news_title'},
    {label:'新闻日期',prop:'news_date'},
    {label:'新闻作者',prop:'news_author'},
    {label:'新闻阅读量',prop:'news_read_count'},
])

// 删除对话框
const del_index=ref(-1)
const deleteDialogVisible=ref(false)
const onDelete=(index:number)=>{
    del_index.value=index
    deleteDialogVisible.value=true
}
const confirmDelete=()=>{
    let item=news.value[del_index.value]
    proxy?.$http.deleteNews(+item.news_id).then((res:any)=>{
        if(res['data']['code']==200){
            news.value.splice(del_index.value,1)
            ElMessage.success('新闻删除成功')
            deleteDialogVisible.value=false
        }else{
            ElMessage.info(res['message'])
        }
    })
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

// 编辑新闻
const edit_index=ref(-1)
const FormTitle=ref('添加新闻')
const onEdit=(index:number)=>{
    edit_index.value=index
    let news_item=news.value[edit_index.value]
    initForm(news_item)
    FormVisible.value=true 
}
const initForm=(news_item?:New)=>{
    if(news_item){
        form.value.news_id=news_item.news_id
        form.value.news_title=news_item.news_title
        form.value.news_content=news_item.news_content
        form.value.news_author=news_item.news_author
        form.value.news_link=news_item.news_link
        form.value.news_image_url=news_item.news_image_url
        form.value.label_id=news_item.label_id
        FormTitle.value='编辑新闻'
    }else{
        form.value.news_title=''
        form.value.news_content=''
        form.value.news_author=''
        form.value.news_link=''
        form.value.news_image_url=''
        form.value.label_id=''
        FormTitle.value='添加新闻'
    }
}

// 添加新闻
const onAdd=()=>{
    initForm()
    FormVisible.value=true
}
const FormVisible=ref(false)

const form=ref<New>({
    news_id:'',
    news_title:'',
    news_content:'',
    news_author:'',
    news_link:'',
    news_image_url:'',
    label_id:''
})
const onImageUploadSuccess = (res: any) => {
    form.value.news_image_url = res.data.image_url;
    ElMessage.success('图片上传成功');
};
const onImageUploadError = (err: any) => {
    console.log(err)
    ElMessage.error('图片上传失败');
};
const confirmFormSubmit=()=>{
    if(FormTitle.value=='添加新闻'){
        proxy?.$http.addNews(form.value).then((res:any)=>{
            if(res['data']['code']==200){
                let new_dict=res.data.data
                ElMessage.success('新闻添加成功')
                FormVisible.value=false
                news.value.push(new_dict)
            }
        }).catch((err:any)=>{
            console.log(err)
            ElMessage.error("服务器开小差了，请稍后再试！")
            FormVisible.value=false
        })
    }else{
        proxy?.$http.editNews(form.value).then((res:any)=>{
            if(res['data']['code']==200){
                let new_dict=res.data.data
                //news.value[edit_index.value]=new_dict
                news.value.splice(edit_index.value,1,new_dict)
                ElMessage.success('新闻编辑成功')
                FormVisible.value=false
            }
        }).catch((err:any)=>{
            console.log(err)
            ElMessage.error("修改新闻失败！")
            FormVisible.value=false
        })
    }
}

const news=ref<New[]>([])
const get_news=(()=>{
    proxy?.$http.getNewsList().then((res:any)=>{
        let result=res.data
        let code=result.code
        if(code==200){
            news.value=result.data
        }
    })
})

onMounted(()=>{
    get_news()
})
</script>

