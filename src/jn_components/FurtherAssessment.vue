<template>
  <div class="assess-container">
    <div class="container-left">
      <slot name="content"></slot>
    </div>
    <div class="container-right" v-if="ShowTwoContainers">
      <slot name="image">
        <div>
          <i class="fas fa-image"></i>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ShowTwoContainers: Boolean,
  },
};
</script>

<style>
.container-left {
  width: 100%;
}
.assess-container {
  margin-bottom: 1rem;
  padding: 1em;
  border: 1px solid #f6f5f6;
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 0.5rem;
}
@media only screen and (max-width: 1300px) {
  .assess-container {
    flex-wrap: wrap-reverse;
    justify-content: center;
  }
}
</style>
