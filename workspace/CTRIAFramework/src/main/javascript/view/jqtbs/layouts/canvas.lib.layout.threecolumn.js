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
cbx.ns('canvas.lib.layout');
/**
 * @namespace "canvas.lib.layout"
 * @description This component is currently responsible Jquery_Bootstrap Framework to render stack sub-workpace layout.
 */
canvas.lib.layout.threecolumn = Class(cbx.core.Component, {
    /**
     * @class "canvas.lib.layout.threecolumn"
     * @description The constructor gets the metadata and initialises the other methods in the class namely 'initializeColumns' and 'generateThreeCol'.
     */
    proportion: [33.33, 33.33, 33.33],
    proportionMappings: [{
        '8.33': '1'
    }, {
        '16.67': '2'
    }, {
        '25.00': '3'
    }, {
        '33.33': '4'
    }, {
        '41.66': '5'
    }, {
        '50.00': '6'
    }, {
        '58.33': '7'
    }, {
        '66.66': '8'
    }, {
        '75.00': '9'
    }, {
        '83.33': '10'
    }, {
        '91.66': '11'
    }, {
        '100.00': '12'
    }],
    leftcol: null,
    rightcol: null,
    parent: null,
    constructor: function(config) {
        cbx.core.extend(this, config);
        canvas.lib.layout.threecolumn.$super.call(this);
        if (!cbx.core.isEmpty(this.layoutProportion)) {
            this.proportion = this.layoutProportion.split(',');
        }
        this.initializeColumns();
        this.generateThreeCol();
        this.parent.append(this.getItem(0));
    },
    /**
     * @method initializeColumns
     * @memberof "canvas.lib.layout.threecolumn"
     * @description This method is responsible for generating a DOM structure with 3 columns 
     * using lib layer. 
     */
    initializeColumns: function() {
        var proportion1 = 33.33;
        var proportion2 = 33.33;
        if (this.proportion[0] != null || this.proportion[1] != null || this.proportion[2] != null) {
            if (this.proportion[0] > 1) {
                proportion1 = this.proportion[0];
            } else {
                proportion1 = this.proportion[0] * 100;
            }
            if (this.proportion[1] > 1) {
                proportion2 = this.proportion[1];
            } else {
                proportion2 = this.proportion[1] * 100;
            }
        }
        var prop1 = 4;
        var prop2 = 4;
        for (var i = 0, tot = this.proportionMappings.length; i < tot; i++) {
            var key = Object.keys(this.proportionMappings[i])[0];
            if (parseInt(key) >= parseInt(proportion1)) {
                prop1 = parseInt(this.proportionMappings[i][key]);
                break;
            }
        }
        for (var i = 0, tot = this.proportionMappings.length; i < tot; i++) {
            var key = Object.keys(this.proportionMappings[i])[0];
            if (parseInt(key) >= parseInt(proportion2)) {
                prop2 = parseInt(this.proportionMappings[i][key]);
                break;
            }
        }
        var prop3 = 12 - (prop1 + prop2);
        var leftcolConfig = {
            'eleType': 'div',
            'class': 'content-left col-md-' + prop1
        };
        var centercolConfig = {
            'eleType': 'div',
            'class': 'content-center col-md-' + prop2
        };
        var rightColConfig = {
            "eleType": "div",
            'class': 'content-right col-md-' + prop3
        }
        this.leftcol = new cbx.lib.layer(leftcolConfig);
        this.centercol = new cbx.lib.layer(centercolConfig);
        this.rightcol = new cbx.lib.layer(rightColConfig);
    },
    /**
     * @method generateThreeCol
     * @memberof "canvas.lib.layout.threecolumn"
     * @description This method is responsible for generating a DOM structure  
     * 				using lib layer. And the DOM structure created in the method
     * 				'initializeColumns' is appended to this DOM. 
     */
    generateThreeCol: function() {
        var tcLayer = new cbx.lib.layer({
            "eleType": "div",
            "class": "row",
            "ITEM_ID": "THREE-COLUMN"
        }).getLayer();
        tcLayer.appendChild(this.leftcol.getLayer());
        tcLayer.appendChild(this.centercol.getLayer());
        tcLayer.appendChild(this.rightcol.getLayer());
        this.addItem(tcLayer);
    },
    /**
     * @method createColComps
     * @memberof "canvas.lib.layout.threecolumn"
     * @description This method is responsible for adding the app to the 
     * 				respective columns inside the DOM structure created in the method
     * 				'initializeColumns'. 
     */
    createColComps: function(app, item) {
        /**
         * Loop on the available items and position them starting from
         * left to right
         */
        var index = 0;
        var itemArr = [];
        if (app.BLOCK_POSITION == "LEFT" || cbx.core.isEmpty(app.BLOCK_POSITION)) {
            this.leftcol.addLayer(item);
        } else if (app.BLOCK_POSITION == "RIGHT" || cbx.core.isEmpty(app.BLOCK_POSITION)) {
            this.rightcol.addLayer(item);
        } else {
            this.centercol.addLayer(item);
        }
    },
    /**
     * @method getTCContainer
     * @memberof "canvas.lib.layout.threecolumn"
     * @description This method can be used to get the reference of the DOM 
     * 				created in the method 'initializeColumns'.
     */
    getTCContainer: function() {
        return this.getItem(0);
    }
});
/**
 * 		Registering the componenent.
 */
CLCR.registerCmp({
    'COMP_TYPE': 'THREE-COLUMN'
}, canvas.lib.layout.threecolumn);