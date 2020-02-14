<template>
  <div class="app-container">
    
 
  </div>
</template>

<script> 

export default {
  name: 'WebIndex',
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver()
  },
  methods: {
    
  }
}
</script>
