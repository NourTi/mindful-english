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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      bookmarked_lessons: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: []
      }
      content_reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          reporter_id: string
          request_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reporter_id: string
          request_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reporter_id?: string
          request_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_reports_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "partner_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          participant_one: string
          participant_two: string
          partner_request_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant_one: string
          participant_two: string
          partner_request_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_one?: string
          participant_two?: string
          partner_request_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_participant_one_fkey"
            columns: ["participant_one"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_two_fkey"
            columns: ["participant_two"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_partner_request_id_fkey"
            columns: ["partner_request_id"]
            isOneToOne: false
            referencedRelation: "partner_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      data_export_log: {
        Row: {
          admin_user_id: string
          created_at: string
          export_type: string
          fields_exported: string[]
          id: string
          record_count: number
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          export_type: string
          fields_exported?: string[]
          id?: string
          record_count: number
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          export_type?: string
          fields_exported?: string[]
          id?: string
          record_count?: number
        }
        Relationships: []
      }
      export_log_access: {
        Row: {
          access_type: string
          admin_user_id: string
          created_at: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          access_type?: string
          admin_user_id: string
          created_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          access_type?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      lesson_content: {
        Row: {
          content: string
          content_type: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          learning_style: string
          lesson_id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          content_type?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          learning_style?: string
          lesson_id: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          learning_style?: string
          lesson_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          chunk_index: number
          completed: boolean
          completed_at: string | null
          correct_answers: number
          error_streak: number
          id: string
          lesson_id: string
          reset_protocol_triggered: number
          score: number
          started_at: string
          total_answers: number
          user_id: string
        }
        Insert: {
          chunk_index?: number
          completed?: boolean
          completed_at?: string | null
          correct_answers?: number
          error_streak?: number
          id?: string
          lesson_id: string
          reset_protocol_triggered?: number
          score?: number
          started_at?: string
          total_answers?: number
          user_id: string
        }
        Update: {
          chunk_index?: number
          completed?: boolean
          completed_at?: string | null
          correct_answers?: number
          error_streak?: number
          id?: string
          lesson_id?: string
          reset_protocol_triggered?: number
          score?: number
          started_at?: string
          total_answers?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_access_log: {
        Row: {
          access_type: string
          conversation_id: string
          created_at: string
          id: string
          message_count: number | null
          user_id: string
        }
        Insert: {
          access_type: string
          conversation_id: string
          created_at?: string
          id?: string
          message_count?: number | null
          user_id: string
        }
        Update: {
          access_type?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_requests: {
        Row: {
          context: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          learning_style: string
          level: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          learning_style?: string
          level?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          learning_style?: string
          level?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          anxiety_level: number
          confidence_level: number
          created_at: string
          current_level: number
          date_of_birth: string | null
          email: string | null
          error_streak: number
          first_name: string | null
          id: string
          is_volunteer: boolean | null
          last_activity_date: string | null
          last_name: string | null
          learning_style: string
          marital_status: string | null
          name: string
          phone_number: string | null
          preferred_chunk_duration: number
          profile_completed: boolean | null
          semantic_context: string
          streak_days: number
          total_xp: number
          updated_at: string
          vocabulary_level: string
          whatsapp_number: string | null
        }
        Insert: {
          address?: string | null
          anxiety_level?: number
          confidence_level?: number
          created_at?: string
          current_level?: number
          date_of_birth?: string | null
          email?: string | null
          error_streak?: number
          first_name?: string | null
          id: string
          is_volunteer?: boolean | null
          last_activity_date?: string | null
          last_name?: string | null
          learning_style?: string
          marital_status?: string | null
          name?: string
          phone_number?: string | null
          preferred_chunk_duration?: number
          profile_completed?: boolean | null
          semantic_context?: string
          streak_days?: number
          total_xp?: number
          updated_at?: string
          vocabulary_level?: string
          whatsapp_number?: string | null
        }
        Update: {
          address?: string | null
          anxiety_level?: number
          confidence_level?: number
          created_at?: string
          current_level?: number
          date_of_birth?: string | null
          email?: string | null
          error_streak?: number
          first_name?: string | null
          id?: string
          is_volunteer?: boolean | null
          last_activity_date?: string | null
          last_name?: string | null
          learning_style?: string
          marital_status?: string | null
          name?: string
          phone_number?: string | null
          preferred_chunk_duration?: number
          profile_completed?: boolean | null
          semantic_context?: string
          streak_days?: number
          total_xp?: number
          updated_at?: string
          vocabulary_level?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          difficulty: number
          id: string
          is_active: boolean
          learning_style: string
          lesson_id: string
          options: Json
          question: string
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          difficulty?: number
          id?: string
          is_active?: boolean
          learning_style?: string
          lesson_id: string
          options?: Json
          question: string
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          difficulty?: number
          id?: string
          is_active?: boolean
          learning_style?: string
          lesson_id?: string
          options?: Json
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      scenario_choices: {
        Row: {
          choice_text: string
          created_at: string
          dialogue_id: string
          feedback: string
          id: string
          is_correct: boolean
        }
        Insert: {
          choice_text: string
          created_at?: string
          dialogue_id: string
          feedback: string
          id?: string
          is_correct?: boolean
        }
        Update: {
          choice_text?: string
          created_at?: string
          dialogue_id?: string
          feedback?: string
          id?: string
          is_correct?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "scenario_choices_dialogue_id_fkey"
            columns: ["dialogue_id"]
            isOneToOne: false
            referencedRelation: "scenario_dialogues"
            referencedColumns: ["id"]
          },
        ]
      }
      scenario_dialogues: {
        Row: {
          created_at: string
          display_order: number
          id: string
          message: string
          scenario_id: string
          speaker: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          message: string
          scenario_id: string
          speaker: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          message?: string
          scenario_id?: string
          speaker?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenario_dialogues_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scenario_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          correct_answers: number
          current_step: number
          emotion_score: number
          id: string
          scenario_id: string
          selected_choices: number[]
          started_at: string
          total_answers: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          correct_answers?: number
          current_step?: number
          emotion_score?: number
          id?: string
          scenario_id: string
          selected_choices?: number[]
          started_at?: string
          total_answers?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          correct_answers?: number
          current_step?: number
          emotion_score?: number
          id?: string
          scenario_id?: string
          selected_choices?: number[]
          started_at?: string
          total_answers?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenario_progress_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scenario_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scenarios: {
        Row: {
          context_type: string
          created_at: string
          description: string | null
          dialogue_data: Json | null
          difficulty_level: number | null
          environment_slug: string | null
          estimated_duration_minutes: number | null
          id: string
          is_active: boolean
          neuro_emotional_state: string | null
          title: string
          updated_at: string
          visual_context: Json | null
        }
        Insert: {
          context_type?: string
          created_at?: string
          description?: string | null
          dialogue_data?: Json | null
          difficulty_level?: number | null
          environment_slug?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_active?: boolean
          neuro_emotional_state?: string | null
          title: string
          updated_at?: string
          visual_context?: Json | null
        }
        Update: {
          context_type?: string
          created_at?: string
          description?: string | null
          dialogue_data?: Json | null
          difficulty_level?: number | null
          environment_slug?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_active?: boolean
          neuro_emotional_state?: string | null
          title?: string
          updated_at?: string
          visual_context?: Json | null
        }
        Relationships: []
      }
      vocabulary_learned: {
        Row: {
          context: string | null
          created_at: string
          id: string
          last_reviewed_at: string
          mastery_level: number
          times_reviewed: number
          user_id: string
          word: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          id?: string
          last_reviewed_at?: string
          mastery_level?: number
          times_reviewed?: number
          user_id: string
          word: string
        }
        Update: {
          context?: string | null
          created_at?: string
          id?: string
          last_reviewed_at?: string
          mastery_level?: number
          times_reviewed?: number
          user_id?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_learned_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
