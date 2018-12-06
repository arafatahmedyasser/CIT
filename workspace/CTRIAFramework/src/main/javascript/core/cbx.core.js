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

(function (){
	/**
	 * Base class that provide the utlity functionalities aswell as the
	 * whenReady state event handling for cbx.
	 */
	Base = Class({
		/**
		 * 
		 */
		$statics : {
			_id : 1
		},
		/**
		 * 
		 */
		isReady : false,
		/**
		 * 
		 */
		domReady : false,
		/**
		 * 
		 */
		moduleParticipating : false,
		/**
		 * 
		 */
		whenReady : function (handler, scope){
			cbx.Event.registerListener("ready", handler, scope);
		},
		/**
		 * 
		 */
		ready : function (){
			cbx.domReady = true;
			if (cbx.isReady === false) {
				if (cbx.moduleParticipating === false) {
				cbx.Event.raiseEvent("ready");
				cbx.isReady = true;
				} else {
					if (cbx.validateReady() === true) {
						cbx.Event.raiseEvent("ready");
						cbx.isReady = true;
			}
				}

			}
		},
		/**
		 * 
		 */
		validateReady : function() {
			var readyResult = cbx.Event.raiseEvent("preReady");
			var flag = true;
			if (readyResult != null) {
				for ( var i = 0, len = readyResult.length; i < len; i++) {
					if (readyResult[i] === false) {
						flag = false;
						break;
					}
				}
			}
			return flag;
		},
		metaDataSyncReady : function(handler,scope) {
			cbx.Event.registerListener("syncready", handler, scope);	
		},
		/**
		 * 
		 */
		validateSyncReady : function() {
			cbx.Event.raiseEvent("syncready");	
		},
		/**
		 * 
		 */
		participateInReady : function(handler, scope) {
			this.moduleParticipating = true;
			cbx.Event.registerListener("preReady", handler, scope);
		},
		/**
		 * 
		 */
		moduleReady : function() {
			if (cbx.domReady === true && cbx.isReady === false) {
				this.validateReady();
			}
		},
		/**
		 * 
		 */
		 //Device Change is not reqd need to confirm
		/**deviceChanged : function(handler, scope) {
			cbx.Event.registerListener("devicechanged", handler, scope);
		},*/
		/**
		 * 
		 */
		getCmp:function(id){
			return cbx.CompManager.getCmp(id);
		},
		/**
		 * @Method id
		 * @memberof "cbx"
		 * @description returns a unique identifier that can be used within the dom
		 * @access private
		 */
		id : function (){
			return Base._id++;
		},
		/**
		 * @method apply
		 * @memberof "cbx"
		 * @description Copies all the properties of config to obj.
		 * @param {Object} obj The receiver of the properties
		 * @param {Object} config The source of the properties
		 * @param {Object} defaults A different object that will also be applied for default values
		 * @return {Object} returns obj
		 */	
		apply:function(o, c, defaults){
			try {
		    if(defaults){
		        cbx.apply(o, defaults);
		    }
		    if(o && c && typeof c == 'object'){
		        for(var p in c){
		            o[p] = c[p];
		        }
		    }
		    return o;
			}catch(e){
				LOGGER.error('While cbx.aply', e);
			}
		},
		 /**
		 * @Method applyIf	
		 * @memberof "cbx"
		 * @description Copies all the properties of config to obj if they don't already exist.
         * @param {Object} obj The receiver of the properties
         * @param {Object} config The source of the properties
         * @return {Object} returns obj
         */	
		applyIf : function(o, c){
            if(o){
                for(var p in c){
                    if(!cbx.isDefined(o[p])){
                        o[p] = c[p];
                    }
                }
            }
            return o;
        },
        /**
		 * @Method isString
		 * @memberof "cbx"
		 * @description  Utility method for validating that a value is a string or not
         * @param {Mixed} value Should be a String.
         * @return {Boolean} true if the passed argument is string
         */  
		isString:function(v){
			return typeof v === 'string';
		},
		/**
		 * @Method num
		 * @memberof "cbx"
		 * @description  Utility method for validating that a value is a finite number or not
         * @param {Mixed} value Should be a number.
         * @return {Boolean} true if the passed arguments is number and finite
         */
		isNumber:function(n){
			return typeof n === 'number' && isFinite(n);
		},
		/**
		 * @Method num
		 * @memberof "cbx"
		 * @description  Utility method for validating that a value is numeric, returning the specified default value if it is not.
         * @param {Mixed} value Should be a number, but any type will be handled appropriately
         * @param {Number} defaultValue The value to return if the original value is non-numeric
         * @return {Number} Value, if numeric, else defaultValue
         */
		num : function(v, defaultValue){
            v = Number(cbx.isEmpty(v) || cbx.isArray(v) || typeof v == 'boolean' || (typeof v == 'string' && v.trim().length == 0) ? NaN : v);
            return isNaN(v) ? defaultValue : v;
        },
        /**
         * @Method isObject
         * @memberof "cbx"
       	 * @description <p>Returns true if the passed value is empty.</p>
         * <p>The value is deemed to be empty if it is<div class="mdetail-params"><ul>
         * <li>null</li>
         * <li>undefined</li>
         * <li>an empty array</li>
         * <li>a zero length string (Unless the <tt>allowBlank</tt> parameter is <tt>true</tt>)</li>
         * </ul></div>
         * @param {Mixed} value The value to test
         * @param {Boolean} allowBlank (optional) true to allow empty strings (defaults to false)
         * @return {Boolean}
         */   
      
		isEmpty: function(v, allowBlank){
			  return v === null || v === undefined || (cbx.isObject(v) && !(Object.keys(v).length)) || ((cbx.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
		},
		  /**
         * @Method isObject
         * @memberof "cbx"
       	 * @description Returns true if the passed value is a JavaScript Object
         * @param {Mixed} value The value to test
         * @return {Boolean}  
         */	
		
		isObject:function(v){
			return !!v && Object.prototype.toString.call(v) === '[object Object]';
		},
		
		  /**
         * @Method isBoolean
         * @memberof "cbx"
       	 * @description Returns true if the passed value is a JavaScript Boolean
         * @param {Mixed} value The value to test
         * @return {Boolean}  
         */	
			
		isBoolean:function(v){
			return typeof v === 'boolean';
		},
		  /**
         * @Method isArray
         * @memberof "cbx"
       	 * @description Returns true if the passed value is a JavaScript Array.You can refer cbx.core.isArray
         * @param {Mixed} value The value to test
         * @return {Boolean}  
         */	
		
		isArray:function(v){
            return Object.prototype.toString.apply(v) === '[object Array]';
		},

	    /**
         * @Method isIterable
         * @memberof "cbx"
       	 * @description Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
         * @param {Mixed} value The value to test
         * @return {Boolean}  
         */		
		
		isPrimitive : function(v){
            return cbx.isString(v) || cbx.isNumber(v) || cbx.isBoolean(v);
        },
        
        /**
         * @Method isIterable
         * @memberof "cbx"
       	 * @description Returns true if the passed value is a iteratable
         * @param {Mixed} value The value to test
         * @return {Boolean} 
         */    
        isIterable : function(v){
           if(cbx.isArray(v) || v.callee){
                return true;
            }
           if(/NodeList|HTMLCollection/.test(Object.prototype.toString.call(v))){
                return true;
            }
           return ((typeof v.nextNode != 'undefined' || v.item) && cbx.isNumber(v.length));
        },
        
        /**
         * @Method isFunction
         * @memberof "cbx"
       	 * @description Returns true if the passed value is a JavaScript Function, otherwise false.You can event refer the cbx.core.isFunction.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */ 
		isFunction : function(v){
		    return typeof v === 'function';
		},
		 /**
         * @Method isDate
         * @memberof "cbx"
       	 * @description Returns true if the passed object is a JavaScript date object, otherwise false.You can even refer the cbx.core.isDate
         * @param {Object} object The object to test
         * @return {Boolean}
         */
		isDate : function(v){
            return Object.prototype.toString.apply(v) === '[object Date]';
        },
        /**
         * @Method isDefined
         * @memberof "cbx"
         * Returns true if the passed value is not undefined.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
      
        isDefined : function(v){
            return typeof v !== 'undefined';
        },
        /**
         * @Method each
         * @memberof "cbx"
         * @description Iterates an array calling the supplied function.
         * @param {Array/NodeList/Mixed} array The array to be iterated. If this
         * argument is not really an array, the supplied function is called once.
         * @param {Function} fn The function to be called with each item. If the
         * supplied function returns false, iteration stops and this method returns
         * the current <code>index</code>. This function is called with
         * the following arguments:
         * <div class="mdetail-params"><ul>
         * <li><code>item</code> : <i>Mixed</i>
         * <div class="sub-desc">The item at the current <code>index</code>
         * in the passed <code>array</code></div></li>
         * <li><code>index</code> : <i>Number</i>
         * <div class="sub-desc">The current index within the array</div></li>
         * <li><code>allItems</code> : <i>Array</i>
         * <div class="sub-desc">The <code>array</code> passed as the first
         * argument to <code>Ext.each</code>.</div></li>
         * </ul></div>
         * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed.
         * Defaults to the <code>item</code> at the current <code>index</code>
         * within the passed <code>array</code>.
         * @return See description for the fn parameter.
         */       
      
        each : function(array, fn, scope){
            if(cbx.isEmpty(array, true)){
                return;
            }
            if(!cbx.isIterable(array) || cbx.isPrimitive(array)){
                array = [array];
            }
            for(var i = 0, len = array.length; i < len; i++){
                if(fn.call(scope || array[i], array[i], i, array) === false){
                    return i;
                };
            }
        },
        /**
		 * @Method htmlEncode
		 * @memberof "canvas"
		 * @description Convert certain characters (&, <, >, and ') to their HTML character equivalents for literal display in web pages.
		 * @param {String} value The string to encode
		 * @return {String} The encoded text
		 */
		htmlEncode : function(value) {
			return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
		},
		/**
		 * @Method htmlDecode
		 * @memberof "canvas"
		 * @description  Convert certain characters (&, <, >, and ') from their HTML character equivalents.
		 * @param {String} value The string to decode
		 * @return {String} The decoded text
		 */
		htmlDecode : function(value) {
			return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
		},
        /**
		 * @Method isIE6
		 * @memberof "cbx"
		 * @description Check whether the browser is IE6 or not
		 * @return {Boolean} true if detected browser is IE6
		 */
        isIE6: function(){
        	return window.isIE||false;
        },
        /**
		 * @Method isIE
		 * @memberof "cbx"
		 * @description Check whether the browser is IE or not
		 * @return {Boolean} true if detected browser is IE
		 */
        isIE : function(){
        	return bowser.msie||false;
        },
		isFireFox : function(){
			return bowser.firefox||false;
		},
		isChrome : function(){
			return bowser.chrome||false;
		},
		isSafari : function(){
			return bowser.safari || false;
		},
		isNativeAndroid : function(){
			return bowser.android || false;
		},
		isNativeIOS : function(){
			return bowser.ios || false;
		},
		isOpera : function(){
			return bowser.opera || false;
		},
		isNativeBlackberry : function(){
			return bowser.blackberry || false;
		},
		
		isWindowsPhone : function(){
			return bowser.windowsphone || false;
		},
		/**
		 * @Method getUrlParameterByName
		 * @memberof "canvas"
		 * @description  Extracts the URLParameters and return the value of the key
		 * @param {String} paramkey Value of the parameter key to extract 
		 * @return {String} Value of the param key
		 */
	     getUrlParameterByKey: function(paramkey){
	    	paramkey = (paramkey != null) ? paramkey.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]") : null;
			var regex = new RegExp("[\\?&]" + paramkey + "=([^&#]*)"), results = regex.exec(location.search);
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g," "));
		},
		USE_NATIVE : false
	});
	/**
	 * @class "cbx"
	 * @description CBX core utilities and functions.Base class that provide the utlity functionalities aswell as the
	 * whenReady state event handling for cbx.
	 */
	cbx = new Base();
	canvas = cbx;
	
		/**
	 * @Method require
	 * @memberof "canvas"
	 * @description  loads the file based on the type
	 * @param {String} file File to be downloaded while script execution
	 * @param {Function} callback The callback function to be executed after loading the scripts
	 * @param {Object} scriptScope scope to be applied to the callback 
	 */
	canvas.require =  function (file, callback,scriptScope) {
	    callback = callback || function () {};
	    if(canvas.isEmpty(scriptScope) || scriptScope=='head'){
	        scriptScope = document.getElementsByTagName("head")[0];
	    }
	    else if(scriptScope=='body'){
	        scriptScope = document.getElementsByTagName("body")[0];
	    }
	    else{
	        scriptScope = document.getElementsByTagName("head")[0];
	    }
	    
	    var filenode;
	    var jsfile_extension = /(.js)$/i;
	    var cssfile_extension = /(.css)$/i;
	    
	    if (jsfile_extension.test(file)) {
	        filenode = document.createElement('script');
	        filenode.src = file;
	        filenode.type="text/javascript";
	        // IE
	        if(cbx.isIE() && !cbx.isEmpty(filenode.readyState) && filenode.readyState){
	            filenode.onreadystatechange = function (){
	                if (/^loaded|complete$/.test(this.readyState)) {
	                    this.onreadystatechange = null;
	                    callback();
	                }
	            };
	        }
	        else{
	            filenode.onload = function (){
	                callback();
	            };
	        }
	        filenode.onerror = function() {
	            callback();
	        };
	        
	        scriptScope.appendChild(filenode);
	        
	    } else if (cssfile_extension.test(file)) {
	        filenode = document.createElement('link');
	        filenode.rel = 'stylesheet';
	        filenode.type = 'text/css';
	        filenode.href = file;
	        document.getElementsByTagName("head")[0].appendChild(filenode);
	    } else {
	        LOGGER.log("Unknown file type to load.")
	    }
	};
	/**
	 * @Method getScripts
	 * @memberof "canvas"
	 * @description Download the scripts dynamically
	 */
	 
	canvas.getScripts = function () {
	    var index = 0;
	    return function (files, callback,scope) {
	        var files = files.toString().split(",");
	        if (files == null || files == "") {
	            callback();
	        } else {
	            files = (typeof files == 'string' ? [ files ] : files);
	            
	        }
	        index += 1;
	        canvas.require(files[index - 1], callBackCounter,scope);
	        
	        function callBackCounter() {
	            if (index === files.length) {
	                index = 0;
	                callback();
	            } else {
	                canvas.getScripts(files, callback,scope);
	            }
	        };
	    };
	}();
	/**
	 * @Method emptyFn
	 * @memberof "cbx"
	 * @description To define an empty function
	 * @access public
	 * @example
<pre>Call as:cbx.emptyFn();</pre>
	 * */
	
	cbx.emptyFn = function (){
	};
	/**
	 * @Method console
	 * @memberof "cbx"
	 * @description CBX client side console wrapper, this call will take care of switching
	 * on/ off js log statements through out the application. This calss will
	 * also take care of providing a cross browser compaitable LOGGER object.
	 * The configuration is cyrrently hardcoded in the JS file
	 * @access private
	 */
	var enableLogging = true;
	cbx.Console = function (){
		if (enableLogging && window.console && console) {
			if(cbx.isIE){  
				console.debug = function(name, value) {
					console.log("DEBUG: " + name + "==" + value);
				};	
			}
			return console;
		} 
		else {
			return {
				log : cbx.emptyFn,
				debug : cbx.emptyFn,
				error : cbx.emptyFn,
				info : cbx.emptyFn,
				assert : cbx.emptyFn
			};
		}
	}();
	/**
	 * @global
	 * @description LOGGER can be used to print any log statement in the browser console.Depending on the 
	 * type of message we want to print we can use the LOGGER.
	 * To print error LOGGER.error can be used
	 * To simply show message LOGGER.log or LOGGER.info can be used
	 * To show debugging message LOGGER.debug can be used
	 * To show error LOGGER.error can be used. 
	 * @access public
	 * @example
<pre>
1.LOGGER.log("LOGGING");//To print some default logs
2.LOGGER.debug("DEBUGGING");//To print some default logs
3.LOGGER.error("ERROR");//To print some error.
</pre>
	 * 
	 * */
	LOGGER = cbx.Console;
	/**
	 * cbx.core package will contain the entire core functionalites that the  framework offers off the shelf.Internally uses the JSface for the utility methods.JS face 
	 * is a third party utility.There are some function of this class which can be there in cbx sigleton class as well.So it is the
	 * user choice to use the specific method.
	 * @class "cbx.core"
	 *
	 */
	cbx.core = {
		/**
		 * @Method isMap
		 * @memberof "cbx.core"
		 * @description Check an object is a map or not. A map is something like { key1: value1, key2: value2 }.
		 * @param {Object} obj object to be checked
		 * @return {Boolean} true if object is a map
		 * */
		isMap :jsface.isMap,
		/**
		 * @Method isArray
		 * @memberof "cbx.core"
		 * @description Check an object is an array or not. An array is something like [].
		 * @param {Object} obj object to be checked
		 * @return {Boolean} true if object is an array
		 */		
		isArray : jsface.isArray,
		/**
		 * @Method isFunction
		 * @memberof "cbx.core"
		 * @description Check an object is a function or not.
		 * @param {Object} obj object to be checked
		 * @return {Boolean} true if object is an function
		 */
		isFunction : jsface.isFunction,
		/**
		 * @Method isString
		 * @memberof "cbx.core"
		 * @description Check an object is a string not.
		 * @param {Object} obj object to be checked
		 * @return {Boolean} true if object is a string
		 */
		isString : jsface.isString,
		/**
		 * @Method isMap
		 * @memberof "cbx.core"
		 * @description Check an object is a JSON or not. A JSON is something like { key1: value1, key2: value2 }.
		 * @param {Object} obj object to be checked
		 * @return {Boolean} true if object is a JSON
		 * */
		isObject : jsface.isMap,
		/**
		 * @Method isClass
		 * @memberof "cbx.core"
		 * @description an object is a class (not an instance of a class, which is a map) or not.
		 * @param {Object} obj object to be checked
		 * @return true if object is a class
		 */
		isClass : jsface.isClass,
		/**
		 * @Method extend
		 * @memberof "cbx.core"
		 * @desccription Extend object from subject, ignore properties in ignoredKeys
		 * @param {Object} object  the child
		 * @param {Object} subject the parent
		 * @param {Object} ignoredKeys (optional) keys should not be copied to child
	`	 */
		extend : jsface.extend,
		apply : jsface.extend,
		pointcut : jsface.pointcut,
		/**
		 * @Method isDate
		 * @memberof "cbx.core"
		 * @description Check an object is a Date or not.
		 * @param {Object} obj object to be checked
		 * @return {Boolean} true if object is an Date
		 */
		isDate : jsface.isDate,
		/**
		 * @Method isBoolean
		 * @memberof "cbx.core"
		 * @description Check an object is a Boolean or not.
		 * @param {Object} obj object to be checked
		 * @return {Boolean} true if object is an Boolean
		 */
		isBoolean : jsface.isBoolean,
		/**
		 * @Method isArrayObj
		 * @memberof "cbx.core"
		 * @description an object is an array Object.
		 * @param {Object} obj object to be checked
		 * @return {Boolean} true if object is an array Object
		 */
		isArrayObj : jsface.isArrayObj,
		/**
		 * @Method isEmpty
		 * @memberof "cbx.core"
		 * @description Check an object is a Empty or not.
		 * @param {Object} obj object to be checked
		 * @return {Boolean} true if object is an Empty
		 */
		isEmpty : jsface.isEmpty
	};
	/**
	 * @Method ns
	 * @memberof "cbx.core"
	 * @description Core utility for provide namespace packaging capabilities to the
	 * developers.Creates namespaces to be used for scoping variables and classes so that they are not global.
     * Specifying the last node of a namespace implicitly creates all other nodes.
	 * @access private
	 * @param {String} namespace1
     * @param {String} namespace2
     * @param {String} etc
     * @return {Object} The namespace object. (If multiple arguments are passed, this will be the last namespace created)
	 */
	cbx.core.ns = function (name, separator, container){
		var ns = name.split(separator || '.'), o = container || window, i, len;
		for (i = 0, len = ns.length; i < len; i++) {
		o = o[ns[i]] = o[ns[i]] || {};
		}
		return o; 
    };
    /**
	 * @Method ns
	 * @memberof "cbx"
	 * @description Core utility for provide namespace packaging capabilities to the
	 * developers.Creates namespaces to be used for scoping variables and classes so that they are not global.
     * Specifying the last node of a namespace implicitly creates all other nodes.
     * @access public
	 * @param {String} name
     * @param {String} seperator
     * @param {String} container
     * @return {Object} The namespace object. (If multiple arguments are passed, this will be the last namespace created)
     * @example
<pre>1.cbx.ns("cbx.form")
2.cbx.ns('Company',',' 'Company.data'); is equivalent to cbx.ns('Company.data');
3.cbx.ns('Company','$' 'Company.data'); is equivalent to cbx.ns('Company$data');
	 
</pre>
	 */
	cbx.ns = cbx.core.ns;
	/**
	 * @Method ns
	 * @memberof "cbx"
	 * @description Core utility for provide namespace packaging capabilities to the
	 * developers.Creates namespaces to be used for scoping variables and classes so that they are not global.
     * Specifying the last node of a namespace implicitly creates all other nodes.
	 * @access public
	 * @param {String} name
     * @param {String} seperator
     * @param {String} container
     * @return {Object} The namespace object. (If multiple arguments are passed, this will be the last namespace created)
     * @example
<pre>1.cbx.namespace("cbx.form")
2.cbx.namespace('Company',',' 'Company.data'); is equivalent to cbx.namespace('Company.data');
3.cbx.namespace('Company','$' 'Company.data'); is equivalent to cbx.namespace('Company$data');
	 
</pre>
	 */
	cbx.namespace = cbx.core.ns;
	/**
	 * The name space cbx.form are useful for organizing the code.<br>
	 * It provides 2 main benefits.<br>
	 * The first is that we can use them to prevent polluting the global namespace with objects,which is generally
	 * considered to be undesireable. cbx, for example has just a single global object (the cbx object). It's good practice
	 * to put any classes inside a namespace, a commonone is the name of your company or the name of your application.The
	 * other advantage is that assists in keeping our code organized, we can group together similar or co-dependent classes
	 * in the same namespace, which helps to specify your intent to other developers.
	 * @class "cbx.util.JSON"
	 * @namespace "cbx.util"
	 */

	cbx.ns('cbx.util');
	/**
	 * @class "cbx.util.JSON"
	 * @description cbx.util.JSON provides utility functions to encode an Object in JSON String or decode a JSON String into Object. 
	 */
	cbx.util.JSON = new (function(){
	    var useHasOwn = !!{}.hasOwnProperty,
	    isNative = function() {
            var useNative = null;
            return function() {
                if (useNative === null) {
                	useNative = cbx.USE_NATIVE && window.JSON && JSON.toString() == '[object JSON]';
                }
        
                return useNative;
            };
	    }(),
	    /**
	     * 
	     */
        pad = function(n) {
            return n < 10 ? "0" + n : n;
        },
        /**
         * 
         */
        doDecode = function(json){
        	if(json && cbx.isString(json)){
        		 return eval("(" + json + ")") 
        	}
        	else{
        		LOGGER.info("Object reference is either null or cannot be decoded",json); 
        		return json;    
        	}
        },
        /**
         * 
         */
        doEncode = function(o){
            if(!cbx.isDefined(o) || o === null){
                return "null";
            }else if(cbx.isArray(o)){
                return encodeArray(o);
            }else if(cbx.isDate(o)){
                return cbx.util.JSON.encodeDate(o);
            }else if(cbx.isString(o)){
                return encodeString(o);
            }else if(typeof o == "number"){
                return isFinite(o) ? String(o) : "null";
            }else if(cbx.isBoolean(o)){
                return String(o);
            }else {
                var a = ["{"], b, i, v;
                for (i in o) {
                  if(!o.getElementsByTagName){
                        if(!useHasOwn || o.hasOwnProperty(i)) {
                            v = o[i];
                            switch (typeof v) {
                            case "undefined":
                            case "function":
                            case "unknown":
                                break;
                            default:
                                if(b){
                                    a.push(',');
                                }
                                a.push(doEncode(i), ":",
                                        v === null ? "null" : doEncode(v));
                                b = true;
                            }
                        }
                    }
                }
                a.push("}");
                return a.join("");
            }    
        },
        /**
         * 
         */
        m = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"' : '\\"',
            "\\": '\\\\'
        },
        /**
         * 
         */
        encodeString = function(s){
            if (/["\\\x00-\x1f]/.test(s)) {
                return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                    var c = m[b];
                    if(c){
                        return c;
                    }
                    c = b.charCodeAt();
                    return "\\u00" +
                        Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                }) + '"';
            }
            return '"' + s + '"';
        },
        /**
         * 
         */
        encodeArray = function(o){
            var a = ["["], b, i, l = o.length, v;
                for (i = 0; i < l; i += 1) {
                    v = o[i];
                    switch (typeof v) {
                        case "undefined":
                        case "function":
                        case "unknown":
                            break;
                        default:
                            if (b) {
                                a.push(',');
                            }
                            a.push(v === null ? "null" : cbx.util.JSON.encode(v));
                            b = true;
                    }
                }
                a.push("]");
                return a.join("");
        };
        /**
 		* @Method encodeDate
 		* @memberof "cbx.util.JSON"
        * @description <p>Encodes a Date. This returns the actual string which is inserted into the JSON string as the literal expression.
        * <b>The returned value includes enclosing double quotation marks.</b></p>
        * <p>The default return format is "yyyy-mm-ddThh:mm:ss".</p>
        * <p>To override this:</p><pre>
cbx.util.JSON.encodeDate = function(d) {
 	return d.format('"Y-m-d"');
};
    </pre>
         * @param {Date} d The Date to encode
         * @return {String} The string literal to use in a JSON string.
         */	   
	    this.encodeDate = function(o){
	        return '"' + o.getFullYear() + "-" +
	                pad(o.getMonth() + 1) + "-" +
	                pad(o.getDate()) + "T" +
	                pad(o.getHours()) + ":" +
	                pad(o.getMinutes()) + ":" +
	                pad(o.getSeconds()) + '"';
	    };
	    /**
	     * @Method encode
	     * @memberof "cbx.util.JSON"
	     * @description Encodes an Object, Array or other value.You can use cbx.encode as well for the same
	     * @param {Mixed} o The variable to encode
	     * @return {String} The JSON string
	     */
	    this.encode = function() {
	        var ec;
	        return function(o) {
	        	try{
		            if (!ec) {
		                ec = isNative() ? JSON.stringify : doEncode;
		            }
	            return ec(o);
	        	}
	        	catch(err){
	        		LOGGER.error('While cbx.encode', err);
	        	}        	
	        };
	    }();
	/**
	 * @Method decode
     * @memberof "cbx.util.JSON"
     * @description Decodes (parses) a JSON string to an object. If the JSON is invalid, this function throws a SyntaxError unless the safe option is set.User can use cbx.decode as well
     * @param {String} json The JSON string
     * @return {Object} The resulting object
     */
	    this.decode = function() {
	        var dc;
	        return function(json) {
	            try{
		        	if (!dc) {
		                
		                dc = isNative() ? JSON.parse : doDecode;
		            }
		            return dc(json);
	            }catch(err){
	            	LOGGER.error('While cbx.decode', err);
	            }        
	        };
	    }();
	})();
	/**
     * @Method encode
     * @memberof "cbx"
     * @description Encodes an Object, Array or other value.You can use cbx.util.JSON.encode as well for the same
     * @param {Mixed} o The variable to encode
     * @return {String} The JSON string
     */ 
	cbx.encode=cbx.util.JSON.encode;
	/**
	 * @Method decode
     * @memberof "cbx"
     * @description Decodes (parses) a JSON string to an object. If the JSON is invalid, this function throws a SyntaxError unless the safe option is set.User can use cbx.util.JSON.decode as well
     * @param {String} json The JSON string
     * @return {Object} The resulting object
     */
	cbx.decode=cbx.util.JSON.decode;
	
	/**
	 * @class "cbx.Observable"
	 * @description Base class that provides a common interface for publishing events. Subclasses are expected to
	 * to have a property "events" with all the events defined, and, optionally, a property "listeners"
	 * with configured listeners defined.<br>
	 * This is the core Event class that will be shared and directly used
	 * throughout the application scope. This is also act as the interaction
	 * medium between the third party and cbx.core framework components.	 * 
	 * <br>
	 * For example:
	 * <pre>
Employee = Class(cbx.Observable, {//This line is equivalent of extending the class cbx.Observable
	constructor: function(config){
	this.name = config.name;
	this.addEvents({
		"fired" : true,
	     "quit" : true
	});
// Copy configured listeners into *this* object so that the base class&#39;s
// constructor will add them.
this.listeners = config.listeners;
}
});
</pre>
This could then be used like this:<pre>
var newEmployee = new Employee({
	name: employeeName,
	listeners: {
	quit: function() {
		// By default, "this" will be the object that fired the event.
	    alert(this.name + " has quit!");
	 }
	}
});
</pre>
	 */
	cbx.Observable = Class({
		/**
		 * @Method constructor
		 * @memberof "cbx.Observable"
		 * @description Class constructor for initializing the listeners and the events
		 * private objects.Any class which gets extended from cbx.Observable will use this method to initialize any alue
		 * @access public
		 * 
		 */
		constructor : function (){
			this.listeners = {};
			this.events = [];
			cbx.Observable.superclass = cbx.Observable.$super; 
		},
	
		addEvent : function (event){
			this.events.push(event);
		},
		/**
		 * @Method addEvents
		 * @memberof "cbx.Observable"
		 * @description Adds the specified events to the list of events which this Observable may fire.
		 * @param {Object|String} eventsConfig Either an object with event names as properties with a value of true
		 * or the first event name string if multiple event names are being passed as separate parameters.
		 * @access public
		 * @example 
<pre>
this.addEvents('storeloaded', 'storecleared');
</pre>
*/
		addEvents : function (eventsConfig){
			this.events = eventsConfig;
		},
		
	    /**
	     * @Method registerListener
	     * @memberof "cbx.Observable"
	     * @description Method for registering listeners for an event.Appends an event handler to this object.
	     * @param {String}   eventName The name of the event to listen for.
	     * @param {Function} handler The method the event invokes/Reference of the Function that needs to be executed
	     * @param {Object}   scope (optional) The scope (<b>this</b>reference) in which the handler function is executed.<b>If omitted, defaults to the object which fired the event.</b>
	     * @access public
	     */
		registerListener : function (event, listner, scope){
			scope = scope || this;
			this.listeners = this.listeners || {};
			this.events = this.events || [];
			if (this.listeners[event]) {
				if (!cbx.core.isArray(this.listeners[event])) {
					this.listeners[event] = [];
				}
				this.listeners[event].push({
					fn : listner,
					scope : scope
				});
			} else {
				this.listeners[event] = [ {
					fn : listner,
					scope : scope
				} ];
			}
		},
		
		/**
		 * @Method raiseEvent
		 * @memberof "cbx.Ovservable"
		 * @description <p>Fires the specified event with the passed parameters (minus the event name).</p>
		 * This method is called for raising an event, which would execute allthe listeners attached to
		 * the requested event in the sequence they were registered.
		 * @access public
	     * @param {String} event The name of the event to fire.
	     * @return {Array} returnArr
	     */
		raiseEvent : function (event){
			var returnArr = [];
			try {
				if (this.listeners && this.listeners[event] != null && cbx.core.isArray(this.listeners[event])) {
					for ( var i = 0, len = this.listeners[event].length; i < len; i++) {
						returnArr[returnArr.length] = this.listeners[event][i].fn.apply(this.listeners[event][i].scope, Array.prototype.slice.call(
										arguments, 1));
					}
				}else{
					if(this.listeners && this.listeners[event] != null && cbx.core.isFunction(this.listeners[event])){
						returnArr[returnArr.length] = this.listeners[event].apply(this.listeners[event].scope, Array.prototype.slice.call(
							arguments, 1));	
					}
				}
			} 
			catch (e) {
				LOGGER.error(e);
			}
			return returnArr;
		},
		/**
		 *@Method purgeListeners
		 *@memberof "cbx.Observable"
		 *@description Remove all the listeners
		 *@access public
		 *@param {String} event The event name that needs to be removed
		 *@param {Object} Scope The scope from which the event needs to be removed.
		 */
		purgeListeners : function(event, scope) {
			if (this.listeners) {
				if (event && this.listeners[event]) {
					if (scope != null) {
						var handlers=this.listeners[event];
						for(var i=0, len=handlers.length;i<len;i++){
							if(handlers[i]!=null && handlers[i].scope==scope){
								handlers.splice(i, 1);
								break;
							}
						}
					} 
					else {
						for (evt in this.listeners) {
							if(evt==event){
								delete this.listeners[evt];
							}
						}
					}
				} else {
					for (evt in this.listeners) {
						if(evt==event){
							delete this.listeners[evt];
						}
					}
				}
			}
		},
		/**
		 * @Method on
		 * @memberof "cbx.Observable"
		 * @description  Appends an event handler to this object (shorthand for registerListener)
		 * @param {String}   eventName     The type of event to listen for
		 * @param {Function} handler       The method the event invokes
		 * @param {Object}   scope         (optional) The scope (<b>this</b> reference) in which the handler function is executed.
		 * <b>If omitted, defaults to the object which fired the event.</b>
		 */
		on : function(event,listener,scope){
			this.registerListener(event, listener, scope);
		},
		
		destroy : function() {
			this.raiseEvent('destroy');
			this.purgeListeners();
			for (i in this) {
				if (i !== 'listeners' && i !== 'events'	&& this.hasOwnProperty(i)) {
					delete this[i];
				}
			}
		}		
	});
	/**
	 * @class "cbx.core.Event"
	 * @access private
	 * @description Class constructor for initializing the listeners and the events
	 * private objects
	 * 
	 * */
	cbx.core.Event = Class({
		constructor : function() {
			this.listeners = {};
			this.events = [];
		},
		addEvent : function(event) {
			this.events.push(event);
		},
		addEvents : function(eventsConfig) {
			this.events = eventsConfig;
		},
		/**
		 * @Method registerListener
		 * @memberof "cbx.core.Event"
		 * @description Method for registering listeners for an event.
		 * @access public
		 * @param {String} event event Name of the Event
		 * @param {Object} listener listener Reference of the Function that needs to be executed
		 * @param {Object} scope Scope of the object under which the listener should be
		 *        executed
		 */
		registerListener : function(event, listner, scope) {
			scope = scope || this;
			this.listeners = this.listeners || {};
			this.events = this.events || [];
			if (this.listeners[event]) {
				if (!cbx.core.isArray(this.listeners[event])) {
					this.listeners[event] = [];
				}
				this.listeners[event].push({
					fn : listner,
					scope : scope
				});
			} else {
				this.listeners[event] = [ {
					fn : listner,
					scope : scope
				} ];
			}
		},
		/**
		 * @Method raiseEvent
		 * @memberof "cbx.core.Event"
		 * @description  This method is called for raising an event, which would execute all
		 * the listeners attached to the requested event in the sequence they
		 * were registered.
		 * @access public
		 * @param {String} event Name of the Event
		 */
		raiseEvent : function(event) {
			var returnArr = [];
			if (this.listeners && this.listeners[event] != null) {
				if (!cbx.core.isArray(this.listeners[event])) {
					if (cbx.core.isObject(this.listeners[event])) {
						this.listeners[event] = [ this.listeners[event] ];
					}
				}
				if (cbx.core.isArray(this.listeners[event])) {
					for ( var i = 0, len = this.listeners[event].length; i < len; i++) {
						//try {
							// this.listeners[event][i].fn.call(this.listeners[event][i].scope,
							// arguments);
							returnArr[returnArr.length] = this.listeners[event][i].fn
									.apply(this.listeners[event][i].scope,
											Array.prototype.slice.call(
													arguments, 1));
						//} catch (e) {
						//	LOGGER.error("Error calling Event: ", event, ", Arguments: ",arguments, ", Listener: ",this.listeners[event][i].fn,  e);
						//}
					}
				}
			}
			return returnArr;
		},
		/**
		 * @Method purgeListeners
		 * @memberof "cbx.core.Event"
		 * @description Remove all the listeners
		 * @param {String} event Optional, if provided the remove listeners for the given
		 *        events.
		 */
		purgeListeners : function(event, scope) {
			if (this.listeners) {
				if (event && this.listeners[event]) {
					if (scope != null) {
						var handlers=this.listeners[event];
						for(var i=0, len=handlers.length;i<len;i++){
							if(handlers[i]!=null && handlers[i].scope==scope){
								handlers.splice(i, 1);
								break;
							}
						}
					} else {
					delete this.listeners[event];
					}
				} else {
					for (evt in this.listeners) {
						delete this.listeners[evt];
					}
				}
			}
		},
		on : function(event, listener, scope) {
			this.registerListener(event, listener, scope);
		},
		destroy : function() {			
			this.raiseEvent('destroy');
			this.purgeListeners();
			for (i in this) {
				if (i !== 'listeners' && i !== 'events'
						&& this.hasOwnProperty(i)) {
					delete this[i];
		}
			}
		}		
	});

	/**
	 * @class cbx.util.element
	 * @access private 
	 * 
	 * */

	cbx.util.element = function ()
	{
		var elemConfig = "";
		var elemLayer = "";
		var element = "";
		return {
			/**
			 * @Method getElement
			 * @memberof "cbx.util.element"
			 * @description Gets the metadata for the widget / app. @param widgetId @param versionNo @param successHandler callback
			 * handler when ajax call is succeeds @param handlerScope scope at which the handler needs to be executed.
			 * @access public
			 */
			getElement : function (config)
			{
				if (!cbx.isEmpty(config) && !cbx.isEmpty(config.WIDGET_ID) && !cbx.isEmpty(config.baseElemToAppend))
				{
					elemConfig = {
						'eleType' : 'div',
						'class' : 'templateWidget'
					};
					elemLayer = new cbx.lib.layer(elemConfig).getLayer();
					element = new cbx.lib.layer({
						"eleType" : "div",
						'class' : config.WIDGET_ID + "_TEMPLATE"
					}).getLayer();
					config.elem = $(element);
					elemLayer.appendChild(element);
					new canvas.lib.app(config)
					$(config.baseElemToAppend).append($(elemLayer));
				}
			}
		};
	}();
	
	/**
	 * @class "cbx.event"
	 * @description Class for handling the events in CT.Instance of the cbx.Observable.Refer cbx.Observable for more details.
	 */

	cbx.Event = new cbx.Observable();

	if (document.addEventListener) {
		DOMContentLoaded = function (){
			document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
			cbx.ready();
		};

	} 
	else if (document.attachEvent) {
		DOMContentLoaded = function (){
			/**
			 * Make sure body exists, at least, in case IE gets a little overzealous
			 */
			if (document.readyState === "complete") {
				document.detachEvent("onreadystatechange", DOMContentLoaded);
				cbx.ready();
			}
		};
	}
	/**
	 * Catch cases where $(document).ready() is called after the
	 * browser event has already occurred.
	 */
	if (document.readyState === "complete") {
		/**
		 * Handle it asynchronously to allow scripts the opportunity to delay ready
		 */
		setTimeout(cbx.ready, 1);
	}
	/**
	 * Mozilla, Opera and webkit nightlies currently support this event
	 */
	if (document.addEventListener) {
		/**
		 * Use the handy event callback
		 */
		document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
		/**
		 * A fallback to window.onload, that will always work
		 */
		window.addEventListener("load", cbx.ready, false);
		/**
		 * If IE event model is used
		 */
	} 
	else if (document.attachEvent) {
		/**
		 * ensure firing before onload,maybe late but safe also for iframes
		 */
		document.attachEvent("onreadystatechange", DOMContentLoaded);
		/**
		 * A fallback to window.onload, that will always work
		 */
		window.attachEvent("onload", cbx.ready);
	}
	/**
	 * 
	 */
	cbx.CompManager = function (){
		var register = {};
		return {
			/**
			 * 
			 */
			getCmp : function (cmpId){
				return register[cmpId];
			},
			/**
			 * 
			 */
			registerCmp: function(cmpId, obj){
				register[cmpId]=obj;
			},
			/**
			 * 
			 */
			removeCmp: function(cmpId){
				delete register[cmpId];
			}
		};
	}();
	

	cbx.core.Component = Class(cbx.Observable, {
		/**
		 * @class "cbx.core.Component"
		 * @extends "cbx.Observable"
		 * @description CBX Core Component provides the basic support and lifecycle methods
		 * needed for creating and third party library control and inttegrate it
		 * with in the cbx application. Any visiual component that gets rendered on
		 * the screen would needs to create a wrapper class extending
		 * cbx.core.Components.
		 */
		isCBXComponent : true,
		el:null, 
		constructor : function (config){
			cbx.core.extend(this, config);
			cbx.core.Component.$super.call(this);
			this.items = [];
			this.id= this.id || cbx.id();
			cbx.CompManager.registerCmp(this.id, this);
			/**
			 * Calling the initialize method that will be used by the third
			 * party lib component developer for initiating the component.
			 */
			this.initialize();
		},
		/**
		 * 
		 */
		initialize : function (){
		
		},
		/**
		 * 
		 */
		getEl : function (){
			return this.el;
		},
		/**
		 * 
		 */
		addItem : function (item){
			item.parentCt = this;
			this.items.push(item);
		},
		/**
		 * 
		 */
		setCmp: function(cmp){
			this._cmp=cmp;
		},
		/**
		 * 
		 */
		getCmp: function(){
			return this._cmp;
		},
		/**
		 * 
		 */
		getItem : function (index){
			return this.items[index];
		},
		/**
		 * 
		 */
		findIndex : function (item){
			if (this.items) {
				for ( var i = this.items.length - 1; i >= 0; i--) {
					if (this.items[i] === item) {
						return i;
					}
				}
			}
			return -1;
		},
		/**
		 * 
		 */
		remove : function (item, autoDestroy){
			delete item.parentCt;
			autoDestroy = autoDestroy || false;
			var index = this.findIndex(item);
			if (index >= 0) {
				this.items.splice(index, 1);
			}
			if (autoDestroy === true) {
				item.destroy();
			}
		},
		/**
		 * 
		 */
		removeAll : function (autoDestroy){
			if (this.items) {
				for ( var i = this.items.length - 1; i >= 0; i--) {
					this.remove(this.items[i], autoDestroy);
				}
			}
		},
		/**
		 * 
		 */
		destroy : function (){
		
			this.raiseEvent('beforedestroy');
			if (this.parentCt && this.parentCt.remove) {
				this.parentCt.remove(this, false);
			}
			this.removeAll(true);
			this.raiseEvent('destroy');
			this.purgeListeners();
			cbx.CompManager.removeCmp(this.id);
			for (i in this){
				if(i!=='listeners'&& i!=='events' && this.hasOwnProperty(i)){
					delete this[i];
				}
			}
		},
		/**
		 * 
		 */
		onDestroy : cbx.emptyFn,
		/**
		 * 
		 */
		beforeDestroy : cbx.emptyFn
	});

	canvas.ns('canvas.comm');
	/**
	 * @class "canvas.comm.MessageBus"
	 * @description This class provides the Publish - Subscribe capability that is to be made available as a default
	 *              behavior for various Apps (and non-App functionality too) to communicate with each other.
	 */
	canvas.comm.MessageBus = function ()
	{
		var _registry = {};
		return {
			/**
			 * @Method subscribe
			 * @memberof "canvas.comm.MessageBus"
			 * @description
			 *           <p>
			 *           Subscribe to the event with a callback handler.
			 * @access public
			 * @param {String} eventName The name of the event to which the caller is subscribing to.
			 * @param {String} namespace The namespace within which the caller is expected to be unique. So if there is a
			 *            second call to this method where the combination of namespace and scope exists, the earlier one
			 *            will be replaced with the new one.
			 * @param {Object} scope This is the scope within which the callback is to be invoked. This cannot be null.
			 * @param {Function} callback This is the reference to the actual function that should be called back when the
			 *            event is raised. The function will receive two arguments (in the same order),
			 *            <p>
			 *            data : This is the data that was passed for the event, and
			 *            <p>
			 *            eventName : This is the name of the event.
			 */
			subscribe : function (eventName, namespace, scope, callback)
			{
				if (_registry[eventName] == null)
				{
					_registry[eventName] = [];
				}
				var nsRegistered = false;
				for (var i = _registry[eventName].length - 1; i >= 0; i--)
				{
					if (_registry[eventName][i].ns === namespace)
					{
						// Replace the earlier callback reference with the newly provided one.
						_registry[eventName][i] = {
									fn : callback,
									scope : scope,
									ns : namespace
						};
						nsRegistered = true;
					}
				}
				// Name space was not registered yet. Add it to the registry.
				if (nsRegistered === false)
				{
					_registry[eventName].push({
						fn : callback,
						scope : scope,
						ns : namespace
					});
				}
				LOGGER.info("MessageBus subscribe Registry: ",_registry);
			},
			/**
			 * @Method ubsubscribe
			 * @memberof "canvas.comm.MessageBus"
			 * @description
			 *           <p>
			 *           Unsubscribe to the event
			 * @access public
			 * @param {String} eventName The name of the event to which the caller is unsubscribing from.
			 * @param {String} namespace The namespace within which the caller is expected to be unique. The scope provided
			 *            along with the namespace will be used to perform the unsubscribe action
			 * @param {Object} scope This is the scope within which the callback is to be invoked. Refer to the comment on
			 *            namespace for this parameter's relevance
			 */
			unsubscribe : function (eventName, namespace, scope)
			{
				if (eventName && _registry[eventName])
				{
					var handlers = _registry[eventName];
					for (var i = 0, len = handlers.length; i < len; i++)
					{
						if (handlers[i] != null && handlers[i].ns == namespace)
						{
							handlers.splice(i, 1);
							break;
						}
					}
				}
			},
			/**
			 * @Method publish
			 * @memberof "canvas.comm.MessageBus"
			 * @description
			 *           <p>
			 *           Publish / broadcast an event
			 * @access public
			 * @param {String} eventName The name of the event that has to be published.
			 * @param {Object} data This is the event payload that needs to be passed on to all its subscribers
			 */
			publish : function (eventName, data)
			{
				var handlers = _registry[eventName];
				LOGGER.info("MessageBus publish Registry: ",_registry);
				if (handlers != null && canvas.isArray(handlers))
				{
					var callback = null;
					for (var i = 0, len = handlers.length; i < len; i++)
					{
						try
						{
							callback = handlers[i];
							if (callback != null)
							{
								callback.fn.call(callback.scope, data, eventName);
							}
						} catch (e)
						{
							LOGGER.error("Error caught while processing event ", eventName, " for namespace ",
										callback.ns, e);
						}
					}
				}
			}
		};
	}();
	/**
	 * Providing a short hand for quick access to MessageBus instead of having to go through the package structure.
	 */
	canvas.MessageBus = canvas.comm.MessageBus;
	/**
	 * For backward compatibility, redefining the cbx.CommManager to use the MessageBus.
	 */
	cbx.CommManager = function ()
	{
		return {
			registerHandler : function (event, ns, scope, callback)
			{
				canvas.MessageBus.subscribe(event, ns, scope, callback);
			},
			raiseEvent : function (event, data)
			{
				canvas.MessageBus.publish(event, data);
			},
			removeHandler : function (event, ns, scope)
			{
				canvas.MessageBus.unsubscribe(event, ns, scope);
			}
		};
	}();
	/**
	 * @Method Ajax
	 * @memberof "cbx"
	 * @description CBX Ajax function to communicate with the server. 
	 *<p>The global Ajax request class that provides a simple way to make Ajax requests
	 * with maximum flexibility.</p>
	 * <p>Since cbx.Ajax is a singleton, you can set common properties/events for it once
	 * and override them at the request function level only if necessary.</p>
	 * <p>Common <b>Properties</b> you may want to set are:<div class="mdetail-params"><ul>
	 * <li><b><tt>{@link #method}</tt>:</b>There are two handlers.Success and failure</li>
	 * <li><b><tt>{@link #extraParams}</tt>:</b>The params should typically consist of the combination of product,subproduct,function and action to route through the the CT default flow.Or else user defined params can be provided.Again if we want to route through the CT flow we can provide any extra params as well along with the combination of product,subproduct function and action code.</li>
	 * <li><b><tt>{@link #url}</tt>:</b>URL is optional.If not provided then it will be routed thriugh single controller servlet</li>
	 * </ul></div>
	 *  @param {String} URL The URL is not mandatory.If not provided then the AJax will redirected to the CTCOntroller Servlet
	 *  @param {Object} params Typically consists of the params needs to send to server
	 *  @param {Function} success Default success handler
	 *  @param {FUnction} failure Default failure handler 
	 *	@example
<pre>
cbx.ajax({
	params : params,
	success : function(result) {
		
	},
	failure : function(result, request) {

	}
});
</pre>
	 */
	cbx.ajax = function (config){ 
		if(cbx.resetContent.getCounter()>0){				
			return;
		}
		if(!cbx.isBoolean(config.syncMode)){
			config.syncMode=true;
		}
		config.params[iportal.systempreferences.getCSRFKeyName()]=iportal.systempreferences.getCSRFUniqueId();
		/*
		 * Setting geoLocation object to the ajax params in encoded manner which inturn the server layer makes use of it
		 * to monitor the user's geolocation
		 */
		config.params['GEO_LOCATION']=cbx.encode(canvas.env.location.getGeoLocation());
		if(!cbx.isEmpty(iportal.preferences.getLoginMode())){
			config.params['LOGINMODE']=iportal.preferences.getLoginMode();	
		}	
		/**
		 * Checking for the failureMessage attribute from the config and if not avilable explicitly setting the
		 * config option to true,which error messages will get displayed the inside dialog modal window on
		 * receiving the server error reponse, if the failureMessage attribute is depicted as false then on for
		 * any server error reponse will not displays the error pop up dialog.
		 */
		if(!cbx.isBoolean(config.failureMessage)){
			config.failureMessage=true;
		}		
		config.data = config.data || config.params;
		config.data = config.data || {};
		config.url = config.url || iportal.workspace.metadata.getController();
		config.method = 'post';
		config.type = config.type||'json';
		for (var k in config.data) {
			if (config.data.hasOwnProperty(k) && cbx.isEmpty(config.data[k])) {
				LOGGER.info("Setting "+k+" to an empty string as the parameter was assigned an empty value");
				config.data[k] = "";
			}
		}
		if(config.success){
			config.postSuccess = config.success;
			/*var interceptor = function(response){
				if(cbx.isString(response) && response.indexOf('<html>')!=-1 || response.Status =="Session invalid"){
					location.href = iportal.workspace.metadata.getContextRoot()+'/';
				}
				else{
					config.postSuccess(response);
				}
			}*/
			config.success = cbx.emptyFn()
		}
		//config.success = interceptor;
		if(config.data['TXNMGR'] === 'Y'){ 
			config.beforeLoad = function(){
				var maskCmp = iportal.workspace.metadata.getWorkspaceComponent();
				var rb = CRB.getFWBundle()
				if(maskCmp.el && maskCmp.el.mask){
					var transactionDetail = config.data.MESSAGE?config.data.MESSAGE :rb['LBL_TRAN_MGR_TRANSACTION'];
					maskCmp.el.mask(String.format(rb['LBL_TRAN_MGR_ROLLBACK'],transactionDetail));
				}
			}
		}
		config.afterLoad = function(response){

			CTLOADMASKMANAGER.hideLoadMask(config);
			if(response && response.status==205){				
				req.abort();
				cbx.resetContent.setCounter();
				window.location.reload(true);
			}
			var resp_object = !cbx.isObject(response) && !response.indexOf('<html>')== -1 ?cbx.decode(response.responseText):response;
			var rb = CRB.getFWBundleKey();
			if(resp_object.JSON_MAP && resp_object.JSON_MAP.response && resp_object.JSON_MAP.response.FATAL_ERROR && config.failureMessage){
				var messagetoshow = resp_object.JSON_MAP.response.FATAL_ERROR;
				if(iportal.systempreferences.isRequestIdLogged()){
					if(resp_object.JSON_MAP.response.REQUEST_ID){
						messagetoshow += '<br/><br/>'+iportal.jsutil.getTextFromBundle(rb,'LBL_REFERENCE')+':'+ resp_object.JSON_MAP.response.REQUEST_ID;
					}
				}
				cbx.core.showErrorWin(messagetoshow); 
				response.preventSuccess = true;
			}
			else if(resp_object.TRANSACTION_ERROR && config.failureMessage){
				var messagetoshow = resp_object.TRANSACTION_ERROR;
				if(iportal.systempreferences.isRequestIdLogged()=='true'){
					if(resp_object.REQUEST_ID){
						messagetoshow += '<br/><br/>'+iportal.jsutil.getTextFromBundle(rb,'LBL_REFERENCE')+':'+ resp_object.REQUEST_ID;

					}
				}
				cbx.core.showErrorWin(messagetoshow); 
				response.preventSuccess = true;
			}
			else if(cbx.isString(response) && response.indexOf('<html>')!=-1 || response.Status =="Session invalid" 
												|| (response.JSON_MAP && response.JSON_MAP.SESSION_ERROR == "SESSION_EXPIRY")){

				if(iportal.systempreferences.isHybrid() == 'true'){
					location.href = "index.html";
				}
				else if(iportal.systempreferences.getChannel() == "1"){
					location.href = iportal.workspace.metadata.getContextRoot()+"/m_index.jsp";
				}else{
					location.href = iportal.workspace.metadata.getContextRoot()+"/index.jsp";		
				}
				//location.href = iportal.systempreferences.getSessionTimeOutURL();
				//document.write(response);

			}
			else{
				config.postSuccess(response);
			}
			var maskCmp = cbx.core.ws.metadata.getWorkspaceComponent();
			var rb = CRB.getFWBundle();
			if(maskCmp && maskCmp.el && maskCmp.el.unmask){
				if(maskCmp.el.isMasked()){
					maskCmp.el.unmask();
				}
			}
		}
		
		
		/**
		 * This is the handler for global request failure handler
		 */
		config.requestFailure = function(resp, msg, t) 
		{
			CTLOADMASKMANAGER.hideLoadMask(config); 
			if(cbx.resetContent.getCounter()>0){
				return;
			}
			// Check if the invoker has provided any hook. If yes, then provide
			// the hook the option to handle the failure. If it returns false,
			// then do not do anything. If it does not return anything, or
			// returns true, then proceed with default framework handling
			var returnVal = true;
			if (config.invokeFailure && typeof config.invokeFailure == 'function') 
			{
				returnVal = config.invokeFailure.apply(this,[config, config.data,resp.status, resp.readyState]);
				if (typeof returnVal == 'undefined' || typeof returnVal !== 'boolean') 
				{
					returnVal = true;
				}
			}
			if (returnVal && config.failureMessage)
			cbx.core.showErrorWin();
		};
		
		
		if (config.beforeLoad) {
			config.beforeLoad.apply(this, [ config ]);
		}

		config.before = function(){
			if(config.syncMode){
			CTLOADMASKMANAGER.initiateLoadMask(config,"");
			}
			LOGGER.info("Before requesting ",this);
		}

		config.error = function(){
			CTLOADMASKMANAGER.hideLoadMask(config);
		}


		addEncryptionLayerToAjax(config);

		var req = reqwest(config);
		if (config.afterLoad) {
			req.then(config.afterLoad);
		}
		/*req.always(function(response){
			if(cbx.isString(response) && response.indexOf('<html>')!=-1){
				document.write(response);
			}
			if(window.postLoadEvent){
				window.dispatchEvent(window.postLoadEvent);
			}
		});*/
		
		
	/*	req.fail(function(msg){
			CTLOADMASKMANAGER.hideLoadMask(config); 
			if(cbx.resetContent.getCounter()>0){
				return;
			}
			if(config.failureMessage){
			cbx.core.showErrorWin();
			}
		});*/
		req.fail(config.requestFailure);
		
	}

	/**
	 * This function contains the metadata responsible for the view available inside the widget / app.
	 */
	cbx.ns('cbx.core.app.model');
	cbx.core.app.metadata = function (md){
		this.md = md;
		cbx.core.extend(this, {
			/**
			 * 
			 */
			getColumnList : function (){
				var channelCols = [];
				var device=iportal.systempreferences.getDevice();
				for (i = 0, len = this.md.VIEW_MD.FLD_COLUMN_LIST.length; i < len; i++) {
					if (cbx.core.ws.metadata.getDeviceFilter(md.VIEW_MD.FLD_COLUMN_LIST[i].FLD_CHANNEL_ID,device)
							|| md.VIEW_MD.FLD_COLUMN_LIST[i].FLD_CHANNEL_ID == 'A') {
						channelCols.push(md.VIEW_MD.FLD_COLUMN_LIST[i]);
					}
				}
				return channelCols;
			},
			/**
			 * 
			 */
			getVisibleColumns : function (){
				var cols = this.getColumnList();
				var vCols = [];
				for (i = 0, len = cols.length; i < len; i++) {
					if (cols[i].FLD_VISIBLE_IND === 'Y') {
						vCols.push(cols[i]);
					}
				}
				return vCols;
			},
			getColumnNameByIndex: function(index) {
				var colName="";
				if(!cbx.isEmpty(index)){
				var visibleClms=this.getVisibleColumns();
				colName=visibleClms[index].FLD_COLUMN_ID;
				return colName;
				}
				return colName;
			},
			/**
			 * 
			 */
			getViewsList : function() {
				if (this.md.VIEWS_LIST) {
					return this.md.VIEWS_LIST;
				} else {
					return [ this.md.VIEW_MD ];
				}
			},
			getViewTitle : function (){
				return this.md.VIEW_MD.VIEW_DISPLAY_NM;
			},
			getUniqueColumnName : function() {
				return this.md.VIEW_MD.FLD_UNIQUE_COLUMN_ID;
			},
			/**
			 * 
			 */
			getTools : function (){
				return this.md.VIEW_MD.FLD_TOOLS_LIST;
			},
			/**
			 * 
			 */
			getViewId : function (){
				return this.md.VIEW_MD.VIEW_ID;
			},
			getSystemViewId : function(){
				return this.md.VIEW_MD.SYSTEM_VIEW_ID;
			},
			/**
			 * 
			 */
			getFormId : function (){
				return this.md.VIEW_MD.FLD_DATA_SRC_ID;
			},
			getViewType : function() {
				return this.md.VIEW_MD.FLD_VIEW_TYPE;
			},
			/**
			 * 
			 */
			getViewFilters : function() {
				return this.md.VIEW_MD.FILTERS;
			},
			isDefaultView : function() {
				return this.md.VIEW_MD.DEFAULT_VIEW_IND === 'Y';
			},
			isCustomizable : function() {
				return (this.md.VIEW_MD.FLD_TOOLS_LIST
					.indexOf('gear') > -1)
			},
			isChartView : function (){
				if (this.md.VIEW_MD.FLD_VIEW_TYPE === 'CHART') {
					return true;
				}
				return false;
			},
			/**
			 * 
			 */
			isFormView : function (){
				if (this.md.VIEW_MD.FLD_VIEW_TYPE === 'FORM') {
					return true;
				}
				return false;
			},
			/**
			 * 
			 */
			isMapView : function (){
				if (this.md.VIEW_MD.FLD_VIEW_TYPE === 'MAP') {
					return true;
				}
				return false;
			},
			/**
			 * 
			 */
			isOrgView : function (){
				if (this.md.VIEW_MD.FLD_VIEW_TYPE === 'ORG') {
					return true;
				}
				return false;
			},
			/**
			 * 
			 */
			isListView : function (){
				if (this.md.VIEW_MD.FLD_VIEW_TYPE === 'CLASSIC_GRID' || this.md.VIEW_MD.FLD_VIEW_TYPE === 'LIST' 
					|| this.md.VIEW_MD.FLD_VIEW_TYPE === 'PAGING' || this.md.VIEW_MD.FLD_VIEW_TYPE === 'GROUP' 
							|| this.md.VIEW_MD.FLD_VIEW_TYPE === 'ADVGROUP') {
					return true;
				}
				return false;
			},
			/**
			 * 
			 */
			isPropertyListView : function (){
				if (this.md.VIEW_MD.FLD_VIEW_TYPE === 'PROPERTY') {
					return true;
				}
				return false;
			},
			/**
			 * 
			 */
			isTreeView : function (){
				if (this.md.VIEW_MD.FLD_VIEW_TYPE === 'TREE') {
					return true;
				}
				return false;
			},
			/**
			 * 
			 */
			isGroupView : function (){
				if (this.md.VIEW_MD.FLD_VIEW_TYPE === 'GROUP') {
					return true;
				}
				return false;
			},
			/**
			 * 
			 */
			isCalendarView : function (){

				if (this.md.VIEW_MD.FLD_VIEW_TYPE === 'CALENDAR') {
					return true;
				}
				return false;
			},
			/**
			 * 
			 */
			getRecordsPerPage: function() {								
				return this.md.VIEW_MD.FLD_RECORDS_PER_PAGE;
			},
			/**
			 * 
			 */
			getSelectionType: function() {								
				return this.md.VIEW_MD.FLD_SELECTION_TYPE;
			},
			/**
			 * 
			 */
			getBBarButtons : function ()
			{
				var NEGATIVE_BUTTONS = {}, POSITIVE_BUTTONS = {}, FLD_BBAR_BUTTONS = {};
				var device = iportal.systempreferences.getChannel();
				if (!cbx.isEmpty(this.md.VIEW_MD.FLD_BBAR_BUTTONS))
				{
					if (this.md.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS.length > 0)
					{
						var tmpArry = [];
						for (var i = 0; i < this.md.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS.length; i++)
						{
							if (cbx.core.ws.metadata.getDeviceFilter(
										this.md.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS[i].FLD_CHANNEL_ID, device)
										|| this.md.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS[i].FLD_CHANNEL_ID == 'A')
							{
								tmpArry.push(this.md.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS[i]);
							}
						}
						FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS = tmpArry;
					}
					if (this.md.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS.length > 0)
					{
						var tmpArry = [];
						for (var j = 0; j < this.md.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS.length; j++)
						{
							if (cbx.core.ws.metadata.getDeviceFilter(
										this.md.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS[j].FLD_CHANNEL_ID, device)
										|| this.md.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS[j].FLD_CHANNEL_ID == 'A')
							{
								tmpArry.push(this.md.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS[j]);
							}
						}
						FLD_BBAR_BUTTONS.POSITIVE_BUTTONS = tmpArry;
					}
				}
				return FLD_BBAR_BUTTONS;
			},
			/**
			 * 
			 */
			getContextActionInd : function() {
				return this.md.VIEW_MD.FLD_CONTEXT_ACTION_IND;
			},
			/**
			 * 
			 */
			getContextMenu : function (){
				var context = this.md.CONTEXT_MENU_LIST;
				var menuArr = [];
				if (context != null && context.length > 0) {
					var nodes = context[0].child_nodes;
					var node = {};
					var rb = CRB.getFWBundle();
					for ( var i = 0, len = nodes.length; i < len; i++) {
						node = nodes[i];
						if (node != null) {
							menuArr.push({TITLE : rb[node.display_key_nm] != null ? rb[node.display_key_nm]
														: node.display_key_nm,
											MENU_ID : node.menu_id,
							ICON_CLS :node.menu_id + "_CLS"
							});
						}
					}
				}
				return menuArr;
			},
			/**
			 * 
			 */
			setVersionNo : function (versionNo){
				this.versionNo = versionNo;
			},
			/**
			 * 
			 */
			getVersionNo : function (){
				return this.versionNo;
			},
			/**
			 * 
			 */
			getGroupingColumns : function() {
				var clms = this.md.VIEW_MD.FLD_COLUMN_LIST;
				var groupedClms = [];
				for ( var i = 0, len = clms.length; i < len; i++) {
					if (clms[i].FLD_GROUPED_IND === 'Y') {
						groupedClms.push(clms[i].FLD_COLUMN_ID);
					}
				}
				return groupedClms;
			},
			/**
			 * 
			 */
			getColumn: function(colId){
				var clms = this.md.VIEW_MD.FLD_COLUMN_LIST;
				for ( var i = 0, len = clms.length; i < len; i++) {
					if(clms[i].FLD_COLUMN_ID===colId){
						return clms[i]; 
					}
				}
			},
			/**
			 * 
			 */
			getColType : function(col) {
				return col.FLD_DATA_TYPE;
			},
			/**
			 * 
			 */
			getColSortPos : function(col) {
				return col.FLD_SORT_POSITION;
			},
			/**
			 * 
			 */
			isColSortable : function(col) {
				return col[i].FLD_SORTABLE_IND == 'Y' ? true
						: false;
			},
			/**
			 * 
			 */
			getColTemplate: function(col){
				return col.TEMPLATE_CONFIG;
			},
			/**
			 * 
			 */
			getParentCol:function(col){
				return col.FLD_PARENT_COLUMN_ID;
			},
			/**
			 * 
			 */
			getDisplayMappedCol: function(col){
				return col.FLD_CODE_VAL_DISP_COL;
			},
			/**
			 * 
			 */
			getTotalDisplayInd: function(col){
				return this.md.VIEW_MD.FLD_TOTAL_RESULT_IND;
			
			}
		});
	};

	/**
	 * @class "cbx.core.app.model"
	 * @description This function gets the metadata for the widgets / apps and enables their versioning.
	 * @access public
	 */
	cbx.core.app.model = function (){
		var register = {};
		var requestQueue = {};
		var multiWidRegistry = {};
		var viewMetaData = {};
		return {
			/**
			 * @Method getAPPMetaData
			 * @memberof "cbx.core.app.model"
			 * @access private
			 * @description Gets the metadata for the widget / app.
			 * @param widgetId
			 * @param versionNo
			 * @param successHandler callback handler when ajax call is succeeds
			 * @param handlerScope scope at which the handler needs to be executed. *
			 * @param autoLoad .This is not in use as of now
			 * @param failureMessage if false errormessages will not get displayed on ajax server failure/error .
			 * @param syncMode if false loading mask will not be displayed on ajax before request .
			 */
			getAppMetadata : function (widgetId, versionNo, successHandler, handlerScope, autoLoad,failureMessage,syncMode){
				if (register[widgetId] != null) {
					setTimeout(function(){
						successHandler.apply(handlerScope, [ register[widgetId] ]);
					},100); 
				} else {
					/**
					 * Reusable data retreival utility function ,Checking the WIDGET metadata type for the corresponding
					 * widgetId param from the local store which prefers SQL-Lite database in case of hybrid mode else
					 * browser supported database if enabled or browser supported local storage or global storage
					 * follows in this sequence for execution.If the local cached data is available then the metadata is
					 * loaded from the local cache .If the local cached data is not available(Empty/Error/None of the
					 * above Storages supported) then the metadata is fetched from server. This local store metadata
					 * fetching is made async due to database transaction result set retreivals are designed in async
					 * manner but need not be for other storages(local/global) but still following the same for
					 * coherence.
					 * 
					 * @param {String} metadata type
					 * @param widgetId
					 * @param {Function} callback handler for fetching the metadata from local store.
					 */
					var cachedFlag=false;
					canvas.metadata.getMetaData("WIDGET",widgetId,function(metadatavalue){
						if(!cbx.isEmpty(metadatavalue)){
							try{
								var cachedMetadata=cbx.decode(metadatavalue);
								cachedFlag=true;
								register[widgetId] = new cbx.core.app.metadata(cachedMetadata);
								register[widgetId].setVersionNo(versionNo);
								var viewId= cachedMetadata.VIEW_MD.VIEW_ID;
								viewMetaData[viewId] = cachedMetadata.VIEW_MD;
								var contextdata=cachedMetadata.CONTEXT_MENU_LIST;
								if(contextdata && IMM.contextList){
									IMM.contextList[viewId]=contextdata;
								}
								setTimeout(function(){
									successHandler.apply(handlerScope, [ register[widgetId] ]);
								},100); 
								return;
							}
							catch (e) {
								LOGGER.error('Error while fetching Widget Metadata cached data', e);
								cachedFlag=false;
							}
						}
						if(!cachedFlag){
					var params = {
						INPUT_ACTION : "INIT_HEADER_ACTION",
						PAGE_CODE_TYPE : 'VDF_CODE',
						PRODUCT_NAME : "CUSER",
						INPUT_FUNCTION_CODE : "VSBLTY",
						INPUT_SUB_PRODUCT : "CUSER",
						__LISTVIEW_REQUEST : 'Y',
						INPUT_PRODUCT : "CUSER",
						INPUT_LANGUAGE_ID : iportal.preferences.getPrimaryLang(),
						WIDGET_ID : widgetId,
						VER_NO : versionNo
					};
					cbx.ajax({
						params : params,
								syncMode:syncMode || true,
								failureMessage:failureMessage || true,
						beforeLoad: function(){
							if(autoLoad===true && handlerScope!=null){
								//handlerScope.elem.mask('Loading...');
								//cbx.LoadMask.show();
							}
						},						
						afterLoad: function(){
							if(autoLoad===true && handlerScope!=null){
								//handlerScope.elem.unmask('Loading...');
								cbx.LoadMask.hide();
							}
						},						
						success : function (metadata){
							register[widgetId] = new cbx.core.app.metadata(metadata.response.value);
							register[widgetId].setVersionNo(versionNo);
							var viewId= metadata.response.value.VIEW_MD.VIEW_ID;
							viewMetaData[viewId] = metadata.response.value.VIEW_MD;
							var contextdata=metadata.response.value.CONTEXT_MENU_LIST;
									if(contextdata && IMM.contextList){
							IMM.contextList[viewId]=contextdata;
									}
									if(!register[widgetId].isCustomizable())
									{
										/**
										 * Reusable data retreival utility function for storing the server fetched
										 * metadata in to the local store with a time out of 100 ms, metadata will be
										 * stored only if the local store exists and this will be used later for the
										 * retreival process on necessity. This is more like persisting data to load the
										 * application faster on next visit and too for enabling a web site or web
										 * application to function without a network connection
										 * 
										 * @param {String} WIDGET metadata type
										 * @param {Object} The object which hold widgetid,received server
										 *            responseValue,server responseTime
										 */
										setTimeout(function(){
											try{
												canvas.metadata.storeMetaData("WIDGET",{id:widgetId,value:metadata.response.value,serverdatetime:metadata.HEADER_VALUE.TXN_PROCESS_DATE_TIME});
											}
											catch (e) {
												LOGGER.error('Error while storing Widget Metadata cache', e);
											}
										},100);
									}
							successHandler.apply(handlerScope, [ register[widgetId] ]);
						},
						error : function() {
									LOGGER.error(
											"Error while loading form meta data response",
											arguments);
						}
					});
						}
					},this);
				}
			},
			/**
			 * @member getViewDefinition
			 * @memberof "cbx.core.app.model"
			 * @access public
			 * @description Gets the view definition of the passed widget id
			 * @param {String} widgetId Widget id for which the view definition needs to be retreived
			 */
			getViewDefinition:function(widgetId){
				return register[widgetId];
			},
			
			/**
			 * 
			 */
			getViewMetaData : function (viewId){
				return viewMetaData[viewId];
			},
			
			/**
			 * 
			 */
			getMultiWidMetadata : function(widgetId, versionNo, successHandler,
					handlerScope, autoLoad) {
				if (multiWidRegistry[widgetId] != null) {
					setTimeout(function(){
						successHandler.apply(handlerScope,
								[ multiWidRegistry[widgetId] ]);
					},100);
					
				} 
				else{
					var cachedFlag=false;
					var self=this;
					/**
					 * Reusable data retreival utility function ,Checking the MULTI_WIDGET metadata type for the corresponding
					 * widgetId param from the local store which prefers SQL-Lite database in case of hybrid mode else
					 * browser supported database if enabled or browser supported local storage or global storage
					 * follows in this sequence for execution.If the local cached data is available then the metadata is
					 * loaded from the local cache .If the local cached data is not available(Empty/Error/None of the
					 * above Storages supported) then the metadata is fetched from server. This local store metadata
					 * fetching is made async due to database transaction result set retreivals are designed in async
					 * manner but need not be for other storages(local/global) but still following the same for
					 * coherence.
					 * 
					 * @param {String} metadata type
					 * @param widgetId
					 * @param {Function} callback handler for fetching the metadata from local store.
					 */
					canvas.metadata.getMetaData("MULTI_WIDGET",widgetId,function(metadatavalue){
						if(!cbx.isEmpty(metadatavalue)){
							try{
								var cachedMetadata=cbx.decode(metadatavalue);
								cachedFlag=true;
								multiWidRegistry[widgetId] = new cbx.core.app.metadata(cachedMetadata);
								multiWidRegistry[widgetId].setVersionNo(versionNo);
								setTimeout(function(){
									successHandler.apply(handlerScope,[ multiWidRegistry[widgetId] ]);
								},100); 
								return;
							}
							catch (e) {
								LOGGER.error('Error while fetching Multi Widget Metadata cached data', e);
								cachedFlag=false;
							}
						}
						if(!cachedFlag){
					var params = {
						INPUT_ACTION : "INIT_MULTI_HEADER_ACTION",
						PAGE_CODE_TYPE : 'VDF_CODE',
						PRODUCT_NAME : "CUSER",
						INPUT_FUNCTION_CODE : "VSBLTY",
						INPUT_SUB_PRODUCT : "CUSER",
						__LISTVIEW_REQUEST : 'Y',
						INPUT_PRODUCT : "CUSER",
						INPUT_LANGUAGE_ID : iportal.preferences.getPrimaryLang(),
						WIDGET_ID : widgetId,
						VER_NO : versionNo
					};
					cbx.ajax({
						params : params,
						beforeLoad : function() {
							if (autoLoad === true
									&& handlerScope != null) {
								LOGGER.info('loader...',
										handlerScope.elem);
								//cbx.LoadMask.show();
							}
						},
						afterLoad : function() {
							if (autoLoad === true
									&& handlerScope != null) {
								cbx.LoadMask.hide();
							}
						},
						success : function(metadata) {
							multiWidRegistry[widgetId] = new cbx.core.app.metadata(
									metadata.response.value);
							multiWidRegistry[widgetId]
									.setVersionNo(versionNo);
							successHandler.apply(handlerScope,
									[ multiWidRegistry[widgetId] ]);
									/**
									 * Reusable data retreival utility function for storing the server fetched metadata
									 * in to the local store with a time out of 100 ms, metadata will be stored only if
									 * the local store exists and this will be used later for the retreival process on
									 * necessity. This is more like persisting data to load the application faster on
									 * next visit and too for enabling a web site or web application to function without
									 * a network connection
									 * 
									 * @param {String} MULTI_WIDGET metadata type
									 * @param {Object} The object which hold widgetId,received server
									 *            responseValue,server responseTime
									 */
									setTimeout(function(){
										try{
											canvas.metadata.storeMetaData("MULTI_WIDGET",{id:widgetId,value:metadata.response.value,serverdatetime:metadata.HEADER_VALUE.TXN_PROCESS_DATE_TIME});
										}
										catch (e) {
											LOGGER.error('Error while storing Multi Widget Metadata  cache', e);
										}
									},100);
									setTimeout(function(){
										try{
											var responseValue=metadata.response.value;
											if(responseValue.CHILD_WIDGETS && responseValue.CHILD_WIDGETS.length>0){
												responseValue=responseValue.CHILD_WIDGETS;
												for(var CW=0;CW<responseValue.length;CW++){
													if(!cbx.isEmpty(responseValue[CW].WIDGET_ID)){														
														cbx.core.app.model.getAppMetadata(responseValue[CW].WIDGET_ID, 1, cbx.emptyFn, self);	
													}
												}
											}
										}
										catch (e) {
											LOGGER.error('Error while storing Multi Widget child Widget Metadata  cache', e);
										}
									},200);
						},
						error : function() {
							LOGGER
									.error(
											"Error while loading form multiWidget meta data response",
											arguments);
						}
					});
				}
					},this);
				}
			}
		};
	}();
