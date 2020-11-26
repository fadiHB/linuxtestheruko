drop table if exists exam301;

create table exam301 (
    id serial primary key,
    name varchar(25),
    img text,
    level varchar(25)
);