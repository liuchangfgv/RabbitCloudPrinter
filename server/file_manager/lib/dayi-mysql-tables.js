const sql_table_1 = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT NOT NULL,
  passwd TEXT NULL,
  permission INTEGER NOT NULL,
  name TEXT NULL,
  stu_number INTEGER NULL,
  json JSON NULL,
  permission_source TEXT NULL
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

// 打印统计表
const sql_table_4 = `CREATE TABLE IF NOT EXISTS print_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT NOT NULL,
  printer_id INTEGER NOT NULL,
  print_time DATETIME NOT NULL,
  print_file_name TEXT NOT NULL,
  print_file_size REAL NOT NULL,
  num_pages INTEGER NOT NULL,
  num_copies INTEGER NOT NULL,
  color_mode TEXT NOT NULL
)`;



exports.sql_table_1 = sql_table_1;
exports.sql_table_2 = sql_table_2;
exports.sql_table_3 = sql_table_3;
exports.sql_table_4 = sql_table_4;



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
