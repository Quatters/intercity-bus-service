<template>
  <generic-admin-page
    :fields="fields"
    :inputScheme="scheme"
    :requestScheme="scheme"
    endpoint="/api/admin/schedule"
    tableName="Расписание"
  />
</template>

<script>
import GenericAdminPage from '../../components/GenericAdminPage.vue';
export default {
  components: { GenericAdminPage },
  data() {
    return {
      scheme: ['route_number', 'departure_time', 'arrival_time'],
      // inputScheme: [],
      fields: [
        {
          key: 'route_number',
          sortable: true,
          type: 'select',
          options: [],
          optionsFetchEndpoint: '/api/admin/routes',
          optionsScheme: { value: 'route_number', text: 'route_number' },
          id: 'route_number',
          label: 'Номер маршрута',
        },
        {
          key: 'departure_time',
          type: 'time',
          sortable: 'true',
          label: 'Время отправления',
        },
        {
          key: 'arrival_time',
          type: 'time',
          sortable: true,
          label: 'Время прибытия',
          optional: true,
        },
        {
          key: 'from_city',
          sortable: true,
          type: 'hidden',
          label: 'Откуда',
        },
        {
          key: 'to_city',
          sortable: true,
          type: 'hidden',
          label: 'Куда',
        },
      ],
    };
  },
};
</script>
