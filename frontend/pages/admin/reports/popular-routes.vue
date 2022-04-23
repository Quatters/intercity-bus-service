<template>
  <b-container fluid>
    <b-row class="m-4">
      <b-col cols="8" class="table-wrapper">
        <my-table
          :fields="report.fields"
          :items="report.items"
          unselectable
          class="mb-1"
        />
        <p class="font-italic text-muted">{{ reportText }}</p>
      </b-col>
      <b-col>
        <create-modify-form
          :form="form"
          name="Популярные маршруты"
          @create="handleFetch"
          noModifyButton
          createButtonText="Получить"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import CreateModifyForm from '../../../components/CreateModifyForm.vue';
import MyTable from '../../../components/MyTable.vue';
export default {
  components: { CreateModifyForm, MyTable },
  data() {
    return {
      reportText: 'Популярные маршруты за все время',
      form: {
        inputs: [
          {
            key: 'date_from',
            type: 'date',
            label: 'С',
          },
          {
            key: 'date_to',
            type: 'date',
            label: 'По',
          },
        ],
        data: {},
      },
      report: {
        fields: [
          { label: 'Номер маршрута', key: 'route_number', sortable: true },
          { label: 'Продано билетов', key: 'ticket_count', sortable: true },
        ],
        items: [],
      },
    };
  },
  async mounted() {
    const items = await this.$axios.$get('/api/admin/reports/popular-routes');
    this.report.items = items;
  },
  methods: {
    async handleFetch() {
      let { date_from, date_to } = this.form.data;

      date_from = date_from || '';
      date_to = date_to || '';

      let query = `date_from=${date_from}&date_to=${date_to}`;

      this.report.items = await this.$axios.$get(
        `/api/admin/reports/popular-routes?${query}`
      );

      this.reportText = `Популярные маршруты в период с ${this.formatDate(
        date_from
      )} по ${this.formatDate(date_to)}`;
    },
    formatDate(dateStr) {
      return dateStr.split('-').reverse().join('.');
    },
  },
};
</script>
