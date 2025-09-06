// @type: loại calendar DATE_TIME dd/mm/yyyy hh:mm

import { Constants } from "../constants/constant";
import { CALENDAR_TYPE } from "../models/type.model";

// @type: loại calendar DATE dd/mm/yyyy
export function getTimeToCompare(date: any, type: CALENDAR_TYPE = 'date'): string {
  if (Constants.NULL_VALUES.includes(date)) {
    return '0';
  }
  date = new Date(date);
  if (type === 'date-time') {
    return date.getFullYear().toString() + date.getMonth().toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0')
      + date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');
  }
  else {
    return date.getFullYear().toString() + date.getMonth().toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0');
  }
}
