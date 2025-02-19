/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*
 * German translation
 * 2007-Apr-07 update by schmidetzki and humpdi
 * 2007-Oct-31 update by wm003
 * 2009-Jul-10 update by Patrick Matsumura and Rupert Quaderer
 * 2010-Mar-10 update by Volker Grabsch
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">�bertrage Daten ...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} Zeile(n) ausgew�hlt";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Diesen Tab schlie�en";
}

if(Ext.form.BasicForm){
   Ext.form.BasicForm.prototype.waitTitle = "Bitte warten...";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "Der Wert des Feldes ist nicht korrekt";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "�bertrage Daten...";
}

Date.monthNames = [
   "Januar",
   "Februar",
   "M�rz",
   "April",
   "Mai",
   "Juni",
   "Juli",
   "August",
   "September",
   "Oktober",
   "November",
   "Dezember"
];

Date.getShortMonthName = function(month) {
  return Date.monthNames[month].substring(0, 3);
};

Date.monthNumbers = {
  Jan : 0,
  Feb : 1,
  "M\u00e4r" : 2,
  Apr : 3,
  Mai : 4,
  Jun : 5,
  Jul : 6,
  Aug : 7,
  Sep : 8,
  Okt : 9,
  Nov : 10,
  Dez : 11
};

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Date.dayNames = [
   "Sonntag",
   "Montag",
   "Dienstag",
   "Mittwoch",
   "Donnerstag",
   "Freitag",
   "Samstag"
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Abbrechen",
      yes    : "Ja",
      no     : "Nein"
   };
}

