// not mysql is sqlite
//表面上是mysql，实际上是为了兼容原先的代码，文件名和函数名都是mysql，实际上是sqlite

const sqlite = require('better-sqlite3');
const dayi_mysql_tables = require('./dayi-mysql-tables');

const db = sqlite('collect_node.db');

const logger = require('./log_it');

function log_info(str1) {
  logger.log_info(str1);
}
function log_error(str1) {
  logger.error(str1);
}

// 数据库连接
try {
  db.exec('SELECT 1 + 1 AS solution');
  log_info('[dayi-info] SQLite connect successfully, so 1 + 1 = 2');
} catch (error) {
  log_info('[dayi-error]Could not connect to SQLite database.');
  log_info('[dayi-error]The error is: ', error.message);
  process.exit(1);
}

// 创建表格
function dayi_create_tables() {
  try {
    db.exec(dayi_mysql_tables.sql_table_1);
    log_info('[dayi-info] Table 1 created successfully');
    db.exec(dayi_mysql_tables.sql_table_2);
    log_info('[dayi-info] Table 2 created successfully');
    db.exec(dayi_mysql_tables.sql_table_3);
    log_info('[dayi-info] Table 3 created successfully');

    db.exec(dayi_mysql_tables.sql_table_4);
    log_info('[dayi-info] Table 4 created successfully');
  } catch (error) {
    log_info('[dayi-error] Error creating tables:', error.message);
  }
}

// 插入文件信息
function dayi_insert_file(
    file_path, user_name, file_uuid, file_size, file_name) {
  const stmt = db.prepare(
      'INSERT INTO files (user_name, file_path, uuid, file_size, file_name) VALUES (?, ?, ?, ?, ?)');
  try {
    stmt.run(user_name, file_path, file_uuid, file_size, file_name);
  } catch (error) {
    log_info('[dayi-error] Error inserting file:', error.message);
  }
}



// 查询用户是否存在于数据库中
async function dayi_query_user(user_name) {
  const stmt = db.prepare('SELECT * FROM users WHERE user_name = ?');
  try {
    const result = stmt.all(user_name);
    return result.length >= 1;
  } catch (error) {
    log_info('[dayi-error] Error querying user:', error.message);
    return false;
  }
}

// 查询用户的文件信息
async function dayi_user_files(user_name, file_uuid) {
  let stmt;
  let sets;
  if (file_uuid === undefined) {
    stmt = db.prepare('SELECT * FROM files WHERE user_name = ?');
    sets = [user_name];
  } else {
    stmt = db.prepare('SELECT * FROM files WHERE user_name = ? AND uuid = ?');
    sets = [user_name, file_uuid];
  }
  try {
    const result = stmt.all(...sets);
    return result;
  } catch (error) {
    log_error('[dayi-error] Error querying user files:', error.message);
    return [];
  }
}

// 删除文件信息
async function dayi_delete_file_sql(file_uuid) {
  const stmt = db.prepare('DELETE FROM files WHERE uuid = ?');
  try {
    const result = stmt.run(file_uuid);
    return result;
  } catch (error) {
    log_error('[dayi-error] Error deleting file:', error.message);
    return false;
  }
}

// 查询用户权限
async function dayi_query_user_permisson(user_name) {
  const stmt = db.prepare('SELECT permission FROM users WHERE user_name = ?');
  try {
    const result = stmt.get(user_name);
    return result.permission;
  } catch (error) {
    log_error('[dayi-error] Error querying user permission:', error.message);
    return 0;
  }
}


//查询用户打印的次数
async function dayi_query_user_print_count(user_name) {
  const stmt = db.prepare(
      'SELECT COUNT(*) AS print_count FROM print_history WHERE user_name = ?');
  try {
    const result = stmt.get(user_name);
    return result.print_count;
  } catch (error) {
    log_error('[dayi-error] Error querying user print count:', error.message);
    return 0;
  }
}



// 插入打印历史记录
async function dayi_insert_user_print_history(user_name, printer_id, print_time,print_file_name,print_file_size,num_pages,num_copies,color_mode) {
  if (!print_time) {  //如果没有传入打印时间，则使用当前时间
    print_time = new Date().toISOString();
  }
  const stmt = db.prepare(
      'INSERT INTO print_history (user_name, printer_id, print_time, print_file_name, print_file_size, num_pages, num_copies, color_mode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  try {
    stmt.run(
        user_name, printer_id, print_time, print_file_name || 'Unknown',
        print_file_size || 0, num_pages || 1, num_copies || 1,
        color_mode || 'Black and White');
  } catch (error) {
    log_error('[dayi-error] Error inserting print history:', error.message);
  }
}

dayi_create_tables();


//SQL lib 函数库
const _lib_dayi_insert_user = require('./sql-libs/add_user')
const _lib_dayi_grant_user = require('./sql-libs/permit_user')


// =============== 插入用户信息 =============== 
async function dayi_insert_user(user_name, passwd, permission, name, stu_number, json, permission_source){
  _lib_dayi_insert_user._lib_dayi_insert_user(db, user_name, passwd, permission, name)
}
// =============== 插入用户信息 =============== 


// =============== 授予权限 =============== 
async function dayi_grant_permission(sourceUser, targetUser, permission){
    _lib_dayi_grant_user._lib_dayi_grant_permission(db, sourceUser, targetUser, permission)
}
// =============== 授予权限 =============== 



exports.dayi_insert_user = dayi_insert_user
exports.dayi_grant_permission = dayi_grant_permission


exports.dayi_query_user_permisson = dayi_query_user_permisson;
exports.dayi_delete_file_sql = dayi_delete_file_sql;
exports.dayi_user_files = dayi_user_files;
exports.dayi_insert_file = dayi_insert_file;

exports.dayi_query_user = dayi_query_user;


exports.dayi_query_user_print_count = dayi_query_user_print_count;  //查询用户打印的次数
exports.dayi_insert_user_print_history = dayi_insert_user_print_history;  //插入用户的历史打印记录