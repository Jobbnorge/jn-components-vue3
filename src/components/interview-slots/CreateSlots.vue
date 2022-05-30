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
        <SelectCreationMethod @toggleCreationMethod="toggleCreationMethod" />
        <transition name="fade">
          <component
            :is="creationMethod"
            @slotAdded="slotAdded"
            @slotRemoved="slotRemoved"
            @slotDateLocationChanged="slotDateLocationChanged"
            @clearSelectedSlots="clearSelectedSlots"
          >
          </component>
        </transition>

        <ConflictingDates
          v-if="conflictingDates.length > 0"
          :conflictingDates="conflictingDates"
        />
      </div>
    </transition>
    <div v-if="canAddMoreSlots">
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
import JnMiniButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnMiniButton.vue";
import ConflictingDates from "./ConflictingDates.vue";
import { provide, reactive, ref, toRefs, watch } from "vue";
import ManuallyCreateSlots from "./createSlots/ManuallyCreateSlots.vue";
import GenerateSlotSuggestions from "./createSlots/GenerateSlotSuggestions.vue";
import SelectCreationMethod from "./createSlots/SelectCreationMethod.vue";

export default {
  emits: ["selectedSlotsChanged", "deleteSlot", "createNewSlot"],
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

    const useGeneratedSlots = ref(false);
    const creationMethod = ref(GenerateSlotSuggestions);

    const toggleCreationMethod = () => {
      if (useGeneratedSlots.value) {
        creationMethod.value = GenerateSlotSuggestions;
        useGeneratedSlots.value = false;
      } else {
        creationMethod.value = ManuallyCreateSlots;
        useGeneratedSlots.value = true;
      }
    };

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

    const slotAdded = (date) => {
      selectedSlots.value.push({
        startDate: date.startDate,
        endDate: date.endDate,
        location: date.location ? date.location : undefined,
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

    const clearSelectedSlots = () => {
      selectedSlots.value.length = 0;
    };

    watch(
      () => slotsHasChanged.value,
      (val) => {
        if (val === true) {
          deleteAndRefetchSlots();
        }
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

    return {
      slots,
      selectedSlots,
      numberOfDates,
      totalNumberOfSlots,
      slotAdded,
      slotRemoved,
      conflictingDates,
      showSlotSettings,
      setCanAddMoreSlots,
      canAddMoreSlots,
      toggleSlotSettings,
      slotDateLocationChanged,
      clearSelectedSlots,
      toggleCreationMethod,
      creationMethod,
    };
  },
  components: {
    ExistingSlots,
    JnMiniButton,
    ConflictingDates,
    ManuallyCreateSlots,
    GenerateSlotSuggestions,
    SelectCreationMethod,
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
