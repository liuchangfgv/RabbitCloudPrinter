sql_table_1 = 'CREATE TABLE IF NOT EXISTS `users` \
( `id` INT  AUTO_INCREMENT , \
  `user_name` TEXT NOT NULL , \
  `passwd` TEXT  NULL ,\
  `permission` INT NOT NULL , \
  `name` TEXT  NULL ,\
  `stu_number` INT  NULL ,\
  `json` JSON  NULL ,\
  PRIMARY KEY  (`id`)\
) ENGINE = InnoDB;';

sql_table_2 = 'CREATE TABLE IF NOT EXISTS  `files` \
( `id` INT  AUTO_INCREMENT , \
  `user_name` TEXT NOT NULL ,\
  `uuid` TEXT NOT NULL ,\
   `file_path` TEXT  NULL ,\
    `file_name` TEXT  NULL,\
    `file_size` DOUBLE NULL, \
     PRIMARY KEY  (`id`)\
) ENGINE = InnoDB;';


sql_table_3 = 'CREATE TABLE IF NOT EXISTS  `mp3-players` \
( `id` INT  AUTO_INCREMENT , \
  `own_user_name` TEXT NOT NULL ,\
  `uuid` TEXT NOT NULL ,\
  `is_turn_off_by_admin` INT  NULL ,\
  `json` JSON  NULL,\
  PRIMARY KEY  (`id`)\
) ENGINE = InnoDB;';


exports.sql_table_1=sql_table_1
exports.sql_table_2=sql_table_2
exports.sql_table_3=sql_table_3
