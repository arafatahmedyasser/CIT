/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns("canvas.lib");

canvas.lib.loadmaskcomplete = Class(cbx.core.Component, {
    constructor: function(response, elementConfig, removeGlobalmask) {
        if (elementConfig) {
            this.config = response;
            this.data = response.data;
            this.text = response.text;
            this.element = elementConfig;
            this.removeMask(this.element);
        } else if (removeGlobalmask) {
            var globalContainer = $('#CONTENT_DIV');
            canvas.lib.maskmgr.GLOBALMASKON = false;
            this.removeMask(globalContainer);
            canvas.lib.maskmgr.emptyItems();
            if (globalContainer.find('[data-item-id=load-statusbar]').length > 0) {
                this.emptyStatusBar();
            }
        }
    },

    emptyStatusBar: function() {
        /*
         * a fail safe done to empty the status bar if it has any pending loading status after complet WS loading
         */
        $('#CONTENT_DIV').find('[data-item-id=load-statusbar]').children('.statuspush').removeClass('statuspush').addClass('statuspop');
        setTimeout(function() {
            $('#CONTENT_DIV').find('[data-item-id=load-statusbar]').remove();
        }, 1000);
    },
    removeMask: function(element) {
        var container = element;
        var maskElement = container.find('[data-item-id=load-mask]');
        canvas.lib.maskmgr.removeMaskItem(container);
        var maskid = maskElement.attr('data-mask-id');
        this.hideStatus(maskid);
        maskElement.remove();
        // canvas.lib.maskmgr.emptyItems();
    },
    hideStatus: function(maskid) {
        var statusbar = $('#CONTENT_DIV').find('[data-item-id=load-statusbar]');
        if (statusbar.length > 0) {
            statusbar.find('div[data-mask-id=' + maskid + ']').removeClass('statuspush').addClass('statuspop');
        }
    }
});
CLCR.registerCmp({
    "COMP_TYPE": "GLOBAL_AJAX_LISTENERS",
    "SEQUENCE": "COMPLETE"
}, canvas.lib.loadmaskcomplete);
