<template>
  <div
    v-for="(value, key) in generatedSlots"
    :key="key"
    style="margin: 2rem 0rem"
  >
    <h2 style="font-size: 1rem">
      {{ firstCharToUpperCase(dayjs(key).format("dddd DD.MM.YYYY")) }}
      <span
        v-if="
          numberSelectedSlotsPerDate.has(key) &&
          numberSelectedSlotsPerDate.get(key) > 0
        "
        >: {{ numberSelectedSlotsPerDate.get(key) }} valgt</span
      >
    </h2>
    <div class="slot-container">
      <TimeSlot
        v-for="date in value"
        :key="date.startDate"
        :startTime="dayjs(date.startDate).format('HH:mm')"
        :isSelectable="true"
        @updateTimeSlotSelected="($event) => timeSlotSelected($event, date)"
        :ref="setTimeSlotsRef"
      >
      </TimeSlot>
    </div>
  </div>
</template>

<script>
import { toRefs, watch, ref, onBeforeUpdate } from "vue";
import TimeSlot from "@jobbnorge/jn-components/src/ui_components/buttons/TimeSlot.vue";
import dayjs from "dayjs";
import { inject } from "vue";
require("dayjs/locale/nb");
dayjs.locale("nb");
export default {
  emits: ["slotAdded", "slotRemoved"],
  components: {
    TimeSlot,
  },
  setup(props, ctx) {
    const { slotDateSettings, slotTimeSettings } = toRefs(props);
    var params = {};
    const generatedSlots = ref({});
    const jobId = inject("jobId");

    const numberSelectedSlotsPerDate = ref(new Map());

    const timeSlotSelected = (e, date) => {
      var key = `${dayjs(date.startDate).format("YYYY-MM-DD")}T00:00:00`;
      if (e.selected) {
        ctx.emit("slotAdded", date);
        if (numberSelectedSlotsPerDate.value.has(key)) {
          numberSelectedSlotsPerDate.value.set(
            key,
            numberSelectedSlotsPerDate.value.get(key) + 1
          );
        } else {
          numberSelectedSlotsPerDate.value.set(key, 1);
        }
      } else if (!e.selected) {
        ctx.emit("slotRemoved", date);
        numberSelectedSlotsPerDate.value.set(
          key,
          numberSelectedSlotsPerDate.value.get(key) - 1
        );
      }
    };

    var timeSlots = [];
    const setTimeSlotsRef = (ts) => ts && timeSlots.push(ts);
    onBeforeUpdate(() => (timeSlots = []));

    watch(
      () => [slotTimeSettings.value, slotDateSettings.value],
      (values, prevValues) => {
        var [_timeSettings, _dateSettings] = values;
        var [, _prevDateSettings] = prevValues;

        if (_dateSettings.length <= 0) {
          generatedSlots.value = {};
          return;
        }

        timeSlots.forEach((ts) => ts.deselect());
        numberSelectedSlotsPerDate.value.clear();

        if (Object.keys(_timeSettings).length > 0) {
          params["timePerSlot"] = _timeSettings.timePerSlot;
          params["timePerBreak"] = _timeSettings.timePerBreak;
          params["dayStartsAt"] = _timeSettings.dayStartsAt;
          params["dayEndsAt"] = _timeSettings.dayEndsAt;
        }

        if (_prevDateSettings.length > 0)
          // remove previous dates entries
          Object.keys(params).forEach((k) => {
            if (k.startsWith("dates[")) delete params[k];
          });

        for (let i = 0; i < _dateSettings.length; i++) {
          params[`dates[${i}]`] = _dateSettings[i].format(
            "YYYY-MM-DDTHH:mm:ss"
          );
        }

        var str = Object.entries(params).map((el) => el.join("="));
        fetch(
          `${process.env.VUE_APP_URLS_APIBASE}job/${
            jobId.value
          }/interview/slot?${str.join("&")}`,
          {
            credentials: "include",
          }
        )
          .then((res) => res.json())
          .then((data) => (generatedSlots.value = data));
      },
      { deep: true }
    );

    const firstCharToUpperCase = (str) =>
      str.charAt(0).toUpperCase() + str.slice(1);

    return {
      generatedSlots,
      dayjs,
      timeSlotSelected,
      setTimeSlotsRef,
      firstCharToUpperCase,
      numberSelectedSlotsPerDate,
    };
  },
  props: {
    slotTimeSettings: Object,
    slotDateSettings: Array,
  },
};
</script>
<style scoped>
.slot-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--lightGray);
  border-radius: 3px;
  width: fit-content;
}
</style>
