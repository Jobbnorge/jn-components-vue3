<template>
  <InfoBox
    colorTheme="gray"
    class="slot-box"
    v-for="(value, key) in generatedSlots"
    :key="key"
  >
    <template #box-content>
      <div>
        <h2 style="font-size: 1rem">
          {{ firstCharToUpperCase(dayjs(key).format("dddd DD.MM.YYYY")) }}
          <span
            v-if="
              numberSelectedSlotsPerDate.has(key) &&
              numberSelectedSlotsPerDate.get(key) > 0
            "
            >:
            {{
              $t("selectSlots.numberSelected", [
                numberSelectedSlotsPerDate.get(key),
              ])
            }}</span
          >
          <span v-else> ({{ $t("selectSlots.empty") }}) </span>
        </h2>
        <div>
          <div class="slot-container">
            <TimeSlot
              v-for="date in value"
              :key="date.startDate"
              :startTime="dayjs(date.startDate).format('HH:mm')"
              :isSelectable="true"
              @updateTimeSlotSelected="
                ($event) => timeSlotSelected($event, date)
              "
              :ref="setTimeSlotsRef"
            >
            </TimeSlot>
          </div>
          <div>
            <label
              :for="`slot-location-${dayjs(key).format('DD-MM-YYYY')}`"
              style="margin-right: 0.5rem"
              >Sted:
            </label>
            <input
              :id="`slot-location-${dayjs(key).format('DD-MM-YYYY')}`"
              type="text"
              size="40"
              v-model="slotDateLocation[key]"
              @blur="slotDateLocationChanged(key)"
            />
          </div>
        </div>
      </div>
    </template>
  </InfoBox>
</template>

<script>
import { toRefs, watch, ref, onBeforeUpdate } from "vue";
import TimeSlot from "@jobbnorge/jn-components/src/ui_components/buttons/TimeSlot.vue";
import InfoBox from "@jobbnorge/jn-components/src/ui_components/containers/InfoBox.vue";
import dayjs from "dayjs";
import { inject } from "vue";
require("dayjs/locale/nb");
dayjs.locale("nb");
export default {
  emits: ["slotAdded", "slotRemoved", "slotDateLocationChanged", "clearSelectedSlots"],
  components: {
    TimeSlot,
    InfoBox,
  },
  setup(props, ctx) {
    const { slotDateSettings, slotTimeSettings } = toRefs(props);
    var params = {};
    const generatedSlots = ref({});
    const jobId = inject("jobId");
    const slotDateLocation = ref({});

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
        ctx.emit('clearSelectedSlots')
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

        var paramsArr = Object.entries(params).map((el) => el.join("="));
        fetch(
          `${process.env.VUE_APP_URLS_APIBASE}job/${
            jobId.value
          }/interview/slot?${paramsArr.join("&")}`,
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

    const slotDateLocationChanged = (date) => {
      ctx.emit("slotDateLocationChanged", {
        date: date,
        location: slotDateLocation.value[date],
      });
    };

    return {
      generatedSlots,
      dayjs,
      timeSlotSelected,
      setTimeSlotsRef,
      firstCharToUpperCase,
      numberSelectedSlotsPerDate,
      slotDateLocation,
      slotDateLocationChanged,
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
  width: fit-content;
}
.slot-box {
  margin-bottom: 1rem;
}
</style>
<i18n src="../../localizations/interviewSlots.json"></i18n>
