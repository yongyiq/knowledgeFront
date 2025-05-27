<template>
  <div class="message" :class="{ 'message-user': isUser }">
    <div class="avatar">
      <UserCircleIcon v-if="isUser" class="icon" />
      <ComputerDesktopIcon v-else class="icon" :class="{ 'assistant': !isUser }" />
    </div>
    <div class="content">
      <div class="text-container">
        <button v-if="isUser" class="user-copy-button" @click="copyContent" :title="copyButtonTitle">
          <DocumentDuplicateIcon v-if="!copied" class="copy-icon" />
          <CheckIcon v-else class="copy-icon copied" />
        </button>
        <div class="text" ref="contentRef" v-if="isUser">
          {{ message.content }}
        </div>
        <div class="text markdown-content" ref="contentRef" v-else v-html="processedContent"></div>
      </div>
      <div class="message-footer" v-if="!isUser">
        <button class="copy-button" @click="copyContent" :title="copyButtonTitle">
          <DocumentDuplicateIcon v-if="!copied" class="copy-icon" />
          <CheckIcon v-else class="copy-icon copied" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick, ref, watch } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { UserCircleIcon, ComputerDesktopIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/vue/24/outline'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const contentRef = ref(null)
const copied = ref(false)
const copyButtonTitle = computed(() => copied.value ? '已复制' : '复制内容')

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
  sanitize: false
})

// 处理内容
const processContent = (content) => {
  if (!content) return ''

  // 分析内容中的 think 标签
  let result = ''
  let isInThinkBlock = false
  let currentBlock = ''

  // 逐字符分析，处理 think 标签
  for (let i = 0; i < content.length; i++) {
    if (content.slice(i, i + 7) === '<think>') {
      isInThinkBlock = true
      if (currentBlock) {
        // 将之前的普通内容转换为 HTML
        result += marked.parse(currentBlock)
      }
      currentBlock = ''
      i += 6 // 跳过 <think>
      continue
    }

    if (content.slice(i, i + 8) === '</think>') {
      isInThinkBlock = false
      // 将 think 块包装在特殊 div 中
      result += `<div class="think-block">${marked.parse(currentBlock)}</div>`
      currentBlock = ''
      i += 7 // 跳过 </think>
      continue
    }

    currentBlock += content[i]
  }

  // 处理剩余内容
  if (currentBlock) {
    if (isInThinkBlock) {
      result += `<div class="think-block">${marked.parse(currentBlock)}</div>`
    } else {
      result += marked.parse(currentBlock)
    }
  }

  // 净化处理后的 HTML
  const cleanHtml = DOMPurify.sanitize(result, {
    ADD_TAGS: ['think', 'code', 'pre', 'span'],
    ADD_ATTR: ['class', 'language']
  })

  // 在净化后的 HTML 中查找代码块并添加复制按钮
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = cleanHtml

  // 查找所有代码块
  const preElements = tempDiv.querySelectorAll('pre')
  preElements.forEach(pre => {
    const code = pre.querySelector('code')
    if (code) {
      // 创建包装器
      const wrapper = document.createElement('div')
      wrapper.className = 'code-block-wrapper'

      // 添加复制按钮
      const copyBtn = document.createElement('button')
      copyBtn.className = 'code-copy-button'
      copyBtn.title = '复制代码'
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="code-copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      `

      // 添加成功消息
      const successMsg = document.createElement('div')
      successMsg.className = 'copy-success-message'
      successMsg.textContent = '已复制!'

      // 组装结构
      wrapper.appendChild(copyBtn)
      wrapper.appendChild(pre.cloneNode(true))
      wrapper.appendChild(successMsg)

      // 替换原始的 pre 元素
      pre.parentNode.replaceChild(wrapper, pre)
    }
  })

  return tempDiv.innerHTML
}

// 修改计算属性
const processedContent = computed(() => {
  if (!props.message.content) return ''
  return processContent(props.message.content)
})

// 为代码块添加复制功能
const setupCodeBlockCopyButtons = () => {
  if (!contentRef.value) return;

  const codeBlocks = contentRef.value.querySelectorAll('.code-block-wrapper');
  codeBlocks.forEach(block => {
    const copyButton = block.querySelector('.code-copy-button');
    const codeElement = block.querySelector('code');
    const successMessage = block.querySelector('.copy-success-message');

    if (copyButton && codeElement) {
      // 移除旧的事件监听器
      const newCopyButton = copyButton.cloneNode(true);
      copyButton.parentNode.replaceChild(newCopyButton, copyButton);

      // 添加新的事件监听器
      newCopyButton.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          const code = codeElement.textContent || '';
          await navigator.clipboard.writeText(code);

          // 显示成功消息
          if (successMessage) {
            successMessage.classList.add('visible');
            setTimeout(() => {
              successMessage.classList.remove('visible');
            }, 2000);
          }
        } catch (err) {
          console.error('复制代码失败:', err);
        }
      });
    }
  });
}

// 在内容更新后手动应用高亮和设置复制按钮
const highlightCode = async () => {
  await nextTick()
  if (contentRef.value) {
    contentRef.value.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block)
    })

    // 设置代码块复制按钮
    setupCodeBlockCopyButtons()
  }
}

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const isUser = computed(() => props.message.role === 'user')

