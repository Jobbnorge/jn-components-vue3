<template>
  <div v-if="slotToCreate">
    <InfoBox colorTheme="gray" style="margin-top: 1rem">
      <template #box-content>
        <h2 style="font-size: 1rem">
          {{ dayjs(slotToCreate.startDate).format("dddd DD.MM.YYYY") }}
        </h2>
        <div class="slot-container">
          <InterviewSlotCard
            :startTime="dayjs(slotToCreate.startDate).format('HH:mm')"
            :endTime="dayjs(slotToCreate.endDate).format('HH:mm')"
            :place="slotToCreate.location"
            :canBeDeleted="false"
            :buttonText="$t('AvailableSlots.delete')"
          >
          </InterviewSlotCard>
        </div>
      </template>
    </InfoBox>
    <JnButton
      style="margin-top: 1rem"
      colorTheme="blue"
      light
      @jnButton-clicked="cancel"
      ><span class="fal fa-times" style="margin-left: 0.3rem"></span
      >{{ $t("createSlots.removeManuallyCreated") }}</JnButton
    >
  </div>
  <div v-else>
    <DateLocationInput
      @inputChanged="($event) => (currentSlotData = $event)"
      :allowPastDates="false"
    />
    <JnButton colorTheme="blue" light @jnButton-clicked="addSlot"
      style="margin: 1rem 0rem; "><span class="fal fa-plus" style="margin-left: 0.3rem"></span
      >{{ $t("createSlots.add") }}</JnButton
    >
    <div v-if="showErrorMessage">
      {{ $t("createSlot.errorSingleSlot") }}
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

    const cancel = () => {
      ctx.emit("slotRemvoed", slotToCreate.value);
      slotToCreate.value = undefined;
    };

    return {
      currentSlotData,
      addSlot,
      showErrorMessage,
      slotToCreate,
      dayjs,
      cancel,
    };
  },
  components: {
    DateLocationInput,
    JnButton,
    InfoBox,
    InterviewSlotCard,
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
