<template>
  <InterviewHeader
    :jobId="jobId"
    @displaySlot="displaySlotChanged"
    @selectedBatchChanged="setInterviewBatch"
    @newBatchTitleChanged="setNewBatch"
    @selectedSlotsChanged="selectedSlotsChanged"
  ></InterviewHeader>
  <JnDateTimePicker
    :pickPeriod="false"
    :multipleDates="true"
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
    :jobId="jobId"
    :showExistingSlotsSummary="false"
    :interviewBatchId="interviewBatchId"
    @selectedSlotsChanged="selectedSlotsChanged"
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
  <h2>Empty slots with custom empty state slot</h2>
  <ExistingSlots
    :slots="slotExample2"
    :totalNumberOfSlots="0"
    :numberOfDates="0"
    :showExistingSlotsSummary="false"
  >
    <template #emptyState
      ><div style="background: yellow; padding: 1rem; width: fit-content">
        HER E DET INGEN JÆVLA SLOTS
      </div></template
    >
  </ExistingSlots>
  <div style="margin-top: 2rem;">
    <DropDownButton
      text="Velg et element"
      isPrimary
      :options="[
        { id: '1', text: 'Item1' },
        { id: '2', text: 'hello 2' },
        { id: '2', text: 'hello 3', disabled: true },
      ]"
      @itemClicked="itemClicked"
      id="mydrop"
    />
  </div>
</template>

<script>
import CreateSlots from "./components/interview-slots/CreateSlots.vue";
import JnDateTimePicker from "./ui-components/JnDateTimePicker/JnDateTimepicker.vue";
import InterviewHeader from "./components/interview-header/InterviewHeader.vue";
import DateLocationInput from "./components/DateLocationInput.vue";
import ExistingSlots from "./components/interview-slots/ExistingSlots.vue";
import DropDownButton from "./ui-components/DropDownButton/DropDownButton.vue"; 

export default {
  name: "App",
  components: {
    CreateSlots,
    JnDateTimePicker,
    InterviewHeader,
    DateLocationInput,
    ExistingSlots,
    DropDownButton
  },
  data: function () {
    return {
      selectedSlots: [],
      interviewBatchId: 46,
      jobId: 8318,
      selectedDates: null,
      currentInterviewBatch: null,
      emptySlotExample: {},
      slotExample: {
        "2022-02-17T00:00:00": [
          {
            id: 1,
            startDate: "2022-02-17T10:30:00",
            endDate: "2022-02-17T11:30:00",
            isOccupied: false,
            location: "Inspirasjon 3.etg, fløy B",
          },
          {
            id: 2,
            startDate: "2022-02-17T11:45:00",
            endDate: "2022-02-17T12:45:00",
            isOccupied: false,
            location: "Inspirasjon 3.etg, fløy B",
          },
          {
            id: 3,
            startDate: "2022-02-17T14:15:00",
            endDate: "2022-02-17T15:15:00",
            isOccupied: false,
            location: "Inspirasjon 3.etg, fløy B",
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
      console.info(e);
    },
    dateLocationInputUpdated: (e) => console.info(e),
    selectedSlotsChanged(e) {
      this.selectedSlots = e;
      console.info(e);
    },
    itemClicked: (e) => console.info("you clicked, " + e.text + " id=" + e.id),
    setNewBatch: (e) => console.info("We are creating a new batch...", e)
  },
};
</script>
