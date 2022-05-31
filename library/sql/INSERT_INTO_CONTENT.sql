INSERT INTO 
content(`contentTitle`,`contentImg`,`contentBody`,`orderNumber`,`articleId`)
VALUES
(?,?,?,?,(SELECT LAST_INSERT_ID()));