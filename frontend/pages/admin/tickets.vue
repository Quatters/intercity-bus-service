<template>
  <generic-admin-page
    :fields="fields"
    :inputScheme="scheme"
    :requestScheme="scheme"
    endpoint="/api/admin/tickets"
    tableName="Билеты"
    ><small class="text-muted"
      >Показаны билеты за текущий год. Для просмотра остальных билетов перейдите
      в
      <NuxtLink to="/admin/archive/tickets" style="font: inherit"
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
      scheme: ['seat_number', 'flight_id', 'first_name', 'last_name', 'patr'],
      fields: [
        {
          key: 'departure_date',
          sortable: true,
          label: 'Дата',
          type: 'hidden',
        },
        {
          key: 'flight',
          id: 'flight_id',
          sortable: true,
          type: 'select',
          options: [],
          optionsFetchEndpoint: '/api/admin/flights',
          optionsScheme: { value: 'flight_id', text: 'flight' },
          label: 'Рейс',
        },
        {
          key: 'seat_number',
          id: 'seat_number',
          sortable: true,
          type: 'select',
          options: [],
          optionsFetchEndpoint: '/api/free-seats',
          optionsFetchIncludeParam: 'flight_id',
          optionsScheme: { value: 'seat_number', text: 'seat_number' },
          label: 'Место',
        },
        {
          key: 'last_name',
          sortable: true,
          type: 'text',
          label: 'Фамилия',
          maxLength: 50,
        },
        {
          key: 'first_name',
          sortable: true,
          type: 'text',
          label: 'Имя',
          maxLength: 50,
        },
        {
          key: 'patr',
          sortable: true,
          type: 'text',
          label: 'Отчество',
          maxLength: 50,
          optional: true,
        },
        {
          key: 'price',
          sortable: true,
          type: 'hidden',
          label: 'Цена билета',
        },
      ],
    };
  },
};
</script>
