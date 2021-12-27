<template>
  <div :aria-label="getLabelText">
    <div style="display: flex; gap: 0.5rem; align-items: center">
      <div
        class="picker"
        role="button"
        :style="getStyles"
        @click="showCalendar = !showCalendar"
      >
        {{ displayDate
        }}<span
          class="fal fa-calendar"
          :style="displayDate ? 'margin-left: 0.5rem;' : ''"
        ></span>
      </div>
      <JnButton v-if="displayDate" @JnButton-clicked="displayDate = null">{{
        $t("datepicker.remove")
      }}</JnButton>
    </div>
    <div class="date-time" role="dialog" aria-modal="true">
      <Calendar
        v-if="type !== 'time' && showCalendar"
        :pickPeriod="pickPeriod"
        :allowPastDates="allowPastDates"
        :preSelectedDate="selectedDate"
        @updatedSelected="updateSelected"
        @invalidDatePicked="handleError"
        @closePicker="closePicker"
      />
      <!-- (type === 'dateTime' || type === 'time')  -->
      <TimeSelect
        v-if="type != 'date' && !pickPeriod && showCalendar"
        :isTimePickerOnly="type === 'time'"
        :minutesInterval="minutesInterval"
        :preSelectedTime="{ hour: selectedHour, minute: selectedMinute }"
        @selectedHour="setSelectedHour"
        @selectedMinute="setSelectedMinute"
        @updatedSelected="updateSelected"
        @closePicker="closePicker"
      />
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Calendar from "./components/Calendar.vue";
import TimeSelect from "./components/TimeSelect.vue";
import JnButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnButton.vue";
export default {
  name: "DatePicker",
  emits: ["selectedDateChanged"],
  components: {
    Calendar,
    TimeSelect,
    JnButton,
  },
  props: {
    pickPeriod: {
      type: Boolean,
      default: false,
    },
    allowPastDates: {
      type: Boolean,
      default: true,
    },
    includeTimepicker: {
      type: Boolean,
      default: false,
    },
    minutesInterval: {
      type: Number,
      default: 5,
    },
    type: {
      type: String,
      default: "date",
      validator: function (value) {
        return ["date", "dateTime", "time"].indexOf(value) !== -1;
      },
    },
  },
  computed: {
    getLabelText() {
      if (this.pickPeriod) {
        return this.$t("datepicker.selectPeriod");
      } else {
        switch (this.type) {
          case "date":
            return this.$t("datepicker.selectDate");
          case "time":
            return this.$t("datepicker.selectTime");
          case "dateTime":
            return this.$t("datepicker.selectDateTime");
          default:
            return "";
        }
      }
    },
    getStyles() {
      return {
        width: this.pickPeriod ? "15rem" : "10rem",
        "border-color": this.showCalendar ? "var(--darkBlue)" : "inherit",
        "border-width": this.showCalendar ? "2px" : "1px",
      };
    },
  },
  data() {
    return {
      showCalendar: false,
      selectedDate: null,
      selectedHour: 0,
      selectedMinute: 0,
      displayDate: null,
    };
  },
  methods: {
    updateSelected(date) {
      switch (this.type) {
        case "date":
          if (this.pickPeriod) {
            this.setDisplayDatesForPeriod(date);
          } else {
            this.selectedDate = dayjs(date);
            this.displayDate = this.selectedDate.format("DD.MM.YYYY");
          }
          return;
        case "dateTime":
          this.selectedDate = dayjs(
            new Date(
              `${date.format("MM")}, ${date.format("DD")}, ${date.format(
                "YYYY"
              )} ${this.selectedHour}:${this.selectedMinute}:00`
            )
          );
          this.displayDate = this.selectedDate.format("DD.MM.YYYY, HH:mm");
          return;
        case "time":
          this.displayDate = new Date().setHours(
            this.selectedHour,
            this.selectedMinute
          );
          this.displayDate = dayjs(this.displayDate).format("HH:mm");
          return;
        default:
          return;
      }
    },
    handleError() {
      alert(this.$t("datepicker.alert"));
    },
    setSelectedHour(hour) {
      this.selectedHour = hour;
      this.updateSelected(this.selectedDate);
    },
    setSelectedMinute(minute) {
      this.selectedMinute = minute;
      this.updateSelected(this.selectedDate);
    },
    closePicker() {
      this.showCalendar = false;
    },
    setDisplayDatesForPeriod(date) {
      if (date.firstDate && date.secondDate) {
        this.displayDate = `${dayjs(date.firstDate).format(
          "DD.MM.YYYY"
        )} - ${dayjs(date.secondDate).format("DD.MM.YYYY")} `;
      } else {
        this.displayDate = date.format("DD.MM.YYYY");
      }
    },
  },
  watch: {
    selectedDate: function (val) {
      this.$emit("selectedDateChanged", val);
    },
  },
};
</script>
<i18n src="..\..\localizations/datepicker.json"></i18n>
<style scoped>
.picker {
  height: 1.5rem;
  border: 1px solid var(--gray);
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  box-sizing: content-box;
}
.date-time {
  position: fixed;
  display: flex;
  justify-content: flex-start;
}
</style>
