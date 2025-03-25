#!/bin/bash
set -e

# Add the pgTAP extension differently
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create a minimal pgTAP-like environment for our tests
    -- This simple implementation provides just the functions we need

    -- Create a schema for our test functions
    CREATE SCHEMA IF NOT EXISTS tap;

    -- Function to plan tests
    CREATE OR REPLACE FUNCTION tap.plan(integer) RETURNS SETOF text AS \$\$
    DECLARE
        _plan_count ALIAS FOR \$1;
    BEGIN
        RETURN NEXT '1..' || _plan_count;
        RETURN;
    END;
    \$\$ LANGUAGE plpgsql;

    -- Function to check if something is OK
    CREATE OR REPLACE FUNCTION tap.ok(boolean, text) RETURNS text AS \$\$
    DECLARE
        _result ALIAS FOR \$1;
        _message ALIAS FOR \$2;
        _outcome text;
    BEGIN
        IF _result THEN
            _outcome := 'ok';
        ELSE
            _outcome := 'not ok';
        END IF;
        
        RETURN _outcome || ' - ' || _message;
    END;
    \$\$ LANGUAGE plpgsql;

    -- Function to test if two values are equal
    CREATE OR REPLACE FUNCTION tap.is(anyelement, anyelement, text) RETURNS text AS \$\$
    DECLARE
        _got ALIAS FOR \$1;
        _expected ALIAS FOR \$2;
        _message ALIAS FOR \$3;
    BEGIN
        RETURN tap.ok(_got IS NOT DISTINCT FROM _expected, _message);
    END;
    \$\$ LANGUAGE plpgsql;

    -- Function to test if two values are not equal
    CREATE OR REPLACE FUNCTION tap.isnt(anyelement, anyelement, text) RETURNS text AS \$\$
    DECLARE
        _got ALIAS FOR \$1;
        _expected ALIAS FOR \$2;
        _message ALIAS FOR \$3;
    BEGIN
        RETURN tap.ok(_got IS DISTINCT FROM _expected, _message);
    END;
    \$\$ LANGUAGE plpgsql;

    -- Function to test if SQL executes without error
    CREATE OR REPLACE FUNCTION tap.lives_ok(text, text) RETURNS text AS \$\$
    DECLARE
        _sql ALIAS FOR \$1;
        _message ALIAS FOR \$2;
        _result boolean := true;
    BEGIN
        BEGIN
            EXECUTE _sql;
        EXCEPTION
            WHEN OTHERS THEN
                _result := false;
        END;
        
        RETURN tap.ok(_result, _message);
    END;
    \$\$ LANGUAGE plpgsql;

    -- Function to test if a query returns empty
    CREATE OR REPLACE FUNCTION tap.is_empty(text, text) RETURNS text AS \$\$
    DECLARE
        _sql ALIAS FOR \$1;
        _message ALIAS FOR \$2;
        _count integer;
    BEGIN
        EXECUTE 'SELECT COUNT(*) FROM (' || _sql || ') AS _tap_is_empty' INTO _count;
        RETURN tap.ok(_count = 0, _message);
    END;
    \$\$ LANGUAGE plpgsql;

    -- Function to test if a query returns non-empty
    CREATE OR REPLACE FUNCTION tap.isnt_empty(text, text) RETURNS text AS \$\$
    DECLARE
        _sql ALIAS FOR \$1;
        _message ALIAS FOR \$2;
        _count integer;
    BEGIN
        EXECUTE 'SELECT COUNT(*) FROM (' || _sql || ') AS _tap_isnt_empty' INTO _count;
        RETURN tap.ok(_count > 0, _message);
    END;
    \$\$ LANGUAGE plpgsql;

    -- Function to finish tests
    CREATE OR REPLACE FUNCTION tap.finish() RETURNS SETOF text AS \$\$
    BEGIN
        RETURN NEXT 'Tests finished';
        RETURN;
    END;
    \$\$ LANGUAGE plpgsql;

    -- Set search path to include our tap schema
    ALTER DATABASE "$POSTGRES_DB" SET search_path TO public, tap;

    -- Done setting up basic pgTAP-like functions
EOSQL

echo "Basic pgTAP-like functions have been created."
