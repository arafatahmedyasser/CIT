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

package com.intellectdesign.canvas.viewdefinition;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.common.IBaseDefinition;

/**
 * This class is for context menu node implements ibase definition
 * 
 * @version 1.0
 */
public class ContextMenuNode implements IBaseDefinition
{
	/**
	 * Internal constant for serialization purposes defualt serial id.
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 
	 */
	private String menuId = null;
	private String viewId = null;
	private String displayKeyNm = null;
	private String parentId = null;
	private String containerFlag = null;
	private String prodCode = null;
	private String subProdCode = null;
	private String funcCode = null;
	private String position = null;
	private String menuSeparator = null;
	private String eventId = null;
	private String formContainerId = null;
	private String formId = null;
	private String action = null;
	private String pageCode = null;
	private String hostCode = null;
	private String defaultMenu = null;
	private String contextType = null;
	private String contextAppWidgetId = null;
	private List<ContextMenuNode> childNodes = null;

	/***
	 * Sets the values to the childNodes.
	 */
	public ContextMenuNode()
	{
		childNodes = new ArrayList<ContextMenuNode>();
	}

	/***
	 * Sets the value to each String of the childNodes ArrayList.
	 * 
	 * @param map Context Menu node map
	 */
	public ContextMenuNode(final Map<String, String> map)
	{
		setMenuId(map.get("MENU_ID"));
		setViewId(map.get("VIEW_ID"));
		setposition(map.get("POSITION"));
		setDisplayKeyNm(map.get("DISPLAY_KEY_NM"));
		setParentId(map.get("PARENT_ID"));
		setContainerFlag(map.get("CONTAINER_FLAG"));
		setMenuSeparator(map.get("MENU_SEPARATOR"));
		setProductCode(map.get("OD_PRODUCT_CODE"));
		setSubProdCode(map.get("OD_SUBPROD_CODE"));
		setFuncCode(map.get("OD_FUNCTION_CODE"));
		setEventId(map.get("EVENT_ID"));
		setFormContainerId(map.get("FORM_CONTAINER_ID"));
		setFormId(map.get("FORM_ID"));
		setAction(map.get("ACTION"));
		setPageCode(map.get("PAGE_CODE"));
		setHostCode(map.get("HOST_CODE"));
		setDefaultMenu(map.get("DEFAULT_MENU_ID"));
		setContextType(map.get("CONTEXT_TYPE"));
		setContextAppWidgetId(map.get("APP_WIDGET_ID"));
		childNodes = new ArrayList<ContextMenuNode>();
	}

	/***
	 * Convert the String to JSONString to values.
	 * 
	 * @return String String
	 */
	public final String toJSONString()
	{
		final StringBuffer sb = new StringBuffer();
		sb.append("view_id:" + "'" + viewId + "',");
		sb.append("menu_id:" + "'" + menuId + "',");
		sb.append("position:" + "'" + position + "',");
		sb.append("display_key_nm:" + "'" + displayKeyNm + "',");
		sb.append("container_flag:" + "'" + containerFlag + "',");
		sb.append("menu_separator:" + "'" + menuSeparator + "',");
		sb.append("parent_id:" + "'" + parentId + "',");
		sb.append("od_product_code:" + "'" + prodCode + "',");
		sb.append("od_subprod_code:" + "'" + subProdCode + "',");
		sb.append("od_function_code:" + "'" + funcCode + "',");
		sb.append("form_container_id:" + "'" + formContainerId + "',");
		sb.append("form_id:" + "'" + formId + "',");
		sb.append("action:" + "'" + action + "',");
		sb.append("event_id:" + "'" + eventId + "',");
		sb.append("page_code:" + "'" + pageCode + "',");
		sb.append("host_code:" + "'" + hostCode + "',");
		sb.append("default_menu:" + "'" + defaultMenu + "',");
		sb.append("context_type:" + "'" + contextType + "',");
		sb.append("context_app_widget_id:" + "'" + contextAppWidgetId + "',");
		final StringBuffer sb1 = new StringBuffer();
		for (final ContextMenuNode mn : childNodes)
		{
			sb1.append(mn.toJSONString() + ",");
		}
		String nodes = sb1.toString();
		if (nodes.length() > 0)
		{
			nodes = nodes.substring(0, nodes.length() - 1);
		}
		sb.append("child_nodes:" + "[" + nodes + "]");
		return "{" + sb.toString() + "}";
	}

