#!/bin/bash

echo "Starting config"

if [ -f .env.db ]; then
  echo "Retrieving env variables"
  export $(grep -v '^#' .env.db | xargs)
fi

CONFIG_DIR="/config/postgres"
POSTGRES_PORT="5432"

if [ ! -d "$CONFIG_DIR" ]; then
  echo "ERROR: The directory $CONFIG_DIR does not exist"
  exit 1
fi

for type_file in "$CONFIG_DIR"/types/*.sql; do
  [ -e "$type_file" ] || continue

  echo "Applying config file: ${type_file}"

  PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$type_file"

  if [ $? -eq 0 ]; then
    echo "Configuration file applied: ${type_file}"
  else
    echo "Configuration file not applied: ${type_file}"
  fi
done

for table_file in "$CONFIG_DIR"/tables/*.sql; do
  [ -e "$table_file" ] || continue

  echo "Applying config file: ${table_file}"

  PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$table_file"

  if [ $? -eq 0 ]; then
    echo "Configuration file applied: ${table_file}"
  else
    echo "Configuration file not applied: ${table_file}"
  fi
done

for function_file in $(find "$CONFIG_DIR/functions" -type f -name "*.sql"); do
  [ -e "$function_file" ] || continue

  echo "Applying config file: ${function_file}"

  PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$function_file"

  if [ $? -eq 0 ]; then
    echo "Configuration file applied: ${function_file}"
  else
    echo "Configuration file not applied: ${function_file}"
  fi 
done

echo "All configurations have been applied"