<template>
  <div class="d-flex flex-row w-100 bg-primary h-100">
    <ContainerList :containerArray="containerArray"/>
    <WorkArea :containerArray="containerArray" :changeContainer="changeContainer"/>
  </div>
</template>

<script>
import ContainerList from "./Container_list";
import WorkArea from "./Work_area";

  export default {
    name: "ContentDesigner",
    components: {
      ContainerList,
      WorkArea
    },
    props: {
      containerArray: Array,
      changeContainer: Function
    }
  }
</script>