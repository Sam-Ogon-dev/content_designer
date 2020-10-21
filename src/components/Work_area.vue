<template>
  <div class="h-100 w-75 bg-secondary work_area">
    <Container v-for="(container, index) of containerArray"
               :container="container"
               :index="index"
               :key="container.date"
    />
  </div>
</template>

<script>
import Container from "./Container";

export default {
  name: "WorkArea",
  props: {
    containerArray: Array
  },
  components: {
    Container
  }
}
</script>