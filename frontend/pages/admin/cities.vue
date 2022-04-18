<template>
  <generic-admin-page
    :fields="fields"
    :requestScheme="scheme"
    :inputScheme="scheme"
    endpoint="/api/admin/cities"
    tableName="Населенные пункты"
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
          maxLength: 100,
        },
      ],
      scheme: ['city'],
    };
  },
};
</script>

<style></style>
