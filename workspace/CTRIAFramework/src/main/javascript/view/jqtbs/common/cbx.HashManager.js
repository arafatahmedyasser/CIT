/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 

 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */
cbx.ns('cbx.HashManager');


cbx.HashManager = function() {
    var prevHash = '',
        currHash = '',
        hashData = {},
        cHashData = {},
        hashSetup = false;
    cbx.participateInReady(function() {
        return hashSetup;
    }, cbx.HashManager);

    cbx.CommManager.registerHandler('hashchange', 'cbx.HashManager', this, function(hash) {
        prevHash = currHash;
        currHash = hash;
        if (prevHash !== currHash) {
            cbx.HashManager.prepareData();
        }
        hashSetup = true;
        cbx.moduleReady();
        cbx.CommManager.raiseEvent('hashupdated', cHashData);
    });
    return {
        prepareData: function() {
            cHashData = {};
            var hash = currHash.substring(currHash.indexOf('#') + 1, currHash.length);
            if (!cbx.core.isEmpty(hash)) {
                if (canvas.lib.secure) {
                    hash = canvas.lib.secure.decrypt(hash);
                }
                var hashArr = hash.split('&');
                var keyVal;
                for (var i = 0, len = hashArr.length; i < len; i++) {
                    keyVal = hashArr[i].split("=");
                    if (keyVal !== null && cbx.core.isArray(keyVal)) {
                        hashData[keyVal[0]] = keyVal[1];
                    }
                }
                if (hashData === null) {
                   /* hashData = {
                        'empty': true
                    };*/
                }

                cHashData = cbx.clone(hashData);
            } else {
                cHashData = {
                    /*'empty': true*/
                };
                hashData = {
                    /*'empty': true*/
                };
            }
        },
        getHashData: function() {
            return cHashData;
        },
        setHash: function(params) {
            var hash = '';
            for (i in params) {
                hash += i + '=' + params[i] + '&';
            }
            hash = hash.substring(0, hash.length - 1);
            if (canvas.lib.secure) {
                hash = canvas.lib.secure.encrypt(hash);
            }
            window.location.hash = '#' + hash;
        },
        updateHash: function(params) {
            var data = cbx.clone(hashData);
            cbx.core.apply(data, params);
            this.setHash(data);
        }
    };
}();

$(function() {
    // Bind the event.
    $(window).hashchange(function() {
        cbx.CommManager.raiseEvent("hashchange", location.hash);
    });

    // Trigger the event (useful on page load).
    $(window).hashchange();
});