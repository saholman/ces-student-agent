FROM ubuntu:14.04
USER root

# Update image
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
RUN apt-get update -y
RUN apt-get install apache2 php5 php-pear php5-dev php5-mcrypt php5-json php5-mongo php5-curl mongodb-org git -y
RUN php5enmod mcrypt json mongo curl
RUN pecl install mongo
RUN php5 -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php5 -r "if (hash_file('SHA384', 'composer-setup.php') === '669656bab3166a7aff8a7506b8cb2d1c292f042046c5a994c43155c0be6190fa0355160742ab2e1c88d40d5be660b410') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
RUN php5 composer-setup.php
RUN php5 -r "unlink('composer-setup.php');"
RUN mv composer.phar /usr/local/bin/composer

# clone learninglocker via git
RUN git clone https://github.com/LearningLocker/learninglocker.git learninglocker

# install learninglocker
RUN cd /learninglocker && composer install --no-interaction --no-dev

# modify database credentials
RUN sed -i "s/^.*username.*/\t\'username\' => \'ll_user\',/g" /learninglocker/app/config/database.php && \
    sed -i "s/^.*password.*/\t\'password\' => \'ll_password\',/g" /learninglocker/app/config/database.php && \
    sed -i "s/^.*database.*/\t\'database\' => \'learninglocker\',/g" /learninglocker/app/config/database.php

VOLUME /data/db

# Start mongodb and create a mongo user with rw perms then finalize learning locker mongodb setup
RUN exec /usr/bin/mongod & sleep 30 && \
    mongo admin --eval 'printjson(db.system.version.remove({}))' && \
    mongo admin --eval 'printjson(db.system.version.insert({ "_id" : "authSchema", "currentVersion" : 3 }))' && \
    mongo learninglocker --eval 'printjson(db.createUser({user:"ll_user",pwd:"ll_password",roles:["dbOwner"]}))' && \
    cd /learninglocker && \
    php artisan migrate

# modify Apache2 configuration
#RUN sed -i "8s/.*/\$_SERVER[SERVER_PORT]=443;\n\$_SERVER[HTTPS]='on';/" /learninglocker/public/index.php
RUN sed -i "s/^.*DocumentRoot.*/DocumentRoot \'\/var\/www\/learninglocker\/public\/\'/g" /etc/apache2/sites-enabled/000-default.conf && \
    echo '<Directory "/var/www/learninglocker/public">' >> /etc/apache2/sites-enabled/000-default.conf && \
    echo '  Options Indexes FollowSymLinks MultiViews' >> /etc/apache2/sites-enabled/000-default.conf && \
    echo '  AllowOverride All' >> /etc/apache2/sites-enabled/000-default.conf && \
    echo '  Order allow,deny' >> /etc/apache2/sites-enabled/000-default.conf && \
    echo '  Allow from all' >> /etc/apache2/sites-enabled/000-default.conf && \
    echo '</Directory>' >> /etc/apache2/sites-enabled/000-default.conf

RUN chown -R www-data:www-data /learninglocker; ln -s /learninglocker/ /var/www/
RUN chown -R www-data:www-data /var/www/learninglocker

# modify encryption key .. this is required b/c the default one is only 14 characters
RUN sed -i "s/'key.*/\'key\' => \'my_lrs_key\',/" /learninglocker/app/config/app.php

# create our container startup script
ADD llstartup /usr/bin/llstartup
RUN chmod 755 /usr/bin/llstartup

EXPOSE 80

# define entrypoint so ll will start from docker run
ENTRYPOINT ["/bin/bash"]
CMD ["/usr/bin/llstartup"]
