export interface Transaction {
    transactionid: number;
    amount: number | string;
    clientuserid: number;
    notes: string;
    createdon: string;
    modifiedon: string;
    isdeleted: number;
    name: string;
    recipientuserid: number;
}