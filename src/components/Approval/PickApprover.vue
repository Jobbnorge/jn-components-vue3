<template>
  <div>
    <div class="pa-container">
      <div>
        <h4>{{ $t("approval.pick_approver.title") }}</h4>
        <MultiSelect
          id="approverselect"
          v-model="userID"
          :minChars="2"
          :delay="500"
          :searchable="true"
          :filterResults="false"
          :resolveOnLoad="false"
          valueProp="userID"
          label="name"
          :placeholder="selectPlaceholderText"
          :noOptionsText="noOptionsText"
          :noResultsText="noResultsText"
          @select="Select"
          @deselect="Deselect"
          @clear="Deselect"
          :options="
            async function (query) {
              return await FetchUsers(query);
            }
          "
        >
          <template v-slot:option="{ option }">
            <div>
              <p class="font-bold">{{ option.name }} ( {{ option.email }} )</p>
              <span class="text-muted">
                {{ option.positionTitle }} - {{ option.department }}
              </span>
            </div>
          </template>
        </MultiSelect>
        <div v-if="userID != null" style="margin-top: 0.5rem">
          <span style="color: #72616c">
            <span class="fas fa-info-circle text-blue"></span>
            {{ InfoUser }}
          </span>
        </div>

        <div
          style="
            display: flex;
            margin-top: 1em;
            justify-content: end;
            gap: 1rem;
          "
        >
          <JnButton @JnButton-clicked="ResetForm" colorTheme="gray" light>
            {{ $t("approval.pick_approver.cancel") }}
          </JnButton>
          <JnButton
            v-if="ShowButtons"
            @JnButton-clicked="Submit"
            colorTheme="blue"
          >
            {{ $t("approval.pick_approver.request_approval") }}
          </JnButton>
        </div>
      </div>
    </div>
    <JnDialogComponent
      v-bind="saveModal"
      v-if="showSaveModal"
      @resolveModal="resolveSaveModal"
      @rejectModal="rejectSaveModal"
    >
      <template #header>
        <h1>{{ $t("approval.pick_approver.prompt.save_changes") }}</h1>
      </template>
      <template #body>
        <div>
          <p>
            {{ $t("approval.pick_approver.prompt.unsaved_changes") }}
          </p>
        </div>
      </template>
    </JnDialogComponent>
  </div>
</template>

<script>
import MultiSelect from "@vueform/multiselect";
import { approvalService } from "../../services/approval.service.js";
import JnButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnButton.vue";
import JnDialogComponent from "@jobbnorge/jn-components/src/ui_components/dialog/JnDialogComponent.vue";
export default {
  components: { MultiSelect, JnButton, JnDialogComponent },
  props: {
    employmentDocumentId: Number,
    approval: Object,
    approvalTypeId: Number,
    hasUnsavedChanges: Boolean,
  },
  computed: {
    InfoUser() {
      if (this.newApprover.positionTitle && this.newApprover.department) {
        return this.$t("approval.pick_approver.info_user", [
          this.newApprover.name,
          this.newApprover.positionTitle,
          this.newApprover.department,
        ]);
      } else if (
        !this.newApprover.positionTitle &&
        this.newApprover.department
      ) {
        return this.$t("approval.pick_approver.info_department", [
          this.newApprover.name,
          this.newApprover.department,
        ]);
      } else return "";
    },
    ShowButtons() {
      return this.userID != null;
    },
  },
  emits: ["UpdateApprover", "CancelPickApprover"],
  data() {
    return {
      userID: null,
      selectPlaceholderText: this.$t("approval.pick_approver.search"),
      noOptionsText: this.$t("approval.pick_approver.no_options_text"),
      noResultsText: this.$t("approval.pick_approver.no_results"),
      approvers: [],
      newApprover: {},
      showSaveModal: false,
      saveModal: {
        modalId: "saveDocumentApprover",
        rejectButton: {
          visible: true,
          text: this.$t("approval.pick_approver.cancel"),
        },
        resolveButton: {
          visible: true,
          text: this.$t("approval.pick_approver.save"),
        },
        colorTheme: "none",
      },
    };
  },
  methods: {
    Select(val) {
      this.newApprover = this.approvers.filter((x) => x.userID == val)[0];
    },
    Deselect() {
      this.userID = null;
    },
    ResetForm() {
      this.selectingApprover = false;
      this.userID = null;
      this.$emit("CancelPickApprover");
    },
    async FetchUsers(query) {
      var vm = this;
      return await approvalService.FetchUsers(query).then(function (response) {
        vm.approvers = response.data;
        return response.data;
      });
    },
    Submit() {
      if (this.hasUnsavedChanges) {
        this.showSaveModal = true;
      } else {
        if (!this.approval?.id) this.CreateApproval();
        else this.UpdateApprover();
        this.showSaveModal = false;
      }
    },
    CreateApproval() {
      var data = {
        employmentDocumentId: this.employmentDocumentId,
        approverID: this.userID,
        approvalType: this.approvalTypeId,
        jobId: parseInt(
          new URLSearchParams(window.location.search).get("jobid")
        ),
      };
      var vm = this;
      if (!vm.isSubmiting) {
        this.isSubmiting = true;
        approvalService.CreateApproval(data).then((response) => {
          vm.$emit("UpdateApprover", response.data);
          vm.isSubmiting = false;
        });
      }
    },
    UpdateApprover() {
      var data = {
        documentID: this.documentID,
        approverID: this.userID,
        approvalID: this.approval.id,
      };
      var vm = this;
      if (!vm.isSubmiting) {
        this.isSubmiting = true;
        approvalService.UpdateApprover(data).then((response) => {
          vm.$emit("UpdateApprover", response.data);
          vm.isSubmiting = false;
        });
      }
    },
    resolveSaveModal() {
      this.showSaveModal = false;
      this.emitter.emit("saveDocument");
      //emitte lagre dokument
    },
    rejectSaveModal() {
      this.showSaveModal = false;
    },
  },
};
</script>

<style scoped>
.pa-container {
  margin-right: 1rem;
}
</style>
