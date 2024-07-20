<template>
  <div>
    <el-space direction="vertical" :size="20">
      <h1>论文管理</h1>
      <div style="text-align: right">
          <el-button type="primary" @click.prevent="onAdd">
              <el-icon><plus /></el-icon>
              添加论文
          </el-button>
      </div>
    </el-space>
    <el-table :data="papers" height="700" class="width: 100%" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
      <!-- <el-table-column label="标题">
        <template #default="scope">
          <a :href="$http.server_host + '/papers/detail/' + scope.row.papers_id" target="_blank">{{
            scope.row.title
          }}</a>
        </template>
      </el-table-column> -->
      <el-table-column 
                v-for="item in columns" :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                width="200px"
      >
        <template #default="scope">
          <!-- 截断文本并显示省略号 -->
          <span>{{ truncateText(scope.row[item.prop], 50) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面" width="220px" >
            <template #default="scope">
            <img :src="formatImageUrl(scope.row.image_url)" alt="" style="height: 100px; width: auto; object-fit: cover;">
            </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template #default="scope">
          <el-button type="info" size="small" @click="onEdit(scope.$index)">编辑</el-button>
          <el-button  type="danger"  size="small"  @click="onDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-button>
      <a href="/paper_add" target="_blank">添加论文</a>
    </el-button> -->
  </div>

  <!-- 删除帖子确认对话框 -->
  <el-dialog
    v-model="confirmDialogVisible"
    title="提示"
    width="30%"
  >
    <span>您确定要删除该文章吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <div class="pagination-container">
    <el-pagination 
    background 
    layout="prev, pager, next" 
    :total="total_count" 
    :current-page="currentpage"
    @current-change="onPageChanged"
    />
  </div>
  <!-- :current-page="currentpage" 
    @current-change="onPageChanged(currentpage)" -->
</template>


<script lang="ts">
import {Delete} from "@element-plus/icons";
import { ElMessage } from 'element-plus';
import { de } from "element-plus/es/locale";
import {defineComponent,onMounted,ref,reactive} from "vue";
import { ComponentInternalInstance, getCurrentInstance } from "vue";
import type {paper,table_col} from '../utils/type'
import { useRouter } from 'vue-router';
import {truncateText} from '../utils/hooks'

export default defineComponent({
  setup(){
    // 图片地址规范化
    const formatImageUrl=(image_url:string)=>{
        if(image_url.startsWith('http')){
          return image_url
        }else{
          return proxy?.$http.server_host+image_url
        }
    }

    const router=useRouter()
    const {proxy}=getCurrentInstance() as ComponentInternalInstance

    // 添加文章
    const onAdd=()=>{
      router.push({
        path:'/paper_add',
        query:{
          title:'add',
          id:'0'
        }
      })
    }  

    // 编辑文章
    const onEdit=(index:number)=>{
      let id=papers.value[index].papers_id
      router.push({
        path:'/paper_add',
        query:{
          title:'edit',
          id:id
        }
      })
    }

    let papers=ref<paper[]>([])
    let deletingIndex:number=0;
    const total_count=ref(0);
    const currentpage=ref(1);
    const confirmDialogVisible=ref(false);
    const onPageChanged=(page:number)=>{
      getPapers(page)
    }
    const onDelete=(index:number)=>{
      confirmDialogVisible.value = true;
      deletingIndex=index;
    }
    const confirmDelete=()=>{
       let item=papers.value[deletingIndex]
       proxy?.$http.deletePapers(item.papers_id).then((res:any)=>{
           if(res['data']['code']==200){
              papers.value.splice(deletingIndex,1)
              ElMessage.success("论文删除成功!")
              confirmDialogVisible.value=false
           }else{
              ElMessage.info(res['message'])
              confirmDialogVisible.value=false
           }
       })
    }
    const getPapers=(page:number)=>{
      proxy?.$http.getPapersList(page).then((res:any)=>{
          if(res['data']['code']==200){ 
            let data=res['data']['data']
            papers.value=data['papers_list']
            total_count.value=data['total_count']
            currentpage.value=data['page']
          }
      })
    }
    const columns=ref<table_col[]>([
      {label:'标题',prop:'title'},
      {label:'作者',prop:'author'},
      {label:'摘要',prop:'abstract'},
      {label:'关键词',prop:'keywords'},
      {label:'内容',prop:'content'},
      {label:'发布时间',prop:'create_time'},
    ])
    onMounted(()=>{
        getPapers(1)
    })
    return{
      columns,
      papers,
      total_count,
      currentpage,
      confirmDialogVisible,
      onDelete,
      confirmDelete,
      onPageChanged,
      formatImageUrl,
      onAdd,
      onEdit,
      truncateText
    }
  }
})
</script>

<style scoped>
.el-space {
    display: block;
}
.center-align {
   text-align: center !important;
}
.pagination-container {
  display: flex;
  justify-content: center;
  /* 如果需要垂直居中，可以添加 align-items: center; */
}
</style>
