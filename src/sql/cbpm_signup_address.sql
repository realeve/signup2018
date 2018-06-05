CREATE TABLE `cbpm_signup_address`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `sid` int
(11) DEFAULT NULL,
  `user` varchar
(255) DEFAULT NULL,
  `mobile` varchar
(255) DEFAULT NULL,
  `prov` varchar
(255) DEFAULT NULL,
  `city` varchar
(255) DEFAULT NULL,
  `area` varchar
(255) DEFAULT NULL,
  `detail` varchar
(255) DEFAULT NULL,
  `openid` varchar
(255) DEFAULT NULL,
  `idcard` varchar
(255) DEFAULT NULL,
  `rec_time` datetime DEFAULT NULL ON
UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
