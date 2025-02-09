import { JSX } from "react";

export interface Colors {
  pending: string;
  paid: string;
}

export interface FieldConfig {
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'string' | 'password' | 'date' | 'json' | 'image' | 'file' | 'autocomplete';
  label: string;
  options?: string[];
  required?: boolean;
  width?: string;
  colors?: Colors;
  form?: boolean;
  render?: (value: any, item?: any) => JSX.Element | string;
  onEvent?: (item: any) => void;
  getCustomClass?: (item: any) => string;
  convertValue?: (value: any) => string;
  passKeyField?: boolean;
  hide?: boolean;
  isRole?: boolean;
  isSuperAdmin?: boolean;
  listType?: string;
}

export interface ApiEndpointConfig {
  url: string;
  payload?: Record<string, any>;
}

export interface ModuleConfig {
  keyField: string;
  title: string;
  apiEndpoints: {
    list?: ApiEndpointConfig;
    create: ApiEndpointConfig;
    update: ApiEndpointConfig;
    delete: ApiEndpointConfig;
    total?: ApiEndpointConfig;
  };
  fields: FieldConfig[];
  showTotal?: boolean;
  isImport: boolean;
  isExport: boolean;
  showTitle: boolean;
  addSearch?: boolean;
  hideActionMenu?: boolean;
  customKeyField?: string;
  skipKeyField?: boolean;
  updateLocal?: boolean;
  limit?: boolean;
  customSale?: boolean;
  customKey?: string;
}

export interface DataItem {
  id: string;
  name: string;
  amount: number;
  createdon: string;
  clientusername: string;
  roleid: number;
}