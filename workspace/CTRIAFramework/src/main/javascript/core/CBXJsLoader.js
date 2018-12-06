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
(function() {
	/**
	 * 
	 */
	var win = window,
		/**
		 * 
		 */
		doc = document, proto = 'prototype',
		/**
		 * 
		 */
		head = doc.getElementsByTagName('head')[0],
		/**
		 * 
		 */
		body = doc.getElementsByTagName('body')[0],
		/**
		 * 
		 */
		sniff = 1 + /(?:Gecko|AppleWebKit)\/(\S*)/.test(navigator.userAgent); 
	/**
	 * 
	 */
	var createNode = function(tag, attrs) {
		var attr, node = doc.createElement(tag);
		for (attr in attrs) {
			if (attrs.hasOwnProperty(attr)) {
				node.setAttribute(attr, attrs[attr]);
			}
		}
		return node;
	};
	/**
	 * 
	 */
	var processNodeArrays = function(appender, type, params, that) {
		if (that.orderedNodeList.length > 0) {
			appendNodesInOrder(appender, type, params, that, 0);
		} else {
			appendNodes.apply(that,[appender, type, params, that,0]);
		}
	};
	/**
	 * 
	 */
	var appendNodes = function(appender, type, params, that,count) {
		this.orderProcessRequired = false;
		var options = processAdditionalOptions(appender, type, params, this,
				"N",count);
		for ( var i = 0; i < that.unOrderedNodeList.length; i++) {
			options.COUNT = options.COUNT +1;
			appender.appendChild(this.unOrderedNodeList[i]);
			attachNodeListeners(this.unOrderedNodeList[i], options);
		}
	};
	/**
	 * 
	 */
	var processAdditionalOptions = function(appender, type, params, scope,
			orderReq, count) {
		return {
			"APPEND_ON" : appender,
			"TYPE" : type,
			"PARAMS" : params,
			"SCOPE" : scope,
			"PRESERVE_ORDER" : orderReq,
			"COUNT" : count
		};
	};
	/**
	 * 
	 */
	var appendNodesInOrder = function(appender, type, params, that, count) {
		var node = that.orderedNodeList[count];
		var options = processAdditionalOptions(appender, type, params, that,"Y",count);
		appender.appendChild(node);
		attachNodeListeners(node, options);
	};
	/**
	 * 
	 */
	var attachNodeListeners = function(node, options) {
		var options = options;
		var that = options.SCOPE;
		var count = options.COUNT;
		var queue = options.SCOPE.queue.length;
		node.options = {};
		cbx.apply(node.options,options);
		if (sniff) {
			if (options.TYPE == 'css' && sniff == 2) {
				
			} 
			else {
				if(cbx.isIE() && !cbx.isEmpty(node.readyState) && node.readyState){
					node.onreadystatechange = function (){
						if (/^loaded|complete$/.test(this.readyState)) {
							this.onreadystatechange = null;
							that.queue.pop();
							that.__callback(this.options);
							if(this.options.PARAMS && this.options.PARAMS.progressUpdateRequired && this.options.PARAMS.progressBar){
								this.options.PARAMS.progressBar.updateProgress(fileCounter);
								fileCounter++;
							}
						}
					};
				}
				else{
					node.onload = function (){
					if(this.options.PARAMS && this.options.PARAMS.progressUpdateRequired && this.options.PARAMS.progressBar){
						this.options.PARAMS.progressBar.updateProgress(fileCounter);
						fileCounter++;
					}					
						that.queue.pop();
						that.__callback(this.options);
					};
				}
				/**
				 * Callback issue..If a url passed in the array is tried to be
				 * loaded,but the file isn't available in the WAR,the call back
				 * does not happen cos the queue will finally contain an
				 * element(the one which has not been loaded)
				 */
				node.onerror = function() {
					var rb = CRB.getFWBundle();
					LOGGER.info(String.format(rb['LOWER_BROWSER_WARN'],this.src));
					that.queue.pop();
					that.__callback(this.options);
				};
			}
		}
	}
	
	/**
	 * 
	 * @param type-
	 * @param urls-
	 * @params callback-
	 * @params scope - 
	 * @params params- 
	 */
	var load = function(type, urls, callback, scope, params) {
	
		if (this == win) {
			return new load(type, urls, callback, scope, params);
		}
		var urls = urls.toString().split(",");
		if (urls == null || urls == "") {
			callback(params);
		} else {
			urls = (typeof urls == 'string' ? [ urls ] : urls);
			scope = 'head';
			scope = (scope ? (scope == 'body' ? body : head)
					: (type == 'js' ? body : head));
			this.callback = callback || function() {
			};
			this.queue = [];
			var node, i = len = 0, that = this, queueCount = 0, preserveOrder = "N";
			this.orderedNodeList = [];
			this.unOrderedNodeList = [];
			this.orderProcessRequired=true;
			for (i = 0, len = urls.length; i < len; i++) {
				var found = false;
				if (type == 'css') {
					node = createNode('link', {
						type : 'text/css',
						rel : 'stylesheet',
						href : urls[i]
					});
				} else {
					if (!found) {
						/**
						 * this.queue[i] was being used here. This leads to the
						 * queue having an "undefined" entry when one of the
						 * url's is found i.e if i'm sending in an array of 50
						 * url's and two or three scripts which have already
						 * been loaded,say the 27th item is already present,the
						 * control never comes inside this condition.Now when
						 * the 28th item is being loaded,the 27th item is
						 * assigned an undefined entry and the 28th entry i.e
						 * this.queue[28] = 1 will happen. Because of this,the
						 * node.onload of this undefined script will never
						 * happen and the queue will always contain an
						 * element,as a result of which the call back fails
						 */

						this.queue[queueCount] = 1;
						queueCount++;
						if (urls[i].indexOf("?") !== -1) {
							var tmpStr = urls[i].substring(urls[i]
									.indexOf("?")+1);
							var tmpArr = tmpStr.split("=");
							preserveOrder=tmpArr[1];
							urls[i] = urls[i]
									.substring(0, urls[i].indexOf("?"));
						}
					
						/**
						 * Hybrid - to fetch from Local always
						 * 
						 *  Context Root comes as 'http://ip:port/contextRoot'
						 *  Hence splitting and trimmimg the last part of context root 
						 *  which is expected to be configured in <canvas>/<on>demand.xml
						 *  
						 *  1.Split,form a new Array neglecting null values..
						 *  2.Check index of context Root in the uri received
						 *  3.Check for hybrid and trim the uri accordingly with or without ('/')
						 *  4.Create js node with the newly formed string.
						 */
						/*var contextRootArray = window['ALL_CACHE_RESP']?(ALL_CACHE_RESP['DEFAULT_BANK_PROFILE'][0].CONTEXT_PATH_IPORTAL).split('/'):
																									iportal.systempreferences.getContextRoot().split('/');*/
						
						var contextRootArray = window['ALL_CACHE_RESP']?(ALL_CACHE_RESP['DEFAULT_BANK_PROFILE'][0].CONTEXT_PATH_IPORTAL).split('/'):
							iportal.workspace.metadata.getContextRoot().split('/');
						
						var newContextArray = [];
						for (var c = 0; c < contextRootArray.length; c++)
						{
							if (!cbx.isEmpty(contextRootArray[c]))
							{
								newContextArray.push(contextRootArray[c]); 
							}
						}
						var contextRoot = "/" + newContextArray[newContextArray.length - 1];
						var contextRootIndex = urls[i].indexOf(contextRoot);
						var hybridFlag = window['ALL_CACHE_RESP']?ALL_CACHE_RESP['DEFAULT_BANK_PROFILE'][0].IS_HYBRID:iportal.systempreferences.isHybrid();
						if(cbx.isString(hybridFlag)){
							hybridFlag = hybridFlag=="true"?true:false;
						}
						var urlString = (contextRootIndex != -1 && hybridFlag) ? urls[i].substring(contextRootIndex + 1, urls[i].length) : urls[i];
						
						if(hybridFlag){
							var regex = new RegExp("//","g");
                        	urlString = urlString.replace(regex,'/');
                        }
						
						
					
						
						node = createNode('script', {
							type : 'text/javascript',
							src : urlString  
						});
						if (preserveOrder === "Y") {
							this.orderedNodeList.push(node);
						} else {
							this.unOrderedNodeList.push(node);
						}
					}
				}
			}
			if (this.orderedNodeList.length == 0
					&& this.unOrderedNodeList.length == 0) {
				that.__callback(params);
			} else {
				processNodeArrays(scope, type, params, that);
			}
		}
		return this;
	};
	
	/**
	 * 
	 */
	load[proto].__callback = function(options) {
		if ((this.queue == 0)) {
			this.callback(options.PARAMS);
			return;
		}
		else if (options && this.orderProcessRequired && this.orderedNodeList.length > 0
				&& options.COUNT < this.orderedNodeList.length-1) {
			options.COUNT = options.COUNT + 1;
			appendNodesInOrder(options.APPEND_ON, options.TYPE, options.PARAMS,
					options.SCOPE, options.COUNT);
		}
		else if(options && this.orderProcessRequired && options.COUNT == this.orderedNodeList.length-1){
			appendNodes.apply(options.SCOPE,[options.APPEND_ON, options.TYPE, options.PARAMS,
					options.SCOPE, options.COUNT]);
		}
	};

	window.CBXJsLoader = {
		css : function(urls, callback, scope) {
			return load('css', urls, callback, scope);
		},
		js : function(urls, callback, scope, additonalParams) {
			fileCounter=1;
			return load('js', urls, callback, scope, additonalParams);
		},
		load : function(type, urls, callback, scope) {
			return load(type, urls, callback, scope);
		}
	};
})();
