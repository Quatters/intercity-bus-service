<template>
  <b-table
    :hover="!unselectable"
    :items="items"
    :fields="fields ? fields : undefined"
    small
    show-empty
    head-variant="light"
    sticky-header="100%"
    bordered
    :selectable="!unselectable"
    ref="table"
    @row-selected="(rows) => $emit('rowSelect', rows[0])"
    select-mode="single"
    empty-text="Нет записей"
    label-sort-asc=""
    id="printable-table"
  >
  </b-table>
</template>

<script>
export default {
  props: {
    unselectable: Boolean,
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
