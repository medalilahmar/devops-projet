export interface Department {
  idDepartment?: number;
  name: string;
  location: string;
  phone: string;
  head: string;
  students?: any[]; 
}

export interface DepartmentForm {
  name: string;
  location: string;
  phone: string;
  head: string;
}