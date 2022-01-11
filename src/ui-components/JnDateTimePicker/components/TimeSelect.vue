<template>
  <div class="time-selector">
    <div style="display: flex; justify-content: space-between">
      <div class="time-list-wrapper">
        <label>{{ $t("datepicker.hours") }}</label>
        <ol class="time-list">
          <HourItem
            v-for="hour in hours"
            :key="hour"
            :hour="hour"
            :isSelected="hourIsSelected(hour)"
            @hourSelected="setNewHour"
          >
          </HourItem>
        </ol>
      </div>
      <div class="time-list-wrapper">
        <label>{{ $t("datepicker.minutes") }}</label>
        <ol class="time-list">
          <MinuteItem
            v-for="minute in minutes"
            :key="minute"
            :minute="minute"
            :isSelected="minuteIsSelected(minute)"
            @minuteSelected="setNewMinute"
          >
          </MinuteItem>
        </ol>
      </div>
    </div>
    <div style="margin-top: 1rem" v-if="isTimePickerOnly">
      <JnButton colorTheme="blue" @JnButton-clicked="clickFinish">{{
        $t("datepicker.done")
      }}</JnButton>
    </div>
  </div>
</template>

<script>
import HourItem from "./HourItem.vue";
import MinuteItem from "./MinuteItem.vue";
import JnButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnButton.vue";

export default {
  components: {
    HourItem,
    MinuteItem,
    JnButton,
  },
  props: {
    minutesInterval: {
      type: Number,
      required: true,
    },
    isTimePickerOnly: {
      type: Boolean,
      required: true,
    },
    preSelectedTime: {
      type: Object,
      default: () => {
        return {
          hour: 0,
          minute: 0,
        };
      },
    },
  },
  emits: ["selectedHour", "selectedMinute", "closePicker"],
  data() {
    return {
      hours: [],
      minutes: [],
      selectedHour: null,
      selectedMinute: null,
    };
  },
  computed: {},
  created() {
    for (var i = 0; i < 24; i++) {
      this.hours.push(i);
    }
    for (var j = 0; j < 60; j += this.minutesInterval) {
      this.minutes.push(j);
    }
    this.selectedHour = this.preSelectedTime.hour;
    this.selectedMinute = this.preSelectedTime.minute;
  },
  methods: {
    setNewHour(hour) {
      this.selectedHour = hour;
      this.$emit("selectedHour", hour);
    },
    setNewMinute(minute) {
      this.selectedMinute = minute;
      this.$emit("selectedMinute", minute);
    },
    hourIsSelected(hour) {
      return hour == this.selectedHour;
    },
    minuteIsSelected(minute) {
      return minute == this.selectedMinute;
    },
    clickFinish() {
      this.$emit("closePicker");
    },
  },
};
</script>
<i18n src="..\..\..\localizations/datepicker.json"></i18n>

<style scoped>
.time-selector {
  width: 150px;
  border: 1px solid #f6f5f6;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.time-list {
  height: 240px;
  overflow-y: scroll;
  text-align: center;
  margin-top: 1rem;
}
.time-list-wrapper {
  margin: 0.5rem 0rem;
}
label {
  padding: 0.4rem 0rem;
}
.time-list li {
  width: 48px;
  margin: 0.2rem;
}
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
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
ol,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
