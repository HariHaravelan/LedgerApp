export type InvestmentType = 'fd' | 'rd' | 'stocks' | 'mutual_funds' | 'gold';
export type MainAccountType = 'bank' | 'wallet' | 'card' | 'loan' | 'investment';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  subType: AccountSubType;
  balance: number;
  institution: string;
  investmentType?: InvestmentType;
  lastSync?: string;
  notes?: string;
}

export interface AccountType {
  id: string;
  name: string;
}

export interface AccountSubType {
  id: string;
  name: string;
  type: AccountType;
}

// Account Types and Constants
export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

export interface CustomDropdownProps {
  label: string;
  selected: string;
  options: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  showIcons?: boolean;
  dropdownStyle?: object;
  containerStyle?: object;
}

export interface AccountFormData {
  typeId: string;
  subtypeId: string;
  name: string;
  balance: string;
  notes: string;
}
