<template>
  <b-card>
    <div v-for="(inp, index) in form.inputs" :key="index">
      <b-row class="mb-2">
        <b-col v-if="inp.type !== 'hidden'" cols="5">
          {{ inp.label }}
          <span v-if="!inp.optional" class="text-danger">*</span>
        </b-col>

        <b-col>
          <b-form-input
            v-if="inp.type === 'text'"
            v-model="data[inp.key]"
            type="text"
          ></b-form-input>

          <b-form-input
            v-else-if="inp.type === 'number'"
            v-model="data[inp.key]"
            type="number"
          ></b-form-input>

          <b-form-select
            v-else-if="inp.type === 'select'"
            :options="inp.options"
            v-model="data[inp.id]"
          >
          </b-form-select>
        </b-col>
      </b-row>
    </div>
    <div class="mt-4">
      <b-button
        :disabled="!allRequiredInputsAreFilled"
        variant="success"
        @click.stop.prevent="handleCreate"
        >Создать</b-button
      >
      <b-button
        :disabled="!canModify || !allRequiredInputsAreFilled"
        variant="info"
        @click.stop.prevent="handleModify"
        >Изменить</b-button
      >
    </div>
  </b-card>
</template>

<script>
export default {
  props: {
    form: {
      inputs: [],
      data: {},
    },
    canModify: Boolean,
    name: String,
  },
  data() {
    return {
      data: {},
    };
  },
  updated() {
    this.data = this.form.data;
  },
  methods: {
    handleCreate() {
      this.$emit('create', this.data);
    },
    handleModify() {
      this.$emit('modify', this.data);
    },
  },
  computed: {
    allRequiredInputsAreFilled() {
      if (!this.data || Object.keys(this.data).length === 0) {
        return false;
      }
      for (const [key, value] of Object.entries(this.data)) {
        const inp = this.form.inputs.find(
          (inp) => inp.key === key || inp.id === key
        );
        if (!inp || inp.optional) {
          continue;
        }
        if (!value) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>
