<template>
  <div :aria-label="getLabelText" class="container">
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
      <JnButton v-if="displayDate" @JnButton-clicked="reset">{{
        $t("datepicker.remove")
      }}</JnButton>
    </div>
    <div
      class="date-time"
      role="dialog"
      aria-modal="true"
      ref="dateTimeElement"
    >
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
        :preSelectedTime="{
          hour: selectedDate?.hour(),
          minute: selectedDate?.minute(),
        }"
        @selectedHour="setSelectedHour"
        @selectedMinute="setSelectedMinute"
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
import { toRaw } from "@vue/reactivity";
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
    preselectedDate: String,
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
  created() {
    if (this.preselectedDate != undefined) {
      this.selectedDate = dayjs(this.preselectedDate);
      this.selectedHour = this.selectedDate.hour();
      this.selectedMinute = this.selectedDate.minute();
      switch (this.type) {
        case "date":
          this.displayDate = this.selectedDate.format("DD.MM.YYYY");
          break;
        case "dateTime":
          this.displayDate = this.selectedDate.format("DD.MM.YYYY, HH:mm");
          break;
      }
    }
  },
  updated() {
    var el = this.$refs.dateTimeElement;
    var { right } = el.getBoundingClientRect();
    if (right > window.innerWidth) el.style.right = 0;
  },
  methods: {
    updateSelected(date) {
      switch (this.type) {
        case "date":
          if (this.pickPeriod) {
            this.setDisplayDatesForPeriod(date);
            this.selectedDatesChanged(date);
            return;
          } else {
            this.selectedDate = date;
            this.displayDate = this.selectedDate.format("DD.MM.YYYY");
          }
          break;
        case "dateTime":
          this.selectedDate = dayjs(
            new Date(
              `${date.format("MM")}, ${date.format("DD")}, ${date.format(
                "YYYY"
              )} ${this.selectedHour}:${this.selectedMinute}:00`
            )
          );
          this.displayDate = this.selectedDate.format("DD.MM.YYYY, HH:mm");
          break;
        case "time":
          this.displayDate = new Date().setHours(
            this.selectedHour,
            this.selectedMinute
          );
          this.displayDate = dayjs(this.displayDate).format("HH:mm");
          break;
      }
      this.$emit("selectedDateChanged", this.selectedDate);
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
        this.displayDate = `${date.firstDate.format(
          "DD.MM.YYYY"
        )} - ${date.secondDate.format("DD.MM.YYYY")} `;
      } else {
        this.displayDate = date.format("DD.MM.YYYY");
      }
    },
    selectedDatesChanged(dates) {
      if (dates.firstDate == undefined || dates.secondDate == undefined) return;
      const arr = [toRaw(dates.firstDate)];
      var dateBetween = dates.firstDate;
      while (dateBetween.isBefore(dates.secondDate)) {
        dateBetween = dateBetween.add(1, "day");
        arr.push(dateBetween);
      }
      this.$emit("selectedDateChanged", arr);
    },
    reset() {
      this.displayDate = null;
      this.selectedDate = null;
      this.$emit("selectedDateChanged", null);
    },
  },
};
</script>
<i18n src="..\..\localizations/datepicker.json"></i18n>
<style scoped>
.container {
  position: relative;
}
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
  position: absolute;
  display: flex;
  justify-content: flex-start;
  z-index: 1;
}
</style>
