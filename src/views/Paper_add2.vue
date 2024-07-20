<template>
    <div class="paper-add">
      <h1>{{ FormTitle }}</h1>
      <form>
        <div class="form-group">
          <label for="title">标题</label>
          <input id="title" v-model="form.title" class="form-control" placeholder="请输入论文标题" />
        </div>
        <div class="form-group">
          <label for="author">作者</label>
          <input id="author" v-model="form.author" class="form-control" placeholder="请输入作者名称" />
        </div>
        <div class="form-group">
          <label for="abstract">摘要</label>
          <textarea rows="5" id="abstract" v-model="form.abstract" class="form-control" placeholder="请输入论文摘要"></textarea>
        </div>
        <div class="form-group">
          <label for="keywords">关键词</label>
          <input id="keywords"  v-model="form.keywords" class="form-control" placeholder="请输入关键词" />
        </div>
        <div class="form-group">
          <label for="cover">封面图片</label>
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
                  <el-button type="primary" id="cover">上传图片</el-button>
                </el-upload>
          </div>
        </div>
        <div class="editor-container">
          <label for="content" style="font-weight: bold; color: #555;">内容</label>
          <!-- 工具栏 -->
          <Toolbar
            style="border-bottom: 1px solid #ddd"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <!-- 编辑器 -->
          <Editor
            class="editor"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
            style="height: 400px; overflow-y: hidden"
          />
        </div>
        <button @click.prevent="onSubmit"  type="submit" class="btn btn-primary" style="margin-top:10px">提交</button>
      </form>
    </div>


    <el-dialog
      v-model="confirmVisible"
      title="提示"
      width="30%"
    >
      <span>您确定要提交吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script lang="ts">
/*  npm install @wangeditor/editor --save
    npm install @wangeditor/editor-for-vue@next --save
    # 下面是vue3单独的组件，上面两个是旧的(都要安装)
    npm install @wangeditor/editor wangeditor5-for-vue3
*/

  import '@wangeditor/editor/dist/css/style.css' // 引入 css
  import { ElMessage } from "element-plus";
  import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import type {paper} from '../utils/type'
  import { ComponentInternalInstance, getCurrentInstance } from "vue";
  import { useRouter,useRoute } from 'vue-router'

  export default {
    components: { Editor, Toolbar },
    setup() {
      const FormTitle=ref('添加论文')
      const {proxy}=getCurrentInstance() as ComponentInternalInstance
      const router = useRouter()
      const route = useRoute()
      const title=route.query.title as string
      const id=route.query.id as string
      const initForm=(item?:any)=>{
        if(item){
          form.value.papers_id=item.id
          form.value.title=item.title
          form.value.author=item.author
          form.value.content=item.content
          valueHtml.value=form.value.content
          form.value.image_url=item.image_url
          form.value.abstract=item.abstract
          form.value.keywords=item.keywords
          form.value.create_time=item.create_time
          FormTitle.value='编辑论文'
        }else{
          form.value.papers_id=0
          form.value.title=''
          form.value.author=''
          form.value.content=''
          form.value.image_url=''
          form.value.abstract=''
          form.value.keywords=''
          form.value.create_time=''
          FormTitle.value='添加论文'
        }
      }
      const form=ref<paper>({
        papers_id:0,
        title: '',
        author: '',
        content: '',
        image_url: '',
        abstract: '',
        keywords:'',
        create_time:''
      })
      const onImageUploadSuccess=(res:any)=>{
        form.value.image_url=res.data.image_url
        ElMessage.success('上传成功')
      }
      const onImageUploadError=(err:any)=>{
        console.log(err)
        ElMessage.error('上传失败')
      }
      const editorRef = shallowRef()  // 编辑器实例，必须用 shallowRef
      const valueHtml = ref('')  // 编辑器内容
      const toolbarConfig = {}
      const editorConfig = { 
        placeholder: '请输入论文内容...' ,
        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
            // 配置字号
            fontSize: [  ],
            // 配置上传图片
            uploadImage: {  },
        }
      }
  
      onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
      })
  
      const handleCreated = (editor:any) => {
        editorRef.value = editor
      }
  
      // 提交
      const confirmVisible = ref(false)
      const onSubmit=()=>{
        confirmVisible.value = true
      }
      const confirmSubmit = () => {
        form.value.content = valueHtml.value
        if(FormTitle.value=='添加论文'){
          proxy?.$http.add_paper(form.value).then((res:any)=>{
            if(res['data']['code']==200){
              ElMessage.success('提交成功')
              confirmVisible.value = false
              router.push('/papers')
            }
          }).catch((err:any)=>{
            console.log(err)
            ElMessage.error('提交失败')
            confirmVisible.value = false
          })
        }else{
          proxy?.$http.edit_paper(form.value).then((res:any)=>{
            if(res['data']['code']==200){
              ElMessage.success('修改成功')
              confirmVisible.value = false
              router.push('/papers')
            }
          }).catch((err:any)=>{
            console.log(err)
            ElMessage.error('修改失败')
            confirmVisible.value = false
          })
        }
      }
      onMounted(()=>{
        if(title=='edit'){
          proxy?.$http.get_paper_form(id).then((res:any)=>{
            if(res['data']['code']==200){
              initForm(res['data']['data'])
              ElMessage.success('加载数据成功')
            }else{
              ElMessage.error('加载数据失败')
            }
          }).catch((err:any)=>{
            ElMessage.error('加载数据失败')
          })
        }else{
          initForm()
        }
      })
      return {
        form,
        FormTitle,
        editorRef,
        valueHtml,
        mode: 'default',
        toolbarConfig,
        editorConfig,
        confirmVisible,
        onSubmit,
        handleCreated,
        confirmSubmit,
        onImageUploadSuccess,
        onImageUploadError
      }
    }
  }
  </script>
  
  <style>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f6f8;
    color: #333;
  }
  
  .paper-add {
    max-width: 1000px;
    margin: 30px auto;
    padding: 30px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .paper-add h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 10px;
    color: #555;
  }
  
  .form-control {
    width: 95%;
    padding: 12px 15px;
    margin-top: 5px;
    border-radius: 6px;
    border: 1px solid #ddd;
    font-size: 14px;
    transition: border-color 0.3s;
  }
  
  .form-control:focus {
    border-color: #007bff;
    outline: none;
    width: 95%;
  }
  
  .form-control-file {
    width: 97%;
    padding: 10px;
    margin-top: 5px;
    border-radius: 6px;
    border: 1px solid #ddd;
    font-size: 14px;
  }
  
  .cover-preview {
    margin-top: 15px;
    max-width: 100%;
    max-height: 200px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
  
  .editor-container {
    margin-top: 20px;
  }
  
  .editor {
    height: 500px;
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow-y: hidden;
    padding: 10px;
  }
  
  .btn-primary {
    display: block;
    width: 100%;
    padding: 15px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  </style>
  