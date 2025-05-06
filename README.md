To run:

1. `npm install`
2. `npm run dev`
3. Open the localhost

Change the model from the top-right of the page.

For Extension
1. npm run build
2. After run build execute you will find build or dist folder, then find manifest.json file
3. in manifest json file, change JS and CSS paths like below i mentioned

  1.  before :
      "content_scripts": [
      {
      "matches": ["https://kaveri.karnataka.gov.in/*"],
      "js": ["assets/main.js"], 
      "css": ["assets/main.css"]
      }]

3.  after :  
    "content_scripts": [
    {
    "matches": ["https://kaveri.karnataka.gov.in/*"],
    "js": ["assets/main-BZUoYmKX.js"],   (check assets folder and change accordingly what js file name has)
    "css": ["assets/main-uAAb-Dbe.css"]  (check assets folder and change accordingly what css file name has)
    }]
