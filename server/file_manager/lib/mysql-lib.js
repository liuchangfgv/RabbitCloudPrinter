//虽然名字是mysql-lib ,实际上是sqlite3

const sqlite = require('better-sqlite3');
var dayi_mysql_tables = require('./dayi-mysql-tables');

const db = sqlite('./collect_node.db');



// 创建 users 表
db.exec(`CREATE TABLE IF NOT EXISTS users (
  user_name TEXT PRIMARY KEY NOT NULL,
  permission INTEGER DEFAULT 1
)`);

// 创建 files 表
db.exec(`CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uuid TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  FOREIGN KEY(user_name) REFERENCES users(user_name) ON DELETE CASCADE
)`);


// 创建一个超级用户 admin
db.get('SELECT * FROM users WHERE user_name = ?', ['admin'], (err, row) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    if (!row) {
        db.run('INSERT INTO users (user_name, permission) VALUES (?, 9);', ['admin'], (err) => {
            if (err) {
                console.error(err.message);
                throw err;
            }
        });
    }
});



// 插入文件记录
function dayi_insert_file(file_path, user_name, file_uuid, file_size, file_name) {
  const stmt = db.prepare(`INSERT INTO files (user_name, file_path, uuid, file_size, file_name) VALUES (?, ?, ?, ?, ?)`);
  stmt.run(user_name, file_path, file_uuid, file_size, file_name);
}

// 插入用户记录
function dayi_insert_user(user_name) {
  const stmt = db.prepare(`INSERT INTO users (user_name, permission) VALUES (?, 1)`);
  stmt.run(user_name);
}

// 查询用户是否存在于数据库中
async function dayi_query_user(user_name) {
  const stmt = db.prepare(`SELECT * FROM users WHERE user_name = ?`);
  const row = stmt.get(user_name);
  return row != null;
}

// 查询用户的文件记录，如果指定了 file_uuid，则只返回对应文件的记录
async function dayi_user_files(user_name, file_uuid) {
  let sql = `SELECT * FROM files WHERE user_name = ?`;
  let values = [user_name];
  if (file_uuid != undefined) {
    sql += ` AND uuid = ?`;
    values = [user_name, file_uuid];
  }
  const stmt = db.prepare(sql);
  const rows = stmt.all(values);
  return rows;
}

// 删除文件记录
async function dayi_delete_file_sql(file_uuid) {
  const stmt = db.prepare(`DELETE FROM files WHERE uuid = ?`);
  stmt.run(file_uuid);
}

exports.dayi_query_user_permisson = (user_name) => {
  const stmt = db.prepare(`SELECT permission FROM users WHERE user_name = ?`);
  const row = stmt.get(user_name);
  return row.permission;
}



exports.dayi_delete_file_sql = dayi_delete_file_sql
exports.dayi_user_files = dayi_user_files
exports.dayi_insert_file = dayi_insert_file
exports.dayi_insert_user = dayi_insert_user
exports.dayi_query_user = dayi_query_user
