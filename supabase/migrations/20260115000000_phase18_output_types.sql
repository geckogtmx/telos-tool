-- Phase 18: System Prompts & Skills Generation
-- Adds output_type and target_platform columns to telos_files table
-- Also creates usage_tracking table for monitoring AI token consumption

-- Add output_type column (default 'telos' for backwards compatibility)
ALTER TABLE telos_files ADD COLUMN IF NOT EXISTS output_type TEXT DEFAULT 'telos';

-- Add target_platform column
ALTER TABLE telos_files ADD COLUMN IF NOT EXISTS target_platform TEXT DEFAULT 'universal';

-- Add skill_metadata for storing skill manifests (JSONB for flexibility)
ALTER TABLE telos_files ADD COLUMN IF NOT EXISTS skill_metadata JSONB;

-- Create usage_tracking table
CREATE TABLE IF NOT EXISTS generation_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  output_type TEXT NOT NULL,
  target_platform TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  ai_provider TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on usage_tracking
ALTER TABLE generation_usage ENABLE ROW LEVEL SECURITY;

-- Users can only see their own usage
CREATE POLICY "Users can view own usage" ON generation_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own usage records
CREATE POLICY "Users can insert own usage" ON generation_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for faster usage queries
CREATE INDEX IF NOT EXISTS idx_generation_usage_user_id ON generation_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_usage_created_at ON generation_usage(created_at);

-- Add constraint for valid output_type values
ALTER TABLE telos_files DROP CONSTRAINT IF EXISTS valid_output_type;
ALTER TABLE telos_files ADD CONSTRAINT valid_output_type 
  CHECK (output_type IN ('telos', 'system-prompt', 'skill'));

-- Add constraint for valid target_platform values
ALTER TABLE telos_files DROP CONSTRAINT IF EXISTS valid_target_platform;
ALTER TABLE telos_files ADD CONSTRAINT valid_target_platform 
  CHECK (target_platform IN ('universal', 'claude', 'gemini', 'openai', 'cursor', 'windsurf'));
