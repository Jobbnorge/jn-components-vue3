<template>
  <div :class="['calendar-month']">
    <CalendarMonthSelector
      :selectedDate="selectedDate"
      :today="today"
      @dateSelected="setNewSelectedMonth"
    />
    <CalendarWeekdays />
    <div class="calendar-days">
      <ol class="days-grid" aria-label="calendar">
        <CalendarDayItem
          v-for="day in days"
          :key="day.date"
          :day="day"
          :isCurrentMonth="day.isCurrentMonth"
          :isCurrentPeriod="day.isCurrentPeriod"
          :isSelected="isSelected(day)"
          :isToday="day.date === today"
          :isFirstDate="isFirstDate(day)"
          :isSecondDate="isSecondDate(day)"
          :isFocused="day.date === dateInFocus"
          @daySelected="setNewSelectedDay"
          @setFocus="shiftFocus"
        />
      </ol>
    </div>
    <div style="display: flex; margin-top: 1rem; justify-content: end">
      <JnButton colorTheme="blue" @JnButton-clicked="clickFinish">{{
        $t("datepicker.done")
      }}</JnButton>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
require("dayjs/locale/nb");
dayjs.locale("nb");
import weekday from "dayjs/plugin/weekday";
//import weekOfYear from "dayjs/plugin/weekOfYear";
import CalendarMonthSelector from "../components/CalendarMonthSelector.vue";
import CalendarWeekdays from "../components/CalendarWeekdays.vue";
import CalendarDayItem from "../components/CalendarDayItem.vue";
import JnButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnButton.vue";

dayjs.extend(weekday);

