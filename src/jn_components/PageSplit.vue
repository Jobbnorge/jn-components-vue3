<template>
  <div>
    <div class="split-select-container" v-if="widerThanBreakPoint">
      <DropDownButton
        :text="`${selectedWidth}%`"
        popperStyle="position:absolute; z-index:1"
        :options="splitOptions"
        id="pagesplit"
        faClass="fa-columns"
        @item-clicked="handleClick"
        isPrimary
      />
    </div>
    <div class="pageSplitContainer">
      <div
        class="leftPane"
        :style="
          widerThanBreakPoint
            ? { width: 100 - selectedWidth + '%' }
            : 'width: 100%'
        "
      >
        <slot name="leftPane"></slot>
      </div>
      <div
        class="rightPane"
        :style="
          widerThanBreakPoint ? { width: selectedWidth + '%' } : 'width: 100%'
        "
      >
        <slot name="rightPane"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import DropDownButton from "./DropDownButton.vue";
export default {
  components: {
    DropDownButton,
  },
  data() {
    return {
      splitOptions: [
        {
          text: "75%",
          id: 75,
        },
        {
          text: "50%",
          id: 50,
        },
        {
          text: "25%",
          id: 25,
        },
      ],
      selectedWidth: 50,
    };
  },
  computed: {
    widerThanBreakPoint() {
      return window.innerWidth > this.$globalBreakPoint;
    },
  },
  created() {
    if (!this.widerThanBreakPoint) {
      this.selectedWidth = 100;
    }
  },
  methods: {
    handleClick: function (e) {
      this.selectedWidth = e.id;
    },
  },
};
</script>
<style scoped>
.pageSplitContainer {
  display: flex;
  padding: 1.5rem;
}
.leftPane {
  transition: 0.5s width;
  padding: 0 1rem;
}
.rightPane {
  transition: 0.5s width;
  border-left: 2px solid;
  padding: 0 1rem;
}
.split-select-container {
  display: grid;
  justify-content: end;
  margin: 1rem 2rem 0 0;
  position: relative;
}
@media only screen and (max-width: 845px) {
  .pageSplitContainer {
    flex-direction: column;
  }
  .leftPane {
    height: auto;
  }
  .rightPane {
    height: auto;
    border-left: 0px;
    border-top: 2px solid;
    margin-top: 1rem;
  }
}
</style>
