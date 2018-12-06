/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
cbx.ns("ct.lib");
/**
 * @class 		"ct.lib.FormView"
 * @extends 	"cbx.core.Component"
 * @description This class is responsible for rendering form view in a app. 
 */
ct.lib.FormView = Class(cbx.core.Component, {
    /**
     * @method 		initialize
     * @memberof 	"ct.lib.FormView"
     * @description Initialises the form app component.
     */
    initialize: function() {
        this.viewMD = this.md.md.VIEW_MD;
        var that = this;
        CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray(["FORM_FRAMEWORK"]), function() {
            CTLOADMASKMANAGER.initiateLoadMask($(that.elem), iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LOADING") + that.md.WGT_TITLE, $(that.elem));
            var fm = new cbx.form.FormManager({
                formId: that.viewMD.FLD_DATA_SRC_ID,
    			listeners : {
    				'initialized' : function (manager){
    					 that.viewConf.raiseEvent('forminitialized', manager);
    				},
    				'formbeforeinitialize' : function (manager){
    					 that.viewConf.raiseEvent('formbeforeinitialize', manager);
    				}
    			}
            });
            that.fm = fm;
            CTLOADMASKMANAGER.hideLoadMask(that.elem, that.elem);
            that.formRef = fm.getFormView();
            $(that.elem).html(that.formRef);
        });
    },
    /**
     * @method 		getFormView
     * @memberof 	"ct.lib.FormView"
     * @description Returns the form view.
     */
    getFormView: function() {
        return that.formRef;
    },
    /**
     * @method 		exportToPDF
     * @memberof 	"ct.lib.FormView"
     * @description This method is responsible for exporting the form to PDF format
     */
    exportToPDF: function() {
        this.fm.exportForForms('PDF', this.viewMD.VIEW_DISPLAY_NM);
    },
    /**
     * @method 		exportToExcel
     * @memberof 	"ct.lib.FormView"
     * @description This method is responsible for exporting the form to Excel format
     */
    exportToExcel: function() {
        this.fm.exportForForms('PDF', this.viewMD.VIEW_DISPLAY_NM);
    },
    /**
     * @method 		exportToCSV
     * @memberof 	"ct.lib.FormView"
     * @description This method is responsible for exporting the form to CSV format
     */
    exportToCSV: function() {
        this.fm.exportForForms('PDF', this.viewMD.VIEW_DISPLAY_NM);
    },
    /**
     * @method 		exportToRTF
     * @memberof 	"ct.lib.FormView"
     * @description This method is responsible for exporting the form to RTF format
     */
    exportToRTF: function() {
        this.fm.exportForForms('PDF', this.viewMD.VIEW_DISPLAY_NM);
    },
    /**
     * @method 		print
     * @memberof 	"ct.lib.FormView"
     * @description This method is responsible for printing the form.
     */
    print: function() {
        this.fm.exportForForms('HTML', this.viewMD.VIEW_DISPLAY_NM);
    }
});
CLCR.registerCmp({
    'COMP_TYPE': 'APP',
    'VIEW_TYPE': 'FORM'
}, ct.lib.FormView);
