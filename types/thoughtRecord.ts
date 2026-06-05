export interface ThoughtRecord {
  id: string;
  situation: string;
  automatic_thought: string;
  emotion: string;
  evidence_for: string;
  evidence_against: string;
  created_at: string;
  updated_at: string;
}

export interface ThoughtRecordRequest {
  situation: string;
  automatic_thought: string;
  emotion: string;
  evidence_for: string;
  evidence_against: string;
}

export interface ThoughtRecordHint {
  field: string;
  hint: string;
}
