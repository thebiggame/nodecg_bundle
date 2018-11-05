FROM nodecg/nodecg

COPY ./thebiggame /usr/src/app/bundles/thebiggame

RUN cd /usr/src/app/bundles/thebiggame && bower install --allow-root

EXPOSE 9090
CMD ["node", "/usr/src/app/index.js"]
