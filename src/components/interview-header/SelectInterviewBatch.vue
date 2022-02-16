<template>
  <div id="selectInterviewBatch" style="width: 30rem">
    <div v-show="!newBatch">
      <div>
        <span v-if="numberExistingAppsOnBatch > 0" style="color: var(--gray)">{{
          $t("selectInterviewBatch.Intervjurunden har # kandidater fra før", [
            numberExistingAppsOnBatch,
          ])
        }}</span>
        <span v-else style="color: var(--gray)">{{
          $t("selectInterviewBatch.Intervjurunden har ingen kandidater fra før")
        }}</span>
      </div>
      <div class="select-batch">
        <span style="white-space: nowrap; font-size: 1rem"
          >{{ $t("selectInterviewBatch.Kandidaten(e) skal inn i") }}:</span
        >
        <Multiselect
          :options="batches"
          v-model="selectedBatch"
          ref="multiselect"
        />
      </div>
    </div>
    <div class="input">
      <input
        id="newBatch"
        type="checkbox"
        v-model="newBatch"
        :disabled="newBatchDisabled"
      />
      <label for="newBatch">{{
        $t("selectInterviewBatch.Opprett ny runde")
      }}</label>
    </div>
    <div v-show="newBatch" class="input" style="align-items: baseline">
      <label for="newBatchTitle" style="font-size: 1rem">{{
        $t("selectInterviewBatch.Gi intervjurunden et navn:")
      }}</label>
      <input
        size="30"
        type="text"
        id="newBatchTitle"
        v-model="newBatchTitle"
        @blur="emitBatchTitle"
      />
    </div>
  </div>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import { computed, ref } from "@vue/reactivity";
import { inject, watch } from "@vue/runtime-core";

export default {
  emits: ["selectedBatchChanged"],
  components: {
    Multiselect,
  },
  setup(props, ctx) {
    const multiselect = ref(null);
    const batches = ref([]);
    const newBatch = ref(false);
    const newBatchDisabled = ref(false);
    const newBatchTitle = ref(null);
    const applicationsOnBatch = inject("applicationsOnBatch") ?? ref([]);
    const selectedBatch = ref(null);
    const numberExistingAppsOnBatch = computed(
      () => applicationsOnBatch.value.length
    );

    const fetchBatches = () => {
      fetch(`${process.env.VUE_APP_URLS_APIBASE}job/${props.jobId}/interviewbatch`, {
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          batches.length = 0;
          if (data.length === 0) {
            newBatch.value = true;
            newBatchDisabled.value = true;
          } else {
            data.forEach((el) =>
              batches.value.push({
                value: el.id,
                label: el.title,
                numberCanChooseSlot: el.canChooseInterviewSlot,
              })
            );
            selectedBatch.value = batches.value[data.length - 1].value;
          }
        });
    };

    if (props.jobId != undefined) fetchBatches();
    else console.warn("could not read jobid props");

    watch(selectedBatch, (val) => {
      let batch = batches.value.find((b) => b.value === val);
      if (!batch) newBatch.value = true;
      else
        ctx.emit("selectedBatchChanged", {
          id: batch.value,
          title: batch.label,
          canChooseInterviewSlot: batch.numberCanChooseSlot,
        });
    });

    watch(newBatch, (val) => {
      if (val) {
        multiselect.value.clear();
        newBatchTitle.value = `Intervjurunde ${batches.value.length + 1}`;
        emitBatchTitle();
      }
    });

    const emitBatchTitle = () =>
      ctx.emit("selectedBatchChanged", {
        id: null,
        title: newBatchTitle.value,
      });

    return {
      batches,
      newBatch,
      multiselect,
      newBatchDisabled,
      newBatchTitle,
      emitBatchTitle,
      selectedBatch,
      numberExistingAppsOnBatch,
    };
  },
  props: {
    jobId: Number
  }
};
</script>
<style scoped>
.input {
  display: flex;
  gap: 0.5rem;
}
.select-batch {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 0.5rem 0rem;
}
</style>
<i18n src="../../localizations/interviewHeader.json"></i18n>
