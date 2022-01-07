<template>
  <label :for="`selectDuration-${id}`">{{
    label ? label : $t("selectDuration.duration")
  }}</label>
  <MultiSelect
    mode="single"
    :id="`selectDuration-${id}`"
    :searchable="true"
    :options="options"
    :canClear="isClearable"
    v-model="selectedDuration"
    @select="handleSelect"
    style="margin-bottom: 1rem"
  ></MultiSelect>
</template>
<script>
import MultiSelect from "@vueform/multiselect";
export default {
  components: {
    MultiSelect,
  },
  emits: ["durationSelected"],
  props: {
    id: String,
    maxHours: Number,
    interval: {
      validator(value) {
        // The value must match one of these numbers
        return [5, 10, 15, 30, 60].includes(value);
      },
    },
    label: String,
    defaultValue: String,
  },
  data() {
    return {
      selectedDuration: "00:00",
      isClearable: true,
      options: [],
    };
  },
  created() {
    if (this.defaultValue) {
      this.isClearable = false;
      this.selectedDuration = this.defaultValue;
    }
    this.options = this.durationOptions();
  },
  methods: {
    handleSelect() {
      this.$emit("durationSelected", {
        id: this.id,
        duration: this.selectedDuration,
      });
    },
    durationOptions() {
      let durationArr = [];
      for (let hour = 0; hour <= this.maxHours; hour++) {
        //skip adding minutes to the time if interval is set to an hour and we've reached maxHours
        if (this.interval === 60 || hour == this.maxHours) {
          if (hour === 0) {
            durationArr.push({
              label: this.$t("selectDuration.none"),
              value: "00:00",
            });
          } else {
            durationArr.push({
              label:
                hour > 1
                  ? this.$t("selectDuration.hours", [hour])
                  : this.$t("selectDuration.hour", [hour]),
              value: `${hour}:00`,
            });
          }
        } else {
          for (let minute = 0; minute < 60; minute += this.interval) {
            if (hour === 0) {
              durationArr.push(this.getMinutesForZeroHours(minute));
            } else {
              durationArr.push(this.getMinutes(hour, minute));
            }
          }
        }
      }
      return durationArr;
    },
    getMinutesForZeroHours(minute) {
      if (minute === 0) {
        return {
          label: this.$t("selectDuration.none"),
          value: "00:00",
        };
      } else if (minute < 10) {
        return {
          label:
            minute > 1
              ? this.$t("selectDuration.minutes", [minute])
              : this.$t("selectDuration.minute", [minute]),
          value: `0:0${minute}`,
        };
      } else {
        return {
          label: this.$t("selectDuration.minutes", [minute]),
          value: `0:${minute}`,
        };
      }
    },
    getMinutes(hour, minute) {
      if (minute === 0) {
        return {
          label:
            hour > 1
              ? this.$t("selectDuration.hours", [hour])
              : this.$t("selectDuration.hour", [hour]),
          value: `${hour}:00`,
        };
      } else if (minute < 10) {
        return {
          label: this.$t("selectDuration.hourAndMinutes", [hour, minute]),
          value: `${hour}:0${minute}`,
        };
      } else {
        return {
          label: this.$t("selectDuration.hourAndMinutes", [hour, minute]),
          value: `${hour}:${minute}`,
        };
      }
    },
  },
};
</script>
<i18n src="../localizations/interviewSlots.json"></i18n>
