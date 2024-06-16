<template>
    <div id="groups">
        <el-space direction="vertical" :size="20" style="width: 100%">
            <h1>数据集管理</h1>
            <div style="text-align: right">
                <el-button type="primary" >
                    <el-icon><plus /></el-icon>
                    添加数据集
                </el-button>
            </div>
        </el-space>
        <el-table :data="datasets" class="width: 100%" height="700" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column 
                v-for="item in columns" :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                width="200px"
            />
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
        label:'数据集名称',
        prop:'data_title'
    },
    {
        label:'数据集简介',
        prop:'data_content'
    },
    {
        label:'数据集作者',
        prop:'data_author'
    },
    {
        label:'数据集日期',
        prop:'data_date'
    },
    {
        label:'数据集阅读量',
        prop:'data_read_count'
    },
    {
        label:'数据集类型',
        prop:'data_type'
    }
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
interface Dataset {
    data_id:string,
    data_title:string,
    data_content:string,
    data_author:string,
    data_date:string,
    data_link:string,
    data_read_count:string,
    data_image_url:string,
    data_type:string
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

