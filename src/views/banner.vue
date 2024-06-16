<template>
  <div id="banner">
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
      <!-- 论文展示列表开始 -->
      <el-table :data="banners" style="width: 100%" height="700">
          <el-table-column prop="name" label="名称" width="180" />
          <el-table-column label="图片" width="300" >
             <template #default="scope">
              <!-- {{$http.server_host}}+{{ scope.row.image_url }} -->
              <img :src="formatImageUrl(scope.row.image_url)" alt="" style="height: 100px; width: auto; object-fit: cover;">
             </template>
             <!-- scope代表当前行的数据 -->
          </el-table-column>
          <el-table-column prop="link_url" label="跳转链接" width="300">
             <template #default="scope">
              <a :href="scope.row.link_url" target="_blank">{{scope.row.link_url}}</a>
             </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary"  circle @click="editBanner(scope.$index)">
                <el-icon><Edit/></el-icon>
                <!-- 编辑 -->
              </el-button>
              <el-button type="danger"  circle @click="deleteBanner(scope.$index)">
                <el-icon><Delete/></el-icon>
                <!-- 删除 -->
              </el-button>
             </template>
          </el-table-column>
      </el-table>
      <!-- 论文展示列表结束 -->
  <!-- 弹出form框 -->
  <el-dialog v-model="FormVisible" :title="FormTitle" width="30%">
    <el-form :model="form" :rules="rules" ref="ruleFormRef">
      <!-- 论文名称输入框开始 -->
      <el-form-item label="论文名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <!-- 论文名称输入框结束 -->
      <!-- 上传图片开始 -->
      <el-form-item label="上传图片" :label-width="formLabelWidth" prop="image_url">
        <!-- flex布局，默认横向 -->
      <div style="display: flex;">
            <el-input v-model="form.image_url" autocomplete="off" style="margin-right: 10px;"/>
            <el-upload
              :action="$http.server_host+'/cmsapi/papers/img/upload'"
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
      <!-- 上传图片结束 -->
      <!-- 链接开始 -->
      <el-form-item label="跳转链接" :label-width="formLabelWidth" prop="link_url">
        <el-input v-model="form.link_url" autocomplete="off" />
      </el-form-item>
      <!-- 链接结束 -->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="FormVisible = false">取消</el-button>
        <el-button type="primary" @click="onDialogSubmit(ruleFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- form框结束 -->

  <!-- 删除轮播图确认对话框开始 -->
  <el-dialog
    v-model="DeleteDialogVisible"
    title="提示"
    width="30%"
  >
    <span>您确定要删除该轮播图吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="DeleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onDeleteBannerClick">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 删除轮播图确认对话框结束 -->
  </div>
  </template>
  

  <script lang="ts">
  import { Plus,Edit,Delete } from "@element-plus/icons";
  import { FormInstance,FormRules,ElMessage, POPPER_CONTAINER_SELECTOR } from "element-plus";
  import { ComponentInternalInstance, getCurrentInstance } from "vue";
  import { onMounted } from "vue";
  import { inject,defineComponent } from "vue";
  import {ref,reactive} from "vue";

  export default defineComponent({
    setup(){
      const {proxy}=getCurrentInstance() as ComponentInternalInstance
      const formLabelWidth = "140px";
      const FormVisible = ref(false);   // 添加/修改论文对话框显示
      const FormTitle = ref("");    // 添加/修改论文对话框标题
      const DeleteDialogVisible = ref(false);  // 删除轮播图对话框显示
      let deletingIndex:number=0;  // 当前要删除的轮播图索引
      let editingIndex:number=0;  // 当前要编辑的轮播图索引
      // deleteBanner  删除论文对话框
      const deleteBanner=(index:number)=>{
        deletingIndex=index;
        DeleteDialogVisible.value=true;
      }
      // 确定删除轮播图
      const onDeleteBannerClick=()=>{
        let banner=banners.value[deletingIndex];
        if(banner&&banner.banner_id!==undefined){
          proxy?.$http.deleteBanner(banner.banner_id).then((res:any)=>{
          let result=res.data;
          let code=result.code;
          if(code==200){
            DeleteDialogVisible.value=false
            banners.value.splice(deletingIndex,1)
            ElMessage.success('轮播图删除成功')
          }else{
            ElMessage.error('轮播图删除失败')
          }
          })
        }
      }
      // 初始化form,针对edit和add轮播图
      const initForm=(banner?:FormData)=>{
        if(banner){
          form.banner_id=banner.banner_id;
          form.name=banner.name;
          form.image_url=banner.image_url;
          form.link_url=banner.link_url;
          // 根据是否为编辑模式设置FormTitle
          FormTitle.value = "修改轮播图";
        }else{
          form.name="";
          form.image_url="";
          form.link_url="";
          // 新增模式设置FormTitle
          FormTitle.value = "添加轮播图";
        }
      }
      // editBanner  编辑论文对话框
      const editBanner=(index:number)=>{
        editingIndex=index;
        let banner=banners.value[editingIndex];
        initForm(banner);
        FormVisible.value=true;
      }
      const ruleFormRef = ref<FormInstance>();
      interface FormData {
        banner_id?:number;
        name: string;
        image_url: string;
        link_url: string;
      }
      const form = reactive<FormData>({
        name: "",
        image_url: "",
        link_url: "",
      })
      const banners=ref<FormData[]>([]);
      const rules={
        name:[{required:true,message:'请输入名称',trigger:'blur'}],
        image_url:[{required:true,message:'请上传图片',trigger:'blur'}],
        link_url:[{required:true,message:'请输入跳转链接',trigger:'blur'}]
      }
      // trigger: 'blur'意味着验证将在对应的表单字段失去焦点（即用户点击了其他地方或者按下Tab键离开该字段）时执行。
      //这种触发方式通常用于实时但不那么即时的反馈，比如用户在填写表单时，只有当他们完成一个输入并转移到下一个字段时，才会显示错误消息。
      const buttonClick = () => {
        initForm();
        FormVisible.value = true;
      };
      // 图片地址规范化
      const formatImageUrl=(image_url:string)=>{
        if(image_url.startsWith('http')){
          return image_url
        }else{
          return proxy?.$http.server_host+image_url
        }
      }
      const onImageUploadSuccess = (response: any) => {
        // console.log(response)
        let image_name=response.data.image_url
        form.image_url="/media/papers/"+image_name
      };
      const onImageUploadError = (err: any) => {
        console.log(err)
      };
      const onDialogSubmit=(formEl:FormInstance|undefined)=>{
        if(!formEl)return
        formEl.validate((valid)=>{
          if(valid){
            if(form.banner_id){
              //编辑操作
              proxy?.$http.editBanner(form).then((resp:any)=>{
                let result=resp.data
                let code=result['code']
                if(code==200){
                  let banner=result['data']
                  //banners.value[editingIndex]=banner
                  // 需要使用splice方法来修改
                  banners.value.splice(editingIndex,1,banner)
                  ElMessage.success("轮播图修改成功！")
                  FormVisible.value=false
                }
              })
            }else{
              //添加操作
              proxy?.$http.addBanner(form).then((resp:any)=>{
              let result=resp.data
              let code=result['code']
              let banner_dict=result['data']
              if(code==200){
                ElMessage.success("轮播图添加成功！")
                FormVisible.value=false
                banners.value.push(banner_dict)
              }
              //console.log(resp)
              }).catch((err:any)=>{
                console.log(err)
                ElMessage.error("服务器开小差了，请稍后再试！")
                FormVisible.value=false
              })
            }
          }else{
            //console.log("submit fail!")
            ElMessage.error("请确保数据输入正确！")
            return false
          }
        })
      }
      // 接收后端返回的论文相关信息
      let papers=reactive([]);
      let total_count=ref(0);
      let currentpage=ref(1);
      onMounted(()=>{
        proxy?.$http.getBannerList().then((res:any)=>{
          let result=res.data
          console.log(result)
          if(result['code']==200){
            let data=result['data']
            banners.value=data
          }
          //console.log(res)
          // if(res['code']===200){
          //   let data=res['data']
          //   papers.values=data['papers_list']
          //   total_count.value=data['total_count']
          //   currentpage.value=data['page']
          // }
        })
      })
      return{
        rules,
        FormTitle,
        FormVisible,
        DeleteDialogVisible,
        formLabelWidth,
        form,
        buttonClick,
        onImageUploadSuccess,
        onImageUploadError,
        onDialogSubmit,
        formatImageUrl,
        editBanner,
        deleteBanner,
        onDeleteBannerClick,
        ruleFormRef,
        banners,
        Edit,
        Delete
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
  </style>
  