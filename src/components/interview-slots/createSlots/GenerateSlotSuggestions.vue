<template>
  <SlotSettings @slotSettingsUpdated="updateSlotSettings" />
  <div style="margin: 2rem 0rem">
    <label>{{ $t("createSlots.selectDatePeriod") }}:</label>
    <JnDateTimepicker
      :multipleDates="true"
      :allowPastDates="false"
      type="date"
      @selectedDateChanged="slotDateSettingChanged"
    />
  </div>
  <SelectSlots
    :slotTimeSettings="slotTimeSettings"
    :slotDateSettings="slotDateSettings"
    @slotAdded="($event) => $emit('slotAdded', $event)"
    @slotRemoved="($event) => $emit('slotRemoved', $event)"
    @slotDateLocationChanged="
      ($event) => $emit('slotDateLocationChanged', $event)
    "
    @clearSelectedSlots="($event) => $emit('clearSelectedSlots', $event)"
  />
  <span
    v-if="slotDateSettings.length > 0"
    class="far fa-info-circle"
    style="display: flex; color: var(--darkBlue)"
  >
    <p style="font-family: 'Roboto'; margin-left: 0.3rem; color: var(--gray)">
      {{ $t("createSlots.info") }}
    </p></span
  >
</template>
<script>
import SlotSettings from "../SlotSettings.vue";
import JnDateTimepicker from "../../../ui-components/JnDateTimePicker/JnDateTimepicker.vue";
import { reactive, ref } from "vue";
export default {
  emits: ["slotAdded", "slotRemoved", "slotDateLocationChanged"],
  setup() {
    const slotTimeSettings = reactive({});
    const slotDateSettings = ref([]);

    const updateSlotSettings = (e) => Object.assign(slotTimeSettings, e);

    const slotDateSettingChanged = (e) => {
      slotDateSettings.value.length = 0;
      if (!e) return;
      e.length > 0
        ? e.forEach((item) => slotDateSettings.value.push(item))
        : slotDateSettings.value.push(e);
    };

    return {
      slotTimeSettings,
      slotDateSettings,
      updateSlotSettings,
      slotDateSettingChanged,
    };
  },
  components: {
    SlotSettings,
    JnDateTimepicker,
  },
};
</script>
<i18n src="../../../localizations/interviewSlots.json"></i18n>