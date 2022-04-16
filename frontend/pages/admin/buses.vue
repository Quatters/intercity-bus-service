<template>
  <generic-admin-page
    :fields="fields"
    :inputScheme="inputScheme"
    :requestScheme="requestScheme"
    endpoint="/api/admin/buses"
    tableName="Автобусы"
  />
</template>

<script>
import GenericAdminPage from '../../components/GenericAdminPage.vue';
export default {
  components: { GenericAdminPage },
  data() {
    return {
      requestScheme: ['bus_number', 'model_id'],
      inputScheme: ['bus_number', 'model_id', 'seats_amount'],
      fields: [
        {
          key: 'bus_number',
          sortable: true,
          label: 'Номер',
          type: 'text',
        },
        {
          key: 'model',
          sortable: true,
          label: 'Модель',
          type: 'select',
          options: [],
          optionsFetchEndpoint: '/api/admin/bus-models',
          optionsScheme: { value: 'model_id', text: 'model' },
          id: 'model_id',
        },
        {
          key: 'seats_amount',
          sortable: true,
          label: 'Количество мест',
          type: 'hidden',
        },
      ],
    };
  },
};
</script>
