<template>
  <pre>{{ selectedSlots }}</pre>
  <CreateSlots
    :jobId="5346"
    :interviewBatchId="29"
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
    };
  },
};
</script>
