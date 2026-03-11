export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          state: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          state?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          state?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_versions: {
        Row: {
          id: string;
          project_id: string;
          owner_id: string;
          snapshot: Json;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          owner_id: string;
          snapshot: Json;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          owner_id?: string;
          snapshot?: Json;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_usage_logs: {
        Row: {
          id: string;
          owner_id: string;
          provider: string;
          kind: string;
          tokens_used: number;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          provider: string;
          kind: string;
          tokens_used?: number;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          provider?: string;
          kind?: string;
          tokens_used?: number;
          metadata?: Json | null;
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
}
