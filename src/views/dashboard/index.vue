<template>
  <div class="dashboard-container" style="height:100%;">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'manager'
    ])
  },
  created() {
    if (this.manager.role === 0) {
      this.currentRole = 'editorDashboard'
    } else {
      this.currentRole = 'adminDashboard'
    }
  }
}
</script>
