<template>
  <div>
    {{ message.text }}
  </div>
</template>

<script>
export default {
  name: "ChatMessage",
  props: {
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.highlightText {
  color: #127dac;
}
</style>
