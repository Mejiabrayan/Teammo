-- Disable triggers on the tasks table
ALTER TABLE "tasks" DISABLE TRIGGER ALL;

-- Add the team_id column as nullable initially
ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "team_id" integer;

-- Create a foreign key constraint, but don't enforce it yet
ALTER TABLE "tasks" ADD CONSTRAINT IF NOT EXISTS "tasks_team_id_fkey" 
  FOREIGN KEY ("team_id") REFERENCES "teams"("id") DEFERRABLE INITIALLY DEFERRED;

-- Update existing tasks with a default team_id
-- This assumes each user belongs to only one team
-- Adjust this logic if users can belong to multiple teams
UPDATE "tasks" t
SET team_id = (
  SELECT tm.team_id 
  FROM team_members tm 
  WHERE tm.user_id = t.user_id 
  LIMIT 1
);

-- Make the team_id column NOT NULL after updating existing rows
ALTER TABLE "tasks" ALTER COLUMN "team_id" SET NOT NULL;

-- Now enforce the foreign key constraint
ALTER TABLE "tasks" VALIDATE CONSTRAINT "tasks_team_id_fkey";

-- Re-enable triggers on the tasks table
ALTER TABLE "tasks" ENABLE TRIGGER ALL;