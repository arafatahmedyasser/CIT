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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This class is for workspace definition implements seriazable and cloneable interfaces
 * 
 * @version 1.0
 */
@SuppressWarnings("rawtypes")
public class WorkspaceDefinition implements Serializable, Cloneable
{
	/**
	 * Internal constant for serialization purposes
	 */
	/**
	 * To get the WorkspaceId
	 * 
	 * @return the workspaceId
	 */
	public String getWorkspaceId()
	{
		return workspaceId;
	}

	/**
	 * To set the WorkspaceId
	 * 
	 * @param workspaceId the workspaceId to set
	 */
	public void setWorkspaceId(String workspaceId)
	{
		this.workspaceId = workspaceId;
	}

	/**
	 * To get the WorkspaceLayout
	 * 
	 * @return the workspaceLayout
	 */
	public String getWorkspaceLayout()
	{
		return workspaceLayout;
	}

	/**
	 * To set the WorkspaceLayout
	 * 
	 * @param workspaceLayout the workspaceLayout to set
	 */
	public void setWorkspaceLayout(String layoutCategory)
	{
		this.workspaceLayout = layoutCategory;
	}

	/**
	 * To get the WorkspaceDisplayName
	 * 
	 * @return the workspaceDisplayName
	 */
	public String getWorkspaceDisplayName()
	{
		return workspaceDisplayName;
	}

	/**
	 * To set the workspaceDisplayName
	 * 
	 * @param workspaceDisplayName the workspaceDisplayName to set
	 */
	public void setWorkspaceDisplayName(String workspaceDisplayName)
	{
		this.workspaceDisplayName = workspaceDisplayName;
	}

	/**
	 * To get the userNumber
	 * 
	 * @return the userNumber
	 */
	public String getUserNumber()
	{
		return userNumber;
	}

	/**
	 * To set the userNumber
	 * 
	 * @param userNumber the userNumber to set
	 */
	public void setUserNumber(String userNumber)
	{
		this.userNumber = userNumber;
	}

	/**
	 * To get the gCIF
	 * 
	 * @return the gCIF
	 */
	public String getGCIF()
	{
		return GCIF;
	}

	/**
	 * To set the gCIF
	 * 
	 * @param gCIF the gCIF to set
	 */
	public void setGCIF(String gCIF)
	{
		GCIF = gCIF;
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
	 * To set the product
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
	 * To set the subProduct
	 * 
	 * @param subProduct the subProduct to set
	 */
	public void setSubProduct(String subProduct)
	{
		this.subProduct = subProduct;
	}

	/**
	 * To get the position
	 * 
	 * @return the position
	 */
	public int getPosition()
	{
		return position;
	}

	/**
	 * To set the position
	 * 
	 * @param position the position to set
	 */
	public void setPosition(int position)
	{
		this.position = position;
	}

	/**
	 * To get the SystemWorkspaceInd
	 * 
	 * @return the systemWorkspaceInd
	 */
	public String getSystemWorkspaceInd()
	{
		return systemWorkspaceInd;
	}

	/**
	 * To set the SystemWorkspaceInd
	 * 
	 * @param systemWorkspaceInd the systemWorkspaceInd to set
	 */
	public void setSystemWorkspaceInd(String systemWorkspaceInd)
	{
		this.systemWorkspaceInd = systemWorkspaceInd;
	}

	/**
	 * To get the WorkspaceActivateHandler
	 * 
	 * @return the workspaceActivateHandler
	 */
	public String getWorkspaceActivateHandler()
	{
		return workspaceActivateHandler;
	}

	/**
	 * To set the WorkspaceActivateHandler
	 * 
	 * @param workspaceActivateHandler the workspaceActivateHandler to set
	 */
	public void setWorkspaceActivateHandler(String workspaceActivateHandler)
	{
		this.workspaceActivateHandler = workspaceActivateHandler;
	}

	/**
	 * To get the LayoutDefinitions
	 * 
	 * @return the layoutDefinitions
	 */
	public List getLayoutDefinitions()
	{
		return layoutDefinitions;
	}

	/**
	 * To set the LayoutDefinitions
	 * 
	 * @param layoutDefinitions the layoutDefinitions to set
	 */
	public void setLayoutDefinitions(List layoutDefinitions)
	{
		this.layoutDefinitions = layoutDefinitions;
	}

	/**
	 * To get the WorkspaceMenuDefinitions
	 * 
	 * @return the workspaceMenuDefinition
	 */
	public List getWorkspaceMenuDefinitions()
	{
		return workspaceMenuDefinitions;
	}

	/**
	 * To set the WorkspaceMenuDefinitions
	 * 
	 * @param workspaceMenuDefinitions the workspaceMenuDefinition to set
	 */
	public void setWorkspaceMenuDefinition(List workspaceMenuDefinitions)
	{
		this.workspaceMenuDefinitions = workspaceMenuDefinitions;
	}

	/**
	 * To get the CustomSpaceBlockPosition
	 * 
	 * @return the customSpaceBlockPosition
	 */
	public String getCustomSpaceBlockPosition()
	{
		return customSpaceBlockPosition;
	}

	/**
	 * To set the CustomSpaceBlockPosition
	 * 
	 * @param customSpaceBlockPosition the customSpaceBlockPosition to set
	 */
	public void setCustomSpaceBlockPosition(String customSpaceBlockPosition)
	{
		this.customSpaceBlockPosition = customSpaceBlockPosition;
	}

	/**
	 * @return the isTFDRequired
	 */
	public String getIsTFDRequired()
	{
		return isTFDRequired;
	}

	/**
	 * @param isTFDRequired the isTFDRequired to set
	 */
	public void setIsTFDRequired(String isTFDRequired)
	{
		this.isTFDRequired = isTFDRequired;
	}

	/**
	 * @return the channelId
	 */
	public String getChannelId()
	{
		return channelId;
	}

	/**
	 * @param channelId the channelId to set
	 */
	public void setChannelId(String channelId)
	{
		this.channelId = channelId;
	}

	/**
	 * @return the bundleKey
	 */
	public String getBundleKey()
	{
		return bundleKey;
	}

	/**
	 * @param bundleKey the bundleKey to set
	 */
	public void setBundleKey(String bundleKey)
	{
		this.bundleKey = bundleKey;
	}

	@Override
	/**
	 * String Representation of all values 
	 * @return Returns the string 
	 */
	public String toString()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("WidgetDefinition -> ");
		sb.append("workspaceId: ");
		sb.append(workspaceId);
		sb.append("; workspaceLayout: ");
		sb.append(workspaceLayout);
		sb.append("; workspaceDisplayName: ");
		sb.append(workspaceDisplayName);
		sb.append("; userNumber : ");
		sb.append(userNumber);
		sb.append("; GCIF: ");
		sb.append(GCIF);
		sb.append("; product: ");
		sb.append(product);
		sb.append("; subProduct: ");
		sb.append(subProduct);
		sb.append("; position: ");
		sb.append(position);
		sb.append("; systemWorkspaceInd: ");
		sb.append(systemWorkspaceInd);
		sb.append("; workspaceActivateHandler: ");
		sb.append(workspaceActivateHandler);
		sb.append("; layoutDefinitions: ");
		sb.append(layoutDefinitions);
		sb.append("; workspaceMenuDefinitions: ");
		sb.append(workspaceMenuDefinitions);

		sb.append("; customSpaceBlockPosition: ");
		sb.append(customSpaceBlockPosition);

		return sb.toString();
	}

