<template>
  <generic-admin-page
    :fields="fields"
    :inputScheme="inputScheme"
    :requestScheme="requestScheme"
    endpoint="/api/admin/flights"
    tableName="Рейсы"
    ><small class="text-muted"
      >Показаны рейсы за текущий год. Для просмотра остальных рейсов перейдите в
      <NuxtLink to="/admin/archive/flights" style="font: inherit"
        >архив</NuxtLink
      >.</small
    ></generic-admin-page
  >
</template>

<script>
import GenericAdminPage from '../../components/GenericAdminPage.vue';
export default {
  components: { GenericAdminPage },
  data() {
    return {
      requestScheme: ['bus_number', 'departure_date', 'schedule_id', 'price'],
      inputScheme: ['bus_number', 'departure_date', 'schedule_id', 'price'],
      fields: [
        {
          key: 'schedule',
          sortable: true,
          label: 'Расписание',
          type: 'select',
          options: [],
          optionsFetchEndpoint: '/api/admin/schedule',
          optionsScheme: { value: 'schedule_id', text: 'schedule' },
          id: 'schedule_id',
        },
        {
          key: 'departure_date',
          sortable: true,
          type: 'date',
          label: 'Отправление',
        },
        {
          key: 'bus_number',
          sortable: true,
          label: 'Номер автобуса',
          type: 'select',
          options: [],
          optionsFetchEndpoint: '/api/admin/buses',
          optionsScheme: { value: 'bus_number', text: 'bus_number' },
          id: 'bus_number',
        },
        {
          key: 'price',
          sortable: true,
          type: 'currency',
          maxLength: 8,
          label: 'Цена билета',
        },
      ],
    };
  },
};
</script>
