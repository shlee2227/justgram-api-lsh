-- migrate:up
id INT NOT NULL AUTO_INCREMENT,
user_id INT NOT NULL,
title VARCHAR (300),
contents VARCHAR (2000),
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
PRIMARY KEY (id),
FOREIGN KEY (user_id) REFERENCES users (id)

-- migrate:down

DROP TABLE postings;