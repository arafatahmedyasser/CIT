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

 * @class iportal.Window

 * @extends Ext.Window

 * Base class to customize a normal window

 * @constructor

 * Creates a new Window 

 * @param {Object} config Configuration options

 * 

 */



iportal.Window = function(config){

    this.name = config.name || config.id;

	////alert('toolButtons');	

    iportal.Window.superclass.constructor.call(this, config);

};



Ext.extend(iportal.Window, Ext.Window,  {

	

	/**

     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')

     */

	bundleKey : '',

	

	rawTitle: '',

	

	/**

     * @cfg {Object} toolButtons ,shortcut for defining tools on top of the window

     */

	toolButtons : null,

	

	/**

     * @cfg {Object} toolButtons ,shortcut for defining tools on top of the window

     */

	hideOnClose : false,

	

	/**

     * @cfg {Object} closeHandler ,if developer wants to do some finishing task before 

     * closing the window

     */

	closeHandler: Ext.emptyFn,



	/**

     * @cfg {Object} refreshHandler ,if developer wants to do refresh

     */

	refreshHandler: Ext.emptyFn,

	

	tbarDraggable : false,

	/**

     * @cfg {Object} pprintHandler ,if developer wants to print the contents

     */

	pprintHandler: Ext.emptyFn,

	

	helpHandler:function(){

									//var paramshelp = "height="+(screen.availHeight-145)+",width="+(screen.availWidth-110)+"toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=no,resizable=yes,border=thin,top=0,left=0";

		var paramshelp ='toolbar=no,location=no,directories=no,status=no,'+

	                 'menubar=no,scrollbars=no,resizable=no,border=thin,top=60,left=100,width=450,height=450';

		var helphandle = iportal.openNewWindow('/iportalweb/iportal/jsps/UnderConstruction.jsp'+

	                  '?elementIdForConfirmationMsg=globalPreferencesFormPanelId','helpwin',paramshelp);

	},

	// private

	initComponent:function(){

		////alert('toolButtons');	

			var that = this;

			//Checking if another instance non modal window existing or not. if exist then close.

			Ext.WindowMgr.each(function(windowparam){

					if(!windowparam.modal && !that.modal){

				 		if(windowparam.closeHandler){

				 			windowparam.closeHandler();

				 		}

				 		windowparam.close();

				 	}

				});

		//this.autoScroll = true;

		//this.modal = true;

		this.focus = Ext.emptyFn;

		

		this.closable = false;

		this.resizable = false;



	//	this.layout='fit';

		this.modal = true;

		

		iportal.Window.superclass.initComponent.apply(this, arguments);	



		var bundle;

		////alert('toolButtons1'+this.toolButtons);	

		// check for toolButtons config and create tools array

//		if(this.toolButtons !== null && typeof this.toolButtons == 'object'){

		if(this.toolButtons !== null ){

			////alert('toolButtons22');	

			////alert('toolButtons33'+this.toolButtons);	

			var cmRb = CRB.getFWBundle();

			//this.toolButtons.removeByValue('print'); // This fix is since print icon is allowed for

				////alert(this.toolButtons);									 // Summary list view and Cash Position.

			var that = this;

			this.tools = [];

		//	//alert('b4 tools');	

			if(this.toolButtons.indexOf('excel') != -1) {

				this.tools.push({id:'iportalExcel'});				

			}

			if(this.toolButtons.indexOf('pin') != -1) {

				this.tools.push({id:'iportalPin'});				

			}

			if(this.toolButtons.indexOf('refresh') != -1) {

				this.tools.push({id:'iportalRefresh',handler:function(){that.refreshHandler();}});				

			}

			if(this.toolButtons.indexOf('pprint') != -1) {

				this.tools.push({id:'iportalPrint',handler:function(){ that.pprintHandler();

													}});				

			}



			





			////alert('b4 Felp');

			if(this.toolButtons.indexOf('help') != -1) {

				////alert('Help');

				this.tools.push({id:'iportalHelp',handler:that.helpHandler});				

			}

			if(this.toolButtons.indexOf('close') != -1) {

				if(this.hideOnClose){

					this.tools.push({id:'iportalClose',tooltip:cmRb['TOOLTIP_CLOSE'],handler:function(){that.hide();}});

				}else{

					this.tools.push({id:'iportalClose',tooltip:cmRb['TOOLTIP_CLOSE'],handler:function(){that.closeHandler();that.close();}});

				}

			}

			

		}

		if(this.bundleKey !== ''){

			try{

				bundle = CRB.getBundle(this.bundleKey);

			}

			catch(e){

			}

		}else{

			bundle = CRB.getFWBundle();

		}

		if(this.rawTitle !== ''){

			this.title = this.rawTitle;

		}else{

		try{

			this.title = bundle[this.title];

		}

		catch(e){

			this.title= '?' + this.title + '?';

		}

		}			

		

		

	},

	afterRender:function(){        

		iportal.Window.superclass.afterRender.apply(this, arguments);    

		this.on('resize',function(){

			this.setSize({width:this.width,height:this.height});

			

		});		

		this.on('show',function(cmp){

			if(this.modal){

				Ext.getBody().addListener('keydown',this.handleKeyDown);	

			}

			var bottombar = this.getBottomToolbar();

			if(bottombar && bottombar.items){

				bottombar.items.each(function(item,index){

					if(item.el){

						if(item.id.indexOf('ext-gen') == -1){							

							item.el.focus();

							if(Ext.getCmp(item.id) && (Ext.getCmp(item.id).getXType() == 'tbbutton' || Ext.getCmp(item.id).getXType() == 'button')){

								Ext.getCmp(item.id).focus(true);

							}

						}

					}													

				});	

			}

		});	

		this.on('beforehide',function(cmp){

			Ext.getBody().removeListener('keydown',this.handleKeyDown);						

		});	

		this.on('beforeclose',function(cmp){

			Ext.getBody().removeListener('keydown',this.handleKeyDown);						

		});	

		if(this.getTopToolbar() && this.tbarDraggable){

			this.dd.setHandleElId(this.getTopToolbar().id);

			this.getTopToolbar().addClass("x-window-draggable");

		}

	},

	

	handleKeyDown : function(e){

		var that = this;

		var evt = (e) ? e : window.event;

		if(evt.keyCode === 9){

			var target = evt.target ? evt.target : evt.srcElement;	

			var targetElement = Ext.get(target);	

			if(!targetElement.findParent('div.x-window')){				

				that.focus();

				var flagFocus = false;

				if(that.items)

				that.items.each(function(item,index){

					if(item.isFormField && !flagFocus){

					     item.el.focus();

					     flagFocus = true;					     

					}

				});

				return false;

			}								

		}

			else if(evt.keyCode === 13){

				var target = evt.target ? evt.target : evt.srcElement;	

				if(!Ext.isEmpty(target) && (!Ext.isEmpty(target.className))){

				if(target.className.indexOf('x-form-textarea')==-1 ){

				Ext.EventObject.stopEvent();

				}

				}			

			}

			

			else if(evt.keyCode === 32){

			var sourceElement = Ext.EventObject.getTarget();

			var targetOuterElement = sourceElement.outerHTML;

			var wrapper_sourceElement = Ext.get(sourceElement);

			var valid_source = (wrapper_sourceElement.findParent('div.x-window')) ? true : false;

			var valid_condition = false;

			if(valid_source){

				var parent_Window = wrapper_sourceElement.findParentNode('div.x-window');

				var wrapper_ParentWindow = Ext.get(parent_Window);

				Ext.WindowMgr.each(function(openedwin){

					if(Ext.getCmp(wrapper_ParentWindow.id).id == openedwin.id){

						valid_condition = true;

					}

				});

			}

			if(targetOuterElement.startsWith('<BUTTON') && !valid_condition){

				Ext.EventObject.stopEvent();

			}						

		}

	}

	



});

Ext.reg('iportal-window', iportal.Window);