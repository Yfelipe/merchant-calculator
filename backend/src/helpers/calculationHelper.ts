import { IndustryReturnValues } from '../models/merchantCost';

export const runInterpolation = (
  valueObject: IndustryReturnValues,
  knownValue: number
) => {
  try {
    const beginning = valueObject.previous_type_price;
    const end = valueObject.next_type_price;

    if (beginning && end) {
      return (
        ((end[1] - beginning[1]) / (end[0] - beginning[0])) *
          (knownValue - beginning[0]) +
        beginning[1]
      );
    }
  } catch (e) {
    return;
  }
};
