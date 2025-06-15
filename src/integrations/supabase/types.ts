export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_logs: {
        Row: {
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          method: string
          request_body: Json | null
          response_body: Json | null
          status_code: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          error_message?: string | null
          id?: string
          method: string
          request_body?: Json | null
          response_body?: Json | null
          status_code?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          method?: string
          request_body?: Json | null
          response_body?: Json | null
          status_code?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_user: boolean
          user_id: string | null
          website_data: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_user?: boolean
          user_id?: string | null
          website_data?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_user?: boolean
          user_id?: string | null
          website_data?: Json | null
        }
        Relationships: []
      }
      cicd_configs: {
        Row: {
          branch: string | null
          build_command: string | null
          created_at: string
          custom_domain: string | null
          deploy_command: string | null
          deployment_status: string | null
          deployment_url: string | null
          id: string
          last_deployed_at: string | null
          repository: string | null
          template_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          branch?: string | null
          build_command?: string | null
          created_at?: string
          custom_domain?: string | null
          deploy_command?: string | null
          deployment_status?: string | null
          deployment_url?: string | null
          id?: string
          last_deployed_at?: string | null
          repository?: string | null
          template_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          branch?: string | null
          build_command?: string | null
          created_at?: string
          custom_domain?: string | null
          deploy_command?: string | null
          deployment_status?: string | null
          deployment_url?: string | null
          id?: string
          last_deployed_at?: string | null
          repository?: string | null
          template_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tenant_analytics: {
        Row: {
          created_at: string | null
          element_class: string | null
          element_id: string | null
          element_text: string | null
          element_type: string | null
          event_data: Json | null
          event_type: string
          id: string
          page_path: string
          scroll_depth: number | null
          session_id: string
          tenant_id: string | null
          timestamp: string | null
          user_id: string | null
          website_id: string | null
        }
        Insert: {
          created_at?: string | null
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          element_type?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          page_path: string
          scroll_depth?: number | null
          session_id: string
          tenant_id?: string | null
          timestamp?: string | null
          user_id?: string | null
          website_id?: string | null
        }
        Update: {
          created_at?: string | null
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          element_type?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          page_path?: string
          scroll_depth?: number | null
          session_id?: string
          tenant_id?: string | null
          timestamp?: string | null
          user_id?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_analytics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_analytics_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "tenant_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_deployments: {
        Row: {
          branch: string | null
          build_command: string | null
          created_at: string | null
          deploy_command: string | null
          deployment_status: string | null
          deployment_url: string | null
          id: string
          last_deployed_at: string | null
          repository: string
          settings: Json | null
          tenant_id: string | null
          updated_at: string | null
          website_id: string | null
        }
        Insert: {
          branch?: string | null
          build_command?: string | null
          created_at?: string | null
          deploy_command?: string | null
          deployment_status?: string | null
          deployment_url?: string | null
          id?: string
          last_deployed_at?: string | null
          repository: string
          settings?: Json | null
          tenant_id?: string | null
          updated_at?: string | null
          website_id?: string | null
        }
        Update: {
          branch?: string | null
          build_command?: string | null
          created_at?: string | null
          deploy_command?: string | null
          deployment_status?: string | null
          deployment_url?: string | null
          id?: string
          last_deployed_at?: string | null
          repository?: string
          settings?: Json | null
          tenant_id?: string | null
          updated_at?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_deployments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_deployments_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "tenant_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_users: {
        Row: {
          created_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          role: Database["public"]["Enums"]["tenant_role"]
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["tenant_role"]
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["tenant_role"]
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_websites: {
        Row: {
          color_scheme: string | null
          created_at: string | null
          deployment_status: string | null
          deployment_url: string | null
          domain_name: string | null
          id: string
          last_deployed_at: string | null
          logo: string | null
          name: string
          secondary_color_scheme: string | null
          settings: Json | null
          template_id: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          color_scheme?: string | null
          created_at?: string | null
          deployment_status?: string | null
          deployment_url?: string | null
          domain_name?: string | null
          id?: string
          last_deployed_at?: string | null
          logo?: string | null
          name: string
          secondary_color_scheme?: string | null
          settings?: Json | null
          template_id: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          color_scheme?: string | null
          created_at?: string | null
          deployment_status?: string | null
          deployment_url?: string | null
          domain_name?: string | null
          id?: string
          last_deployed_at?: string | null
          logo?: string | null
          name?: string
          secondary_color_scheme?: string | null
          settings?: Json | null
          template_id?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_websites_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          name: string
          parent_tenant_id: string | null
          settings: Json | null
          slug: string
          status: string | null
          subscription_plan: string | null
          tenant_type: Database["public"]["Enums"]["tenant_type_enum"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          name: string
          parent_tenant_id?: string | null
          settings?: Json | null
          slug: string
          status?: string | null
          subscription_plan?: string | null
          tenant_type?: Database["public"]["Enums"]["tenant_type_enum"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          name?: string
          parent_tenant_id?: string | null
          settings?: Json | null
          slug?: string
          status?: string | null
          subscription_plan?: string | null
          tenant_type?: Database["public"]["Enums"]["tenant_type_enum"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_parent_tenant_id_fkey"
            columns: ["parent_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      website_analytics: {
        Row: {
          created_at: string
          element_class: string | null
          element_id: string | null
          element_text: string | null
          element_type: string | null
          event_data: Json | null
          event_type: string
          id: string
          page_path: string
          scroll_depth: number | null
          session_id: string
          template_id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          element_type?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          page_path: string
          scroll_depth?: number | null
          session_id: string
          template_id: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          element_type?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          page_path?: string
          scroll_depth?: number | null
          session_id?: string
          template_id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      website_configs: {
        Row: {
          color_scheme: string | null
          company_name: string
          created_at: string
          deployment_status: string | null
          deployment_url: string | null
          domain_name: string
          id: string
          last_deployed_at: string | null
          logo: string
          secondary_color_scheme: string | null
          template_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          color_scheme?: string | null
          company_name: string
          created_at?: string
          deployment_status?: string | null
          deployment_url?: string | null
          domain_name: string
          id?: string
          last_deployed_at?: string | null
          logo: string
          secondary_color_scheme?: string | null
          template_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          color_scheme?: string | null
          company_name?: string
          created_at?: string
          deployment_status?: string | null
          deployment_url?: string | null
          domain_name?: string
          id?: string
          last_deployed_at?: string | null
          logo?: string
          secondary_color_scheme?: string | null
          template_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      user_has_tenant_access: {
        Args: { tenant_uuid: string }
        Returns: boolean
      }
      user_has_tenant_role: {
        Args: {
          tenant_uuid: string
          required_role: Database["public"]["Enums"]["tenant_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      tenant_role: "owner" | "admin" | "editor" | "viewer"
      tenant_type_enum: "agency" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      tenant_role: ["owner", "admin", "editor", "viewer"],
      tenant_type_enum: ["agency", "client"],
    },
  },
} as const
