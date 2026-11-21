// operators.js - Eligibility Rule Operators

export function applyOp(op, fieldValue, ruleValue) {
  // If user didn't answer / skipped this field
  if (fieldValue === undefined || fieldValue === null) {
    return null; // Unknown / skipped
  }

  switch (op) {
    case 'eq':
      return fieldValue === ruleValue;

    case 'neq':
      return fieldValue !== ruleValue;

    case 'in':
      if (Array.isArray(ruleValue)) {
        if (Array.isArray(fieldValue)) {
          return fieldValue.some(v => ruleValue.includes(v));
        }
        return ruleValue.includes(fieldValue);
      }
      return false;

    case 'nin':
      if (Array.isArray(ruleValue)) {
        if (Array.isArray(fieldValue)) {
          return !fieldValue.some(v => ruleValue.includes(v));
        }
        return !ruleValue.includes(fieldValue);
      }
      return true;

    case 'gte':
      return Number(fieldValue) >= Number(ruleValue);

    case 'lte':
      return Number(fieldValue) <= Number(ruleValue);

    case 'between':
      if (Array.isArray(ruleValue) && ruleValue.length === 2) {
        const num = Number(fieldValue);
        return num >= Number(ruleValue[0]) && num <= Number(ruleValue[1]);
      }
      return false;

    case 'exists':
      if (ruleValue) {
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0);
      }
      return fieldValue === undefined || fieldValue === null || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);

    case 'contains':
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(ruleValue);
      }
      return String(fieldValue).toLowerCase().includes(String(ruleValue).toLowerCase());

    default:
      return null;
  }
}
