cbx.ns("cbx.lib");
	cbx.lib.cbxdialog = Class(cbx.core.Component,{
		
		defaults : {
			dialogType : '',
			dialogStyle:'',
			title : '',
			message : '',
			modal : false,
			scope : null,
			yesHandler : function(){},
			noHandler: function(){},
			okHandler : function(){},
			cancelHandler : function(){},
			cls:'',
			bundle : null,
			override:false
		},
		constructor : function(config){
			this.opt = $.extend({},this.defaults, config);
			this.scope = config.scope?config.scope:null;
			this.bundle = CRB.getFWBundle();	
			this.initDialog();		
		},
		initDialog : function(){
			var that=this;
			this.cbxdialog = $(this.createContainer());
			this.cbxdialog.append(this.opt.message);
			this.dialogConfig={
						    dialogClass: this.opt.cls,
						    resizable: false,	
						    draggable:false,
							title:  this.opt.title,
							buttons:[],
							close: function( event, ui ) {
								 $( this ).dialog( "destroy" );
							},
							modal:true
						};
			if(!cbx.isEmpty(this.opt.dialogWidth)){
				this.dialogConfig.width=this.opt.dialogWidth;	
			}
			if(!cbx.isEmpty(this.opt.dialogHeight)){
				this.dialogConfig.height=this.opt.dialogHeight;	
			}
				
			
			if(this.opt.dialogType == 'CONFIRMATION'){
				var confirmButtonConfig=   {
						      text: this.bundle['LBL_OK'],
						      id:"CONFIRM_OK",
						      click: function() {
						    	  that.opt.okHandler.apply([that.opt.dialogType]);
						      }
						    };
				this.dialogConfig.buttons.push(confirmButtonConfig);	
				
				var cancelButtonConfig=   {
						      text:  this.bundle['LBL_CANCEL'], 
						      id:"CONFIRM_CANCEL",
						      click: function() {
						    	  that.opt.cancelHandler.apply([that.opt.dialogType]);
						      }
						    };
				this.dialogConfig.buttons.push(cancelButtonConfig);	
				
				
				var yesButtonConfig=   {
						      text:  this.bundle['LBL_YES'],
						      id:"CONFIRM_YES",
						      click: function() {
						    	  that.opt.yesHandler.apply([that.opt.dialogType]);
						      }
						    };
				this.dialogConfig.buttons.push(yesButtonConfig);	
				
			} else 	if(this.opt.dialogType == 'USERDEFINED'){
				
				
				var yesButtonConfig=   {
						      text:  this.bundle['LBL_YES'],
						      id:"USERDEF_YES",
						      click: function() {
						    	  that.opt.yesHandler.apply([that.opt.dialogType]); 
						      }
						    };
				
				
				 
				var noButtonConfig=   {
						      text:  this.bundle['LBL_NO'],
						      id:"USERDEF_NO",
						      click: function() {
						    	  that.opt.noHandler.apply([that.opt.dialogType]);
						      }
						    };
				
				
				var confirmButtonConfig=   {
						      text: this.bundle['LBL_OK'],
						      id:"CONFIRM_OK",
						      click: function() {
						    	  that.opt.okHandler.apply([that.opt.dialogType]);
						      }
						    };
				
				if(this.opt.dialogStyle=="OK"){
					this.dialogConfig.buttons.push(confirmButtonConfig);	
				}
				else if(this.opt.dialogStyle=="YES_NO"){
					this.dialogConfig.buttons.push(yesButtonConfig);
					this.dialogConfig.buttons.push(noButtonConfig);	
				}else{
					this.dialogConfig.buttons.push(confirmButtonConfig);
				}
				
			}else if(this.opt.dialogType == 'WARNING'){
				var confirmButtonConfig=   {
						      text: this.bundle['LBL_OK'],
						       id:"WARNING_OK",
						      click: function() {
						    	  that.opt.okHandler.apply([that.opt.dialogType]);
						      }
						    };
				this.dialogConfig.buttons.push(confirmButtonConfig);	
				
				var cancelButtonConfig=   {
						      text:  this.bundle['LBL_CANCEL'], 
						      id:"WARNING_CANCEL",
						      click: function() {
						    	  that.opt.cancelHandler.apply([that.opt.dialogType]);
						      }
						    };
				this.dialogConfig.buttons.push(cancelButtonConfig);	
			} 
			
			else {
				var confirmButtonConfig=   {
							
						      text: this.bundle['LBL_OK'],
						      id:"OK",
						      click: function() {
						    		  that.opt.okHandler.apply([that.opt.dialogType]);
						      }
						    };
				this.dialogConfig.buttons.push(confirmButtonConfig);	
			}
			
			
			if(this.opt.override){
				$.extend(this.dialogConfig,this.opt);
			}
		},
		createContainer : function(){
			var config = {
				'eleType' : 'div',
				'data-role' : 'popup'		
			};
			return new cbx.lib.layer(config).getLayer();
		},
		show : function(){
		this.cbxdialog.dialog(this.dialogConfig);
		},
		close : function(){
			this.cbxdialog.dialog("close");
			
		},
		
	});
	iportal.Dialog=cbx.lib.cbxdialog;
	CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'DIALOG'}, cbx.lib.cbxdialog);