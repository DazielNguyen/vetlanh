export interface SafetyPlan {
  warning_signs?: string;
  coping_activities?: string;
  trusted_contacts?: string;
  reasons_to_live?: string;
}

export interface CrisisResource {
  type: string;
  name: string;
  phone?: string;
  description?: string;
}
