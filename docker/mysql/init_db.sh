#!/bin/bash
/usr/bin/mysqld_safe --skip-grant-tables &
sleep 5
mysql -u root -e "CREATE DATABASE biblioteca"
mysql -u root -e "GRANT ALL ON biblioteca.* TO 'root'@'0.0.0.0' IDENTIFIED BY 'root';"
mysql -u root -e "GRANT ALL ON biblioteca.* TO 'root'@'127.0.0.1' IDENTIFIED BY 'root';"
mysql -u root biblioteca < /etc/mysql/biblioteca.sql
