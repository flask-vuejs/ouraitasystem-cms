<template>
 <!-- 删除对话框 -->
    <el-dialog
        v-model="deleteDialogVisible"
        title="提示"
        width="30%"
    >
        <span>您确定要删除该文章吗？</span>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="onCancel">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted,watch,computed } from 'vue';

export default defineComponent({
  name: 'DeleteDialog',
  props:{
    modelValue:{type:Boolean,default:false}
  },
  setup(props,{emit}) {
    const deleteDialogVisible = computed(() => props.modelValue)
    const onConfirm = ()=>{
        emit('confirm')
        emit('update:modelValue', false);
    }
    const onCancel = ()=>{
        //console.log('确认取消：')
        emit('update:modelValue', false);
        //console.log(deleteDialogVisible.value)
    }
    // 监听 modelValue 的变化，同步 deleteDialogVisible
    // watch(
    //   () => props.modelValue,
    //   (newValue) => {
    //     deleteDialogVisible.value = newValue;
    //   }
    // );
    return {
        deleteDialogVisible,
        onConfirm,
        onCancel
    }
  }
})
</script>

<style scoped>

</style>