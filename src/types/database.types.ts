export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artistas: {
        Row: {
          id: string
          nombre: string
          slug: string
          biografia: string | null
          foto_portada: string | null
          puntuacion: number
          activo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          slug: string
          biografia?: string | null
          foto_portada?: string | null
          puntuacion?: number
          activo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          slug?: string
          biografia?: string | null
          foto_portada?: string | null
          puntuacion?: number
          activo?: boolean
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: string
          is_age_verified: boolean
          subscription_active: boolean
          subscription_expires_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          is_age_verified?: boolean
          subscription_active?: boolean
          subscription_expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          is_age_verified?: boolean
          subscription_active?: boolean
          subscription_expires_at?: string | null
          created_at?: string
        }
      }
    }
  }
}
