<template>
  <b-container fluid>
    <b-row class="m-4">
      <b-col cols="8">
        <b-table-simple bordered caption-bottom fixed>
          <caption class="font-italic pt-1">
            Отчет
            {{
              form.data.flight_id
                ? `по рейсу ${getFlight(form.data.flight_id)}`
                : ' '
            }}
            {{
              form.data.date_from ? `с ${formatDate(form.data.date_from)}` : ' '
            }}
            {{
              form.data.date_to ? `по ${formatDate(form.data.date_to)}` : ''
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
          :form="form"
          name="Статистика"
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

export default {
  components: { CreateModifyForm },
  data() {
    return {
      form: {
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
      report: {},
    };
  },
  async mounted() {
    const options = await this.$axios.$get('/api/admin/flights?inline=true');
    this.form.inputs[0].options = options.map((option) => {
      return {
        value: option.flight_id,
        text: option.flight,
      };
    });
    this.report = await this.$axios.$get('/api/admin/reports/statistics');
  },
  methods: {
    async handleFetch() {
      let { flight_id, date_from, date_to } = this.form.data;

      flight_id = flight_id || '';
      date_from = date_from || '';
      date_to = date_to || '';

      let query = `flight_id=${flight_id}&date_from=${date_from}&date_to=${date_to}`;

      this.report = await this.$axios.$get(
        `/api/admin/reports/statistics?${query}`
      );
    },
    formatDate(dateStr) {
      return dateStr.split('-').reverse().join('.');
    },
    getFlight(flight_id) {
      return this.form.inputs[0].options.find(
        (option) => option.value === flight_id
      ).text;
    },
  },
};
</script>
