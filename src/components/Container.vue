<template>
  <div class="position-absolute bg-warning content_container d-flex justify-content-between"
       :class="{active: container.date === $store.state.activeContainer}"
       draggable="false"
       :style="style"
       @mousedown="relocateEvent">


    <div class="content_area w-100 h-100 bg-dark" @dblclick="openModal({index, state: container})">
      <img style="pointer-events: none; user-select: none" :src="contentData.content" class="w-100 h-100"
           draggable="false" v-if="contentData.contentType === 'image'"/>

      <pre style="pointer-events: none; user-select: none" class="text-light" v-if="contentData.contentType === 'text'">
        {{ contentData.content }}
      </pre>

      <video :src="contentData.content"
             class="h-100 w-100"
             style="pointer-events: none; user-select: none"
             autoplay="autoplay" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
             v-if="contentData.contentType === 'video'"></video>
    </div>

    <div style="width: 20px; height: 20px; background: black; align-self: flex-end"
         @mousedown="resizeEvent"
         class="size_controller">
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      width: this.container.width,
      height: this.container.height,
      openModalWindow: false,
      x: this.container.x,
      y: this.container.y
    }
  },
  name: "Container",
  methods: {
    resize(element, e) {
      element.target.parentNode.style.width = (this.width) + "px";
      element.target.parentNode.style.height = (this.height) + "px";

      if (e.clientX > 0 && e.clientY > 0) {
        this.width += (e.clientX - element.target.parentNode.offsetLeft) - this.width + 10;
        this.height += (e.clientY - element.target.parentNode.offsetTop) - this.height + 10;
      }
    },
    relocate(element, e) {
      element.target.parentNode.style.left = (this.x) + "px";
      element.target.parentNode.style.top = (this.y) + "px";

      if (e.clientX > 0 && e.clientY > 0) {
        this.x = e.clientX - (this.width / 2);
        this.y = e.clientY - (this.height / 2);
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
    limitArea(e) {
      const borders = {
        left: document.querySelector(".container_list").offsetWidth,
        right: document.documentElement.clientWidth,
        bottom: document.documentElement.clientHeight,
        top: document.querySelector(".work_area").offsetTop
      }
      let limitX = 0;
      let limitY = 0;


      if (e.offsetLeft < borders.left) {
        limitX = borders.left;
      }
      if (e.offsetTop < borders.top) {
        limitY = borders.top;
      }
      if ((e.offsetLeft + e.offsetWidth) > borders.right) {
        limitX = borders.right - e.offsetWidth;
      }
      if ((e.offsetTop + e.clientHeight) > borders.bottom) {
        limitY = borders.bottom - e.clientHeight - 6;
      }

      return {
        x: limitX || 0,
        y: limitY || 0
      }
    },
    resizeEvent(downEvent) {
      const mousemove = (moveEvent) => {
        this.resize(downEvent, moveEvent);
      }
      const mouseUp = () => {
        this.saveResize();
        document.body.removeEventListener("mousemove", mousemove);
        document.body.removeEventListener("mouseup", mouseUp);
      }

      document.body.addEventListener("mousemove", mousemove);
      document.body.addEventListener("dragstart", () => false);
      document.body.addEventListener("mouseup", mouseUp);

    },
    relocateEvent(downEvent) {
      if (!downEvent.target.classList.contains("content_area")) {
        return;
      }
      
      this.$store.commit("SET_ACTIVE_CONTAINER", this.container.date);
      downEvent.stopPropagation()
      const mousemove = (moveEvent) => {
        this.relocate(downEvent, moveEvent);
      }
      const mouseUp = (e) => {
        document.body.removeEventListener("mousemove", mousemove);
        document.body.removeEventListener("mouseup", mouseUp);

        const {x, y} = this.limitArea(e.target.parentNode);
        e.target.parentNode.style.left = (x || +e.target.parentNode.style.left) + "px"
        e.target.parentNode.style.top = (y || +e.target.parentNode.style.top) + "px"

        const newState = {
          x: e.target.parentNode.style.left.replace("px", ""),
          y: e.target.parentNode.style.top.replace("px", ""),
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
      }

      document.body.addEventListener("mousemove", mousemove);
      document.body.addEventListener("dragstart", () => false);
      document.body.addEventListener("mouseup", mouseUp);
    }
  },
  props: {
    index: Number,
    container: Object,
    openModal: Function
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
  }
}
</script>


<!--переделать перетаскивание элемента на mousemove-->