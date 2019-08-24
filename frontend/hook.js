import "babel-polyfill"

require("./data").getData().then(() => require("./mount"))
