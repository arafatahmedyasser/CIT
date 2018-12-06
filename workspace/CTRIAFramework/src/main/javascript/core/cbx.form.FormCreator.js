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
cbx.ns('cbx.form');
/**
 * 
 */
cbx.form.constants = {
    'DEFAULT_FORM_MODE': 'view',
    'VIEW_MODE': 'view',
    'EDIT_MODE': 'edit',
    'DIR_TOP': 'TOP'
};
/**
 * 
 */
cbx.textField = Class(cbx.core.Component, {
    initialize: function() {
        var field = {
            xtype: 'cbx-textfield'
        };
    }
});
/**
 * 
 */
cbx.form.TypeMap = {
    'TEXT': {
        view: 'cbx-staticfield',
        edit: 'cbx-textfield'
    },
    'AMOUNT': {
        view: 'cbx-staticamountfield',
        edit: 'cbx-amountfield'
    },
    'LOOKUP': {
        view: 'cbx-staticfield',
        edit: 'cbx-editablelookup'
    },
    'TEXTAREA': {
        view: 'cbx-statictextarea',
        edit: 'cbx-textarea'
    },
    'FIELD-SET': {
        view: 'cbx-fieldset',
        edit: 'cbx-fieldset'
    },
    'COMBO': {
        view: 'cbx-staticcombobox',
        edit: 'cbx-combobox'
    },
    'ICONCOMBO': {
        view: 'cbx-staticcombobox',
        edit: 'cbx-iconcombobox'
    },
    'CHECKBOX_GROUP': {
        view: 'cbx-checkboxgroupstaticfield',
        edit: 'cbx-checkboxgroup'
    },
    'RADIO_GROUP': {
        view: 'cbx-radiogroupstaticfield',
        edit: 'cbx-radiogroup'
    },
    'DATE': {
        view: 'cbx-staticdatefield',
        edit: 'cbx-datefield'
    },
    'INFOPANEL': {
        view: 'cbx-panel',
        edit: 'cbx-panel'
    },
    'PANEL': {
        view: 'cbx-lazzypanel',
        edit: 'cbx-lazzypanel'
    },
    'FORMCOMPOSIT': {
        view: 'cbx-compositefield',
        edit: 'cbx-compositefield'
    },
    'LABEL': {
        view: 'cbx-label',
        edit: 'cbx-label'
    },
    'BUTTON': {
        view: 'cbx-button',
        edit: 'cbx-button'
    },
    'HIDDEN': {
        view: 'cbx-hidden',
        edit: 'cbx-hidden'
    },
    'WIDGET': {
        view: 'cbx-widgetpanel',
        edit: 'cbx-widgetpanel'
    },
    'SPINNER': {
        view: 'cbx-staticfield',
        edit: 'cbx-spinnerfield'
    },
    'EMPTY-CELL': {
        view: 'cbx-emptycell',
        edit: 'cbx-emptycell'
    },
    'TITLE': {
        view: 'cbx-title',
        edit: 'cbx-title'
    },
    'TABPANEL': {
        view: 'cbx-tabpanel',
        edit: 'cbx-tabpanel'
    },
    'ITEMSELECTOR': {
        view: 'cbx-staticitemselector',
        edit: 'cbx-itemselector'
    },
    'UPLOADPANEL': {
        view: 'cbx-statictextarea',
        edit: 'cbx-fileuploadpanel'
    },
    'HTMLEDITOR': {
        view: 'cbx-htmleditor',
        edit: 'cbx-htmleditor'
    },
    'LINE': {
        view: 'cbx-line',
        edit: 'cbx-line'
    },
    'INDPNDNT_LKUP': {
        view: 'cbx-emptycell',
        edit: 'cbx-lookup'
    },
    'LOGO': {
        view: 'cbx-logo',
        edit: 'cbx-logo'
    },
    'HYPERLINK': {
        view: 'cbx-hyperlink',
        edit: 'cbx-hyperlink'
    },
    'PASSWORD': {
        view: 'cbx-staticfield',
        edit: 'cbx-passwordfield'
    },
    "AUTO_SUGGEST": {
        view: 'cbx-staticcombobox',
        edit: 'cbx-autoSuggest'
    },
    'IMAGEPANEL': {
        view: 'cbx-imagepanel',
        edit: 'cbx-imagepanel'
    },
    "RATE_FIELD": {
        view: 'cbx-displayratefield',
        edit: 'cbx-ratefield'
    },
    'DISPLAYFIELD': {
        view: 'cbx-displayfield',
        edit: 'cbx-displayfield'
    },
    'MAND_TEXT': {
        view: 'cbx-mandatoryText',
        edit: 'cbx-mandatoryText'
    },
    'COND_MAND_TEXT': {
        view: 'cbx-conditionalMandatoryText',
        edit: 'cbx-conditionalMandatoryText'
    },
    'CHECKBOX': {
        view: 'cbx-checkbox',
        edit: 'cbx-checkbox'
    },
    'EMPTY-ROW': {
        view: 'cbx-rowclear',
        edit: 'cbx-rowclear'
    },
    'MUL_SEL_COMBO': {
        view: 'cbx-staticmultiselectcombobox',
        edit: 'cbx-multiselectcombobox'
    }
};
/**
 * This class is expected to read the meta data and massage it to bring in ExtJS
 * code construct form This class is expected to be used by formRender for
 * combining similar other forms and making them as one unit.
 * 
 * @class cbx.form.FormCreator
 */
