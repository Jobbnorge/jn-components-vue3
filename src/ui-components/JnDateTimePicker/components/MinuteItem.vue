<template>
  <li @click="minuteSelected" :class="[isSelected ? 'is-selected' : '']">
    {{ minute }}
  </li>
</template>

<script>
export default {
  props: {
    minute: {
      type: Number,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    minuteSelected(){
      this.$emit("minuteSelected", this.minute);
    }
  }
};
</script>

<style scoped>
.is-selected,
li:hover {
  background: #0e6489;
  color: #fff;
} 
</style>