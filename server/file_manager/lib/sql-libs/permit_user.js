const logger = require('../log_it');
const mysql_lib = require('../mysql-lib');

async function _lib_dayi_grant_permission(db, sourceUser, targetUser, permission) {
  try {
    // 获取源用户的权限
    const sourceUserPermission = await mysql_lib.dayi_query_permission(sourceUser);
    // 获取目标用户的权限
    const targetUserPermission = await mysql_lib.dayi_query_permission(targetUser);

    // 如果目标用户的权限小于或等于源用户的权限，执行授权
    if (targetUserPermission <= sourceUserPermission) {
      const stmt = db.prepare(
        'UPDATE users SET permission = ?, permission_source = ? WHERE user_name = ?'
      );
      stmt.run(targetUserPermission + permission, sourceUser, targetUser);
      logger.log_info(`User ${sourceUser} granted permission to user ${targetUser}`);
    } else {
      logger.log_info(`User ${sourceUser} failed to grant permission to user ${targetUser}: target user's permission is greater than source user's permission`);
    }
  } catch (error) {
    logger.log_error('[dayi-error] Error granting permission:', error.message);
  }
}

exports._lib_dayi_grant_permission = _lib_dayi_grant_permission;
