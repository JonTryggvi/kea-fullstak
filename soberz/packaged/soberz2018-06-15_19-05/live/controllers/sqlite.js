const dataQueries = {}

dataQueries.createTable = function () {
  const query = `BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS 'user_roles' (
	'role_id'	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	'role_name'	TEXT NOT NULL
);
INSERT INTO 'user_roles' (role_id,role_name) VALUES (1,'Admin');
INSERT INTO 'user_roles' (role_id,role_name) VALUES (2,'User');
INSERT INTO 'user_roles' (role_id,role_name) VALUES (3,'Guest');
CREATE TABLE IF NOT EXISTS 'sponsor_inquiries' (
	'sponsor_inquiries_id'	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	'who_is_asking'	INTEGER,
	'who_is_asked'	INTEGER,
	'date'	TEXT,
	'accepted'	INTEGER DEFAULT NULL
);
INSERT INTO 'sponsor_inquiries' (sponsor_inquiries_id,who_is_asking,who_is_asked,date,accepted) VALUES (64,22,43,'1528016658199.0',NULL);
INSERT INTO 'sponsor_inquiries' (sponsor_inquiries_id,who_is_asking,who_is_asked,date,accepted) VALUES (65,43,22,'1528016706177.0',NULL);
INSERT INTO 'sponsor_inquiries' (sponsor_inquiries_id,who_is_asking,who_is_asked,date,accepted) VALUES (67,44,22,'1528037234199.0',NULL);
CREATE TABLE IF NOT EXISTS 'genders' (
	'id'	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	'gender_name'	TEXT
);
INSERT INTO 'genders' (id,gender_name) VALUES (1,'Male');
INSERT INTO 'genders' (id,gender_name) VALUES (2,'Female');
INSERT INTO 'genders' (id,gender_name) VALUES (3,'Other');
INSERT INTO 'genders' (id,gender_name) VALUES (4,'Bamby');
INSERT INTO 'genders' (id,gender_name) VALUES (5,'Zombie');
CREATE TABLE IF NOT EXISTS 'Users' (
	'id'	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	'firstname'	TEXT NOT NULL,
	'lastname'	TEXT NOT NULL,
	'username'	TEXT NOT NULL,
	'email'	TEXT NOT NULL,
	'mobile'	TEXT NOT NULL,
	'gender'	NUMERIC,
	'sponsor'	BLOB,
	'imgUrl'	TEXT DEFAULT '{}',
	'user_role'	INTEGER NOT NULL DEFAULT 2,
	'password'	TEXT NOT NULL,
	'sponsees'	TEXT DEFAULT '[]',
	'sponsors'	TEXT DEFAULT '[]',
	'about'	TEXT,
	'date'	TEXT,
	'online'	TEXT DEFAULT 0,
	'activated'	INTEGER DEFAULT 0,
	'code'	INTEGER,
	'pending_sponsor_request'	TEXT DEFAULT '[]',
	'sent_sponsor_request'	TEXT DEFAULT '[]',
	FOREIGN KEY('gender') REFERENCES 'genders'('id')
);
INSERT INTO 'Users' (id,firstname,lastname,username,email,mobile,gender,sponsor,imgUrl,user_role,password,sponsees,sponsors,about,date,online,activated,code,pending_sponsor_request,sent_sponsor_request) VALUES (22,'Jón','Unnarsso','JT','jontryggvi@jontryggvi.is','+4541888890',5,1,'{ "imgPath":  "/uploads/img/upload_6050dbbd57b96f584d250569bbda0435.JPG", "imgId": "upload_6050dbbd57b96f584d250569bbda0435" }',1,'123#$%','[]','[]','This is me in a nutshell','2018-05-16 22:21:45 +02:00','1',1,6780,'[65,67,70]','[64]');
INSERT INTO 'Users' (id,firstname,lastname,username,email,mobile,gender,sponsor,imgUrl,user_role,password,sponsees,sponsors,about,date,online,activated,code,pending_sponsor_request,sent_sponsor_request) VALUES (43,'Elvis','Prestley','TheKing','jontryggvi@jontryggvi.is','+4541888890',5,1,'{ "imgPath":  "/uploads/img/upload_a820c2a62a302f2a7ac4c3bc95356216.png", "imgId": "upload_a820c2a62a302f2a7ac4c3bc95356216" }',2,'123###$$$','[22]','[]',NULL,'2018-05-31 16:38:38 +02:00','0',1,6124,'[64]','[65]');
INSERT INTO 'Users' (id,firstname,lastname,username,email,mobile,gender,sponsor,imgUrl,user_role,password,sponsees,sponsors,about,date,online,activated,code,pending_sponsor_request,sent_sponsor_request) VALUES (44,'Harry','Klein','dirtyHarry','jontryggvi@jontryggvi.is','+4541888890',1,0,'{ "imgPath":  "/uploads/img/upload_0695420c0c9c7f1e61d06cd9aa669ebe.JPG", "imgId": "upload_0695420c0c9c7f1e61d06cd9aa669ebe" }',2,'123$$$###','[]','[]',NULL,'2018-06-03 15:24:44 +02:00','0',1,897,'[]','[67]');
INSERT INTO 'Users' (id,firstname,lastname,username,email,mobile,gender,sponsor,imgUrl,user_role,password,sponsees,sponsors,about,date,online,activated,code,pending_sponsor_request,sent_sponsor_request) VALUES (45,'Jón Tryggvi','Unnarsson','louie louie','jontryggvi@jontryggvi.is','+4541888890',4,1,'{ "imgPath":  "/uploads/img/upload_e2807f94b58d81f51317b7ac93a2d8e3.JPG", "imgId": "upload_e2807f94b58d81f51317b7ac93a2d8e3" }',2,'321%$#','[]','[]',NULL,'2018-06-03 19:19:09 +02:00','0',0,7089,'[]','[70]');
CREATE UNIQUE INDEX IF NOT EXISTS 'uniq_request' ON 'sponsor_inquiries' (
	'who_is_asking',
	'who_is_asked'
);
CREATE TRIGGER update_pending_users AFTER INSERT ON sponsor_inquiries
BEGIN
UPDATE Users
SET pending_sponsor_request = json_insert(pending_sponsor_request,"$[" || json_array_length(pending_sponsor_request) || "]", NEW.sponsor_inquiries_id)
WHERE id = NEW.who_is_asked;
UPDATE Users
SET sent_sponsor_request = json_insert(sent_sponsor_request, "$[" || json_array_length(sent_sponsor_request) || "]", NEW.sponsor_inquiries_id)
WHERE id = NEW.who_is_asking;
END;
COMMIT;` 

  gDb.exec(query, function (err) {
    if (err) {
      gLog('err', 'File -> controllers/sqlite.js -> function createTable failed to execute: ' + err);
      return true
    }
    gLog('ok', 'File -> controllers/sqlite.js -> function createTable successfully executed') 
    return false
  })
  gDb.close() 
}


module.exports = dataQueries

  