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
 
canvas.lib.view.mapView = Class(cbx.core.Component, {
	
	initialize : function ()
	{
		var me = this;
		var elem = me.elem;
		me.setCmp(elem);
		elem.on("remove", function() {
			me.destroy();
		});
	

		/**
		 * The Framework ajax params to fetch the data for this view.
		 * The params are same as of normal VDF for the data fetch.
		 */
		
		var params = {
			"__LISTVIEW_REQUEST" : "Y",
			"PAGE_CODE_TYPE" : 'VDF_CODE',
			"INPUT_ACTION" : "INIT_DATA_ACTION",
			"PRODUCT_NAME" : 'CUSER',
			"INPUT_FUNCTION_CODE" : 'VSBLTY',
			"INPUT_SUB_PRODUCT" : 'CUSER',
			"WIDGET_ID" : me.WIDGET_ID,
			"VIEW_ID" : me.md.getViewId(),
			
			"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
			"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),
			
			"forceCallbacks" : true
		};
		
		this.store = new cbx.core.Store({
			params : params,
			listeners : {
				"load" : this.loadData
			},
			scope : this,
			autoLoad : true,
			reader : {
				root : 'response.value.ALL_RECORDS',
				totalProperty : 'response.value.TOTAL_COUNT'
			},
			bufferSize : 45
		});
	},
	loadData : function(records) {
		var me = this;
		this.rb = {};
		var elem = me.getCmp();
		elem.empty();
		me.setCmp(elem);
		if(! cbx.isEmpty(records)) {
					var respLength = records.length;
					var i;
					me.lattitude = [];
					me.longitude = [];
					me.address = [];
					me.mainList = [];
					for (i = 0; i < respLength; i++)
					{
						var tmp = [];
						tmp.push(records[i].LATITUDE);
						tmp.push(records[i].LONGITUDE);
						tmp.push(records[i].ADDRESS);
						me.mainList.push(tmp);
					}
				}
	var displayKey = me.WGT_TITLE || me.md.getViewTitle();
		var title = me.rb[displayKey] || displayKey;
		
		this.domStr = '<div class="map-head map-' + me.WIDGET_ID + '">';
		this.domStr += '<div class="map-title map-' + me.WIDGET_ID + '">';
		this.domStr += '<h3>' + title + '</h3>';
		this.domStr += '</div>';
		this.domStr += '<div class="map_container"></div>';
		this.domStr += '</div>';
		$(this.elem).append(this.domStr);
		this.toLoadGoogleMap();
	},
	
	
	
	
	toLoadGoogleMap : function ()
	{
		scope = this;
		var mapContainer = $(this.elem).find(".map_container");

		CBXJsLoader.js([ iportal.systempreferences.getGoogleLoaderUri() ], function (dom)
		{
			var googleObj = window['google'];
			if (googleObj)
			{
				googleObj.load("maps", "3", {
					/**
					 * sensor parameter set to false as we dont derive the location from any external GPS System.
					 */
					other_params : "sensor=false",
					callback : function ()
					{
						
						var locations = scope.mainList;
						google.maps.visualRefresh = true;
						var myOptions = {
							zoom : 3,
							mapTypeId : google.maps.MapTypeId.ROADMAP,   /* MAPTYPE_ID : HYBRID ,ROADMAP ,SATELLITE */
							panControl: true,
							zoomControl: true,
						    zoomControlOptions: {
						      style: google.maps.ZoomControlStyle.SMALL
						    },
						    mapTypeControl: true,
						    mapTypeControlOptions: {
						      style: google.maps.MapTypeControlStyle.DEFAULT,
						      mapTypeIds: [
						        google.maps.MapTypeId.ROADMAP,
						        google.maps.MapTypeId.TERRAIN,
						        google.maps.MapTypeId.SATELLITE
						      ]
						    }
						};
						
							var map = new google.maps.Map(dom.get(0), myOptions);
							setMarkers(map, locations);
							
							
						
					
						function setMarkers (map, locations)
						{
							if (!cbx.isEmpty(locations))
							{
								var marker, i;

								for (i = 0; i < locations.length; i++)
								{

									var lat = locations[i][0];
									var longi = locations[i][1];
									var add = locations[i][2];
									latlngset = new google.maps.LatLng(lat, longi);
									var marker = new google.maps.Marker({
										map : map,
										title : add,
										position : latlngset,
										draggable:true,
									    animation: google.maps.Animation.DROP
									});
									map.setCenter(marker.getPosition());
									
									var content = "Address: " + add;
									var infowindow = new google.maps.InfoWindow();
									if (add)
									{
										google.maps.event.addListener(marker, 'click', (function (marker, content,
													infowindow)
										{
											return function ()
											{
												infowindow.setContent(content);
												infowindow.open(map, marker);
												map.setZoom(8);
											    map.setCenter(marker.getPosition());
											};
										})(marker, content, infowindow));
									}
								}
							} else
							{
								map.setCenter(new google.maps.LatLng('0', '0'));
							}
							
						};
						
					},
				});
			} else
			{
				//var errMsg = iportal.jsutil.getTextFromBundle(this.bundle, 'LBL_NO_MAPS_AVAILABLE', CRB.getFWBundleKey());
					var errMsg ='NO_MAPS_AVAILABLE';
				$(mapContainer).text(errMsg);

			}
		}, 'head', mapContainer);

	}

});
/**
 * Register the Map component 
 */
CLCR.registerCmp({
	'COMP_TYPE' : 'APP',
	'VIEW_TYPE' : 'MAP'
}, canvas.lib.view.mapView);
