<template>
  <b-container fluid>
    <b-row class="m-4">
      <b-col cols="8">
        <b-table-simple bordered caption-bottom fixed id="printable-table">
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
          noModifyButton
          noCreateButton
        >
          <div class="d-flex">
            <b-button @click="handleFetchByDate" variant="success"
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
        <create-modify-form
          :form="flightForm"
          noCreateButton
          noModifyButton
          class="mt-4"
        >
          <div class="d-flex mt-4">
            <b-button @click="handleFetchByFlight" variant="success"
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
      description: 'Статистика за все время',
      dateForm: {
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
      flightForm: {
        inputs: [
          {
            key: 'flight',
            id: 'flight_id',
            type: 'select',
            options: [],
            optionsScheme: { value: 'flight_id', text: 'flight' },
            label: 'Рейс',
            optional: true,
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

      this.setDescription(date_from, date_to);
    },
    async handleFetchByFlight() {
      let { flight_id } = this.flightForm.data;
      flight_id = flight_id || '';
      let query = `flight_id=${flight_id}`;

      this.report = await this.$axios.$get(
        `/api/admin/reports/statistics?${query}`
      );
      if (flight_id)
        this.description = `Статистика по рейсу ${this.getFlight(flight_id)}`;
      else {
        this.setDescription();
      }
    },
    formatDate(dateStr) {
      return dateStr.split('-').reverse().join('.');
    },
    getFlight(flight_id) {
      return this.flightForm.inputs[0].options.find(
        (option) => option.value === flight_id
      ).text;
    },
    handlePrint() {
      createReport({ subtitle: this.description }, '#printable-table');
    },
    setDescription(date_from, date_to) {
      if (!date_from && !date_to) {
        this.description = 'Статистика за все время';
      } else if (!date_from) {
        this.description = `Статистика за период до ${this.formatDate(
          date_to
        )}`;
      } else if (!date_to) {
        this.description = `Статистика за период с ${this.formatDate(
          date_from
        )}`;
      } else {
        this.description = `Статистика за период с ${this.formatDate(
          date_from
        )} по ${this.formatDate(date_to)}`;
      }
    },
  },
};
</script>
