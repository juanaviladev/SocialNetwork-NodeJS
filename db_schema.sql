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
VALUES('pawelchr@ucm.es','pass','Pawel Chruscinski','m','1985-12-05','Pennywise-01.png',20);

INSERT INTO profiles(email,pass,name,gender,dob,image, points)
VALUES('a@ucm.es','pass','Someone A','m','1990-07-21','Diablo-01.png',100);

INSERT INTO profiles(email,pass,name,gender,dob,image, points)
VALUES('b@ucm.es','pass','Someone B','o','1981-01-01','Mummy-01.png',0);

INSERT INTO profiles(email,pass,name,gender,dob,image, points)
VALUES('c@ucm.es','pass','Someone C','f','1986-06-30','Skull-01.png',50);

INSERT INTO profiles(email,pass,name,gender,dob,image, points)
VALUES('d@ucm.es','pass','Someone D','f','1975-02-15','Pinhead-01.png',400);

INSERT INTO profiles(email,pass,name,gender,dob,image, points)
VALUES('e@ucm.es','pass','Stranger','m','1975-03-27','Ghostface-01.png',150);

INSERT INTO friendships VALUES(1,2,0);
INSERT INTO friendships VALUES(1,3,1);
INSERT INTO friendships VALUES(1,4,2);
INSERT INTO friendships VALUES(1,5,2);

