/*
Navicat MySQL Data Transfer

Source Server         : MYSQL
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : weixin

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2018-01-11 10:09:30
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for cbpm_vote_list
-- ----------------------------
DROP TABLE IF EXISTS `cbpm_vote_list`;
CREATE TABLE `cbpm_vote_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) DEFAULT NULL,
  `vote_id` int(11) DEFAULT NULL,
  `vote_name` varchar(255) DEFAULT NULL,
  `vote_nums` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cbpm_vote_list
-- ----------------------------
INSERT INTO `cbpm_vote_list` VALUES ('1', '1', '0', '“全产业链”走向国际，“中国制造”发出更强音', '0');
INSERT INTO `cbpm_vote_list` VALUES ('2', '1', '1', '“五项改革”绘就发展蓝图，转型发展注入强劲动力', '0');
INSERT INTO `cbpm_vote_list` VALUES ('3', '1', '2', '学习贯彻党的十九大精神，全面落实从严治党责任', '0');
INSERT INTO `cbpm_vote_list` VALUES ('4', '1', '3', '人才成长开辟广阔空间，一批重大荣誉落户中钞', '0');
INSERT INTO `cbpm_vote_list` VALUES ('5', '1', '4', '刘贵生董事长提出：同心共筑“中钞梦”', '0');
INSERT INTO `cbpm_vote_list` VALUES ('6', '1', '5', '扩大品牌宣传力度，树立“中钞”国家队形象', '0');
INSERT INTO `cbpm_vote_list` VALUES ('7', '1', '6', '开展“安全生产月”活动，营造良好安全环境', '0');
INSERT INTO `cbpm_vote_list` VALUES ('8', '1', '7', '实施质量精品工程，“提质”“换装”树品牌', '0');
INSERT INTO `cbpm_vote_list` VALUES ('9', '1', '8', '布局现金服务市场，探索全生命周期管理', '0');
INSERT INTO `cbpm_vote_list` VALUES ('10', '1', '9', '积极推动货币文化建设，全方位拓展产业渠道', '0');
INSERT INTO `cbpm_vote_list` VALUES ('11', '1', '10', '科技项目管理开启全新模式，激发科研人员活力', '0');
INSERT INTO `cbpm_vote_list` VALUES ('12', '1', '11', '加强对外交流合作，技术研发获得新突破', '0');
INSERT INTO `cbpm_vote_list` VALUES ('13', '1', '12', '中钞防伪荣获第五届“全国文明单位”称号', '0');
INSERT INTO `cbpm_vote_list` VALUES ('14', '1', '13', '积极履行社会责任，开展帮扶援建工作', '0');
INSERT INTO `cbpm_vote_list` VALUES ('15', '1', '14', '精彩亮相专业展会，展示“中钞”发展成果', '0');
