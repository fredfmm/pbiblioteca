-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: biblioteca
-- ------------------------------------------------------
-- Server version	5.7.18-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tab_estado`
--

DROP TABLE IF EXISTS `tab_estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tab_estado` (
  `id_estado` int(11) NOT NULL AUTO_INCREMENT,
  `nome_estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab_estado`
--

LOCK TABLES `tab_estado` WRITE;
/*!40000 ALTER TABLE `tab_estado` DISABLE KEYS */;
INSERT INTO `tab_estado` VALUES (1,'Ótimo'),(2,'Bom'),(3,'Ruim'),(4,'Regular');
/*!40000 ALTER TABLE `tab_estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tab_livro`
--

DROP TABLE IF EXISTS `tab_livro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tab_livro` (
  `id_livro` int(11) NOT NULL AUTO_INCREMENT,
  `nome_livro` varchar(50) NOT NULL,
  `autor_livro` varchar(50) NOT NULL,
  `editora_livro` varchar(50) NOT NULL,
  `ano_livro` varchar(50) NOT NULL,
  `ativo_livro` tinyint(1) DEFAULT '0',
  `disponivel_livro` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_livro`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab_livro`
--

LOCK TABLES `tab_livro` WRITE;
/*!40000 ALTER TABLE `tab_livro` DISABLE KEYS */;
INSERT INTO `tab_livro` VALUES (1,'Os Lusíadas','Luís de Camões','Melhoramentos','1920',0,0,'2018-06-28 04:17:36'),(2,'Poemas de Olavo Bilac','Olavo Bilac','Universal','1954',0,0,'2018-06-28 04:18:03'),(3,'Marília de Dirceu','Tomás Antônio Gonzaga','Moderna','1925',0,0,'2018-06-28 04:18:29'),(4,'O Primo Basílio','Eça de Queirós','Continental','1876',0,0,'2018-06-28 04:18:56'),(5,'Memórias Póstumas de Brás Cubas','Machado de Assis','Melhoramentos','1987',0,0,'2018-06-28 04:19:24'),(6,'Brás, Bexiga e Barra Funda','Antônio de Alcântara Machado','Moderna','1845',0,0,'2018-06-28 04:20:14');
/*!40000 ALTER TABLE `tab_livro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tab_opiniao`
--

DROP TABLE IF EXISTS `tab_opiniao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tab_opiniao` (
  `id_opiniao` int(11) NOT NULL AUTO_INCREMENT,
  `livro_opiniao` int(11) NOT NULL,
  `estado_opiniao` int(11) NOT NULL,
  `nota_opiniao` int(11) NOT NULL,
  `observacao_opiniao` varchar(256) DEFAULT NULL,
  `usuario_opiniao` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_opiniao`),
  KEY `livro_idx` (`livro_opiniao`),
  KEY `usuario_idx` (`usuario_opiniao`),
  KEY `estado_idx` (`estado_opiniao`),
  CONSTRAINT `estado` FOREIGN KEY (`estado_opiniao`) REFERENCES `tab_estado` (`id_estado`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `livro` FOREIGN KEY (`livro_opiniao`) REFERENCES `tab_livro` (`id_livro`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `usuario` FOREIGN KEY (`usuario_opiniao`) REFERENCES `tab_usuario` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab_opiniao`
--

LOCK TABLES `tab_opiniao` WRITE;
/*!40000 ALTER TABLE `tab_opiniao` DISABLE KEYS */;
INSERT INTO `tab_opiniao` VALUES (31,1,1,9,'Livro muito bom!',4,'2018-06-28 04:21:34');
/*!40000 ALTER TABLE `tab_opiniao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tab_usuario`
--

DROP TABLE IF EXISTS `tab_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tab_usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `login_usuario` varchar(45) NOT NULL,
  `email_usuario` varchar(255) NOT NULL,
  `nome_usuario` varchar(255) NOT NULL,
  `nivel_usuario` tinyint(1) DEFAULT '0',
  `senha_usuario` varchar(255) DEFAULT NULL,
  `ativo_usuario` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab_usuario`
--

LOCK TABLES `tab_usuario` WRITE;
/*!40000 ALTER TABLE `tab_usuario` DISABLE KEYS */;
INSERT INTO `tab_usuario` VALUES (1,'admin','admin@mail.com','Admin',1,'$2b$10$rUIcmLYy/JXXB5D2SiWBzOwQjUdcJDbmpVBuDkzWjXijrnITRfDVe',0,'2018-06-28 04:10:58'),(2,'laura','laura@mail.com','Laura',0,'$2b$10$do9XSlHoPUl3hrvGcG3/K.OgoDLkQHTKewN4sFkRba6pZ7QHdBk1a',0,'2018-06-28 04:10:58'),(3,'joao','joao@mail.com','joao',0,'$2b$10$do9XSlHoPUl3hrvGcG3/K.OgoDLkQHTKewN4sFkRba6pZ7QHdBk1a',0,'2018-06-28 04:10:58'),(4,'fred','fred@mail.com','Frederico',0,'$2b$10$uurfC2WsII.KkofOXunzN.0l.i4TAUe2TEktOMC1e0h.kgOvwUbiG',0,'2018-06-28 04:10:58');
/*!40000 ALTER TABLE `tab_usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-06-28  1:23:42
