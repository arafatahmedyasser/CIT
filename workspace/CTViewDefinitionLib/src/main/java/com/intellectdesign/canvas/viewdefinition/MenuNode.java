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
 * This class is for menu node implements serializable interface
 * 
 * @version 1.0
 */
public class MenuNode implements java.io.Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private String item_id;
	private String display_key_nm;
	private String parent_id;
	private String container_flag;
	private String od_product_code;
	private String od_subprod_code;
	private String od_function_code;
	private String label_ind;
	private String icon_ind;
	private String block_position;
	private String container_id;

	private List<MenuNode> childNodes;

	/**
	 * MenuNode
	 */
	public MenuNode()
	{
		childNodes = new ArrayList<MenuNode>();
	}

	/**
	 * ref to MenuNode
	 * 
	 * @param map
	 */
	public MenuNode(Map<String, String> map)
	{
		setItem_id(map.get("ITEM_ID"));
		setDisplay_key_nm(map.get("DISPLAY_KEY_NM"));
		setParent_id(map.get("PARENT_ID"));
		setContainer_flag(map.get("CONTAINER_FLAG"));

		setOd_product_code(map.get("OD_PRODUCT_CODE"));
		setOd_subprod_code(map.get("OD_SUBPROD_CODE"));
		setOd_function_code(map.get("OD_FUNCTION_CODE"));
		setLabel_ind(map.get("LABEL_IND"));
		setIcon_ind(map.get("ICON_IND"));
		setBlock_position(map.get("BLOCK_POSITION"));
		setContainer_id(map.get("CONTAINER_ID"));
		childNodes = new ArrayList<MenuNode>();
	}

	/**
	 * ref to SB to String values
	 * 
	 * @return
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("item_id:" + "'" + item_id + "',");
		sb.append("display_key_nm:" + "'" + display_key_nm + "',");
		sb.append("container_flag:" + "'" + container_flag + "',");
		sb.append("parent_id:" + "'" + parent_id + "',");
		sb.append("od_product_code:" + "'" + od_product_code + "',");
		sb.append("od_subprod_code:" + "'" + od_subprod_code + "',");
		sb.append("od_function_code:" + "'" + od_function_code + "',");
		sb.append("label_ind:" + "'" + label_ind + "',");
		sb.append("icon_ind:" + "'" + icon_ind + "',");
		sb.append("block_position:" + "'" + block_position + "',");
		sb.append("container_id:" + "'" + container_id + "',");
		StringBuffer sb1 = new StringBuffer();
		for (MenuNode mn : childNodes)
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
	 * ref to AddChildNode
	 * 
	 * @param mn
	 */
	public void addChildNode(MenuNode mn)
	{
		childNodes.add(mn);
	}

	/**
	 * ref to Str GetItemID
	 * 
	 * @return
	 */
	public String getItem_id()
	{
		return item_id;
	}

	/**
	 * ref to SetItemID
	 * 
	 * @param item_id
	 */
	public void setItem_id(String item_id)
	{
		this.item_id = item_id;
	}

	/**
	 * ref to GetDisplayKey
	 * 
	 * @return
	 */
	public String getDisplay_key_nm()
	{
		return display_key_nm;
	}

	/**
	 * ref to SetDisplayKey
	 * 
	 * @param display_key_nm
	 */
	public void setDisplay_key_nm(String display_key_nm)
	{
		this.display_key_nm = display_key_nm;
	}

	/**
	 * ref to STR to getParentId
	 * 
	 * @return
	 */
	public String getParent_id()
	{
		return parent_id;
	}

	/**
	 * ref to Str to SetParentID
	 * 
	 * @param parent_id
	 */
	public void setParent_id(String parent_id)
	{
		this.parent_id = parent_id;
	}

	/**
	 * ref to flag Getconatiner
	 * 
	 * @return flag
	 */
	public String getContainer_flag()
	{
		return container_flag;
	}

	/**
	 * ref to SetFlagContainer
	 * 
	 * @param container_flag
	 */
	public void setContainer_flag(String container_flag)
	{
		this.container_flag = container_flag;
	}

	/**
	 * refer to List GetChildNodes
	 * 
	 * @return
	 */
	public List<MenuNode> getChildNodes()
	{
		return childNodes;
	}

	/**
	 * ref to set ChildNodes
	 * 
	 * @param childNodes
	 */
	public void setChildNodes(List<MenuNode> childNodes)
	{
		this.childNodes = childNodes;
	}

	/**
	 * ref to GetODProduct
	 * 
	 * @return
	 */
	public String getOd_product_code()
	{
		return od_product_code;
	}

	/**
	 * ref to setODProduct
	 * 
	 * @param od_product_code
	 */
	public void setOd_product_code(String od_product_code)
	{
		this.od_product_code = od_product_code;
	}

	/**
	 * ref to getODSubProduct
	 * 
	 * @return
	 */
	public String getOd_subprod_code()
	{
		return od_subprod_code;
	}

	/**
	 * ref to set ODSubProduct
	 * 
	 * @param od_subprod_code
	 */
	public void setOd_subprod_code(String od_subprod_code)
	{
		this.od_subprod_code = od_subprod_code;
	}

	/**
	 * ref to FunCode
	 * 
	 * @return
	 */
	public String getOd_function_code()
	{
		return od_function_code;
	}

	/**
	 * ref to od Fun Code
	 * 
	 * @param od_function_code
	 */
	public void setOd_function_code(String od_function_code)
	{
		this.od_function_code = od_function_code;
	}

	/**
	 * ref to get LabelInd
	 * 
	 * @return
	 */
	public String getLabel_ind()
	{
		return label_ind;
	}

	/**
	 * ref to Set LabelInd
	 * 
	 * @param label_ind
	 */
	public void setLabel_ind(String label_ind)
	{
		this.label_ind = label_ind;
	}

	/**
	 * ref to get IconInd
	 * 
	 * @return
	 */
	public String getIcon_ind()
	{
		return icon_ind;
	}

	/**
	 * ref to Set IconInd
	 * 
	 * @param icon_ind
	 */
	public void setIcon_ind(String icon_ind)
	{
		this.icon_ind = icon_ind;
	}

	/**
	 * ref to getBlock Postion
	 * 
	 * @return
	 */
	public String getBlock_position()
	{
		return block_position;
	}

	/**
	 * ref to setBlockposition
	 * 
	 * @param block_position
	 */
	public void setBlock_position(String block_position)
	{
		this.block_position = block_position;
	}

	/**
	 * ref to SetContainer Id
	 * 
	 * @param container_id
	 */
	public void setContainer_id(String container_id)
	{
		this.container_id = container_id;
	}

	/**
	 * ref to getContainer Id
	 * 
	 * @return
	 */
	public String getContainer_id()
	{
		return container_id;
	}

}
