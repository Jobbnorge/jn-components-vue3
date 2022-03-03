<template>
  <div v-if="totalNumberOfSlots > 0">
    <div v-if="showExistingSlotsSummary">
      <h1 class="title">
        {{
          showExistingSlots
            ? $t("AvailableSlots.heading")
            : $t("AvailableSlots.title")
        }}
      </h1>
      <p style="color: var(--gray)">
        {{
          showExistingSlots
            ? $t("AvailableSlots.subtitle")
            : numberOfDates !== 0
            ? $t("AvailableSlots.summaryExisting", [
                totalNumberOfSlots,
                numberOfDates,
              ])
            : $t("AvailableSlots.none")
        }}
      </p>
    </div>
    <div v-else>
      <h1 class="title">
        {{ $t("AvailableSlots.heading") }}
      </h1>
      <p>{{ $t("AvailableSlots.subtitle") }}</p>
    </div>
    <transition name="fade">
      <div v-if="showExistingSlots">
        <InfoBox
          v-for="(value, key) in slots"
          :key="key"
          colorTheme="gray"
          class="slot-box"
        >
          <template #box-content>
            <div>
              <h2 style="font-size: 1rem">{{ displayDate(key) }}</h2>
              <div class="slot-container">
                <TimeSlot
                  v-for="date in value"
                  :key="date.startDate"
                  :startTime="dayjs(date.startDate).format('HH:mm')"
                  :isSelectable="false"
                  :isOccupied="date.isOccupied"
                >
                </TimeSlot>
              </div>
              <div>
                {{ $t("AvailableSlots.place") }}:
                {{
                  value[0].location
                    ? value[0].location
                    : $t("AvailableSlots.notRegistered")
                }}
              </div>
            </div>
          </template>
        </InfoBox>
      </div>
    </transition>
    <JnMiniButton
      v-if="showExistingSlotsSummary"
      @miniButton-clicked="toggleExistingSlots"
      ><span style="margin-right: 0.3rem" class="fal fa-arrow-down"></span
      >{{
        showExistingSlots
          ? $t("AvailableSlots.hideExisting")
          : $t("AvailableSlots.showExisting")
      }}</JnMiniButton
    >
  </div>
  <!-- NO SLOTS -->
  <div v-else>
    <slot name="emptyState">
      <h1 class="title">
        {{
          showExistingSlotsSummary
            ? $t("AvailableSlots.noSummaryTitle")
            : $t("AvailableSlots.noExistingSlotsHeading")
        }}
      </h1>
      <p>
        {{
          showExistingSlotsSummary
            ? $t("AvailableSlots.summaryNoExisting")
            : $t("AvailableSlots.noExistingSubtitle")
        }}
      </p>
    </slot>
  </div>
</template>
<script>
import TimeSlot from "@jobbnorge/jn-components/src/ui_components/buttons/TimeSlot.vue";
import InfoBox from "@jobbnorge/jn-components/src/ui_components/containers/InfoBox.vue";
import JnMiniButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnMiniButton.vue";
import { toRefs, ref } from "@vue/runtime-core";
import dayjs from "dayjs";

export default {
  emits: ["showExistingSlots"],
  setup(props, ctx) {
    const { showExistingSlotsSummary } = toRefs(props);
    const showExistingSlots = ref(!showExistingSlotsSummary.value);

    const toggleExistingSlots = () => {
      showExistingSlots.value = !showExistingSlots.value;
      ctx.emit("showExistingSlots", showExistingSlots.value);
    };

    const displayDate = (day) => {
      let dateString = dayjs(day).format("dddd, DD.MM.YYYY");
      return dateString.charAt(0).toUpperCase() + dateString.slice(1);
    };

    return {
      dayjs,
      showExistingSlots,
      toggleExistingSlots,
      displayDate,
    };
  },
  components: {
    TimeSlot,
    JnMiniButton,
    InfoBox,
  },
  props: {
    slots: Object,
    totalNumberOfSlots: Number,
    numberOfDates: Number,
    showExistingSlotsSummary: Boolean,
  },
};
</script>
<style scoped>
.title {
  font-size: 1.2rem;
  color: var(--gray);
}
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
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.4s, opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  transform: translate3d(0, -10px, 0);
  opacity: 0;
}
.slot-box {
  margin-bottom: 1rem;
}
</style>
<i18n src="../../localizations/interviewSlots.json"></i18n>
