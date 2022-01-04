<template>
  <pre>{{ selectedSlots }}</pre>
  <CreateSlots
    :jobId="5346"
    :interviewBatchId="interviewBatchId"
    @selectedSlotsChanged="($event) => (selectedSlots = $event)"
  />
</template>

<script>
import CreateSlots from "./components/interview-slots/CreateSlots.vue";

export default {
  name: "App",
  components: {
    CreateSlots,
  },
  data: function () {
    return {
      selectedSlots: [],
      interviewBatchId: null,
    };
  },
};
</script>
