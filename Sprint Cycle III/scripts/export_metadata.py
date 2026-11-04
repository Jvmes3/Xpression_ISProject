#!/usr/bin/env python3
"""Export the live schema catalog for the ERD and data dictionary."""
import json
import subprocess
import sys
from pathlib import Path
import db

QUERY = r"""
SELECT jsonb_build_object(
 'server_version', current_setting('server_version'),
 'tables', (SELECT jsonb_agg(jsonb_build_object('name',c.relname,'description',obj_description(c.oid)))
   FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
   WHERE n.nspname='xpression' AND c.relkind='r'),
 'columns', (SELECT jsonb_agg(jsonb_build_object('table',c.table_name,'name',c.column_name,
   'position',c.ordinal_position,'type',c.data_type,'nullable',c.is_nullable,
   'default',c.column_default,'identity',c.is_identity,'generated',c.is_generated,'generation_expression',c.generation_expression,
   'description',col_description((quote_ident(c.table_schema)||'.'||quote_ident(c.table_name))::regclass,c.ordinal_position)))
   FROM information_schema.columns c WHERE c.table_schema='xpression'),
 'constraints', (SELECT jsonb_agg(jsonb_build_object('table',r.relname,'name',c.conname,
   'kind',c.contype,'definition',pg_get_constraintdef(c.oid),'deferred',c.condeferrable))
   FROM pg_constraint c JOIN pg_class r ON r.oid=c.conrelid JOIN pg_namespace n ON n.oid=r.relnamespace
   WHERE n.nspname='xpression'),
 'relationships', (SELECT jsonb_agg(jsonb_build_object('table',r.relname,'name',c.conname,
   'columns',(SELECT jsonb_agg(a.attname ORDER BY s.i) FROM generate_subscripts(c.conkey,1) s(i)
      JOIN pg_attribute a ON a.attrelid=c.conrelid AND a.attnum=c.conkey[s.i]),
   'parent',p.relname,'parent_columns',(SELECT jsonb_agg(a.attname ORDER BY s.i)
      FROM generate_subscripts(c.confkey,1) s(i) JOIN pg_attribute a ON a.attrelid=c.confrelid AND a.attnum=c.confkey[s.i])))
   FROM pg_constraint c JOIN pg_class r ON r.oid=c.conrelid JOIN pg_class p ON p.oid=c.confrelid
   JOIN pg_namespace n ON n.oid=r.relnamespace WHERE n.nspname='xpression' AND c.contype='f'),
 'indexes', (SELECT jsonb_agg(jsonb_build_object('table',tablename,'name',indexname,'definition',indexdef))
   FROM pg_indexes WHERE schemaname='xpression'),
 'triggers', (SELECT jsonb_agg(jsonb_build_object('table',r.relname,'name',t.tgname,'definition',pg_get_triggerdef(t.oid)))
   FROM pg_trigger t JOIN pg_class r ON r.oid=t.tgrelid JOIN pg_namespace n ON n.oid=r.relnamespace
   WHERE n.nspname='xpression' AND NOT t.tgisinternal)
);
"""

if __name__ == '__main__':
    try:
        result = json.loads(db.sql('-Atc', QUERY, capture=True).stdout)
    except subprocess.CalledProcessError as exc:
        sys.exit(exc.stderr.strip())
    for key in ('tables','columns','constraints','relationships','indexes','triggers'):
        result[key] = result[key] or []
    result['tables'].sort(key=lambda x:x['name'])
    result['columns'].sort(key=lambda x:(x['table'],x['position']))
    target = db.ROOT / 'docs/schema-metadata.json'
    target.parent.mkdir(exist_ok=True)
    target.write_text(json.dumps(result, indent=2) + '\n')
    print(f'Exported {len(result["tables"])} tables and {len(result["columns"])} columns to {target}')
