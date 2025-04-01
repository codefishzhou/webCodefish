<template>
    <div class="app-container">
      <Editor
        id="tinymce"
        v-model="tinymceHtml"
        :init="init"
        @paste="customPaste($event)"
      />
      <!-- <div v-html="tinymceHtml"></div> -->
    </div>
  </template>
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import tinymce from 'tinymce/tinymce'
  // 使用该方法需要引入下面的数据
  import 'tinymce/models/dom' // 特别注意 tinymce 6.0.0 版本之后必须引入，否则不显示
  import 'tinymce/themes/silver/theme'
  import Editor from '@tinymce/tinymce-vue' // 引入组件
  import 'tinymce/icons/default'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/link'
  import 'tinymce/plugins/code'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/wordcount'
  
  // 引入富文本编辑器主题的js和css
  import 'tinymce/themes/silver/theme.min.js'
  import 'tinymce/skins/ui/oxide/skin.min.css'
  
  // 以上所有的样式在 node_modules 下面 tinymce 里面的 plugins 都能找到。
  const tinymceHtml = ref<string>('')
  const init = {
    //初始化数据
    selector: 'textarea',
    height: 300, // 限制高度
    statusbar: false,
    object_resizing: false,
    image_description: false,
    image_dimensions: false, // 禁止操作图片
    plugins: 'link lists image code table wordcount', // 富文本插件
    font_size_formats: '8px 10px 12px 14px 16px 18px 24px 36px 48px 128px',
    font_family_formats:
      '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif',
    toolbar:
      'undo redo fontfamily fontsize fontname bold italic underline strikethrough | fontsizeselect | forecolor | alignleft aligncenter alignright',
    branding: false, // //是否禁用“Powered by TinyMCE”
    menubar: false, //顶部菜单栏显示
    paste_data_images: false, // 禁止粘贴图片
  }
  
  const emits = defineEmits<{
    (event: 'update:bindHtml', val: string): void // 富文本内容
  }>()
  
  onMounted(() => {
    tinymce.init({}) // 初始化富文本
  })
  
  // 实现双向绑定
  watch(
    () => tinymceHtml.value,
    () => {
      emits('update:bindHtml', tinymce.activeEditor!.getContent())
    }
  )
  </script>
  
  