INSERT INTO 
content("contentTitle","contentImg","contentBody","articleId")
VALUES
(?,?,?,(
    SELECT
last_insert_id()
    FROM
    article
))