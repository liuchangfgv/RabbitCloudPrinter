const logger = require('../log_it');

async function _lib_dayi_insert_user(db, user_name, passwd = null, permission = 0, name = null, stu_number = null, json = null, permission_source = -1) {
  const stmt = db.prepare(
    'INSERT INTO users (user_name, passwd, permission, name, stu_number, json, permission_source) VALUES (?, ?, ?, ?, ?, ?, ?)');
  try {
    stmt.run(user_name, passwd, permission, name, stu_number, json, permission_source);
  } catch (error) {
    logger.log_error('[dayi-error] Error inserting user:', error.message);
  }
}


exports._lib_dayi_insert_user= _lib_dayi_insert_user