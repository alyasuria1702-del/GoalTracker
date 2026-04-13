export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  created_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description: string | null
  deadline: string | null
  is_completed: boolean
  is_public: boolean
  category_id: string | null
  created_at: string
  categories?: Category | null
}

export interface GoalComment {
  id: string
  goal_id: string
  user_id: string
  content: string
  created_at: string
}

export type GoalFilter = 'all' | 'active' | 'completed' | 'overdue'
