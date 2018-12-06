/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns("canvas.sessionTimeout");

/**
 * @member {Method} ajaxStop
 * @memberof "Jquery" | "$"
 * @description this funtion get triggered when any ajax got  stoped
 * here we are statring the timer whenever ajax request completed for both with / without Error.     
 */
$(document).ajaxStop(function () {
    canvas.sessionTimeout.startSessionTimer();
});

/**
 * @member {Method} ajaxStart
 * @memberof "Jquery" | "$"
 * @description this funtion get triggered when any ajax got started  / triggered.
 * here we are stop / reset the timer whenever ajax request started  / triggered.     
 */
$(document).ajaxStart(function () {
    clearTimeout(canvas.sessionTimeout.timeoutHandler);
});

/**
 * @member {Method} canvas.sessionTimeout.startSessionTimer
 * @memberof canvas.sessionTimeout {Global Function}
 * @description this funtion has a anonymous function which is called with specific intervel of  time.
 * anonymous function will diplay the popup after before session got expired.
 */
canvas.sessionTimeout.startSessionTimer = function () {
    clearTimeout(canvas.sessionTimeout.timeoutHandler);
    var timerIntervel = Number(iportal.systempreferences.getIdleSessionTimeoutInSeconds()) > 0 ? iportal.systempreferences.getIdleSessionTimeoutInSeconds() : 14000;
    canvas.sessionTimeout.timeoutHandler = setTimeout(function () {
        var bundle = CRB.getBundle(CRB.getFWBundleKey());
        var logoutConfirmationDialog = new canvas.Dialog({
            title: bundle['LBL_MESSAGE'],
            message: bundle['TIMEOUT_NOTIFICATION'],
            dialogType: "USERDEFINED",
            dialogStyle: "YES_NO",
            noHandler: function () {
                logoutConfirmationDialog.close();
                clearTimeout(canvas.sessionTimeout.timeoutHandler);
                clearTimeout(canvas.sessionTimeout.warningHandler);
                iportal.logoutSuccess();
            },
            yesHandler: function () {
                logoutConfirmationDialog.close();
                canvas.sendActiveToken();
            }
        });
        var sessionCallbacks = $.Callbacks();
        sessionCallbacks.add(logoutConfirmationDialog.show());
        sessionCallbacks.add(function () {
            canvas.sessionTimeout.warningHandler = setTimeout(function () {
                clearTimeout(canvas.sessionTimeout.warningHandler);
                logoutConfirmationDialog.close();
                clearTimeout(canvas.sessionTimeout.timeoutHandler);
                iportal.logoutSuccess();
            }, 60000);
        });
        sessionCallbacks.fire();
    }, timerIntervel);
};

/**
 * @member {Method} sendActiveToken
 * @memberof canvas {Global Function}
 * @description Method to re-activate a session of the user
 */
canvas.sendActiveToken = function () {
    var that = this;
    var params = {
        INPUT_ACTION: 'ACTIVE_TOKEN',
        PAGE_CODE_TYPE: 'USER_PREF_CODE',
        PRODUCT_NAME: 'CANVAS',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_SUB_PRODUCT: 'CANVAS',
        INPUT_PRODUCT: 'CANVAS'
    };

    cbx.ajax({
        params: params,
        success: function (response) {
            //Nothing to here...
        },
        failure: function () {
            LOGGER.log(CRB.getFWBundle()['SYSERROR']);
            clearTimeout(canvas.sessionTimeout.timeoutHandler);
            iportal.logoutSuccess(); //Log-out called if session re-activation got  failure
        }
    });
};