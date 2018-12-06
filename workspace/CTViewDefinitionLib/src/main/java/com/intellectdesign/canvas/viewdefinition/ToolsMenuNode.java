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

/**
 * This class contains the details of each custom tools.
 * 
 * @version 1.0
 */
public class ToolsMenuNode implements java.io.Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private String Custom_Tools_Id;

	public ToolsMenuNode()
	{
		childNodes = new ArrayList<ToolsMenuNode>();
	}

	/**
	 * this is ref to MenuNode Tools
	 * 
	 * @param map
	 */
	public ToolsMenuNode(Map<String, String> map)
	{
		setCustom_Tools_Id(map.get("CUSTOM_TOOLS_ID"));
		setMenu_id(map.get("MENU_ID"));
		setParent_Menu_id(map.get("PARENT_MENU_ID"));

		if (map.get("POSITION") != null && !("".equals(map.get("POSITION"))))
			setPosition(Integer.parseInt(map.get("POSITION")));

		setTool_type(map.get("TOOL_TYPE"));
		setDisplay_name(map.get("DISPLAY_NAME"));
		setTool_description(map.get("TOOL_DESCRIPTION"));
		childNodes = new ArrayList<ToolsMenuNode>();

	}

	/**
	 * this is ref String Buffer values
	 * 
	 * @return
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("CUSTOM_TOOLS_ID:" + "'" + Custom_Tools_Id + "',");
		sb.append("MENU_ID:" + "'" + Menu_id + "',");
		sb.append("PARENT_MENU_ID:" + "'" + Parent_Menu_id + "',");
		sb.append("POSITION:" + "'" + Position + "',");
		sb.append("TOOL_TYPE:" + "'" + Tool_type + "',");
		sb.append("DISPLAY_NAME:" + "'" + Display_name + "',");
		sb.append("TOOL_DESCRIPTION:" + "'" + Tool_description + "',");
		StringBuffer sb1 = new StringBuffer();
		for (ToolsMenuNode mn : childNodes)
		{
			sb1.append(mn.toString() + ",");
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
	 * this is ref to AddChildNode
	 * 
	 * @param mn
	 */
	public void addChildNode(ToolsMenuNode mn)
	{
		childNodes.add(mn);
	}

	/**
	 * this is ref to getCustomToolsId
	 * 
	 * @return
	 */
	public String getCustom_Tools_Id()
	{
		return Custom_Tools_Id;
	}

	/**
	 * this is ref to SetCustomToolsId
	 * 
	 * @param custom_tools_id
	 */
	public void setCustom_Tools_Id(String custom_tools_id)
	{
		Custom_Tools_Id = custom_tools_id;
	}

	/**
	 * this is ref to GETMenuId
	 * 
	 * @return
	 */
	public String getMenu_id()
	{
		return Menu_id;
	}

	/**
	 * this is ref to SetMeu ID
	 * 
	 * @param mENU_ID
	 */
	public void setMenu_id(String mENU_ID)
	{
		Menu_id = mENU_ID;
	}

	/**
	 * this is ref to GetParentMenu ID
	 * 
	 * @return
	 */
	public String getParent_Menu_id()
	{
		return Parent_Menu_id;
	}

	/**
	 * this is ref to SetParentMenu ID
	 * 
	 * @param pARENT_Menu_id
	 */
	public void setParent_Menu_id(String pARENT_Menu_id)
	{
		Parent_Menu_id = pARENT_Menu_id;
	}

	/**
	 * this is ref to GetPosition
	 * 
	 * @return
	 */
	public int getPosition()
	{
		return Position;
	}

	/**
	 * this is ref to SetPosition
	 * 
	 * @param pOSITION
	 */
	public void setPosition(int pOSITION)
	{
		Position = pOSITION;
	}

	/**
	 * this is ref GetTOOLTYPE
	 * 
	 * @return
	 */
	public String getTool_type()
	{
		return Tool_type;
	}

	/**
	 * this is ref SetTOOLTYPE
	 * 
	 * @param tOOL_TYPE
	 */
	public void setTool_type(String tOOL_TYPE)
	{
		Tool_type = tOOL_TYPE;
	}

	/**
	 * this is ref GetDisplayName
	 * 
	 * @return
	 */
	public String getDisplay_name()
	{
		return Display_name;
	}

	/**
	 * this is ref to SetDisplayName
	 * 
	 * @param dISPLAY_NAME
	 */
	public void setDisplay_name(String dISPLAY_NAME)
	{
		Display_name = dISPLAY_NAME;
	}

	/**
	 * this is ref to Get Tool Description
	 * 
	 * @return
	 */
	public String getTool_description()
	{
		return Tool_description;
	}

	/**
	 * this is ref to Set Tool Description
	 * 
	 * @param tOOL_DESCRIPTION
	 */
	public void setTool_description(String tOOL_DESCRIPTION)
	{
		Tool_description = tOOL_DESCRIPTION;
	}

	/**
	 * this is ref to List child nodes
	 * 
	 * @return
	 */
	public List<ToolsMenuNode> getChildNodes()
	{
		return childNodes;
	}

	/**
	 * this is ref to Set List Child Nodes
	 * 
	 * @param childNodes
	 */
	public void setChildNodes(List<ToolsMenuNode> childNodes)
	{
		this.childNodes = childNodes;
	}

	private String Menu_id;
	private String Parent_Menu_id;
	private int Position = 0;
	private String Tool_type;
	private String Display_name;
	private String Tool_description;
	private List<ToolsMenuNode> childNodes;
}
