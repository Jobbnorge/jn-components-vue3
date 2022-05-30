<template>
  <div>
    <ExistingSlots
      style="margin: 1rem 0rem"
      :slots="slots"
      :totalNumberOfSlots="totalNumberOfSlots"
      :numberOfDates="numberOfDates"
      :canDeleteSlots="canDeleteSlots"
      :showExistingSlotsSummary="showExistingSlotsSummary"
      @showExistingSlots="setCanAddMoreSlots"
      @deleteSlot="($event) => $emit('deleteSlot', $event)"
    />
    <hr style="border: 1px solid #f6f5f6" />

    <transition name="fade">
      <div v-if="showSlotSettings">
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
          style="display: flex; color: var(--darkBlue)"
        >
          <p
            style="
              font-family: 'Roboto';
              margin-left: 0.3rem;
              color: var(--gray);
            "
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
          @slotDateLocationChanged="slotDateLocationChanged"
        />
      </div>
    </transition>
    <div v-if="canAddMoreSlots && selectedSlots.length === 0">
      <JnMiniButton @miniButton-clicked="toggleSlotSettings"
        ><span
          :class="[showSlotSettings ? '' : 'fal fa-plus']"
          style="margin-right: 0.3rem"
        ></span
        >{{
          showSlotSettings
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
import { provide, reactive, ref, toRefs, watch } from "vue";

export default {
  emits: ["selectedSlotsChanged", "deleteSlot"],
  setup(props, ctx) {
    const {
      jobId,
      interviewBatchId,
      showExistingSlotsSummary,
      isNewBatch,
      slotsHasChanged,
    } = toRefs(props);
    provide("jobId", jobId);
    provide("interviewBatchId", interviewBatchId);

    const slotTimeSettings = reactive({});
    const slotDateSettings = ref([]);
    const selectedSlots = ref([]);
    const slots = reactive({});
    const numberOfDates = ref(0);
    const totalNumberOfSlots = ref(0);
    const conflictingDates = ref([]);
    const showSlotSettings = ref(false);
    const canAddMoreSlots = ref(
      showExistingSlotsSummary.value === false ||
        totalNumberOfSlots.value == 0 ||
        isNewBatch.value == true
    ); //Set initial value

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
          setCanAddMoreSlots(
            showExistingSlotsSummary.value === false ||
              totalNumberOfSlots.value == 0
          );
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
      if (totalNumberOfSlots.value == 0) {
        canAddMoreSlots.value = true;
      } else canAddMoreSlots.value = val;
    };

    const toggleSlotSettings = () => {
      showSlotSettings.value = !showSlotSettings.value;
    };

    const slotDateLocationChanged = (event) => {
      selectedSlots.value.forEach((slot) => {
        let slotDateStr = slot.startDate.slice(0, 10);
        if (event.date.slice(0, 10) === slotDateStr)
          slot.location = event.location;
      });
    };

    const deleteAndRefetchSlots = () => {
      Object.keys(slots).forEach((k) => {
        delete slots[k];
      });
      numberOfDates.value = 0;
      totalNumberOfSlots.value = 0;
      fetchSlots();
    };

    watch(
      () => slotsHasChanged.value,
      () => {
        deleteAndRefetchSlots();
      }
    );
    watch(
      () => [interviewBatchId.value, jobId.value],
      (values) => {
        if (values.every((val) => val != undefined)) deleteAndRefetchSlots();
      },
      { immediate: true }
    );

    watch(
      () => isNewBatch.value,
      (val) => {
        if (val === true) {
          setCanAddMoreSlots(true);
        }
      }
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
      showSlotSettings,
      setCanAddMoreSlots,
      canAddMoreSlots,
      toggleSlotSettings,
      slotDateLocationChanged,
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
    isNewBatch: Boolean,
    canDeleteSlots: {
      type: Boolean,
      default: false,
    },
    slotsHasChanged: {
      type: Boolean,
      deafault: false,
    },
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
