-- Initialize PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Verify PostGIS installation
DO $$
BEGIN
    RAISE NOTICE 'PostGIS version: %', PostGIS_version();
END
$$;