	/**
	 * ref to Str to contextAppWidgetId
	 * 
	 * @return the contextAppWidgetId
	 */
	public String getContextAppWidgetId()
	{
		return contextAppWidgetId;
	}

	/**
	 * ref to contextAppWidgetId
	 * 
	 * @param contextAppWidgetId the contextAppWidgetId to set
	 */
	public void setContextAppWidgetId(String contextAppWidgetId)
	{
		this.contextAppWidgetId = contextAppWidgetId;
	}

	/***
	 * Adds each child node to the parent node.
	 * 
	 * @param mn menu Node
	 */
	public final void addChildNode(final ContextMenuNode mn)
	{
		childNodes.add(mn);
	}

	/**
	 * ref the View Id
	 * 
	 * @return the viewId
	 */
	public final String getViewId()
	{
		return viewId;
	}

	/**
	 * to the menuId
	 * 
	 * @return the viewId
	 */
	public final String getMenuId()
	{
		return menuId;
	}

	/***
	 * Sets the View ID.
	 * 
	 * @param paramViewId View ID
	 */
	public final void setViewId(final String paramViewId)
	{
		this.viewId = paramViewId;
	}

	/***
	 * Sets the Menu ID.
	 * 
	 * @param parammenuId Menu ID
	 */
	public final void setMenuId(final String parammenuId)
	{
		this.menuId = parammenuId;
	}

	/**
	 * ref to contextAppWidgetId
	 * 
	 * @param paramcontextActionType
	 */
	public final void contextAppWidgetId(final String paramcontextActionType)
	{
		this.contextType = paramcontextActionType;

	}

	/**
	 * Sets the Context Type of Menus(Menu/App/Icon) 
	 * @param paramcontextActionType
	 */
	public final void setContextType(final String paramcontextActionType)
	{
		this.contextType = paramcontextActionType;

	}
	/**
	 * ref to getContextType
	 * 
	 * @return contextTpye
	 */
	public final String getContextType()
	{
		return contextType;
	}

	/***
	 * Sets the Position.
	 * 
	 * @param paramposition Position
	 */
	public final void setposition(final String paramposition)
	{
		this.position = paramposition;
	}

	/***
	 * Sets the Display name for the menu nodes.
	 * 
	 * @param paramdisplayKeyNm Display name for the menu nodes
	 */
	public final void setDisplayKeyNm(final String paramdisplayKeyNm)
	{
		this.displayKeyNm = paramdisplayKeyNm;
	}

	/***
	 * Gets the Display key name for the menu nodes.
	 * 
	 * @return String Display key name
	 */
	public final String getDisplayKeyNm()
	{
		return displayKeyNm;
	}

	/***
	 * Gets the position of the menu nodes.
	 * 
	 * @return String position
	 */
	public final String getposition()
	{
		return position;
	}

	/***
	 * Gets the parent ID for each menu.
	 * 
	 * @return String parent ID
	 */
	public final String getParentId()
	{
		return parentId;
	}

	/***
	 * Sets the parent Id to each menu.
	 * 
	 * @param paramparentId parent id
	 */
	public final void setParentId(final String paramparentId)
	{
		this.parentId = paramparentId;
	}

	/***
	 * Gets the Container flag Y/N for each menu node.
	 * 
	 * @return String
	 */
	public final String getContainerFlag()
	{
		return containerFlag;
	}

	/***
	 * Sets the container flag Y/N for each menu node.
	 * 
	 * @param paramcontainerFlag containerFlag
	 */
	public final void setContainerFlag(final String paramcontainerFlag)
	{
		this.containerFlag = paramcontainerFlag;
	}

	/***
	 * Gets the Child nodes for each node.
	 * 
	 * @return List
	 */
	public final List<ContextMenuNode> getChildNodes()
	{
		return childNodes;
	}

	/***
	 * Sets the menu separator.
	 * 
	 * @param parammenuSeparator menuSeparator
	 */
	public final void setMenuSeparator(final String parammenuSeparator)
	{
		this.menuSeparator = parammenuSeparator;
	}

