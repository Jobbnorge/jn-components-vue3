<template>
  <div class="interview-more">
    <div class="input-container">
      <span>{{ $t("dateLocationInput.tidspunkt") }}</span>
      <JnDateTimepicker
        :pickPeriod="false"
        :allowPastDates="true"
        type="dateTime"
        :minutesInterval="5"
        @selectedDateChanged="selectedDateChanged($event)"
      />
    </div>
    <div class="input-container">
      <SelectDuration
        :interval="15"
        :maxHours="5"
        :id="`duration--${candidateId}`"
        :defaultValue="getDuration()"
        @durationSelected="selectedDurationChanged($event)"
      />
    </div>
    <div class="input-container">
      <span>{{ $t("dateLocationInput.sted") }}</span>
      <input style="width: 100%" @blur="update" v-model="comment" />
    </div>
  </div>
</template>

<script>
import JnDateTimepicker from "../ui-components//JnDateTimePicker/JnDateTimepicker.vue";
import SelectDuration from "./SelectDuration.vue";
import dayjs from "dayjs";
import { ref } from "vue";
export default {
  setup(props, ctx) {
    const duration = ref(0);
    const date = ref("");
    const comment = ref(props.preSelectedDetails.details);

    const update = () =>
      ctx.emit("inputChanged", {
        candidateid: props.candidateId,
        date: date.value,
        comment: comment.value,
        duration: duration.value,
      });

    const selectedDateChanged = (_date) => {
      date.value = _date;
      update();
    };
    const selectedDurationChanged = (updatedValue) => {
      duration.value = updatedValue.duration;
      update();
    };

    const getDuration = () => {
      if(props.preSelectedDetails.endDate){
        let diffMinutes = dayjs(props.preSelectedDetails.endDate).diff(dayjs(props.preSelectedDetails.startDate), 'minute');
        let diffHours = dayjs(props.preSelectedDetails.endDate).diff(dayjs(props.preSelectedDetails.startDate), 'hour');

        if(diffMinutes > 59){
          let minutes = diffMinutes - (diffHours*60);
          return diffHours.toString() + ":" + minutes.toString();
        }
        else if(diffMinutes < 10){
          return "0:0"+diffMinutes.toString();
        }
        else{
          return "0:"+diffMinutes.toString();
        }
      }
    }

    return {
      duration,
      selectedDateChanged,
      selectedDurationChanged,
      comment,
      update,
      getDuration,
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
