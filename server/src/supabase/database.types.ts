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
      "card-selected": {
        Row: {
          id_card: number
          id_user: number
        }
        Insert: {
          id_card: number
          id_user?: number
        }
        Update: {
          id_card?: number
          id_user?: number
        }
        Relationships: [
          {
            foreignKeyName: "card-selected_id_card_fkey"
            columns: ["id_card"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card-selected_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          card_type: string
          code: string
          code_iv: string
          code_last4: string
          created_at: string
          expiration: string
          expiration_iv: string
          id: number
          name: string
          nickname: string | null
          transaction_type: string
        }
        Insert: {
          card_type: string
          code: string
          code_iv: string
          code_last4: string
          created_at?: string
          expiration: string
          expiration_iv: string
          id?: number
          name: string
          nickname?: string | null
          transaction_type: string
        }
        Update: {
          card_type?: string
          code?: string
          code_iv?: string
          code_last4?: string
          created_at?: string
          expiration?: string
          expiration_iv?: string
          id?: number
          name?: string
          nickname?: string | null
          transaction_type?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          department_id: number
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          department_id: number
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          department_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          codename: string
          created_at: string
          expiration_date: string | null
          id: number
          percentage: number
        }
        Insert: {
          codename?: string
          created_at?: string
          expiration_date?: string | null
          id?: number
          percentage?: number
        }
        Update: {
          codename?: string
          created_at?: string
          expiration_date?: string | null
          id?: number
          percentage?: number
        }
        Relationships: []
      }
      coupons_test: {
        Row: {
          codename: string
          created_at: string
          expiration_date: string | null
          id: number
          percentage: number
        }
        Insert: {
          codename?: string
          created_at?: string
          expiration_date?: string | null
          id?: number
          percentage?: number
        }
        Update: {
          codename?: string
          created_at?: string
          expiration_date?: string | null
          id?: number
          percentage?: number
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      "order-history": {
        Row: {
          created_at: string
          destination: string | null
          order_data: string | null
          order_id: number
          status: Database["public"]["Enums"]["OrderStatus"] | null
          total_value: number | null
        }
        Insert: {
          created_at?: string
          destination?: string | null
          order_data?: string | null
          order_id?: number
          status?: Database["public"]["Enums"]["OrderStatus"] | null
          total_value?: number | null
        }
        Update: {
          created_at?: string
          destination?: string | null
          order_data?: string | null
          order_id?: number
          status?: Database["public"]["Enums"]["OrderStatus"] | null
          total_value?: number | null
        }
        Relationships: []
      }
      "product-order-history": {
        Row: {
          amount: number | null
          created_at: string
          id: number
          order_id: number | null
          price_paid: number | null
          product_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          order_id?: number | null
          price_paid?: number | null
          product_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          order_id?: number | null
          price_paid?: number | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product-order-history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order-history"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "product-order-history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number | null
          created_at: string
          description: string | null
          discount: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          rating: number | null
          reviewCount: number | null
          stock_quantity: number
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          discount?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price?: number
          rating?: number | null
          reviewCount?: number | null
          stock_quantity?: number
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          discount?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          rating?: number | null
          reviewCount?: number | null
          stock_quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      "shopping-cart": {
        Row: {
          amount: number
          created_at: string | null
          id: string
        }
        Insert: {
          amount?: number
          created_at?: string | null
          id?: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping-cart_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          admin: boolean
          email: string | null
          id: number
          username: string
        }
        Insert: {
          admin?: boolean
          email?: string | null
          id?: number
          username: string
        }
        Update: {
          admin?: boolean
          email?: string | null
          id?: number
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      OrderStatus:
        | "pending"
        | "failed"
        | "returned"
        | "processing"
        | "canceled"
        | "shipped"
        | "delivered"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
