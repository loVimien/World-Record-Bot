var https = require('https');

var src_API = "https://www.speedrun.com/api/v1";

var request = function(url) {
    return new Promise(function(resolve, reject) {
        https.get(url, function(res) {
            var raw = '';
            res.on('data', function(d) {
                raw += d;
            })
            .on('end', function() {
                resolve(raw);
            })
            .on('error', function(err) {
                reject(err.message);
            });
        })
    });
}

var getWR = function(srcURL, subcatNeeded) {
    return new Promise(function(resolve, reject) {
        var reqProm = request(srcURL);
        reqProm.catch(function(reason) {
            reject("Error : " + reason);
        })
        .then(function(result) {
            var data = JSON.parse(result);
            var subcategory_ID = null;
            var category_ID = null;
            if(subcatNeeded !== undefined) {
                var cat_ID = data.data.category;
                var cat_req_prom = request(src_API + "/categories/" + cat_ID + "/variables");
                cat_req_prom.catch(function(reason) {
                    reject("Error" + reason);
                })
                .then(function(cat_res) {
                    var cat_data = JSON.parse(cat_res);
                    if (cat_data.data !== []) {
                        for(var [key, value] of Object.entries(cat_data.data[0].values.choices)) {
                            if (subcatNeeded.localeCompare(value) === 0) {
                                subcategory_ID = key;
                            }
                        }
                        console.log(subcategory_ID);
                        category_ID = cat_data.data[0].id;
                    }
                    var new_req_prom = request(srcURL + "?var-" + category_ID + "=" + subcategory_ID);
                    new_req_prom.catch(function(reason) {
                        reject("Error" + reason);
                    })
                    .then(function(filtered_res) {
                        var d = JSON.parse(filtered_res);
                        var WR_time = new Date(d.data.runs[0].run.times.primary_t*1000).toISOString().substr(11,8);
                        var Player_name;
                        var player_req_prom = request(d.data.runs[0].run.players[0].uri);
                        player_req_prom.catch(function(reason) {
                                reject("Error" + reason);
                        })
                        .then(function(player_res) {
                                var player_data = JSON.parse(player_res);
                                Player_name = player_data.data.names.international;
                                resolve("World record is " + WR_time + " by " + Player_name);
                        })
                    })
                })
            }
            else {
                var WR_time = new Date(data.data.runs[0].run.times.primary_t*1000).toISOString().substr(11, 8);
                var Player_name;
                var player_req_prom = request(data.data.runs[0].run.players[0].uri);
                player_req_prom.catch(function(reason) {
                    reject("Error" + reason);
                })
                .then(function(r) {
                    var player_data = JSON.parse(r);
                    Player_name = player_data.data.names.international;
                    resolve("World record is " + WR_time + " by " + Player_name);
                })
            }
        })
    })
}

module.exports.getWR = getWR;