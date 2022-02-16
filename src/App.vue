<template>
  <InterviewHeader
    :jobId="jobId"
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
    v-if="currentInterviewBatch"
    :jobId="jobId"
    :showExistingSlotsSummary="false"
    :interviewBatchId="interviewBatchId"
    @selectedSlotsChanged="($event) => (selectedSlots = $event)"
    @existingSlotsChanged="existingSlotsChanged"
  />
  <DateLocationInput
    :candidateId="1"
    @inputChanged="dateLocationInputUpdated"
  ></DateLocationInput>
  <h1>ExistingSlots</h1>
  <ExistingSlots
    :slots="slotExample"
    :totalNumberOfSlots="5"
    :numberOfDates="2"
    :showExistingSlotsSummary="false"
  />
</template>

<script>
import CreateSlots from "./components/interview-slots/CreateSlots.vue";
import JnDateTimePicker from "./ui-components/JnDateTimePicker/JnDateTimepicker.vue";
import InterviewHeader from "./components/interview-header/InterviewHeader.vue";
import DateLocationInput from "./components/DateLocationInput.vue";
import ExistingSlots from "./components/interview-slots/ExistingSlots.vue"; 

export default {
  name: "App",
  components: {
    CreateSlots,
    JnDateTimePicker,
    InterviewHeader,
    DateLocationInput,
    ExistingSlots
  },
  data: function () {
    return {
      selectedSlots: [],
      interviewBatchId: 8,
      jobId: 9262,
      selectedDates: null,
      currentInterviewBatch: null,
      slotExample: {
        "2022-02-17T00:00:00": [
          {
            id: 1,
            startDate: "2022-02-17T10:30:00",
            endDate: "2022-02-17T11:30:00",
            isOccupied: false,
          },
          {
            id: 2,
            startDate: "2022-02-17T11:45:00",
            endDate: "2022-02-17T12:45:00",
            isOccupied: false,
          },
          {
            id: 3,
            startDate: "2022-02-17T14:15:00",
            endDate: "2022-02-17T15:15:00",
            isOccupied: false,
          },
        ],
        "2022-02-19T00:00:00": [
          {
            id: 4,
            startDate: "2022-02-19T10:30:00",
            endDate: "2022-02-19T11:30:00",
            isOccupied: false,
          },
          {
            id: 5,
            startDate: "2022-02-19T09:15:00",
            endDate: "2022-02-19T10:15:00",
            isOccupied: false,
          },
          {
            id: 6,
            startDate: "2022-02-19T11:45:00",
            endDate: "2022-02-19T12:45:00",
            isOccupied: false,
          },
          {
            id: 7,
            startDate: "2022-02-19T14:15:00",
            endDate: "2022-02-19T15:15:00",
            isOccupied: false,
          },
        ],
      },
    };
  },
  methods: {
    existingSlotsChanged: (e) => console.info(e),
    displaySlotChanged: (e) => console.info(e),
    setInterviewBatch(e) {
      this.currentInterviewBatch = e;
    },
    dateLocationInputUpdated: (e) => console.info(e),
  },
};
</script>
