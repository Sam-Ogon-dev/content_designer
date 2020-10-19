<template>
  <div id="app">
    <div class="d-flex flex-row w-100 bg-danger align-content-center p-1">
      <img class="back icon m-1" src="@/assets/arrow.png" @click="back">
      <img class="next icon reverse_image m-1" src="@/assets/arrow.png">
      <img class="plus icon m-1" src="@/assets/plus.png" @click="createContainer">
      <img class="delete icon m-1" src="@/assets/basket.png">
    </div>
    <ContentDesigner :containerArray="containerArray" :changeContainer="changeContainer"/>
  </div>
</template>

<script>
import ContentDesigner from "./components/Content_designer";
import "./styles/main.scss";
import {store} from "@/store";

export default {
  name: 'App',
  store: store,
  computed: {
    containerArray: function () {
      console.log(11)
      return this.$store.state.containerArray;
    }
  },
  components: {
    ContentDesigner
  },
  methods: {
    createContainer() {
      this.$store.commit("ADD_TO_LAST_HISTORY", {
        type: "create",
        payload: {
          x: 110,
          y: 110,
          name: "контейнер " + this.$store.state.history.containerArray.length,
          width: 200,
          height: 200
        }
      });
    },
    changeContainer(index, value) {
      const newArray = [...this.containerArray]
      newArray[index] = value;
      this.containerArray = newArray
    },
    back() {
      this.$store.commit("ADD_TO_FUTURE_HISTORY");
    }
  }
}
</script>
