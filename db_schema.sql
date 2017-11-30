DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS friendships;

CREATE TABLE profiles(
    id int(11) PRIMARY KEY AUTO_INCREMENT,
    email varchar(100) UNIQUE NOT NULL,
	pass varchar(100) NOT NULL,
	name varchar(100) NOT NULL,
	gender varchar(10) NOT NULL,
	dob DATE,
	image varchar(100),
	points int(11) NOT NULL DEFAULT 0
);

CREATE TABLE friendships(
  	user1 int(11) REFERENCES profiles(id) ON DELETE CASCADE,
    user2 int(11) REFERENCES profiles(id) ON DELETE CASCADE,
    status int(11) NOT NULL,
    PRIMARY KEY(user1, user2)
);

INSERT INTO profiles(email,pass,name,gender,dob,image, points)
VALUES('pawelchr@ucm.es','morgana','Pawel Chruscinski','male','1985-12-05','Pennywise-01.png',20);