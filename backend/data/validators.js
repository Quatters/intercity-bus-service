export function validate(field, ...validators) {
  if (!validators || validators.length === 0) {
    throw 'No validators provided.';
  }

  if (!field) {
  }

  const key = Object.keys(field)[0];
  let value = field[key];

  let errors = [];

  validators.forEach(validator => {
    const [validatedField, error] = validator(field[key]);
    value = validatedField;
    if (error) {
      errors.push(error);
    }
  });

  const validatedField = [{ [key]: value }];
  if (errors.length > 0) {
    validatedField.push(errors);
  }

  return validatedField;
}

export function validateForNumber(value) {
  const numValue = +value;
  if (isNaN(numValue)) {
    return [value, 'This field must be numeric.'];
  }
  return [numValue];
}

export function validateForLength(value, length) {
  if (value.length > length) {
    return [value, `This field can be ${length} characters max.`];
  }
  return [value];
}

export function validateForExactLength(value, length) {
  if (value.length !== length) {
    return [value, `This field must be exact ${length} characters max.`];
  }
  return [value];
}

export function validateForTime(value) {
  const timeWithoutSecondsRegex = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;
  const timeWithSecondsRegex =
    /^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/;

  let timeValue = value;
  if (timeWithoutSecondsRegex.test(value)) {
    timeValue = value + ':00';
  }
  if (!timeWithSecondsRegex.test(timeValue)) {
    return [value, 'This field must be in format HH:mm or HH:mm:ss.'];
  }
  return [timeValue];
}

export function validateForDate(value) {
  const dateRegex = /^([1-9]\d\d\d)-(0\d|1[0-2])-([0-2]\d|3[0-1])$/;
  if (!dateRegex.test(value)) {
    return [value, 'This field must be in format YYYY-MM-DD.'];
  }
  return [value];
}

export function validateRequired(value) {
  if (!value) {
    return [value, 'This field is required.'];
  }
  return [value];
}
