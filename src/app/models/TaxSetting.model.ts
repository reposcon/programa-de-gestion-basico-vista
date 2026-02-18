export interface TaxSetting {
  id_tax: number;
  tax_name: string;
  tax_rate: number;
  tax_type: 'IVA' | 'INC' | 'EXENTO' | 'EXCLUIDO';
}