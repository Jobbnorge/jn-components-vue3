<template>
  <div>
    <div class="calendar-header">
      <div>
        <JnButton @JnButton-clicked="getPreviousMonth">
          <span class="fal fa-chevron-left" />
        </JnButton>
        {{ monthNameYear }}
        <JnButton @JnButton-clicked="getNextMonth">
          <span class="fal fa-chevron-right" />
        </JnButton>
      </div>
      <button v-if="useTodayButton" type="button" class="today-btn" @click="selectToday">
        {{ $t("datepicker.today") }}
      </button>
    </div>
    <hr />
  </div>
</template>
<script>
import dayjs from "dayjs";
import JnButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnButton.vue";

export default {
  name: "Calendar-month-selector",
  components: {
    JnButton,
  },
  props: {
    selectedDate: Object,
    today: String,
    focusedDate: Object,
  },
  emits: ["selectToday", "monthSelected"],
  computed: {
    monthNameYear() {
      return this.selectedDate.format("MMMM, YYYY");
    },
    useTodayButton() {
      return false
    }
  },
  methods: {
    getPreviousMonth() {
      let newSelectedDate = dayjs(this.selectedDate).subtract(1, "month");
      this.$emit("monthSelected", newSelectedDate);
    },
    getNextMonth() {
      let newSelectedDate = dayjs(this.selectedDate).add(1, "month");
      this.$emit("monthSelected", newSelectedDate);
    },
    selectToday() {
      let newSelectedDate = dayjs(this.today);
      this.$emit("selectToday", newSelectedDate);
    },
  },
};
</script>
<i18n src="..\..\..\localizations/datepicker.json"></i18n>
<style scoped>
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.today-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  text-decoration: underline;
  border-radius: 3px;
}
.today-btn:hover {
  background: #e8f5fa;
}
hr {
  margin: 0.5rem 0 0.5rem 0;
  border: 1px solid #f6f5f6;
}
</style>
