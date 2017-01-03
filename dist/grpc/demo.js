'use strict';

/**
 *
 *{
    name: 'com.quancheng.zeus.service.ProductPackageService',
    host: '10.100.8.110:10013',
    address: '10.100.8.110',
    port: 10013,
    group: 'dev',
    version: '1.0.0'
 }
 *
 * Created by joe on 2016/10/20.
 */

var URL = require('url');

var Bluebird = require('bluebird');

function fromCallback(fn) {
    return new Bluebird(function (resolve, reject) {
        try {
            return fn(function (err, data, res) {
                if (err) {
                    err.res = res;
                    return reject(err);
                }
                return resolve([data, res]);
            });
        } catch (err) {
            return reject(err);
        }
    });
}

var _consul;

function init() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var saluki = opts.saluki || {};

    _consul = require('consul')({
        promisify: fromCallback,
        host: saluki.host || '127.0.0.1',
        port: saluki.port || '8500'
    });

    _consul.health.service({
        service: 'saluki_halia',
        passing: true
    }).then(function (data) {

        //console.log(data[0]);

        var services = {};
        data[0].forEach(function (c) {
            var s = c.Service;
            var ids = s.ID.split('-');
            var name = ids[1];
            var service = {
                name: name,
                host: ids[0],
                address: s.Address,
                port: s.Port,
                version: ids[2]
            };
            var ss = [];
            if (services[service.name]) {
                ss = services[service.name];
            } else {
                services[service.name] = ss;
            }
            services[service.name].push(service);
        });

        console.log(services);
    });
}

init({
    saluki: {
        group: 'terra-halia',
        host: 'daily.quancheng-ec.com',
        port: '8500'
    }
});

/**
 * 合并环境变量和配置变量，以环境变量为准
 * @param opts
 */
function mergeEnv(opts) {
    var env = process.env;
    //用环境变量替换当前配置
    for (var i in env) {
        //console.log("", i);
        if (i.startsWith('pomjs_')) {

            var config = i.substring(6);
            if (config.indexOf('_') == -1) {
                opts[config] = env[i];
            } else {
                var temp = 'opts';
                var vs = config.split('_');
                for (var index = 0; index < vs.length; index++) {
                    temp += '.' + vs[index];
                    var tempValue = index < vs.length - 1 ? '{}' : "'" + env[i] + "'";
                    eval(temp + '=' + tempValue);
                }
            }
        }
    }
}

mergeEnv({
    'pomjs_JAVA_HOME': '1233'
});