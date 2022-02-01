<template>
  <InterviewHeader
    @displaySlot="displaySlotChanged"
    @selectedBatchChanged="setInterviewBatch"
  ></InterviewHeader>
  <JnDateTimePicker
    :pickPeriod="true"
    :multipleDates="false"
    :allowPastDates="true"
    type="date"
    @selectedDateChanged="($event) => (selectedDates = $event)"
  />
  <div v-if="selectedDates?.length > 1">
    <span>Multiple dates selected</span>
    <ul>
      <li v-for="(date, index) in selectedDates" :key="index">
        {{ date.format("YYYY-MM-DD") }}
      </li>
    </ul>
  </div>
  <div v-else-if="selectedDates?.length === 1">
    <span>Single date selected</span>
    Selected Date: {{ selectedDates[0].format("YYYY-MM-DD") }}
  </div>
  <div v-else-if="selectedDates">
    <span>Single date selected</span>
    Selected Date: {{ selectedDates.format("YYYY-MM-DD") }}
  </div>
  <div v-else>Select a date!</div>

  <CreateSlots
    :jobId="5347"
    :interviewBatchId="interviewBatchId"
    @selectedSlotsChanged="($event) => (selectedSlots = $event)"
    @existingSlotsChanged="existingSlotsChanged"
  />
</template>

<script>
import CreateSlots from "./components/interview-slots/CreateSlots.vue";
import JnDateTimePicker from "./ui-components/JnDateTimePicker/JnDateTimepicker.vue";
import InterviewHeader from "./components/interview-header/InterviewHeader.vue";

export default {
  name: "App",
  components: {
    CreateSlots,
    JnDateTimePicker,
    InterviewHeader,
  },
  data: function () {
    return {
      selectedSlots: [],
      interviewBatchId: 51,
      selectedDates: null,
    };
  },
  methods: {
    existingSlotsChanged: (e) => console.info(e),
    displaySlotChanged: (e) => console.info(e),
    setInterviewBatch: (e) => console.info(e),
  },
};
</script>
