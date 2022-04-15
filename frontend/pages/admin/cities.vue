<template>
  <generic-admin-page
    :fields="fields"
    :requestScheme="requestScheme"
    :inputScheme="inputScheme"
    endpoint="/api/admin/cities"
  />
</template>

<script>
import GenericAdminPage from '../../components/GenericAdminPage.vue';
export default {
  components: { GenericAdminPage },
  data() {
    return {
      fields: [
        {
          key: 'city',
          sortable: true,
          label: 'Населенный пункт',
          type: 'text',
        },
      ],
      requestScheme: ['city'],
      inputScheme: ['city', 'city_id'],
    };
  },
};
</script>

<style></style>
