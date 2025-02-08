
export interface ProjectProps {
    name: string;
    location: string;
    size: string;
    projectplan: string;
    clientorganizationid: string;
    costprojectestimation: string;
    projectname: string;
    projectstatus: string;
    projectid: number;
    expenses: number;
    earnings: number;
}

export interface DataItem {
    id: string;
    name: string;
    amount: number;
    createdon: string;
    clientusername: string;
    roleid: number;
}
export interface HarvestDataItem {
    bags: string;
    createdon: string;
    clientusername: string;
    amountsold: string;
}

export type ImageUploadResponse = {
    url: {
        url: string;
    };
};

export interface SummaryProps {
    projectData: {
        title: string;
        addedBy: string;
        location: string;
        size: string;
        status: string;
        projectPlanIncluded: boolean;
        costprojectestimation: string;
        imagesurl: string;
        name: string;
        projectname: string;
    };
}
export interface ExpensesProjectProps {
    projectData?: {
        title: string;
        addedBy: string;
        location: string;
        size: string;
        status: string;
        projectPlanIncluded: boolean;
        costprojectestimation: string;
        id: string;
    };
    isProject?: boolean;
}

export interface ProjectDataProps {
    id: string | number;
    title?: string;
    addedBy?: string;
    location?: string;
    size?: string;
    status?: string;
    projectPlanIncluded?: boolean;
    costprojectestimation?: string;
}
