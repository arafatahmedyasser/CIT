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

/**

 * DEPLOY_MODULE_ID: 

 */

cbx.ns('cbx.view');
/**
 * The Container component which will contain the Map Object
 */
cbx.view.MapViewPanel = Ext.extend(Ext.Container, {
	
	viewConf : null,

	conf : null,

	headerAsText : false,
	
	productCode : "",
	
	subProductCode : "",
	
	functionCode : "",
	
	autoScroll : null,
	
	itemId : 'MapContainer',
	
	height : 0,
	
	 layout: 'fit',
	
	widgetId : null,
	
	initComponent : function(){


		var map = new Ext.Container({


			border : false,
			
			productCode : this.productCode,
			
			widgetId : this.widgetId,
			
			rb : CRB.getFWBundle(),
			subProductCode : this.subProductCode,
			
			functionCode : this.functionCode,

			viewConf : this.viewConf,
			
			height : this.height,
			
			 layout: 'fit',
			
			autoScroll : false,

			listeners : {
					
				afterRender : function (panel){
					/**
					 * The Framework ajax params to fetch the data for this view.
					 * The params are same as that of the live grid.
					 */
					var params = {
							"PAGE_CODE_TYPE" : 'VDF_CODE',

							"INPUT_ACTION" : "INIT_DATA_ACTION",

							"PRODUCT_NAME" : this.productCode,

							"INPUT_FUNCTION_CODE" : this.functionCode,

							"INPUT_SUB_PRODUCT" : this.subProductCode,

							"WIDGET_ID" : this.widgetId,

							"VIEW_ID" : this.viewConf.VIEW_MD.VIEW_ID,
							
							"INPUT_PRODUCT" : this.productCode,
							
							"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
							"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId()
							
							
					};
					Ext.Ajax.request({

						params : params,
						scope : panel,
						success : function(response, request) {
							var resp = Ext
									.decode(response.responseText);
							
							var rb = CRB.getFWBundle();
							/**
							 * 1.Applying the loadmask to this ext component on success of the ajax
							 * 2.The loadmask is being used here to indicate the user that the server is
							 * downloading the google API's.
							 * 3.The google API's will be fetched on demand through the google loaders as the
							 * size of these API's comes up to around 290kb and is not necessary to have this downloaded
							 * when the application loads.
							 * 4.Using google loader as a mere https://www.google.com/jsapi call via the CBXJSLoader will only 
							 * download this one JS file and does not know the other modules which google Maps require.
							 */
							var loadMask = new Ext.LoadMask(this.getEl(), {msg:rb['LBL_LOADING_MAP']});
							loadMask.show();
							/**
							 * Setting the adress array to this object as an asynchronous call will no longer have scope of this
							 * array
							 */
							this.addressArray = resp.response.value.ALL_RECORDS;
							CBXJsLoader.js([iportal.systempreferences.getGoogleLoaderUri()],function(domId){
								var googleObj = window['google'];
								if(googleObj){
									googleObj.load("maps", "3",{ 
										/**
										 * sensor parameter set to false as we dont derive the location from any external GPS System.
										 */
										other_params: "sensor=false",
										callback: function(){
											/**
											 * Visual refresh is a feature provided by google to better the User experience
											 * Refer this URL to know more --
											 * https://developers.google.com/maps/documentation/javascript/basics?hl=fr
											 */
											google.maps.visualRefresh = true;
											//Initializing the Map with minimum Zoom
											var mapOptions = {
													zoom: 1,
													mapTypeId: google.maps.MapTypeId.ROADMAP 
											};
											var map = new google.maps.Map(Ext.getDom(domId),
													mapOptions);
											/**
											 * Hiding the load mask once the maps have been rendered
											 */
											map.addListener('tilesloaded',function(){
												var el = Ext.getCmp(domId).getEl();
												el.unmask();
											});
											/**
											 * attaching the map object to the Ext container as querying the DOM for this 
											 * object through this container is not possible.  
											 */
											Ext.getCmp(domId).ownerCt.mapObj = map;
											var coordinatesArray =  Ext.getCmp(domId).addressArray;
											if(coordinatesArray && coordinatesArray.length>0){
												for(var i=0;i<coordinatesArray.length;i++){
													var mapConfig = coordinatesArray[i];
													/**
													 * Looping through the record array and getting the values of the address,
													 * lattitude and longitude
													 */
													var latitude = (mapConfig["LATITUDE"] && mapConfig["LATITUDE"]!=="")?Number(mapConfig["LATITUDE"]):null;
													var longitude = (mapConfig["LONGITUDE"] && mapConfig["LONGITUDE"]!=="")? Number(mapConfig["LONGITUDE"]):null;
													var address = (mapConfig["ADDRESS"] && mapConfig["ADDRESS"]!=="")?mapConfig["ADDRESS"]: null;
													/**
													 * Forming the google position object by passing the received attributes
													 * and loading the Maps with the formed position object.
													 * Address is not mandated for the Maps to load
													 */
													if(!Ext.isEmpty(latitude)&&!Ext.isEmpty(longitude)){
														var latLng = new google.maps.LatLng(latitude,longitude);
														var marker;
														if(map){
															var component = Ext.getCmp(domId);
															/**
															 * 1.Forming the marker object with default animation 
															 * 2.Adding the addressCmp here as it would be sufficent to pass this 
															 * marker object alone to the marker click listener.
															 */
															marker = component.ownerCt.getMarkerFor(map, latLng, address);
															/**
															 * Will set the last lattitude and longitude as the center of the map 
															 * and will Zoom by default to 3.
															 * The developer always has the option to zoom in and zoom out further through the 
															 * map 
															 */
															if(i==coordinatesArray.length-1){
																map.setCenter(latLng);
																map.setZoom(3);
															}
														}
														/**
														 * Checking if marker object is present and address is available and calling 
														 * the attachMarkerClickListener API which will attach the click event listener 
														 * to this marker.
														 * 
														 * Note:The listener will not be attached if the address is empty and a valid marker object
														 * has been formed.
														 */
														if(!Ext.isEmpty(address) && !Ext.isEmpty(marker)){
															component.ownerCt.attachMarkerClickListener(marker);
														}
													}
													/**
													 * Loading the default coordinates if one of latitude or longitude is not available.
													 */
													else{														
														var cmp = Ext.getCmp(domId);
														cmp.getEl().unmask();
														var errMsg = cmp.rb["LBL_NO_DATA_AVAILABLE"];
														cmp.update(errMsg);
													}
												}
											}
											/**
											 * If the received record count is 0,the map will load with 0,0 as the center
											 */
											else{
												var cmp = Ext.getCmp(domId);
												cmp.getEl().unmask();
												var errMsg = cmp.rb["LBL_NO_DATA_AVAILABLE"];
												cmp.update(errMsg);
											}
										}
									});
								}
								else{
									
									var cmp = Ext.getCmp(domId);
									cmp.getEl().unmask();
									var errMsg = cmp.rb["LBL_NO_MAPS_AVAILABLE"];
									cmp.update(errMsg);
									
								}
							},'head',this.id); 
						}
					});
				},
				/**
				 * Calling the google map resize event on resize of this container.
				 * Please refer google developer API.
				 */
				resize : function(){
					if(this.ownerCt.mapObj){
						google.maps.event.trigger(this.ownerCt.mapObj, 'resize');
					}
				} 
				

			}

		});
		/**
		 * Adding this Ext object to the container
		 */
		this.items = map;

		cbx.view.MapViewPanel.superclass.initComponent.apply(this);
	
	},
	/**
	 * 1.Setting the height of this Component which will internally fire the resize event of the google map
	 * 2.Will be called by the multi view header object when the user drags the widget through the widget resizer.
	 */
	updateHeight : function(height){
		this.setHeight(height);
		//this.getComponent(0).setHeight(height);
	},
	/**
	 * Any service exposed by the widget containing this component will call this API internally to load the passed
	 * address/latlng in the map.
	 * Used for cell click handlers.Will be coming through inter widget communication
	 */
	loadAdressInMap : function(mapConf){
		var map = this.mapObj;
		var rb = CRB.getFWBundle();
		if(mapConf && map){
			var latitude = (mapConf["LATITUDE"] && mapConf["LATITUDE"] !=='')?Number(mapConf["LATITUDE"]):null;
			var longitude = (mapConf["LONGITUDE"] && mapConf["LONGITUDE"] !=='')?Number(mapConf["LONGITUDE"]):null;
			var address = (mapConf["ADDRESS"] && mapConf["ADDRESS"]!=="")?mapConf["ADDRESS"]:null;
			
			var googlemapzoom = Number(iportal.preferences.getGoogleMapZoom());
		
			
			
			var latLng,marker;
			/**
			 * Getting the marker from the API if a latitude and longitude is available
			 */
			if(!Ext.isEmpty(latitude)&&!Ext.isEmpty(latitude)){
				latLng = new google.maps.LatLng(latitude,longitude);
				marker = this.getMarkerFor(map, latLng, address);
				map.setCenter(latLng);	
						    
				map.setZoom(googlemapzoom);
			    
			} 
			/**
			 * Checking if marker object is present and address is available and calling 
			 * the attachMarkerClickListener API which will attach the click event listener 
			 * to this marker.
			 * 
			 * Note:The listener will not be attached if the address is empty and a valid marker object
			 * has been formed.
			 */
			if(!Ext.isEmpty(address) && !Ext.isEmpty(marker)){
				this.attachMarkerClickListener(marker);
			}
		}
	},
	/**
	 * API to load the default co-ordinates i.e 0,0
	 * @param map -> The google Map object
	 */
	loadDefaultCoordinates : function(map){
		var latLng = new google.maps.LatLng(0,0);
		map.setCenter(latLng);
	},
	/**
	 * 1.Forming the marker object with default animation 
	 * 2.Adding the addressCmp here as it would be sufficent to pass this 
	 * marker object alone to the marker click listener.
	 * 3.Returning the marker
	 */
	getMarkerFor : function(mapObj,latLng,address){
		return new google.maps.Marker({
			map: mapObj,
			animation : google.maps.Animation.DROP,
			position: latLng,
			addressCmp :address
		});
	},
	/**
	 * Attaching the info window to the marker,which will display the address on click of
	 * the marker object.
	 */
	attachMarkerClickListener : function(marker){
		google.maps.event.addListener(marker, 'click', (function(marker) {
			return function() {
				var infowindow = new google.maps.InfoWindow();
				infowindow.setContent(this.addressCmp);
				infowindow.open(this.map,this);
			};
		})(marker));
	}
	
})