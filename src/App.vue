<template>
  <JnDateTimepicker
    :pickPeriod="false"
    :allowPastDates="false"
    type="dateTime"
    :minutesInterval="5"
  />
</template>

<script>
import JnDateTimepicker from "./components/JnDateTimePicker/JnDateTimepicker.vue";

export default {
  name: "App",
  components: {
    JnDateTimepicker,
  },
};
</script>

<style></style>
