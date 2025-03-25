FROM postgres:16-alpine

# Install build dependencies and pgTAP
RUN apk add --no-cache --virtual .build-deps \
    git \
    gcc \
    libc-dev \
    make \
    perl-dev \
    perl-app-cpanminus \
    curl \
    postgresql-dev \
    patch \
    && cpanm TAP::Parser::SourceHandler::pgTAP \
    && git clone https://github.com/theory/pgtap.git \
    && cd pgtap \
    && make \
    && make install \
    && cd / \
    && rm -rf pgtap \
    && apk del .build-deps

# Add pgTAP loading into shared_preload_libraries
RUN echo "shared_preload_libraries = 'pgtap'" >> /usr/local/share/postgresql/postgresql.conf.sample

# Set PostgreSQL environment variables
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_USER postgres
ENV POSTGRES_DB prettygood_test

# Add init script to create extension
COPY ./init-pgtap.sh /docker-entrypoint-initdb.d/
