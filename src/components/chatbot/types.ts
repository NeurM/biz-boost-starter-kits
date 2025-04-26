
export interface Message {
  content: string;
  isUser: boolean;
}

export interface WebsiteStatus {
  isCreated: boolean;
  template: string | null;
  path: string | null;
  companyName: string | null;
  domainName: string | null;
  logo: string | null;
  colorScheme: string | null;
  secondaryColorScheme: string | null;
}
