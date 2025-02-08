export interface UsersProps {
  name: string;
  email: string;
  location: string;
  status: string;
  role: string | number;
  clientuserid?: string | number | undefined;
  phoneNumber?: string;
  roleid?: number;
  clientorganizationid?: string;
}

export interface UserRowProps {
  name: string;
  email: string;
  location: string;
  status: string;
  role: string | number;
  onEdit: () => void;
  onDelete: () => void;
  clientuserid?: string | number | undefined;
}