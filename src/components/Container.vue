<template>
  <div class="position-absolute bg-warning content_container d-flex justify-content-between"
       :class="{active: container.date === $store.state.activeContainer}"
       draggable="true"
       :style="style"
       @dragstart="dragStart"
       @dragend="drop"
       @mousedown="elemToCenter">

    <ModalWindow v-if="openModalWindow" :readFile="readFile"/>

    <div class="content_area w-100 h-100 bg-dark" @dblclick="openModal">
      <img :src="contentData.content" class="w-100 h-100" draggable="false" v-if="contentData.contentType === 'image'"/>
      <pre class="text-light" v-if="contentData.contentType === 'text'"
           draggable="false">{{ contentData.content }}</pre>
      <video :src="contentData.content"
             class="h-100 w-100"
             autoplay="autoplay" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
             v-if="contentData.contentType === 'video'"></video>
    </div>

    <div style="width: 20px; height: 20px; background: black; align-self: flex-end"
         @drag="resize"
         draggable="true"
         @dragend="saveResize"
         class="size_controller">
    </div>
  </div>
</template>

<script>
import ModalWindow from "./Modal_window";

export default {
  data() {
    return {
      width: this.container.width,
      height: this.container.height,
      openModalWindow: false,
      x: 0,
      y: 0
    }
  },
  name: "Container",
  methods: {
    dragStart(e) {
      if (!e.composedPath()[0].classList.contains("content_container")) {
        return
      }
      setTimeout(() => {
        e.target.style.opacity = 0;
      }, 0);
    },
    drop(e) {
      setTimeout(() => {
        e.target.style.opacity = 1;
        e.target.style.left = e.pageX - e.target.offsetWidth / 2 + "px";
        e.target.style.top = e.pageY - e.target.offsetHeight / 2 + "px";


        const {x, y} = this.limitArea(e);
        e.target.style.left = (x || +e.target.style.left.replace("px", "")) + "px"
        e.target.style.top = (y || +e.target.style.top.replace("px", "")) + "px"
        
        const newState = {
          x: +e.target.style.left.replace("px", ""),
          y: +e.target.style.top.replace("px", ""),
          date: this.container.date,
          width: this.container.width,
          height: this.container.height,
          contentType: this.container.contentType,
          content: this.container.content
        }

        this.$store.commit('CHANGE_HISTORY', {
          type: "change",
          payload: {
            id: this.index,
            newState
          }
        });
      }, 0);

      // setTimeout(() => {
        // console.log(e)
        // e.target.style.opacity = 1;
        // const {x, y} = this.limitArea(e);
        // const newState = {
        //   x: x || e.pageX - e.target.offsetWidth / 2,
        //   y: y || e.pageY - e.target.offsetHeight / 2,
        //   date: this.container.date,
        //   width: this.container.width,
        //   height: this.container.height,
        //   contentType: this.container.contentType,
        //   content: this.container.content
        // }
        // // console.log(newState)
        // this.$store.commit('CHANGE_HISTORY', {
        //   type: "change",
        //   payload: {
        //     id: this.index,
        //     newState
        //   }
        // });
      // }, 1);
    },
    elemToCenter(e) {
      if (e.composedPath()[0].classList.contains("size_controller")) {
        return
      }
      this.$store.commit('SET_ACTIVE_CONTAINER', this.container.date);
      e.target.style.left = e.pageX - e.target.offsetWidth / 2 + 'px';
      e.target.style.top = e.pageY - e.target.offsetHeight / 2 + 'px';
    },
    resize(e) {
      e.target.parentNode.style.width = (this.width) + "px";
      e.target.parentNode.style.height = (this.height) + "px";

      if (e.clientX > 0 && e.clientY > 0) {
        this.width += (e.clientX - e.target.parentNode.offsetLeft) - this.width;
        this.height += (e.clientY - e.target.parentNode.offsetTop) - this.height;
      }
    },
    saveResize() {
      const newState = {
        x: this.container.x,
        y: this.container.y,
        date: this.container.date,
        width: this.width,
        height: this.height,
        contentType: this.container.contentType,
        content: this.container.content
      }
      this.$store.commit('CHANGE_HISTORY', {
        type: "change",
        payload: {
          id: this.index,
          newState
        }
      });
    },
    openModal() {
      this.openModalWindow = true;
    },
    readFile(e, contentType) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.openModalWindow = false;

        const newState = {
          x: this.container.x,
          y: this.container.y,
          date: this.container.date,
          width: this.container.width,
          height: this.container.height,
          content: reader.result,
          contentType
        }
        this.$store.commit("CHANGE_HISTORY", {
          type: "change",
          payload: {
            id: this.index,
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
    limitArea(e) {
      const borders = {
        left: document.querySelector(".container_list").offsetWidth,
        right: document.documentElement.clientWidth,
        bottom: document.documentElement.clientHeight,
        top: document.querySelector(".work_area").offsetTop
      }
      let limitX = 0;
      let limitY = 0;


      if (e.target.offsetLeft < borders.left) {
        limitX = borders.left;
      }
      if (e.target.offsetTop < borders.top) {
        limitY = borders.top;
      }
      if ((e.target.offsetLeft + e.target.offsetWidth) > borders.right) {
        limitX = borders.right - e.target.offsetWidth;
      }
      if ((e.target.offsetTop + e.target.clientHeight) > borders.bottom) {
        limitY = borders.bottom - e.target.clientHeight - 6;
      }

      return {
        x: limitX || 0,
        y: limitY || 0
      }
    }
  },
  props: {
    index: Number,
    container: Object
  },
  computed: {
    style: function () {
      return {
        top: this.container.y + "px",
        left: this.container.x + "px",
        width: this.container.width + "px",
        height: this.container.height + "px"
      }
    },
    contentData: function () {
      return {
        contentType: this.container.contentType,
        content: this.container.content
      }
    }
  },
  components: {
    ModalWindow
  }
}
</script>
