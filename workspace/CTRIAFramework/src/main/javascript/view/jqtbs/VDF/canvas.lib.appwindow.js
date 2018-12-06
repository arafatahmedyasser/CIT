/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

 /**
  * @namespace "canvas.lib"
  */
  
cbx.ns("canvas.lib");

/**
 * @description This component is currently responsible for the opening an app in an modal window
 */


canvas.lib.appwindow = Class(cbx.core.Component, {
        /**
         * @class "canvas.lib.appwindow"
         * @description The constructor gets the parent element.
         */
        constructor : function (config)
        {
                this.content = config.modalContent;
                this.modalClass=config.modalClass;
                this.appId=config.appId;
               
                this.createAppWindow();
        },
        /**
         * @method createModal
         * @memberof "canvas.lib.appwindow"
         * @description This method is responsible for creating the app window.
         */
        createAppWindow : function ()
        {
    		var tempContDiv =  new cbx.lib.layer({"eleType" : "div"}).getLayer();

        	var element = $(tempContDiv);
        	var widgetConfig = {
        				 CONTAINER_FLAG   : 'N',
        				 'WGT_HEADER_IND' : 'Y',
        				 WIDGET_ID        : this.appId

        			};
              	var config = {
        				elem : element,
        				PORTLET_REQ : true,
        				ptScope: this
        			};
        	cbx.core.extend(config, widgetConfig);
        	var appObj = new canvas.lib.app(config);
        	var modal = CLCR.getCmp({
				"COMP_TYPE" : "MODAL_WINDOW",
			});
			var config = {
				modalContent : element,
				modalClass : 'ct-modal__max',
				fullscreenInd : false
			};
			this.modalObj = new modal(config);
        }
        

});
CLCR.registerCmp({
        "COMP_TYPE" : "APP_WINDOW"
}, canvas.lib.appwindow);
