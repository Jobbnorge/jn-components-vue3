<template>
  <div>
    <span>Ett eller flere tidspunkt er i konflikt med tidligere avtaler:</span>
    <ul>
      <li v-for="(date, index) in conflictingDates" :key="index">
        {{
          $t("conflictingDates.error", [
            dayjs(date.startDate).format("HH:mm[, ]DD.MM.YYYY"),
            datesAsString(date.conflictingDates),
          ])
        }}
      </li>
    </ul>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  props: { conflictingDates: Array },
  setup() {
    const datesAsString = (data) =>
      data
        .map(
          (d) =>
            `${dayjs(d.startDate).format("HH:mm")} - ${dayjs(d.endDate).format(
              "HH:mm"
            )}`
        )
        .join(", ");

    return { dayjs, datesAsString };
  },
};
</script>
<i18n src="../../localizations/interviewSlots.json"></i18n>
