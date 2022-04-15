<template>
  <b-container fluid>
    <b-row class="m-4">
      <b-col cols="7" class="table-wrapper">
        <my-table
          :items="cities"
          :fields="fields"
          @rowSelect="handleRowSelect"
          ref="table"
        />
      </b-col>
      <b-col>
        <create-modify-form
          :form="{ inputs: fields, data: inputData }"
          :canModify="!!selectedRow"
          @create="handleCreate"
          @modify="handleModify"
        />
        <small
          :class="
            operationStatus.status === 'error' ? 'text-danger' : 'text-muted'
          "
          >{{ operationStatus.message }}</small
        >
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import CreateModifyForm from '../../components/CreateModifyForm.vue';
import MyTable from '../../components/MyTable.vue';
export default {
  components: { MyTable, CreateModifyForm },
  data() {
    return {
      operationStatus: {
        status: null,
        message: '',
      },
      selectedRow: null,
      fields: [
        {
          key: 'city',
          sortable: true,
          label: 'Населенный пункт',
          type: 'text',
        },
      ],
      cities: [],
      inputData: {
        city_id: null,
        city: null,
      },
    };
  },
  async mounted() {
    this.cities = await this.$axios.$get('/api/admin/cities');
  },
  methods: {
    handleRowSelect(row) {
      if (!row) return;

      this.selectedRow = { ...row };
      this.inputData = { ...row };
    },
    async handleCreate(data) {
      try {
        const response = await this.$axios.$post('/api/admin/cities', {
          city: data.city,
        });
        this.cities = await this.$axios.$get('/api/admin/cities');
        this.operationStatus = {
          status: 'success',
          message: `Населенный пункт "${response.city}" успешно добавлен.`,
        };
      } catch (error) {
        this.operationStatus.status = 'error';
        if (error.response?.status === 400) {
          if (error.response.data?.code === 'ER_DUP_ENTRY') {
            this.operationStatus.message =
              `Ошибка при добавлении записи. ` +
              `Справочник уже содержит населенный пункт "${data.city}".`;
          }
        } else {
          this.operationStatus.message = 'Неизвестная ошибка.';
        }
      } finally {
        this.inputData = {};
        this.$refs.table.unselect();
        this.selectedRow = null;
      }
    },
    async handleModify(data) {
      const oldData = { ...this.selectedRow };
      const newData = { ...data };

      console.log(oldData, newData);

      try {
        const response = await this.$axios.$put('/api/admin/cities', {
          oldData,
          newData,
        });
        this.cities = await this.$axios.$get('/api/admin/cities');
        this.operationStatus = {
          status: 'success',
          message: `Населенный пункт "${oldData.city}" успешно изменен на "${response.city}".`,
        };
      } catch (error) {
        this.operationStatus.status = 'error';
        if (error.response?.status === 400) {
          if (error.response.data?.code === 'ER_DUP_ENTRY') {
            this.operationStatus.message =
              `Ошибка при добавлении записи. ` +
              `Справочник уже содержит населенный пункт "${newData.city}".`;
          }
        } else {
          this.operationStatus.message = 'Неизвестная ошибка.';
        }
      } finally {
        this.inputData = {};
        this.$refs.table.unselect();
        this.selectedRow = null;
      }
    },
  },
};
</script>
