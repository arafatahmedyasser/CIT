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
 
cbx.ns('cbx.lib');

/*
 * Function to create a DIV layer (instead of directly using document.createElement)
 *
 * Usage:
 *
 * Create a configuration object with all the attributes and their values to be added for the DIV
 *
 * Instantiate the layer object with the required configuration
 * 
 * var layerConfig = {
 *	id: 'myLayer',
 *  "eleType": "div",
 *	style: {
 *		color: '#FFF',
 *		font: 'normal 20px arial'
 *	},
 *  html: '<span class="test"><img src="images/myimage.png"/></span>'
 * }
 *
 * var layer = new cbx.lib.layer(layerConfig);
 *	
 * Create a layer and appending it to the main layer object
 *
 * var childlayer = new cbx.lib.layer();
 * layer.addLayer(childlayer.getHTML());
 *
 * While returning the main layer, please use the getLayer() function to ensure that a DOM object from the layer is returned back, instead of layer object.
 * return layer.getLayer();
 *
 
 */
cbx.lib.layer = Class({
    /**
     * global variable that holds the required DIV HTML
     */
    ele: null,
    /**
     * 
     */
    parent: '',
    /**
     * 
     */
    constructor: function(config) {
        var eleType = config.eleType;
        this.parent = config.parent;
        delete config.eleType;
        if (typeof eleType !== 'undefined') {
            this.ele = document.createElement(eleType);
            for (var key in config) {
                if (key == 'style') {
                    this.setLayerStyles(config[key]);
                } else if (key == 'html') {
                    if (typeof config[key] == 'object') {
                        this.addLayer(config[key]);
                    } else {
                        this.ele.innerHTML = config[key];
                    }
                } else if (key == 'listeners') {
                    if (typeof config[key] !== 'undefined' && config[key] !== '') {
                        this.evt = config[key];
                        var that = this;
                        this.ele.onclick = function() {
                            widgetListener.raiseEvent(that.evt);
                        };
                    }
                } else {
                    this.ele.setAttribute(key, config[key]);
                }
            }
        }
    },
    /**
     * 
     */
    addLayer: function(obj) {
        this.ele.appendChild(obj);
    },
    /**
     * 
     */
    setLayerStyles: function(obj) {
        for (var key in obj) {
            this.ele.style[key] = obj[key];
        }
    },
    /**
     * 
     */
    setLayer: function(layerDOM) {
        this.ele = layerDOM;
    },
    /**
     * 
     */
    getLayer: function() {
        return this.ele;
    },
    /**
     * 
     */
    raise: function(e) {
        this.evt = e;
        var that = this;
        this.ele.onclick = function() {
            that.parent.raiseEvent(that.evt);
        };
    }
});