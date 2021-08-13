CREATE TABLE users(id SERIAL PRIMARY KEY, user_name VARCHAR NOT NULL, user_type VARCHAR NOT NULL, password VARCHAR NOT NULL);

-- This manual insert is just to make it easier for testing usage --
INSERT INTO users (user_name, user_type, password) VALUES('Manager', 'admin', '$2b$10$mop9VnXsuAscXoqXffJQ3O53vuhrLPJVedqsnWhnvTZIzeKreZ/Ui');
INSERT INTO users (user_name, user_type, password) VALUES('Sales', 'user', '$2b$10$mop9VnXsuAscXoqXffJQ3O53vuhrLPJVedqsnWhnvTZIzeKreZ/Ui');
