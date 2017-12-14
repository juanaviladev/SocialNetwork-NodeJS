-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 14-12-2017 a las 00:39:38
-- Versión del servidor: 10.1.28-MariaDB
-- Versión de PHP: 7.1.11

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
(10, 1, 'No me interesan los videojuegos'),
(11, 2, 'Mentiras y gordas'),
(12, 2, 'Borat'),
(13, 2, 'Titanic'),
(14, 2, 'Avatar'),
(15, 2, 'Lío embarazoso'),
(16, 4, 'Hamburguesa'),
(17, 4, 'Macarrones'),
(19, 4, 'Ensalada'),
(20, 4, 'Caca'),
(21, 9, 'Madrid'),
(22, 9, 'Barcelona'),
(23, 9, 'Murcia'),
(24, 11, 'Real Madrid'),
(25, 11, 'Barcelona'),
(26, 11, 'Valencia'),
(27, 6, 'Perro'),
(28, 6, 'Gato'),
(29, 6, 'León'),
(30, 6, 'Humano'),
(31, 1, 'Esto es una respuesta personalizada'),
(32, 6, 'Rinoceronte'),
(33, 9, 'Albacete'),
(34, 7, 'Rick'),
(35, 7, 'Morty'),
(36, 7, 'Summer'),
(37, 11, 'Sevilla'),
(38, 12, 'Ordenador'),
(39, 12, 'Móvil'),
(40, 12, 'Cuñado'),
(41, 12, 'Perro'),
(42, 13, 'Westworld'),
(43, 13, 'Juego de tronos'),
(44, 13, 'Los Serrano'),
(45, 14, 'Mi casa es la tuya'),
(46, 14, 'Grand Prix'),
(47, 14, 'La ruleta de la suerte'),
(48, 14, 'Gran Hermano');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `custom_answer`
--

CREATE TABLE `custom_answer` (
  `answer_id` int(11) NOT NULL,
  `owner` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `custom_answer`
--

INSERT INTO `custom_answer` (`answer_id`, `owner`) VALUES
(20, 1),
(32, 1),
(41, 1),
(48, 1),
(31, 2),
(33, 2),
(37, 2);

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
(1, 2, 'accepted'),
(4, 1, 'accepted'),
(1, 3, 'pending'),
(2, 6, 'pending');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `guess_answer`
--

CREATE TABLE `guess_answer` (
  `guess_user` int(11) NOT NULL,
  `of_user` int(11) NOT NULL,
  `answer` int(11) NOT NULL,
  `status` enum('correct','wrong') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `guess_answer`
--

INSERT INTO `guess_answer` (`guess_user`, `of_user`, `answer`, `status`) VALUES
(2, 1, 20, 'correct'),
(2, 1, 24, 'correct'),
(2, 1, 31, 'wrong'),
(2, 1, 48, 'correct'),
(4, 1, 36, 'wrong'),
(1, 2, 10, 'wrong'),
(1, 2, 13, 'correct'),
(1, 2, 20, 'wrong'),
(1, 2, 32, 'correct'),
(1, 2, 33, 'correct'),
(1, 2, 35, 'correct'),
(1, 2, 37, 'correct'),
(1, 2, 46, 'wrong');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `question`
--

CREATE TABLE `question` (
  `id` int(11) NOT NULL,
  `text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `question`
--

INSERT INTO `question` (`id`, `text`) VALUES
(2, '¿Cuál es la peor película de la historia?'),
(6, '¿Cuál es tu animal favorito?'),
(9, '¿Cuál es tu ciudad favorita?'),
(7, '¿Cuál es tu personaje favorito de Rick y Morty?'),
(4, '¿Cuál es tu plato favorito?'),
(14, '¿Cuál es tu programa de TV favorito?'),
(13, '¿Cual es tu serie favorita?'),
(11, '¿De qué equipo de fútbol eres fan?'),
(1, '¿Nintendo Switch, PS4 o Xbox One?'),
(12, '¿Que te llevarias a una isla desierta?');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `self_answer`
--

CREATE TABLE `self_answer` (
  `user` int(11) NOT NULL,
  `selected_answer` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `self_answer`
--

INSERT INTO `self_answer` (`user`, `selected_answer`) VALUES
(1, 10),
(1, 20),
(1, 21),
(1, 24),
(1, 32),
(1, 35),
(1, 41),
(1, 42),
(1, 48),
(2, 13),
(2, 17),
(2, 31),
(2, 32),
(2, 33),
(2, 35),
(2, 37),
(2, 47);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('BnOTo2OevadD9uZk7f8Vo_Wk00jmnPf7', 1513294593, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":1}');

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
  `dob` date DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `points` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `email`, `pass`, `name`, `gender`, `dob`, `image`, `points`) VALUES
(1, 'penny@ucm.es', 'mypass', 'Pennywise the Dancing Clown', 'other', '1986-09-15', 'Pennywise-01.png', 320),
(2, 'diablo@ucm.es', 'mypass', 'Diablo the Lord of Terror', 'male', '1996-12-31', 'Diablo-01.png', 200),
(3, 'mummy@ucm.es', 'mypass', 'Ancient Mummy', 'female', '1956-05-04', 'Mummy-01.png', 0),
(4, 'skull@ucm.es', 'mypass', 'Skeleton King', 'male', '1985-12-05', 'Skull-01.png', 50),
(5, 'pinhead@ucm.es', 'mypass', 'Pinhead the Cenobite', 'male', '1987-11-06', 'Pinhead-01.png', 400),
(6, 'ghostface@ucm.es', 'mypass', 'Casper Ghostface', 'male', '1945-11-16', 'Ghostface-01.png', 150);

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
-- Indices de la tabla `guess_answer`
--
ALTER TABLE `guess_answer`
  ADD PRIMARY KEY (`of_user`,`guess_user`,`answer`),
  ADD KEY `answer` (`answer`),
  ADD KEY `guess_user` (`guess_user`,`of_user`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `text` (`text`);

--
-- Indices de la tabla `self_answer`
--
ALTER TABLE `self_answer`
  ADD PRIMARY KEY (`user`,`selected_answer`),
  ADD KEY `response` (`selected_answer`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `answer`
--
ALTER TABLE `answer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`question`) REFERENCES `question` (`id`);

--
-- Filtros para la tabla `custom_answer`
--
ALTER TABLE `custom_answer`
  ADD CONSTRAINT `custom_answer_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `custom_answer_ibfk_2` FOREIGN KEY (`answer_id`) REFERENCES `answer` (`id`);

--
-- Filtros para la tabla `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `friendships_ibfk_1` FOREIGN KEY (`from_user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `friendships_ibfk_2` FOREIGN KEY (`to_user`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `guess_answer`
--
ALTER TABLE `guess_answer`
  ADD CONSTRAINT `guess_answer_ibfk_1` FOREIGN KEY (`answer`) REFERENCES `answer` (`id`),
  ADD CONSTRAINT `guess_answer_ibfk_2` FOREIGN KEY (`guess_user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `guess_answer_ibfk_3` FOREIGN KEY (`of_user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `guess_answer_ibfk_4` FOREIGN KEY (`answer`) REFERENCES `answer` (`id`);

--
-- Filtros para la tabla `self_answer`
--
ALTER TABLE `self_answer`
  ADD CONSTRAINT `self_answer_ibfk_2` FOREIGN KEY (`selected_answer`) REFERENCES `answer` (`id`),
  ADD CONSTRAINT `self_answer_ibfk_3` FOREIGN KEY (`user`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
