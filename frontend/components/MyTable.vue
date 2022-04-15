<template>
  <b-table
    hover
    :items="items"
    :fields="fields ? fields : undefined"
    small
    head-variant="light"
    sticky-header="100%"
    selectable
    ref="table"
    @row-selected="(rows) => $emit('rowSelect', rows[0])"
    select-mode="single"
  >
  </b-table>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    fields: {
      type: Array,
    },
  },
  methods: {
    unselect() {
      this.$refs.table.clearSelected();
    },
  },
};
</script>
