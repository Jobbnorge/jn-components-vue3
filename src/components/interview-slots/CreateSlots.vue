<template>
  <div>
    <ExistingSlots
      style="margin: 1rem 0rem"
      @existingSlotsChanged="($event) => $emit('existingSlotsChanged', $event)"
    />
    <hr style="border: 1px solid #f6f5f6" />
    <div>
      <JnButton @JnButton-clicked="addMoreSlots = !addMoreSlots"
        ><span class="fal fa-plus" style="margin-right: 0.5rem"></span
        >{{ $t("createSlots.addMore") }}</JnButton
      >
    </div>
    <div v-if="addMoreSlots">
      <SlotSettings @slotSettingsUpdated="slotTimeSettingChanged" />
      <div style="margin: 2rem 0rem">
        <label>{{ $t("createSlots.selectDatePeriod") }}:</label>
        <JnDateTimepicker
          :multipleDates="true"
          :allowPastDates="false"
          type="date"
          @selectedDateChanged="slotDateSettingChanged"
        />
      </div>
      <span class="far fa-info-circle" style="color: var(--darkBlue)">
        <p
          style="color: var(--gray)"
          v-if="slotDateSettings.length > 0 && conflictingDates.length === 0"
        >
          {{ $t("createSlots.info") }}
        </p></span
      >

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
  emits: ["selectedSlotsChanged", "existingSlotsChanged"],
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
      if (!e) return;
      e.length > 0
        ? e.forEach((item) => slotDateSettings.value.push(item))
        : slotDateSettings.value.push(e);
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
        if (val.length === 0) conflictingDates.value.length = 0;
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
