# node-bottomline

## Install
```bash
npm install bottomline
```

## Methods
```javascript
var Bottomline = require('bottomline');

Bottomline.ncaaf(callback);
Bottomline.nfl(callback);
Bottomline.nhl(callback);
Bottomline.mlb(callback);
```

## Callbacks
All methods take a callback function as their only parameter. An array of Game objects will be returned.