FROM mysql:5.7

COPY mysql.cnf /etc/mysql/conf.d
COPY biblioteca.sql /etc/mysql/biblioteca.sql

ADD init_db.sh /tmp/init_db.sh
RUN chmod 777 /tmp/init_db.sh && /tmp/init_db.sh
