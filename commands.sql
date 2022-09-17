CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('SQL Tester', 'https://sqltester.com', 'Testing PostgreSQL CLI');

insert into blogs (author, url, title, likes) values ('SQL Tester', 'https://sqltester.com/likes', 'Adding blog with likes', 2);

select * from blogs;
