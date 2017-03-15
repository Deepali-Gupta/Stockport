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

create materialized view portfolio as 
(select userid, log.stockid, sum(trans_qty) as qty, sum(trans_qty*close) as cost
from log inner join history
on log.stockid=history.stockid
and log.trans_date=history.day
group by userid, log.stockid);