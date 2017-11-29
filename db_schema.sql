DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS friendships;

CREATE TABLE profiles(
    email varchar(100) PRIMARY KEY,
	pass varchar(100) NOT NULL,
	name varchar(100) NOT NULL,
	gender varchar(10) NOT NULL,
	dob DATE,
	image varchar(100)
);

CREATE TABLE friendships(
  	user1 varchar(100) REFERENCES profiles(email) ON DELETE CASCADE,
    user2 varchar(100) REFERENCES profiles(email) ON DELETE CASCADE,
    status int NOT NULL,
    PRIMARY KEY(user1, user2)
);