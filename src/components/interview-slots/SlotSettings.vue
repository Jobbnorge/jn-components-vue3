<template>
  <div style="margin: 1rem 0rem">
    <h2 style="font-size: 1rem; color: var(--gray)">{{ $t("slotSettings.title") }}</h2>
    <div class="slot-settings">
      <InfoBox colorTheme="gray" class="settings-box">
        <template #box-content>
          <h1 style="font-size: 1rem; font-weight: bold">
            {{ $t("slotSettings.interviewSlots") }}
          </h1>
          <SelectDuration
            id="timePerSlot"
            :label="$t('slotSettings.timePerSlot')"
            :interval="15"
            :maxHours="5"
            :defaultValue="settings.timePerSlot"
            @durationSelected="setDuration"
          >
          </SelectDuration>
          <SelectDuration
            id="timePerBreak"
            :label="$t('slotSettings.timeBetweenSlots')"
            :interval="5"
            :maxHours="2"
            :defaultValue="settings.timePerBreak"
            @durationSelected="setDuration"
          >
          </SelectDuration>
        </template>
      </InfoBox>
      <InfoBox colorTheme="gray" class="settings-box">
        <template #box-content>
          <h1 style="font-size: 1rem; font-weight: bold">
            {{ $t("slotSettings.toFrom") }}
          </h1>
          <label for="create-slots-start">{{ $t("slotSettings.from") }}:</label>
          <MultiSelect
            mode="single"
            id="create-slots-start"
            :searchable="true"
            :canClear="false"
            :options="hourOptions"
            v-model="settings.dayStartsAt"
            style="margin-bottom: 1rem"
          >
          </MultiSelect>
          <label for="create-slots-stop">{{ $t("slotSettings.to") }}:</label>
          <MultiSelect
            mode="single"
            id="create-slots-stop"
            :searchable="true"
            :canClear="false"
            :options="hourOptions"
            v-model="settings.dayEndsAt"
          >
          </MultiSelect>
        </template>
      </InfoBox>
    </div>
  </div>
</template>
<script>
import MultiSelect from "@vueform/multiselect";
import InfoBox from "@jobbnorge/jn-components/src/ui_components/containers/InfoBox.vue";
import SelectDuration from "../SelectDuration.vue";

import dayjs from "dayjs";
require("dayjs/locale/nb");
dayjs.locale("nb");

export default {
  components: {
    InfoBox,
    MultiSelect,
    SelectDuration,
  },
  emits: ["slotSettingsUpdated"],
  data() {
    return {
      settings: {
        timePerSlot: "1:00",
        timePerBreak: "0:15",
        dayStartsAt: "08:00",
        dayEndsAt: "16:00",
      },
      hourOptions: [],
    };
  },
  created() {
    this.generateSlotTimes();
  },
  watch: {
    settings: {
      deep: true,
      handler: function (newVal) {
        this.updateSettings(newVal);
      },
    },
  },
  methods: {
    generateSlotTimes() {
      for (let t = 0; t <= 23; t++) {
        this.hourOptions.push({
          label: dayjs().hour(t).minute(0).format("HH:mm"),
          value: dayjs().hour(t).minute(0).format("HH:mm"),
        });
      }
    },
    updateSettings(val) {
      this.$emit("slotSettingsUpdated", val);
    },
    setDuration(e) {
      this.settings[e.id] = e.duration;
    },
  },
};
</script>
<style scoped>
.settings-box {
  width: 300px;
}
.slot-settings {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0rem;
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>
<i18n src="../../localizations/interviewSlots.json"></i18n>
