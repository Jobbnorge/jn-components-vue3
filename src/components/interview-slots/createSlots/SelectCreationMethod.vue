<template>
  <div class="grid">
    <div>
      <JnSwitch
        :defaultOn="true"
        @switchHasChanged="handleSwitchChange"
        id="slot-creation-method"
      />
      <label for="slot-creation-method" style="margin: 0.5rem">{{
        useGeneratedSlots
          ? $t("selectSlots.suggestSlots")
          : $t("selectSlots.manuallyCreate")
      }}</label>
    </div>
    <div class="helpbox">
      <span class="far fa-question-circle"></span>
      <p style="margin: 0.5rem 0">
        {{
          useGeneratedSlots
            ? $t("selectSlots.helpBox.generatedSuggestions")
            : $t("selectSlots.helpBox.manualCreation")
        }}
      </p>
    </div>
  </div>
</template>
<script>
import JnSwitch from "@jobbnorge/jn-components/src/ui_components/buttons/JnSwitch.vue";
import { ref } from "vue";
export default {
  emit: ["toggleCreationMethod"],
  setup(props, ctx) {
    const useGeneratedSlots = ref(true);

    const handleSwitchChange = (val) => {
      useGeneratedSlots.value = val;
      ctx.emit("toggleCreationMethod");
    };
    return {
      handleSwitchChange,
      useGeneratedSlots,
    };
  },
  components: {
    JnSwitch,
  },
};
</script>
<i18n src="../../../localizations/interviewSlots.json"></i18n>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 0.5rem;
}
.helpbox {
  background-color: var(--lightPink);
  width: fit-content;
  padding: 0.5rem;
  display: flex;
  flex-flow: row;
  gap: 0.3rem;
  width: 200px;
  align-items: baseline;
}
</style>
