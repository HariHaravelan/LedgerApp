
type InvestmentType = 'fd' | 'rd' | 'stocks' | 'mutual_funds' | 'gold';
type MainAccountType = 'bank' | 'wallet' | 'card' | 'loan' | 'investment';

interface Account {
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

interface AccountType {
  id: string;
  name: string;
}

interface AccountSubType {
  id: string;
  name: string;
  type: AccountType;
}

// Account Types and Constants
interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

interface CustomDropdownProps {
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

interface AccountFormData {
  typeId: string;
  subtypeId: string;
  name: string;
  balance: string;
  notes: string;
}