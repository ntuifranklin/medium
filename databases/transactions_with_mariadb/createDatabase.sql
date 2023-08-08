DROP DATABASE IF EXISTS `ONLINEBANKING`;
CREATE DATABASE IF NOT EXISTS `ONLINEBANKING`;
USE `ONLINEBANKING` ;
CREATE TABLE IF NOT EXISTS CUSTOMER(
    CUSTOMERID VARCHAR(50) PRIMARY KEY,
    FIRSTNAME VARCHAR(20) NOT NULL,
    MIDDLENAME VARCHAR(20) DEFAULT NULL,
    LASTNAME VARCHAR(20) NOT NULL,
    DOB DATE NOT NULL,
    SSN VARCHAR(100) NOT NULL,
    PHONENUMBER VARCHAR(20) NOT NULL
);
CREATE TABLE IF NOT EXISTS USER(
    USERID VARCHAR(50) PRIMARY KEY,
    EMAIL VARCHAR(100) NOT NULL,
    USERNAME VARCHAR(50) NOT NULL,
    PASSW VARCHAR(100) NOT NULL,
    CUSTOMERID VARCHAR(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS CHECKINGACCOUNT(
    ACCOUNTID VARCHAR(50) PRIMARY KEY,
    ACCOUNTNO VARCHAR(20) NOT NULL,
    CUSTOMERID VARCHAR(100) NOT NULL,
    BALANCE FLOAT(10,0) NOT NULL
);