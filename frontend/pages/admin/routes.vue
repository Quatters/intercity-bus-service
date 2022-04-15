<template>
  <b-container fluid>
    <b-row class="m-4">
      <b-col cols="7" class="table-wrapper">
        <my-table
          :items="routes"
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
      selectedRow: null,
      operationStatus: {
        status: null,
        message: '',
      },
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
      routes: [],
      inputData: {
        route_number: null,
        from: null,
        to: null,
        distance_km: null,
      },
    };
  },
  async mounted() {
    this.routes = await this.$axios.$get('/api/admin/routes');
    const cities = await this.$axios.$get('/api/admin/cities');
    const options = cities.map((city) => {
      return {
        value: city.city_id,
        text: city.city,
      };
    });
    this.fields[1].options = options;
    this.fields[2].options = options;
  },
  methods: {
    handleRowSelect(row) {
      if (!row) return;

      this.selectedRow = { ...row };

      this.inputData = {
        route_number: row.route_number,
        from: row.from,
        to: row.to,
        distance_km: row.distance_km,
      };
    },
    async handleCreate(data) {
      try {
        const response = await this.$axios.$post('/api/admin/routes', data);
        this.routes = await this.$axios.$get('/api/admin/routes');
        this.operationStatus = {
          status: 'success',
          message: `Маршрут "${response.route_number}" успешно добавлен.`,
        };
      } catch (error) {
        console.log(error.response);
        if (error.response?.status === 400) {
          this.operationStatus.status = 'error';
          if (error.response.data?.code === 'ER_DUP_ENTRY') {
            this.operationStatus.message =
              `Ошибка при добавлении записи. ` +
              `Справочник уже содержит маршрут "${data.route_number}".`;
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
      const oldData = {
        route_number: this.selectedRow.route_number,
        from: this.selectedRow.from,
        to: this.selectedRow.to,
        distance_km: this.selectedRow.distance_km,
      };
      const newData = {
        route_number: data.route_number,
        from: data.from,
        to: data.to,
        distance_km: data.distance_km,
      };

      console.log(oldData, newData);

      try {
        await this.$axios.$put('/api/admin/routes', {
          oldData,
          newData,
        });
        this.routes = await this.$axios.$get('/api/admin/routes');
        this.operationStatus = {
          status: 'success',
          message: `Маршрут "${oldData.route_number}" успешно изменен.`,
        };
      } catch (error) {
        let operationStatus = {
          status: 'error',
          message: '',
        };
        if (error.response?.status === 400) {
          if (error.response.data?.code === 'ER_DUP_ENTRY') {
            operationStatus.message =
              `Ошибка при добавлении записи. ` +
              `Справочник уже содержит маршрут "${newData.route_number}".`;
          }
        } else {
          operationStatus.message = 'Неизвестная ошибка.';
        }
        this.operationStatus = operationStatus;
      } finally {
        this.inputData = {};
        this.$refs.table.unselect();
        this.selectedRow = null;
      }
    },
  },
};
</script>
