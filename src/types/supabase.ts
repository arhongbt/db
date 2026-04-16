export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      delagare: {
        Row: {
          created_at: string | null
          dodsbo_id: string
          email: string | null
          id: string
          is_delagare: boolean | null
          name: string
          personnummer: string | null
          phone: string | null
          relation: string | null
          share: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dodsbo_id: string
          email?: string | null
          id?: string
          is_delagare?: boolean | null
          name: string
          personnummer?: string | null
          phone?: string | null
          relation?: string | null
          share?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dodsbo_id?: string
          email?: string | null
          id?: string
          is_delagare?: boolean | null
          name?: string
          personnummer?: string | null
          phone?: string | null
          relation?: string | null
          share?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delagare_dodsbo_id_fkey"
            columns: ["dodsbo_id"]
            isOneToOne: false
            referencedRelation: "dodsbon"
            referencedColumns: ["id"]
          },
        ]
      }
      dodsbo_members: {
        Row: {
          created_at: string | null
          dodsbo_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dodsbo_id: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          dodsbo_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dodsbo_members_dodsbo_id_fkey"
            columns: ["dodsbo_id"]
            isOneToOne: false
            referencedRelation: "dodsbon"
            referencedColumns: ["id"]
          },
        ]
      }
      dodsbon: {
        Row: {
          created_at: string | null
          current_step: string | null
          death_date: string | null
          deceased_name: string
          deceased_personnummer: string | null
          id: string
          onboarding: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_step?: string | null
          death_date?: string | null
          deceased_name: string
          deceased_personnummer?: string | null
          id?: string
          onboarding?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_step?: string | null
          death_date?: string | null
          deceased_name?: string
          deceased_personnummer?: string | null
          id?: string
          onboarding?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dokument: {
        Row: {
          category: string
          created_at: string | null
          dodsbo_id: string
          file_name: string
          file_size: number
          id: string
          mime_type: string
          notes: string | null
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          dodsbo_id: string
          file_name: string
          file_size?: number
          id?: string
          mime_type?: string
          notes?: string | null
          storage_path: string
          uploaded_by: string
        }
        Update: {
          category?: string
          created_at?: string | null
          dodsbo_id?: string
          file_name?: string
          file_size?: number
          id?: string
          mime_type?: string
          notes?: string | null
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "dokument_dodsbo_id_fkey"
            columns: ["dodsbo_id"]
            isOneToOne: false
            referencedRelation: "dodsbon"
            referencedColumns: ["id"]
          },
        ]
      }
      forsakringar: {
        Row: {
          beneficiary: string | null
          company: string | null
          contacted: boolean | null
          created_at: string | null
          dodsbo_id: string
          estimated_value: number | null
          id: string
          notes: string | null
          policy_number: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          beneficiary?: string | null
          company?: string | null
          contacted?: boolean | null
          created_at?: string | null
          dodsbo_id: string
          estimated_value?: number | null
          id?: string
          notes?: string | null
          policy_number?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          beneficiary?: string | null
          company?: string | null
          contacted?: boolean | null
          created_at?: string | null
          dodsbo_id?: string
          estimated_value?: number | null
          id?: string
          notes?: string | null
          policy_number?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forsakringar_dodsbo_id_fkey"
            columns: ["dodsbo_id"]
            isOneToOne: false
            referencedRelation: "dodsbon"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string | null
          dodsbo_id: string
          id: string
          invited_by: string
          invited_email: string
          role: string
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string | null
          dodsbo_id: string
          id?: string
          invited_by: string
          invited_email: string
          role?: string
          status?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string | null
          dodsbo_id?: string
          id?: string
          invited_by?: string
          invited_email?: string
          role?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invites_dodsbo_id_fkey"
            columns: ["dodsbo_id"]
            isOneToOne: false
            referencedRelation: "dodsbon"
            referencedColumns: ["id"]
          },
        ]
      }
      kostnader: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string | null
          description: string
          dodsbo_id: string
          id: string
          paid_by: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string | null
          description: string
          dodsbo_id: string
          id?: string
          paid_by?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string | null
          description?: string
          dodsbo_id?: string
          id?: string
          paid_by?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kostnader_dodsbo_id_fkey"
            columns: ["dodsbo_id"]
            isOneToOne: false
            referencedRelation: "dodsbon"
            referencedColumns: ["id"]
          },
        ]
      }
      losore: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string | null
          dodsbo_id: string
          estimated_value: number | null
          id: string
          name: string
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string | null
          dodsbo_id: string
          estimated_value?: number | null
          id?: string
          name: string
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string | null
          dodsbo_id?: string
          estimated_value?: number | null
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "losore_dodsbo_id_fkey"
            columns: ["dodsbo_id"]
            isOneToOne: false
            referencedRelation: "dodsbon"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      samarbete_anteckningar: {
        Row: {
          author: string
          content: string
          created_at: string | null
          dodsbo_id: string
          id: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string | null
          dodsbo_id: string
          id?: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string | null
          dodsbo_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "samarbete_anteckningar_dodsbo_id_fkey"
            columns: ["dodsbo_id"]
            isOneToOne: false
            referencedRelation: "dodsbon"
            referencedColumns: ["id"]
          },
        ]
      }
      samarbete_beslut: {
        Row: {
          approvals: Json
          created_at: string | null
          dodsbo_id: string
          id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          approvals?: Json
          created_at?: string | null
          dodsbo_id: string
          id?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          approvals?: Json
          created_at?: string | null
          dodsbo_id?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "samarbete_beslut_dodsbo_id_fkey"
            columns: ["dodsbo_id"]
            isOneToOne: false
            referencedRelation: "dodsbon"
            referencedColumns: ["id"]
          },
        ]
      }
      skulder: {
        Row: {
          amount: number | null
          created_at: string | null
          creditor: string | null
          dodsbo_id: string
          id: string
          notes: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          creditor?: string | null
          dodsbo_id: string
          id?: string
          notes?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          creditor?: string | null
          dodsbo_id?: string
          id?: string
          notes?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skulder_dodsbo_id_fkey"
            columns: ["dodsbo_id"]
            isOneToOne: false
            referencedRelation: "dodsbon"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string | null
          deadline_date: string | null
          deadline_days: number | null
          description: string | null
          dodsbo_id: string
          external_url: string | null
          help_text: string | null
          id: string
          is_custom: boolean | null
          is_generated: boolean | null
          priority: string | null
          status: string | null
          step: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          completed_at?: string | null
          created_at?: string | null
          deadline_date?: string | null
          deadline_days?: number | null
          description?: string | null
          dodsbo_id: string
          external_url?: string | null
          help_text?: string | null
          id?: string
          is_custom?: boolean | null
          is_generated?: boolean | null
          priority?: string | null
          status?: string | null
          step: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string | null
          deadline_date?: string | null
          deadline_days?: number | null
          description?: string | null
          dodsbo_id?: string
          external_url?: string | null
          help_text?: string | null
          id?: string
          is_custom?: boolean | null
          is_generated?: boolean | null
          priority?: string | null
          status?: string | null
          step?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_dodsbo_id_fkey"
            columns: ["dodsbo_id"]
            isOneToOne: false
            referencedRelation: "dodsbon"
            referencedColumns: ["id"]
          },
        ]
      }
      tillgangar: {
        Row: {
          bank: string | null
          confirmed_value: number | null
          created_at: string | null
          description: string | null
          dodsbo_id: string
          estimated_value: number | null
          id: string
          notes: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          bank?: string | null
          confirmed_value?: number | null
          created_at?: string | null
          description?: string | null
          dodsbo_id: string
          estimated_value?: number | null
          id?: string
          notes?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          bank?: string | null
          confirmed_value?: number | null
          created_at?: string | null
          description?: string | null
          dodsbo_id?: string
          estimated_value?: number | null
          id?: string
          notes?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tillgangar_dodsbo_id_fkey"
            columns: ["dodsbo_id"]
            isOneToOne: false
            referencedRelation: "dodsbon"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
