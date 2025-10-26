-- Initialize PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Create a spatial index on the location column for better performance
-- This will be run after the tables are created via Prisma migrations

-- Optional: Create a function to update location timestamps (if needed)
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';