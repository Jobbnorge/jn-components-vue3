<template>
  <div v-if="Object.keys(slots).length > 0">
    <div
      style="
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
      "
    >
      <h1 class="title">
        {{ $t("AvailableSlots.heading") }}
        <span
          style="text-decoration: underline; cursor: pointer"
          @click="
            () => {
              showExistingSlots = !showExistingSlots;
            }
          "
          >{{
            showExistingSlots
              ? $t("AvailableSlots.hide")
              : $t("AvailableSlots.show")
          }}</span
        >
        :
      </h1>
      <p style="color: var(--lightGray2)">
        {{
          $t("AvailableSlots.summaryExisting", [
            totalNumberOfSlots,
            numberOfDates,
          ])
        }}
      </p>
    </div>
    <transition name="fade">
      <div v-if="showExistingSlots">
        <div v-for="(value, key) in slots" :key="key">
          <h2 style="font-size: 1rem">{{ dayjs(key).format("DD.MM.YYYY") }}</h2>
          <div class="slot-container">
            <TimeSlot
              v-for="date in value"
              :key="date.startDate"
              :startTime="dayjs(date.startDate).format('HH:mm')"
              :isSelectable="false"
              :isOccupied="date.isOccupied"
            >
            </TimeSlot>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <div v-else>
    <h1 class="title">{{ $t("AvailableSlots.noExistingSlotsHeading") }}</h1>
    <p>{{ $t("AvailableSlots.noExistingSlots") }}</p>
  </div>
</template>
<script>
import TimeSlot from "@jobbnorge/jn-components/src/ui_components/buttons/TimeSlot.vue";
import { inject, reactive, ref, watch } from "@vue/runtime-core";
import dayjs from "dayjs";

export default {
  emits: ["existingSlotsChanged"],
  setup(props, ctx) {
    const interviewBatchId = inject("interviewBatchId");
    const jobId = inject("jobId");
    const slots = reactive({});
    const numberOfDates = ref(0);
    const totalNumberOfSlots = ref(0);
    const showExistingSlots = ref(true);

    const fetchBatches = () => {
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

    if (interviewBatchId.value != undefined) fetchBatches();

    watch(
      () => interviewBatchId.value,
      (val) => {
        Object.keys(slots).forEach((k) => {
          delete slots[k];
        });
        if (val) fetchBatches();
      }
    );

    watch(
      () => slots,
      (val) => {
        ctx.emit("existingSlotsChanged", val);
      },
      { deep: true }
    );
    return {
      slots,
      dayjs,
      numberOfDates,
      totalNumberOfSlots,
      showExistingSlots,
    };
  },
  components: {
    TimeSlot,
  },
};
</script>
<style scoped>
.title {
  font-size: 1.2rem;
  color: var(--gray);
}
.slot-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--lightGray);
  border-radius: 3px;
  width: fit-content;
}
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
