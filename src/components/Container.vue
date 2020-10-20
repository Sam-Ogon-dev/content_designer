<template>
  <div class="position-absolute bg-warning content_container d-flex justify-content-between flex-row-reverse"
       :class="{active: container.date === $store.state.activeContainer}"
       draggable="true"
       :style="style"
       @dragstart="dragStart"
       @dragend="drop"
       @mousedown="elemToCenter"
  >
    <div style="width: 20px; height: 20px; background: black; align-self: flex-end"
         @drag="resize"
         draggable="true"
         @dragend="saveResize"
         class="size_controller"
    >

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: this.container.width,
      height: this.container.height
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
      if (!e.composedPath()[0].classList.contains("content_container")) {
        return
      }
      setTimeout(() => {
        e.target.style.opacity = 1;
      }, 0)

      const newState = {
        x: e.pageX - e.target.offsetWidth / 2,
        y: e.pageY - e.target.offsetHeight / 2,
        date: this.container.date,
        width: this.container.width,
        height: this.container.height
      }
      this.$store.commit('CHANGE_HISTORY', {
        type: "change",
        payload: {
          id: this.index,
          newState
        }
      });
    },
    elemToCenter(e) {
      if (!e.composedPath()[0].classList.contains("content_container")) {
        return
      }

      this.$store.commit('SET_ACTIVE_CONTAINER', this.container.date);
      e.target.style.left = e.pageX - e.target.offsetWidth / 2 + 'px';
      e.target.style.top = e.pageY - e.target.offsetHeight / 2 + 'px';
    },
    resize(e) {

      // console.log(e.target.parentNode.style.width + " el")
      // console.log(this.width + " data")
      // console.log(this.container.width + "con")
      // console.log(e.target.parentNode.style.width + " width")
      // console.log(e.target.parentNode.clientWidth + " clientWidth")
      //ClientWidth меньше чем ширина в стилях!!
      //узнать больше о getComputedStyle
      //лучше расчитывать ширину блока через clientWidth

      e.target.parentNode.style.width = (this.width) + "px";
      e.target.parentNode.style.height = (this.height) + "px";
      // console.log(e.offsetX)
      // console.log(e.clientX)
      if(e.clientX > 0) {
        const offset = (e.clientX - e.target.parentNode.offsetLeft) - this.width;
        console.dir(offset)
        // this.width += e.offsetX / 100;
        this.width += offset;
      }
      // this.height += e.offsetY / 5;
    },
    saveResize(e) {
      const newState = {
        x: this.container.x,
        y: this.container.y,
        date: this.container.date,
        // width: e.target.parentNode.clientWidth,
        // height: e.target.parentNode.clientHeight
        width: window.getComputedStyle(e.target.parentNode).width,
        height: window.getComputedStyle(e.target.parentNode).height
      }
      this.$store.commit('CHANGE_HISTORY', {
        type: "change",
        payload: {
          id: this.index,
          newState
        }
      });
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
    }
  },
  updated() {
    console.log("===================")
  }
}
</script>
