<template>
  <div class="scroll-container" ref="scroll" @scroll="scrollToEndSwitch">
    <div
      v-if="messages.length == 0"
      style="display: flex; align-items: center; flex-direction: column; gap: 1rem; padding: 1rem;"
    >
      <NoMessagesInChat />
    </div>
    <JnUserMessage
      v-else
      v-for="message in messages"
      :key="message.id"
      :isLoggedInUser="message.isAuthor"
      :author="message.author.name"
      :sent="formatDate(message.createdOn)"
      :authorId="message.author.id"
    >
      <template #message-body>
        <ChatMessage :message="message" />
      </template>
    </JnUserMessage>
  </div>
</template>

<script>
import JnUserMessage from "@jobbnorge/jn-components/src/ui_components/containers/JnUserMessage.vue";
import ChatMessage from "./ChatMessage.vue";
import NoMessagesInChat from "./ApprovalImages/NoMessagesInChat.vue";
export default {
  name: "ChatMessages",
  components: {
    JnUserMessage,
    ChatMessage,
    NoMessagesInChat,
  },
  props: {
    messages: Array,
  },
  data: function() {
    return {
      scrollToEndEnabled: true,
    };
  },
  created() {
    this.$nextTick(function() {
      this.scrollToEndEnabled && this.scrollToEnd();
    });
  },
  updated() {
    this.scrollToEndEnabled && this.scrollToEnd();
  },
  methods: {
    scrollToEndSwitch() {
      var el = this.$refs.scroll;
      this.scrollToEndEnabled =
        el.scrollTop == el.scrollHeight - el.clientHeight;
    },
    formatDate: (date) => {
      return date
        ? new Date(date).toLocaleString("nb-NO", {
            dateStyle: "short",
            timeStyle: "short",
          })
        : "DocumentList.DateMissing";
    },
    scrollToEnd() {
      var el = this.$refs.scroll;
      el.scrollTop = el.scrollHeight - el.clientHeight;
    },
  },
};
</script>

<style>
.scroll-container {
  overflow-y: auto;
  border: 1px solid #f6f5f6;
  border-radius: 3px;
  margin-bottom: 6px;
  padding: 6px;
}
</style>