export default {
  name: "CalendarContainer",
  components: {
    CalendarMonthSelector,
    CalendarWeekdays,
    CalendarDayItem,
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
    includeTimePicker: {
      type: Boolean,
      default: false,
    },
    preSelectedDate: {
      type: Object,
    },
  },
  emits: ["updatedSelected", "showSelectedDate", "invalidDatePicked", "closePicker"],
  data() {
    return {
      selectedDate: null,
      firstDate: null,
      secondDate: null,
      focusedDate: dayjs(),
    };
  },
  created() {
    this.selectedDate = this.preSelectedDate ? this.preSelectedDate : dayjs();
  },
  computed: {
    days() {
      return [
        ...this.previousMonthDays,
        ...this.currentMonthDays,
        ...this.nextMonthDays,
      ];
    },
    date() {
      return this.selectedDate.format("DD");
    },
    dateInFocus() {
      return this.focusedDate.format("YYYY-MM-DD");
    },
    month() {
      return Number(this.selectedDate.format("M"));
    },
    year() {
      return Number(this.selectedDate.format("YYYY"));
    },
    today() {
      return dayjs().format("YYYY-MM-DD");
    },
    numberOfDaysInMonth() {
      return dayjs(this.selectedDate).daysInMonth();
    },
    currentMonthDays() {
      let period = [...this.selectedPeriod];

      return [...Array(this.numberOfDaysInMonth)].map((day, index) => {
        let dateItem = dayjs(`${this.year}-${this.month}-${index + 1}`);
        let isInPeriod = false;
        period.forEach((d) => {
          if (d.format("YYYY-MM-DD") === dateItem.format("YYYY-MM-DD")) {
            isInPeriod = true;
          }
        });
        return {
          date: dateItem.format("YYYY-MM-DD"),
          isCurrentMonth: true,
          isCurrentPeriod: isInPeriod,
        };
      });
    },
    nextMonthDays() {
      const lastDayOfTheMonthWeekday = this.getWeekday(
        `${this.year}-${this.month}-${this.currentMonthDays.length}`
      );

      const nextMonth = dayjs(`${this.year}-${this.month}-01`).add(1, "month");

      //Is lastDayOfTheMonth also a sunday = 6? (no need to display further dates to fill the grid)
      const visibleNumberOfDaysFromNextMonth =
        lastDayOfTheMonthWeekday === 6
          ? lastDayOfTheMonthWeekday
          : 6 - lastDayOfTheMonthWeekday;

      let period = [...this.selectedPeriod];

      return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
        let isInPeriod = false;
        period.forEach((d) => {
          if (d.format("YYYY-MM-DD") === nextMonth.format("YYYY-MM-DD")) {
            isInPeriod = true;
          }
        });
        return {
          date: dayjs(
            `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
          ).format("YYYY-MM-DD"),
          isCurrentMonth: false,
          isCurrentPeriod: isInPeriod,
        };
      });
    },
    previousMonthDays() {
      const firstDayOfTheMonthWeekday = this.getWeekday(
        this.currentMonthDays[0].date
      );
      const previousMonth = dayjs(`${this.year}-${this.month}-01`).subtract(
        1,
        "month"
      );

      const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday;

      const previousMonthLastMondayDayOfMonth = dayjs(
        this.currentMonthDays[0].date
      )
        .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
        .date();

      let period = [...this.selectedPeriod];

      return [...Array(visibleNumberOfDaysFromPreviousMonth)].map(
        (day, index) => {
          let isInPeriod = false;
          period.forEach((d) => {
            if (d.format("YYYY-MM-DD") === previousMonth.format("YYYY-MM-DD")) {
              isInPeriod = true;
            }
          });
          return {
            date: dayjs(
              `${previousMonth.year()}-${previousMonth.month() + 1}-${
                previousMonthLastMondayDayOfMonth + index
              }`
            ).format("YYYY-MM-DD"),
            isCurrentMonth: false,
            isCurrentPeriod: isInPeriod,
          };
        }
      );
    },
    selectedPeriod() {
      var datesInPeriod = [];

      if (this.firstDate && this.secondDate) {
        const secondDateIsAfterTheFirst =
          this.secondDate.diff(this.firstDate) > 0;

        var numberOfDays = this.secondDate.diff(this.firstDate, "day");

        if (secondDateIsAfterTheFirst) {
          for (var i = 0; i <= numberOfDays; i++) {
            datesInPeriod.push(this.firstDate.add(i, "day"));
          }
        } else {
          for (var y = numberOfDays; y <= 0; y++) {
            datesInPeriod.push(this.secondDate.subtract(y, "day"));
          }
        }
      }
      return datesInPeriod;
    },
  },
  methods: {
    getWeekday(date) {
      return dayjs(date).weekday();
    },
    setNewSelectedMonth(newSelectedDate) {
      //selected month
      this.selectedDate = newSelectedDate;
    },
    setNewSelectedDay(newSelectedDate) {
      if (!this.allowPastDates && newSelectedDate.diff(this.today) < 0) {
        this.$emit("invalidDatePicked");
      } else {
        this.selectedDate = newSelectedDate;

        if (this.pickPeriod) {
          if (this.firstDate) {
            this.secondDate = this.selectedDate;
            this.$emit("updatedSelected", {
              firstDate: this.firstDate,
              secondDate: this.secondDate,
            });
            return;
          } else {
            this.firstDate = this.selectedDate;
          }
        }
        this.$emit("updatedSelected", this.selectedDate);
      }
    },
    isSelected(day) {
      return day.date === this.selectedDate.format("YYYY-MM-DD");
    },
    isFirstDate(day) {
      return this.firstDate
        ? day.date === this.firstDate.format("YYYY-MM-DD")
        : false;
    },
    isSecondDate(day) {
      return this.secondDate
        ? day.date === this.secondDate.format("YYYY-MM-DD")
        : false;
    },
    clickFinish() {
      this.$emit("closePicker");
    },
    shiftFocus(date) {
      this.focusedDate = date.newDate;
      this.shouldIncrementMonth = date.wasIncremented;
      var el = document.getElementById(
        `${this.focusedDate.format("YYYY-MM-DD")}`
      );
      if (el) {
        el.focus();
      }
    },
  },
};
</script>
<i18n src="..\..\..\localizations/datepicker.json"></i18n>
<style scoped>
.calendar-month {
  width: 320px;
  border: 1px solid #f6f5f6;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 0.5rem;
  align-self: center;
}
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  height: 100%;
  position: relative;
  grid-column-gap: 1px;
  grid-row-gap: 1px;
}
.calendar-days {
  height: 80%;
}
ol,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
hr {
  margin: 0.5rem 0 0.5rem 0;
  border: 1px solid #f6f5f6;
}
</style>
