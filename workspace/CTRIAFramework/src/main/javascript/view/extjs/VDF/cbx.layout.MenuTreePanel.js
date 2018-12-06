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
 * DEPLOY_MODULE_ID: FW 15
 */
cbx.layout.MenuTreePanel = Ext
		.extend(
				Ext.Panel,
				{
					collapsedWidth : null,
					rb : CRB.getFWBundle(),
					initComponent : function() {
						var treeParams = iportal.workspace.metadata
								.getUpdatedWS();
						var menuTreePanel = null;
						var node = null;
						var type = null;
						for (var i = 0; i < treeParams.CHILD_LAYOUTS.length; i++) {
							var childWidExists = treeParams.CHILD_LAYOUTS[i].CHILD_WIDGETS.length > 0 ? 'Y'
									: 'N';
							// For those Layouts which are parent Nodes in
							// LAYOUT_DEFINITION,
							// a new tree would be created.
							
							if (Ext
									.isEmpty(treeParams.CHILD_LAYOUTS[i].PARENT_LAYOUT)) {
								type = treeParams.CHILD_LAYOUTS[i].IS_PARENT_IND == 'Y' ? "PARENT"
										: "ORPHAN";
								menuTreePanel = this.createNewTree();
								var rb = CRB.getBundle(treeParams.CHILD_LAYOUTS[i].LD_BUNDLE_KEY);
								node = this
										.createNode(
												type,
												treeParams.CHILD_LAYOUTS[i].LAYOUT_ID,
												rb[treeParams.CHILD_LAYOUTS[i].LAYOUT_DISPLAY_NM],
												childWidExists);
								menuTreePanel.setRootNode(node);
								this.menuPanel.getComponent(1).add(
										menuTreePanel);
							} else {
								var rb = CRB.getBundle(treeParams.CHILD_LAYOUTS[i].LD_BUNDLE_KEY);
								type = treeParams.CHILD_LAYOUTS[i].IS_PARENT_IND == 'Y' ? "SUBPARENT"
										: "CHILD";
								node = this
										.createNode(
												type, // for any CHILD
														// LAYOUT..can be a
														// layout itself or
														// another sub parent
												treeParams.CHILD_LAYOUTS[i].LAYOUT_ID,
												rb[treeParams.CHILD_LAYOUTS[i].LAYOUT_DISPLAY_NM],
												childWidExists);
								menuTreePanel
										.getNodeById(
												treeParams.CHILD_LAYOUTS[i].PARENT_LAYOUT)
										.appendChild(node);
							}
							var rb = CRB.getBundle(treeParams.CHILD_LAYOUTS[i].LD_BUNDLE_KEY);
							this
									.setAdditionalAttributes(
											node,
											rb[treeParams.CHILD_LAYOUTS[i].LAYOUT_DISPLAY_NM]);
							this.menuPanel.getComponent(1).doLayout();
						}
						cbx.layout.MenuTreePanel.superclass.initComponent
								.apply(this);
					},
					/**
					 * The method which is responsible for creating the Tree
					 * Nodes
					 */
					createNode : function(nodeType, nodeId, label,
							clickRequired) {
						return new Ext.tree.TreeNode(
								{
									id : nodeId,
									text : !Ext.isEmpty(this.rb[label]) ? this.rb[label]
											: label,
									iconCls : this.getNodeCls(nodeType, 'ICON'),
									cls : 'x-node-cbx',
									allowDrag : false,
									nodeType : nodeType,
									expanded : (nodeType == 'PARENT' && this.rb['PARENT_EXPANDED'] === 'Y') ? true
											: false,
									singleClickExpand : true,
									listeners : {
										/**
										 * If clickRequired !=true,only perform
										 * highlight operations on the selected
										 * node.
										 */
										click : (clickRequired === "Y") ? this.leafClick
												: this.performHighlightOperations,
										scope : this
									}
								});
					},
					/**
					 * Performs highlight operations on nodes which do not have
					 * any widgets mapped to the layout
					 */
					performHighlightOperations : function(node, e) {
						var layoutId = this.getLayoutPane().ownerCt.ownerCt
								.getLayoutId(this.getLayoutPane().getLayout().activeItem.itemId);
						var activeNode = this.getHighlightedNode();
						this.doHighlight(activeNode, node);
					},
					/**
					 * Added this API as multiple trees would be required.
					 */
					createNewTree : function() {
						return new Ext.tree.TreePanel(
								{
									border : false,
									autoWidth : true,
									autoScroll : false,
									singleExpand : true,
									lines : false,
									useArrows : this.rb['USE_ARROWS_FOR_MENU'] === 'Y' ? true
											: false,
									cls : 'cbx-menu-panel-wrap'
								});
					},
					/**
					 * The click handler of a Node. This deactivates the
					 * previously rendered layout and activates the one clicked
					 * Also handles the highlighting/De-Highlighting of the
					 * corresponding node.
					 */
					leafClick : function(node, e) {
						/**
						 * All selected Nodes will have a tool tip attached to
						 * them.
						 */
						if (Ext.isEmpty(node.attributes.qtip)) {
							node.setTooltip(node.text);
						}
						var activeNode = null;
						var activeItem = this.getLayoutPane().find('itemId',
								node.id + "_LAYOUT_CONTAINER")[0];
						/**
						 * Deactivating the layout already active. Activating
						 * the new layout corresponding to the node clicked.
						 * Performs highlight operations accordingly.
						 */
						if (!Ext
								.isEmpty(this.getLayoutPane().getLayout().activeItem)) {
							if (activeItem.itemId != this.getLayoutPane()
									.getLayout().activeItem.itemId) {
								this.getLayoutPane().getLayout().activeItem
										.hide();
								this.getLayoutPane().getLayout().activeItem
										.setVisible(false);
								this.getLayoutPane().getLayout().activeItem
										.fireEvent('deactivate',
												this.getLayoutPane()
														.getLayout().activeItem);
								/*var layoutId = this.getLayoutPane().ownerCt.ownerCt
										.getLayoutId(this.getLayoutPane()
												.getLayout().activeItem.itemId);*/
								activeNode = this.getHighlightedNode();

							} else if (activeItem.itemId == this
									.getLayoutPane().getLayout().activeItem.itemId) {
								activeNode = this.getHighlightedNode();
								this.doHighlight(activeNode, node);
								//return;
							}
						}
						this.doHighlight(activeNode, node);
						this.getLayoutPane().getLayout().activeItem = activeItem;
						
						this.getLayoutPane().getLayout().activeItem.show();
						this.getLayoutPane().getLayout().activeItem.setVisible(true);
						/**
						 * Code to be uncommented if collapse feature is to be
						 * enabled
						 */
						/*
						 * if (this.menuPanel.getComponent(1).collapsed === true &&
						 * this.getLayoutPane().rendered == true) {
						 * this.collapsedWidth = this
						 * .calculateCollapsedWidth(); if
						 * (!Ext.isEmpty(activeItem.items) &&
						 * activeItem.items.length > 0) {
						 * activeItem.getComponent(0).setWidth(
						 * this.getLayoutPane().ownerCt.getWidth() -
						 * this.collapsedWidth); // subtracting the collapsed
						 * panel width from // the total panel width } }
						 */
						activeItem.fireEvent('activate', activeItem);
					},
					/**
					 * Does the highlight operations on the activeNode(current
					 * Node) and the Node which is going to be selected
					 */
					doHighlight : function(activeNode, node) {
						if (!Ext.isEmpty(activeNode)
								|| Ext.isObject(activeNode)) {// check added
																// for initial
																// highlight on
																// after render
							this.removeHighlight(activeNode);
							if (Ext.isEmpty(activeNode.contentHidden)
									&& activeNode.contentHidden != true) {
								activeNode.setTooltip(node.text);
							}
						}
						if (!Ext.isEmpty(node)) {
							this.highlightActiveNode(node);
						}
					},
					/**
					 * calculates the collapsed panel's width COMMENTED OUT AS
					 * FEATURE NOT REQUIRED
					 */
					/*
					 * calculateCollapsedWidth : function() { if
					 * (Ext.isEmpty(this.collapsedWidth)) { return
					 * this.menuPanel.getWidth() -
					 * this.menuPanel.getComponent(0).getWidth(); } return
					 * this.collapsedWidth; },
					 */
					/**
					 * returns the Layout Definition Pane
					 */
					getLayoutPane : function() {
						return this.menuPanel.getComponent(0);
					},
					/**
					 * Loops through all the tree panels in the MENU-PANE and
					 * returns the node corresponding to the active item
					 * rendered in the LAYOUT-PANE. Note : method not to be used
					 * anywhere other than where it has been used already -> see
					 * cbx.layout.MenuContainerPanel.js.
					 */
					findTreeNode : function(layoutId) {
						var nodeNotFound = false;
						var container = this.menuPanel.getComponent(1);
						for (var i = 0; i < container.items.length; i++) {
							var treeNode = container.getComponent(i)
									.getNodeById(layoutId);
							nodeNotFound = Ext.isEmpty(treeNode);
							if (nodeNotFound != true) {
								return treeNode;
							}
						}
						return nodeNotFound;
					},
					/**
					 * Returns the highlighted node to do the highlight
					 * operations. findTreeNode and getHighlightedNode serve
					 * different purposes. The former just returns the first
					 * instance of the node found in the panel,whilst the latter
					 * returns the node object which is highlighted currently.
					 * 
					 */
					getHighlightedNode : function() {
						var nodeFound = false;

						var container = this.menuPanel.getComponent(1);
						for (var i = 0; i < container.items.length; i++) {
							var treeNode = container.getComponent(i)
									.getSelectionModel().getSelectedNode();
							nodeFound = !Ext.isEmpty(treeNode)
									&& treeNode.isHighlighted === true ? true
									: false;
							if (nodeFound == true) {
								return treeNode;
							}
						}
						return nodeFound;
					},
					/**
					 * This method simply applies the highlight css on the node
					 * passed.
					 */
					highlightActiveNode : function(node) {
						var hlCSS = this.getNodeCls(node.attributes.nodeType,
								'HIGHLIGHT');
						node.setCls(hlCSS);
						node.isHighlighted = true;
					},
					/**
					 * returns the CSS class based on the node type and the
					 * operation operations : Class for the Node icons,Node
					 * select operation
					 */
					getNodeCls : function(nodeType, clsType) {
						if (clsType === "HIGHLIGHT") {
							return (nodeType == "CHILD") ? 'cbx-menu-tree-leaf-selected'
									: (nodeType == "PARENT") ? 'cbx-menu-tree-parent-selected'
											: (nodeType == "SUBPARENT") ? 'cbx-menu-tree-subparent-selected'
													: 'cbx-menu-tree-orphan-selected';
						} else if (clsType === "ICON") {
							return (nodeType == 'CHILD') ? 'x-child-icon'
									: (nodeType == 'ORPHAN') ? 'x-orphan-icon'
											: (nodeType == 'SUBPARENT') ? 'x-subparent-icon'
													: 'x-parent-icon';
						} else
							return null;
					},

					/**
					 * This method removes the highlight css for the node passed
					 */
					removeHighlight : function(activeNode) {
						if (activeNode != false
								&& activeNode.isHighlighted == true) {
							activeNode.isHighlighted = false;
							activeNode.setCls('x-node-cbx');
						}
					},
					/**
					 * calculates the width of the Node text and sets the tool
					 * tip taking into account the width of the menu pane
					 */
					setAdditionalAttributes : function(node, label) {
						var nodeText = !Ext.isEmpty(this.rb[label]) ? this.rb[label]
								.toString()
								: label;
						var containerWidth = this.menuPanel.getComponent(1).width;
						try {
							var extMetrics = Ext.util.TextMetrics.createInstance(node);
							var nodeWidthInPx = extMetrics ? extMetrics.getWidth(node.text) + 16 : 16; 
						}catch(e){
							
						}
						
						/**
						 * Here it is always assumed that for any node,an icon
						 * of maximum width 16 px exists(on the safer side).
						 */
						var whiteSpaceWidth = (node.getDepth() + 1) * 16;
						/**
						 * This is the width of the white space prior to the
						 * icon of the node. This is calculated based on the
						 * depth of the node.
						 */
						var isContentHidden = (whiteSpaceWidth + nodeWidthInPx) > containerWidth - 10 ? true
								: false;
						/**
						 * minus 10 because if the node width is something like
						 * 190, and some css like font:bold is applied to
						 * it,ellipsis will hide a few characters -> Hence
						 * applying tooltip
						 */
						if (isContentHidden !== false) {
							node.setTooltip(nodeText);
							node.contentHidden = true;
						}
					}
				});