<template>
    <div id="groups">
        <el-space direction="vertical" :size="20" style="width: 100%">
            <h1>新闻动态管理</h1>
            <div style="text-align: right">
                <el-button type="primary" >
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
                    <el-button size="small" type="danger">删除</el-button>
                    <!-- @click="handleDelete(scope.$index, scope.row)" -->
                </template>
              <!-- <template #default>
                <el-button link type="primary" size="small">编辑</el-button>
                <el-button link type="danger" size="small">删除</el-button>
              </template> -->
            </el-table-column>
        </el-table>
    </div>
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



const {proxy}=getCurrentInstance() as ComponentInternalInstance
// 图片地址规范化
const formatImageUrl=(image_url:string)=>{
    if(image_url.startsWith('http')){
         return image_url
    }else{
         return proxy?.$http.server_host+image_url
    }
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

