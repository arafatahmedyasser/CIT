/**
 * Copyright 2014. Intellect Design Arena Limited
 */
cbx.ns("canvas.lib");


canvas.lib.dialogBoxConfig = Class(cbx.core.Component, {

    dialoginfo: [],

    btnPrintHandler: null,

    dialogType: 'CONFIRMATION',

    printReqd: false,

    helpReqd: false,

    customMsgOnlyInd: true,

    dialogStyle: '',

    title: '',

    message: '',

    scope: null,

    bundleKey: '',

    defaultOkHandler: function() {
        this.close();
    },
    defaultCancelHandler: function() {
        this.close();
    },
    defaultYesHandler: function() {
        this.close();
    },
    defaultNoHandler: function() {
        this.close();
    },
    defaultEditHandler: function() {
        this.close();
    },
    defaultRePrintHandler: function() {
        this.close();
    },
    defaultContinueHandler: function() {
        this.close();
    },
    defaultAcceptHandler: function() {
        this.close();
    },
    defaultRejectHandler: function() {
        this.close();
    },
    defaultAcceptPrintHandler: function() {
        this.close();
    },
    defaultPrintSuccess: function() {
        this.close();
    },
    defaultPrintFail: function() {
        this.close();
    },
    defaultSubmitHandler: function() {
        this.close();
    },

    initialize: function() {

        this.scope = this.scope ? this.scope : this;
        cbx.isEmpty(this.customMsgOnly) ? this.customMsgOnlyInd : this.customMsgOnly;
        this.dialoginfo = [];
        /**
         * As we dont have the DB configuration of bundleKey for model dialog, here i am getting the default
         * bundleKey
         */
        if (this.bundleKey === '') {
            this.bundleKey = CRB.getFWBundleKey();
        }
    },
    show: function() {
        this.showDialog();
    },


    /**
     * show the dialog popup component.
     */
    showDialog: function() {
        var bundle = CRB.getBundle(this.bundleKey);        
        switch (this.dialogType) {
            case 'CONFIRMATION':
                this.title = bundle['LBL_CONFIRMATION'];
                this.message = bundle['LBL_CONFIRMATION_MESSAGE'];
                this.dialoginfo.push('BTN_YES');
                this.dialoginfo.push('BTN_NO');
                this.dialoginfo.push('BTN_CANCEL');
                break;

            case 'WARN_EDIT_OK':
                this.title = bundle['LBL_WARN'];
                this.dialoginfo.push('BTN_OK');
                this.dialoginfo.push('BTN_EDIT');
                break;

            case 'MESSAGE':
                this.dialoginfo.push('BTN_OK');
                break;

            case 'ERROR':
                this.dialoginfo.push('BTN_OK');
                break;

            case 'WARNING':
                this.title = bundle['LBL_WARN'];
                this.dialoginfo.push('BTN_OK');
                this.dialoginfo.push('BTN_CANCEL');
                break;

            case 'USERDEFINED':
                switch (this.dialogStyle) {
                    case 'YES_NO_CANCEL':
                        this.dialoginfo.push('BTN_YES');
                        this.dialoginfo.push('BTN_NO');
                        this.dialoginfo.push('BTN_CANCEL');
                        break;

                    case 'PRINTLGL_CLOSE':
                        this.customMsgOnly ? "" : this.message = this.message + '<div>' + bundle.LBL_LEGAL_AGREE_MSG + '</div>';
                        this.dialoginfo.push('BTN_CLOSE');
                        break;


                    case 'PRINTLGL_CLOSE_TYPE2':
                        this.customMsgOnly ? "" : this.message = this.message + '<div>' + bundle.LBL_LEGAL_AGREE_MSG + '</div>';
                        this.dialoginfo.push('BTN_CLOSE');
                        break;

                    case 'REPRINTLGL_CLOSE':
                        this.customMsgOnly ? "" : this.message = this.message + '<div>' + bundle.LBL_LEGAL_AGREE_MSG + '</div>';
                        this.dialoginfo.push('BTN_CLOSE');
                        break;

                    case 'REPRINT_CLOSE':
                        this.dialoginfo.push('BTN_REPRINT');
                        this.dialoginfo.push('BTN_CLOSE');
                        break;

                    case 'PRINT_CLOSE':
                        this.dialoginfo.push('BTN_PRINT');
                        this.dialoginfo.push('BTN_CLOSE');
                        this.btnPrintHandler = function() {
                            iportal.openNewWindow('/iportalweb/iportal/jsps/ConfirmationMsgPrintWindow.jsp' +
                                '?elementIdForConfirmationMsg=printConfirmMsg',
                                'print',
                                'toolbar=no,location=no,directories=no,status=no,' +
                                'menubar=no,scrollbars=no,resizable=no,border=thin,top=60,left=120,width=700');

                        };
                        break;

                    case 'CONTINUE':
                        this.dialoginfo.push('BTN_CONTINUE');
                        break;

                    case 'CLOSE':
                        this.dialoginfo.push('BTN_CLOSE');
                        break;

                    case 'ACCEPT_REJECT_CANCEL':
                        this.dialoginfo.push('BTN_ACCEPT');
                        this.dialoginfo.push('BTN_REJECT');
                        this.dialoginfo.push('BTN_CANCEL');
                        break;

                    case 'ACCEPTPRINT_REJECT_CANCEL':
                        this.dialoginfo.push('BTN_ACCEPT_PRINT');
                        this.dialoginfo.push('BTN_REJECT');
                        this.dialoginfo.push('BTN_CANCEL');
                        break;

                    case 'PRINTSUCCESS_PRINTFAIL':
                        this.dialoginfo.push('BTN_PRINT_SUCCESS');
                        this.dialoginfo.push('BTN_PRINT_FAIL');
                        break;

                    case 'YES_NO':
                        this.dialoginfo.push('BTN_YES');
                        this.dialoginfo.push('BTN_NO');
                        break;

                    case 'SUBMIT_CANCEL':
                        this.dialoginfo.push('BTN_SUBMIT');
                        this.dialoginfo.push('BTN_CANCEL');
                        break;

                    case 'OK_CANCEL':
                        this.dialoginfo.push('BTN_OK');
                        this.dialoginfo.push('BTN_CANCEL');
                        break;

                    case 'OK':
                        this.dialoginfo.push('BTN_OK');
                        break;

                    case 'PRINT_CANCEL':
                        this.dialoginfo.push('BTN_PRINT');
                        this.dialoginfo.push('BTN_CLOSE');
                        this.dialoginfo['btnHandler'] = function() {
                            iportal.openNewWindow('/iportalweb/iportal/jsps/ConfirmationMsgPrintWindow.jsp' +
                                '?elementIdForConfirmationMsg=printConfirmMsg',
                                'print',
                                'toolbar=no,location=no,directories=no,status=no,' +
                                'menubar=no,scrollbars=no,resizable=no,border=thin,top=60,left=120,width=700');
                        };
                        break;
                } //End of switch case (dialogStyle)
                break;
        } //End of switch case (dialogType)	
        var posBtn = iportal.preferences.getPostiveBtnAlign();
        var negBtn = iportal.preferences.getNegativeBtnAlign();
        this.dialogToolsConfig = {};
        if (this.helpReqd) {
            this.dialogToolsConfig['dialog_helpTool'] = this.helpHandler();
        }
        if (this.exportReqd) {
            this.dialogToolsConfig['dialog_excelTool'] = this.exportHandler();
        }
        if (this.printReqd) {
            this.dialogToolsConfig['dialog_printTool'] = this.pprintHandler();
        }

        this['windowId_subString'] = 'dialog';
        this['windowCont'] = true;
        this['btnClass'] = ""; // This can be removed if btnClass is not used by other json Objects that access the same template file.

        var leftBtnsList = [];
        var rightBtnsList = [];
        var dialogBtn;
        for (var index = 0; index < this.dialoginfo.length; index++) {
            switch (this.dialoginfo[index]) {
                case 'BTN_YES':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnYes",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_YES']
                    };

                    posBtn === 'LEFT' ? leftBtnsList.push(dialogBtn) : rightBtnsList.push(dialogBtn);
                    break;
                case 'BTN_NO':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnNo",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_NO']
                    };
                    negBtn === 'RIGHT' ? rightBtnsList.push(dialogBtn) : leftBtnsList.push(dialogBtn);
                    break;
                case 'BTN_CANCEL':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnCancel",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_CANCEL']
                    };
                    negBtn === 'RIGHT' ? rightBtnsList.push(dialogBtn) : leftBtnsList.push(dialogBtn);
                    break;
                case 'BTN_OK':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnOk",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_OK']
                    };
                    posBtn === 'LEFT' ? leftBtnsList.push(dialogBtn) : rightBtnsList.push(dialogBtn);
                    break;
                case 'BTN_EDIT':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnEdit",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_EDIT']
                    };
                    posBtn === 'LEFT' ? leftBtnsList.push(dialogBtn) : rightBtnsList.push(dialogBtn);
                    break;
                case 'BTN_CLOSE':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnClose",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_CLOSE']
                    };
                    posBtn === 'LEFT' ? leftBtnsList.push(dialogBtn) : rightBtnsList.push(dialogBtn);
                    break;
                case 'BTN_REPRINT':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnReprint",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_REPRINT']
                    };
                    posBtn === 'LEFT' ? leftBtnsList.push(dialogBtn) : rightBtnsList.push(dialogBtn);
                    break;
                case 'BTN_PRINT':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnPrint",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_PRINT']
                    };
                    posBtn === 'LEFT' ? leftBtnsList.push(dialogBtn) : rightBtnsList.push(dialogBtn);
                    break;
                case 'BTN_CONTINUE':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnContinue",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_CONTINUE']
                    };
                    posBtn === 'LEFT' ? leftBtnsList.push(dialogBtn) : rightBtnsList.push(dialogBtn);
                    break;
                case 'BTN_ACCEPT':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnAccept",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_ACCEPT']
                    };
                    posBtn === 'LEFT' ? leftBtnsList.push(dialogBtn) : rightBtnsList.push(dialogBtn);
                    break;
                case 'BTN_REJECT':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnReject",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_REJECT']
                    };
                    negBtn === 'RIGHT' ? rightBtnsList.push(dialogBtn) : leftBtnsList.push(dialogBtn);
                    break;
                case 'BTN_ACCEPT_PRINT':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnAccept_print",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_ACCEPT_PRINT']
                    };
                    posBtn === 'LEFT' ? leftBtnsList.push(dialogBtn) : rightBtnsList.push(dialogBtn);
                    break;
                case 'BTN_PRINT_SUCCESS':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnPrint_success",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_PRINTSUCCESS']
                    };
                    posBtn === 'LEFT' ? leftBtnsList.push(dialogBtn) : rightBtnsList.push(dialogBtn);
                    break;
                case 'BTN_PRINT_FAIL':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnPrint_fail",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_PRINTFAIL']
                    };
                    negBtn === 'RIGHT' ? rightBtnsList.push(dialogBtn) : leftBtnsList.push(dialogBtn);
                    break;
                case 'BTN_SUBMIT':
                    dialogBtn = {
                        'WINDOW_BTN_ID': "dialogBtnSubmit",
                        'WINDOW_BTN_DISPLAY_NM': bundle['LBL_SUBMIT']
                    };
                    posBtn === 'LEFT' ? leftBtnsList.push(dialogBtn) : rightBtnsList.push(dialogBtn);
                    break;
            } //End of switch (dialoginfo)	
        } //End of for

        this.LEFT_ACTION_BUTTONS = leftBtnsList;
        this.RIGHT_ACTION_BUTTONS = rightBtnsList;

        var tmpDialogCont = new ct.lib.tmplLayer('FDF/popUpWindowTemplate.cttpl', this);
        tmpDialogCont.getTemplate(this.drawDialogCont, this);
    }, //End of showDialog method

    drawDialogCont: function(dialogContTemplate, dialogContTmpClass) {
        var tempDialogContDiv = new cbx.lib.layer({
            "eleType": "div",
            "class": "panel panel-default ct-app ct-app-tm",
            "data-item-id": "dialogContainer"
        }).getLayer();
        $(tempDialogContDiv).append(dialogContTemplate);
        $(tempDialogContDiv).find('[data-toggle="tooltip"]').tooltip();

        $(tempDialogContDiv).find('a').on('click', $.proxy(function(evt) {
            switch ($(evt.currentTarget).attr('data-item-id')) {
                case 'dialog_helpTool':
                    this.dialogToolsConfig['dialog_helpTool']();
                    break;
                case 'dialog_excelTool':
                    this.dialogToolsConfig['dialog_excelTool']();
                    break;
                case 'dialog_printTool':
                    this.dialogToolsConfig['dialog_printTool']();
            }
        }, this));


        $(tempDialogContDiv).find('a[data-item-type=dialog_button]').on('click', $.proxy(function(evt) {
            var buttonId = $(evt.currentTarget).attr('data-item-id');
            switch (buttonId) {
                case 'dialogBtnYes':
                    cbx.isEmpty(this.yesHandler) ? this.defaultYesHandler() : this.yesHandler.call(this.scope);
                    break;
                case 'dialogBtnNo':
                    cbx.isEmpty(this.noHandler) ? this.defaultNoHandler() : this.noHandler.call(this.scope);
                    break;
                case 'dialogBtnCancel':
                    cbx.isEmpty(this.cancelHandler) ? this.defaultCancelHandler() : this.cancelHandler.call(this.scope);
                    break;
                case 'dialogBtnOk':
                    cbx.isEmpty(this.okHandler) ? this.defaultOkHandler() : this.okHandler.call(this.scope);
                    break;
                case 'dialogBtnEdit':
                    cbx.isEmpty(this.editHandler) ? this.defaultEditHandler() : this.editHandler.call(this.scope);
                    break;
                case 'dialogBtnClose':
                    cbx.isEmpty(this.closeHandler) ? this.close() : this.closeHandler.call(this.scope);
                    break;
                case 'dialogBtnReprint':
                    cbx.isEmpty(this.rePrintHandler) ? this.defaultRePrintHandler : this.rePrintHandler.call(this.scope);
                    break;
                case 'dialogBtnPrint':
                    this.btnPrintHandler();
                    break;
                case 'dialogBtnContinue':
                    cbx.isEmpty(this.continueHandler) ? this.defaultContinueHandler : this.continueHandler.call(this.scope);
                    break;
                case 'dialogBtnAccept':
                    cbx.isEmpty(this.acceptHandler) ? this.defaultAcceptHandler : this.acceptHandler.call(this.scope);
                    break;
                case 'dialogBtnReject':
                    cbx.isEmpty(this.rejectHandler) ? this.defaultRejectHandler : this.rejectHandler.call(this.scope);
                    break;
                case 'dialogBtnAccept_print':
                    cbx.isEmpty(this.acceptPrintHandler) ? this.defaultAcceptPrintHandler : this.acceptPrintHandler.call(this.scope);
                    break;
                case 'dialogBtnPrint_success':
                    cbx.isEmpty(this.printSuccess) ? this.defaultPrintSuccess : this.printSuccess.call(this.scope);
                    break;
                case 'dialogBtnPrint_fail':
                    cbx.isEmpty(this.printFail) ? this.defaultPrintFail : this.printFail.call(this.scope);
                    break;
                case 'dialogBtnSubmit':
                    cbx.isEmpty(this.submitHandler) ? this.defaultSubmitHandler : this.submitHandler.call(this.scope);
                    break;
            }
        }, this));


        var modalWindow = CLCR.getCmp({
            "COMP_TYPE": "MODAL_WINDOW"
        });
        var config = {
            modalContent: tempDialogContDiv,
            modalClass: 'ct-modal__max',
            fullscreenInd: false
        };
        this.popUp = new modalWindow(config);
    },

    close: function() {
        this.popUp.hideModal();
    }
});

iportal.Dialog = canvas.lib.dialogBoxConfig;
canvas.Dialog = canvas.lib.dialogBoxConfig;
CLCR.registerCmp({
    'COMP_TYPE': 'APP',
    'VIEW_TYPE': 'MODAL_DIALOG'
}, canvas.lib.dialogBoxConfig);