#!/usr/bin/env python3
"""Run the native PostgreSQL tools against this sprint's isolated local database."""
import argparse
import os
from pathlib import Path
import re
import secrets
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
LOCAL = ROOT / '.local'
DATA = LOCAL / 'pgdata'
PORT = '55433'
USER = 'xpression_demo'
DB = 'xpression'


def pg_bin():
    explicit = os.environ.get('XPRESSION_PG_BIN')
    candidates = [explicit or '',
                  str(Path(shutil.which('psql')).parent) if shutil.which('psql') else '',
                  '/Library/PostgreSQL/16/bin', '/opt/homebrew/opt/postgresql@16/bin',
                  '/usr/local/opt/postgresql@16/bin',
                  r'C:\Program Files\PostgreSQL\16\bin']
    for candidate in candidates:
        suffix = '.exe' if os.name == 'nt' else ''
        if candidate and all((Path(candidate) / (tool + suffix)).exists()
                             for tool in ('psql','initdb','pg_ctl','createdb','postgres')):
            version = subprocess.run([str(Path(candidate) / ('postgres' + suffix)), '--version'],
                                     capture_output=True, text=True, check=True).stdout
            if re.search(r'\b16\.', version):
                return Path(candidate)
        if candidate and candidate == explicit:
            sys.exit('XPRESSION_PG_BIN must contain PostgreSQL 16 server and client tools.')
    sys.exit('PostgreSQL 16 tools not found. Set XPRESSION_PG_BIN to the PostgreSQL bin folder.')


BIN = pg_bin()


def run(tool, *args, capture=False, check=True):
    env = os.environ.copy()
    if (LOCAL / 'postgres-password.txt').exists():
        env['PGPASSWORD'] = (LOCAL / 'postgres-password.txt').read_text().strip()
    return subprocess.run([str(BIN / tool), *map(str, args)], env=env,
                          text=True, capture_output=capture, check=check)


def sql(*args, **kwargs):
    return run('psql', '-X', '-h', '127.0.0.1', '-p', PORT, '-U', USER,
               '-d', DB, '-v', 'ON_ERROR_STOP=1', '-P', 'pager=off', *args, **kwargs)


def start():
    LOCAL.mkdir(exist_ok=True, mode=0o700)
    if not DATA.exists():
        password = LOCAL / 'postgres-password.txt'
        password.write_text(secrets.token_urlsafe(30) + '\n')
        if os.name != 'nt':
            password.chmod(0o600)
        run('initdb', '-D', DATA, '-U', USER, '--encoding=UTF8', '--locale=C',
            '--auth-local=trust', '--auth-host=scram-sha-256', '--pwfile', password)
        with (DATA / 'postgresql.conf').open('a') as f:
            f.write("\n# Isolated Sprint III presentation database\nlisten_addresses = '127.0.0.1'\n")
            f.write('port = ' + PORT + '\n')
            if os.name != 'nt':
                f.write("unix_socket_directories = ''\n")
    if run('pg_ctl', '-D', DATA, 'status', capture=True, check=False).returncode:
        run('pg_ctl', '-D', DATA, '-l', LOCAL / 'postgres.log', '-w', 'start')
    exists = run('psql', '-X', '-h', '127.0.0.1', '-p', PORT, '-U', USER,
                 '-d', 'postgres', '-Atc', "SELECT 1 FROM pg_database WHERE datname='xpression'",
                 capture=True).stdout.strip()
    if not exists:
        run('createdb', '-h', '127.0.0.1', '-p', PORT, '-U', USER, DB)
    connection = LOCAL / 'connection.txt'
    connection.write_text('Host: 127.0.0.1\nPort: ' + PORT + '\nDatabase: ' + DB +
                          '\nUsername: ' + USER + '\nPassword: ' +
                          (LOCAL / 'postgres-password.txt').read_text().strip() + '\n')
    if os.name != 'nt':
        connection.chmod(0o600)
    print('PostgreSQL is running. pgAdmin connection details: ' + str(connection), flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['setup', 'start', 'status', 'queries', 'demo',
                                           'verify', 'shell', 'stop', 'file'])
    parser.add_argument('path', nargs='?', help='SQL file for the file action')
    args = parser.parse_args()
    if args.action == 'stop':
        run('pg_ctl', '-D', DATA, '-m', 'fast', '-w', 'stop')
        return
    if args.action == 'status':
        run('pg_ctl', '-D', DATA, 'status')
        return
    start()
    if args.action == 'setup':
        exists = sql('-Atc', "SELECT 1 FROM pg_namespace WHERE nspname='xpression'", capture=True).stdout.strip()
        if exists:
            print('Schema already exists; kept current data. Use verify to check it.')
            return
        # One transaction also prevents an incomplete schema if sample-data loading fails.
        sql('-1', '-f', ROOT / 'database/01_schema.sql', '-f', ROOT / 'database/02_seed.sql')
        print('Schema and sample data loaded.')
    elif args.action in ('queries', 'demo', 'verify'):
        files = {'queries': '03_queries.sql', 'demo': '04_demo_mutations.sql', 'verify': '05_verify.sql'}
        sql('-f', ROOT / 'database' / files[args.action])
    elif args.action == 'shell':
        sql()
    elif args.action == 'file':
        if not args.path:
            parser.error('file requires a SQL file path')
        sql('-f', Path(args.path).resolve())


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError as exc:
        sys.exit(exc.returncode)
