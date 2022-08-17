-- migrate:up
id INT NOT NULL AUTO_INCREMENT,
comment VARCHAR (2000),
posting_id INT NOT NULL,
user_id INT NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
PRIMARY KEY (id),
FOREIGN KEY (posting_id) REFERENCES postings (id),
FOREIGN KEY (user_id) REFERENCES users (id)

-- migrate:down

DROP TABLE comments;