<template>
    <div id="groups">
        <el-space direction="vertical" :size="20" style="width: 100%">
            <h1>团队信息管理</h1>
            <div style="text-align: right">
                <el-button type="primary" >
                    <el-icon><plus /></el-icon>
                    添加团队信息
                </el-button>
            </div>
        </el-space>
        <el-table :data="groups" class="width: 100%" height="700" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column 
                v-for="item in columns" :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                width="200px"
            />
            <el-table-column label="图片" width="220px" >
                <template #default="scope">
                <img :src="formatImageUrl(scope.row.group_person_image_url)" alt="" style="height: 100px; width: auto; object-fit: cover;">
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
        label:'姓名',
        prop:'group_person_name'
    },
    {
        label:'团队',
        prop:'group_type'
    }
    ,
    {
        label:'职位',
        prop:'group_role'
    },
    {
        label:'简介',
        prop:'group_person_description'
    },
    {
        label:'个人描述',
        prop:'group_person_content'
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
interface Group {
    group_id:number,
    group_type:string,
    group_role:string,
    group_person_name:string,
    group_person_description:string,
    group_person_image_url:string,
    group_person_content:string,
    group_person_papers:string
}
const groups=ref<Group[]>([])
const get_groups=(()=>{
    proxy?.$http.getGroupList().then((res:any)=>{
        let result=res.data
        let code=result.code
        if(code==200){
            groups.value=result.data
        }
    })
})

onMounted(()=>{
    get_groups()
})
</script>

