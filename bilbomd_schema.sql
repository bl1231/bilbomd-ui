-- SQL dump generated using DBML (dbml-lang.org)
-- Database: MySQL
-- Generated at: 2023-01-02T19:20:05.355Z

CREATE SCHEMA `bilbomd`;

CREATE TABLE `bilbomd`.`users` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `username` varchar(45),
  `role` varchar(45),
  `email` varchar(60),
  `last_name` varchar(100),
  `first_name` varchar(45),
  `created_at` timestamp
);

CREATE TABLE `bilbomd`.`jobs` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(60),
  `user_id` integer,
  `status` ENUM ('submitted', 'pending', 'running', 'error', 'completed'),
  `results` varchar(100) COMMENT 'path to a zip or tar.gz file containing bilbomd results',
  `created_at` timestamp
);

CREATE TABLE `bilbomd`.`sessions` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_id` integer,
  `created_at` timestamp,
  `updated_at` timestamp
);

ALTER TABLE `users` COMMENT = 'table \'users\' contains user information.... duh';

ALTER TABLE `jobs` COMMENT = 'table \'jobs\' one entry per BilboMD job';

ALTER TABLE `sessions` COMMENT = 'one session per user';

ALTER TABLE `bilbomd`.`jobs` ADD FOREIGN KEY (`user_id`) REFERENCES `bilbomd`.`users` (`id`);

ALTER TABLE `bilbomd`.`sessions` ADD FOREIGN KEY (`user_id`) REFERENCES `bilbomd`.`users` (`id`);
