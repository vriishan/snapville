#!/bin/sh

echo "--------------deleting databases--------------"
export PGPASSWORD=postgres
psql -U postgres -d postgres -f "./delete_dbs.sql"
unset PGPASSWORD
echo "--------------databases deleted--------------"
