<template>
  <div class="d-flex justify-content-center align-items-center w-100 h-100 position-fixed" style="left: 0; top: 0; background: rgba(0,0,0,0.54); z-index: 2">
    <div class="d-flex justify-content-around align-items-center w-25 h-25 bg-light">

      <input type="file" id="text" style="display: none" accept="text/plain" @change="readFile($event, 'text')"/>
      <label for="text">текст</label>

      <input type="file" id="image" style="display: none" accept="image/*" @change="readFile($event, 'image')"/>
      <label for="image">картинки</label>

      <input type="file" id="video" style="display: none" accept="video/*" @change="readFile($event, 'video')"/>
      <label for="video">видео</label>

    </div>
  </div>

</template>

<script>
export default {
  name: "ModalWindow",
  data() {
    return {
      contentType: "",
      content: 0
    }
  },
  props: {
    readFile: Function
  }
}
</script>
