const queryMap = new Map();

export default {
  watch: {
    query: {
      handler(val) {
        queryMap.set(this.$route.name, { ...val });
      },
      deep: true
    }
  },
  mounted() {
    let query = queryMap.get(this.$route.name);
    if (query) {
      Object.keys(query).forEach(key => {
        this.query[key] = query[key];
      })
    }
  }
}

export function clearQuery() {
  queryMap.clear();
}

