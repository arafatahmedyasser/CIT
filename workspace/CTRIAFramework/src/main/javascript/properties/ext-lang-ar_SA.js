/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 *
 * English (UK) Translations
 * updated to 2.2 by Condor (8 Aug 2008)
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">\u062A\u062D\u0645\u064A\u0644  ...</div>';

if(Ext.DataView){
  Ext.DataView.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "{0} \u0627\u0644\u0635\u0641 \u0627\u0644\u0645\u062D\u062F\u062F {1}";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "\u062A\u062D\u0645\u064A\u0644 ...";
}

Date.monthNames = [
"\u0641\u064A\u064A\u0646\u0627\u064A\u0631", 
"\u0641\u0628\u0631\u0627\u064A\u0631", 
"\u0645\u0627\u0631\u0633", 
"\u0641\u064A\u0623\u0628\u0631\u064A\u0644", 
"\u0645\u0627\u064A\u0648" ,
"\u064A\u0648\u0646\u064A\u0648\u0627\u0644\u0645\u0642\u0628\u0644", 
"\u064A\u0648\u0644\u064A\u0648", 
"\u0627\u063A\u0633\u0637\u0633", 
"\u0627\u064A\u0644\u0648\u0644", 
"\u0623\u0643\u062A\u0648\u0628\u0631", 
"\u0646\u0648\u0641\u0645\u0628\u0631", 
"\u0641\u064A\u062F\u064A\u0633\u0645\u0628\u0631"];

Date.getShortMonthName = function(month) {
  return Date.monthNames[month].substring(0, 3);
};

Date.monthNumbers = {
  Jan : 0,
  Feb : 1,
  Mar : 2,
  Apr : 3,
  May : 4,
  Jun : 5,
  Jul : 6,
  Aug : 7,
  Sep : 8,
  Oct : 9,
  Nov : 10,
  Dec : 11
};

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Date.dayNames = [
  "\u0627\u0644\u0623\u062D\u062F",
  "\u0627\u0644\u0625\u062B\u0646\u064A\u0646",
  "\u064A\u0648\u0645 \u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621",
  "\u064A\u0648\u0645 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621",
  "\u064A\u0648\u0645 \u0627\u0644\u062E\u0645\u064A\u0633",
  "\u064A\u0648\u0645 \u0627\u0644\u062C\u0645\u0639\u0629",
  "\u064A\u0648\u0645 \u0627\u0644\u0633\u0628\u062A"
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

Date.parseCodes.S.s = "(?:st|nd|rd|th)";

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "\u062D\u0633\u0646\u0627",
    cancel : "\u0625\u0644\u063A\u0627\u0621",
    yes    : "\u0646\u0639\u0645",
    no     : "\u0644\u0627"
  };
}

if(Ext.util.Format){
  Ext.util.Format.date = function(v, format){
    if(!v) return "";
    if(!(v instanceof Date)) v = new Date(Date.parse(v));
    return v.dateFormat(format || "d/m/Y");
  };
}

if(Ext.DatePicker){
  Ext.apply(Ext.DatePicker.prototype, {
    todayText         : "\u0627\u0644\u064A\u0648\u0645",
    minText           : "\u0647\u0630\u0627 \u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0647\u0648 \u0642\u0628\u0644 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u062A\u0627\u0631\u064A\u062E",
    maxText           : "\u0647\u0630\u0627 \u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0647\u0648 \u0628\u0639\u062F \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u062A\u0627\u0631\u064A\u062E",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : '\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0642\u0627\u062F\u0645 (\u0627\u0644\u062A\u062D\u0643\u0645 + \u064A\u0645\u064A\u0646)',
    prevText          : '\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0633\u0627\u0628\u0642 (\u0627\u0644\u062A\u062D\u0643\u0645 + \u064A\u0633\u0627\u0631)',
    monthYearText     : '\u0627\u062E\u062A\u0631 \u0627\u0644\u0634\u0647\u0631 (\u0627\u0644\u062A\u062D\u0643\u0645 + \u0623\u0639\u0644\u0649 / \u0623\u0633\u0641\u0644 \u0644\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0633\u0646\u0648\u0627\u062A)',
    todayTip          : "{0} (Spacebar)",
    format            : "d/m/Y",
    okText            : "&#160;OK&#160;",
    cancelText        : "\u0625\u0644\u063A\u0627\u0621",
    startDay          : 0
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "\u0635\u0641\u062D\u0629",
    afterPageText  : "\u0645\u0646 {0}\u200F",
    firstText      : "\u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0627\u0648\u0644\u0649",
    prevText       : "\u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629",
    nextText       : "\u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629",
    lastText       : "\u0622\u062E\u0631 \u0635\u0641\u062D\u0629",
    refreshText    : "\u062A\u062D\u062F\u064A\u062B",
    displayMsg     : "\u0639\u0631\u0636 {0} - {1} \u0645\u0646 {2}\u200F",
    emptyMsg       : '\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u0644\u0639\u0631\u0636'
  });
}

