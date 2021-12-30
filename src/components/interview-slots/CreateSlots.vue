<template>
  <div>
    <ExistingSlots style="margin: 1rem 0rem" />
    <JnButton @JnButton-clicked="addMoreSlots = true"
      ><span class="fal fa-plus" style="margin-right: 0.5rem"></span
      >{{ $t("createSlots.addMore") }}</JnButton
    >
    <SlotSettings v-if="addMoreSlots" />
    <div v-if="addMoreSlots">
      <JnDateTimepicker
        :pickPeriod="true"
        :allowPastDates="false"
        type="date"
        :minutesInterval="5"
      />
    </div>
  </div>
</template>
<script>
import ExistingSlots from "../interview-slots/ExistingSlots.vue";
import SlotSettings from "../interview-slots/SlotSettings.vue";
import JnButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnButton.vue";
import JnDateTimepicker from "../../ui-components/JnDateTimePicker/JnDateTimepicker.vue";
import { provide, toRefs } from "@vue/runtime-core";

export default {
  setup(props) {
    var { jobId, interviewBatchId } = toRefs(props);
    provide("jobId", jobId);
    provide("interviewBatchId", interviewBatchId);
  },
  components: {
    SlotSettings,
    ExistingSlots,
    JnButton,
    JnDateTimepicker,
  },
  props: {
    jobId: {
      type: Number,
      required: true,
    },
    interviewBatchId: Number,
  },
  data() {
    return {
      addMoreSlots: false,
    };
  },
};
</script>
<i18n src="../../localizations/interviewSlots.json"></i18n>
