<template>
  <div style="margin: 1rem 0rem">
    <h2 style="font-size: 1rem; color: var(--gray)">Innstillinger</h2>
    <div class="slot-settings">
      <InfoBox colorTheme="gray" class="settings-box">
        <template #box-content>
          <h1 style="font-size: 1rem; font-weight: bold">
            {{ $t("slotSettings.interviewSlots") }}
          </h1>
          <label for="create-slots-length"
            >{{ $t("slotSettings.timePerSlot") }}:</label
          >
          <MultiSelect
            mode="single"
            id="create-slots-length"
            :searchable="true"
            :canClear="false"
            :options="slotDurations"
            v-model="settings.timePerSlot"
            style="margin-bottom: 1rem"
          >
          </MultiSelect>
          <label for="create-slots-break"
            >{{ $t("slotSettings.timeBetweenSlots") }}:</label
          >
          <MultiSelect
            mode="single"
            id="create-slots-break"
            :searchable="true"
            :canClear="false"
            :options="slotBreakTimes"
            v-model="settings.timePerBreak"
          >
          </MultiSelect>
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

import dayjs from "dayjs";
require("dayjs/locale/nb");
dayjs.locale("nb");

export default {
  components: {
    InfoBox,
    MultiSelect,
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
      slotDurations: [
        {
          label: this.$t("createSlots.15min"),
          value: "0:15",
        },
        {
          label: this.$t("createSlots.30min"),
          value: "0:30",
        },
        {
          label: this.$t("createSlots.45min"),
          value: "0:45",
        },
        {
          label: this.$t("createSlots.1h"),
          value: "1:00",
        },
        {
          label: this.$t("createSlots.1.5h"),
          value: "1:30",
        },
        {
          label: this.$t("createSlots.2h"),
          value: "2:00",
        },
      ],
      slotBreakTimes: [
        {
          label: this.$t("createSlots.noBreak"),
          value: "0:00",
        },
        {
          label: this.$t("createSlots.15min"),
          value: "0:15",
        },
        {
          label: this.$t("createSlots.30min"),
          value: "0:30",
        },
        {
          label: this.$t("createSlots.45min"),
          value: "0:45",
        },
        {
          label: this.$t("createSlots.1h"),
          value: "1:00",
        },
        {
          label: this.$t("createSlots.1.5h"),
          value: "1:30",
        },
      ],
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
    handleOption(option) {
      this.selectedTime = option;
    },
    updateSettings(val) {
      this.$emit("slotSettingsUpdated", val);
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
