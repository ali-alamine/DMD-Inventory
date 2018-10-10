-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 10, 2018 at 11:54 AM
-- Server version: 10.1.35-MariaDB
-- PHP Version: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dmd-inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `convt`
--

CREATE TABLE `convt` (
  `convtID` int(7) NOT NULL,
  `conv_itemID` int(11) NOT NULL,
  `conv_date` datetime NOT NULL,
  `conv_crt` int(7) NOT NULL,
  `conv_piece` int(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `invID` int(11) NOT NULL,
  `inv_perID` int(5) NOT NULL,
  `inv_code` varchar(7) NOT NULL,
  `inv_type` varchar(2) NOT NULL,
  `inv_date_req` datetime NOT NULL,
  `inv_date_del` date DEFAULT NULL,
  `inv_status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `itemID` int(11) NOT NULL,
  `item_is_damaged` tinyint(1) NOT NULL DEFAULT '0',
  `item_code` varchar(7) NOT NULL,
  `item_name` varchar(200) NOT NULL,
  `item_packing_list` int(5) NOT NULL,
  `item_piece` int(9) NOT NULL DEFAULT '0',
  `item_isActivated` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `order_inv`
--

CREATE TABLE `order_inv` (
  `ordID` int(11) NOT NULL,
  `ord_invID` int(11) NOT NULL,
  `ord_itemID` int(11) NOT NULL,
  `ord_item_isDamaged` tinyint(1) NOT NULL DEFAULT '0',
  `ord_crt` int(9) DEFAULT '0',
  `ord_piece` int(9) DEFAULT '0',
  `ord_note` varchar(100) DEFAULT NULL,
  `ord_isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE `person` (
  `perID` int(5) NOT NULL,
  `per_code` varchar(7) NOT NULL,
  `per_name` varchar(50) NOT NULL,
  `per_phone` varchar(50) DEFAULT NULL,
  `per_address` varchar(100) DEFAULT NULL,
  `per_isActivated` tinyint(1) NOT NULL DEFAULT '1',
  `per_isClient` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`perID`, `per_code`, `per_name`, `per_phone`, `per_address`, `per_isActivated`, `per_isClient`) VALUES
(1, 'supp', 'Supplier', NULL, NULL, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `return_details`
--

CREATE TABLE `return_details` (
  `date_ordID` int(11) NOT NULL,
  `ord_perID` int(5) NOT NULL,
  `ord_date_req` date DEFAULT NULL,
  `ord_date_com` date DEFAULT NULL,
  `ord_status` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `user_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_password` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_is_admin` tinyint(4) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `user_name`, `user_password`, `user_is_admin`) VALUES
(1, 'admin', 'admin', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `convt`
--
ALTER TABLE `convt`
  ADD PRIMARY KEY (`convtID`),
  ADD KEY `conv_itemID` (`conv_itemID`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`invID`),
  ADD KEY `inv_PID` (`inv_perID`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`itemID`,`item_is_damaged`);

--
-- Indexes for table `order_inv`
--
ALTER TABLE `order_inv`
  ADD PRIMARY KEY (`ordID`),
  ADD KEY `ord_invID` (`ord_invID`),
  ADD KEY `ord_itemID` (`ord_itemID`),
  ADD KEY `ord_item_isDamaged` (`ord_item_isDamaged`);

--
-- Indexes for table `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`perID`);

--
-- Indexes for table `return_details`
--
ALTER TABLE `return_details`
  ADD PRIMARY KEY (`date_ordID`),
  ADD KEY `date_ordID` (`date_ordID`),
  ADD KEY `ord_perID` (`ord_perID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `convt`
--
ALTER TABLE `convt`
  MODIFY `convtID` int(7) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `itemID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_inv`
--
ALTER TABLE `order_inv`
  MODIFY `ordID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `person`
--
ALTER TABLE `person`
  MODIFY `perID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `convt`
--
ALTER TABLE `convt`
  ADD CONSTRAINT `convt_ibfk_1` FOREIGN KEY (`conv_itemID`) REFERENCES `item` (`itemID`);

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`inv_perID`) REFERENCES `person` (`perID`);

--
-- Constraints for table `order_inv`
--
ALTER TABLE `order_inv`
  ADD CONSTRAINT `order_inv_ibfk_1` FOREIGN KEY (`ord_invID`) REFERENCES `invoice` (`invID`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_inv_ibfk_2` FOREIGN KEY (`ord_itemID`) REFERENCES `item` (`itemID`) ON DELETE CASCADE;

--
-- Constraints for table `return_details`
--
ALTER TABLE `return_details`
  ADD CONSTRAINT `return_details_ibfk_1` FOREIGN KEY (`date_ordID`) REFERENCES `order_inv` (`ordID`),
  ADD CONSTRAINT `return_details_ibfk_2` FOREIGN KEY (`ord_perID`) REFERENCES `person` (`perID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
