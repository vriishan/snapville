#!/bin/sh

echo "--------------creating databases--------------"
export PGPASSWORD=postgres
psql -U postgres -d postgres -f "./create_dbs.sql"
unset PGPASSWORD
echo "--------------databases set up--------------"
