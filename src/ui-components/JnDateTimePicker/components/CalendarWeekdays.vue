<template>
  <div>
    <ol class="day-of-week">
      <li v-for="day in weekdays" :key="day">{{ day }}</li>
    </ol>
    <hr />
  </div>
</template>
<script>
const WEEKDAYS = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"];
export default {
  name: "Calendar-weekdays",
  computed: {
    weekdays() {
      return WEEKDAYS;
    },
  },
};
</script>
<style scoped>
.day-of-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

ol.day-of-week,
.day-of-week > li {
  padding: 0;
  margin: 0;
  list-style: none;
}

.day-of-week > li {
  min-height: 32px;
  text-align: center;
  border-radius: 3px;
  color: #44303c;
}
hr {
  margin: 0.5rem 0 0.5rem 0;
  border: 1px solid #f6f5f6;
}
</style>
