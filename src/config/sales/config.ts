import utils from "../../utils";
import { ModuleConfig } from "../sales/types";

const user = localStorage.getItem('clientuser') || "{}";
const clientuser = JSON.parse(user);
const clientuserid = clientuser?.clientuserid;
const clientusername = clientuser?.name || '';

export const salesConfig: ModuleConfig = {
  keyField: 'Sale',
  title: "Sales",
  isImport: false,
  isExport: true,
  showTitle: true,
  addSearch: true,
  hideActionMenu: false,
  customSale: true,
  customKey: 'product',
  customKeyField: 'sales',
  apiEndpoints: {
    list: {
      url: `${utils.baseUrl}/api/sales/list`
    },
    create: {
      url: `${utils.baseUrl}/api/sales/create`,
      payload: {
        createdbyuserid: clientuserid,
        modifiedbyuserid: clientuserid,
        clientuserid: clientuserid || "",
        clientusername: clientuser?.name || ""
      }
    },
    update: {
      url: `${utils.baseUrl}/api/sales/update`,
      payload: {
        createdbyuserid: clientuserid,
        modifiedbyuserid: clientuserid,
        clientusername: clientusername
      }
    },
    delete: {
      url: `${utils.baseUrl}/api/sales/delete`
    },
    total: {
      url: `${utils.baseUrl}/api/sales/total`
    }
  },
  fields: [
    { name: "name", type: "autocomplete", label: "Product", required: true, width: "150px", listType: "product" },
    { name: "quantity", type: "number", label: "Quantity", required: true, width: "100px" },
    { name: "sellingprice", type: "number", label: "Selling Price", required: true, width: "150px" },
    { name: "totalprice", type: "number", label: "Total Price", required: true, width: "100px" },
    { name: "profit", type: "number", label: "Profit", form: false, width: "100px" },
    { name: "createdon", type: "date", label: "Sale Date", form: false, width: "150px" },
    { name: "modifiedon", type: "date", label: "Last Modified", form: false, width: "150px" }
  ]
};
