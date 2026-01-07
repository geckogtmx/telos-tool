-- Add DELETE policy for TELOS files
CREATE POLICY "Users can delete own TELOS files"
  ON telos_files FOR DELETE
  USING (auth.uid() = user_id);
