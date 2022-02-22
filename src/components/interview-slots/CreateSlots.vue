<template>
  <div>
    <ExistingSlots
      style="margin: 1rem 0rem"
      :slots="slots"
      :totalNumberOfSlots="totalNumberOfSlots"
      :numberOfDates="numberOfDates"
      :showExistingSlotsSummary="showExistingSlotsSummary"
      @showExistingSlots="setCanAddMoreSlots"
    />
    <hr style="border: 1px solid #f6f5f6" />

    <transition name="fade">
      <div v-if="showAddMoreSlots">
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
        <span
          v-if="slotDateSettings.length > 0 && conflictingDates.length === 0"
          class="far fa-info-circle"
          style="color: var(--darkBlue)"
        >
          <p style="color: var(--gray)">
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
    </transition>
    <div v-if="canAddMoreSlots && selectedSlots.length === 0">
      <JnMiniButton @miniButton-clicked="toggleAddMoreSlots"
        ><span
          :class="[showAddMoreSlots ? 'fal fa-plus' : '']"
          style="margin-right: 0.3rem"
        ></span
        >{{
          showAddMoreSlots
            ? $t("createSlots.addMoreCancel")
            : $t("createSlots.addMore")
        }}</JnMiniButton
      >
    </div>
  </div>
</template>
<script>
import ExistingSlots from "./ExistingSlots.vue";
import SlotSettings from "./SlotSettings.vue";
import JnMiniButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnMiniButton.vue";
import JnDateTimepicker from "../../ui-components/JnDateTimePicker/JnDateTimepicker.vue";
import SelectSlots from "./SelectSlots.vue";
import ConflictingDates from "./ConflictingDates.vue";
import { provide, reactive, ref, toRefs, watch, computed } from "vue";

export default {
  emits: ["selectedSlotsChanged"],
  setup(props, ctx) {
    const { jobId, interviewBatchId, showExistingSlotsSummary } = toRefs(props);
    provide("jobId", jobId);
    provide("interviewBatchId", interviewBatchId);

    const slotTimeSettings = reactive({});
    const slotDateSettings = ref([]);
    const selectedSlots = ref([]);
    const slots = reactive({});
    const numberOfDates = ref(0);
    const totalNumberOfSlots = ref(0);
    const conflictingDates = ref([]);
    const showAddMoreSlots = ref(false);
    const canAddMoreSlots = computed(() =>
      totalNumberOfSlots.value === 0 ? true : !showExistingSlotsSummary
    );

    const fetchSlots = () => {
      fetch(
        `${process.env.VUE_APP_URLS_APIBASE}job/${jobId.value}/interviewbatch/${interviewBatchId.value}/interviewslot/`,
        { credentials: "include" }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          numberOfDates.value = Object.keys(data).length;
          Object.values(data).forEach((date) => {
            totalNumberOfSlots.value += date.length;
          });
          Object.assign(slots, data);
        });
    };

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

    const setCanAddMoreSlots = (val) => {
      canAddMoreSlots.value = val;
    };

    const toggleAddMoreSlots = () => {
      showAddMoreSlots.value = !showAddMoreSlots.value;
    };

    watch(
      () => [interviewBatchId.value, jobId.value],
      (values) => {
        Object.keys(slots).forEach((k) => {
          delete slots[k];
        });
        numberOfDates.value = 0;
        totalNumberOfSlots.value = 0;
        if (values.every((val) => val != undefined)) fetchSlots();
      },
      { immediate: true }
    );

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
      slots,
      selectedSlots,
      numberOfDates,
      totalNumberOfSlots,
      slotTimeSettingChanged,
      slotDateSettingChanged,
      slotTimeSettings,
      slotDateSettings,
      slotAdded,
      slotRemoved,
      conflictingDates,
      showAddMoreSlots,
      setCanAddMoreSlots,
      canAddMoreSlots,
      toggleAddMoreSlots,
    };
  },
  components: {
    SlotSettings,
    ExistingSlots,
    JnMiniButton,
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
    showExistingSlotsSummary: Boolean,
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.4s, opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  transform: translate3d(0, -10px, 0);
  opacity: 0;
}
</style>
<i18n src="../../localizations/interviewSlots.json"></i18n>
