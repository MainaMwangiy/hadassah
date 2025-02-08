export interface ProjectsProps {
  name: string;
  location: string;
  size: string;
  projectstatus: string;
  projectplan: string;
  imagesurl: string;
  projectid: string;
  roleid: number;
  costprojectestimation: string;
  projectname: string;
  earnings: number;
  expenses: number;
}

export type ClientConfig = {
  dateFormat?: string;
  showGallery?: boolean;
  showTransactions?: boolean;
};

export interface Organization {
  clientorganizationid: number;
  name: string;
  appconfig: ClientConfig;
  createdon: string;
  createdbyuserid: number;
  modifiedon: string;
  modifiedbyuserid: number;
  isdeleted: number;
}

export type BlobItem = {
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

export type BlobsData = {
  hasMore: boolean;
  data: BlobItem[];
};

export type ListResponse = {
  success: boolean;
  data: BlobsData;
};

export interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

export interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  closeSidebar?: () => void;
}
