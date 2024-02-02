CREATE TABLE users{
    id SERIAL AUTO INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    min_age SMALLINT CHECK (min_age >= 0),
    max_age SMALLINT CHECK (max_age >= min_age AND max_age <= 120),
    college-name VARCHAR(100),
    test-attended ARRAY
};

CREATE TABLE user_token (
    id SERIAL AUTO INCREMENT PRIMARY KEY,
    token VARCHAR NOT NULL,
    fk_user BIGINT NOT NULL,
    created_at TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY(fk_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE admins (
    id SERIAL AUTO INCREMENT PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL
);

CREATE TABLE admin_token (
    id SERIAL AUTO INCREMENT PRIMARY KEY,
    token VARCHAR NOT NULL,
    fk_admin INT NOT NULL,
    created_at TIMESTAMP,
    CONSTRAINT fk_admin FOREIGN KEY(fk_admin) REFERENCES admins(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE questions{
    id SERIAL AUTO INCREMENT PRIMARY KEY,
    title VARCHAR(50),
    description VARCHAR(10000),
    option VARCHAR(1000),
    answer VARCHAR(10),
    tag VARCHAR(50),
    -- array of tests id having this question
};

CREATE TABLE tests{
    id SERIAL AUTO INCREMENT PRIMARY KEY,
    questions ARRAY
};

CREATE TABLE result{
    id SERIAL AUTO INCREMENT PRIMARY KEY,
    -- fk_testId, have to write the relation for foreign keys
    -- fk_userId, have to write the relation for foreign keys
    -- tag: result
};