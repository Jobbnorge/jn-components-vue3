<template>
  <h3>{{ $t("common.status", [GetApprovalStatus()]) }}</h3>
  <div
    v-if="readyToSend"
    style="display: flex; margin-top: 5rem; justify-content: center"
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
      "
    >
      <ReadyToSend />
      <p>
        {{ $t("pickApproverEmploymentDocument.userIsExcempted.body") }}
      </p>
    </div>
  </div>
  <FurtherAssessment :ShowTwoContainers="true" v-else>
    <template v-slot:content>
      <ModalListItem>
        <template v-slot:body>
          <div>
            <PickApprover
              v-if="isChangingApprover"
              @UpdateApprover="UpdateApprover"
              @CancelPickApprover="isChangingApprover = false"
              :approval="approval"
            ></PickApprover>
            <ApprovalStatus
              v-else
              :approval="approval"
              :hasApprover="HasApprover"
              :isChangingApprover="isChangingApprover"
              :userIsExemptedApproval="userIsExemptedApproval"
              @ChangeApprover="isChangingApprover = true"
            />
          </div>
        </template>
      </ModalListItem>
    </template>
    <template v-slot:image>
      <transition name="component-fade" mode="out-in">
        <component :is="currentImage"></component>
      </transition>
    </template>
  </FurtherAssessment>
  <div v-if="approval?.comments && approval.loggedInUserIsEditor">
    <h3>{{ $t("common.Kommentarer") }}</h3>
    <Comments
      :comments="approval.comments"
      :approvalId="approval.id"
      @UpdateMessages="UpdateMessages"
    ></Comments>
  </div>
</template>
<script>
import FurtherAssessment from "../../jn_components/FurtherAssessment.vue";
import ModalListItem from "../../jn_components/ModalListItem.vue";
import PickApprover from "./PickApprover.vue";
import Comments from "./ApprovalComments.vue";
import SelectApprover from "./ApprovalImages/SelectApprover.vue";
import PendingApprover from "./ApprovalImages/PendingApproval.vue";
import ApprovalStatus from "./ApprovalStatus.vue";
import ReadyToSend from "./ApprovalImages/ReadyToSend.vue";
import ApprovedDocument from "./ApprovalImages/ApprovedDocument.vue";

import { approvalService } from "../../services/approval.service";

export default {
  name: "Approval",
  components: {
    FurtherAssessment,
    ModalListItem,
    PickApprover,
    Comments,
    SelectApprover,
    PendingApprover,
    ApprovalStatus,
    ReadyToSend,
    ApprovedDocument,
  },
  computed: {
    currentImage() {
      return this.getImage();
    },
    HasApprover() {
      return this.approval?.approver;
    },
    readyToSend() {
      if (!this.approval) {
        return this.userIsExemptedApproval;
      } else {
        return this.isUploaded;
      }
    },
  },
  props: {
    approvalId: Number,
    isUploaded: Boolean,
    userIsExemptedApproval: Boolean,
  },
  created() {},
  data() {
    return {
      approval: {},
      isChangingApprover: false,
    };
  },
  watch: {
    approvalId(val) {
      this.getApproval(val);
    },
  },
  methods: {
    getImage() {
      if (this.approval && this.approval.status === "Complete")
        return ApprovedDocument;
      if (!this.approval) return SelectApprover;
      return PendingApprover;
    },
    GetApprovalStatus() {
      if (this.approval) {
        if (this.approval.status === "Complete") {
          return this.$t("pickApproverEmploymentDocument.status.isApproved");
        } else {
          return this.$t("DocumentList.underApproval");
        }
      } else if (this.isUploaded || this.userIsExemptedApproval) {
        return this.$t("DocumentList.approval.trenger-ikke-godkjenning");
      } else {
        return this.$t("DocumentList.approval.noApprover");
      }
    },
    UpdateApprover(data) {
      this.approval = data;
      this.isChangingApprover = false;
    },
    getApproval() {
      var vm = this;
      console.log(this.approvalId);
      approvalService.GetApproval(this.approvalId).then(function (response) {
        vm.approval = response.data;
      });
    },
    UpdateMessages() {
      var vm = this;
      approvalService
        .GetApprovalComments(this.approval.id)
        .then(function (response) {
          if (response.data) vm.approval.comments = response.data;
        });
    },
  },
  mounted() {
  },
};
</script>
