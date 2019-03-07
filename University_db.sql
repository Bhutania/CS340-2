-- MySQL dump 10.13  Distrib 5.1.66, for redhat-linux-gnu (x86_64)
--
-- Host: mysql.eecs.oregonstate.edu    Database: CS340
-- ------------------------------------------------------
-- Server version	5.1.65-community-log

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


DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `major` varchar(3) DEFAULT NULL,
  `building` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY (`building`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`building`) REFERENCES `buildings` (`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `professor` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `college` varchar(5) NOT NULL,
  `tenured` int(1),
  `building` varchar(5),
  `boss` int(9),
  PRIMARY KEY (`id`),
  KEY (`building`),
  CONSTRAINT `professor_ibfk_1` FOREIGN KEY (`building`) REFERENCES `buildings` (`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `class` (
  `course_id` int(5) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(50) NOT NULL,
  `college` varchar(3) DEFAULT NULL,
  `professor` int(9) DEFAULT NULL,
  `building_name` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  KEY `professor` (`professor`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`professor`) REFERENCES `professor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `class_ibfk_2` FOREIGN KEY (`building_name`) REFERENCES `buildings` (`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bsg_cert_people`
--

DROP TABLE IF EXISTS `students_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students_classes` (
  `student_id` int(9) NOT NULL DEFAULT '0',
  `class_id` int(5) NOT NULL DEFAULT '0',
  PRIMARY KEY (`student_id`,`class_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `students_classes_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `students_classes_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `class` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `buildings`;
CREATE TABLE `buildings` (
  `name` varchar(5) NOT NULL,
  `rooms` int(5),
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


--
-- Dumping data for all tables
--

LOCK TABLES `buildings` WRITE;
INSERT INTO `buildings` VALUES ('AUST',5),('LINC',10),('KELLY',3),('HAW',15),('WFD',15),
('WEST',15),('WILSON',15);
UNLOCK TABLES;

LOCK TABLES `student` WRITE;
INSERT INTO `student` VALUES (100000001,'Alex Hamilton','CS','WEST'),(100000002,'Safi ','BIO','WILSON'),
(100000003,'Ekatya Ivanov','MRKT','WFD'),(100000004,'Lee Yang','UND','WILSON'),
(100000005,'Chris Marion','ME','HAW'),
(100000006,'Pavel ','ME','HAW'),(100000007,'Luis Voltre','MRKT','WEST');
UNLOCK TABLES;


LOCK TABLES `professor` WRITE;
INSERT INTO `professor` VALUES (100000001,'Julie Adams','CS','0','KELLY',NULL),
(100000002,'Houssam Anand','ME','1','KELLY',NULL),
(100000003,'Yue Chen','CS','0','LINC',NULL),(100000004,'Eduardo Garcias','ECE','1','KELLY',NULL),
(100000005,'Abby Cotilla','MRKT','1','AUST',NULL);
UNLOCK TABLES;


LOCK TABLES `class` WRITE;
INSERT INTO `class` VALUES (10001,'Intro to C','CS',100000001,'LINC'),
(10002,'Intro to Marketing','MRKT',100000005,'AUST'),
(10003,'Electrical Fundamentals','ECE',100000004,'KELLY'),
(10004,'Anatomy','BIO',NULL,'KELLY'),
(10005,'Business Writing','MRKT',NULL,'AUST');
UNLOCK TABLES;


LOCK TABLES `students_classes` WRITE;
INSERT INTO `students_classes` VALUES (100000001,10001),(100000002,10004),(100000003,10005),
(100000003,10002),(100000007,10002);
UNLOCK TABLES;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-02-04 12:54:40