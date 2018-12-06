/**
 * Copyright 2015. Intellect Design Arena Limited
 */

cbx.ns('ct.view');
/**
 * @class "ct.view.mapView"
 * @extends "cbx.core.Component"
 * @description This class is expected to load a google map view with multiple markers as in the structure provided in the mapView template file 
 * 
 */
ct.view.mapView = Class(cbx.core.Component, {

	/**
	 * @Method initialize
	 * @memberof "ct.view.mapView"
	 * @description initializes all the variables and functions 
	 * 
	 */
	initialize : function ()
	{
		var me = this;
		this.widgetId = me.md.WIDGET_ID;
		this.viewMd = me.md;
		this.paremtElem = me.elem;
		var that = this;
		/**
		 * The Framework ajax params to fetch the data for this view.
		 * The params are same as of normal VDF for the data fetch.
		 */
		var ajaxparams = {
			'PAGE_CODE_TYPE' : 'VDF_CODE',
			'INPUT_ACTION' : 'INIT_DATA_ACTION',
			'INPUT_PRODUCT' : that.md.md.VIEW_MD.PRODUCT_CODE,
			'INPUT_SUB_PRODUCT' : that.md.md.VIEW_MD.SUB_PRODUCT_CODE,
			'INPUT_FUNCTION_CODE' : that.md.md.VIEW_MD.FUNCTION_CODE,
			'PRODUCT_NAME' : that.md.md.VIEW_MD.PRODUCT_CODE,
			'WIDGET_ID' : that.widgetId,
			'VIEW_ID' : that.md.md.VIEW_MD.VIEW_ID
		};
		/**
		 * Ajax call to get the values of logitudes, latitudes and addresses on success`
		 */
		cbx.ajax({
			params : ajaxparams,
			success : function (resp)
			{
				if(! cbx.isEmpty(resp.response.value.ALL_RECORDS)) {
					var respLength = resp.response.value.ALL_RECORDS.length;
					var i;
					that.lattitude = [];
					that.longitude = [];
					that.address = [];
					that.mainList = [];
					for (i = 0; i < respLength; i++)
					{
						var tmp = [];
						tmp.push(resp.response.value.ALL_RECORDS[i].LATTITUDE);
						tmp.push(resp.response.value.ALL_RECORDS[i].LONGITUDE);
						tmp.push(resp.response.value.ALL_RECORDS[i].ADDRESS);
						that.mainList.push(tmp);
					}
				}
			that.createComponent();
			},
			failure : function ()
			{
				alert('map ajax failed');
			}
		});
	},
	/**
	 * @Method createComponent
	 * @memberof "ct.view.mapView"
	 * @description creates the map component by  getting the template from applyTemplate function
	 * 
	 */
	createComponent : function ()
	{
		var viewMetaData = this.viewMd;
		var tmpLayer = new ct.lib.tmplLayer('mapview.cttpl', viewMetaData);
		tmpLayer.getTemplate(this.applyTemplate, this);
	},
	/**
	 * @Method applyTemplate
	 * @memberof "ct.view.mapView"
	 * @description appends the template from the template file to the parent element
	 * @param {String} template
	 * @param {Object} tmpClass
	 * 
	 */
	applyTemplate : function (template, tmpClass)
	{
		if (!cbx.core.isEmpty(this.paremtElem))
		{
			$(this.paremtElem).append(template);
			this.toLoadGoogleMap();
		}
	},
	/**
	 * @Method refresh
	 * @memberof "ct.view.mapView"
	 * @description reloads the google map with updated markers
	 * 
	 */
	refresh : function ()
	{
		this.toLoadGoogleMap();
	},
	/**
	 * @Method toLoadGoogleMap
	 * @memberof "ct.view.mapView"
	 * @description loads the google map according to the given configurations and sets the markers 
	 * 
	 */
	toLoadGoogleMap : function ()
	{
		scope = this;
		var mapContainer = $(this.paremtElem).find(".map-holderCls")[0];

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

						var myOptions = {
							zoom : 3,
							mapTypeId : google.maps.MapTypeId.ROADMAP
						};
						var map = new google.maps.Map(dom, myOptions);

						setMarkers(map, locations)
						function setMarkers (map, locations)
						{
							if (!cbx.isEmpty(locations))
							{
								var marker, i

								for (i = 0; i < locations.length; i++)
								{

									var lat = locations[i][0]
									var longi = locations[i][1]
									var add = locations[i][2]
									latlngset = new google.maps.LatLng(lat, longi);
									var marker = new google.maps.Marker({
										map : map,
										title : add,
										position : latlngset
									});
									map.setCenter(marker.getPosition())

									var content = "Address: " + add
									var infowindow = new google.maps.InfoWindow()
									if (add)
									{
										google.maps.event.addListener(marker, 'click', (function (marker, content,
													infowindow)
										{
											return function ()
											{
												infowindow.setContent(content);
												infowindow.open(map, marker);
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
				var errMsg = iportal.jsutil.getTextFromBundle(this.bundle, 'LBL_NO_MAPS_AVAILABLE', CRB
							.getFWBundleKey());

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
}, ct.view.mapView);
