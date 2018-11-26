const db 	= require('../../../../config/sql').connect_perfectshoes()
const Hash 	= require('./hash');

const User = function (username, passphrase, mail, name, sampleFile) {
	return new Promise(async (resolve, reject) => {
		const hash = await Hash(passphrase);
		sql=`
		INSERT INTO 
			tb_users 
		SET 
			user_username 		= ?, 
			user_passphrase 	= ?, 
			user_firstname		= ?, 
			user_mail 			= ?, 
			user_img 			= ?
		`
		db.execute(sql, [username, hash, name, mail, sampleFile], (err, result) => {
			if (err) reject(err);
			resolve(true);
		});
	});
};

User.valid = function (username, passphrase) {
	return new Promise((resolve, reject) => {
		sql = `
		SELECT 
			user_id, 
			user_passphrase 
		FROM 
			tb_users 
		WHERE 
			user_username = ?
		`

		db.execute(sql, [username], async (err, result) => {
			if (err) reject(err);
			if (result[0] === undefined) reject('invalid stuffs');
			if (await Hash.compare(passphrase, result[0].user_passphrase)) {
				resolve(result[0].user_id);
			} else {
				reject('invalid passphrase or username');
			}
		});
	});
};

User.google = function () {};

User.google.findOrCreate = function (key, mail, firstname, lastname, img, displayName) {
	return new Promise ((resolve, reject) => {
		db.execute('SELECT google_gKey, google_user, google_displayname FROM tb_googleKeys WHERE google_gKey = ?', [key], (err, result) => {
			if (err) reject(err);
			if (result.length){
				resolve(result[0].google_gKey);
			} else {
				db.execute('INSERT INTO tb_googleKeys(google_gkey, google_mail, google_displayname) VALUES (?, ?, ?)', [key, mail, displayName], (err, record) => {
					if (err) reject(err);

					console.log('record=====',record.insertId)

					let googleId = record.insertId

					db.execute('SELECT google_gKey, google_user, google_displayname FROM tb_googleKeys WHERE google_id = ?', [googleId], (err, data) => {
						if (err) reject(err);

						console.log('data=====',data)
						resolve(data[0].google_gKey);

					});
				});
				let sqlProfile = `
				INSERT INTO
					tb_profiles
				SET
					profile_mail        = ?,
					profile_firstname   = ?,
					profile_lastname    = ?,
					profile_img         = ?,
					profile_username	= ?`;	

				db.execute(sqlProfile,[mail, firstname, lastname, img, displayName], (err,data)=>{
					if(err) reject(err);

				})
			}
		});
	}); 
};

module.exports = User;
