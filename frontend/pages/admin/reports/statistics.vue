<template>
  <b-container fluid>
    <b-row class="m-4">
      <b-col cols="8">
        <b-table-simple bordered caption-bottom fixed>
          <caption class="font-italic pt-1">
            {{
              description
            }}
          </caption>
          <b-tbody>
            <b-tr>
              <b-th class="text-right">Выручка</b-th>
              <b-td>{{ report.income }}</b-td>
            </b-tr>
            <b-tr>
              <b-th class="text-right">Продано билетов</b-th>
              <b-td>{{ report.ticket_count }}</b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-col>
      <b-col>
        <create-modify-form
          :form="dateForm"
          name="Статистика"
          @create="handleFetchByDate"
          noModifyButton
          createButtonText="Получить"
        />
        <create-modify-form
          :form="flightForm"
          @create="handleFetchByFlight"
          noModifyButton
          createButtonText="Получить"
          class="mt-4"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import CreateModifyForm from '../../../components/CreateModifyForm.vue';

export default {
  components: { CreateModifyForm },
  data() {
    return {
      description: 'Статистика за все время',
      dateForm: {
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
      flightForm: {
        inputs: [
          {
            key: 'flight',
            id: 'flight_id',
            type: 'select',
            options: [],
            optionsScheme: { value: 'flight_id', text: 'flight' },
            label: 'Рейс',
          },
        ],
        data: {},
      },
      report: {},
    };
  },
  async mounted() {
    const options = await this.$axios.$get('/api/admin/flights?inline=true');
    this.flightForm.inputs[0].options = options.map((option) => {
      return {
        value: option.flight_id,
        text: option.flight,
      };
    });
    this.report = await this.$axios.$get('/api/admin/reports/statistics');
  },
  methods: {
    async handleFetchByDate() {
      let { date_from, date_to } = this.dateForm.data;
      date_from = date_from || '';
      date_to = date_to || '';
      let query = `date_from=${date_from}&date_to=${date_to}`;

      this.report = await this.$axios.$get(
        `/api/admin/reports/statistics?${query}`
      );

      this.description = `Статистика за период с ${this.formatDate(
        date_from
      )} по ${this.formatDate(date_to)}`;
    },
    async handleFetchByFlight() {
      let { flight_id } = this.flightForm.data;

      flight_id = flight_id || '';

      let query = `flight_id=${flight_id}`;

      this.report = await this.$axios.$get(
        `/api/admin/reports/statistics?${query}`
      );

      this.description = `Статистика по рейсу ${this.getFlight(flight_id)}`;
    },
    formatDate(dateStr) {
      return dateStr.split('-').reverse().join('.');
    },
    getFlight(flight_id) {
      return this.flightForm.inputs[0].options.find(
        (option) => option.value === flight_id
      ).text;
    },
  },
};
</script>
