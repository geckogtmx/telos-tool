-- TELOS Files Table
CREATE TABLE IF NOT EXISTS telos_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('individual', 'organization', 'agent')),
  entity_name TEXT NOT NULL,
  
  -- Content
  raw_input JSONB NOT NULL,              -- Original uploaded data + answers
  generated_content TEXT NOT NULL,        -- Full TELOS markdown
  
  -- Hosting
  public_id TEXT UNIQUE NOT NULL,         -- Short ID for URL (e.g., 'abc123')
  hosting_type TEXT NOT NULL CHECK (hosting_type IN ('open', 'encrypted', 'private')),
  password_hash TEXT,                     -- For encrypted hosting
  blob_url TEXT,                          -- Vercel Blob URL (optional)
  
  -- Metadata
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_telos_user ON telos_files(user_id);
CREATE INDEX IF NOT EXISTS idx_telos_public ON telos_files(public_id);
CREATE INDEX IF NOT EXISTS idx_telos_entity_type ON telos_files(entity_type);

-- RLS Policies
ALTER TABLE telos_files ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own files
CREATE POLICY "Users can view own TELOS files"
  ON telos_files FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own files
CREATE POLICY "Users can insert own TELOS files"
  ON telos_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own files
CREATE POLICY "Users can update own TELOS files"
  ON telos_files FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Public access for open files
CREATE POLICY "Public TELOS files viewable by public_id"
  ON telos_files FOR SELECT
  USING (hosting_type = 'open');
  
-- Policy: Encrypted files are viewable (password check happens in app/API)
-- Wait, if we use RLS, we might block fetching the row to check the password hash if we aren't careful.
-- However, typically for encrypted view, we fetch the row by public_id.
-- If the row is not 'open', the RLS above blocks it for anon users.
-- We need a policy that allows fetching by public_id even if encrypted, 
-- BUT we must be careful not to expose sensitive data if we select *.
-- Ideally, we use a stored procedure or a separate function to verify password, 
-- or we allow SELECT on encrypted files but the client only gets non-sensitive fields.
-- For simplicity in v1, let's allow SELECT on encrypted files for everyone, 
-- assuming the application layer protects the sensitive `generated_content` until password is verified.
-- ACTUALLY, checking the spec: "Encrypted files prompt for password".
-- The `generated_content` is the sensitive part.
-- If we allow SELECT, anyone can read `generated_content`.
-- So for 'encrypted', we should probably NOT allow direct SELECT via RLS for anon users.
-- Instead, we should use a Postgres function (RPC) to fetch or verify, OR use a Service Role client in the API to fetch the hash, verify, and then return content.
-- Since we are using Next.js API routes, we can use `supabase-admin` (service role) to fetch the file in the API route.
-- So the RLS for public/anon users should strictly be for 'open' files.
-- The API route will handle 'encrypted' access using service role.

-- So the RLS "Public TELOS files viewable by public_id" stays as is (only 'open').
