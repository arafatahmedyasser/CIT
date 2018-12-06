/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('ct.view');
/**
 * @className : ct.view.template
 * @extends : cbx.core.Component
 * @description: This class is responsible to display data using a custom template
 */
ct.view.template = Class(cbx.core.Component, {
    /**
     * @constructor
     */
    initialize: function() {
        var me = this.md;
        var fields = me.md.VIEW_MD.FLD_COLUMN_LIST;
        if (cbx.isEmpty(fields)) {
            this.customView();
        } else {
            this.getListData();
        }
    },
    /**
     * @member {Method} customView
     * @memberof "ct.view.template"
     * @description gets the custom template.
     */
    customView: function() {
        var domString = this.md.md.VIEW_MD.TEMPLATE_CONFIG;
        var templateString = domString.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        this.render(templateString);
    },
    /**
     * @member {Method} getListData
     * @memberof "ct.view.template"
     * @description gets the params needed for ajax to get the list data.
     */
    getListData: function() {
        var params = this.prepareParams();
        this.doAjax(params);
    },
    /**
     * @member {Method} afterAjax
     * @memberof "ct.view.template"
     * @description gets the custom row template.
     * @param {Object} data
     */
    afterAjax: function(data) {
        var domString = this.md.md.VIEW_MD.TEMPLATE_CONFIG;
        var templateString = domString.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        this.records = data.response.value.ALL_RECORDS;
        this.render(templateString);
    },
    /**
     * @member {Method} render
     * @memberof "ct.view.template"
     * @description renders the custom template/row-template.
     * @param {String} templateString
     */
    render: function(templateString) {
        var template = Handlebars.compile(templateString);
        var dom = template(this);
        this.elem.html(dom);
    },
    /**
     * @member {Method} prepareParams
     * @memberof "ct.view.template"
     * @description returns the params for doing ajax.
     * @return {Object} params
     */
    prepareParams: function() {
        var params = {
            INPUT_ACTION: "INIT_DATA_ACTION",
            INPUT_FUNCTION_CODE: this.md.md.VIEW_MD.FUNCTION_CODE,
            INPUT_SUB_PRODUCT: this.md.md.VIEW_MD.SUB_PRODUCT_CODE,
            PAGE_CODE_TYPE: "VDF_CODE",
            PRODUCT_NAME: this.md.md.VIEW_MD.PRODUCT_CODE,
            VIEW_ID: this.md.md.VIEW_MD.VIEW_ID,
            WIDGET_ID: this.md.WIDGET_ID,
            WORKSPACE_ID: "",
            __LISTVIEW_REQUEST: "Y",
            forceCallbacks: "true"
        };
        return params;
    },
    /**
     * @member {Method} doAjax
     * @memberof "ct.view.template"
     * @description performs the ajax to get the data from view column.
     * @param {Object} params
     */
    doAjax: function(params) {
        var foo = this;
        cbx.ajax({
            params: params,
            success: function(data) {
                foo.afterAjax(data);
            }
        });
    }
});
CLCR.registerCmp({
    'COMP_TYPE': 'APP',
    'VIEW_TYPE': 'TEMPLATE'
}, ct.view.template);