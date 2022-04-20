<template>
  <b-container fluid>
    <b-row class="m-4">
      <b-col cols="8" class="table-wrapper">
        <my-table
          :items="items"
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
          @select="handleInputSelect"
          :name="tableName"
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
import CreateModifyForm from './CreateModifyForm.vue';
import MyTable from './MyTable.vue';
export default {
  components: { MyTable, CreateModifyForm },
  props: {
    fields: {
      type: Array,
      required: true,
    },
    requestScheme: {
      type: Array,
      required: true,
    },
    inputScheme: {
      type: Array,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    tableName: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      operationStatus: {
        status: null,
        message: '',
      },
      selectedRow: null,
      items: [],
      inputData: {},
    };
  },
  async mounted() {
    this.items = await this.$axios.$get(this.endpoint);
    this.fields.forEach(async (field) => {
      if (field.type === 'select' && !field.optionsFetchIncludeParam) {
        const data = await this.$axios.$get(
          `${field.optionsFetchEndpoint}?inline=true`
        );
        field.options = data.map((item) => {
          return {
            value: item[field.optionsScheme.value],
            text: item[field.optionsScheme.text],
          };
        });
      }
    });
  },
  methods: {
    handleRowSelect(row) {
      if (!row) {
        this.unselectRow();
        return;
      }

      this.selectedRow = { ...row };

      let inputData = {};
      this.inputScheme.forEach((item) => {
        inputData[item] = row[item];
      });
      this.inputData = inputData;
    },
    unselectRow() {
      this.inputData = {};
      this.$refs.table.unselect();
      this.selectedRow = null;
      this.resetParametrizedSelectFields();
    },
    async handleCreate(data) {
      try {
        const sendData = {};
        this.requestScheme.forEach((key) => {
          sendData[key] = data[key];
        });
        await this.$axios.$post(this.endpoint, sendData);
        this.items = await this.$axios.$get(this.endpoint);
        this.operationStatus = {
          status: 'success',
          message: `Запись успешно добавлена.`,
        };
      } catch (error) {
        this.handleError(error);
      } finally {
        this.unselectRow();
      }
    },
    async handleModify(data) {
      let oldData = {};
      this.requestScheme.forEach((item) => {
        oldData[item] = this.selectedRow[item];
      });

      let newData = {};
      this.requestScheme.forEach((item) => {
        newData[item] = data[item];
      });

      try {
        await this.$axios.$put(this.endpoint, {
          oldData,
          newData,
        });
        this.items = await this.$axios.$get(this.endpoint);
        this.operationStatus = {
          status: 'success',
          message: 'Запись успешно изменена.',
        };
      } catch (error) {
        this.handleError(error);
      } finally {
        this.unselectRow();
      }
    },
    handleError(error) {
      this.operationStatus.status = 'error';
      if (error.response?.status === 400) {
        if (error.response.data?.code === 'ER_DUP_ENTRY') {
          this.operationStatus.message =
            'Ошибка. Запись с указанным ключом уже существует.';
        }
      } else {
        this.operationStatus.message = 'Неизвестная ошибка.';
      }
    },
    async handleInputSelect(inp, id) {
      if (!inp || !id || inp?.optionsFetchIncludeParam) {
        return;
      }
      this.fields.forEach(async (field) => {
        if (
          field.type === 'select' &&
          field?.optionsFetchIncludeParam === inp?.id
        ) {
          this.inputData[field.id] = null;
          const options = await this.$axios.$get(
            `${field.optionsFetchEndpoint}/${id}`
          );
          field.options = options.map((item) => {
            return {
              value: item[field.optionsScheme.value],
              text: item[field.optionsScheme.text],
            };
          });
          this.addCurrentValuesToParameterizedSelectFields();
        }
      });
    },
    resetParametrizedSelectFields() {
      this.fields.forEach((field) => {
        if (field?.optionsFetchIncludeParam) {
          this.inputData[field.id] = null;
          field.options = [];
        }
      });
    },
    addCurrentValuesToParameterizedSelectFields() {
      if (!this.selectedRow) {
        return;
      }
      this.fields.forEach((field) => {
        if (field?.optionsFetchIncludeParam) {
          field.options.unshift(this.selectedRow[field.key]);
          this.inputData[field.id] = this.selectedRow[field.key];
        }
      });
    },
  },
};
</script>
