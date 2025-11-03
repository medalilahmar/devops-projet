export interface Student {
  active: unknown;
  idStudent?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  address: string;
  department?: any; 
}

export interface StudentForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  address: string;
  department?: any;
}