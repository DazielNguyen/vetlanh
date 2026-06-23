export interface TrustedContact {
  name: string;
  phone: string;
}

export interface SafetyPlan {
  id?: number;
  warning_signs: string[];
  coping_activities: string[];
  trusted_contacts: TrustedContact[];
  reasons_to_live: string | null;
  updated_at?: string;
}

export interface CrisisResource {
  type: string;
  name: string;
  phone?: string;
  description?: string;
}
