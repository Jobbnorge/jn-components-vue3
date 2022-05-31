<template>
  <InfoBox
    colorTheme="gray"
    style="margin-top: 1rem"
    v-if="selectedSlots.length > 0"
  >
    <template #box-content>
      <h2 style="font-size: 1rem">{{ $t("createSlots.slotsAddedToList") }}:</h2>
      <div class="slot-container">
        <InterviewSlotCard
          v-for="slot in selectedSlots"
          :key="slot.startDate"
          :startTime="dayjs(slot.startDate).format('HH:mm')"
          :endTime="dayjs(slot.endDate).format('HH:mm')"
          :place="slot.location"
          :date="dayjs(slot.startDate).format('DD.MM.YYYY')"
          :canBeDeleted="true"
          :buttonText="$t('AvailableSlots.delete')"
          @deleteSlot="($event) => $emit('slotRemoved', slot)"
        >
        </InterviewSlotCard>
      </div>
    </template>
  </InfoBox>
  <div>
    <DateLocationInput
      @inputChanged="($event) => (currentSlotData = $event)"
      :allowPastDates="false"
    />
    <div style="display: flex; justify-content: end; margin: 1rem 0rem">
      <JnButton colorTheme="blue" light @jnButton-clicked="addSlot"
        ><span class="fal fa-plus" style="margin-left: 0.3rem"></span
        >{{ $t("createSlots.add") }}</JnButton
      >
    </div>
    <div v-if="showErrorMessage">
      {{ $t("createSlots.errorSingleSlot") }}
    </div>
  </div>
</template>
<script>
import DateLocationInput from "../../DateLocationInput.vue";
import JnButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnButton.vue";
import InfoBox from "@jobbnorge/jn-components/src/ui_components/containers/InfoBox.vue";
import InterviewSlotCard from "@jobbnorge/jn-components/src/ui_components/cards/InterviewSlotCard.vue";
import dayjs from "dayjs";
import { ref, inject } from "vue";

export default {
  emits: ["slotAdded", "slotRemoved"],
  setup(props, ctx) {
    const jobId = inject("jobId");
    const currentSlotData = ref(undefined);
    const showErrorMessage = ref(false);
    const slotToCreate = ref(undefined);

    const addSlot = () => {
      if (slotDataIsValid()) {
        fetchSlot();
        showErrorMessage.value = false;
      } else {
        showErrorMessage.value = true;
      }
    };
    const slotDataIsValid = () => {
      if (
        currentSlotData.value !== undefined &&
        (currentSlotData.value.date !== undefined ||
          currentSlotData.value.date !== null) &&
        currentSlotData.value.duration !== ""
      )
        return true;
      return false;
    };
    const fetchSlot = () => {
      var query = {
        startDate: dayjs(currentSlotData.value.date).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        duration: currentSlotData.value.duration,
        location: currentSlotData.value.details,
      };

      query = Object.entries(query).map((el) => el.join("="));

      fetch(
        `${process.env.VUE_APP_URLS_APIBASE}job/${
          jobId.value
        }/interview/single-slot?${query.join("&")}`,
        {
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => (slotToCreate.value = data))
        .finally(() => ctx.emit("slotAdded", slotToCreate.value));
    };

    return {
      currentSlotData,
      addSlot,
      showErrorMessage,
      dayjs,
    };
  },
  components: {
    DateLocationInput,
    JnButton,
    InfoBox,
    InterviewSlotCard,
  },
  props: {
    selectedSlots: Array,
  },
};
</script>
<i18n src="../../../localizations/interviewSlots.json"></i18n>

<style scoped>
.slot-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  width: fit-content;
}
</style>
