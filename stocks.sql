drop database if exists stocks;
create database stocks;

\c stocks;

set datestyle = YMD;

create table stock (
	stockid serial PRIMARY KEY,
	stockname varchar not null unique,
	industry varchar
);

\COPY stock FROM 'C:\Users\HD\Desktop\myapp\stocks.csv' DELIMITERS ',' CSV;

create table history (
	histid serial PRIMARY KEY,
	stockid int references stock(stockid),
	day date not null, 
	open real,
	high real,
	low real,
	close real,
	volume bigint,
	adj_close real
);

\COPY history FROM 'C:\Users\HD\Desktop\myapp\history.csv' DELIMITERS ',' CSV;

create table users (
	userid serial PRIMARY KEY,
	username varchar not null unique,
	password varchar not null,
	role varchar,
	email varchar unique
);

create table log (
	logid serial PRIMARY KEY,
	userid int references users(userid),
	stockid int references stock(stockid),
	trans_qty bigint not null,
	trans_date date not null
);

--views
create materialized view portfolio as 
(select userid, log.stockid, sum(trans_qty) as qty, sum(trans_qty*close) as cost
from log inner join history
on log.stockid=history.stockid
and log.trans_date=history.day
group by userid, log.stockid);

create index on history using btree (stockid);
create index on log using btree (stockid);

--triggers
create function refresh_mat_view()
returns trigger language plpgsql
as $$
begin
    refresh materialized view portfolio;
    return null;
end $$;

create trigger refresh_mat_view
after insert or update or delete or truncate
on log for each statement 
execute procedure refresh_mat_view();

--on delete cascade constraints
alter table history drop constraint history_stockid_fkey;
alter table history add foreign key(stockid) references stock(stockid) on delete cascade;

alter table log drop constraint log_stockid_fkey;
alter table log add foreign key(stockid) references stock(stockid) on delete cascade;

alter table log drop constraint log_userid_fkey;
alter table log add foreign key(userid) references users(userid) on delete cascade;

--access privileges

create role admin;
grant all on stock, users, history, log to admin;
create role member;
grant select, insert, update on log to member;
grant select, insert on history to member;
create role guest;
grant select on stock, history to guest;

create user dg with role admin;
create user hd with role member;
create user gupta with role guest;

alter role admin with login;
alter role member with login;
alter role guest with login;

alter role dg with password='pass'
alter role hd with password='pass'
alter role gupta with password='pass'

psql dg -h 127.0.0.1 -d stocks
psql hd -h 127.0.0.1 -d stocks
psql gupta -h 127.0.0.1 -d stocks
