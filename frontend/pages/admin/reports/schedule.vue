<template>
  <b-container fluid>
    <b-row class="m-4">
      <b-col cols="8">
        <b-card v-if="report.route_number">
          <b-card-body>
            <b-card-title>
              {{ report.route_number }}
            </b-card-title>
            <b-card-sub-title>
              {{ report.from_city }} - {{ report.to_city }}
            </b-card-sub-title>

            <b-card-text class="mt-3 mb-2">Расписание:</b-card-text>

            <b-table-simple class="mb-0">
              <b-tr v-for="(schedule, index) in report.schedule" :key="index">
                <b-td class="px-0 py-2">
                  {{ schedule.departure_time }} - {{ schedule.arrival_time }}
                </b-td>
              </b-tr>
            </b-table-simple>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col>
        <create-modify-form
          :form="form"
          name="Расписание маршрута"
          noModifyButton
          noCreateButton
        >
          <div class="d-flex">
            <b-button
              @click="handleFetch"
              :disabled="!form.data.route_number"
              variant="success"
              >Получить</b-button
            >
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
import { createReport } from '../../../static/pdf-creator';

export default {
  components: { CreateModifyForm },
  data() {
    return {
      form: {
        inputs: [
          {
            key: 'route_number',
            id: 'route_number',
            label: 'Номер маршрута',
            type: 'select',
            options: [],
            optionsScheme: { value: 'route_number', text: 'route_number' },
          },
        ],
        data: {},
      },
      report: {},
    };
  },
  async mounted() {
    const options = await this.$axios.$get('/api/admin/routes');
    this.form.inputs[0].options = options.map((option) => {
      return {
        value: option.route_number,
        text: option.route_number,
      };
    });
  },
  methods: {
    async handleFetch() {
      const route_number = this.form.data.route_number;
      const data = await this.$axios.$get(
        `/api/admin/schedule/${route_number}`
      );

      let report = {};
      report.route_number = data[0].route_number;
      report.from_city = data[0].from_city;
      report.to_city = data[0].to_city;
      report.schedule = [];
      data.forEach((item) => {
        const { departure_time, arrival_time } = item;
        report.schedule.push({ departure_time, arrival_time });
      });

      this.report = report;
    },
    handlePrint() {
      const report = {
        title: 'Расписание маршрута',
        subtitle: `${this.report.route_number} - ${this.report.from_city}-${this.report.to_city}`,
        data: this.report.schedule.map(
          (item) => `${item.departure_time}-${item.arrival_time}`
        ),
        filename: `Расписание маршрута ${this.report.route_number}`,
      };
      createReport(report);
    },
  },
};
</script>
