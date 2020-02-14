<template>
  <div class="app-container">
    
 
  </div>
</template>

<script> 
import { GetIndexItem } from "@/api/website";
export default {
  name: 'webIndex',
  data() {
    return {
      driver: null
    }
  },
  mounted() { 
    this.GetIndexItem()
  },
  methods: {
    async GetIndexItem() {
      let offsetRow = (this.nowPage - 1) * this.rows;
      let newParams = {
        simple: 1,
        limit: this.rows,
        offset: offsetRow
      };
      let res = await GetIndexItem("banner", "");
      console.log(res.data)
    },
  }
}
</script>
