-- migrate:up
id INT NOT NULL AUTO_INCREMENT,
posting_id INT NOT NULL,
image_url VARCHAR (3000),
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
PRIMARY KEY (id),
FOREIGN KEY (posting_id) REFERENCES postings (id)

-- migrate:down

DROP TABLE posting_images;