/**
 * @global
 * @description The Core APP Model.This is a singleton.Please refer the class <b>cbx.core.app.mode</b>
 * 
 * */
	IMM = cbx.core.app.model;
	IMM.contextList =[];
	cbx.ns('cbx.core.app.event');
	/**
	 * Constants object to be used for MENU Initialization and Operation
	 * */
	cbx.core.app.event.constants={
		 VIEW_CHANGE 		:'viewchange',
		 CELL_CLICK 		:'cellclick',
		 DRILL_DOWN			:'drilldown',
		 CONTEXT_CLICK		:'contextclick',
		 GRAPH_DRILL_DOWN	:'graphdrilldown',
		 CELL_ACTION		:'cellaction',
	     SELECTION_CHANGE   :'selectionchange',
		 PREF_CHNG			:'preferencechange',
		 BBUT_CLICK			:'bbuttonclick',
		 TREE_CLICK			:'treeclick',
		 TREE_CONTEXT_CLICK : 'treecontextclick',      
		 NODE_CLICK			:'nodeClick',
		 FLOW_CLICK			:'flowClick',
		 WGT_EXPAND			:'widgetexpand',
		 WGT_COLLAPSED		:'widgetcollapsed',
		 DATA_MOD			:'dataModified',
		 GP_CONT_MENU_CLICK	:'groupcontextmenuclick',
		 GP_DBL_CLICK		:'groupdoubleclick',
		 EXTRA_PARAMS_HDLR	:'extraParamsHandler',
		 SINGLE_CLICK  		:'cellsingleclick',
		 HIGHLIGHT 			:'highlight',
		 MENUCLICK 			:'menuclick',
		 CELL_DATA_CHANGE 	:'cellDataChangeHandler',
		 FORM_MODE 			:'formmode',
		 BBAR_BUTTON_CLICK  :'bbuttonclick',
		 CHILD_ACTIVATE 	:'childactivate',
		 CHILD_DEACTIVATE 	:'childdeactivate',
		 INITILIAZE_APP		:'INIT_APP',
		 INIT_APP			:'initapp', 	 
		 DESTROY_APP  		:'destroyapp',
		 AFTER_TEMPLATE_LOAD:'aftertemplateload',
		 BEFORE_TEMPLATE_LOAD:'beforetemplateload',
		 FORM_LOADED		:'loaded',
		 CBX_CHANGE			:'cbxchange',
		 CBX_CLICK			:'cbxclick',
		 DATA_LOAD			:'dataloaded',
		 CTAPPBEFOREINITIALIZE :'ctappbeforeinitialize',  //Changing Event Name
		 CTAPPONDESTROY			:'ctappondestroy',			 //Changing Event Name
		 FORM_INITIALIZE 	:'forminitialized',
		 FORM_BEFORE_INITIALIZE : 'formbeforeinitialize',
		 ROW_CLICK: 'rowclick',
		 ROW_DBLCLICK: 'rowdblclcik',
		 CELL_DBLCLICK: 'celldblclick',
		 BEFORE_LOAD: 'beforeload',
		 VERIFY_DATE : 'verifydate', 
		 BEFORE_DATA_LOAD: 'beforeDataLoad', //Added for local data store process
 		 AFTER_DATA_LOAD: 'afterDataLoad',	//Added for local data store process
		 ORG_TEMPLATE_INITIALIZER :'orgtemplateinitializer'  // Added for ORG view 
	};
	
	/**
	 * 
	 */
	CWEC=cbx.core.app.event.constants;

	/**
	 * @class "cbx.core.app.event.handler"	
	 * @description Is a Singleton class used for registering widget event handlers by the developer.
	 * The Framework classes and compoented will be wiring events to this class for recevicing
	 * appropriate handlers for widgets and executing them.
	 * @access public
	 * @example The developer will use the following construct to register an handler for a events for the widgets:
	 * <pre>
1.CWEH.registerHandler("WIDGET_ID", "CWEC.EVENTS", "function definition/ reference");
2.CWEH.registerHandler("WGT_INTERCO_LOAN", CWEC.CELL_CLICK, function(config){
});
	 *
	 * 
	 * */
	cbx.core.app.event.handler = function(){
		var _ob=null;
		return {
		  getInstance : function(){
			 if(_ob === null){
					_ob = { 
						/**
			    		 * Intended to register a Hanlder. 
			    		 * @param id - Handler id/name
			    		 * @param ob - Handler object needs to be registered
			    		 */
					   registerHandler:function(id, event,ob){
						_ob[id+"_"+event] = ob;	
					   },
					   /**
					    * Intended to return Handelr.
					    * @param id - Handler id/name
					    * @return ob - Handler object
					    * Note: if bundle object not already added for given handler id/name. 
					    * It would return empty object.
					    */
					   getHandler:function(id, event){
							var reOb =_ob[id+"_"+event];
							if (reOb != null) {
								return reOb;					  
							} else {
								return null;
							}
					  }						   
				   };
			 	}
			 	return _ob;
			}
		};
	}();
	/**
	 * @global
	 * @description CWEH can be used to to get the instanceof event handler. Please refer cbx.core.app.event.handler
	 * @access public
	 * @example
<pre>
//To be done
</pre>
	 * 
	 * */
	CWEH = cbx.core.app.event.handler.getInstance();
	/**
	 * @Method clone
	 * @memberof "cbx.core"
	 * @description Creates a shallow copy of the passed object.You can use cbx.clone as well
	 * @return {MixedCollection}
	 * */
	cbx.core.clone = function (o){
		if (!o || 'object' !== typeof o) {
			return o;
		}
		if ('function' === typeof o.clone) {
			return o.clone();
		}
		var c = '[object Array]' === Object.prototype.toString.call(o) ? [] : {};
		var p, v;
		for (p in o) {
			if (o.hasOwnProperty(p)) {
				v = o[p];
				if (v && 'object' === typeof v) {
					c[p] = cbx.core.clone(v);
				} else {
					c[p] = v;
				}
			}
		}
		return c;
	};
	/**
	 * @Method clone
	 * @memberof "cbx.core"
	 * @description Creates a shallow copy of the passed object.You can use cbx.core.clone as well
	 * @return {MixedCollection}
	 * */
	cbx.clone = cbx.core.clone;
	/**
	 * @class cbx.util.TaskRunner
	 * Provides the ability to execute one or more arbitrary tasks in a multithreaded
	 * manner.  Generally, you can use the singleton {@link cbx.TaskMgr} instead, but
	 * if needed, you can create separate instances of TaskRunner.  Any number of
	 * separate tasks can be started at any time and will run independently of each
	 * other. Example usage:
// Start a simple clock task that updates a div once per second
var getNetworkState = function(){
    LOGGER.info('NETWORKSTATE',canvas.env.network.getState());
} 
var task = {
    run: getNetworkState,
    interval: 3000 //3 second
}
var runner = new cbx.util.TaskRunner();
runner.start(task);
// equivalent using TaskMgr
cbx.TaskMgr.start({
    run: updateClock,
    interval: 1000
});
	 * @constructor
	 * @param {Number} interval (optional) The minimum precision in milliseconds supported by this TaskRunner instance
	 * (defaults to 10)
	 */
	cbx.util.TaskRunner = function(interval){
		interval = interval || 10;
		var tasks = [], 
		removeQueue = [],
		id = 0,
		running = false,
		// private
		stopThread = function(){
			running = false;
			clearInterval(id);
			id = 0;
		},
		// private
		startThread = function(){
			if(!running){
				running = true;
				id = setInterval(runTasks, interval);
			}
		},
		// private
		removeTask = function(t){
			removeQueue.push(t);
			if(t.onStop){
				t.onStop.apply(t.scope || t);
			}
		},
		// private
		runTasks = function(){
			var rqLen = removeQueue.length,
			now = new Date().getTime();	    			    		
			if(rqLen > 0){
				for(var i = 0; i < rqLen; i++){
					tasks.remove(removeQueue[i]);
				}
				removeQueue = [];
				if(tasks.length < 1){
					stopThread();
					return;
				}
			}	        
			for(var i = 0, t, itime, rt, len = tasks.length; i < len; ++i){
				t = tasks[i];
				itime = now - t.taskRunTime;
				if(t.interval <= itime){
					rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
					t.taskRunTime = now;
					if(rt === false || t.taskRunCount === t.repeat){
						removeTask(t);
						return;
					}
				}
				if(t.duration && t.duration <= (now - t.taskStartTime)){
					removeTask(t);
				}
			}
		};
		this.start = function(task){
			tasks.push(task);
			task.taskStartTime = new Date().getTime();
			task.taskRunTime = 0;
			interval=task.interval || interval;
			task.taskRunCount = 0;
			startThread();
			return task;
		};
		/**
		 * Stops an existing running task.
		 * @method stop
		 * @param {Object} task The task to stop
		 * @return {Object} The task
		 */
		this.stop = function(task){
			removeTask(task);
			return task;
		};
		/**
		 * Stops all tasks that are currently running.
		 * @method stopAll
		 */
		this.stopAll = function(){
			stopThread();
			for(var i = 0, len = tasks.length; i < len; i++){
				if(tasks[i].onStop){
					tasks[i].onStop();
					}
				}
			tasks = [];
			removeQueue = [];
		};
	};
	/**
	 * @class canvas.geoLocationParams
	 * @description This closure function  which holds the geolocation params which will used by canvas.env.location object
	 * The below params can be altered by the end applicaton developer accordingly.
	 */
	canvas.geoLocationParams = function() {
		/**
		 * Denotes the maximum age of a cached position that the application will be willing to accept. In milliseconds,
		 * with a default value of 0, which means that an attempt must be made to obtain a new position object
		 * immediately.
		 * 
		 * Can be altered.
		 */
		var maximumAge=3000;
		/**
		 * indicates the maximum length of time to wait for a response. In milliseconds with a default of 0 – infinite.
		 */
		var timeout=60000;
		/**
		 * provides a hint that the application would like the best possible results. This may cause a slower response
		 * time and in the case of a mobile device, greater power consumption as it may use GPS. Boolean with a default
		 * setting of false.
		 */
		var enableHighAccuracy=false;
		/**
		 * indicates the maximum length of time for task runner to run the task in queue for getting the geoLocator
		 * object for every certain time intervals. In milliseconds with default of 60000ms- 1min
		 */
		var interval=60000;
		/**
		 * Enabling geolocationTaskRunner. Boolean with a default setting of true.
		 */
		var taskEnabled=true;
		return {
			//getter Method for geoLocator Maximum Age
			getMaximumAge : function() {
				return maximumAge;
			},
			//getter Method for geoLocator timeout
			getTimeout : function() {
				return timeout;
			},
			//getter Method for geoLocator accuracy
			getAccuracy : function() {
				return enableHighAccuracy;
			},
			//getter Method for geoLocator interval
			getInterval: function() {
				return interval;
			},
			//getter Method for geoLocator task enabler
			getTaskEnabled: function() {
				return taskEnabled;
			},
			//setter Method for geoLocator Maximum Age
			setMaximumAge: function(age) {
				if(cbx.isNumber(age))
					maximumAge=age;
			},
			//setter Method for geoLocator timeout
			setTimeout : function(millisec) {
				if(cbx.isNumber(millisec))
					timeout=millisec;
			},
			//setter Method for geoLocator accuracy
			setAccuracy : function(accuracy) {
				if(cbx.isBoolean(accuracy))
					enableHighAccuracy=accuracy;
			},
			//setter Method for geoLocator interval
			setInterval : function(millisec) {
				if(cbx.isNumber(millisec))
					interval=millisec;
			},
			//setter Method for geoLocator task enabler
			setTaskEnabled : function(flag) {
				if(cbx.isBoolean(flag))
					taskEnabled=flag;
			}
		};
	}();
	/**
	 * @class canvas.core.storeReader
	 *        <p>
	 *        store reader reads store related objects from a JSON packet based on mappings in a provided
	 *        {@link canvas.core.Store}
	 *        </p>
	 *        <p><b><u>Automatic configuration using metaData</u></b>
	 *        </p>
	 *        <p>
	 *        It is possible to change a JsonReader's metadata at any time by including a <b><tt>metaData</tt></b>
	 *        property in the JSON data object. If the JSON data object has a <b><tt>metaData</tt></b> property, a
	 *        {@link cbx.core.Store} object using this Reader will reconfigure itself to use the newly provided record
	 *        definition</p>
	 *        <p>
	 *        Note that reconfiguring a Store potentially invalidates reader objects which may refer to Records which
	 *        no longer exist.
	 *        </p>
	 *        <p>
	 *        To use this facility you would create the reader like this inside the store
	 *        </p>
	 * 
	 * <pre><code>
	 * reader : {
	 * 				root : 'response.value.ALL_RECORDS',
	 * 				totalProperty : 'response.value.TOTAL_COUNT',
	 * 				additionalData : 'response.value.ADDITIONAL_DATA',
	 * 				idProperty : 'response.value.ADDITIONAL_DATA.UNIQUE_COLUMN'
	 * 			}
	 * </code></pre>
	 * 
	 * @param {Object} reader.
	 * @param {store}
	 */
	canvas.core.storeReader = function(reader, store){
		this.store=store;
		this.reader=reader;
			/**
		 * Creates a function to return some particular key of data from a response.
		 * 
		 * @param {String} key
		 * @return {Function}
		 * @private
			 * @ignore
			 */
			this.createAccessor = function() {
				var re = /[\[\.]/;
				return function(expr) {
					if (expr == undefined || expr == null) {
						return cbx.emptyFn;
					}
					if (cbx.core.isFunction(expr)) {
						return expr;
					}
					var i = String(expr).search(re);
					if (i >= 0) {
					return new Function('obj', 'try{return obj' + (i > 0 ? '.' : '') + expr+'}catch(err){return undefined;}');
					}
					return function(obj) {
					try{
						return obj[expr];
					}catch(err){
						return undefined;
					}
					};
				};
			}();
		canvas.core.extend(this, {
			//Reading the total property from the reader
			getTotal : this.createAccessor(this.reader.totalProperty),
			//Reading the root property from the reader to extract the whole data from the JSON response
			getRoot : this.createAccessor(this.reader.root),
			//Reading the additionlData property from the reader to extract the additionalData from JSON response
			getAdditionalData : this.createAccessor(this.reader.additionalData),
			//Reading the uniqueColumn property from the reader 
			getUniqueColumnName : this.createAccessor(this.reader.idProperty),
			//Setting the total count attribute on the store
			setTotalCount : function (count){
				this.store.totalAvailableRecords = count;
			}
		});
	};
	canvas.core.PHANTOM='CT-REC-';//Prefix before the record id
	/**
	 * @class canvas.core.Store
	 * @extends canvas.Observable
	 *          <p>
	 *          The Store class encapsulates a client side cache of record objects which provide input data for
	 *          Components who so over uses it
	 *          <p>
	 *          <u>Retrieving Data</u>
	 *          </p>
	 *          <p>
	 *          A Store object may access a data object using
	 *          <ul>
	 *          <li>{@link #proxy configured implementation} of {@link canvas.ajax}</li>
	 *          <li>{@link #loadRemoteData} to get the remote data</li>
	 *          </ul>
	 *          </p>
	 *          <p>
	 *          <u>Reading Data</u>
	 *          </p>
	 *          <p>
	 *          A Store object has inherent knowledge of the format of the data object (it could be JSON). A Store
	 *          object uses an appropriate {@link #reader configured implementation} of a {@link cbx.core.storeReader}
	 *          to create records from the data object.
	 *          </p>
	 *          <p>
	 *          <u>Configuring Store </u>
	 *          </p>
	 *           <p>
	 *           The Store class encapsulates a client side local data cache of Model objects if dataController enabled see
	 *           <ul>
	 *          <li>{@link #dataController} of {@link canvas.core.StoreDataController}</li>
	 *          </ul>
	 *          This is more useful for enabling a web site or web application to function without a network connection 
	 *           </p>
	 * 
	 * <pre><code>
	 * var myStore = new canvas.core.Store({
	 * 	params : generatedParams, //Generated Params 
	 * 	listeners : {
	 * 		'load' : function (records, aditionalData)
	 * 		{
	 * 		},
	 * 		'beforeload' : function ()
	 * 		{
	 * 		},
	 * 
	 * 	},
	 * 	scope : scopeHandler, //ScopeHandler
	 * 	containerId : scopeHandler.widgetID, //Unique Id
	 * 	dataController : true, //Enabling Local Data Cache to customize data
	 * 	id : 'store-' + scopeHandler.widgetID,
	 * 	accumulate : scopeHandler.accumulate || false, // scrollable pagination or Default  
	 * 	autoLoad : true, // loadData invoke automatically
	 * 	//Reader Configurations
	 * 	reader : {
	 * 		root : 'response.value.ALL_RECORDS',
	 * 		totalProperty : 'response.value.TOTAL_COUNT',
	 * 		additionalData : 'response.value.ADDITIONAL_DATA',
	 * 		idProperty : 'response.value.ADDITIONAL_DATA.UNIQUE_COLUMN'
	 * 	},
	 * 	bufferSize : scopeHandler.parsedNoOfRecs
	 * //Records per page
	 * 			});
	 * </code></pre>
	 */
	canvas.core.Store = Class(canvas.Observable, {
		/**
		 * The constructor of this class
		 */
		constructor : function(config) {
			//By default accumulate true means scrollable pagination or Clicking more records on any store enabled component
			this.accumulate = true;
			this.completeDataCtrlDetails=false;
			canvas.apply(this, config);
			canvas.core.Store.$super.call(this);
			this.selectedDataMap={};
			this.removeUpdatedDataMap={};
			this.removeUpdatedData=[];
			this.processedGroupedData=[];
			this.checkedDataMap= {};
			//Listener Bindings
			if (config.listeners) {
				for (k in config.listeners) {
					if (config.listeners[k] != null && cbx.core.isFunction(config.listeners[k])) {
						this.registerListener(k, config.listeners[k], config.scope);
					}
				}
			}
			this.start = 0;
			this.loadedOnce = false;
			this.records = [];
			this.totalAvailableRecords = 0;
			//Reader Configuration
			this.dataReader= new cbx.core.storeReader(this.reader,this);
			var that=this;
			this.getId = function(rec) {
				var r =that.uniqueColumn(rec);
				return (r === undefined || r === '') ? rec.REC_CURR : r;
			}; 
			this.getUniqueId = function(rec) {
				var r =that.uniqueColumn(rec);
				return (r === undefined || r === '') ? "" : r;
			}; 
			if(!cbx.isEmpty(this.bufferSize)){
				this.params.limit=parseInt(this.bufferSize)-1;
			}			
			this.syncMode=true;//To enable or disable loadMask on data load
			this.scope.store=this;//Explicitly made store scope due to avoid mismatch between component scope agree to be weird stuff.
			this.consolidatedRecords=[];
			//Enabling Data controller if provided as store configuration for enabling the data caching
			if(this.containerId && this.dataController)
				this.dataController= new cbx.core.StoreDataController({store:this});
			//If autoLoad config is true then load data automatically
			if (this.autoLoad) {
				if(cbx.isDefined(this.dataController))				
					this.loadDataViaController({callBack:this.controllerProcessedData,proxyCaller:this.loadRemoteData});
				else
					this.loadRemoteData();	
			}
		},
		/**
		 * @Method loadDataViaController
		 * @memberof "canvas.core.Store"
		 * @description Invoked When data controller is enabled true for store
		 * @access public
		 * @param {Object} obj This is for loading controlled data(local&remote).
		 */
		loadDataViaController:function(obj){
			this.dataController.loadData(obj);
		},
		/**
		 * @Method loadPaginatedControllerData
		 * @memberof "canvas.core.Store"
		 * @description Invoked by the component to get the paginated controlled data which is enabled for only
		 *              scrolling pagination
		 * @access public
		 */
		loadPaginatedControllerData:function(){
			this.syncMode=true;
			if(cbx.isDefined(this.dataController))	{
				this.loadDataViaController({proxyCaller:this.loadRemoteData,paginationTriggered:true,callBack:this.controllerProcessedData});
			}
			else{
				this.loadRemoteData();	
			}
		},
		/**
		 * @Method reload
		 * @memberof "canvas.core.Store"
		 * @description Reloads the store data and reinitiliazes the store attributes
		 * @access public
		 */
		reload : function() {
			this.records = [];
			this.consolidatedRecords=[];
			this.processedGroupedData-[];
			this.totalAvailableRecords = 0;
			this.loadedOnce = false;
			this.syncMode=true;
			this.start = 0;
			if(cbx.isDefined(this.dataController))	{
				this.loadDataViaController({callBack:this.controllerProcessedData,proxyCaller:this.loadRemoteData});
			}
			else{
				this.loadRemoteData();	
			}
		},		  
		/**
		 * @Method loadRemoteData
		 * @memberof "canvas.core.Store"
		 * @description Loading the data from the server,this will be used for both data controller enabled/Disabled
		 *              store. For data controller enabled case this below function will be used as callback to load the
		 *              local data cache either accumulating the local record with server record.
		 * @access public
		 * @param {Object} obj This has a controller callback object param, once loading the remote data,the same will
		 *            be propagted to controllerProcessData method for additional processings else to continue with ethe
		 *            normal flow.
		 */
		loadRemoteData : function(obj) {
			var loadDataFlag = true;
			if (this.loadedOnce === true && this.totalAvailableRecords <= this.bufferSize) {
				loadDataFlag = false;
			}
			if (this.loadedOnce === true && this.start >= this.totalAvailableRecords) {
				loadDataFlag = false;
			}
			if (loadDataFlag === false) {
				/**
				 * @event load Fires after a new set of Records has been loaded.
				 * @param Empty Array
				 */
				this.raiseEvent('load', []);
				return false;
			}
			var self = this;
			var o={
						type : 'json',
						method : 'POST',
						beforeLoad : function(config) {
							//Kept Empty Not Needed As of Now
						},
						afterLoad : function() {
							//Brutally Overriden By Ajax
						},
						params : this.getParams(),
						success : function(result) {
							self.loadedOnce = true;
							if(cbx.isDefined(self.dataController) && cbx.isObject(obj) && cbx.isFunction(obj.cb)){
								var scope=obj.scope || self.dataController;
								obj.cb.apply(scope,[result,self.controllerProcessedData]);								
							}else{
								self.processData(result);
							}
						}
			};
			if(!this.syncMode){
				o.syncMode=false
			}
			var params={};
			/**
			 * @event beforeload Fires before a request is made for a new data object. If the beforeload handler returns
			 *        <tt>false</tt> the load action will be canceled.
			 * @param {Object} storeParams
			 */
			var doRequest =self.raiseEvent('beforeload', params);
			if (doRequest !== false) {
				cbx.applyIf(params, this.getParams());	
				o.params=params;
				cbx.ajax(o);
			}	
		},
		/**
		 * @Method processData
		 * @memberof "canvas.core.Store"
		 * @description Create a data block containing records from a JSON object which uses store reader to extract the
		 *              records
		 * @access public
		 * @param {Array} data This list of records
		 */
		processData : function(data) {
			var newRecords = [];
			try {
				newRecords = this.dataReader.getRoot(data);
				var recCurr = this.start;;
				for ( var i = 0, len = newRecords.length; i < len; i++) {
					newRecords[i].REC_CURR = recCurr++;
					newRecords[i].REC_ID = cbx.core.PHANTOM+cbx.id();
				}
				this.additionalData = this.dataReader.getAdditionalData(data);
				this.colId= this.dataReader.getUniqueColumnName(data);
				this.uniqueColumn= this.dataReader.createAccessor(this.colId);
				if (newRecords.length > 0) {
					this.totalAvailableRecords = this.dataReader.getTotal(data);
					if (this.accumulate === false) {
						this.records = newRecords;
						this.start=this.params.start=this.start+this.getCount();
					} else {
						this.records = this.records.concat(newRecords);
						this.start = this.params.start=this.getCount();
					}
				}
			} catch (e) {
				LOGGER.error("Error occured in store processing data : "+ data, e);
			}
			/**
			 * @event load Fires after a new set of Records has been loaded.
			 * @param records The Records that were loaded
			 * @param {Object} additionalData
			 */
			this.raiseEvent('load', this.records,this.additionalData,newRecords);
		},
		/**
		 * @Method controllerProcessedData
		 * @memberof "canvas.core.Store"
		 * @description Create a data block containing records from a JSON object which uses store reader to extract the
		 *              records
		 * @access public
		 * @param {Array} data This list of records
		 * @param {Boolean} localDataFlag If this is true merges Whole consolidated data if available with current received data
		 * @param {Boolean} remoteDataFlag If this is true merges local data with current received data
		 */
		controllerProcessedData : function(data,localDataFlag,remoteDataFlag) {
			var newRecords = [];
			try {
				newRecords = this.dataReader.getRoot(data);
				var recCurr = this.records.length;
				if(localDataFlag){
					this.localDataRecords=newRecords;
				}
				this.additionalData = this.dataReader.getAdditionalData(data);
				this.colId= this.dataReader.getUniqueColumnName(data);
				this.uniqueColumn= this.dataReader.createAccessor(this.colId);
				if (newRecords.length > 0) {
					if(localDataFlag){
						if(this.consolidatedRecords.length==0){
							this.consolidatedRecords=this.consolidatedRecords.concat(newRecords);
						}else{
							this.consolidatedRecords=this.dataController.dataMergeLocalOnPriority(this.consolidatedRecords,newRecords);	
						}
					}else if(remoteDataFlag){
						this.totalAvailableRecords = this.dataReader.getTotal(data);
						if (this.accumulate === false) {
							this.records = newRecords;
						}else{
							this.records=this.records.concat(newRecords);
						}
						var clonedRecords=[].concat(this.records);
						this.consolidatedRecords=this.dataController.dataMerging(clonedRecords);
					}
					this.consolidatedRecords=this.addUniqueRecAttributes(this.consolidatedRecords);
					if (this.accumulate === false) {
						this.start=this.params.start=this.start+this.getCount();
					}else{
						this.start = this.params.start=this.getCount();		
					}
				}
			} catch (e) {
				LOGGER.error("Error occured in store processing data : "+ data, e);
			}
			/**
			 * @event load Fires after a new set of Records has been loaded.
			 * @param records The Records that were loaded
			 * @param {Object} additionalData
			 */
			if(this.completeDataCtrlDetails){
			this.raiseEvent('load', this.consolidatedRecords,this.additionalData,newRecords,this.dataController.dataMerging([].concat(newRecords)),localDataFlag,remoteDataFlag);
			}
			else{
			this.raiseEvent('load', this.consolidatedRecords,this.additionalData,'','',localDataFlag,remoteDataFlag)	
			}
		},
		/**
		 * @Method addUniqueRecAttributes
		 * @memberof "canvas.core.Store"
		 * @description Adds the Record index and id to the records to get the records based on these attributes.
		 * @access public
		 * @param {Array} data This list of records
		 * @return {Array} records in form of object
		 */
		addUniqueRecAttributes:function(recs){
			var recCurr=0;
			if(cbx.isArray(recs)){
				for(var i=0,len=recs.length;i<len;i++){
					recs[i]['REC_CURR']=recCurr++;
					recs[i]['REC_ID'] = cbx.core.PHANTOM+cbx.id();
				}
			}
			return recs;
		},
		/**
		 * @Method updateParams
		 * @memberof "canvas.core.Store"
		 * @description Applies the params with the existing store params.
		 * @access public
		 * @param {Object} params
		 */
		updateParams:function(params){
			if(!cbx.isEmpty(params) && cbx.isObject(params)){
				cbx.core.extend(this.getParams(), params);
			}
		},
		/**
		 * @Method getParams
		 * @memberof "canvas.core.Store"
		 * @description Getting the store params
		 * @access public
		 * @return {Object} params
		 */
		getParams : function() {
			var params = this.params;
			if (cbx.isEmpty(params.start)) {
				cbx.apply(params, {
					start : this.start
				});
			}
			return params;
		},
		/**
		 * @Method getCount
		 * @memberof "canvas.core.Store"
		 * @description Gets the number of records.
		 *              <p>
		 *              If using paging, this may not be the total size of the dataset. If the data object used by the
		 *              Reader contains the dataset size
		 *              </p> 
		 * @access public
		 * @return {Number} The number of Records in the Store's cache.
		 */
		getCount : function() {
			return this.records.length;
		},
		/**
		 * @Method getTotalCount
		 * @memberof "canvas.core.Store"
		 * @description Gets the total number of records in the dataset as returned by the server.
		 *              <p>
		 *              If using paging, for this to be accurate, the data object used by the canvas.store.reader must
		 *              contain the dataset size. For remote data sources, the value for this property (<tt>totalProperty</tt>
		 *              extracted from canvas.store.reader} 
		 * @access public
		 * @return {Number} The number of Records as specified in the data object passed to the Reader by the
		 *         Proxy(canvas.ajax).
		 */
		getTotalCount : function() {
			return (this.totalAvailableRecords || this.records.length);
		},
		/**
		 * @Method getRecords
		 * @memberof "canvas.core.Store"
		 * @description Gets an array of the records
		 * @access public
		 * @return {Array} records in form of object
		 */
		getRecords : function() {
			return this.records;
		},
		/**
		 * @Method getGroupedRecords
		 * @memberof "canvas.core.Store"
		 * @description Gets an array of the records in grouped fashion
		 * @access public
		 * @return {Array} grouped records in form of object
		 */	
		getGroupedRecords:function(groupName){
			if(!cbx.isEmpty(groupName)){
				var records=this.records
				if(cbx.isDefined(this.dataController))	{
					records=this.consolidatedRecords;
				}
				this.processedGroupedData = records.groupBy(groupName) || [];;
				return this.processedGroupedData;
			}
			return [];
		},
		/**
		 * @Method getGroupedRecordByIndex
		 * @memberof "canvas.core.Store"
		 * @description Get the grouped record at the specified index.
		 * @access public
		 * @param {Number} index The index of the Record to find.
		 * @return {Object} The Record at the passed index. Returns empty array if not found.
		 */
		getGroupedRecordByIndex:function(index){
			return  this.processedGroupedData[index] || [];
		},
		/**
		 * @Method getAt
		 * @memberof "canvas.core.Store"
		 * @description Get the Record at the specified index.
		 * @access public
		 * @param {Number} index The index of the Record to find.
		 * @return {Object} The Record at the passed index. Returns undefined if not found.
		 */	
		getAt : function(index) {
			var records=this.records
			if(cbx.isDefined(this.dataController))	{
				records=this.consolidatedRecords;
			}
			return records[index];
		},
		/**
		 * @Method getById
		 * @memberof "canvas.core.Store"
		 * @description Get the Record with the specified id.
		 * @access public
		 * @param {String} id The id of the Record to find.
		 * @return {Object} The Record with the passed id. Returns empty string if not found.
		 */		
		getById : function(id) {
			var records=this.records
			if(cbx.isDefined(this.dataController))	{
				records=this.consolidatedRecords;
			}
			var record='';
			for(var i=0;i<records.length;i++){
				if(records[i]['REC_ID']==id){
					record=records[i];
					break;	
				}	
			}
			return record || '';
		},
		/**
		 * @Method isSelectedDataExistsByRec
		 * @memberof "canvas.core.Store"
		 * @description checks whether the selected data exists by record.
		 * @access public
		 * @param {Number} index The index of the Record to find selected data exits.
		 * @return {Boolean}  Returns boolean true if selected data exists else false.
		 */
		isSelectedDataExistsByRec:function(index){
			var rec=this.getAt(index);
			if(!cbx.isEmpty(this.getUniqueId(rec))){
				if(!cbx.isEmpty(this.selectedDataMap[this.getId(rec)])){
					return true;
				}
			}
			return false;
		},
		/**
		 * @Method removeEntireSelectedData
		 * @memberof "canvas.core.Store"
		 * @description Re-Initiliazing selected data map.
		 * @access public
		 */	
		removeEntireSelectedData:function(){
			this.selectedDataMap={};
		},
		/**
		 * @Method getSelections
		 * @memberof "canvas.core.Store"
		 * @description Returns the selected records(Method Applies only for checkbox selection model records) 
		 * @access public
		 * @return {Array} Array of selected records
		 */
		getSelections:function(){
			var rec=[];
			if(!cbx.isEmpty(this.selectedDataMap)){
				for(var i in this.selectedDataMap){
					rec.push(this.selectedDataMap[i]);
				}
			}
			if(!cbx.isEmpty(this.removeUpdatedDataMap)){
				for(var i in this.removeUpdatedDataMap){
					rec.push(this.removeUpdatedDataMap[i])
				}
			}
			return rec;
		},
		/**
		 * @Method getExactSelections
		 * @memberof "canvas.core.Store"
		 * @description Returns the checked (Method Applies only for checkbox selection model records)
		 * @access public
		 * @return {Array} Array of checked records
		 */
		getExactSelections:function(){
			var rec=[];
			if(!cbx.isEmpty(this.selectedDataMap)){
				for(var i in this.selectedDataMap){
					if(this.selectedDataMap[i]["CHECKED"]==true){
					rec.push(this.selectedDataMap[i])
					}
				}
			}
			if(!cbx.isEmpty(this.removeUpdatedDataMap)){
				for(var i in this.removeUpdatedDataMap){
					if(this.removeUpdatedDataMap[i]["CHECKED"]==true){
					rec.push(this.removeUpdatedDataMap[i])
					}
				}
			}
			return rec;
		},
		/**
		 * @Method addSelectedData
		 * @memberof "canvas.core.Store"
		 * @description Adding the specific record object(Method Applies only for checkbox selection model records) 
		 * @access public
		 * @param {Number} index The index of the Record to find.
		 */
		addSelectedData:function(index) {
			var rec=this.getAt(index);
			var recId=this.getId(rec);
			this.selectedDataMap[recId]=rec;
			this.selectedDataMap[recId]["CHECKED"]=true;
			for(var i = 0;i<this.removeUpdatedData.length; i++) {
			    if(this.removeUpdatedData[i] === this.getId(rec)) {
			       delete this.removeUpdatedData[i];
			       delete this.removeUpdatedDataMap[this.getId(rec)];
			       break;
			    }
			}
		},
		/**
		 * @Method addSelectedDataOnFly
		 * @memberof "canvas.core.Store"
		 * @description Get the grouped record at the specified index(Method Applies only for checkbox selection model records) 
		 * @access public
		 * @param {Number} index The index of the Record to find.
		 * @return {Boolean} The Record at the passed index. Returns empty array if not found.
		 */
		addSelectedDataOnFly:function(index) {
			index=parseInt(index);
			var rec=this.getAt(index);
			if(!this.removeUpdatedData.contains(this.getId(rec))){	
				var recId=this.getId(rec);
				this.selectedDataMap[recId]=rec;
				this.selectedDataMap[recId]["CHECKED"]=true;
				return true;
			} else {
				return false;
			}
		},
		/**
		 * @Method removeSelectedData
		 * @memberof "canvas.core.Store"
		 * @description Removing the selected data(Method Applies only for checkbox selection model records) 
		 * @access public
		 * @param {Number} index The index of the Record to find.
		 * @param {Boolean} flag The flag true which indicates removed record is stored in separate object
		 */
		removeSelectedData:function(index,flag) {
			var rec=this.getAt(index);
			delete this.selectedDataMap[this.getId(rec)];
			if(flag){
				var recId=this.getId(rec);
				this.removeUpdatedData.push(recId);
				this.removeUpdatedDataMap[recId]=rec;
				this.removeUpdatedDataMap[recId]["CHECKED"]=false;
			}
		},
		/**
		 * @Method removeSelectedDataUniqueExists
		 * @memberof "canvas.core.Store"
		 * @description Removing the selected data based on record id(Method Applies only for checkbox selection model records)
		 * @access public
		 * @param {Number} index The index of the Record to find.
		 * @param {Boolean} flag The flag true which indicates removed record is stored in separate object
		 */
		removeSelectedDataUniqueExists:function(index,flag) {
			var rec=this.getAt(index);
			if(!cbx.isEmpty(this.getuniqueId(rec))){
				delete this.selectedDataMap[this.getId(rec)];
				if(flag){
					var recId=this.getId(rec);
					this.removeUpdatedData.push(recId);
					this.removeUpdatedDataMap[recId]=rec;
					this.removeUpdatedDataMap[recId]["CHECKED"]=false;
				}
			}
		},
		/**
		 * @Method getSelectedData
		 * @memberof "canvas.core.Store"
		 * @description Getting the checked record objects(Method Applies only for checkbox selection model records)
		 * @access public
		 * @return {Object} The Recordobjects. Returns empty object if not found.
		 */
		getSelectedData:function(){
			return this.selectedDataMap;
		},
		/**
		 * @Method getCheckedDataArray
		 * @memberof "canvas.core.Store"
		 * @description Get the grouped record at the specified index.(Method Applies only for checkbox selection model records) 
		 * @access public
		 * @return {Object} The List of records. Returns empty array if not found.
		 */
		getCheckedDataArray:function(){
			var rec=[];
			if(!cbx.isEmpty(this.checkedDataMap)){
				for(var i in this.checkedDataMap){
					rec.push(this.checkedDataMap[i]);
				}
			}
			return rec;
		},
		/**
		 * @Method addCheckedData
		 * @memberof "canvas.core.Store"
		 * @description Adding the record to checked data object, this method used while checking pagination
		 *              records(Method Applies only for checkbox selection model records)
		 * @access public
		 * @param {Number} page_no,
		 * @param {Number} index
		 */
		addCheckedData:function(page_no, index) {
			var rec=this.getAt(index);
			var recId=this.getId(rec);
			var key = page_no + '' + index;
			this.checkedDataMap[key]=rec;
			this.checkedDataMap[key]["CHECKED"]=true;
		},
		/**
		 * @Method isDataCheckedByPageIndex
		 * @memberof "canvas.core.Store"
		 * @description Get the checked record at the page level index(Method Applies only for checkbox selection model
		 *              records)
		 * @access public
		 * @param {Number} page_no
		 * @param {Number} index
		 * @return {Boolean} Returns the flag true if the data checked by the page no and index
		 */
		isDataCheckedByPageIndex:function(page_no, index) {
			index=parseInt(index);
			var key = page_no + '' + index;
			var flag = false;
			if(key in this.checkedDataMap) {
				if(this.checkedDataMap[key]["CHECKED"] == true) {
					flag = true;
				}
			}
			return flag;
		},
		/**
		 * @Method removeCheckedData
		 * @memberof "canvas.core.Store"
		 * @description Removing the checked data
		 * @access public
		 * @param {Number} page_no
		 * @param {Number} index T
		 */
		removeCheckedData:function(page_no, index) {
			var key = page_no + '' + index;
			if(key in this.checkedDataMap) {
				delete this.checkedDataMap[key];
			}
		},
		/**
		 * @Method getCheckedDataCount
		 * @memberof "canvas.core.Store"
		 * @description Getting checked data count
		 * @access public
		 * @param {Number} page_no
		 * @return {Boolean} This returns true when the total count and checked record matches
		 */
		getCheckedDataCount: function(page_no) {
			var key = '';
			var j = 0, count = this.getCount();
			for(var i = 0; i < count; i++) {
				key = page_no + '' + i;
				if(key in this.checkedDataMap) {
					if(this.checkedDataMap[key]["CHECKED"] == true) {
						j++;
					}
				}
			}
			if(j == count) {
				return true;
			} else {
				return false;
			}				
			}

			});

	
	cbx.resetContent = function() {
		var resetCounter=0;
		return {
			getCounter : function() {
				return resetCounter;
			},
			setCounter : function() {
				resetCounter++;
			}
		};
	}();
	/**
	 * @Method LoadMask
	 * @memberof "canvas.core.Store"
	 * @description Get the grouped record at the specified index.
	 * @access public
	 * @return {Object} The Record at the passed index. Returns empty array if not found.
	 */
	cbx.LoadMask = function() {
		var counter=0;
		return {
			show : function() {
				
			},
			hide : function() {
				
			}
		};
	}();
	/**
	 * @Method cbx_app_service_handler
	 * @memberof "canvas.core.Store"
	 * @description Get the grouped record at the specified index.
	 * @access public
	 * @return {Object} The Record at the passed index. Returns empty array if not found.
	 */
	cbx_app_service_handler = function(){
		var _sl=null;
		return {
	      getInstance : function(){
						 if(_sl === null){
							 _sl = { 
						    		//Intended to register a Hanlder. 
						    		//@param id - Handler id/name
						    		//@param ob - Handler object needs to be registered
								   registerHandler:function(id, service,ob){
								   	if(!_sl.hasOwnProperty(id)){
								   		_sl[id]={};
								   	}
							   		_sl[id][service] = ob;
								   },
								   getServiceList : function(id){
									   return _sl[id];
								   }
						   };
						 }
						 return _sl;
	      				}
			};
	}();
	CWSH = cbx_app_service_handler.getInstance();
	
	/**
	 * @namespace "cbx.core.multiapp"
	 * @access private
	 * 
	 * */
	cbx.ns('cbx.core.multiapp');
	cbx.ns('cbx.core.multiapp.model');
	/**
	 * @class "cbx.core.multiapp.model"
	 * @access private 
	 * 
	 * */
	cbx.core.multiapp.model = function (){
		var mwRegistry = {};
		var requestQueue = {};
		return {
			/**
			 * @Method getMultiAppMetadata
			 * @memberof "cbx.core.multiapp.model"
			 * @description Gets the metadata for the widget / app.
			 * @access private
			 * @param widgetId
			 * @param versionNo
			 * @param successHandler callback handler when ajax call is succeeds
			 * @param handlerScope scope at which the handler needs to be executed.
			 * 
			 */
			getMultiAppMetadata : function (widgetId, versionNo, successHandler, handlerScope){
				if (mwRegistry[widgetId] != null) {
					successHandler.apply(handlerScope, [ mwRegistry[widgetId] ]);
				} 
				else {
					var cachedFlag=false;
					var self=this;
					/**
					 * Reusable data retreival utility function ,Checking the MULTI_WIDGET metadata type for the
					 * corresponding widgetId param from the local store which prefers SQL-Lite database in case of
					 * hybrid mode else browser supported database if enabled or browser supported local storage or
					 * global storage follows in this sequence for execution.If the local cached data is available then
					 * the metadata is loaded from the local cache .If the local cached data is not
					 * available(Empty/Error/None of the above Storages supported) then the metadata is fetched from
					 * server. This local store metadata fetching is made async due to database transaction result set
					 * retreivals are designed in async manner but need not be for other storages(local/global) but
					 * still following the same for coherence.
					 * 
					 * @param {String} metadata type
					 * @param widgetId
					 * @param {Function} callback handler for fetching the metadata from local store.
					 */
					canvas.metadata.getMetaData("MULTI_WIDGET",widgetId,function(metadatavalue){
						if(!cbx.isEmpty(metadatavalue)){
							try{
								var cachedMetadata=cbx.decode(metadatavalue);
								cachedFlag=true;
								mwRegistry[widgetId] = new cbx.core.app.metadata(cachedMetadata);
								mwRegistry[widgetId].setVersionNo(versionNo);
								setTimeout(function(){
									successHandler.apply(handlerScope, [ mwRegistry[widgetId] ]);
								},100); 
								return;
							}
							catch (e) {
								LOGGER.error('Error while fetching Widget Metadata cached data', e);
								cachedFlag=false;
							}
						}
						if(!cachedFlag){						
					var params = {
						INPUT_ACTION : "INIT_MULTI_HEADER_ACTION",
						PAGE_CODE_TYPE : 'VDF_CODE',
						PRODUCT_NAME : "CUSER",
						INPUT_FUNCTION_CODE : "VSBLTY",
						INPUT_SUB_PRODUCT : "CUSER",
						__LISTVIEW_REQUEST : 'Y',
						INPUT_PRODUCT : "CUSER",
						INPUT_LANGUAGE_ID : 'en_US',
						WIDGET_ID : widgetId,
						VER_NO : versionNo
					};
					cbx.ajax({
						params : params,
						success : function (metadata){
							mwRegistry[widgetId] = new cbx.core.app.metadata(metadata.response.value);
							mwRegistry[widgetId].setVersionNo(versionNo);
							successHandler.apply(handlerScope, [ mwRegistry[widgetId] ]);
									/**
									 * Reusable data retreival utility function for storing the server fetched metadata
									 * in to the local store with a time out of 100 ms, metadata will be stored only if
									 * the local store exists and this will be used later for the retreival process on
									 * necessity. This is more like persisting data to load the application faster on
									 * next visit and too for enabling a web site or web application to function without
									 * a network connection
									 * 
									 * @param {String} MULTI_WIDGET metadata type
									 * @param {Object} The object which hold widgetId,received server
									 *            responseValue,server responseTime
									 */
									setTimeout(function(){
										try{
											canvas.metadata.storeMetaData("MULTI_WIDGET",{id:widgetId,value:metadata.response.value,serverdatetime:metadata.HEADER_VALUE.TXN_PROCESS_DATE_TIME});
						}
										catch (e) {
											LOGGER.error('Error while storing Widget Metadata cache', e);
										}
									},100);
									//Looping child widgets for the multiwidget which will store the widgets metadata response value.
									setTimeout(function(){
										try{
											var responseValue=metadata.response.value;
											if(responseValue.CHILD_WIDGETS && responseValue.CHILD_WIDGETS.length>0){
												responseValue=responseValue.CHILD_WIDGETS;
												for(var CW=0;CW<responseValue.length;CW++){
													if(!cbx.isEmpty(responseValue[CW].WIDGET_ID)){														
														cbx.core.app.model.getAppMetadata(responseValue[CW].WIDGET_ID, 1, cbx.emptyFn, self,true,false,false);	
													}
												}
											}
										}
										catch (e) {
											LOGGER.error('Error while storing Multi Widget child Widget Metadata  cache', e);
										}
									},200);
								}
					});
				}
					},this);
			}
			},
			getMultiWidgetBaseMeta : function (widgetId){
				var cachedMetadata=canvas.metadata.getMetaData("WIDGET_MD",widgetId,function(metadatavalue){
					if(cbx.isEmpty(metadatavalue)){
						cbx.ajax({
							params : {
								INPUT_ACTION : "GET_WIDGET_MD",
								INPUT_FUNCTION_CODE : "VSBLTY",
								INPUT_SUB_PRODUCT : "CUSER",
								INPUT_PRODUCT : "CUSER",
								PAGE_CODE_TYPE : "VDF_CODE",
								PRODUCT_NAME : "CUSER",
								WIDGET_ID : widgetId
							},
							syncMode:false,
							failureMessage:false,
							success : function(metadata){
	/**
								 * Reusable data retreival utility function for storing the server fetched metadata in
								 * to the local store with a time out of 100 ms, metadata will be stored only if the
								 * local store exists and this will be used later for the retreival process on
								 * necessity. This is more like persisting data to load the application faster on next
								 * visit and too for enabling a web site or web application to function without a
								 * network connection
	 * 
								 * @param {String} WIDGET_MD metadata type
								 * @param {Object} The object which hold widgetId,received server responseValue,server
								 *            responseTime
	 */
	
								setTimeout(function(){
									try{
										canvas.metadata.storeMetaData("WIDGET_MD",{id:widgetId,value:metadata,serverdatetime:metadata.HEADER_VALUE.TXN_PROCESS_DATE_TIME});
		}
									catch (e) {
										LOGGER.error('Error while storing child Widget Metadata cache', e);
		}
								},100);


				}
						});
			}
				});
		}
	};
	}();
	/**
	 * 
	 */
	MW = cbx.core.multiapp.model;
	/**
	 * @Method dynamicSort
	 * @memberof "Array"
	 * */
	Array.prototype.dynamicSort = function(property){
	return this.sort(cbx.core.getDynamicArraySorter(property));
};
cbx.applyIf(String, {
    /**
     * Escapes the passed string for ' and \
     * @param {String} string The string to escape
     * @return {String} The escaped string
     * @access private
     */
    escape : function(string) {
        return string.replace(/('|\\)/g, "\\$1");
    },
    /**
     * Pads the left side of a string with a specified character.  This is especially useful
     * for normalizing number and date strings.  Example usage:
     * <pre><code>
var s = String.leftPad('123', 5, '0');
// s now contains the string: '00123'
     * </code></pre>
     * @param {String} string The original string
     * @param {Number} size The total length of the output string
     * @param {String} char (optional) The character with which to pad the original string (defaults to empty string " ")
     * @return {String} The padded string
     * @access private
     */
    leftPad : function (val, size, ch) {
        var result = String(val);
        if(!ch) {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result;
    }
});
/**
 * @Method getDynamicArraySorter
 * @memberof "cbx.core"
 * @access public
 * @todo Please finish this documentation
 * */
cbx.core.getDynamicArraySorter = function(property){
	 var sortOrder = 1;
	    if(property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1);
	    }
	    return function (a,b) {
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    }
};
/**
 * @Method showErrorWin
 * @memberof "cbx.core"
 * @description To show the error window
 * @access public
 * @param {String} The message key which is there in the framework bundle or the direct message after retreiving from any bundle.
 * */
cbx.core.showErrorWin = function(msg){
	var rb = CRB.getFWBundle();
	var errorbundle = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),'SYSERROR');
	var message =  msg ||errorbundle ;
	var errWin = new iportal.Dialog({
		dialogType : 'ERROR',
		message : message,
		okHandler : function(){
			errWin.close();
		},
		title : rb['LBL_ERROR']
	});
	errWin.show();
};


/**
 * The Object.keys property is supported in IE >= 9
 * Hence defining the same for IE < 9 browsers.
 * Need to be moved to prototype and prototype needed to be moved to core.
 * 
 */
if (typeof Object.keys !== "function") {
    (function() {
        Object.keys = Object_keys;
        function Object_keys(obj) {
            var keys = [], name;
            for (name in obj) {
                if (obj.hasOwnProperty(name)) {
                    keys.push(name);
                }
            }
            return keys;
        }
    })();
};

}());





