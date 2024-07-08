<template>
    <div id="groups">
        <el-space direction="vertical" :size="20" style="width: 100%">
            <h1>团队信息管理</h1>
            <div style="text-align: right">
                <el-button type="primary" @click="FormVisible=true">
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

<!-- 添加团队成员 -->
<el-dialog v-model="FormVisible" title="添加团队成员">
    <el-form :model="form">
        <el-form-item label="团队类型" prop="group_type">
            <el-input v-model="form.group_type" placeholder="请输入团队类型" />
        </el-form-item>
        <el-form-item label="职位" prop="group_role">
            <el-input v-model="form.group_role" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="姓名" prop="group_person_name">
            <el-input v-model="form.group_person_name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="简介" prop="group_person_description">
            <el-input v-model="form.group_person_description" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="个人描述" prop="group_person_content">
            <el-input v-model="form.group_person_content" type="textarea" rows="5" placeholder="请输入个人描述" />
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
        <span>您确定要删除该团队成员吗？</span>
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

// 删除对话框
const del_index=ref(-1)
const deleteDialogVisible=ref(false)
const onDelete=(index:number)=>{
    del_index.value=index
    deleteDialogVisible.value=true
}
const confirmDelete=()=>{
    let item=groups.value[del_index.value]
    proxy?.$http.deleteGroups(item.group_id).then((res:any)=>{
        if(res['data']['code']==200){
            groups.value.splice(del_index.value,1)
            ElMessage.success('新闻删除成功')
            deleteDialogVisible.value=false
        }else{
            ElMessage.info(res['message'])
        }
    })
}

// 添加团队成员
const FormVisible=ref(false)
interface Form{
    group_type:string,
    group_role:string,
    group_person_name:string,
    group_person_description:string,
    group_person_image_url:string,
    group_person_content:string,
    // group_person_papers:string
}
const form=ref<Form>({
    group_type:'',
    group_role:'',
    group_person_name:'',
    group_person_description:'',
    group_person_content:'',
    group_person_image_url:'/media/group/person1.jpg',
    // group_person_papers:''
})
const confirmFormSubmit=()=>{
    //console.log(form.value)
    proxy?.$http.addGroups(form.value).then((res:any)=>{
        if(res['data']['code']==200){
            let group_dict=res.data.data
            ElMessage.success('团队成员添加成功')
            FormVisible.value=false
            groups.value.push(group_dict)
        }
    }).catch((err:any)=>{
        console.log(err)
        ElMessage.error('添加失败')
        FormVisible.value=false
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

