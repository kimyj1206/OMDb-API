<template>
  <div>{{ movie.title }}</div>
</template>

<script>
export default {
  props: {
    movie: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>