<template>
  <ul>
    <li
      v-for="(error, index) in validationErrors"
      :key="index"
      style="color: red"
    >
      {{ error }}
    </li>
  </ul>
</template>

<script>
export default {
  props: { validationErrors: Array },
  setup() {},
};
</script>
