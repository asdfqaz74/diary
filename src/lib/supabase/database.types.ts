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
      entries: {
        Row: {
          body: string;
          created_at: string;
          entry_date: string;
          id: string;
          is_favorite: boolean;
          location_name: string | null;
          mood_code: string;
          mood_label_snapshot: string;
          mood_score_snapshot: number;
          paper_tint_code: string;
          paper_tint_label_snapshot: string;
          published_at: string;
          title: string;
          updated_at: string;
          user_id: string;
          weather_code: string;
          weather_label_snapshot: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          entry_date: string;
          id?: string;
          is_favorite?: boolean;
          location_name?: string | null;
          mood_code: string;
          mood_label_snapshot: string;
          mood_score_snapshot: number;
          paper_tint_code: string;
          paper_tint_label_snapshot: string;
          published_at?: string;
          title: string;
          updated_at?: string;
          user_id: string;
          weather_code: string;
          weather_label_snapshot: string;
        };
        Update: Partial<Database["public"]["Tables"]["entries"]["Insert"]>;
        Relationships: [];
      };
      entry_drafts: {
        Row: {
          body: string;
          created_at: string;
          entry_date: string;
          id: string;
          is_active: boolean;
          last_autosaved_at: string;
          location_name: string | null;
          mood_code: string;
          mood_label_snapshot: string;
          mood_score_snapshot: number;
          paper_tint_code: string;
          paper_tint_label_snapshot: string;
          published_entry_id: string | null;
          title: string;
          updated_at: string;
          user_id: string;
          weather_code: string;
          weather_label_snapshot: string;
        };
        Insert: {
          body?: string;
          created_at?: string;
          entry_date: string;
          id?: string;
          is_active?: boolean;
          last_autosaved_at?: string;
          location_name?: string | null;
          mood_code: string;
          mood_label_snapshot: string;
          mood_score_snapshot: number;
          paper_tint_code: string;
          paper_tint_label_snapshot: string;
          published_entry_id?: string | null;
          title?: string;
          updated_at?: string;
          user_id: string;
          weather_code: string;
          weather_label_snapshot: string;
        };
        Update: Partial<Database["public"]["Tables"]["entry_drafts"]["Insert"]>;
        Relationships: [];
      };
      entry_tags: {
        Row: {
          created_at: string;
          entry_id: string;
          tag_id: string;
        };
        Insert: {
          created_at?: string;
          entry_id: string;
          tag_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["entry_tags"]["Insert"]>;
        Relationships: [];
      };
      mood_catalog: {
        Row: {
          code: string;
          display_order: number;
          emoji: string;
          is_active: boolean;
          label: string;
          trend_score: number;
        };
        Insert: {
          code: string;
          display_order: number;
          emoji: string;
          is_active?: boolean;
          label: string;
          trend_score: number;
        };
        Update: Partial<Database["public"]["Tables"]["mood_catalog"]["Insert"]>;
        Relationships: [];
      };
      paper_tint_catalog: {
        Row: {
          code: string;
          display_order: number;
          is_active: boolean;
          label: string;
          paper_surface_token: string;
          swatch_token: string;
        };
        Insert: {
          code: string;
          display_order: number;
          is_active?: boolean;
          label: string;
          paper_surface_token: string;
          swatch_token: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["paper_tint_catalog"]["Insert"]
        >;
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string;
          id: string;
          locale: string;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name: string;
          id: string;
          locale?: string;
          timezone?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      tags: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          slug: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["tags"]["Insert"]>;
        Relationships: [];
      };
      weather_catalog: {
        Row: {
          code: string;
          display_order: number;
          icon: string;
          is_active: boolean;
          label: string;
        };
        Insert: {
          code: string;
          display_order: number;
          icon: string;
          is_active?: boolean;
          label: string;
        };
        Update: Partial<Database["public"]["Tables"]["weather_catalog"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      calculate_current_streak: {
        Args: {
          p_as_of?: string;
          p_user_id: string;
        };
        Returns: number;
      };
      publish_entry_from_draft: {
        Args: {
          p_draft_id: string;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
