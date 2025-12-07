export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline?: string;
  category: string;
  experience: string;
  education: string;
  skills: string[];
  isRemote: boolean;
  isUrgent: boolean;
  isFeatured: boolean;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  logo?: string;
}

export interface SearchFilters {
  keyword?: string;
  location?: string;
  category?: string;
  type?: string;
  experience?: string;
  salary?: string;
  isRemote?: boolean;
  isUrgent?: boolean;
  isFeatured?: boolean;
}
