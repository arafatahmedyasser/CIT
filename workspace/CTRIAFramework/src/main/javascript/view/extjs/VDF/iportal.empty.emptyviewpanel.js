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
 * DEPLOY_MODULE_ID:  <Check with your lead for correct value>
 */
Ext.namespace('iportal.empty');

iportal.empty.emptyviewpanel = Ext.extend(Ext.Panel,
				{
					productCode : "CUSER",
					/** Sub product code */
					subProductCode : "CUSER",
					/** function code */
					functionCode : "VSBLTY",
					emptyViewId : Ext.id,
					resourceBundleKey : null,
					extraParamsHandler : null,
					recordType : [],
					store : null,
					layout : 'fit',
					emptyJson : null,
					emptyTitle : null,
					chartH : 0,
					chartW : 0,
					mvConf : null,
					initCollapsed : false,
					loadHandler : Ext.emptyFn,
					emptyTextMsg : null,
					initComponent : function() {
						var rb = CRB.getFWBundle();
						this.emptyTextMsg = rb.NO_DATA_MSG;

						// Called during component initialization,cannot be
						// changed from out side
						var defaultConfig = {
							xtype : 'panel',
							border : true,
							layout : 'fit',
							autoScroll : true,
							autoWidth : true,
							items : [ {
								xtype : 'container',
								itemId : this.getWrapperId()
							} ]
						};
						Ext.apply(this, defaultConfig);

						iportal.empty.emptyviewpanel.superclass.initComponent
								.apply(this);

					},				
					afterRender : function() {
						iportal.empty.emptyviewpanel.superclass.afterRender.apply(
								this, arguments);
						this.initEvents();
						var that = this;
						setTimeout(function() {
							that.componentHandlers = CGH.getHandler(
									that.viewConf.VIEW_MD.VIEW_ID, {
										'OWNER' : that,
										'CONTAINER_ID' : that.getContainerCmpId()
									});

						}, 500);
					},
					getWrapperId : function() {
						return this.emptyViewId + "__EMPTY";
					},
					initEvents : function() {
						var rb = CRB.getFWBundle();
						iportal.empty.emptyviewpanel.superclass.initEvents.call(this);

						this.loadMask = new Ext.LoadMask(this.bwrap, {
							msg : rb.LOADING_MSG
						});

					},
					/**
					 * Intended to add REFRESH_DATA = Y to base params and
					 * reload Store. P.S REFRESH_DATA this will be deleted after
					 * data load success/failure.
					 */
					reloadData : function() {
						if (this.componentHandlers
								&& this.componentHandlers.reloadData) {
							this.componentHandlers.reloadData();
						}
					},
					getContainerCmpId : function() {
						return this.getComponent(this.getWrapperId()).el.id;
					
					},
					updateHeight : function(){
						return;
					}
					
				});
// register xtype to allow for lazy initialization
Ext.reg('empty-view', iportal.empty.emptyviewpanel);
