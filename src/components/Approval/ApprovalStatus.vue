<template>
  <div>
    <div>
      <p style="font-size: 1rem; margin-bottom: 1rem">{{ getStatusText() }}</p>
      <div v-if="UserIsNotPartOfApproval">
        <p>
          <span style="font-weight: bold">{{
            `${$t("approval.status.approver")}: `
          }}</span
          >{{ GetApproverName }}
        </p>
        <p>
          <span style="font-weight: bold">{{
            `${$t("approval.status.case_worker")}: `
          }}</span
          >{{ GetEditorName }}
        </p>
      </div>
    </div>
    <div v-if="CanSetApprover">
      <JnButton
        colorTheme="blue"
        light
        @JnButton-clicked="$emit('ChangeApprover')"
      >
        <span class="fas fa-stamp"></span>
        {{ $t("approval.status.pick_approver") }}
      </JnButton>
    </div>
    <div v-if="CanChangeApprover">
      <p>
        {{
          $t("approval.status.must_be_approved_by", )
        }}
        <strong>{{ GetApproverName }}</strong>
        {{ $t("approval.status.before_it_can_be_sent") }}
      </p>
      <JnButton @JnButton-clicked="$emit('ChangeApprover')">
        <span class="fas fa-stamp"></span>
        {{ $t("approval.status.change_approver") }}
      </JnButton>
    </div>
  </div>
</template>

<script>
import JnButton from "@jobbnorge/jn-components/src/ui_components/buttons/JnButton.vue";

export default {
  emits: ["ChangeApprover"],
  components: { JnButton },
  computed: {
    GetEditorName() {
      return this.approval.editor.name;
    },
    GetApproverName() {
      return this.approval.approver.name;
    },
    UserIsNotPartOfApproval() {
      return (
        this.hasApprover &&
        !this.isChangingApprover &&
        this.approval.status !== "Complete" &&
        !this.approval.loggedInUserIsEditor
      );
    },
    CanChangeApprover() {
      return (
        !this.isChangingApprover &&
        this.hasApprover &&
        this.approval.status !== "Complete" &&
        this.approval.loggedInUserIsEditor
      );
    },
    CanSetApprover() {
      return !this.isChangingApprover && !this.hasApprover;
    },
  },
  props: {
    approval: Object,
    isChangingApprover: Boolean,
    hasApprover: Boolean,
    userIsExemptedApproval: Boolean,
  },
  methods: {
    getStatusText() {
      if (this.CanSetApprover) {
        return this.$t("approval.status.can_set_approver");
      }
      if (this.UserIsNotPartOfApproval) {
        return this.$t("approval.status.user_not_part_of_approval");
      }
      if (this.approval.status === "Complete") {
        return this.$t("approval.status.complete");
      }
    },
  },
};
</script>

<style></style>
