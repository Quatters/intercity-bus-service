<template>
  <generic-admin-page
    :fields="fields"
    :inputScheme="requestScheme"
    :requestScheme="requestScheme"
    endpoint="/api/admin/routes"
  />
</template>

<script>
import GenericAdminPage from '../../components/GenericAdminPage.vue';
export default {
  components: { GenericAdminPage },
  data() {
    return {
      requestScheme: ['route_number', 'from', 'to', 'distance_km'],
      fields: [
        {
          key: 'route_number',
          sortable: true,
          label: 'Номер маршрута',
          type: 'text',
        },
        {
          key: 'from_city',
          sortable: true,
          label: 'Откуда',
          type: 'select',
          options: [],
          optionsFetchEndpoint: '/api/admin/cities',
          optionsScheme: { value: 'city_id', text: 'city' },
          id: 'from',
          optional: true,
        },
        {
          key: 'to_city',
          value: {},
          sortable: true,
          label: 'Куда',
          type: 'select',
          options: [],
          optionsFetchEndpoint: '/api/admin/cities',
          optionsScheme: { value: 'city_id', text: 'city' },
          id: 'to',
        },
        {
          key: 'distance_km',
          sortable: true,
          label: 'Расстояние, км',
          type: 'number',
          optional: true,
        },
      ],
    };
  },
};
</script>
