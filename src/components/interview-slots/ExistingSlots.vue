<template>
  <div>
    <h1 class="title">{{ $t("AvailableSlots.heading") }}</h1>
    <div v-for="(value, key) in slots" :key="key">
      <h2 style="font-size: 1rem">{{ dayjs(key).format("DD.MM.YYYY") }}</h2>
      <div class="slot-container">
        <TimeSlot
          v-for="date in value"
          :key="date.startDate"
          :startTime="dayjs(startTime).format('HH:mm')"
          :isSelectable="false"
          :isOccupied="date.isOccupied"
        >
        </TimeSlot>
      </div>
    </div>
  </div>
</template>
<script>
import TimeSlot from "@jobbnorge/jn-components/src/ui_components/buttons/TimeSlot.vue";
import { httpService } from "@jobbnorge/js-services/http.service";
import { inject, reactive } from "@vue/runtime-core";
import dayjs from "dayjs";

export default {
  setup() {
    const interviewBatchId = inject("interviewBatchId");
    const slots = reactive({});
    if (interviewBatchId.value != undefined) {
      const jobId = inject("jobId");
      httpService
        .get(
          `job/${jobId.value}/interviewbatch/${interviewBatchId.value}/interviewslot`
        )
        .then(({ data }) => {
          console.info(data);
          Object.assign(slots, data);
        });
    }
    return { slots, dayjs };
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
</style>
<i18n src="../../localizations/interviewSlots.json"></i18n>
