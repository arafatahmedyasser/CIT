/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.lib.layout');
/**
 * @namespace "canvas.lib.layout"
 * @class canvas.lib.ncol
 * @extends cbx.core.Component
 * @description This class is responsible for creating the n-columns as per the proportion mentioned by the user in Database.
 *              If no width is mentioned, then default width is taken.
 */
canvas.lib.ncol = Class(cbx.core.Component, {
    proportion: [],
    prop: [],
    proportionMappings: [{
					        '0.00': '0'
					    }, {
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
	/**
	 * @constructor
	 */
    constructor: function(config) {
        cbx.core.extend(this, config);
        canvas.lib.ncol.$super.call(this);
        if (!cbx.core.isEmpty(this.layoutProportion)) {
            this.proportion = this.layoutProportion.split(',');
        }
        this.initializeColumns();
        this.generateNcol();
    },

    /**
     * @member {Method} initializeColumns
     * @memberof "canvas.lib.ncol"
     * @description contains the logic behind creating n-columns.
     */
    initializeColumns: function() {
        this.layerConfig = [];

        for (var j = 0, col = 0; j < this.proportion.length; j++) {

            for (var i = 0; i < this.proportionMappings.length; i++) {
                var key = Object.keys(this.proportionMappings[i])[0];

                if (parseInt(this.proportion[j]) <= parseInt(key)) {

                    if (j == this.proportion.length - 1) {
                        this.prop[j] = 12 - col;
                    } else {
                        var m, n;
                        m = parseInt(key) - parseInt(this.proportion[j]);
                        n = parseInt(this.proportion[j]) - parseInt(Object.keys(this.proportionMappings[i - 1])[0]);

                        if (m > n) {
                            var me = this.proportionMappings[i - 1];
                            this.prop[j] = me[Object.keys(me)[0]];
                        } else {
                            var me = this.proportionMappings[i];
                            this.prop[j] = me[Object.keys(me)[0]];
                        }

                        col += parseInt(this.prop[j]);
                    }
                    break;
                }
            }
        }

        for (k = 0; k < this.prop.length; k++) {
            var config = {
                'eleType': 'div',
                'class': 'col-md-' + this.prop[k]
            };
            var layer = new cbx.lib.layer(config);
            this.layerConfig.push(layer);
        }
    },
    
    /**
     * @member {Method} generateNcol
     * @memberof "canvas.lib.ncol"
     * @description This method is responsible for generating a DOM structure  
	 * 				using lib layer. And the DOM structure created in the method
	 * 				'initializeColumns' is appended to this DOM. 
     */
    
    generateNcol : function() {
    	var tcLayer = new cbx.lib.layer({
            "eleType": "div",
            "class": "row",
            "ITEM_ID": "N-COLUMN"
        }).getLayer();

        for (var l = 0; l < this.layerConfig.length; l++) {
            tcLayer.appendChild(this.layerConfig[l].getLayer());
        }

        this.addItem(tcLayer);
	},
    
    /**
     * @member {Method} createColComps
     * @memberof "canvas.lib.ncol"
     * @description This method is responsible for adding the app to the 
	 * 				respective columns.
     */
    createColComps: function(app, item) {
        var cols = this.layerConfig.length;
        var pos = parseInt(app.POSITION) + (cols - 1);
        var foo = pos % cols;
        this.layerConfig[foo].addLayer(item);
    }
});

CLCR.registerCmp({
    'COMP_TYPE': 'N-COLUMN'
}, canvas.lib.ncol);