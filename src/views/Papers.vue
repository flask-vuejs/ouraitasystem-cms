<template>
  <div>
    <el-space direction="vertical" :size="20">
      <h1>帖子管理</h1>
      <el-table :data="papers" style="width: 100%">
        <el-table-column label="标题">
          <!-- scope是一个对象，它包含了当前行的数据（通过scope.row访问）以及其它可能有用的属性或方法，用于在模板内部访问和操作数据 -->
          <template #default="scope">
            <a :href="$http.server_host + '/papers/list/' + scope.row.papers_id" target="_blank">{{
              scope.row.title
            }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="发布时间" width="180" />
        <el-table-column prop="image_url" label="封面图片地址" />
        <el-table-column prop="author" label="作者" />
        <!-- prop="":指定该列数据的绑定字段;label="":指定了该列的标题 -->
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="danger"
              circle
              size="small"
              @click="onDeletePostClick(scope.$index)"
            >
              <el-icon><delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-space>

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
        <el-button type="primary" @click="onConfirmDeletePostClick">确定</el-button>
      </span>
    </template>
  </el-dialog>
  </div>
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
interface paper{
  papers_id:number,
  title:string,
  image_url:string,
  content:string,
  author:string,
  create_time:string,
}

export default defineComponent({
  setup(){
    const {proxy}=getCurrentInstance() as ComponentInternalInstance
    let papers=ref<paper[]>([])
    let deletingIndex:number=0;
    const total_count=ref(0);
    const currentpage=ref(1);
    const confirmDialogVisible=ref(false);
    const onPageChanged=(page:number)=>{
      getPapers(page)
    }
    const onDeletePostClick=(index:number)=>{
      confirmDialogVisible.value = true;
      //console.log(index)
      deletingIndex=index;
    }
    const onConfirmDeletePostClick=()=>{
       let item=papers.value[deletingIndex]
       proxy?.$http.deletePapers(item.papers_id).then((res:any)=>{
           if(res['data']['code']==200){
              papers.value.splice(deletingIndex,1)
              ElMessage.success("论文删除成功!")
              confirmDialogVisible.value=false
           }else{
              ElMessage.info(res['message'])
           }
       })
    }
    const getPapers=(page:number)=>{
      proxy?.$http.getPapersList(page).then((res:any)=>{
          //console.log(res)
          if(res['data']['code']==200){ 
            let data=res['data']['data']
            papers.value=data['papers_list']
            total_count.value=data['total_count']
            currentpage.value=data['page']
            //console.log(data)
            console.log(papers.value)
          }
      })
    }
    onMounted(()=>{
        getPapers(1)
    })
    return{
      papers,
      total_count,
      currentpage,
      confirmDialogVisible,
      onDeletePostClick,
      onConfirmDeletePostClick,
      onPageChanged
    }
  }
})
</script>

<style scoped>
.el-space {
  display: block;
}
.pagination-container {
  display: flex;
  justify-content: center;
  /* 如果需要垂直居中，可以添加 align-items: center; */
}
</style>