if(Ext.form.BasicForm){
    Ext.form.BasicForm.prototype.waitTitle = "\u064A\u0631\u062C\u0649 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631..."
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "\u0627\u0644\u0642\u064A\u0645\u0629 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0627\u0644 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629";
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0637\u0648\u0644 \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0647\u0648 {0} \u200F",
    maxLengthText : "\u0648\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0637\u0648\u0644 \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0647\u0648 {0} \u200F",
    blankText     : "\u0647\u0630\u0647 \u0627\u0644\u062E\u0627\u0646\u0629 \u0645\u0637\u0644\u0648\u0628\u0647",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    decimalSeparator : ".",
    decimalPrecision : 2,
    minText : "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0642\u064A\u0645\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0647\u0648 {0} \u200F",
    maxText : "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0642\u064A\u0645\u0629 \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0647\u0648 {0} \u200F",
    nanText : "{0} \u0644\u064A\u0633 \u0631\u0642\u0645 \u0635\u0627\u0644\u062D"
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "\u0645\u0639\u0627\u0642",
    disabledDatesText : "\u0645\u0639\u0627\u0642",
    minText           : "\u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0627\u0644 \u0628\u0639\u062F {0} \u200F",
    maxText           : "\u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0627\u0644 \u0642\u0628\u0644 {0} \u200F",
    invalidText       : "{0} \u0644\u064A\u0633 \u062A\u0627\u0631\u064A\u062E \u0635\u0627\u0644\u062D - \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0641\u064A \u0634\u0643\u0644 {1} \u200F",
    format            : "d/m/y",
    altFormats        : "d/m/Y|d/m/y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d",
    startDay          : 0
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "\u062A\u062D\u0645\u064A\u0644 ...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText    : '\u0648\u064A\u0646\u0628\u063A\u064A \u0623\u0646 \u064A\u0643\u0648\u0646 \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0641\u064A \u0627\u0644\u0634\u0643\u0644 "user@example.com"',
    urlText      : '\u0648\u064A\u0646\u0628\u063A\u064A \u0623\u0646 \u064A\u0643\u0648\u0646 \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 URL \u0641\u064A \u0634\u0643\u0644 "HTTP: / '+' / www.example.com"',
    alphaText    : '\u064A\u062C\u0628 \u0623\u0646 \u064A\u062D\u062A\u0648\u064A \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0641\u0642\u0637 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u0648_',
    alphanumText : '\u064A\u062C\u0628 \u0623\u0646 \u064A\u062D\u062A\u0648\u064A \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0641\u0642\u0637 \u0627\u0644\u062D\u0631\u0648\u0641 \u0648\u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0648_'
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : '\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 URL \u0644\u0644\u0627\u0631\u062A\u0628\u0627\u0637:',
    buttonTips : {
      bold : {
        title: 'Bold (Ctrl+B)',
        text: '\u062C\u0639\u0644 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u062D\u062F\u062F \u063A\u0627\u0645\u0642\u0627.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'Italic (Ctrl+I)',
        text: '\u062C\u0639\u0644 \u0645\u0627\u0626\u0644 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u062D\u062F\u062F.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Underline (Ctrl+U)',
        text: '\u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0639\u0644\u0649 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u062D\u062F\u062F.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'Grow Text',
        text: '\u0632\u064A\u0627\u062F\u0629 \u062D\u062C\u0645 \u0627\u0644\u062E\u0637.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: '\u062A\u0635\u063A\u064A\u0631 \u062D\u062C\u0645 \u0627\u0644\u0646\u0635',
        text: '\u0625\u0646\u0642\u0627\u0635 \u062D\u062C\u0645 \u0627\u0644\u062E\u0637.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: '\u062A\u0633\u0644\u064A\u0637 \u0627\u0644\u0636\u0648\u0621 \u0639\u0644\u0649 \u0627\u0644\u0646\u0635 \u0627\u0644\u0644\u0648\u0646',
        text: '\u062A\u063A\u064A\u064A\u0631 \u0644\u0648\u0646 \u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u062D\u062F\u062F.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: '\u0644\u0648\u0646 \u0627\u0644\u062E\u0637',
        text: '\u062A\u063A\u064A\u064A\u0631 \u0644\u0648\u0646 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u062D\u062F\u062F.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: '\u0645\u062D\u0627\u0630\u0627\u0629 \u0627\u0644\u0646\u0635 \u0625\u0644\u0649 \u0627\u0644\u064A\u0633\u0627\u0631',
        text: '\u0645\u062D\u0627\u0630\u0627\u0629 \u0627\u0644\u0646\u0635 \u0625\u0644\u0649 \u0627\u0644\u064A\u0633\u0627\u0631.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: '\u0645\u0631\u0643\u0632 \u0627\u0644\u0646\u0635',
        text: '\u0645\u0631\u0643\u0632 \u0627\u0644\u0646\u0635 \u0641\u064A \u0627\u0644\u0645\u062D\u0631\u0631.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: '\u0645\u062D\u0627\u0630\u0627\u0629 \u0625\u0644\u0649 \u0627\u0644\u064A\u0645\u064A\u0646 \u0627\u0644\u0646\u0635',
        text: '\u0645\u062D\u0627\u0630\u0627\u0629 \u0627\u0644\u0646\u0635 \u0625\u0644\u0649 \u0627\u0644\u064A\u0645\u064A\u0646.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: '\u0642\u0627\u0626\u0645\u0629 \u0631\u0635\u0627\u0635\u0629',
        text: '\u0628\u062F\u0621 \u0642\u0627\u0626\u0645\u0629 \u0630\u0627\u062A \u062A\u0639\u062F\u0627\u062F \u0646\u0642\u0637\u064A.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: '\u0642\u0627\u0626\u0645\u0629 \u0645\u0631\u0642\u0645\u0629',
        text: '\u0628\u062F\u0621 \u0642\u0627\u0626\u0645\u0629 \u0645\u0631\u0642\u0645\u0629.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: '\u0627\u0644\u0627\u0631\u062A\u0628\u0627\u0637 \u0627\u0644\u062A\u0634\u0639\u0628\u064A',
        text: '\u062C\u0639\u0644 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u062D\u062F\u062F \u0627\u0631\u062A\u0628\u0627\u0637 \u062A\u0634\u0639\u0628\u064A.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: '',
        text: '\u0627\u0644\u062A\u0628\u062F\u064A\u0644 \u0625\u0644\u0649 \u0648\u0636\u0639 \u062A\u062D\u0631\u064A\u0631 \u0627\u0644\u0645\u0635\u062F\u0631.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "\u062A\u0631\u062A\u064A\u0628 \u062A\u0635\u0627\u0639\u062F\u064A",
    sortDescText : "\u0641\u0631\u0632 \u062A\u0646\u0627\u0632\u0644\u064A",
    columnsText  : "\u0627\u0644\u0623\u0639\u0645\u062F\u0629"
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(\u0644\u0627 \u064A\u0648\u062C\u062F)',
    groupByText    : '\u0645\u062C\u0645\u0648\u0639\u0629 \u062D\u0633\u0628 \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644',
    showGroupsText : '\u062A\u0638\u0647\u0631 \u0641\u064A \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "\u0627\u0633\u0645",
    valueText  : "\u0627\u0644\u0642\u064A\u0645\u0629",
    dateFormat : "j/m/Y",
    trueText: "true",
    falseText: "false"
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "\u0627\u0633\u062D\u0628 \u0644\u062A\u063A\u064A\u064A\u0631 \u062D\u062C\u0645.",
    collapsibleSplitTip : "\u0627\u0633\u062D\u0628 \u0644\u062A\u063A\u064A\u064A\u0631 \u062D\u062C\u0645. \u0627\u0646\u0642\u0631 \u0646\u0642\u0631\u0627 \u0645\u0632\u062F\u0648\u062C\u0627 \u0644\u0644\u0627\u062E\u062A\u0628\u0627\u0621."
  });
}

