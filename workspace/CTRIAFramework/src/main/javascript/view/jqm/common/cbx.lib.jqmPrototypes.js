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

cbx.ns('cbx');
cbx.ns('iportal.util');
jQuery(function($) {

  var _oldShow = $.fn.show;

  $.fn.show = function(speed, oldCallback) {
    return $(this).each(function() {
      var obj         = $(this),
          newCallback = function() {
            if ($.isFunction(oldCallback)) {
              oldCallback.apply(obj);
            }
            obj.trigger('afterShow');
          };

      // you can trigger a before show if you want
      obj.trigger('beforeShow');

      // now use the old function to show the element passing the new callback
      _oldShow.apply(obj, [speed, newCallback]);
    });
  };
  //Backward compatibility
  Ext = cbx;
  Ext.extend= Class;
  Ext.util.Observable = cbx.Observable;
  Ext.Button = new Object();
  iportal.util.stringnumber = cbx.amtutil.stringnumber;
  iportal.openNewWindow = function(path,type,params){
	  if(type==="helpwin"){
		  new cbx.lib.widget.widgetTools(arguments).widgetHelpHandler();
	  }
  },


  String.format = function() {
	  var s = arguments[0];
	  for (var i = 0; i < arguments.length - 1; i++) {       
	    var reg = new RegExp("\\{[\\s]*" + i + "[\\s]*\\}","gm"); //newCBX Fix            
	    s = s.replace(reg, arguments[i + 1]);
	  }

	  return s;
	};
	$.fn.textWidth = function(){
		var html_org = $(this).html();
		var html_calc = '<span>' + html_org + '</span>';
		$(this).html(html_calc);
		var width = $(this).find('span:first').width();
		$(this).html(html_org);
		return width;
	};
});