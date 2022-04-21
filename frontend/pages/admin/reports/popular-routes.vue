<template>
  <b-container fluid>
    <b-row class="m-4">
      <b-col cols="8">
        <my-table :fields="report.fields" :items="report.items" unselectable />
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
      form: {
        inputs: [
          {
            key: 'date_from',
            type: 'date',
            label: 'С',
            optional: true,
          },
          {
            key: 'date_to',
            type: 'date',
            label: 'По',
            optional: true,
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
    console.log(items);
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
    },
  },
};
</script>
