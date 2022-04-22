<template>
  <b-container fluid>
    <b-row class="m-4">
      <b-col cols="8" class="table-wrapper">
        <my-table :fields="report.fields" :items="report.items" unselectable />
      </b-col>
      <b-col>
        <create-modify-form
          :form="form"
          name="Рейсы (архив)"
          noModifyButton
          noCreateButton
        >
          <p>Показаны рейсы за предыдущие года.</p>
          <p>
            <strong>Внимание:</strong> при очистке этого архива будет также
            очищен архив билетов!
          </p>
          <b-button
            @click="handleDelete"
            :disabled="report.items.length === 0"
            variant="danger"
            >Очистить архив</b-button
          >
        </create-modify-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import CreateModifyForm from '../../../components/CreateModifyForm.vue';
import MyTable from '../../../components/MyTable.vue';
export default {
  components: { MyTable, CreateModifyForm },
  data() {
    return {
      form: {
        inputs: [],
        data: {},
      },
      report: {
        fields: [
          {
            key: 'schedule',
            sortable: true,
            label: 'Расписание',
            options: [],
            id: 'schedule_id',
          },
          {
            key: 'departure_date',
            sortable: true,
            label: 'Отправление',
          },
          {
            key: 'bus_number',
            sortable: true,
            label: 'Номер автобуса',
            options: [],
            id: 'bus_number',
          },
          {
            key: 'price',
            sortable: true,
            label: 'Цена билета',
          },
        ],
        items: [],
      },
    };
  },
  async mounted() {
    const items = await this.$axios.$get('/api/admin/flights/archive');
    this.report.items = items;
  },
  methods: {
    async handleDelete() {
      await this.$axios.delete('/api/admin/flights/archive');
      const items = await this.$axios.$get('/api/admin/flights/archive');
      this.report.items = items;
    },
  },
};
</script>
