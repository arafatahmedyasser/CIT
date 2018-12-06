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
 * 

 * @description The class which is responsible for generating the contextual 
 * app panel to render the individual apps for any view.
 
 */
cbx.ns("cbx.lib");

cbx.lib.contextAppPanel = Class(cbx.core.Component,{
	constructor : function(config){
		
		var popupConfig = {
				"eleType": "div",
				'id': 'context-app-panel',
				'data-role':"popup",
				"class" : "cbx-panel-closed cbx-maskable-content grid_view_icons context-app-panel",
				"data-corners":"false",
				"data-dismissable":"false",
				"data-theme":"a", 
				"data-shadow":"false",
				"data-tolerance":"0,0",
				"style" : {
					"display" : "block"
				}
			};
		var panel = new cbx.lib.layer(popupConfig);
		var childConfig = {
				"eleType": "div",
				'id': 'context-wrapper',
				'class':'jqm-main-content ui-content'
		}
		var childDiv = new cbx.lib.layer(childConfig);
		var scrollerDivConf =  {
				"eleType": "div",
				'id': 'context-scroller'
		}
		var scrollerDiv = new cbx.lib.layer(scrollerDivConf);
		childDiv.getLayer().appendChild(scrollerDiv.getLayer());
		panel.getLayer().appendChild(childDiv.getLayer());
		//childDiv.appendTo(parentElem);
		config.elem.append(panel.getLayer());
		$( "#context-app-panel" ).on({
		    popupbeforeposition: function() {
		        var h = $(window).height();
		        $("#context-app-panel-popup").css("width", "100%").addClass('positionbottom');
		    },
		    popupafteropen : function(){
		    	var options={
		    				scrollX : true,
		    				scrollY : false,
		    				preventBeforeScroll : true,
		    				scrollbars:false
		    	}
		    	doIScroll('context-wrapper',"add",options);
		    	$('#context-app-panel-screen').remove();
		    	
				//contextAppLauncher.hide();
		    },
		    popupafterclose : function(){
		    	 $('.highlightColor').removeClass('highlightColor');
		    	 var appPanel = $('#context-scroller');
					if(appPanel[0] && appPanel[0].record){
						delete appPanel[0].record;
				}
		    	$('#context-app-panel').addClass('cbx-panel-closed');
		    	$("#context-app-panel-popup").removeClass('positionbottom');
		    	var contextAppLauncher = $('#context-app-img');
		    	doIScroll('context-wrapper',"remove");
		    }
		});
		/*var appIcon = $("#context-app-img");
		if(!cbx.isEmpty(appIcon)){
			appIcon.bind( "click", function(event, ui) {
				$("#context-app-panel").panel( "open");
			});
		}*/
		/*config.elem.scroll(function(){ 
				    $('#context-app-img').css({'top':$(this).scrollTop()});
		})*/
		//this.addItem(panel.getLayer());
	}
	
});
CLCR.registerCmp({'COMP_TYPE':'CONTEXT_APP_PANEL'}, cbx.lib.contextAppPanel);  