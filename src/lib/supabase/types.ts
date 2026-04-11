export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      dodsbon: {
        Row: {
          id: string;
          user_id: string;
          deceased_name: string;
          death_date: string;
          deceased_personnummer: string;
          onboarding: Json | null;
          current_step: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          deceased_name: string;
          death_date: string;
          deceased_personnummer: string;
          onboarding?: Json | null;
          current_step: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          deceased_name?: string;
          death_date?: string;
          deceased_personnummer?: string;
          onboarding?: Json | null;
          current_step?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      delagare: {
        Row: {
          id: string;
          dodsbo_id: string;
          name: string;
          personnummer: string;
          relation: string;
          email: string | null;
          phone: string | null;
          share: number | null;
          is_delagare: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dodsbo_id: string;
          name: string;
          personnummer: string;
          relation: string;
          email?: string | null;
          phone?: string | null;
          share?: number | null;
          is_delagare?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dodsbo_id?: string;
          name?: string;
          personnummer?: string;
          relation?: string;
          email?: string | null;
          phone?: string | null;
          share?: number | null;
          is_delagare?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tillgangar: {
        Row: {
          id: string;
          dodsbo_id: string;
          type: string;
          description: string;
          estimated_value: number | null;
          confirmed_value: number | null;
          bank: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dodsbo_id: string;
          type: string;
          description: string;
          estimated_value?: number | null;
          confirmed_value?: number | null;
          bank?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dodsbo_id?: string;
          type?: string;
          description?: string;
          estimated_value?: number | null;
          confirmed_value?: number | null;
          bank?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skulder: {
        Row: {
          id: string;
          dodsbo_id: string;
          type: string;
          creditor: string;
          amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dodsbo_id: string;
          type: string;
          creditor: string;
          amount: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dodsbo_id?: string;
          type?: string;
          creditor?: string;
          amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      forsakringar: {
        Row: {
          id: string;
          dodsbo_id: string;
          type: string;
          company: string;
          policy_number: string;
          beneficiary: string | null;
          estimated_value: number | null;
          contacted: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dodsbo_id: string;
          type: string;
          company: string;
          policy_number: string;
          beneficiary?: string | null;
          estimated_value?: number | null;
          contacted?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dodsbo_id?: string;
          type?: string;
          company?: string;
          policy_number?: string;
          beneficiary?: string | null;
          estimated_value?: number | null;
          contacted?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          dodsbo_id: string;
          step: string;
          category: string;
          title: string;
          description: string;
          status: string;
          priority: string;
          deadline_days: number | null;
          deadline_date: string | null;
          help_text: string | null;
          external_url: string | null;
          completed_at: string | null;
          is_generated: boolean;
          is_custom: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dodsbo_id: string;
          step: string;
          category: string;
          title: string;
          description: string;
          status: string;
          priority: string;
          deadline_days?: number | null;
          deadline_date?: string | null;
          help_text?: string | null;
          external_url?: string | null;
          completed_at?: string | null;
          is_generated?: boolean;
          is_custom?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dodsbo_id?: string;
          step?: string;
          category?: string;
          title?: string;
          description?: string;
          status?: string;
          priority?: string;
          deadline_days?: number | null;
          deadline_date?: string | null;
          help_text?: string | null;
          external_url?: string | null;
          completed_at?: string | null;
          is_generated?: boolean;
          is_custom?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      dokument: {
        Row: {
          id: string;
          dodsbo_id: string;
          category: string;
          file_name: string;
          file_size: number;
          mime_type: string;
          storage_path: string;
          notes: string | null;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          dodsbo_id: string;
          category: string;
          file_name: string;
          file_size: number;
          mime_type: string;
          storage_path: string;
          notes?: string | null;
          uploaded_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          dodsbo_id?: string;
          category?: string;
          file_name?: string;
          file_size?: number;
          mime_type?: string;
          storage_path?: string;
          notes?: string | null;
          uploaded_by?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
