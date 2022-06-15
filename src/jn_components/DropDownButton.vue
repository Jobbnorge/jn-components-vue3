<template>
  <Popper
    :config="{ placement: dropUp ? 'top-start' : 'bottom-start' }"
    :triggerId="getTriggerId"
    :popperId="getPopperId"
    dropDown
    @outside-click="showOptions = false"
    :popperStyle="popperStyle"
    :triggerStyle="triggerStyle"
  >
    <template #trigger>
      <button
        type="button"
        role="menu"
        class="btn button-icon"
        v-bind:class="{
          bg: isPrimary,
          'border-blue': showOptions,
          'large-font': largeFont,
        }"
        @click="showOptions = !showOptions"
      >
        <span v-if="faClass" v-bind:class="['fal', faClass]"></span>
        {{ text }}
        <span
          v-bind:class="[
            dropUp ? 'fas fa-caret-up' : 'fas fa-caret-down',
            { 'fa-rotate-180': showOptions },
          ]"
          style="margin-left: 0.3rem"
        ></span>
      </button>
    </template>
    <template #popper>
      <div class="drop-items">
        <ul>
          <li
            v-for="option in options"
            role="menuitem"
            :key="option.id"
            @click="handleClick(option)"
            v-bind:class="[
              {
                'item-highlight':
                  !showSubMenu && !option.disabled && !option.submenu,
              },
              { 'disabled-item': option.disabled },
            ]"
          >
            <span
              v-if="option.faClass"
              v-bind:class="['fal', option.faClass]"
            ></span>
            {{ option.text }}
            <span
              v-if="option.submenu"
              v-bind:class="[
                'fas fa-caret-down',
                { 'fa-rotate-180': showSubMenu },
              ]"
              style="margin-left: 0.3rem"
            ></span>
            <div v-if="option.submenu && showSubMenu" style="background: white">
              <ul>
                <li
                  v-for="item in option.submenu"
                  :key="item.id"
                  @click="handleSubmenuClick(item)"
                  v-bind:class="[
                    { 'item-highlight': !option.disabled },
                    { 'disabled-item': option.disabled },
                  ]"
                >
                  {{ item.text }}
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </Popper>
</template>

<script>
import Popper from "./Popper.vue";
export default {
  name: "DropDownButton",
  components: {
    Popper,
  },
  computed: {
    getTriggerId() {
      return `trigger-` + this.id;
    },
    getPopperId() {
      return `popper-` + this.id;
    },
  },
  emits: ["item-clicked", "submenu-item-clicked"],
  data() {
    return {
      showOptions: false,
      showSubMenu: false,
      hover: false,
    };
  },
  props: {
    text: String,
    isPrimary: Boolean,
    dropUp: {
      type: Boolean,
      default: false,
    },
    options: Array,
    id: String,
    faClass: String,
    popperStyle: String,
    triggerStyle: String,
    largeFont: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick(option) {
      if (!option.submenu && !option.disabled) {
        this.$emit("item-clicked", option);
      } else {
        this.showSubMenu = !this.showSubMenu;
      }
    },
    handleSubmenuClick(item) {
      if (!item.disabled) this.$emit("submenu-item-clicked", item);
    },
  },
};
</script>

<style scoped>
.bg {
  background: #e8f5fa;
}
.border-blue {
  border: 1px solid var(--blue);
}
.button-icon
  .button-icon:link
  .button-icon:visited
  .button-icon:hover
  .button-icon:active {
  color: #44303c;
  font-family: "Roboto";
}
.button-icon:hover {
  background: #e8f5fa;
}
.btn {
  color: inherit;
  text-transform: none;
  box-shadow: none !important;
  font-size: 0.8125rem;
  border-radius: 3px;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid transparent;
  display: contents;
}
.drop-items {
  background: #ffffff;
  min-width: 11em;
  background-color: #ffffff;
  border: 1px solid #f6f5f6;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
}
li {
  padding: 0.5rem;
  cursor: pointer;
}
.item-highlight:hover {
  background: var(--lightBlue);
}
.disabled-item {
  color: #777777;
}
.disabled-item:hover {
  cursor: not-allowed;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.fa-rotate-180 {
  transform: rotateX(180deg);
}
.large-font {
  font-size: 1.5625rem;
}
</style>
