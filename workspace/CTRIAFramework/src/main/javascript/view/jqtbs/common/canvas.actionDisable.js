/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
$(document).ready(function() {
    /**
     * @description disabling right/context click throughout the application.
     */
    document.oncontextmenu = document.body.oncontextmenu = function() {
        return false;
    }

    /**
     * @description disabling backspace throughout the application except some input fields.
     */

    $(document).keydown(function(e) {
        if (e.keyCode == 8) {
            if (e.target.nodeName == "INPUT" || e.target.nodeName == "TEXTAREA" || e.target.className == "html-editor") {
                if (e.target.attributes[0].nodeValue == "checkbox" || e.target.attributes[0].nodeValue == "radio" || e.target.attributes[0].nodeValue == "file") {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
    });

});
