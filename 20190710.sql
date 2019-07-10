-- MySQL dump 10.13  Distrib 8.0.16, for macos10.14 (x86_64)
--
-- Host: localhost    Database: shopping_cart
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `member` (
  `member_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `id` varchar(15) DEFAULT NULL,
  `birthday` varchar(15) DEFAULT NULL,
  `phonenumber` varchar(45) DEFAULT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(200) NOT NULL,
  `address` varchar(45) DEFAULT NULL,
  `update_date` datetime DEFAULT NULL,
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'Bruce','F127147222','1988-05-08','0972896677','bruce0972@yahoo.com.tw','7110eda4d09e062aa5e4a390b0a572ac0d2c0220','新北市淡水區',NULL,'2019-06-28 09:54:26'),(52,'Bruce','F125130783','2000-01-01','0933456789','bruce0972896677@gmail.com','7110eda4d09e062aa5e4a390b0a572ac0d2c0220','台北市大安區',NULL,'2019-07-07 13:15:55'),(55,'盧泉霖',NULL,NULL,NULL,'fffe0972896677@gmail.com','7110eda4d09e062aa5e4a390b0a572ac0d2c0220',NULL,NULL,'2019-07-10 00:01:57');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_list`
--

DROP TABLE IF EXISTS `order_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `order_list` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(100) DEFAULT NULL,
  `order_quantity` int(10) NOT NULL,
  `order_price` decimal(10,2) NOT NULL,
  `is_complete` int(5) DEFAULT NULL,
  `update_date` datetime DEFAULT NULL,
  `order_date` datetime NOT NULL,
  PRIMARY KEY (`order_id`,`member_id`,`product_id`),
  KEY `order_list_ibfk_1_idx` (`member_id`),
  CONSTRAINT `order_list_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_list`
--

LOCK TABLES `order_list` WRITE;
/*!40000 ALTER TABLE `order_list` DISABLE KEYS */;
INSERT INTO `order_list` VALUES (1,52,4,'娃娃',1,277.00,NULL,NULL,'2019-07-10 22:59:39');
/*!40000 ALTER TABLE `order_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `price` decimal(5,2) NOT NULL,
  `quantity` int(10) NOT NULL,
  `category` varchar(20) DEFAULT NULL,
  `img` longblob,
  `img_name` varchar(20) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `update_date` datetime DEFAULT NULL,
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'樂事波樂洋芋片',20.00,41,'食品',NULL,NULL,'樂事波樂洋芋片-香酥雞腿(43g) 風靡全球no.1洋芋片品牌 樂事只選用當令新鮮馬鈴薯，鮮切成金黃香脆洋芋片',NULL,'2018-01-01 00:00:00'),(2,'卡迪那德州薯條茄汁',25.00,-4,'食品',NULL,NULL,'酸甜茄汁x濃郁薯香卡迪那德州薯條茄汁54G ✓ 德州薯條是收服味覺最厲害的超級牛仔 ✓ 無人能敵的香脆絕招 ✓ 搭配特別的茄汁武器 ✓ 抵擋不了　只好乖乖投降囉！',NULL,'2018-01-01 00:00:00'),(3,'可口可樂',219.00,9,'食品',NULL,NULL,'可口可樂-易開罐250ml(24入) ★小型易開罐，勁享輕鬆時刻 ★擋不住的暢快口感 ★勁享美食',NULL,'2018-01-01 00:00:00'),(4,'娃娃',277.00,13,'玩具',NULL,NULL,'日本龍貓TOTORO 貓公車娃娃鑰匙包 鑰匙圈 零錢包\n龍貓TOTORO 貓公車立體鑰匙包 鑰匙圈 零錢包 可愛不單調，背面拉鍊設計，可放置零錢 除了當鑰匙包外，還可以掛在背包上當吊飾',NULL,'2018-01-01 00:00:00'),(5,'小米無線充電器',695.00,157,'3C',NULL,NULL,'小米無線充電器 20W快充版 最高功率20w充電快 qi充電標準兼容更多 超靜音風扇噪音低 散熱強 內含1m type c傳輸線',NULL,'2018-01-01 00:00:00'),(6,'自動筆',280.00,16,'文具',NULL,NULL,'CHL 斑馬 ZEBRA MA53 Color Flight 繪圖 自動鉛筆 0.5mm 定番經典造型 多款',NULL,'2018-01-01 00:00:00'),(7,'標準型橡皮擦',329.00,323,'文具',NULL,NULL,' 標準型橡皮擦(18入) - 安全塑膠擦 ◎pentel經典款橡皮擦，乾淨擦拭不留痕跡、不傷紙面',NULL,'2018-01-01 00:00:00'),(8,'羅技 K375s 跨平台無線/藍牙 鍵盤支架組合',799.00,44,'3C',NULL,NULL,'羅技 K375s 跨平台無線/藍牙 鍵盤支架組合 -裝置間輕鬆切換 -安靜舒適的打字體驗 -通用手機與平板立架 -防潑濺設計 -24個月電池壽命 -獨家unifying技術',NULL,'2018-01-01 00:00:00'),(9,'紓壓鋁合金指尖陀螺',350.00,46,'玩具',NULL,NULL,'紓壓鋁合金指尖陀螺-盾牌 流暢弧形設計 紓壓玩物 特殊造型 愛不釋手 長時間轉動持續',NULL,'2018-01-01 00:00:00');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-07-11  0:35:56