var JSON = JSON || {};

//implement JSON.stringify serialization
JSON.stringify = JSON.stringify || function (obj) {

var t = typeof (obj);
if (t != "object" || obj === null) {

 // simple data type
 if (t == "string") obj = '"'+obj+'"';
 return String(obj);

}
else {

 // recurse array or object
 var n, v, json = [], arr = (obj && obj.constructor == Array);

 for (n in obj) {
     v = obj[n]; t = typeof(v);

     if (t == "string") v = '"'+v+'"';
     else if (t == "object" && v !== null) v = JSON.stringify(v);

     json.push((arr ? "" : '"' + n + '":') + String(v));
 }

 return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
}
};

//implement JSON.parse de-serialization
JSON.parse = JSON.parse || function (str) {
if (str === "") str = '""';
eval("var p=" + str + ";");
return p;
};


function error_handler(params){
	this.params=params;
	this.handle_error=function(json_data){
		LOGGER.error("This is a error message :::: "+json_data);
	}
}
if (!Array.prototype.filter) {
	  Array.prototype.filter = function(fun/*, thisArg*/) {
	    'use strict';

	    if (this === void 0 || this === null) {
	      throw new TypeError();
	    }

	    var t = Object(this);
	    var len = t.length >>> 0;
	    if (typeof fun !== 'function') {
	      throw new TypeError();
	    }

	    var res = [];
	    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
	    for (var i = 0; i < len; i++) {
	      if (i in t) {
	        var val = t[i];

	        // NOTE: Technically this should Object.defineProperty at
	        //       the next index, as push can be affected by
	        //       properties on Object.prototype and Array.prototype.
	        //       But that method's new, and collisions should be
	        //       rare, so use the more-compatible alternative.
	        if (fun.call(thisArg, val, i, t)) {
	          res.push(val);
	        }
	      }
	    }

	    return res;
	  };
	}
