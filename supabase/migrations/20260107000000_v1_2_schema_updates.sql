-- Update entity_type check constraint
ALTER TABLE telos_files 
DROP CONSTRAINT IF EXISTS telos_files_entity_type_check;

ALTER TABLE telos_files
ADD CONSTRAINT telos_files_entity_type_check 
CHECK (entity_type IN ('individual', 'organization', 'agent', 'individual_quick', 'individual_full'));

-- Add question_version column
ALTER TABLE telos_files
ADD COLUMN IF NOT EXISTS question_version TEXT DEFAULT 'v1.1';

-- Add metadata for upgrade path
ALTER TABLE telos_files
ADD COLUMN IF NOT EXISTS upgraded_from UUID REFERENCES telos_files(id);
