import utils from "../../utils";
import { ModuleConfig } from "../products/types";

const user = localStorage.getItem('clientuser') || "{}";
const clientuser = JSON.parse(user);
const clientuserid = clientuser?.clientuserid;
const clientusername = clientuser?.name || '';

export const productsConfig: ModuleConfig = {
  keyField: 'Product',
  title: "Products",
  isImport: true,
  isExport: true,
  showTitle: true,
  addSearch: true,
  hideActionMenu: false,
  updateLocal: true,
  customSale: true,
  apiEndpoints: {
    list: {
      url: `${utils.baseUrl}/api/products/list`
    },
    create: {
      url: `${utils.baseUrl}/api/products/create`,
      payload: {
        createdbyuserid: clientuserid,
        modifiedbyuserid: clientuserid,
        clientuserid: clientuserid || "",
        clientusername: clientuser?.name || ""
      }
    },
    update: {
      url: `${utils.baseUrl}/api/products/update`,
      payload: {
        createdbyuserid: clientuserid,
        modifiedbyuserid: clientuserid,
        clientusername: clientusername
      }
    },
    delete: {
      url: `${utils.baseUrl}/api/products/delete`
    },
    total: {
      url: `${utils.baseUrl}/api/products/total`
    }
  },
  fields: [
    { name: "name", type: "text", label: "Name", required: true, width: "150px" },
    { name: "price", type: "number", label: "Cost Price", required: true, width: "120px" },
    { name: "description", type: "textarea", label: "Description", required: false, width: "300px" },
    { name: "size", type: "text", label: "Size", required: false, width: "100px" },
    { name: "quantity", type: "number", label: "Stock Quantity", required: true, width: "150px" },
    { name: "createdon", type: "date", label: "Added On", form: false, width: "150px" },
    { name: "modifiedon", type: "date", label: "Modified On", form: false, width: "150px" }
  ]
};
