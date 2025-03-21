FROM postgres:15

# Install dependencies for building PostgreSQL extensions
RUN apt-get update && apt-get install -y \
    build-essential \
    postgresql-server-dev-15 \
    git \
    make \
    curl \
    ca-certificates \
    libssl-dev \
    libkrb5-dev \
    && rm -rf /var/lib/apt/lists/*

# Install pgTAP
RUN git clone https://github.com/theory/pgtap.git \
    && cd pgtap \
    && make \
    && make install \
    && cd .. \
    && rm -rf pgtap

# Install pg_prove (for running pgTAP tests)
RUN curl -L https://cpanmin.us | perl - --self-upgrade \
    && cpanm TAP::Parser::SourceHandler::pgTAP

# Copy initialization scripts
COPY ./init-scripts/*.sql /docker-entrypoint-initdb.d/

# Set environment variables
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB prettygood
