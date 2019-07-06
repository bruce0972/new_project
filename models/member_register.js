const db = require('./db_connection');

module.exports = function register(memberData) {
    let result = {};
    return new Promise((resolve, reject) => {
        // 尋找是否有重複的email
        db.query('SELECT email FROM member WHERE email = ?', memberData.email, function (err, rows) {
            // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
            if (err) {
                console.log(err);
                result.regStatus = "註冊失敗，伺服器錯誤，請稍後在試！";
                // result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }
            // 如果有重複的email
            if (rows.length >= 1) {
                result.regStatus = "註冊失敗，已有重複的Email";
                result.registerMember = memberData;
                // result.err = "已有重複的Email。";
                console.log(result);
                console.log("已有重複的Email。");
                reject(result);
                return;
            } else {
                // 將資料寫入資料庫
                let sql = 'INSERT INTO `member` (`name`, `email`, `password`, `create_date`) VALUES(?, ?, SHA1(?), ?);';
                db.query(sql, [memberData.name, memberData.email, memberData.password, memberData.create_date], function (err, rows) {
                    // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
                    if (err) {
                        console.log(err);
                        result.regStatus = "註冊失敗，伺服器錯誤，請稍後在試！";
                        // result.err = "伺服器錯誤，請稍後在試！"
                        reject(result);
                        return;
                    }
                    // 若寫入資料庫成功，則回傳給clinet端下：
                    result.regStatus = "註冊成功！";
                    result.registerMember = memberData;
                    resolve(result);
                })
            }
        })
    })
}