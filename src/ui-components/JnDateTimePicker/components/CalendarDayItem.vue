<template>
  <li
    :class="[
      isCurrentMonth ? '' : 'not-current',
      isToday ? 'is-today' : '',
      isSelected || isFirstDate || isSecondDate ? 'is-selected' : '',
      isCurrentPeriod ? 'period' : '',
      'jn-date-timepicker-day',
    ]"
    :tabindex="isFocused ? 0 : -1"
    :aria-label="getAriaLabel"
    :id="day.date"
    @click="selectDate"
    @keyup.enter="selectDate"
    @keyup.left="handleArrowKeys('left')"
    @keyup.up="handleArrowKeys('up')"
    @keyup.down="handleArrowKeys('down')"
    @keyup.right="handleArrowKeys('right')"
  >
    {{ label }}
  </li>
</template>
<script>
import dayjs from "dayjs";

export default {
  name: "Calendar-day-item",
  props: {
    day: {
      type: Object,
      required: true,
    },
    isCurrentMonth: {
      type: Boolean,
      default: false,
    },
    isToday: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    isFirstDate: {
      type: Boolean,
      default: false,
    },
    isSecondDate: {
      type: Boolean,
      default: false,
    },
    isCurrentPeriod: {
      type: Boolean,
      default: false,
    },
    isFocused: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    label() {
      return dayjs(this.day.date).format("D");
    },
    getAriaLabel() {
      return this.isToday ? "I dag" : dayjs(this.day.date).format("DD.MM.YYYY");
    },
  },
  methods: {
    selectDate() {
      this.$emit("daySelected", dayjs(this.day.date));
    },
    handleArrowKeys(direction) {
      console.log(`${direction}-key is not supported yet`);
      /* switch (direction) {
        case "up":
          return this.$emit("setFocus", {
            newDate: dayjs(this.day.date).subtract(1, "week"),
            wasIncremented: false,
          });
        case "left":
          return this.$emit("setFocus", {
            newDate: dayjs(this.day.date).subtract(1, "day"),
            wasIncremented: false,
          });
        case "down":
          return this.$emit("setFocus", {
            newDate: dayjs(this.day.date).add(1, "week"),
            wasIncremented: true,
          });
        case "right":
          return this.$emit("setFocus", {
            newDate: dayjs(this.day.date).add(1, "day"),
            wasIncremented: true,
          });
      } */
    },
  },
};
</script>
<style scoped>
li {
  min-height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 3px;
  color: #44303c;
}
.is-selected,
li:hover {
  background: #0e6489;
  color: #fff;
}
.period {
  background: #e8f5fa;
}
.is-selected.period {
  background: #0e6489;
  color: #fff;
}
.is-today {
  color: #0e6489;
  font-weight: bold;
}
.is-selected.is-today {
  color: #fff;
}
.not-current,
.not-current:hover {
  background: #f6f5f6;
  color: #c5c5c5;
}
</style>
