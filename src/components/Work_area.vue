<template>
  <div class="h-100 w-75 bg-secondary work_area">
    <Container v-for="(container, index) of filteredArray"
               :openModal="openModal"
               :container="container"
               :index="index"
               :key="container.date"/>
    <ModalWindow v-if="openModalWindow" :readFile="readFile"/>
  </div>
</template>

<script>
import Container from "./Container";
import ModalWindow from "./Modal_window";

export default {
  name: "WorkArea",
  props: {
    containerArray: Array
  },
  data() {
    return {
      openModalWindow: false,
      currentContainer: {}
    }
  },
  components: {
    Container,
    ModalWindow
  },
  methods: {
    readFile(e, contentType) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.openModalWindow = false;

        const newState = {
          x: this.currentContainer.state.x,
          y: this.currentContainer.state.y,
          date: this.currentContainer.state.date,
          width: this.currentContainer.state.width,
          height: this.currentContainer.state.height,
          content: reader.result,
          contentType
        }
        this.$store.commit("CHANGE_HISTORY", {
          type: "change",
          payload: {
            id: this.currentContainer.index,
            newState
          }
        });
      }

      if (contentType === "image") {
        reader.readAsDataURL(e.target.files[0]);
      }
      if (contentType === "text") {
        reader.readAsText(e.target.files[0]);
      }
      if (contentType === "video") {
        reader.readAsDataURL(e.target.files[0]);
      }
    },
    openModal(container) {
      this.currentContainer = container;
      this.openModalWindow = true;
    }
  },
  computed: {
    filteredArray: function () {
      return this.containerArray.filter(item => {
        if(item.deleted) {
          return false;
        } else {
          return true;
        }
      });
    }
  }
}
</script>