// 复制内容到剪贴板
const copyContent = async () => {
  try {
    // 获取纯文本内容
    let textToCopy = props.message.content;

    // 如果是AI回复，需要去除HTML标签
    if (!isUser.value && contentRef.value) {
      // 创建临时元素来获取纯文本
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = processedContent.value;
      textToCopy = tempDiv.textContent || tempDiv.innerText || '';
    }

    await navigator.clipboard.writeText(textToCopy);
    copied.value = true;

    // 3秒后重置复制状态
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  } catch (err) {
    console.error('复制失败:', err);
  }
}

// 监听内容变化
watch(() => props.message.content, () => {
  if (!isUser.value) {
    highlightCode()
  }
})

// 初始化时也执行一次
onMounted(() => {
  if (!isUser.value) {
    highlightCode()
  }
})

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString()
}
</script>

<style scoped>
.message {
  display: flex;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.message.message-user {
  flex-direction: row-reverse;
}

.message.message-user .content {
  align-items: flex-end;
}

.message.message-user .text-container {
  position: relative;
}

.message.message-user .text-container .text {
  background: #f0f7ff;
  color: #333;
  border-radius: 1rem 1rem 0 1rem;
}

.message.message-user .text-container .user-copy-button {
  position: absolute;
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.message.message-user .text-container .user-copy-button .copy-icon {
  width: 16px;
  height: 16px;
  color: #666;
}

.message.message-user .text-container .user-copy-button .copy-icon.copied {
  color: #4ade80;
}

.message.message-user .text-container:hover .user-copy-button {
  opacity: 1;
}

.avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.avatar .icon {
  width: 100%;
  height: 100%;
  color: #666;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.avatar .icon.assistant {
  color: #333;
  background: #f0f0f0;
}

.avatar .icon.assistant:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 80%;
}

.text-container {
  position: relative;
}

.message-footer {
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
}

.message-footer .time {
  font-size: 0.75rem;
  color: #666;
}

.message-footer .copy-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  font-size: 0.75rem;
  color: #666;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: auto;
  transition: background-color 0.2s;
}

.message-footer .copy-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.message-footer .copy-button .copy-icon {
  width: 14px;
  height: 14px;
}

.message-footer .copy-button .copy-icon.copied {
  color: #4ade80;
}

.text {
  padding: 1rem;
  border-radius: 1rem 1rem 1rem 0;
  line-height: 1.5;
  white-space: pre-wrap;
  color: var(--text-color);
}

.text .cursor {
  animation: blink 1s infinite;
}

/* Think 标签样式 */
.text :deep(.think-block) {
  position: relative;
  padding: 0.75rem 1rem 0.75rem 1.5rem;
  margin: 0.5rem 0;
  color: #666;
  font-style: italic;
  border-left: 4px solid #ddd;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 0 0.5rem 0.5rem 0;
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.text :deep(.think-block::before) {
  content: '思考';
  position: absolute;
  top: -0.75rem;
  left: 1rem;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  background: #f5f5f5;
  border-radius: 0.25rem;
  color: #999;
  font-style: normal;
}

.text :deep(.think-block:not(:first-child)) {
  animation: slideIn 0.3s ease forwards;
}

/* 代码块样式 */
.text :deep(pre) {
  background: #f6f8fa;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.5rem 0;
  border: 1px solid #e1e4e8;
}

.text :deep(pre code) {
  background: transparent;
  padding: 0;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  tab-size: 2;
}

/* 代码块复制按钮样式 */
.text :deep(.code-block-wrapper) {
  position: relative;
}

.text :deep(.code-copy-button) {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #e1e4e8;
  border-radius: 0.25rem;
  padding: 0.25rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.text :deep(.code-block-wrapper:hover .code-copy-button) {
  opacity: 1;
}

.text :deep(.code-copy-icon) {
  width: 1rem;
  height: 1rem;
  color: #666;
}

.text :deep(.copy-success-message) {
  position: absolute;
  top: 0.5rem;
  right: 3rem;
  background: #4ade80;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.text :deep(.copy-success-message.visible) {
  opacity: 1;
}

/* 语法高亮样式 */
.text :deep(.hljs) {
  color: #24292e;
  background: transparent;
}

.text :deep(.hljs-keyword) {
  color: #d73a49;
}

.text :deep(.hljs-built_in) {
  color: #005cc5;
}

.text :deep(.hljs-type) {
  color: #6f42c1;
}

.text :deep(.hljs-literal) {
  color: #005cc5;
}

.text :deep(.hljs-number) {
  color: #005cc5;
}

.text :deep(.hljs-regexp) {
  color: #032f62;
}

.text :deep(.hljs-string) {
  color: #032f62;
}

.text :deep(.hljs-subst) {
  color: #24292e;
}

.text :deep(.hljs-symbol) {
  color: #e36209;
}

.text :deep(.hljs-class) {
  color: #6f42c1;
}

.text :deep(.hljs-function) {
  color: #6f42c1;
}

.text :deep(.hljs-title) {
  color: #6f42c1;
}

.text :deep(.hljs-params) {
  color: #24292e;
}

.text :deep(.hljs-comment) {
  color: #6a737d;
}

.text :deep(.hljs-doctag) {
  color: #d73a49;
}

.text :deep(.hljs-meta) {
  color: #6a737d;
}

.text :deep(.hljs-section) {
  color: #005cc5;
}

.text :deep(.hljs-name) {
  color: #22863a;
}

.text :deep(.hljs-attribute) {
  color: #005cc5;
}

.text :deep(.hljs-variable) {
  color: #e36209;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
