-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 06-12-2017 a las 11:30:17
-- Versión del servidor: 10.1.28-MariaDB
-- Versión de PHP: 7.1.11


DROP TABLE IF EXISTS correct_answer;
DROP TABLE IF EXISTS custom_answer;
DROP TABLE IF EXISTS user_answer;
DROP TABLE IF EXISTS answer;
DROP TABLE IF EXISTS question;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS users;



SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `facebluff`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answer`
--

CREATE TABLE `answer` (
  `id` int(11) NOT NULL,
  `question` int(11) NOT NULL,
  `text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `answer`
--

INSERT INTO `answer` (`id`, `question`, `text`) VALUES
(1, 1, 'Nintendo Switch'),
(2, 1, 'PS4'),
(9, 1, 'Xbox One'),
(10, 1, 'No me interesan los videojuegos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `correct_answer`
--

CREATE TABLE `correct_answer` (
  `user` int(11) NOT NULL,
  `response` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `correct_answer`
--

INSERT INTO `correct_answer` (`user`, `response`) VALUES
(1, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `custom_answer`
--

CREATE TABLE `custom_answer` (
  `answer_id` int(11) NOT NULL,
  `owner` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `friendships`
--

CREATE TABLE `friendships` (
  `from_user` int(11) NOT NULL,
  `to_user` int(11) NOT NULL,
  `status` enum('accepted','pending') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `friendships`
--

INSERT INTO `friendships` (`from_user`, `to_user`, `status`) VALUES
(1, 2, 'accepted'), (1, 3, 'pending'), (4, 1, 'pending'), (5, 1, 'pending');
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `question`
--

CREATE TABLE `question` (
  `id` int(11) NOT NULL,
  `text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `question`
--

INSERT INTO `question` (`id`, `text`) VALUES
(1, '¿Nintendo Switch, PS4 o Xbox One?');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `name` varchar(150) NOT NULL,
  `gender` enum('female','male','other') NOT NULL,
  `dob` date,
  `image` varchar(255),
  `points` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`,`email`, `pass`, `name`, `gender`, `dob`,
    `image`, `points`) VALUES
(1,'penny@ucm.es', 'mypass', 'Pennywise the Dancing Clown', 'other',
    '1986-9-15', 'Pennywise-01.png', 20),
(2,'diablo@ucm.es', 'mypass', 'Diablo the Lord of Terror', 'male',
    '1996-12-31', 'Diablo-01.png', 100),
(3,'mummy@ucm.es', 'mypass', 'Ancient Mummy', 'female',
    '1956-5-4', 'Mummy-01.png', 0),
(4,'skull@ucm.es', 'mypass', 'Skeleton King', 'male',
    '1985-12-5', 'Skull-01.png', 50),
(5,'pinhead@ucm.es', 'mypass', 'Pinhead the Cenobite', 'male',
    '1987-11-6', 'Pinhead-01.png', 400),
(6,'ghostface@ucm.es', 'mypass', 'Casper Ghostface', 'male',
    '1945-11-16', 'Ghostface-01.png', 150);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_answer`
--

CREATE TABLE `user_answer` (
  `user` int(11) NOT NULL,
  `answer` int(11) NOT NULL,
  `status` enum('wrong','correct') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `user_answer`
--

INSERT INTO `user_answer` (`user`, `answer`, `status`) VALUES
(1, 10, 'correct');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `answer`
--
ALTER TABLE `answer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question` (`question`);

--
-- Indices de la tabla `correct_answer`
--
ALTER TABLE `correct_answer`
  ADD PRIMARY KEY (`user`,`response`),
  ADD KEY `response` (`response`);

--
-- Indices de la tabla `custom_answer`
--
ALTER TABLE `custom_answer`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `owner` (`owner`);

--
-- Indices de la tabla `friendships`
--
ALTER TABLE `friendships`
  ADD PRIMARY KEY (`from_user`,`to_user`),
  ADD KEY `to_user` (`to_user`),
  ADD KEY `status` (`status`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `user_answer`
--
ALTER TABLE `user_answer`
  ADD PRIMARY KEY (`user`,`answer`),
  ADD KEY `answer` (`answer`),
  ADD KEY `status` (`status`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `answer`
--
ALTER TABLE `answer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`question`) REFERENCES `question`
  (`id`);

--
-- Filtros para la tabla `correct_answer`
--
ALTER TABLE `correct_answer`
  ADD CONSTRAINT `correct_answer_ibfk_2` FOREIGN KEY (`response`) REFERENCES
  `answer` (`id`),
  ADD CONSTRAINT `correct_answer_ibfk_3` FOREIGN KEY (`user`) REFERENCES
  `users` (`id`);

--
-- Filtros para la tabla `custom_answer`
--
ALTER TABLE `custom_answer`
  ADD CONSTRAINT `custom_answer_ibfk_1` FOREIGN KEY (`owner`) REFERENCES
  `users` (`id`),
  ADD CONSTRAINT `custom_answer_ibfk_2` FOREIGN KEY (`answer_id`) REFERENCES
  `answer` (`id`);

--
-- Filtros para la tabla `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `friendships_ibfk_1` FOREIGN KEY (`from_user`) REFERENCES
  `users` (`id`),
  ADD CONSTRAINT `friendships_ibfk_2` FOREIGN KEY (`to_user`) REFERENCES
  `users` (`id`);

--
-- Filtros para la tabla `user_answer`
--
ALTER TABLE `user_answer`
  ADD CONSTRAINT `user_answer_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users`
  (`id`),
  ADD CONSTRAINT `user_answer_ibfk_2` FOREIGN KEY (`answer`) REFERENCES
  `answer` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
