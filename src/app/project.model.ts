export interface Project {
  uniqueNumber: string;
  name: string;
  priority: string;
  manager: string;
  initiatorDepartment: string;
  contactPerson: string;
  startDate: string;
  endDate: string;
  status: string;
  description?: string;
  file?: File | string;
  statusUpdateDate?: string; 
  progress?: number;
  teamName: string;
  members: TeamMember[];
}

export interface TeamMember {
  personalId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
}
