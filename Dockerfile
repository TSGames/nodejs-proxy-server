# Verwende ein offizielles Node.js-Image als Basis
FROM node:20

# Arbeitsverzeichnis im Container festlegen
WORKDIR /usr/src/app

# Kopiere package.json und package-lock.json (falls vorhanden)
COPY package*.json ./
COPY proxy.js ./

# Installiere Abhängigkeiten
RUN npm install --production

# Kopiere den Rest der Anwendung
COPY . .

# Exponiere den Port, auf dem die Anwendung läuft
EXPOSE 3000

# Setze den Befehl zum Starten der Anwendung
CMD ["node", "proxy.js"]