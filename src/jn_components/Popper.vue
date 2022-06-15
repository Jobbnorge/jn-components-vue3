<template>
  <div>
    <div
      :id="triggerId"
      :ref="triggerId"
      :style="triggerStyle"
      @click="togglePopper"
    >
      <slot name="trigger"></slot>
    </div>
    <div
      :id="popperId"
      :style="['z-index: 1', popperStyle]"
      v-if="showPopper"
    >
      <slot name="popper"></slot>
    </div>
  </div>
</template>
<script>
import { createPopper } from "@popperjs/core";

export default {
  name: "Popper",
  emits: ["outside-click"],
  computed: {
    showPopper() {
      return this.displayPopper;
    },
  },

  props: {
    config: {
      type: Object,
      default: () => ({
        placement: "top",
      }),
    },
    triggerId: {
      type: String,
      default: "",
    },
    popperId: {
      type: String,

      default: "",
    },
    tooltip: {
      type: Boolean,
      default: true,
    },
    dropDown: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String, 
      default: ""
    },
    triggerStyle: String,
    popperStyle: String,
  },
  data() {
    return {
      triggerEl: null,
      popperEl: null,
      eventListener: null,
      displayPopper: false,
    };
  },
  mounted() {
    document.addEventListener(`click`, (e) => {
      if (e.target === this.$el || this.$el.contains(e.target)) {
        return;
      }
      this.$emit("outside-click");
      this.displayPopper = false;
    });
  },
  beforeUnmount() {
    document.removeEventListener(`click`, this.eventListener);
  },
  methods: {
    getTitle() {

    },
    togglePopper() {
      this.displayPopper = !this.displayPopper;
      if (this.displayPopper == true) {
        this.$nextTick(() => {
          this.popperEl = document.querySelector(`#${this.popperId}`);
          this.triggerEl = document.querySelector(`#${this.triggerId}`);
          while (this.triggerEl != null) {
            this.createPopperElement();
            break;
          }
        });
      }
    },
    createPopperElement() {
      createPopper(this.triggerEl, this.popperEl, this.config);
    },
  },
};
</script>