<template>
  <div v-show="showInfoBox" class="infobox-help">
    {{ $t("interviewHeader.slotInfoText") }}
  </div>
  <div id="interviewHeader">
    <div>
      <SelectInterviewBatch
        @selectedBatchChanged="
          ($event) => $emit('selectedBatchChanged', $event)
        "
        @newBatchTitleChanged="
          ($event) => $emit('newBatchTitleChanged', $event)
        "
      />
    </div>
    <div style="align-self: center">
      <JnSwitch
        @switchHasChanged="($event) => $emit('displaySlot', $event)"
      ></JnSwitch>
      {{ $t("interviewHeader.switch") }}
      <span
        class="fas fa-info-circle"
        style="color: var(--pink); font-size: 1rem; cursor: pointer"
        @click="toggleInfoBox"
      ></span>
    </div>
  </div>
</template>

<script>
import JnSwitch from "@jobbnorge/jn-components/src/ui_components/buttons/JnSwitch.vue";
import SelectInterviewBatch from "./SelectInterviewBatch.vue";

import { ref } from "vue";

export default {
  emits: ["displaySlot", "selectedBatchChanged", "newBatchTitleChanged"],
  setup() {
    const showInfoBox = ref(false);

    const toggleInfoBox = () => {
      showInfoBox.value = !showInfoBox.value;
    };

    return { showInfoBox, toggleInfoBox };
  },
  components: { JnSwitch, SelectInterviewBatch },
};
</script>

<style scoped>
#interviewHeader {
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  gap: 1rem;
}
.infobox-help {
  background-color: var(--lightPink);
  box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
  border-radius: 3px;
  position: absolute;
  z-index: 2;
  width: 20rem;
  right: 3rem;
  top: 5rem;
  min-width: 20rem;
  min-height: 10rem;
  padding: 0.5rem;
}
</style>
<i18n src="../../localizations/interviewHeader.json"></i18n>