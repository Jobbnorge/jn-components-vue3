<template>
  <div>
    <p>
      {{ $t("approval.chat.no_messages_title") }}
    </p>
    <ApprovalChat :messages="comments"></ApprovalChat>
    <ApprovalChatInput @send-message="SendMessage"></ApprovalChatInput>
  </div>
</template>

<script>
import ApprovalChat from "./ApprovalChat.vue";
import ApprovalChatInput from "./ApprovalChatInput.vue";

import { approvalService } from "../../services/approval.service";

export default {
  name: "Comments",
  components: { ApprovalChat, ApprovalChatInput },
  props: { comments: Array, approvalId: Number, documentID: Number },
  methods: {
    SendMessage(msg) {
      var data = {
        comment: msg,
        documentID: this.documentID,
        approvalId: this.approvalId,
      };
      var vm = this;
      approvalService.AddApprovalComment(this.approvalId, data).then(() => {
        vm.$emit("UpdateMessages");
      });
    },
  },
  data() {
    return {};
  },
};
</script>

<style></style>
