<script setup lang="ts">
import { ref } from 'vue';
import MarkdownRenderer from './MarkdownRenderer.vue';
import type { Comment } from '@/api/types/knowledge';

const props = defineProps<{
  comment: Comment;
}>();

const showReplyForm = ref(false);
const replyContent = ref('');

const emit = defineEmits(['reply']);

const handleReply = () => {
  if (replyContent.value.trim()) {
    emit('reply', {
      content: replyContent.value,
      parentId: props.comment.id
    });
    replyContent.value = '';
    showReplyForm.value = false;
  }
};
</script>

<template>
  <div class="comment-item">
    <div class="comment-header">
      <div class="user-info">
        <el-avatar :size="40" :src="comment.userAvatar || 'https://via.placeholder.com/40'" />
        <div class="user-details">
          <div class="username">{{ comment.username }}</div>
          <div class="comment-time">{{ new Date(comment.createTime).toLocaleString() }}</div>
        </div>
      </div>
    </div>
    
    <div class="comment-content">
      <MarkdownRenderer :content="comment.content" />
    </div>
    
    <div class="comment-actions">
      <el-button type="text" @click="showReplyForm = !showReplyForm">回复</el-button>
    </div>
    
    <div v-if="showReplyForm" class="reply-form">
      <el-input
        v-model="replyContent"
        type="textarea"
        :rows="3"
        placeholder="写下你的回复..."
      />
      <div class="reply-actions">
        <el-button size="small" @click="showReplyForm = false">取消</el-button>
        <el-button type="primary" size="small" @click="handleReply">提交回复</el-button>
      </div>
    </div>
    
    <div v-if="comment.children && comment.children.length > 0" class="comment-replies">
      <CommentItem
        v-for="reply in comment.children"
        :key="reply.id"
        :comment="reply"
        @reply="emit('reply', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.comment-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-details {
  margin-left: 10px;
}

.username {
  font-weight: bold;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-content {
  margin-bottom: 10px;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  gap: 10px;
}

.reply-form {
  margin-top: 10px;
  margin-bottom: 10px;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 10px;
}

.comment-replies {
  margin-top: 20px;
  margin-left: 40px;
  padding-left: 20px;
  border-left: 2px solid #f0f0f0;
}
</style>
