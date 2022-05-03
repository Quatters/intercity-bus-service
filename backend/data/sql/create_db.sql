-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema intercity_bus_service
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema intercity_bus_service
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `intercity_bus_service` ;
USE `intercity_bus_service` ;

-- -----------------------------------------------------
-- Table `intercity_bus_service`.`city`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `intercity_bus_service`.`city` (
  `city_id` INT NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`city_id`),
  UNIQUE INDEX `city_UNIQUE` (`city` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `intercity_bus_service`.`route`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `intercity_bus_service`.`route` (
  `route_number` VARCHAR(5) NOT NULL,
  `distance_km` INT NULL,
  `from` INT NULL,
  `to` INT NOT NULL,
  PRIMARY KEY (`route_number`),
  INDEX `from_idx` (`from` ASC) VISIBLE,
  INDEX `to_idx` (`to` ASC) VISIBLE,
  CONSTRAINT `from`
    FOREIGN KEY (`from`)
    REFERENCES `intercity_bus_service`.`city` (`city_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `to`
    FOREIGN KEY (`to`)
    REFERENCES `intercity_bus_service`.`city` (`city_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `intercity_bus_service`.`bus_model`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `intercity_bus_service`.`bus_model` (
  `model_id` INT NOT NULL AUTO_INCREMENT,
  `model` VARCHAR(100) NOT NULL,
  `seats_amount` INT NOT NULL,
  PRIMARY KEY (`model_id`),
  UNIQUE INDEX `type_UNIQUE` (`model` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `intercity_bus_service`.`bus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `intercity_bus_service`.`bus` (
  `bus_number` VARCHAR(6) NOT NULL,
  `model_id` INT NOT NULL,
  PRIMARY KEY (`bus_number`),
  INDEX `type_idx` (`model_id` ASC) VISIBLE,
  CONSTRAINT `model_id`
    FOREIGN KEY (`model_id`)
    REFERENCES `intercity_bus_service`.`bus_model` (`model_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `intercity_bus_service`.`route_schedule`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `intercity_bus_service`.`route_schedule` (
  `schedule_id` INT NOT NULL AUTO_INCREMENT,
  `route_number` VARCHAR(5) NOT NULL,
  `departure_time` DATETIME NOT NULL,
  `arrival_time` DATETIME NOT NULL,
  PRIMARY KEY (`schedule_id`),
  INDEX `route_number_idx` (`route_number` ASC) VISIBLE,
  CONSTRAINT `route_number`
    FOREIGN KEY (`route_number`)
    REFERENCES `intercity_bus_service`.`route` (`route_number`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `intercity_bus_service`.`flight`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `intercity_bus_service`.`flight` (
  `flight_id` INT NOT NULL AUTO_INCREMENT,
  `bus_number` VARCHAR(6) NOT NULL,
  `departure_date` DATETIME NOT NULL,
  `price` DECIMAL(8,2) NOT NULL,
  `schedule_id` INT NOT NULL,
  PRIMARY KEY (`flight_id`),
  INDEX `bus_number_idx` (`bus_number` ASC) VISIBLE,
  INDEX `schedule_id_idx` (`schedule_id` ASC) VISIBLE,
  CONSTRAINT `bus_number`
    FOREIGN KEY (`bus_number`)
    REFERENCES `intercity_bus_service`.`bus` (`bus_number`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `schedule_id`
    FOREIGN KEY (`schedule_id`)
    REFERENCES `intercity_bus_service`.`route_schedule` (`schedule_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `intercity_bus_service`.`ticket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `intercity_bus_service`.`ticket` (
  `ticket_id` INT NOT NULL AUTO_INCREMENT,
  `seat_number` INT NOT NULL,
  `flight_id` INT NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `patr` VARCHAR(50) NULL,
  PRIMARY KEY (`ticket_id`),
  INDEX `flight_id_idx` (`flight_id` ASC) VISIBLE,
  UNIQUE INDEX `flight_id_seat_number_unique` (`flight_id` ASC, `seat_number` ASC) VISIBLE,
  CONSTRAINT `flight_id`
    FOREIGN KEY (`flight_id`)
    REFERENCES `intercity_bus_service`.`flight` (`flight_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
