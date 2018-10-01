#
# TABLE STRUCTURE FOR: convt
#

DROP TABLE IF EXISTS `convt`;

CREATE TABLE `convt` (
  `convtID` int(7) NOT NULL AUTO_INCREMENT,
  `conv_itemID` int(11) NOT NULL,
  `conv_date` datetime NOT NULL,
  `conv_crt` int(7) NOT NULL,
  `conv_piece` int(7) NOT NULL,
  PRIMARY KEY (`convtID`),
  KEY `conv_itemID` (`conv_itemID`),
  CONSTRAINT `convt_ibfk_1` FOREIGN KEY (`conv_itemID`) REFERENCES `item` (`itemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# TABLE STRUCTURE FOR: invoice
#

DROP TABLE IF EXISTS `invoice`;

CREATE TABLE `invoice` (
  `invID` int(11) NOT NULL AUTO_INCREMENT,
  `inv_perID` int(5) NOT NULL,
  `inv_code` varchar(7) NOT NULL,
  `inv_type` varchar(2) NOT NULL,
  `inv_date_req` datetime NOT NULL,
  `inv_date_del` date DEFAULT NULL,
  `inv_status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`invID`),
  KEY `inv_PID` (`inv_perID`),
  CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`inv_perID`) REFERENCES `person` (`perID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# TABLE STRUCTURE FOR: item
#

DROP TABLE IF EXISTS `item`;

CREATE TABLE `item` (
  `itemID` int(11) NOT NULL AUTO_INCREMENT,
  `item_is_damaged` tinyint(1) NOT NULL DEFAULT '0',
  `item_code` varchar(7) NOT NULL,
  `item_name` varchar(200) NOT NULL,
  `item_packing_list` int(5) NOT NULL,
  `item_piece` int(9) NOT NULL DEFAULT '0',
  `item_isActivated` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`itemID`,`item_is_damaged`)
) ENGINE=InnoDB AUTO_INCREMENT=189 DEFAULT CHARSET=utf8;

INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (1, 0, 'AXE0002', 'Axe American Type Truck Axle -16T', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (2, 0, 'AXE0001', 'Axe De Charette', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (3, 0, 'BAT0038', 'Batterie Moto 12N4', 8, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (4, 0, 'BAT0036', 'Batterie Moto 12N5', 9, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (5, 0, 'BAT0037', 'Batterie Moto MF 12N4', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (6, 0, 'BAT0035', 'Batterie Moto MF 12N5', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (7, 0, 'BAT0002', 'Batterie Thundermax Din 100 GT', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (8, 0, 'BAT0001', 'Batterie Thundermax Din 100 PT', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (9, 0, 'BAT0013', 'Batterie Thundermax MF Din 100 gt', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (10, 0, 'BAT0012', 'Batterie Thundermax MF Din 100 pt', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (11, 0, 'BAT0036', 'Batterie Thundermax MF Din 45 Mali', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (12, 0, 'BAT0006', 'Batterie Thundermax MF Din 60', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (13, 0, 'BAT0032', 'Batterie Thundermax MF Din 60 Mali', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (14, 0, 'BAT0007', 'Batterie Thundermax MF Din 66', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (15, 0, 'BAT0008', 'Batterie Thundermax MF Din 70', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (16, 0, 'BAT0033', 'Batterie Thundermax MF Din 70 Mali', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (17, 0, 'BAT0009', 'Batterie Thundermax MF Din 75', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (18, 0, 'BAT0034', 'Batterie Thundermax MF Din 75 Mali', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (19, 0, 'BAT0011', 'Batterie Thundermax MF Din 80 gt', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (20, 0, 'BAT0010', 'Batterie Thundermax MF Din 80 pt', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (21, 0, 'BAT0020', 'Batterie Thundermax MF N 100 L', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (22, 0, 'BAT0021', 'Batterie Thundermax MF N 120', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (23, 0, 'BAT0022', 'Batterie Thundermax MF N 150', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (24, 0, 'BAT0023', 'Batterie Thundermax MF N 180', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (25, 0, 'BAT0024', 'Batterie Thundermax MF N 200', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (26, 0, 'BAT0014', 'Batterie Thundermax MF N 32', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (27, 0, 'BAT0015', 'Batterie Thundermax MF N 45', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (28, 0, 'BAT0033', 'Batterie Thundermax MF N 60', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (29, 0, 'BAT0037', 'Batterie Thundermax MF N 60 Mali', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (30, 0, 'BAT0016', 'Batterie Thundermax MF N 75', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (31, 0, 'BAT0017', 'Batterie Thundermax MF N 75L', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (32, 0, 'BAT0018', 'Batterie Thundermax MF N 80L', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (33, 0, 'BAT0019', 'Batterie Thundermax MF NS 100', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (34, 0, 'BAT0003', 'Batterie Thundermax N 100l', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (35, 0, 'BAT0004', 'Batterie Thundermax N 120', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (36, 0, 'BAT0005', 'Batterie Thundermax N 150', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (37, 0, 'BAT0038', 'Batterie Thundermax N 40 Mali', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (38, 0, 'BAT0027', 'Batterie Visca MF Din 100 gt', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (39, 0, 'BAT0030', 'Batterie Visca MF Din 150 Mali', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (40, 0, 'BAT0028', 'Batterie Visca MF Din 60 Mali', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (41, 0, 'BAT0029', 'Batterie Visca MF Din 70 Mali', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (42, 0, 'BAT0031', 'Batterie Visca MF N 120 Mali', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (43, 0, 'BAT0025', 'Batterie Visca N 120 ', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (44, 0, 'BAT0026', 'Batterie Visca N 150', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (45, 0, 'BOU0002', 'BOUILLON SOSSA CREVETTE 15G', 10, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (46, 0, 'BOU0003', 'BOUILLON SOSSA EPICES 15G', 10, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (47, 0, 'BOU0001', 'BOUILLON SOSSA TOMATE 15G', 10, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (48, 0, 'BRI0001', 'Briquet Clipper', 17, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (49, 0, 'CAA0004', 'CAA VeloClair 26 TOPTUBE', 100, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (50, 0, 'CAA0001', 'CAA Voiture 13 DMD', 50, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (51, 0, 'CAA0002', 'CAA Voiture 14 DMD', 50, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (52, 0, 'CAA0003', 'CAA Voiture 15 DMD', 40, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (53, 0, 'CAB0002', 'CABLE ELECTRIQUE 1.5', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (54, 0, 'CAB0001', 'CABLE ELECTRIQUE 2.5', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (55, 0, 'CAD0001', 'Cadre Dame', 6, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (56, 0, 'CAD0002', 'Cadre Homme', 10, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (57, 0, 'CAF0001', 'CAFE MIMA Sachet 2G', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (58, 0, 'CAS0002', 'Casseroles Alu 14-24 6 pcs 3.5KG', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (59, 0, 'CAS0003', 'Casseroles Alu 14-26 7 pcs 6KG', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (60, 0, 'CAS0001', 'Casseroles Alu 14-28 7 pcs 4KG', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (61, 0, 'CHA0001', 'Chaine Velo Baron', 50, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (62, 0, 'COU0001', 'COUCHES BB JOYA MAXI-GF 30', 5, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (63, 0, 'COU0004', 'COUCHES BB SMILEY JUNIOR-PF 10', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (64, 0, 'COU0002', 'COUCHES BB SMILEY MAXI-GF 40', 5, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (65, 0, 'COU0003', 'COUCHES BB SMILEY MINI-PF 15', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (66, 0, 'DR.0001', 'Dr. Fixit Powder WaterProof 500G', 20, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (67, 0, 'EMA0001', 'Emaille Casseroles 12-24 7 pcs', 4, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (68, 0, 'EMA0002', 'Emaille Casseroles 16-20 3 pcs', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (69, 0, 'FEV0001', 'Fevicol CA 777 200Ml x50pcs', 50, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (70, 0, 'FEV0002', 'Fevicol CA 777 650Ml x12pcs', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (71, 0, 'GAZ0001', 'Gaz Chalumea Moxy-a', 6, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (72, 0, 'GAZ0002', 'Gaz Chalumea Poxy-a', 6, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (73, 0, 'GAZ0007', 'Gaz Lamp Metal MK 100 INOX PIEZO', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (74, 0, 'GAZ0006', 'Gaz Lamp Plastic FKP 100 PZ', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (75, 0, 'GAZ0003', 'Gaz Stove MK 90', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (76, 0, 'GAZ0005', 'Gaz Stove MK 90 INOX', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (77, 0, 'GAZ0004', 'Gaz Stove MK 90 PZ', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (78, 0, 'GAZ0010', 'Gaz Stove SF90 500G', 6, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (79, 0, 'GAZ0009', 'Gaz Stove SF90 500G PIEZO', 6, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (80, 0, 'GAZ0011', 'Gaz Stove SGC90 500G', 6, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (81, 0, 'GAZ0008', 'Gaz Stove SGC90 500G PIEZO', 6, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (82, 0, 'GRE0001', 'GREASE 15 KGS -TEXAS', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (83, 0, 'GRE0002', 'GREASE 2 KGS x6 -TEXAS', 6, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (84, 0, 'HUI0004', 'Huile De Friem 250ml - Texas', 24, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (85, 0, 'HUI0005', 'Huile Engine 50 SAE 1L - Prolube', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (86, 0, 'HUI0001', 'Huile Engine 50 SAE 1L - Texas', 12, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (87, 0, 'HUI0002', 'Huile Engine 50 SAE 20L - Texas', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (88, 0, 'HUI0003', 'Huile Engine 90 SAE 20L - Texas', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (89, 0, 'JAN0001', 'Jante Westwood 72 Ralson', 10, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (90, 0, 'MAY0001', 'Mayonnaise Mima 12x946ml', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (91, 0, 'MAY0002', 'Mayonnaise Mima 24x236ml', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (92, 0, 'MAY0003', 'Mayonnaise Mima Sachet', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (93, 0, 'MOY0002', 'Moyeux Baron 36 Complet', 50, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (94, 0, 'MOY0001', 'Moyeux Baron 72 Alu.', 50, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (95, 0, 'MR.0001', 'Mr. Bond 250g', 40, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (96, 0, 'MR.0002', 'Mr. Bond 850g', 10, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (97, 0, 'PAN0004', 'Panneau Solaire 100W', 2, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (98, 0, 'PAN0005', 'Panneau Solaire 120W', 2, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (99, 0, 'PAN0002', 'Panneau Solaire 150W', 2, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (100, 0, 'PAN0001', 'Panneau Solaire 15W', 2, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (101, 0, 'PAN0006', 'Panneau Solaire 250W', 2, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (102, 0, 'PAN0003', 'Panneau Solaire 50W', 2, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (103, 0, 'PNE0001', 'Pneu Baron', 50, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (104, 0, 'PNE0003', 'Pneu Camion 12R22.5 Millway', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (105, 0, 'PNE0066', 'Pneu Camion 13R22.5 Kapsen DR801', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (106, 0, 'PNE0061', 'Pneu Camion 13R22.5 Milleway M501', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (107, 0, 'PNE0062', 'Pneu Camion 315/80 R 22.5 Kapsen', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (108, 0, 'PNE0063', 'Pneu Camion 315/80 R 22.5 Milleway', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (109, 0, 'PNE0005', 'Pneu Moto Ralco 110/90-16 Black Cobra', 5, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (110, 0, 'PNE0006', 'Pneu Moto Ralco 110/90-16 Speed Blaster', 5, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (111, 0, 'PNE0007', 'Pneu Moto Ralco 2.50x17 Blaster Max', 5, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (112, 0, 'PNE0004', 'Pneu Moto Ralco 2.75x17 Blaster-F', 5, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (113, 0, 'PNE0008', 'Pneu Moto Ralco 2.75x17 Tornado 3', 5, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (114, 0, 'PNE0009', 'Pneu Moto Ralco 2.75x18 Maxi Rib', 5, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (115, 0, 'PNE0010', 'Pneu Moto Ralco 300-18 Black Belt', 5, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (116, 0, 'PNE0011', 'Pneu Moto Ralco Tricycle 4.50-12', 5, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (117, 0, 'PNE0012', 'Pneu Moto Ralco Tricycle 5.00-12', 5, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (118, 0, 'PNE0002', 'Pneu Remorque', 50, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (119, 0, 'PNE0013', 'Pneu Velo 24 VTT', 50, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (120, 0, 'PNE0015', 'Pneu Velo 26 Pannier', 25, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (121, 0, 'PNE0014', 'Pneu Velo 26 VTT', 50, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (122, 0, 'PNE0016', 'Pneu Velo 27 Pannier', 25, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (123, 0, 'PNE0017', 'Pneu Velo 28 Pannier', 25, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (124, 0, 'PNE0018', 'Pneu Voiture 185 R 14C', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (125, 0, 'PNE0019', 'Pneu Voiture 185/65 R 15 GP100', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (126, 0, 'PNE0020', 'Pneu Voiture 185/70 R 14', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (127, 0, 'PNE0021', 'Pneu Voiture 195 R 14C', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (128, 0, 'PNE0022', 'Pneu Voiture 195 R 15C', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (129, 0, 'PNE0024', 'Pneu Voiture 195/65 R 15', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (130, 0, 'PNE0023', 'Pneu Voiture 195/65 R 16C', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (131, 0, 'PNE0025', 'Pneu Voiture 195/70 R 14', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (132, 0, 'PNE0026', 'Pneu Voiture 195/70 R 15C', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (133, 0, 'PNE0027', 'Pneu Voiture 205/55 R 16', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (134, 0, 'PNE0028', 'Pneu Voiture 205/60 R 16', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (135, 0, 'PNE0029', 'Pneu Voiture 205/65 R 15', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (136, 0, 'PNE0030', 'Pneu Voiture 205/65 R 15C', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (137, 0, 'PNE0031', 'Pneu Voiture 205/65 R 16 GP100', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (138, 0, 'PNE0032', 'Pneu Voiture 215/45 R 17', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (139, 0, 'PNE0033', 'Pneu Voiture 215/65 R 15', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (140, 0, 'PNE0034', 'Pneu Voiture 215/70 R 15C', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (141, 0, 'PNE0035', 'Pneu Voiture 215/70 R 16', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (142, 0, 'PNE0036', 'Pneu Voiture 215/75 R 16C', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (143, 0, 'PNE0037', 'Pneu Voiture 215/75 R 17.5', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (144, 0, 'PNE0038', 'Pneu Voiture 225/60 R 18', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (145, 0, 'PNE0039', 'Pneu Voiture 225/65 R 17', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (146, 0, 'PNE0040', 'Pneu Voiture 225/70 R 15C', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (147, 0, 'PNE0041', 'Pneu Voiture 225/70 R 16', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (148, 0, 'PNE0042', 'Pneu Voiture 225/75 R 16', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (149, 0, 'PNE0043', 'Pneu Voiture 225/75 R 17.5', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (150, 0, 'PNE0044', 'Pneu Voiture 235/65 R 17', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (151, 0, 'PNE0045', 'Pneu Voiture 235/70 R 16', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (152, 0, 'PNE0046', 'Pneu Voiture 235/75 R 15', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (153, 0, 'PNE0047', 'Pneu Voiture 235/85 R 16', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (154, 0, 'PNE0048', 'Pneu Voiture 245/55 R 19', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (155, 0, 'PNE0049', 'Pneu Voiture 245/65 R 17', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (156, 0, 'PNE0050', 'Pneu Voiture 245/70 R 16', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (157, 0, 'PNE0051', 'Pneu Voiture 255/55 R 19', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (158, 0, 'PNE0052', 'Pneu Voiture 255/70 R 16', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (159, 0, 'PNE0053', 'Pneu Voiture 265/70 R 16', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (160, 0, 'PNE0054', 'Pneu Voiture 265/70 R 17', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (161, 0, 'PNE0055', 'Pneu Voiture 265/70 R 19.5', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (162, 0, 'PNE0056', 'Pneu Voiture 275/70 R 16 PrimTour', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (163, 0, 'PNE0057', 'Pneu Voiture 700 R 16', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (164, 0, 'PNE0058', 'Pneu Voiture 750 R 16', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (165, 0, 'PNE0059', 'Pneu Voiture 9.5 R 17.5', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (166, 0, 'RAY0002', 'Rayon Baron VTT', 25, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (167, 0, 'RAY0001', 'Rayon DMD', 8, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (168, 0, 'REG0001', 'Reglette 120cm / 40 W', 10, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (169, 0, 'ROU0001', 'Roue Libre 18T', 100, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (170, 0, 'ROU0003', 'Roue Libre VTT Baron', 50, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (171, 0, 'ROU0002', 'Roue Libre VTT VeloClair', 50, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (172, 0, 'SAV0002', 'Savon Magico 375G x24pcs', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (173, 0, 'SAV0001', 'Savon Uno 250G x36pcs', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (174, 0, 'SCO0001', 'Scotch Electrique 10YRD', 16, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (175, 0, 'SEL0001', 'SELLE Velo', 25, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (176, 0, 'SUP0001', 'Super Gaz 190G', 36, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (177, 0, 'THÃ0001', 'ThÃ© Ataya Citron', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (178, 0, 'THÃ0002', 'ThÃ© Ataya Gingembre', 1, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (179, 0, 'UNI0009', 'Unitint Black 016', 60, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (180, 0, 'UNI0003', 'Unitint Fast Blue 014', 60, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (181, 0, 'UNI0004', 'Unitint Fast Green 007', 60, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (182, 0, 'UNI0005', 'Unitint Fast Violet 012', 60, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (183, 0, 'UNI0002', 'Unitint Fast Yellow 001', 60, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (184, 0, 'UNI0007', 'Unitint Fire Red 011', 60, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (185, 0, 'UNI0006', 'Unitint Orange 009', 60, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (186, 0, 'UNI0008', 'Unitint Red Oxide 020', 60, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (187, 0, 'UNI0001', 'Unitint Yellow Oxide 005', 60, 0, 1);
INSERT INTO `item` (`itemID`, `item_is_damaged`, `item_code`, `item_name`, `item_packing_list`, `item_piece`, `item_isActivated`) VALUES (188, 0, 'VEL0001', 'Velo Complet 26 Panier Dame', 4, 0, 1);


#
# TABLE STRUCTURE FOR: order_inv
#

DROP TABLE IF EXISTS `order_inv`;

CREATE TABLE `order_inv` (
  `ordID` int(11) NOT NULL AUTO_INCREMENT,
  `ord_invID` int(11) NOT NULL,
  `ord_itemID` int(11) NOT NULL,
  `ord_item_isDamaged` tinyint(1) NOT NULL DEFAULT '0',
  `ord_crt` int(9) DEFAULT '0',
  `ord_piece` int(9) DEFAULT '0',
  `ord_note` varchar(100) DEFAULT NULL,
  `ord_isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ordID`),
  KEY `ord_invID` (`ord_invID`),
  KEY `ord_itemID` (`ord_itemID`),
  KEY `ord_item_isDamaged` (`ord_item_isDamaged`),
  CONSTRAINT `order_inv_ibfk_1` FOREIGN KEY (`ord_invID`) REFERENCES `invoice` (`invID`) ON DELETE CASCADE,
  CONSTRAINT `order_inv_ibfk_2` FOREIGN KEY (`ord_itemID`) REFERENCES `item` (`itemID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# TABLE STRUCTURE FOR: person
#

DROP TABLE IF EXISTS `person`;

CREATE TABLE `person` (
  `perID` int(5) NOT NULL AUTO_INCREMENT,
  `per_code` varchar(7) NOT NULL,
  `per_name` varchar(50) NOT NULL,
  `per_phone` varchar(50) DEFAULT NULL,
  `per_address` varchar(100) DEFAULT NULL,
  `per_isActivated` tinyint(1) NOT NULL DEFAULT '1',
  `per_isClient` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`perID`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8;

INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (1, 'SIT0001', 'Sita Remen', '78 00 64 20', 'Boutique', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (2, 'OUE0001', 'Ouedraougou Yackouba', '78 02 77 92', 'Cote Cimtair', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (3, 'HAM0001', 'Hamidou SimporÃ©', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (4, 'ABD0001', 'Abdul Karim', '', 'Marche De Cola', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (5, 'SOU0001', 'SouhoudÃ© TraorÃ©', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (6, 'KIN0001', 'Kindou  Soleiman', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (7, 'NAN0001', 'Nanema Seydou', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (8, 'SAN0001', 'Sanfo Sayouba', '78 84 14 76', 'Sankaryare', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (9, 'SOC0001', 'Socopal Adama', '78 22 64 23', 'Sankaryare', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (10, 'SAL0001', 'Salgo Soleiman', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (11, 'BAK0001', 'Bakari Guiro', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (12, 'ADA0001', 'Adama Ouedraogou', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (13, 'SAL0002', 'Salif Delcom', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (14, 'ISS0001', 'Issouf Gueimbre', '', 'BOBO', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (15, 'FAS0001', 'FasoDmd  Boutique', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (16, 'SIR0001', 'Siri Madi', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (17, 'RAS0001', 'RasmanÃ© Traore', '70 27 18 16', 'Sankraryare', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (18, 'SOL0001', 'Soleiman Karambiri', '70 47 45 83', 'Sankraryare', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (19, 'KAR0001', 'Karim Kosobeh', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (20, 'MUS0001', 'Mustapha Karambiri', '78 88 59 69', 'Sankaryare', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (21, 'PHI0001', 'Phinicia ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (22, 'MAD0001', 'Madi Nikiema', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (23, 'REA0001', 'Reality Distribution', '68 44 09 02', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (24, 'JOS0001', 'joseph Kabore', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (25, 'CEN0001', 'Center European', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (26, 'BAL0001', 'Balima Tkdgo', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (27, 'MOU0001', 'Moumouni Bonkongou', '70 26 67 62', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (28, 'BEB0001', 'Bebe Victorien Kabore', '78 41 80 21', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (29, 'MIC0001', 'Mickael ', '', '1200 lgmts', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (30, 'ALB0001', 'Albert ', '68 24 83 78', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (31, 'AZI0001', 'Aziz ', '79 19 51 07', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (32, 'FAB0001', 'Fabrice ', '70 23 13 50', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (33, 'MOH0001', 'Mohamed ', '78 64 50 37', 'Boutique', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (34, 'ABU0001', 'Abu Bacar Ouedraogou', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (35, 'JOS0002', 'joseph Kienderbiego', '78 80 66 81', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (36, 'MOU0002', 'Moussa Compaore', '70 26 70 56', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (37, 'BAD0001', 'Badini Briquet', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (38, 'OUS0001', 'Ousmane Zoundi', '78 68 45 89', 'Sankaryare', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (39, 'HAJ0001', 'Haj Salam', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (40, 'SIN0001', 'Sini Ousmane', '78 15 12 12', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (41, 'LAM0001', 'Lamoussa Bouda Thomas', '78 03 50 59', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (42, 'JOE0001', 'JOEL KABORE ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (43, 'VEN0001', 'VentDetail Joseph Kabore ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (44, 'CON0001', 'Conaf Kossodo ', '78 44 44 88', 'Kossodo', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (45, 'POR0001', 'Porgo Idrissa ', '78 47 60 35', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (46, 'NAG0001', 'Nagalo ', '-', '-', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (47, 'AUT0001', 'Auto Perfecto George Kamel', '79 02 00 00 ', 'Bobo', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (48, 'SID0001', 'Sidiki  Kabore', '78 23 23 21', 'Ouaga', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (49, 'RAS0002', 'Rasmane Kouanda ', '-', '-', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (50, 'SOU0002', 'Soule ', '-', '-', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (51, 'COM0001', 'Compaore Noufou ', '78 23 74 74', 'Sankaryare', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (52, 'KAR0002', 'KARIM EMPLOYEE DEPOT ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (53, 'MOH0002', 'MOHAMMAD HACHEM ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (54, 'IRU0001', 'IRUGUE NOUFOU ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (55, 'MAH0001', 'Mahamadi Ouedraogou ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (56, 'COM0002', 'Compaore Jerom ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (57, 'NIK0001', 'Nikiema Asana ', '78 47 49 72', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (58, 'SAN0002', 'Sana Abdullayi ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (59, 'SAN0003', 'Sana Baba ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (60, 'NIK0002', 'Nikiema Moussa ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (61, 'ALI0001', 'Ali Traore ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (62, 'KIE0001', 'Kiema Rasmane ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (63, 'SOL0002', 'Soleiman Nacanabo ', '78 47 54 66', 'Grande Marche', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (64, 'PIE0001', 'Pierre Kienderbeogo ', '', 'Grande Marche', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (65, 'MAN0001', 'mande Oussemane ', '78 06 21 83', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (66, 'PAU0001', 'Paul ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (67, 'IDR0001', 'Idrissa ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (68, 'ZAL0001', 'Zalla Adama ', '78 39 78 14', 'Cote Kayzer', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (69, 'SOU0003', 'Soulia Alake ', '58 23 03 75', 'Grande Marche', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (70, 'MIC0002', 'Michelle Kdgo ', '77 27 51 68', 'Projet Zaca', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (71, 'OUE0002', 'Ouedraogou Ousseni ', '78 55 42 65', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (72, 'MAD0002', 'Madame Ouedraogou ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (73, 'KON0001', 'Kongo Idrissa ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (74, 'TEN0001', 'Tengondogo Amade ', '78 22 00 07', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (75, 'SO 0001', 'SO TA COM ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (76, 'BIR0001', 'Birba Issouf Transitaire ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (77, 'KAR0003', 'Karim Ilboudo (Nabil) ', '78 37 74 74', 'Kossodo', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (78, 'THO0001', 'Thomas Kdgou ', '79 17 12 01', 'Projet Zaca', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (79, 'JIH0001', 'Jihad DMD ', '-', '-', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (80, 'MED0001', 'Medard Fada Piyabiju ', '-', 'Projet Zaca', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (81, 'ISS0002', 'Issouf Sawadougou ', '78 89 96 23', 'Grande Marche', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (82, 'MAD0003', 'Madi Fada ', '70 05 43 77', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (83, 'DER0001', 'Derra Moussa ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (84, 'SAN0004', 'Sana Seydou ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (85, 'COM0003', 'COMPAORE ALASSANE ', '79 98 77 96', 'Oscar Yaar', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (86, 'HAM0002', 'hamadou Ouedraogou ', '-', 'Grande Marche ', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (87, 'ETI0001', 'Etienne Kienderbeogo ', '-', '-', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (88, 'MOH0003', 'Mohamadou Ouedraogou ', '78 47 98 92', '-', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (89, 'NIA0001', 'Niampa Aziz ', '79 10 58 70', 'Sankaryare', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (90, 'EL-0001', 'El-Adj Wandaogo ', '78 11 33 39', '-', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (91, 'GAN0001', 'Ganaba Ismael ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (92, 'SAM0001', 'Samuel ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (93, 'OUS0002', 'Ousman (Idrissa) ', '78 07 61 61', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (94, 'ILB0001', 'Ilboudou Issouf ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (95, 'NIK0003', 'Nikiema Harouna ', '79 62 11 51', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (96, 'ABD0002', 'Abdoul Aziz ', '78 12 96 25', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (97, 'DOL0001', 'dolloweogo Sylvin ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (98, 'KAB0001', 'kabore abdul rasmane ', '', '', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (99, 'SIN0002', 'Sini Yackouba ', '-', '-', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (100, 'ZOR0001', 'zorman Idrissa ', '-', '-', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (101, 'ABL0001', 'ablasse Kabore ', '78 89 93 48', '-', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (102, 'KIE0002', 'Kienderbeogo Seydou ', '78 26 66 06', '-', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (103, 'MR.0001', 'Mr. Mahdi Benin ', '78 11 67 17', 'gare de cotonou', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (104, 'BER0001', 'Bernard Kdgo ', '-', 'Projet Zaca', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (105, 'JOS0003', 'Joseph Kabore', '--', '--', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (106, 'SAL0003', 'Salam', '--', '--', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (107, 'ISS0003', 'Issouf', '--', '--', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (108, 'PIE0002', 'Pierre', '--', '--', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (109, 'IDR0002', 'Idrissa', '--', '--', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (110, 'JIH0002', 'jihad', '--', '--', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (111, 'THO0002', 'Thomas', '--', '--', 1, 1);
INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES (112, 'ANT0001', 'Antoin', '--', '--', 1, 1);


#
# TABLE STRUCTURE FOR: return_details
#

DROP TABLE IF EXISTS `return_details`;

CREATE TABLE `return_details` (
  `date_ordID` int(11) NOT NULL,
  `ord_perID` int(5) NOT NULL,
  `ord_date_req` date NOT NULL,
  `ord_date_com` date NOT NULL,
  `ord_status` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`date_ordID`),
  KEY `date_ordID` (`date_ordID`),
  KEY `ord_perID` (`ord_perID`),
  CONSTRAINT `return_details_ibfk_1` FOREIGN KEY (`date_ordID`) REFERENCES `order_inv` (`ordID`),
  CONSTRAINT `return_details_ibfk_2` FOREIGN KEY (`ord_perID`) REFERENCES `person` (`perID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

