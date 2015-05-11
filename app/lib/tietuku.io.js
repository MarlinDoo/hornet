/**
 *
 */

var bcrypt    = require('bcrypt-nodejs');
var fs        = require('fs');
var crypto    = require('crypto');
var http      = require('http');
// var request   = require('request');

TietukuIO = (function() {
  function TietukuIO() {}
  // FIXME: move to config.ini
  TietukuIO.accesskey   = 'b6c2f1ad87ef23e3198e7a945f8fb66d919c2315';
  TietukuIO.secretkey   = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
  TietukuIO.host        = 'api.tietuku.com';
  TietukuIO.uploadHost  = "http://up.tietuku.com/";

  TietukuIO.prototype.Token = function(param) {
    var base64param, sign;
    console.log('param',param);
    base64param = this.Base64(JSON.stringify(param));
    console.log('base64param',base64param)
    sign = this.Sign(base64param, TietukuIO.secretkey);
    return TietukuIO.accesskey + ':' + sign + ':' + base64param;
  };

  TietukuIO.prototype.Sign = function(str, key) {
    console.log('sign',str,key);
    return this.Base64(crypto.createHmac('sha1', key).update(str).digest());
  };

  TietukuIO.prototype.Base64 = function(str) {
    return new Buffer(str).toString('base64').replace('+', '-').replace('/', '_');
  };

  TietukuIO.prototype.upload = function(path, identifier, callback) {
    var vm = this;

    if ('function' === typeof identifier) {
      callback = identifier;
      identifier = '';
    }
    var token = vm.Token({
      deadline: 1430387794,
      action:'getall'
      // aid:1046039
    });
    var reqJosnData = JSON.stringify({Token:token});
    console.log( 'Len['+Buffer.byteLength(reqJosnData, 'utf8')+']', reqJosnData );
    var options = {
      // host: 'up.tietuku.com',
      host: TietukuIO.host,
      // port: 13080,
      path: '/v1/Catalog/',
      method : 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': reqJosnData.length
      }
      // 'content-length' : reqJosnData.length
    };
    console.log('options',options)
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode, res.headers);
        // equal(200, res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));

        res.on('data',function (chunk) {
             console.log('BODY: ' + chunk);
        });
    })
    .on('error', function(e) {
      console.log('problem with request: ' + e.message);
    })

    req.write(reqJosnData);
    req.end();

    callback();
    /*return fs.readFile( path, function(err, buffer) {
      console.log('buffer', buffer);
      return callback(false, {});
    } );*/
    // return callback(false, {});
    /*return fs.readFile(path, function(err, buffer) {
      return request({
        url: "" + vm.host + "/v1/token",
        method: 'POST',
        headers: {
          'x-client_id': vm.appId,
          'Authorization': "OAuth " + vm.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            filename: path,
            md5: crypto.createHash('md5').update(buffer).digest('hex'),
            size: buffer.length,
            path: identifier
          }
        })
      }, function(err, res, body) {
        console.log('x2', res, body);
        body = JSON.parse(body);
        if (!body.data.upload_info) {
          return callback(false, body.data.url);
        }
        return request({
          url: body.data.upload_info.upload_url,
          method: 'PUT',
          headers: {
            'Authorization': body.data.upload_info.signature,
            'Date': body.data.upload_info.date,
            'Content-Type': body.data.upload_info.content_type,
            'x-amz-acl': 'public-read'
          },
          body: buffer
        }, function() {
          return request({
            url: "" + vm.host + "/v1/token/" + body.data.id + "/complete",
            method: 'POST',
            headers: {
              'x-client_id': vm.appId,
              'Authorization': "OAuth " + vm.accessToken,
              'Content-Type': 'application/json'
            },
            body: '{}'
          }, function(err, res, body) {
            return callback(false, JSON.parse(body).data.data);
          });
        });
      });
    });*/
  };

  return TietukuIO;

})();

module.exports = new TietukuIO;
