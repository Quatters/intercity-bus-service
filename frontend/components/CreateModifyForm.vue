<template>
  <b-card>
    <template v-if="name" #header>
      <h6 class="mb-0">{{ name }}</h6>
    </template>
    <div v-for="(inp, index) in form.inputs" :key="index">
      <div class="mb-3" v-if="inp.type !== 'hidden'">
        <div class="mb-1">
          {{ inp.label }}
          <span v-if="!inp.optional" class="text-danger">*</span>
        </div>

        <b-form-input
          v-if="inp.type === 'text'"
          v-model="data[inp.key]"
          type="text"
          @keypress="
            (event) => {
              if (inp.maxLength) validateForLength(event, inp.maxLength);
            }
          "
        ></b-form-input>

        <b-form-input
          v-else-if="inp.type === 'number'"
          v-model="data[inp.key]"
          type="number"
          @keypress="
            (event) => {
              if (inp.maxLength) validateForLength(event, inp.maxLength);
              validateForNumber(event);
            }
          "
        ></b-form-input>

        <b-form-input
          v-else-if="inp.type === 'currency'"
          v-model="data[inp.key]"
          type="text"
          :formatter="currencyFormatter"
          @keypress="
            (event) => {
              if (inp.maxLength) validateForLength(event, inp.maxLength);
              validateForNumber(event);
            }
          "
        ></b-form-input>

        <b-form-select
          v-else-if="inp.type === 'select'"
          :options="[{ value: null, text: 'Не выбрано' }, ...inp.options]"
          @input="
            (value) => {
              data[inp.id] = value;
              $emit('select', inp, data[inp.id]);
            }
          "
          :value="data[inp.id]"
        >
        </b-form-select>

        <b-form-timepicker
          v-else-if="inp.type === 'time'"
          reset-button
          label-reset-button="Очистить"
          label-close-button="Закрыть"
          locale="ru"
          v-model="data[inp.key]"
          placeholder="--:--"
        ></b-form-timepicker>

        <b-form-datepicker
          v-else-if="inp.type === 'date'"
          reset-button
          label-reset-button="Очистить"
          label-close-button="Закрыть"
          locale="ru"
          v-model="data[inp.key]"
          placeholder="Выберите дату..."
          start-weekday="1"
        >
        </b-form-datepicker>
      </div>
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
    this.form.inputs.forEach((inp) => {
      if (inp.type === 'select' && !this.data[inp.id]) {
        this.$set(this.data, inp.id, null);
      }
    });
  },
  methods: {
    handleCreate() {
      this.$emit('create', this.data);
    },
    handleModify() {
      this.$emit('modify', this.data);
    },
    validateForLength(event, length) {
      if (event.target.value.length >= length) {
        event.preventDefault();
      }
    },
    validateForNumber(event, additionalChars = []) {
      const keysAllowed = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        ...additionalChars,
      ];
      const keyPressed = event.key;

      if (!keysAllowed.includes(keyPressed)) {
        event.preventDefault();
      }
    },
    currencyFormatter(value) {
      const p = value.replace('.', '');
      const l = p.substring(-2, p.length - 2);
      const r = p.substring(p.length - 2, p.length);
      return l + '.' + r;
    },
  },
  computed: {
    allRequiredInputsAreFilled() {
      if (!this.data || Object.keys(this.data).length === 0) {
        return false;
      }
      for (const inp of this.form.inputs) {
        if (inp.optional || inp.type === 'hidden') {
          continue;
        }
        const dataByKey = this.data[inp.key];
        const dataByID = this.data[inp.id];

        if (!dataByKey && !dataByID) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>
