export interface Customer {
    id_customer?: number;
    name_customer: string;
    document_number_customer: string;
    email_customer?: string;
    phone_customer?: string;
    address_customer?: string;
    state_customer?: number | boolean; 
    created_at?: string;
    updated_at?: string;
}