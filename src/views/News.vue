<template>
    <div id="groups">
        <el-space direction="vertical" :size="20" style="width: 100%">
            <h1>新闻动态管理</h1>
            <div style="text-align: right">
                <el-button type="primary" @click="FormVisible=true">
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
                    <el-button size="small" type="info">编辑</el-button>  
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
<el-dialog v-model="FormVisible" title="添加新闻">
    <el-form :model="form" >
        <el-form-item label="新闻标题" prop="news_title">
            <el-input v-model="form.news_title" placeholder="请输入新闻标题" />
        </el-form-item>
        <!-- 新闻作者 -->
        <el-form-item label="新闻作者" prop="news_author">
            <el-input v-model="form.news_author" placeholder="请输入新闻作者" />
        </el-form-item>
        <el-form-item label="新闻内容" prop="news_content">
            <el-input v-model="form.news_content" type="textarea" rows="5" placeholder="请输入新闻内容" />
        </el-form-item>
        <!-- type="textarea" rows="5" -->
        <el-form-item label="新闻链接" prop="news_link">
            <el-input v-model="form.news_link" placeholder="请输入新闻链接" />
        </el-form-item>
        <el-form-item label="新闻标签" prop="label_id">
            <el-input v-model="form.label_id" placeholder="请输入新闻标签" />
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

// 表格column
interface table_col{
    label:string,
    prop:string,
}
const columns=ref<table_col[]>([
    {
        label:'新闻标题',
        prop:'news_title'
    },
    {
        label:'新闻日期',
        prop:'news_date'
    },
    {
        label:'新闻作者',
        prop:'news_author'
    },
    {
        label:'新闻阅读量',
        prop:'news_read_count'
    },
    // {
    //     label:'新闻标签',
    //     prop:'label_id'
    // },
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

// 新闻表单
const FormVisible=ref(false)
interface Form{
    news_title:string,
    news_content:string,
    news_author:string,
    news_link:string,
    news_image_url:string,
    label_id:string
}
const form=ref<Form>({
    news_title:'',
    news_content:'',
    news_author:'',
    news_link:'',
    news_image_url:'/media/news/1.png',
    label_id:''
})
const onImageUploadSuccess = (response: any) => {
// console.log(response)
    let image_name=response.data.image_url
    form.value.news_image_url="/media/papers/"+image_name
};
const onImageUploadError = (err: any) => {
    console.log(err)
};
const confirmFormSubmit=()=>{
    //console.log(form.value)
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

}
interface New {
    news_id:string,
    news_title:string,
    news_content:string,
    news_date:string,
    news_author:string,
    news_link:string,
    news_read_count:string,
    news_image_url:string,
    label_id:string
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

