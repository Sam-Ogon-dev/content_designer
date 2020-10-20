<template>
  <div class="d-flex flex-column align-content-center w-25 bg-light">
    <div class="w-100 p-1"
         v-for="(container, index) of containerArray"
         :key="container.date"
         :class="{active: container.date === $store.state.activeContainer}"
    >
      Контейнер: {{ index }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ContainerList",
  props: {
    containerArray: Array
  }
}
</script>