cbx.form.FormCreator = function(config) {
    /**
     * 
     */
    this.mode = config.mode;
    /**
     * 
     */
    this.metadata = config.metadata;
    /**
     * 
     */
    this.model = config.model;
    /**
     * 
     */
    this.formId = config.formId;
    /**
     * 
     */
    this.manager = config.manager;
    /**
     * 
     */
    this.preInitConfig = config.preInitConfig;
    /**
     * 
     */
    this.screenView = config.screenView;
    /**
     * In case the metadata is not available in the config (moslty in the cass
     * of Sub Forms). For creator is expected to retrieve the metadata from the
     * registry
     */
    if (cbx.isEmpty(config.metadata)) {
        cbx.form.FormRegistery.getFormMetadata(this.formId, function(formMetadata) {
            this.metadata = formMetadata;
        }, this, this.manager);
    }
    /**
     * Check needed in case of a Field-Set requesting for children components
     * here the metata data will be made available as the config object of the
     * constructor but the additionalData of the form will not be available.
     */
    if (cbx.isEmpty(this.metadata.additionalData)) { /* MOBILITY FIX*/
        cbx.form.FormRegistery.getFormMetadata(this.formId, function(formMetadata) {
            this.metadata.additionalData = formMetadata.additionalData;
        }, this, this.manager);
    }
    /**
     * The Method that returns the form fields with respective mode and xtype
     * applied
     * 
     * @return formfields
     */
    this.getFormFields = function() {
        var children = this.metadata.children;
        /**
         * The Method is Called so that the getItemConfig is 
         * called for all the forms and subforms
         */
        this.getForm();
        var tempformitemslist = [];
        cbx.each(children, function(item) {
            tempformitemslist.push(this.getItemConfig(item));
        }, this);
        return tempformitemslist;
    };
    /**
     * 
     */
    this.getForm = function() {
        return this.getItemConfig(this.metadata);
    };
    /**
     * 
     */
    this.getItemConfig = function(item) {
        if (this.preInitConfig) {
            item = this.applyPreInitiConfig(item);
        }
        var colspan = item.colSpan != null && item.colSpan.length > 0 ? parseInt(item.colSpan) : null;
        var rowspan = item.rowSpan != null && item.rowSpan.length > 0 ? (item.rowSpan) : null;
        var anchor = (item.anchor == null || item.anchor.length == 0) ? '100%' : ((item.anchor.indexOf('%') == -1) ? item.anchor + '%' : item.anchor);
        var compMode = this.getMode(item);
        /**
        The below condition will check whether the items is a direct child of 
        the sub form or not,whom we want to add on the fly.
        Because formIndex will be a property of the sub form(cbx-lazzyformpanel for which initialMultiplicty will not be null and proper value wil exists)
        */
        if (!cbx.isEmpty(config) && !cbx.isEmpty(config.formIndex)) {
            Ext.apply(item, {
                index: config.formIndex
            });
        }
        /**
        The condition below will check whether the item is a part of other container lets say
        cbx-composite,cbx-fieldset,cbx-lazzyformpanel(for which the initialMultiplicity is null)
        */
        else if (!cbx.isEmpty(config) && !cbx.isEmpty(config.index)) {
            Ext.apply(item, {
                index: config.index
            });
        }
        /**
        The below two blocks will cascade the multi form indicator and the multi form id for the items when creating
        */
        if (!cbx.isEmpty(config) && !cbx.isEmpty(config.multiInd)) {
            Ext.apply(item, {
                multiInd: config.multiInd
            });
        }
        if (!cbx.isEmpty(config.multiFormId)) {
            Ext.apply(item, {
                multiFormId: config.multiFormId
            });
        };
        if (item.hidden == true) {
            item.visibleInd = 'N';
        }
        var hideLabel = (item.hideLabel && (item.hideLabel == 'Y' || item.hideLabel == true)) ? true : false;
        cbx.apply(item, {
            model: this.model,
            screenView: this.screenView,
            manager: this.manager,
            metadata: this.metadata,
            colspan: colspan,
            hideLabel: hideLabel,
            rowspan: rowspan,
            anchor: anchor,
            labelAlign: this.getLabelAlignType(item),
            hideLabelInd: (item.hideLabelInd ? item.hideLabelInd : ''),
            mode: this.mode,
            doResize: function() {
                try {
                    if (item.itemType !== 'UPLOADPANEL' && iportal.systempreferences.getFramework() == "ext") {
                        if (this.isFormField === true) {
                            var rz = this.wrap;
                            var w = this.getWidth();
                            if (item.itemType === 'SPINNER') {
                                if (this.el && this.el.getWidth) {
                                    var w = parseInt(this.el.getWidth()) + parseInt(17);
                                } else {
                                    var w = this.getWidth();
                                }
                            }
                            if (item.itemType === 'MUL_SEL_COMBO') {
                                if (this.el && this.el.getWidth) {
                                    var w = parseInt(this.el.getWidth()) + parseInt(this.getTriggerWidth())
                                } else {
                                    var w = this.getWidth();
                                }
                            }
                            if (!cbx.isEmpty(rz)) {
                                if (rz.getWidth() < w) {
                                    rz.setWidth(w);
                                    if (!this.errorIcon) {
                                        var elp = this.getErrorCt();
                                        if (!elp) {
                                            this.el.dom.title = msg;
                                            return;
                                        }
                                        this.errorIcon = elp.createChild({
                                            cls: 'x-form-invalid-icon'
                                        });
                                        if (this.ownerCt) {
                                            this.ownerCt.on('afterlayout', field.alignErrorIcon, field);
                                            this.ownerCt.on('expand', field.alignErrorIcon, field);
                                        }
                                        this.on('resize', this.alignErrorIcon, this);
                                        this.on('destroy', function() {
                                            Ext.destroy(this.errorIcon);
                                        }, this);
                                    }
                                } else {
                                    if (rz.getWidth() <= w || w < rz.getWidth()) {
                                        if (item.itemType === 'SPINNER' && Ext.isIE) {
                                            rz.setWidth(parseInt(this.el.getWidth()) + parseInt(17));
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (err) {
                    LOGGER.debug(err);
                }
            },
            /**
             * used for update the visible indicator and screen view data in at
             * the time of rendering and also update the screen data dynamically
             * while the screen value change
             */
            updateScreenViewData: function(config) {
                config.screenView.updateScreenViewData(config.formId, config.itemId, config.getScreenViewData());
            },
            /**
             * used to set the visible indicator value the component hide by
             * some other events on items
             */
            updateVisibilityInSV: function(config, indicator) {
                config.screenView.updateVisibleInd(config.formId, config.itemId, indicator);
            }
        });
        /**
         * Addded tabpanel in the if condition to later transfer the preInitConfig to all its children
         */
        if (item.itemType === 'FIELD-SET' || item.formInd === 'Y' || item.itemType === 'PANEL' || item.itemType === 'TABPANEL' || item.itemType === 'FORMCOMPOSIT' || item.itemType === 'UPLOADPANEL') {
            cbx.apply(item, {
                preInitConfig: this.preInitConfig
            });
        }
        if ((item.itemType === 'TEXT' || item.itemType === 'TEXTAREA') && item.lookupInd === 'Y') {
            cbx.apply(item, {
                xtype: cbx.form.TypeMap['LOOKUP'][compMode]
            });
        } else if (item.formInd === 'Y') {
            cbx.apply(item, {
                xtype: 'cbx-lazzyformpanel'
            });
            if (item.itemType === 'FORMDETAIL') {
                cbx.apply(item, {
                    mode: 'view'
                });
            }
        } else if (cbx.form.TypeMap[item.itemType] != null) {
            cbx.apply(item, {
                xtype: cbx.form.TypeMap[item.itemType][compMode]
            });
            try {
                cbx.apply(item, {
                    addData: cbx.clone(this.metadata.additionalData[item.itemId]),
                    rawKeys: this.parseRawData(item.rawKeys),
                    rawValues: this.parseRawData(item.rawValues)
                });
            } catch (e) {
                //LOGGER.error('Error',[e,item.itemId]);
                LOGGER.error(e);
            }
            if (item.cacheDataInd === 'N') {
                if (this.metadata.additionalData[item.itemId] != null) {
                    delete this.metadata.additionalData[item.itemId];
                }
            }
            if (compMode === 'view') {
                cbx.apply(item, {
                    required: 'N',
                    conditional: 'N'
                });
            }
        }
        /**
         * Ie6 is not able to render the tabpanel with correct width for that
         * the tabpanel comoponent needs to be wrapped under a panel with column
         * layout. A new itemType 'TAB_WRAPPER' is added to provide 100% widtch
         * of the table cell within the tableForm layout.
         */
        if (item.itemType === 'TABPANEL' && cbx.isIE6()) {
            return {
                layout: 'column',
                anchor: '100%',
                itemType: 'TAB_WRAPPER',
                defaults: {
                    columnWidth: 1
                },
                border: false,
                xtype: 'panel',
                items: [item]
            };
        }
        this.screenView.updateItemInfo(item);
        return item;
    };
    /**
     * Private Method, this method sets the label alignment for form fields by
     * applying required itemCls based on the LABEL_ALIGN_TYPE config value.
     * Label alignment for containers (FIELD-SET, PANEL, TABPANEL and SubForms)
     * will be done using configuration labelAlign supported by Ext. If there is
     * no label alignment configured for forms, default alignment 'top' will be provided
     * by framework.
     */
    this.getLabelAlignType = function(item) {
        if (item.itemType === 'BUTTON') {
            return;
        } else if (item.formInd === 'Y') {
            return (item.labelAlignType ? item.labelAlignType : 'top');
        } else if ((item.itemType === 'FIELD-SET' && item.formInd === 'Y') || (item.itemType === 'PANEL' && item.formInd === 'Y') || item.itemType === 'TABPANEL') {
            return (item.labelAlignType ? item.labelAlignType : '');
        } else {
            var itemClsToApply = "";
            if (!cbx.isEmpty(item.itemCls)) {
                itemClsToApply = item.itemCls;
            }
            itemClsToApply = itemClsToApply + " " + (item.labelAlignType === 'right' ? 'cbx-labelalign-right' : (item.labelAlignType === 'left' ? 'cbx-labelalign-left' : (item.labelAlignType === 'top' ? 'cbx-labelalign-top' : '')));
            cbx.apply(item, {
                itemCls: itemClsToApply
            });
            return;
        }
    };
    /**
     * The method is expected to apply all the preinit configurations provided
     * PEG developer in the listener of the form. CHG-FFQ2: Fix added for
     * applying the preinit config for component of type FORM as the FORM
     * component has formId rather than itemId
     */
    this.applyPreInitiConfig = function(item) {
        var configObj;
        if (this.preInitConfig[item.itemId]) {
            configObj = this.preInitConfig[item.itemId];
        } else if (this.preInitConfig[item.formId] && item.formInd === 'Y') {
            configObj = this.preInitConfig[item.formId];
        }
        if (configObj) {
            delete configObj.xtype;
            cbx.apply(item, configObj);
        };
        return item;
    };
    /**
     * The Method that returns the layout configuration of the forms
     * 
     * @return layout config.
     */
    this.getLayoutConfig = function() {
        var layConf = cbx.isEmpty(this.metadata) || cbx.isEmpty(this.metadata.totalColumns) ? {
            columns: 1
        } : {
            columns: this.metadata.totalColumns
        };
        return layConf;
    };
    /**
     * This method is intended to compute the correct mode for the component,
     * this would involve taking the item's editable property, mode provided for
     * its form by the app layer and also configurations provided by
     * preinitialize handler of the form FW. The priority of mode will be in the
     * following order preinitialize > mode configuration > editable property >
     * default.
     */
    this.getMode = function(item) {
        var mode = cbx.form.constants.DEFAULT_FORM_MODE;
        if (this.mode == null) {
            /**
             * for respecting the preinitialize parameters set by the developer
             * to override the default parameters
             */
            if (item.mode != null && cbx.isString(item.mode)) {
                mode = item.mode;
            }
            /**
             * In case the mode for the form is null then check if the
             * component is editable in the meta data and take that value as
             * its mode.
             */
            else if (item.editableInd === 'Y') {
                mode = cbx.form.constants.EDIT_MODE;
            } else {
                mode = cbx.form.constants.DEFAULT_FORM_MODE;
              }
        } else {
            /**
             * for respecting the preinitialize parameters set by the developer
             * to override the default parameters
             */
            if (cbx.isString(item.mode)) {
                mode = item.mode;
            }
            /**
             *  If mode is provided as a strign by the app layer. 
             */
            else if (cbx.isString(this.mode)) {
                mode = this.mode;
            } else {
                /**
                 * checking if mode is provided by the app layer for this
                 * compoent's form id
                 */
                if (this.mode[item.formId] != null) {
                    mode = this.mode[item.formId];
                } else {
                    if (this.mode['global'] != null) {
                        mode = this.mode['global'];
                    } else {
                        mode = cbx.form.constants.DEFAULT_FORM_MODE;
                    }
                }
            }
        }
        return mode;
    };
    /**
     * Helper method to convert the items provided into an array
     */
    this.parseRawData = function(items) {
        items = items + '';
        var splitValue = items.split(',');
        var sArray = [];
        for (var i = 0; i < splitValue.length; i++) {
            sArray.push(splitValue[i]);
        }
        return sArray;
    };
};