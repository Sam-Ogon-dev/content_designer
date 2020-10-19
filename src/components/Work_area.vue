<template>
  <div class="h-100 w-75 bg-secondary">
    <Container v-for="(container, index) of containerArray"
               :container="container"
               :index="index"
               :key="container.name"
               :changeContainer="changeContainer"
    />
  </div>
</template>

<script>
import Container from "./Container";

export default {
  name: "WorkArea",
  props: {
    containerArray: Array,
    changeContainer: Function
  },
  components: {
    Container
  }
}
</script>