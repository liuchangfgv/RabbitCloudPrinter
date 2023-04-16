const sql_table_1 = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT NOT NULL,
  passwd TEXT NULL,
  permission INTEGER NOT NULL,
  name TEXT NULL,
  stu_number INTEGER NULL,
  json JSON NULL
)`;

const sql_table_2 = `CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT NOT NULL,
  uuid TEXT NOT NULL,
  file_path TEXT NULL,
  file_name TEXT NULL,
  file_size REAL NULL
)`;

const sql_table_3 = `CREATE TABLE IF NOT EXISTS mp3_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  own_user_name TEXT NOT NULL,
  uuid TEXT NOT NULL,
  is_turn_off_by_admin INTEGER NULL,
  json JSON NULL
)`;

exports.sql_table_1 = sql_table_1;
exports.sql_table_2 = sql_table_2;
exports.sql_table_3 = sql_table_3;



// sql_table_1 = 'CREATE TABLE IF NOT EXISTS `users` \
// ( `id` INT  AUTO_INCREMENT , \
//   `user_name` TEXT NOT NULL , \
//   `passwd` TEXT  NULL ,\
//   `permission` INT NOT NULL , \
//   `name` TEXT  NULL ,\
//   `stu_number` INT  NULL ,\
//   `json` JSON  NULL ,\
//   PRIMARY KEY  (`id`)\
// ) ENGINE = InnoDB;';

// sql_table_2 = 'CREATE TABLE IF NOT EXISTS  `files` \
// ( `id` INT  AUTO_INCREMENT , \
//   `user_name` TEXT NOT NULL ,\
//   `uuid` TEXT NOT NULL ,\
//    `file_path` TEXT  NULL ,\
//     `file_name` TEXT  NULL,\
//     `file_size` DOUBLE NULL, \
//      PRIMARY KEY  (`id`)\
// ) ENGINE = InnoDB;';


// sql_table_3 = 'CREATE TABLE IF NOT EXISTS  `mp3-players` \
// ( `id` INT  AUTO_INCREMENT , \
//   `own_user_name` TEXT NOT NULL ,\
//   `uuid` TEXT NOT NULL ,\
//   `is_turn_off_by_admin` INT  NULL ,\
//   `json` JSON  NULL,\
//   PRIMARY KEY  (`id`)\
// ) ENGINE = InnoDB;';


// exports.sql_table_1=sql_table_1
// exports.sql_table_2=sql_table_2
// exports.sql_table_3=sql_table_3