if(Ext.util.Format){
    Ext.util.Format.__number = Ext.util.Format.number;
    Ext.util.Format.number = function(v, format) {
        return Ext.util.Format.__number(v, format || "0.000,00/i");
    };

   Ext.util.Format.date = function(v, format) {
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "d.m.Y");
   };
}

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "Heute",
      minText           : "Dieses Datum liegt von dem erstm�glichen Datum",
      maxText           : "Dieses Datum liegt nach dem letztm�glichen Datum",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames          : Date.dayNames,
      nextText          : "N�chster Monat (Strg/Control + Rechts)",
      prevText          : "Vorheriger Monat (Strg/Control + Links)",
      monthYearText     : "Monat ausw�hlen (Strg/Control + Hoch/Runter, um ein Jahr auszuw�hlen)",
      todayTip          : "Heute ({0}) (Leertaste)",
      format            : "d.m.Y",
      okText            : "&#160;OK&#160;",
      cancelText        : "Abbrechen",
      startDay          : 1
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Seite",
      afterPageText  : "von {0}",
      firstText      : "Erste Seite",
      prevText       : "vorherige Seite",
      nextText       : "n�chste Seite",
      lastText       : "letzte Seite",
      refreshText    : "Aktualisieren",
      displayMsg     : "Anzeige Eintrag {0} - {1} von {2}",
      emptyMsg       : "Keine Daten vorhanden"
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Bitte geben Sie mindestens {0} Zeichen ein",
      maxLengthText : "Bitte geben Sie maximal {0} Zeichen ein",
      blankText     : "Dieses Feld darf nicht leer sein",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Der Mindestwert f�r dieses Feld ist {0}",
      maxText : "Der Maximalwert f�r dieses Feld ist {0}",
      nanText : "{0} ist keine Zahl",
      decimalSeparator : ","
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "nicht erlaubt",
      disabledDatesText : "nicht erlaubt",
      minText           : "Das Datum in diesem Feld muss nach dem {0} liegen",
      maxText           : "Das Datum in diesem Feld muss vor dem {0} liegen",
      invalidText       : "{0} ist kein g�ltiges Datum - es muss im Format {1} eingegeben werden",
      format            : "d.m.Y",
      altFormats        : "j.n.Y|j.n.y|j.n.|j.|j/n/Y|j/n/y|j-n-y|j-n-Y|j/n|j-n|dm|dmy|dmY|j|Y-n-j",
      startDay          : 1
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "Lade Daten ...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Dieses Feld sollte eine E-Mail-Adresse enthalten. Format: "user@example.com"',
      urlText      : 'Dieses Feld sollte eine URL enthalten. Format: "http:/'+'/www.example.com"',
      alphaText    : 'Dieses Feld darf nur Buchstaben enthalten und _',
      alphanumText : 'Dieses Feld darf nur Buchstaben und Zahlen enthalten und _'
   });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'Bitte geben Sie die URL f�r den Link ein:',
    buttonTips : {
      bold : {
        title: 'Fett (Ctrl+B)',
        text: 'Erstellt den ausgew�hlten Text in Fettschrift.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'Kursiv (Ctrl+I)',
        text: 'Erstellt den ausgew�hlten Text in Schr�gschrift.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Unterstrichen (Ctrl+U)',
        text: 'Unterstreicht den ausgew�hlten Text.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'Text verg��ern',
        text: 'Erh�ht die Schriftgr��e.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'Text verkleinern',
        text: 'Verringert die Schriftgr��e.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'Text farblich hervorheben',
        text: 'Hintergrundfarbe des ausgew�hlten Textes �ndern.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'Schriftfarbe',
        text: 'Farbe des ausgew�hlten Textes �ndern.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'Linksb�ndig',
        text: 'Setzt den Text linksb�ndig.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'Zentrieren',
        text: 'Zentriert den Text in Editor.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'Rechtsb�ndig',
        text: 'Setzt den Text rechtsb�ndig.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Aufz�hlungsliste',
        text: 'Beginnt eine Aufz�hlungsliste mit Spiegelstrichen.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'Numerierte Liste',
        text: 'Beginnt eine numerierte Liste.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Hyperlink',
        text: 'Erstellt einen Hyperlink aus dem ausgew�hlten text.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'Source bearbeiten',
        text: 'Zur Bearbeitung des Quelltextes wechseln.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Aufsteigend sortieren",
      sortDescText : "Absteigend sortieren",
      lockText     : "Spalte sperren",
      unlockText   : "Spalte freigeben (entsperren)",
      columnsText  : "Spalten"
   });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(Keine)',
    groupByText    : 'Dieses Feld gruppieren',
    showGroupsText : 'In Gruppen anzeigen'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "Name",
      valueText  : "Wert",
      dateFormat : "d.m.Y"
  });
}

if(Ext.grid.BooleanColumn){
   Ext.apply(Ext.grid.BooleanColumn.prototype, {
      trueText  : "wahr",
      falseText : "falsch"
   });
}

if(Ext.grid.NumberColumn){
    Ext.apply(Ext.grid.NumberColumn.prototype, {
        format : '0.000,00/i'
    });
}

if(Ext.grid.DateColumn){
    Ext.apply(Ext.grid.DateColumn.prototype, {
        format : 'd.m.Y'
    });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "Ziehen, um Gr��e zu �ndern.",
    collapsibleSplitTip : "Ziehen, um Gr��e zu �ndern. Doppelklick um Panel auszublenden."
  });
}

if(Ext.form.TimeField){
   Ext.apply(Ext.form.TimeField.prototype, {
    minText : "Die Zeit muss gleich oder nach {0} liegen",
    maxText : "Die Zeit muss gleich oder vor {0} liegen",
    invalidText : "{0} ist keine g�ltige Zeit",
    format : "H:i"
   });
}

if(Ext.form.CheckboxGroup){
  Ext.apply(Ext.form.CheckboxGroup.prototype, {
    blankText : "Du mu�t mehr als einen Eintrag aus der Gruppe ausw�hlen"
  });
}

if(Ext.form.RadioGroup){
  Ext.apply(Ext.form.RadioGroup.prototype, {
    blankText : "Du mu�t einen Eintrag aus der Gruppe ausw�hlen"
  });
}
