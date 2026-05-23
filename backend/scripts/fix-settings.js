const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../frontend/src/pages/ModuleWebsiteSetup.jsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/value=\{settings\.website\.storeName\}/g, 'value={settings?.website?.storeName || ""}');
content = content.replace(/value=\{settings\.website\.tagline\}/g, 'value={settings?.website?.tagline || ""}');
content = content.replace(/value=\{settings\.contact\.address\}/g, 'value={settings?.contact?.address || ""}');
content = content.replace(/value=\{settings\.contact\.addressLink\}/g, 'value={settings?.contact?.addressLink || ""}');
content = content.replace(/value=\{settings\.contact\.phone1\}/g, 'value={settings?.contact?.phone1 || ""}');
content = content.replace(/value=\{settings\.contact\.phone2\}/g, 'value={settings?.contact?.phone2 || ""}');
content = content.replace(/value=\{settings\.contact\.email\}/g, 'value={settings?.contact?.email || ""}');
content = content.replace(/value=\{settings\.social\.facebook\}/g, 'value={settings?.social?.facebook || ""}');
content = content.replace(/value=\{settings\.social\.whatsapp\}/g, 'value={settings?.social?.whatsapp || ""}');
content = content.replace(/value=\{settings\.social\.instagram\}/g, 'value={settings?.social?.instagram || ""}');
content = content.replace(/value=\{settings\.social\.youtube\}/g, 'value={settings?.social?.youtube || ""}');
content = content.replace(/value=\{settings\.policies\.shipmentPolicy\}/g, 'value={settings?.policies?.shipmentPolicy || ""}');
content = content.replace(/value=\{settings\.policies\.deliveryPolicy\}/g, 'value={settings?.policies?.deliveryPolicy || ""}');
content = content.replace(/value=\{settings\.policies\.termsConditions\}/g, 'value={settings?.policies?.termsConditions || ""}');
content = content.replace(/value=\{settings\.policies\.returnPolicy\}/g, 'value={settings?.policies?.returnPolicy || ""}');
content = content.replace(/value=\{settings\.policies\.privacyPolicy\}/g, 'value={settings?.policies?.privacyPolicy || ""}');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Patched ModuleWebsiteSetup.jsx successfully.");
