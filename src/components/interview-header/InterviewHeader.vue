<template>
  <InfoBox colorTheme="green" style="background: hsla(141, 63%, 89%, 0.5)">
    <template #box-content>
      <h1 style="font-size: 1rem; margin-bottom: 1rem">
        {{ $t("interviewHeader.title") }}
      </h1>
      <div id="interviewHeader">
        <div>
          <SelectInterviewBatch
            :jobId="jobId"
            @selectedBatchChanged="selectedBatchChanged"
            @newBatchTitleChanged="newBatchTitleChanged"
          />
        </div>
        <div>
          <CreateSlots
            v-show="isNewBatch || interviewBatchId"
            :jobId="jobId"
            :interviewBatchId="interviewBatchId"
            :showExistingSlotsSummary="true"
            :isNewBatch="isNewBatch"
            @selectedSlotsChanged="
              ($event) => $emit('selectedSlotsChanged', $event)
            "
          />
        </div>
      </div>
    </template>
  </InfoBox>
</template>

<script>
import SelectInterviewBatch from "./SelectInterviewBatch.vue";
import CreateSlots from "../interview-slots/CreateSlots.vue";
import InfoBox from "@jobbnorge/jn-components/src/ui_components/containers/InfoBox.vue";

import { ref } from "vue";

export default {
  emits: [
    "selectedBatchChanged",
    "newBatchTitleChanged",
    "selectedSlotsChanged",
  ],
  setup(props, ctx) {
    const interviewBatchTitle = ref("");
    const interviewBatchId = ref(undefined);
    const isNewBatch = ref(false);

    const selectedBatchChanged = (e) => {
      interviewBatchTitle.value = e.title;
      interviewBatchId.value = e.id;
      ctx.emit("selectedBatchChanged", e);
    };
    const newBatchTitleChanged = (e) => {
      interviewBatchTitle.value = e.title;
      interviewBatchId.value = e.id;
      isNewBatch.value = true;
      ctx.emit("newBatchTitleChanged", e);
    };

    return {
      selectedBatchChanged,
      interviewBatchId,
      newBatchTitleChanged,
      isNewBatch,
    };
  },
  components: { SelectInterviewBatch, CreateSlots, InfoBox },
  props: {
    showExistingSlotsSummary: Boolean,
    jobId: Number,
  },
};
</script>

<style scoped>
#interviewHeader {
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  gap: 1rem;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
.sr-only-focusable:active,
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto;
}
</style>
<i18n src="../../localizations/interviewHeader.json"></i18n>
