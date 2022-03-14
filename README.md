# ElectronPDFGen
PDF Generator on CMD

npx electron-packager . electron-pdf --overwrite --asar=true --platform=linux --arch=arm64  --prune=true --out=release-builds

npm run start -- --source='http://heise.de'  --target='./heise.pdf' --pagesize='A4'

nach ca. 1 sekunde wird das pdf erzeugt.