	/***
	 * Gets the menu separator.
	 * 
	 * @return String
	 */
	public final String getMenuSeparator()
	{
		return menuSeparator;
	}

	/***
	 * Sets the Child nodes for each menu.
	 * 
	 * @param paramchildNodes childNodes
	 */
	public final void setChildNodes(final List<ContextMenuNode> paramchildNodes)
	{
		this.childNodes = paramchildNodes;
	}

	/***
	 * Gets the Product code for each menu node.
	 * 
	 * @return String
	 */
	public final String getProductCode()
	{
		return prodCode;
	}

	/***
	 * Sets the Product code for each menu node.
	 * 
	 * @param paramprodCode prodCode
	 */
	public final void setProductCode(final String paramprodCode)
	{
		this.prodCode = paramprodCode;
	}

	/***
	 * Gets the Sub-Product code for each menu node.
	 * 
	 * @return String
	 */
	public final String getSubProdCode()
	{
		return subProdCode;
	}

	/***
	 * Sets the Sub-Product code for each menu node.
	 * 
	 * @param paramsubProdCode subProdCode
	 */
	public final void setSubProdCode(final String paramsubProdCode)
	{
		this.subProdCode = paramsubProdCode;
	}

	/***
	 * Gets the Function code for each menu node.
	 * 
	 * @return String
	 */
	public final String getFuncCode()
	{
		return funcCode;
	}

	/***
	 * Sets the Function code for each menu node.
	 * 
	 * @param paramfuncCode funcCode
	 */
	public final void setFuncCode(final String paramfuncCode)
	{
		this.funcCode = paramfuncCode;
	}

	/***
	 * Sets the Event ID for each menu node.
	 * 
	 * @param parameventId Event ID
	 */
	public final void setEventId(final String parameventId)
	{
		this.eventId = parameventId;
	}

	/***
	 * Sets the Form Container ID for each menu node.
	 * 
	 * @param paramformContainerId formContainerId
	 */
	public final void setFormContainerId(final String paramformContainerId)
	{
		this.formContainerId = paramformContainerId;
	}

	/***
	 * Sets the Form ID for each menu node.
	 * 
	 * @param paramformId formId
	 */
	public final void setFormId(final String paramformId)
	{
		this.formId = paramformId;
	}

	/***
	 * Gets the Form ID for each menu node.
	 * 
	 * @return String
	 */
	public final String getFormId()
	{
		return formId;
	}

	/***
	 * Sets the Action code for each menu node.
	 * 
	 * @param paramaction Action
	 */
	public final void setAction(final String paramaction)
	{
		this.action = paramaction;
	}

	/***
	 * Gets the Action code for each menu node.
	 * 
	 * @return String
	 */
	public final String getAction()
	{
		return action;
	}

	/***
	 * Sets the Page code for each menu node.
	 * 
	 * @param parampageCode pageCode
	 */
	public final void setPageCode(final String parampageCode)
	{
		this.pageCode = parampageCode;
	}

	/***
	 * Sets the Host code for each menu node.
	 * 
	 * @param paramhostCode hostCode
	 */
	public final void setHostCode(final String paramhostCode)
	{
		this.hostCode = paramhostCode;
	}

	/***
	 * Gets the Page code for each menu node.
	 * 
	 * @return String
	 */
	public final String getPageCode()
	{
		return pageCode;
	}

	/***
	 * Gets the Host code for each menu node.
	 * 
	 * @return String
	 */
	public final String getHostCode()
	{
		return hostCode;
	}

	/***
	 * Gets the Event ID for each menu node.
	 * 
	 * @return String
	 */
	public final String getEventId()
	{
		return eventId;
	}

	/***
	 * Gets the Form Container Id for each menu node.
	 * 
	 * @return String
	 */
	public final String getFormContainerId()
	{
		return formContainerId;
	}

	/***
	 * Gets the Default Menu Id for each menu node.
	 * 
	 * @return String
	 */
	public final String getDefaultMenu()
	{
		return defaultMenu;
	}

	/***
	 * Sets the Default Menu Id for each menu node.
	 * 
	 * @param paramhostCode hostCode
	 */
	public final void setDefaultMenu(final String defaultMenu)
	{
		this.defaultMenu = defaultMenu;
	}

}
