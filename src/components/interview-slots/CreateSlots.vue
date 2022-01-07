<template>
  <div>
    <ExistingSlots style="margin: 1rem 0rem" />
    <JnButton @JnButton-clicked="addMoreSlots = true"
      ><span class="fal fa-plus" style="margin-right: 0.5rem"></span
      >{{ $t("createSlots.addMore") }}</JnButton
    >
    <div v-if="addMoreSlots">
      <SlotSettings @slotSettingsUpdated="slotTimeSettingChanged" />
      <label>{{$t('createSlots.selectDatePeriod')}}:</label>
      <JnDateTimepicker
        :pickPeriod="true"
        :allowPastDates="false"
        type="date"
        @selectedDateChanged="slotDateSettingChanged"
      />
      <SelectSlots
        :slotTimeSettings="slotTimeSettings"
        :slotDateSettings="slotDateSettings"
        @slotAdded="slotAdded"
        @slotRemoved="slotRemoved"
      />
    </div>
  </div>
</template>
<script>
import ExistingSlots from "./ExistingSlots.vue";
import SlotSettings from "./SlotSettings.vue";
import JnButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnButton.vue";
import JnDateTimepicker from "../../ui-components/JnDateTimePicker/JnDateTimepicker.vue";
import SelectSlots from "./SelectSlots.vue";
import { provide, reactive, ref, toRefs, watch } from "vue";

export default {
  emits: ["selectedSlotsChanged"],
  setup(props, ctx) {
    const { jobId, interviewBatchId } = toRefs(props);
    provide("jobId", jobId);
    provide("interviewBatchId", interviewBatchId);

    const slotTimeSettings = reactive({});
    const slotDateSettings = ref([]);
    const selectedSlots = ref([]);

    const slotTimeSettingChanged = (e) => Object.assign(slotTimeSettings, e);
    const slotDateSettingChanged = (e) => {
      slotDateSettings.value.length = 0;
      e && e.forEach((item) => slotDateSettings.value.push(item));
    };

    const slotAdded = (date) => {
      selectedSlots.value.push(date);
    };

    const slotRemoved = (date) => {
      var i = selectedSlots.value.findIndex(
        (slot) =>
          slot.startDate === date.startDate && slot.endDate === date.endDate
      );
      selectedSlots.value.splice(i, 1);
    };

    watch(
      () => selectedSlots.value,
      (val) => {
        ctx.emit("selectedSlotsChanged", val);
      },
      { deep: true }
    );

    return {
      slotTimeSettingChanged,
      slotDateSettingChanged,
      slotTimeSettings,
      slotDateSettings,
      slotAdded,
      slotRemoved,
    };
  },
  components: {
    SlotSettings,
    ExistingSlots,
    JnButton,
    JnDateTimepicker,
    SelectSlots,
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
