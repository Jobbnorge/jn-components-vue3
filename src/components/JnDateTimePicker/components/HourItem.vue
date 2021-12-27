<template>
  <li @click="hourSelected" :class="[isSelected ? 'is-selected' : '']">
    {{ hour }}
  </li>
</template>

<script>
export default {
  props: {
    hour: {
      type: Number,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hourSelected(){
      this.$emit("hourSelected", this.hour);
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
