-- migrate:up

id INT NOT NULL AUTO_INCREMENT,
email VARCHAR (100) NOT NULL, 
nickname VARCHAR (50),
password VARCHAR (300) NOT NULL,
profile_image VARCHAR (3000),
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
PRIMARY KEY (id)

-- migrate:down

DROP TABLE users;