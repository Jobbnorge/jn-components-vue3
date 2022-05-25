<template>
  <div class="interview-more">
    <div class="input-container">
      <span>{{ $t("dateLocationInput.tidspunkt") }}</span>
      <JnDateTimepicker
        :pickPeriod="false"
        :allowPastDates="true"
        type="dateTime"
        :minutesInterval="5"
        :preselectedDate="preSelectedDetails?.startDate ? preSelectedDetails.startDate : undefined"
        @selectedDateChanged="selectedDateChanged($event)"
      />
    </div>
    <div class="input-container">
      <SelectDuration
        :interval="5"
        :maxHours="5"
        :id="`duration--${candidateId}`"
        :defaultValue="getDuration()"
        @durationSelected="selectedDurationChanged($event)"
      />
    </div>
    <div class="input-container">
      <span>{{ $t("dateLocationInput.sted") }}</span>
      <input style="width: 100%"  v-model="selectedValues.details" />
    </div>
  </div>
</template>

<script>
import JnDateTimepicker from "../ui-components//JnDateTimePicker/JnDateTimepicker.vue";
import SelectDuration from "./SelectDuration.vue";
import dayjs from "dayjs";
import { reactive } from "vue";
import { watch } from "@vue/runtime-core";
export default {
  setup(props, ctx) {
    const getDuration = () => {
            if (props.preSelectedDetails?.endDate) {
                let diffMinutes = dayjs(props.preSelectedDetails.endDate).diff(dayjs(props.preSelectedDetails.startDate), 'minute');
                let diffHours = dayjs(props.preSelectedDetails.endDate).diff(dayjs(props.preSelectedDetails.startDate), 'hour');

                if (diffMinutes > 59) {
                    let minutes = diffMinutes - (diffHours * 60);
                    return minutes < 10 
                    ? diffHours.toString() + ":0" + minutes.toString() 
                    : diffHours.toString() + ":" + minutes.toString();
                } else if (diffMinutes < 10) {
                    return "0:0" + diffMinutes.toString();
                } else {
                    return "0:" + diffMinutes.toString();
                }
            }
            return "0:00";
        };

    const selectedValues = props.preSelectedDetails ? reactive({
          "date": props.preSelectedDetails.startDate,
          "details": props.preSelectedDetails.details,
          "duration": getDuration()
        }) : reactive({
            "date": '',
            "details": '',
            "duration": ''
        });

    const update = () =>
      ctx.emit("inputChanged", {
                candidateid: props.candidateId,
                ...selectedValues
            });

    const selectedDateChanged = (_date) => {
      selectedValues.date = _date;
    };
    const selectedDurationChanged = (updatedValue) => {
      selectedValues.duration = updatedValue.duration;
    };

    watch(selectedValues, () => {
            update();
        })

    return {
      selectedDateChanged,
      selectedDurationChanged,
      update,
      getDuration,
      selectedValues
    };
  },
  emits: ["inputChanged"],
  components: { JnDateTimepicker, SelectDuration },
  props: { candidateId: Number, preSelectedDetails: Object },
};
</script>

<style scoped>
.interview-more {
  display: grid;
  grid-template-columns: 3fr minmax(300px, 1fr);
  row-gap: 1rem;
  padding: 1rem;
}
.multiselect {
  width: 100%;
}
.input-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.input-container > input {
  padding: 0.5rem;
  height: 1.5rem;
  box-sizing: content-box;
}
</style>
<i18n src="../localizations/dateLocationInput.json"></i18n>
