FROM mcr.microsoft.com/playwright:v1.40.0-jammy
LABEL maintainer="team@artillery.io"

RUN npm install -g artillery artillery-engine-playwright && \
        npm cache clean --force && \
        rm -rf /root/.cache && \
        rm -rf /ms-playwright/firefox* && \
        rm -rf /ms-playwright/webkit*

RUN npm install dotenv --save
RUN npm install chalk --save

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
