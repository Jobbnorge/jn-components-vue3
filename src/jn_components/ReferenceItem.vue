<template>
  <div style="margin-bottom: 1rem">
    <div
      style="display: grid; grid-template-columns: auto auto; gap: 1rem; margin: 1rem 0;"
    >
      <div style="margin-top: 1rem;">
        <p class="font-medium" style="margin-bottom: 0px">
          {{ reference.name }}
        </p>
        <p>
          {{ getWorkplace }}
        </p>
        <p v-if="reference.phoneNumber !== undefined">
          {{ `${$t("common.Telefon")}: ${reference.phoneNumber}` }}
        </p>
        <p v-if="reference.email !== undefined">
          {{ `${$t("common.Mail")}: ${reference.email}` }}
        </p>
      </div>
      <div style="justify-self: end; margin-right: 16px">
        <label for="reference-check-date">{{ $t("common.Dato") }}</label>
        <div style="display: flex">
          <Datepicker
            v-model="date"
            :placeholder="date ? `${date}` : $t('common.Dato')"
            inputFormat="dd.MM.yyyy"
            id="reference-check-date"
            @update:modelValue="
              $emit('UpdateReferenceDate', {
                id: reference.id,
                date: date,
              })
            "
          >
          </Datepicker>
          <div class="far fa-calendar moveleft"></div>
        </div>
      </div>
    </div>
    <div>
      <label :for="`notes-` + reference.id" style="display: block">{{
        $t("common.Notat")
      }}</label>
      <textarea
        :id="`notes-` + reference.id"
        @blur="
          $emit('UpdateReferenceNotes', {
            id: reference.id,
            notes: notes,
          })
        "
        v-model="notes"
      ></textarea>
    </div>
  </div>
</template>

<script>
import Datepicker from "vue3-datepicker";


export default {
  components: {
    Datepicker,
  },
  props: {
    reference: Object,
  },
  emits: ["UpdateReferenceNotes", "UpdateReferenceDate"],
  data() {
    return {
      date: null,
      notes: null,
    };
  },
	computed: {
		getWorkplace() {
			var string = ''
			this.reference.title ? string = `${this.reference.title}` : string = '';
			this.reference.place ? string += ` ${this.$t('common.Ved')} ${this.reference.place}` : string +=''

			return string; 
		}
	},
  created() {
    if (this.reference.executedOn !== undefined) {
      this.date = new Date(this.reference.executedOn);
    }
    if (this.reference.notes !== undefined) {
      this.notes = this.reference.notes;
    }
  },
};
</script>
<style scoped>
textarea {
  height: 80px;
  padding: 0.3em;
  background: #fff;
  width: 100%;
}
.moveleft {
  font-size: 20px;
  align-self: center;
  margin-left: -30px;
  pointer-events: none;
  z-index: 1;
}
p {
  margin: 0;
}
</style>
<style src="vue3-datepicker/dist/vue3-datepicker.css"></style>
