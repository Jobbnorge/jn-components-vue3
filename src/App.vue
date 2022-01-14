<template>
  <pre>{{ selectedSlots }}</pre>
  <CreateSlots
    :jobId="5347"
    :interviewBatchId="interviewBatchId"
    @selectedSlotsChanged="($event) => (selectedSlots = $event)"
    @existingSlotsChanged="existingSlotsChanged"
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
      interviewBatchId: 51,
    };
  },
  methods: {
    existingSlotsChanged: (e) => console.info(e),
  },
};
</script>
