<template>
  <generic-admin-page
    :fields="fields"
    :inputScheme="scheme"
    :requestScheme="scheme"
    endpoint="/api/admin/bus-models"
    tableName="Модели автобусов"
  />
</template>

<script>
import GenericAdminPage from '../../components/GenericAdminPage.vue';
export default {
  components: { GenericAdminPage },
  data() {
    return {
      scheme: ['model', 'seats_amount'],
      fields: [
        {
          key: 'model',
          type: 'text',
          sortable: true,
          label: 'Модель',
        },
        {
          key: 'seats_amount',
          type: 'number',
          sortable: true,
          label: 'Количество мест',
        },
      ],
    };
  },
};
</script>
