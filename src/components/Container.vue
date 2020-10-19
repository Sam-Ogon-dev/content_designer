<template>
    <div class="position-absolute bg-warning"
         draggable="true"
         :style="style"
         @dragstart="dragStart"
         @dragend="drop"
         @mousedown="elemToCenter"
    >
    </div>
</template>

<script>
    export default {
        name: "Container",
        methods: {
            dragStart(e) {
                setTimeout(() => {
                    e.target.style.opacity = 0;
                }, 0);
            },
            drop(e) {
                setTimeout(() => {
                    // e.target.style.left = e.pageX - e.target.offsetWidth / 2 + 'px';
                    // e.target.style.top = e.pageY - e.target.offsetHeight / 2 + 'px';
                    e.target.style.opacity = 1;
                }, 0)

                const newState = {
                    // x: e.pageX - e.target.offsetWidth,
                    // y: e.pageY - e.target.offsetHeight,
                    x: e.pageX - e.target.offsetWidth / 2,
                    y: e.pageY - e.target.offsetHeight / 2,
                    name: this.container.name,
                    width: 200,
                    height: 200
                }
                this.$store.commit('CHANGE_HISTORY', {
                    type: "change", payload: {
                        id: this.index,
                        newState
                    }
                })
            },
            elemToCenter(e) {
                e.target.style.left = e.pageX - e.target.offsetWidth / 2 + 'px';
                e.target.style.top = e.pageY - e.target.offsetHeight / 2 + 'px';
            }
        },
        props: {
            index: Number,
            container: Object,
            changeContainer: Function
        },
        computed: {
            style: function () {
                return {
                    top: this.container.y + "px",
                    left: this.container.x + "px",
                    width: "200px",
                    height: "200px",
                    resize: "both",
                    overflow: "hidden"
                }
            }
        },
        updated() {
            console.log("render")
        }
    }
</script>
