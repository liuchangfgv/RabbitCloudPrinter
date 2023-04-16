//not mysql is sqlite
//表面上是mysql，实际上是为了兼容原先的代码，文件名和函数名都是mysql，实际上是sqlite

const sqlite = require('better-sqlite3');
const dayi_mysql_tables = require('./dayi-mysql-tables');

const db = sqlite('collect_node.db');

// 数据库连接
try {
    db.exec('SELECT 1 + 1 AS solution');
    console.log('[dayi-info] SQLite connect successfully, so 1 + 1 = 2');
} catch (error) {
    console.log("[dayi-error]Could not connect to SQLite database.");
    console.log("[dayi-error]The error is: ", error.message);
    process.exit(1);
}

// 创建表格
function dayi_create_tables() {
    try {
        db.exec(dayi_mysql_tables.sql_table_1);
        console.log('[dayi-info] Table 1 created successfully');
        db.exec(dayi_mysql_tables.sql_table_2);
        console.log('[dayi-info] Table 2 created successfully');
        db.exec(dayi_mysql_tables.sql_table_3);
        console.log('[dayi-info] Table 3 created successfully');
    } catch (error) {
        console.log('[dayi-error] Error creating tables:', error.message);
    }
}

// 插入文件信息
function dayi_insert_file(file_path, user_name, file_uuid, file_size, file_name) {
    const stmt = db.prepare('INSERT INTO files (user_name, file_path, uuid, file_size, file_name) VALUES (?, ?, ?, ?, ?)');
    try {
        stmt.run(user_name, file_path, file_uuid, file_size, file_name);
    } catch (error) {
        console.log('[dayi-error] Error inserting file:', error.message);
    }
}

// 插入用户信息
function dayi_insert_user(user_name) {
    const stmt = db.prepare('INSERT INTO users (user_name, permission) VALUES (?, ?)');
    try {
        stmt.run(user_name, 1);
    } catch (error) {
        console.log('[dayi-error] Error inserting user:', error.message);
    }
}

// 查询用户是否存在于数据库中
async function dayi_query_user(user_name) {
    const stmt = db.prepare('SELECT * FROM users WHERE user_name = ?');
    try {
        const result = stmt.all(user_name);
        return result.length >= 1;
    } catch (error) {
        console.log('[dayi-error] Error querying user:', error.message);
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
        console.log('[dayi-error] Error querying user files:', error.message);
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
        console.log('[dayi-error] Error deleting file:', error.message);
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
        console.log('[dayi-error] Error querying user permission:', error.message);
        return 0;
    }
}

dayi_create_tables();

exports.dayi_query_user_permisson = dayi_query_user_permisson;
exports.dayi_delete_file_sql = dayi_delete_file_sql;
exports.dayi_user_files = dayi_user_files;
exports.dayi_insert_file = dayi_insert_file;
exports.dayi_insert_user = dayi_insert_user;
exports.dayi_query_user = dayi_query_user;