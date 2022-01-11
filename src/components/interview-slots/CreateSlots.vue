<template>
  <div>
    <ExistingSlots style="margin: 1rem 0rem" />
    <JnButton @JnButton-clicked="addMoreSlots = true"
      ><span class="fal fa-plus" style="margin-right: 0.5rem"></span
      >{{ $t("createSlots.addMore") }}</JnButton
    >
    <div v-if="addMoreSlots">
      <SlotSettings @slotSettingsUpdated="slotTimeSettingChanged" />
      <div>
        <label>{{ $t("createSlots.selectDatePeriod") }}:</label>
        <JnDateTimepicker
          :pickPeriod="true"
          :allowPastDates="false"
          type="date"
          @selectedDateChanged="slotDateSettingChanged"
        />
      </div>
      <span v-if="selectedSlots.length > 0 && conflictingDates.length === 0">{{
        $t("createSlots.info")
      }}</span>
      <ConflictingDates
        v-if="conflictingDates.length > 0"
        :conflictingDates="conflictingDates"
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
import ConflictingDates from "./ConflictingDates.vue";
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
    const conflictingDates = ref([]);

    const slotTimeSettingChanged = (e) => Object.assign(slotTimeSettings, e);
    const slotDateSettingChanged = (e) => {
      slotDateSettings.value.length = 0;
      e && e.forEach((item) => slotDateSettings.value.push(item));
    };

    const slotAdded = (date) => {
      selectedSlots.value.push({
        startDate: date.startDate,
        endDate: date.endDate,
      });
      if (date.conflictingDates.length > 0) conflictingDates.value.push(date);
    };

    const slotRemoved = (date) => {
      var i = selectedSlots.value.findIndex(
        (slot) =>
          slot.startDate === date.startDate && slot.endDate === date.endDate
      );
      selectedSlots.value.splice(i, 1);
      if (date.conflictingDates.length > 0) {
        i = conflictingDates.value.findIndex(
          (cd) => cd.startDate === date.startDate && cd.endDate === date.endDate
        );
      }
      conflictingDates.value.splice(i, 1);
    };

    watch(
      () => selectedSlots.value,
      (val) => {
        ctx.emit("selectedSlotsChanged", val);
      },
      { deep: true }
    );

    watch(
      () => [slotTimeSettings, slotDateSettings.value],
      () => (selectedSlots.value.length = 0),
      { deep: true }
    );

    return {
      slotTimeSettingChanged,
      slotDateSettingChanged,
      slotTimeSettings,
      slotDateSettings,
      slotAdded,
      slotRemoved,
      selectedSlots,
      conflictingDates,
    };
  },
  components: {
    SlotSettings,
    ExistingSlots,
    JnButton,
    JnDateTimepicker,
    SelectSlots,
    ConflictingDates,
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
