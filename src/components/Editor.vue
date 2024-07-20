<template>
<textarea class="vue-easymde-editor"  ref="textArea"></textarea>
</template>

<script setup lang="ts">
/*  
npm install easymde --save
*/
import { defineProps,defineEmits,ref,onMounted,onUnmounted } from 'vue';
import EasyMDE, {Options} from 'easymde'
interface EditorProps{
    modelValue?:string,
    options?:Options
}
interface EditorEvents{
    (type:'update:modelValue',value:string):void;
    (type:'change',value:string):void;
    (type:'blur'):void;
}
const props=defineProps<EditorProps>()
const emit=defineEmits<EditorEvents>()

const textArea=ref<null|HTMLTextAreaElement>(null)
let easyMDEInstance:EasyMDE|null=null
const innerValue=ref(props.modelValue||'')
onMounted(()=>{
    if(textArea.value){
        // 组装options
        const config:Options={
            ...(props.options || {}),
            element:textArea.value,
            initialValue:innerValue.value,
            autoDownloadFontAwesome:false,
        }
        easyMDEInstance=new EasyMDE(config)
        // 监控对应的事件
        easyMDEInstance.codemirror.on('change',()=>{
            if(easyMDEInstance){
                // 拿到当前的值
                const updateValue=easyMDEInstance.value()
                innerValue.value=updateValue
                emit('update:modelValue',updateValue)
                emit('change',updateValue)
            }
        })
        easyMDEInstance.codemirror.on('blur',()=>{
            if(easyMDEInstance){
                emit('blur')
            }
        })
    }
})
// 销毁对应的实例
onUnmounted(()=>{
    if(easyMDEInstance){
        easyMDEInstance.cleanup()
    }
    easyMDEInstance=null
})
</script>

<style>
.vue-easymde-editor{
    height:500px;
}
</style>