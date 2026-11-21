export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type AppRole =
  | 'supporter'
  | 'coach'
  | 'assistant_coach'
  | 'team_manager'
  | 'club_administrator'
  | 'match_official'
  | 'league_administrator'
  | 'super_administrator'

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
type ClubStatus = 'active' | 'inactive'
type StaffStatus = 'active' | 'inactive'
type RegistrationStatus = 'pending' | 'verified' | 'rejected'
type CompetitionStatus = 'draft' | 'active' | 'completed' | 'archived'
type FixtureStatus = 'scheduled' | 'live' | 'completed' | 'verified' | 'postponed' | 'cancelled'
type LineupStatus = 'draft' | 'submitted' | 'confirmed'
type EventType =
  | 'goal'
  | 'own_goal'
  | 'penalty_goal'
  | 'penalty_missed'
  | 'yellow_card'
  | 'red_card'
  | 'substitution'
  | 'injury'
  | 'corner'
  | 'foul'
  | 'var_review'
  | 'period_start'
  | 'period_end'
  | 'match_end'
type EventVerifyStatus = 'pending' | 'verified' | 'disputed'
type TransferStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
type NotificationType = 'invitation' | 'approval' | 'fixture' | 'match_event' | 'transfer' | 'system'
type AuditAction = 'insert' | 'update' | 'delete' | 'approve' | 'reject' | 'invite' | 'accept' | 'verify' | 'sign_in' | 'sign_out'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          avatar_url: string | null
          approval_status: ApprovalStatus
          approved_by: string | null
          approved_at: string | null
          is_active: boolean
          last_sign_in_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          approval_status?: ApprovalStatus
          approved_by?: string | null
          approved_at?: string | null
          is_active?: boolean
          last_sign_in_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          approval_status?: ApprovalStatus
          approved_by?: string | null
          approved_at?: string | null
          is_active?: boolean
          last_sign_in_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: AppRole
          club_id: string | null
          competition_id: string | null
          season_id: string | null
          assigned_by: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: AppRole
          club_id?: string | null
          competition_id?: string | null
          season_id?: string | null
          assigned_by?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: AppRole
          club_id?: string | null
          competition_id?: string | null
          season_id?: string | null
          assigned_by?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      clubs: {
        Row: {
          id: string
          name: string
          short_name: string
          slug: string
          primary_color: string | null
          secondary_color: string | null
          logo_url: string | null
          stadium: string | null
          country: string
          district: string | null
          founded_year: number | null
          status: ClubStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          short_name: string
          slug: string
          primary_color?: string | null
          secondary_color?: string | null
          logo_url?: string | null
          stadium?: string | null
          country?: string
          district?: string | null
          founded_year?: number | null
          status?: ClubStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_name?: string
          slug?: string
          primary_color?: string | null
          secondary_color?: string | null
          logo_url?: string | null
          stadium?: string | null
          country?: string
          district?: string | null
          founded_year?: number | null
          status?: ClubStatus
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      club_staff: {
        Row: {
          id: string
          club_id: string
          user_id: string
          position: string
          department: string | null
          status: StaffStatus
          started_at: string
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          user_id: string
          position: string
          department?: string | null
          status?: StaffStatus
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          user_id?: string
          position?: string
          department?: string | null
          status?: StaffStatus
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          id: string
          first_name: string
          last_name: string
          display_name: string
          common_name: string | null
          date_of_birth: string
          nationality: string
          position: string
          shirt_number: number | null
          preferred_foot: string | null
          height_cm: number | null
          photo_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          display_name?: string
          common_name?: string | null
          date_of_birth: string
          nationality?: string
          position: string
          shirt_number?: number | null
          preferred_foot?: string | null
          height_cm?: number | null
          photo_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          display_name?: string
          common_name?: string | null
          date_of_birth?: string
          nationality?: string
          position?: string
          shirt_number?: number | null
          preferred_foot?: string | null
          height_cm?: number | null
          photo_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      competitions: {
        Row: {
          id: string
          name: string
          short_name: string
          slug: string
          code: string
          category: string
          format: string | null
          status: CompetitionStatus
          country: string
          governing_body: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          short_name: string
          slug: string
          code: string
          category: string
          format?: string | null
          status?: CompetitionStatus
          country?: string
          governing_body?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_name?: string
          slug?: string
          code?: string
          category?: string
          format?: string | null
          status?: CompetitionStatus
          country?: string
          governing_body?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      seasons: {
        Row: {
          id: string
          name: string
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          start_date: string
          end_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      competition_teams: {
        Row: {
          id: string
          competition_id: string
          season_id: string
          club_id: string
          status: string
          joined_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          competition_id: string
          season_id: string
          club_id: string
          status?: string
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          competition_id?: string
          season_id?: string
          club_id?: string
          status?: string
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      player_registrations: {
        Row: {
          id: string
          player_id: string
          club_id: string
          season_id: string
          competition_id: string | null
          registration_number: string | null
          position: string
          shirt_number: number | null
          status: RegistrationStatus
          registered_at: string
          verified_at: string | null
          verified_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          club_id: string
          season_id: string
          competition_id?: string | null
          registration_number?: string | null
          position: string
          shirt_number?: number | null
          status?: RegistrationStatus
          registered_at?: string
          verified_at?: string | null
          verified_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          club_id?: string
          season_id?: string
          competition_id?: string | null
          registration_number?: string | null
          position?: string
          shirt_number?: number | null
          status?: RegistrationStatus
          registered_at?: string
          verified_at?: string | null
          verified_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      fixtures: {
        Row: {
          id: string
          competition_id: string
          season_id: string
          home_club_id: string
          away_club_id: string
          round_number: number | null
          group_name: string | null
          matchday: number | null
          kickoff_at: string
          venue: string | null
          status: FixtureStatus
          home_score: number
          away_score: number
          referee_user_id: string | null
          is_verified: boolean
          verified_at: string | null
          verified_by: string | null
          source: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          competition_id: string
          season_id: string
          home_club_id: string
          away_club_id: string
          round_number?: number | null
          group_name?: string | null
          matchday?: number | null
          kickoff_at: string
          venue?: string | null
          status?: FixtureStatus
          home_score?: number
          away_score?: number
          referee_user_id?: string | null
          is_verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
          source?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          competition_id?: string
          season_id?: string
          home_club_id?: string
          away_club_id?: string
          round_number?: number | null
          group_name?: string | null
          matchday?: number | null
          kickoff_at?: string
          venue?: string | null
          status?: FixtureStatus
          home_score?: number
          away_score?: number
          referee_user_id?: string | null
          is_verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
          source?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      match_lineups: {
        Row: {
          id: string
          fixture_id: string
          club_id: string
          formation: string | null
          coach_user_id: string | null
          status: LineupStatus
          submitted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fixture_id: string
          club_id: string
          formation?: string | null
          coach_user_id?: string | null
          status?: LineupStatus
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fixture_id?: string
          club_id?: string
          formation?: string | null
          coach_user_id?: string | null
          status?: LineupStatus
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lineup_players: {
        Row: {
          id: string
          lineup_id: string
          player_id: string
          registration_id: string | null
          position: string
          shirt_number: number | null
          is_starter: boolean
          is_captain: boolean
          substitution_minute: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lineup_id: string
          player_id: string
          registration_id?: string | null
          position: string
          shirt_number?: number | null
          is_starter?: boolean
          is_captain?: boolean
          substitution_minute?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lineup_id?: string
          player_id?: string
          registration_id?: string | null
          position?: string
          shirt_number?: number | null
          is_starter?: boolean
          is_captain?: boolean
          substitution_minute?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      match_events: {
        Row: {
          id: string
          fixture_id: string
          event_type: EventType
          team_id: string | null
          player_id: string | null
          related_player_id: string | null
          minute: number
          additional_minute: number
          event_sequence: number
          period: string
          description: string | null
          metadata: Json
          verification_status: EventVerifyStatus
          verified_at: string | null
          verified_by: string | null
          source_event_id: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fixture_id: string
          event_type: EventType
          team_id?: string | null
          player_id?: string | null
          related_player_id?: string | null
          minute: number
          additional_minute?: number
          event_sequence: number
          period?: string
          description?: string | null
          metadata?: Json
          verification_status?: EventVerifyStatus
          verified_at?: string | null
          verified_by?: string | null
          source_event_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fixture_id?: string
          event_type?: EventType
          team_id?: string | null
          player_id?: string | null
          related_player_id?: string | null
          minute?: number
          additional_minute?: number
          event_sequence?: number
          period?: string
          description?: string | null
          metadata?: Json
          verification_status?: EventVerifyStatus
          verified_at?: string | null
          verified_by?: string | null
          source_event_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      substitutions: {
        Row: {
          id: string
          match_event_id: string
          lineup_player_off_id: string
          lineup_player_on_id: string
          minute: number
          additional_minute: number
          reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_event_id: string
          lineup_player_off_id: string
          lineup_player_on_id: string
          minute: number
          additional_minute?: number
          reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_event_id?: string
          lineup_player_off_id?: string
          lineup_player_on_id?: string
          minute?: number
          additional_minute?: number
          reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      transfers: {
        Row: {
          id: string
          player_id: string
          from_club_id: string
          to_club_id: string | null
          season_id: string
          competition_id: string | null
          transfer_type: string
          status: TransferStatus
          transfer_date: string
          fee_amount: number | null
          currency: string
          announced_at: string | null
          approved_by: string | null
          approved_at: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          from_club_id: string
          to_club_id?: string | null
          season_id: string
          competition_id?: string | null
          transfer_type: string
          status?: TransferStatus
          transfer_date?: string
          fee_amount?: number | null
          currency?: string
          announced_at?: string | null
          approved_by?: string | null
          approved_at?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          from_club_id?: string
          to_club_id?: string | null
          season_id?: string
          competition_id?: string | null
          transfer_type?: string
          status?: TransferStatus
          transfer_date?: string
          fee_amount?: number | null
          currency?: string
          announced_at?: string | null
          approved_by?: string | null
          approved_at?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          table_name: string
          record_id: string
          action: AuditAction
          actor_id: string | null
          actor_email: string | null
          changes: Json
          reason: string | null
          ip_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          table_name: string
          record_id: string
          action: AuditAction
          actor_id?: string | null
          actor_email?: string | null
          changes?: Json
          reason?: string | null
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          table_name?: string
          record_id?: string
          action?: AuditAction
          actor_id?: string | null
          actor_email?: string | null
          changes?: Json
          reason?: string | null
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          body: string | null
          data: Json
          read_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          title: string
          body?: string | null
          data?: Json
          read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: NotificationType
          title?: string
          body?: string | null
          data?: Json
          read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          id: string
          token: string
          email: string
          full_name: string
          role: AppRole
          club_id: string | null
          competition_id: string | null
          invited_by: string | null
          message: string | null
          expires_at: string
          accepted_at: string | null
          revoked_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          token?: string
          email: string
          full_name: string
          role: AppRole
          club_id?: string | null
          competition_id?: string | null
          invited_by?: string | null
          message?: string | null
          expires_at?: string
          accepted_at?: string | null
          revoked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          token?: string
          email?: string
          full_name?: string
          role?: AppRole
          club_id?: string | null
          competition_id?: string | null
          invited_by?: string | null
          message?: string | null
          expires_at?: string
          accepted_at?: string | null
          revoked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      standings: {
        Row: {
          id: string
          competition_id: string
          season_id: string
          club_id: string
          club_name: string
          club_short_name: string
          played: number
          wins: number
          draws: number
          losses: number
          goals_for: number
          goals_against: number
          goal_difference: number
          points: number
          last_match_at: string | null
          position: number
        }
        Relationships: []
      }
      player_statistics: {
        Row: {
          id: string
          competition_id: string
          season_id: string
          player_id: string
          club_id: string
          player_name: string
          club_name: string
          appearances: number
          starts: number
          goals: number
          own_goals: number
          assists: number
          penalties_missed: number
          yellow_cards: number
          red_cards: number
          last_match_at: string
        }
        Relationships: []
      }
      team_statistics: {
        Row: {
          id: string
          competition_id: string
          season_id: string
          club_id: string
          club_name: string
          club_short_name: string
          played: number
          wins: number
          draws: number
          losses: number
          goals_for: number
          goals_against: number
          goal_difference: number
          clean_sheets: number
          goals_from_events: number
          own_goals: number
          yellow_cards: number
          red_cards: number
          last_match_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_user_id: {
        Args: Record<string, never>
        Returns: string
      }
      is_approved_user: {
        Args: Record<string, never>
        Returns: boolean
      }
      has_role: {
        Args: { p_role: AppRole }
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_authorised_club: {
        Args: { p_club_id: string }
        Returns: boolean
      }
      is_assigned_competition: {
        Args: { p_competition_id: string }
        Returns: boolean
      }
      is_match_official_for: {
        Args: { p_fixture_id: string }
        Returns: boolean
      }
      can_manage_fixture: {
        Args: { p_fixture_id: string }
        Returns: boolean
      }
      can_manage_player: {
        Args: { p_player_id: string }
        Returns: boolean
      }
      can_manage_lineup: {
        Args: { p_lineup_id: string }
        Returns: boolean
      }
      can_manage_event: {
        Args: { p_event_id: string }
        Returns: boolean
      }
      get_invitation: {
        Args: { p_token: string }
        Returns: {
          token: string
          email: string
          full_name: string
          role: AppRole
          club_id: string | null
          competition_id: string | null
          message: string | null
          expires_at: string
        }[]
      }
      accept_invitation: {
        Args: { p_token: string }
        Returns: boolean
      }
      assign_role: {
        Args: {
          p_user_id: string
          p_role: AppRole
          p_club_id?: string | null
          p_competition_id?: string | null
        }
        Returns: string
      }
      set_user_approval: {
        Args: { p_user_id: string; p_status: ApprovalStatus }
        Returns: undefined
      }
    }
    Enums: {
      app_role: AppRole
      approval_status: ApprovalStatus
      club_status: ClubStatus
      staff_status: StaffStatus
      registration_status: RegistrationStatus
      competition_status: CompetitionStatus
      fixture_status: FixtureStatus
      lineup_status: LineupStatus
      event_type: EventType
      event_verify_status: EventVerifyStatus
      transfer_status: TransferStatus
      notification_type: NotificationType
      audit_action: AuditAction
    }
    CompositeTypes: Record<string, never>
  }
}