	/**
	 * It returns the WorkspaceDefinition details in Map object.
	 * 
	 * @return Map
	 */
	public Map getWorkspaceDefinitionAsMap()
	{
		Map workspaceDefMap = new HashMap();
		workspaceDefMap.put(ViewDefinitionConstants.PARAM_WORKSPACE_ID, workspaceId);
		workspaceDefMap.put(ViewDefinitionConstants.PARAM_LAYOUT, workspaceLayout);
		if("Y".equals(systemWorkspaceInd)){
			workspaceDefMap.put(ViewDefinitionConstants.PARAM_WORKSPACE_DISPLAY_NM, workspaceDisplayName.toUpperCase());	
		}
		else {
			workspaceDefMap.put(ViewDefinitionConstants.PARAM_WORKSPACE_DISPLAY_NM, workspaceDisplayName);
		}
		workspaceDefMap.put("OD_USER_NO", userNumber);
		workspaceDefMap.put("OD_GCIF", GCIF);
		workspaceDefMap.put("OD_PRODUCT", product);
		workspaceDefMap.put("OD_SUB_PRODUCT", subProduct);
		workspaceDefMap.put(ViewDefinitionConstants.PARAM_POSITION, position);
		workspaceDefMap.put(ViewDefinitionConstants.PARAM_SYSTEM_WORKSPACE_IND, systemWorkspaceInd);
		workspaceDefMap.put(ViewDefinitionConstants.PARAM_WORKSPACE_ACTIVE_HANDLER, workspaceActivateHandler);
		workspaceDefMap.put(ViewDefinitionConstants.PARAM_CUSTOMSPACE_BLOCKPOSITION, customSpaceBlockPosition);
		workspaceDefMap.put(ViewDefinitionConstants.PARAM_TFD_REQ, isTFDRequired);
		workspaceDefMap.put(ViewDefinitionConstants.PARAM_BUNDLE_KEY, bundleKey);
		workspaceDefMap.put(ViewDefinitionConstants.PARAM_CHANNEL_ID, channelId);
		List layouts = new ArrayList();
		LayoutDefinition layout = null;
		for (Object object : layoutDefinitions)
		{
			layout = (LayoutDefinition) object;
			layouts.add(layout.getLayoutDefinitionAsMap());
		}
		workspaceDefMap.put(ViewDefinitionConstants.PARAM_LAYOUTS, layouts);

		List workspaceMenus = new ArrayList();
		WorkspaceMenuDefinition menu = null;
		if (workspaceMenuDefinitions != null)
		{
			for (Object object : workspaceMenuDefinitions)
			{
				menu = (WorkspaceMenuDefinition) object;
				workspaceMenus.add(menu.getWorkspaceMenuDefinitionAsMap());
			}
			workspaceDefMap.put(ViewDefinitionConstants.PARAM_WORKSPACE_MENUS, workspaceMenus);
		}

		workspaceDefMap.put("CUSTOMSPACE_BLOCKPOSITION", customSpaceBlockPosition);

		return workspaceDefMap;
	}

	private static final long serialVersionUID = -2782967925095846843L;
	private String workspaceId;
	private String workspaceLayout;
	private String workspaceDisplayName;
	private String userNumber;
	private String GCIF;
	private String product;
	private String subProduct;
	private int position = 1;
	private String systemWorkspaceInd;
	private String workspaceActivateHandler;
	private List layoutDefinitions; // List of LayoutDefinitions which
									// are applicable to this workspace
	private List workspaceMenuDefinitions;

	// Variable for handle the Customspace_BlockPosition
	private String customSpaceBlockPosition = null;

	private String isTFDRequired = null;
	private String channelId = "A";
	private String bundleKey = "-1";

}
