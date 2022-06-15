<template>
  <div class="message-input">
    <div
      ref="editor"
      class="input"
      contenteditable="true"
      v-on:keyup.enter="populateInput"
      :placeholder="$t('inputPlaceholder')"
    ></div>
    <JnButton @JnButton-clicked="populateInput" style="margin-left: 0.5rem;">
      <span class="fas fa-paper-plane"></span>
    </JnButton>
  </div>
</template>

<script>
import JnButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnButton.vue";

export default {
  name: "ChatInput",
  components: {
    JnButton,
  },
  methods: {
    populateInput: function() {
      if (this.$refs.editor.innerText !== "") {
        this.$refs.editor.querySelectorAll("span.tagged").forEach((el) => {
          el.textContent = `{{userid:${el.getAttribute("data-id")}}}`;
        });
        this.$emit("send-message", this.$refs.editor.innerText);
        this.$refs.editor.innerText = "";
      }
    },
  },
};
</script>

<style scoped>
.message-input {
  display: grid;
  grid-template-columns: 9fr 1fr;
  height: fit-content;
  background-color: rgba(255, 255, 255, 0.9);
}
.input {
  width: 100%;
  border: #ccc 1px solid;
  border-radius: 6px;
  resize: vertical;
  min-height: 42px;
  padding: 12px;
  box-sizing: border-box;
  line-height: 1.2em;
  font-size: inherit;
}
[contenteditable="true"]:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  color: #737373;
  display: block; /* For Firefox */
}
.tagged {
  color: #127dac;
}
</style>
