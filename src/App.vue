<template>
  <div>
    <a
      style="margin: 0 1em"
      v-for="(component, index) in components"
      :key="index"
      :href="'#' + component"
      @click="currentApp = component"
    >
      {{ component }}
    </a>
  </div>
  <interviewApp v-if="isCurrentApp('interview')"></interviewApp>
  <approvalApp v-if="isCurrentApp('approval')"></approvalApp>
</template>

<script>
import InterviewApp from "./InterviewApp.vue";
import ApprovalApp from "./ApprovalApp.vue";

export default {
  name: "App",
  components: {
    InterviewApp,
    ApprovalApp,
  },
  computed: {
    isCurrentApp() {
      var vm = this;
      return function (appname) {
        return appname == vm.currentApp;
      };
    },
  },
  data: function () {
    return {
      currentApp: "",
      components: ["interview", "approval"],
    };
  },
  methods: {},
  created() {
    this.currentApp = window.location.href.split("#")[1];
  },
};
</script>
