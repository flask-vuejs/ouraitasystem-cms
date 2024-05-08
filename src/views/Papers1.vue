<template>
  <div id="papers">
      <!-- 论文管理界面头部开始 -->
        <!-- vertical设置el-space纵向排列 -->
      <el-space direction="vertical" :size="20" style="width: 100%">
        <h1>论文管理</h1>
        <div style="text-align: right">
          <el-button type="primary" @click="buttonClick">
            <el-icon><plus /></el-icon>
            添加论文
          </el-button>
        </div>
      </el-space>
      <!-- 论文管理界面头部结束 -->
  <!-- 弹出form框 -->
  <el-dialog v-model="FormVisible" title="添加论文" width="30%">
    <el-form :model="form">
      <!-- 论文名称输入框开始 -->
      <el-form-item label="论文名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <!-- 论文名称输入框结束 -->
      <!-- 上传图片开始 -->
      <el-form-item label="上传图片" :label-width="formLabelWidth">
        <!-- flex布局，默认横向 -->
      <div style="display: flex;">
            <el-input v-model="form.image_url" autocomplete="off" style="margin-right: 10px;"/>
            <!-- <el-upload
              :action="$http.server_host+'/cmsapi/papers/img/upload'"
              name="image"
              :show-file-list="false"
              accept="image/jpeg,image/png"
              :on-success="onImageUploadSuccess"
              :on-error="onImageUploadError"
            >
              <el-button type="primary">上传图片</el-button>
            </el-upload> -->
      </div>
      </el-form-item>
      <!-- 上传图片结束 -->
      <!-- 链接开始 -->
      <el-form-item label="跳转链接" :label-width="formLabelWidth">
        <el-input v-model="form.link_url" autocomplete="off" />
      </el-form-item>
      <!-- 链接结束 -->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="FormVisible = false">取消</el-button>
        <el-button type="primary" >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- form框结束 -->

  </div>
  </template>
  
  <script lang="ts">
  import { Plus } from "@element-plus/icons";
  import { ComponentInternalInstance, getCurrentInstance } from "vue";
  import { onMounted } from "vue";
  import { inject,defineComponent } from "vue";
  import {ref,reactive} from "vue";

  export default defineComponent({
    setup(){
      const formLabelWidth = "140px";
      const FormVisible = ref(false);
      const form = reactive({
        name: "",
        image_url: "",
        link_url: "",
      });
      const buttonClick = () => {
        FormVisible.value = true;
      };
      const onImageUploadSuccess = (response: any) => {
        // console.log(response)
        let image_name=response.data.image_url
        form.image_url="/media/papers/"+image_name
      };
      const onImageUploadError = (err: any) => {
        console.log(err)
      };
      // 接收后端返回的论文相关信息
      let papers=reactive([]);
      let total_count=ref(0);
      let currentpage=ref(1);
      const {proxy}=getCurrentInstance() as ComponentInternalInstance
      // onMounted(()=>{
      //   proxy?.$http.getPapersList(1).then((res:any)=>{
      //     if(res['code']===200){
      //       let data=res['data']
      //       papers.values=data['papers_list']
      //       total_count.value=data['total_count']
      //       currentpage.value=data['page']
      //     }
      //   })
      // })
      return{
        FormVisible,
        formLabelWidth,
        form,
        buttonClick,
        onImageUploadSuccess,
        onImageUploadError
      }
    }
  })
   
  </script>
  
  <style scoped>
  .el-space {
    display: block;
  }
  </style>
  