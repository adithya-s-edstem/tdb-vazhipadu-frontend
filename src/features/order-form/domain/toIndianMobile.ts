const SEPARATORS = /[\s-]/g;
const INDIAN_MOBILE = /^(?:\+91)?([6-9]\d{9})$/;

export function toIndianMobile(phone: string): string | undefined {
  return INDIAN_MOBILE.exec(phone.replace(SEPARATORS, ""))?.[1];
}
