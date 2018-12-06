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

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * This class is for workspace menu definition implements serializable and cloneable interfaces.
 * 
 * @version 1.0
 */
public class WorkspaceMenuDefinition implements Serializable, Cloneable
{
	/**
	 * Internal constant for serialization purposes
	 */
	/**
	 * To get the ItemId
	 * 
	 * @return the itemId
	 */
	public String getItemId()
	{
		return itemId;
	}

	/**
	 * To set the ItemId
	 * 
	 * @param itemId the itemId to set
	 */
	public void setItemId(String itemId)
	{
		this.itemId = itemId;
	}

	/**
	 * To get the menuDisplayKey
	 * 
	 * @return the menuDisplayKey
	 */
	public String getMenuDisplayKey()
	{
		return menuDisplayKey;
	}

	/**
	 * To set the menuDisplayKey
	 * 
	 * @param menuDisplayKey the menuDisplayKey to set
	 */
	public void setMenuDisplayKey(String menuDisplayKey)
	{
		this.menuDisplayKey = menuDisplayKey;
	}

	/**
	 * To get the parentId
	 * 
	 * @return the parentId
	 */
	public String getParentId()
	{
		return parentId;
	}

	/**
	 * To set the parentId
	 * 
	 * @param parentId the parentId to set
	 */
	public void setParentId(String parentId)
	{
		this.parentId = parentId;
	}

	/**
	 * To get the OrderPosition
	 * 
	 * @return the orderPosition
	 */
	public int getOrderPosition()
	{
		return orderPosition;
	}

	/**
	 * To set the OrderPosition
	 * 
	 * @param orderPosition the orderPosition to set
	 */
	public void setOrderPosition(int orderPosition)
	{
		this.orderPosition = orderPosition;
	}

	/**
	 * To get the containerFlag
	 * 
	 * @return the containerFlag
	 */
	public String getContainerFlag()
	{
		return containerFlag;
	}

	/**
	 * To set the containerFlag
	 * 
	 * @param containerFlag the containerFlag to set
	 */
	public void setContainerFlag(String containerFlag)
	{
		this.containerFlag = containerFlag;
	}

	/**
	 * To get the product
	 * 
	 * @return the product
	 */
	public String getProduct()
	{
		return product;
	}

	/**
	 * To set the Product
	 * 
	 * @param product the product to set
	 */
	public void setProduct(String product)
	{
		this.product = product;
	}

	/**
	 * To get the SubProduct
	 * 
	 * @return the subProduct
	 */
	public String getSubProduct()
	{
		return subProduct;
	}

	/**
	 * To set the SubProduct
	 * 
	 * @param subProduct the subProduct to set
	 */
	public void setSubProduct(String subProduct)
	{
		this.subProduct = subProduct;
	}

	/**
	 * To get the FuncCode
	 * 
	 * @return the funcCode
	 */
	public String getFuncCode()
	{
		return funcCode;
	}

	/**
	 * To set the funcCode
	 * 
	 * @param funcCode the funcCode to set
	 */
	public void setFuncCode(String funcCode)
	{
		this.funcCode = funcCode;
	}

	/**
	 * To get the LabelInd
	 * 
	 * @return the labelInd
	 */
	public String getLabelInd()
	{
		return labelInd;
	}

	/**
	 * To set the LabelInd
	 * 
	 * @param labelInd the labelInd to set
	 */
	public void setLabelInd(String labelInd)
	{
		this.labelInd = labelInd;
	}

	/**
	 * To get the IconInd
	 * 
	 * @return the iconInd
	 */
	public String getIconInd()
	{
		return iconInd;
	}

	/**
	 * To set the IconInd
	 * 
	 * @param iconInd the iconInd to set
	 */
	public void setIconInd(String iconInd)
	{
		this.iconInd = iconInd;
	}

	/**
	 * To get the blockPosition
	 * 
	 * @return the blockPosition
	 */
	public String getBlockPosition()
	{
		return blockPosition;
	}

	/**
	 * To set the blockPosition
	 * 
	 * @param blockPosition the blockPosition to set
	 */
	public void setBlockPosition(String blockPosition)
	{
		this.blockPosition = blockPosition;
	}

	/**
	 * @return the containerId
	 */
	public String getContainerId()
	{
		return containerId;
	}

	/**
	 * @param containerId the containerId to set
	 */
	public void setContainerId(String containerId)
	{
		this.containerId = containerId;
	}

	@Override
	/**
	 * String Representation of all values 
	 * @return Returns the string 
	 */
	public String toString()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("WorkspaceMenuDefinition -> ");
		sb.append("itemId: ");
		sb.append(itemId);
		sb.append("; menuDisplayKey: ");
		sb.append(menuDisplayKey);
		sb.append("; parentId: ");
		sb.append(parentId);
		sb.append("; orderPosition : ");
		sb.append(orderPosition);
		sb.append("; containerFlag: ");
		sb.append(containerFlag);
		sb.append("; labelInd: ");
		sb.append(labelInd);
		sb.append("; iconInd: ");
		sb.append(iconInd);
		sb.append("; blockPosition: ");
		sb.append(blockPosition);
		return sb.toString();
	}

	/**
	 * It returns the WorkspaceMenuDefinition details in Map object.
	 * 
	 * @return Map
	 */
	public Map getWorkspaceMenuDefinitionAsMap()
	{
		Map workspaceMenuDefMap = new HashMap();
		workspaceMenuDefMap.put("ITEM_ID", itemId);
		workspaceMenuDefMap.put("DISPLAY_KEY_NM", menuDisplayKey);
		workspaceMenuDefMap.put("PARENT_ID", parentId);
		workspaceMenuDefMap.put(ViewDefinitionConstants.PARAM_POSITION, orderPosition);
		workspaceMenuDefMap.put("CONTAINER_FLAG", containerFlag);
		workspaceMenuDefMap.put("OD_PRODUCT_CODE", product);
		workspaceMenuDefMap.put("OD_SUBPROD_CODE", subProduct);
		workspaceMenuDefMap.put("OD_FUNCTION_CODE", funcCode);
		workspaceMenuDefMap.put("LABEL_IND", labelInd);
		workspaceMenuDefMap.put("ICON_IND", iconInd);
		workspaceMenuDefMap.put(ViewDefinitionConstants.PARAM_BLOCK_POSITION, blockPosition);
		workspaceMenuDefMap.put(ViewDefinitionConstants.PARAM_CONTAINER_ID, containerId);

		return workspaceMenuDefMap;
	}

	private static final long serialVersionUID = -2951348752107032371L;
	private String itemId = null;
	private String menuDisplayKey = null;
	private String parentId = null;
	private int orderPosition = 1;
	private String containerFlag = "Y";
	private String product = null;
	private String subProduct = null;
	private String funcCode = null;
	private String labelInd = "Y";
	private String iconInd = "Y";
	private String blockPosition = "RIGHT";
	private String containerId = null;

}
