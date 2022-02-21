<template>
  <InfoBox colorTheme="green" style="background: hsla(141, 63%, 89%, 0.5)">
    <template #box-content>
      <h1 style="font-size: 1rem; margin-bottom: 1rem">
        {{ $t("interviewHeader.title")
        }}<span
          class="fas fa-info-circle"
          style="margin-left: 0.3rem; color: var(--pink); cursor: pointer"
          @click="toggleInfoBox"
          ><span class="sr-only">{{ $t("InterviewHeader.sr-helpText") }}</span
          ></span
        >
      </h1>
      <div id="interviewHeader">
        <div>
          <SelectInterviewBatch
            :jobId="jobId"
            @selectedBatchChanged="selectedBatchChanged"
            @newBatchTitleChanged="
              ($event) => $emit('newBatchTitleChanged', $event)
            "
          />
        </div>
        <div>
          <CreateSlots
            :jobId="jobId"
            :interviewBatchId="interviewBatchId"
            :showExistingSlotsSummary="true"
            @selectedSlotsChanged="($event) => (selectedSlots = $event)"
          />
        </div>
      </div>
      <InfoBox
        class="infobox-help"
        v-if="showInfoBox"
        colorTheme="pink"
        canClose
        @info-box-closed="toggleInfoBox"
      >
        <template #box-content>
          <p>{{ $t("interviewHeader.slotInfoText") }}</p>
          <p>{{ $t("interviewHeader.slotInfoText2") }}</p>
        </template>
      </InfoBox>
    </template>
  </InfoBox>
</template>

<script>
import SelectInterviewBatch from "./SelectInterviewBatch.vue";
import InfoBox from "@jobbnorge/jn-components/src/ui_components/containers/InfoBox.vue";
import CreateSlots from "../interview-slots/CreateSlots.vue";

import { ref } from "vue";

export default {
  emits: ["displaySlot", "selectedBatchChanged", "newBatchTitleChanged"],
  setup(props, ctx) {
    const showInfoBox = ref(false);
    const interviewBatchTitle = ref("");
    const interviewBatchId = ref(undefined);

    const selectedBatchChanged = (e) => {
      interviewBatchTitle.value = e.title;
      interviewBatchId.value = e.id;
      ctx.emit("selectedBatchChanged", e);
    };

    const toggleInfoBox = () => {
      showInfoBox.value = !showInfoBox.value;
    };

    return {
      showInfoBox,
      toggleInfoBox,
      selectedBatchChanged,
      interviewBatchId,
    };
  },
  components: { InfoBox, SelectInterviewBatch, CreateSlots },
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
.infobox-help {
  position: absolute;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
  z-index: 1000;
  max-width: 35rem;
  left: 3rem;
  top: 3rem;
  padding: 1rem; 
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
