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
        <p class="font-italic text-muted">{{ description }}</p>
      </b-col>
      <b-col>
        <create-modify-form
          :form="form"
          name="Популярные маршруты"
          @create="handleFetch"
          noModifyButton
          noCreateButton
          createButtonText="Получить"
        >
          <div class="d-flex mt-4">
            <b-button @click="handleFetch" variant="success">Получить</b-button>
            <b-button
              @click="handlePrint"
              :disabled="Object.keys(report).length === 0"
              variant="info"
              class="ml-auto"
              ><b-icon-printer-fill></b-icon-printer-fill
            ></b-button>
          </div>
        </create-modify-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import CreateModifyForm from '../../../components/CreateModifyForm.vue';
import MyTable from '../../../components/MyTable.vue';
import { createReport } from '../../../static/pdf-creator';

export default {
  components: { CreateModifyForm, MyTable },
  data() {
    return {
      description: 'Популярные маршруты за все время',
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

      this.setDescription(date_from, date_to);
    },
    setDescription(date_from, date_to) {
      if (!date_from && !date_to) {
        this.description = 'Популярные маршруты за все время';
      } else if (!date_from) {
        this.description = `Популярные маршруты в период до ${this.formatDate(
          date_to
        )}`;
      } else if (!date_to) {
        this.description = `Популярные маршруты в период с ${this.formatDate(
          date_from
        )}`;
      } else {
        this.description = `Популярные маршруты в период с ${this.formatDate(
          date_from
        )} по ${this.formatDate(date_to)}`;
      }
    },
    formatDate(dateStr) {
      return dateStr.split('-').reverse().join('.');
    },
    handlePrint() {
      createReport({ subtitle: this.description }, '#printable-table');
    },
  },
};
</script>
