<template>
  <b-container fluid>
    <b-row class="m-4">
      <b-col cols="8" class="table-wrapper">
        <my-table :fields="report.fields" :items="report.items" unselectable />
      </b-col>
      <b-col>
        <create-modify-form
          :form="form"
          name="Билеты (архив)"
          noModifyButton
          noCreateButton
        >
          <p>Показаны билеты за предыдущие года.</p>
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
            key: 'departure_date',
            sortable: true,
            label: 'Дата',
          },
          {
            key: 'flight',
            id: 'flight_id',
            sortable: true,
            options: [],
            label: 'Рейс',
          },
          {
            key: 'seat_number',
            id: 'seat_number',
            sortable: true,
            options: [],
            label: 'Место',
          },
          {
            key: 'last_name',
            sortable: true,
            label: 'Фамилия',
          },
          {
            key: 'first_name',
            sortable: true,
            label: 'Имя',
          },
          {
            key: 'patr',
            sortable: true,
            label: 'Отчество',
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
    const items = await this.$axios.$get('/api/admin/tickets/archive');
    this.report.items = items;
  },
  methods: {
    async handleDelete() {
      await this.$axios.delete('/api/admin/tickets/archive');
      const items = await this.$axios.$get('/api/admin/tickets/archive');
      this.report.items = items;
    },
  },
};
</script>