cbx.ns('canvas.util');
/**
 * @class canvas.util.DelayedTask
 *        <p>
 *        The DelayedTask class provides a convenient way to "buffer" the execution of a method, performing setTimeout
 *        where a new timeout cancels the old timeout. When called, the task will wait the specified time period before
 *        executing. If durng that time period, the task is called again, the original call will be cancelled. This
 *        continues so that the function is only called a single time for each iteration.
 *        </p>
 *        <p>
 *        This method is especially useful for things like detecting whether a user has finished typing in a text field.
 *        An example would be performing validation on a keypress. You can use this class to buffer the keypress events
 *        for a certain number of milliseconds, and perform only if they stop for that amount of time. Usage:
 *        </p>
 * 
 * <pre><code>
 * var task = new canvas.util.DelayedTask(function(){
 *     alert(document.getElementById('myInputField').value.length);
 * });
 * // Wait 500ms before calling our function. If the user presses another key 
 * // during that 500ms, it will be cancelled and we'll wait another 500ms.
 * document.getElementById('myInputField').on('keypress', function(){
 *     task.{@link #delay}(500); 
 * });
 * </code></pre>
 * 
 * @constructor The parameters to this constructor serve as defaults and are not required.
 * @param {Function} fn (optional) The default function to call.
 * @param {Object} scope The default scope (The <code><b>this</b></code> reference) in which the function is called.
 *            If not specified, <code>this</code> will refer to the browser window.
 * @param {Array} args (optional) The default Array of arguments.
 */
canvas.util.DelayedTask = function(fn, scope, args){
    var id = null, d, t;
    var call = function(){
        var now = new Date().getTime();
        if(now - t >= d){
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        }
    };
    this.delay = function(delay, newFn, newScope, newArgs){
        if(id && delay != d){
            this.cancel();
        }
        d = delay;
        t = new Date().getTime();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        if(!id){
            id = setInterval(call, d);
        }
    };
    this.cancel = function(){
        if(id){
            clearInterval(id);
            id = null;
        }
    };
};