if(Ext.form.TimeField){
  Ext.apply(Ext.form.TimeField.prototype, {
    minText : "\u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0627\u0644\u0648\u0642\u062A \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0627\u0644 \u064A\u0633\u0627\u0648\u064A \u0623\u0648 \u0628\u0639\u062F {0} \u200F",
    maxText : "\u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0627\u0644\u0648\u0642\u062A \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0627\u0644 \u064A\u0633\u0627\u0648\u064A \u0623\u0648 \u0642\u0628\u0644 {0} \u200F",
    invalidText : "{0} \u0644\u064A\u0633 \u0648\u0642\u062A \u0635\u0627\u0644\u062D",
    format : "g:i A",
    altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H"
  });
}

if(Ext.form.CheckboxGroup){
  Ext.apply(Ext.form.CheckboxGroup.prototype, {
    blankText : "\u064A\u062C\u0628 \u062A\u062D\u062F\u064A\u062F \u0639\u0646\u0635\u0631 \u0648\u0627\u062D\u062F \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u0641\u064A \u0647\u0630\u0647 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629"
  });
}

if(Ext.form.RadioGroup){
  Ext.apply(Ext.form.RadioGroup.prototype, {
    blankText : "\u064A\u062C\u0628 \u062A\u062D\u062F\u064A\u062F \u0639\u0646\u0635\u0631 \u0648\u0627\u062D\u062F \u0641\u064A \u0647\u0630\u0647 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629"
  });
}
