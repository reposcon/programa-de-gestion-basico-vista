export interface Customer {
  id_customer: number;
  name_customer: string;
  document_number: string; 
  address_customer?: string;
  phone_customer?: string;
  email_customer?: string;
  state_customer: number; 
}