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
 * This class is for layout definition implements serializable and cloneable interfaces.
 * 
 * @version 1.0
 */
@SuppressWarnings("rawtypes")
public class LayoutDefinition implements Serializable, Cloneable
{
	/**
	 * Internal constant for serialization purposes
	 */
	/**
	 * 
	 * ref to getLayoutId
	 * 
	 * @return the layoutId
	 */
	public String getLayoutId()
	{
		return layoutId;
	}

	/**
	 * ref to SetLayoutId
	 * 
	 * @param layoutId the layoutId to set
	 */
	public void setLayoutId(String layoutId)
	{
		this.layoutId = layoutId;
	}

	/**
	 * ref to getLayoutCategory
	 * 
	 * @return the layoutCategory
	 */
	public String getLayoutCategory()
	{
		return layoutCategory;
	}

	/**
	 * ref to SetLayoutCategory
	 * 
	 * @param layoutCategory the layoutCategory to set
	 */
	public void setLayoutCategory(String layoutCategory)
	{
		this.layoutCategory = layoutCategory;
	}

	/**
	 * ref to getLayoutDisplayName
	 * 
	 * @return the layoutDisplayName
	 */
	public String getLayoutDisplayName()
	{
		return layoutDisplayName;
	}

	/**
	 * ref to SetLayoutDisplayName
	 * 
	 * @param layoutDisplayName the layoutDisplayName to set
	 */
	public void setLayoutDisplayName(String layoutDisplayName)
	{
		this.layoutDisplayName = layoutDisplayName;
	}

	/**
	 * ref the userNum
	 * 
	 * @return the userNumber
	 */
	public String getUserNumber()
	{
		return userNumber;
	}

	/**
	 * ref the SetUserNum
	 * 
	 * @param userNumber the userNumber to set
	 */
	public void setUserNumber(String userNumber)
	{
		this.userNumber = userNumber;
	}

	/**
	 * ref thew GCIF
	 * 
	 * @return the gCIF
	 */
	public String getGCIF()
	{
		return GCIF;
	}

	/**
	 * to ref setGCIF
	 * 
	 * @param gCIF the gCIF to set
	 */
	public void setGCIF(String gCIF)
	{
		GCIF = gCIF;
	}

	/**
	 * ref to GetProduct
	 * 
	 * @return the product
	 */
	public String getProduct()
	{
		return product;
	}

	/**
	 * ref to SetProduct
	 * 
	 * @param product the product to set
	 */
	public void setProduct(String product)
	{
		this.product = product;
	}

	/**
	 * ref to GetProduct
	 * 
	 * @return the subProduct
	 */
	public String getSubProduct()
	{
		return subProduct;
	}

	/**
	 * ref to setSubProduct
	 * 
	 * @param subProduct the subProduct to set
	 */
	public void setSubProduct(String subProduct)
	{
		this.subProduct = subProduct;
	}

	/**
	 * ref to Getproportion
	 * 
	 * @return the proportion
	 */
	public String getProportion()
	{
		if (proportion == null)
		{
			if ("STACK".equals(layoutCategory))
			{
				proportion = "";
			} else if ("TWO-COLUMN".equals(layoutCategory))
			{
				proportion = "50,50";
			} else if ("THREE-COLUMN".equals(layoutCategory))
			{
				proportion = "33,34,33";
			}
		}
		return proportion;
	}

	/**
	 * ref to setproportion
	 * 
	 * @param proportion the proportion to set
	 */
	public void setProportion(String proportion)
	{
		this.proportion = proportion;
	}

	/**
	 * ref to getLayoutPosition
	 * 
	 * @return the layoutPosition
	 */
	public int getLayoutPosition()
	{
		return layoutPosition;
	}

	/**
	 * ref to SetLayoutPosition
	 * 
	 * @param layoutPosition the layoutPosition to set
	 */
	public void setLayoutPosition(int layoutPosition)
	{
		this.layoutPosition = layoutPosition;
	}

	/**
	 * ref to GetwksId
	 * 
	 * @return the workspaceId
	 */
	public String getWorkspaceId()
	{
		return workspaceId;
	}

	/**
	 * ref to Set WKSID
	 * 
	 * @param workspaceId the workspaceId to set
	 */
	public void setWorkspaceId(String workspaceId)
	{
		this.workspaceId = workspaceId;
	}

	/**
	 * ref to getwidgets
	 * 
	 * @return the widgets
	 */
	public List getWidgets()
	{
		return widgets;
	}

	/**
	 * ref to setwidgets
	 * 
	 * @param widgets the widgets to set
	 */
	public void setWidgets(List widgets)
	{
		this.widgets = widgets;
	}

	/**
	 * ref to getParentLayou
	 * 
	 * @return the parentLayout
	 */
	public String getParentLayout()
	{
		return parentLayout;
	}

	/**
	 * ref to SetParentLayou
	 * 
	 * @param parentLayout the parentLayout to set
	 */
	public void setParentLayout(String parentLayout)
	{
		this.parentLayout = parentLayout;
	}

	private String isParentInd = null;

	/**
	 * ref to ParentId
	 * 
	 * @return the isParentInd
	 */
	public String getIsParentInd()
	{
		return isParentInd;
	}

	/**
	 * ref to ParentId
	 * 
	 * @param isParentInd the isParentInd to set
	 */
	public void setIsParentInd(String isParentInd)
	{
		this.isParentInd = isParentInd;
	}

	/**
	 * ref to getContextAppWidget
	 * 
	 * @return the contextAppWidget
	 */
	public String getContextAppWidget()
	{
		return contextAppWidget;
	}

	/**
	 * to SetContextAppWidget
	 * 
	 * @param contextAppWidget the contextAppWidget to set
	 */
	public void setContextAppWidget(String contextAppWidget)
	{
		this.contextAppWidget = contextAppWidget;
	}

	private String contextAppWidget = null;

	/**
	 * to getChannelId
	 * 
	 * @return the channelId
	 */
	public String getChannelId()
	{
		return channelId;
	}

	/**
	 * to SetChannelId
	 * 
	 * @param channelId the channelId to set
	 */
	public void setChannelId(String channelId)
	{
		this.channelId = channelId;
	}

	/**
	 * to get bundleKey
	 * 
	 * @return the bundleKey
	 */
	public String getBundleKey()
	{
		return bundleKey;
	}

	/**
	 * ref to SetbundleKey
	 * 
	 * @param bundleKey the bundleKey to set
	 */
	public void setBundleKey(String bundleKey)
	{
		this.bundleKey = bundleKey;
	}

	/**
	 * ter to Str to Sb vaues
	 * 
	 * @return
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("LayoutDefinition -> ");
		sb.append("layoutId: ");
		sb.append(layoutId);
		sb.append("; layoutCategory: ");
		sb.append(layoutCategory);
		sb.append("; layoutDisplayName: ");
		sb.append(layoutDisplayName);
		sb.append("; userNumber : ");
		sb.append(userNumber);
		sb.append("; GCIF: ");
		sb.append(GCIF);
		sb.append("; product: ");
		sb.append(product);
		sb.append("; subProduct: ");
		sb.append(subProduct);
		sb.append("; proportion: ");
		sb.append(proportion);
		sb.append("; layoutPosition: ");
		sb.append(layoutPosition);
		sb.append("; workspaceId: ");
		sb.append(workspaceId);
		sb.append("; widgets: ");
		sb.append(widgets);
		return sb.toString();
	}

	/**
	 * It returns the LayoutDefinition details in Map object.
	 * 
	 * @return Map
	 */
	public Map getLayoutDefinitionAsMap()
	{
		Map LayoutDefMap = new HashMap();
		LayoutDefMap.put(ViewDefinitionConstants.PARAM_LAYOUT_ID, layoutId);
		LayoutDefMap.put(ViewDefinitionConstants.PARAM_LAYOUT, layoutCategory);
		LayoutDefMap.put(ViewDefinitionConstants.PARAM_LAYOUT_DISPLAY_NM, layoutDisplayName);
		LayoutDefMap.put("OD_USER_NO", userNumber);
		LayoutDefMap.put("OD_GCIF", GCIF);
		LayoutDefMap.put("OD_PRODUCT", product);
		LayoutDefMap.put("OD_SUB_PRODUCT", subProduct);
		LayoutDefMap.put(ViewDefinitionConstants.PARAM_PROPORTION, proportion);
		LayoutDefMap.put(ViewDefinitionConstants.PARAM_POSITION, layoutPosition);
		LayoutDefMap.put(ViewDefinitionConstants.PARAM_WORKSPACE_ID, workspaceId);
		LayoutDefMap.put(ViewDefinitionConstants.PARAM_BUNDLE_KEY, bundleKey);
		LayoutDefMap.put(ViewDefinitionConstants.PARAM_CONTEXT_APP_WIDGET, contextAppWidget);
		LayoutDefMap.put(ViewDefinitionConstants.PARAM_CHANNEL_ID, channelId);
		LayoutDefMap.put(ViewDefinitionConstants.PARAM_IS_PARENT_IND, isParentInd);
		List widgetList = new ArrayList();
		LayoutWidgetMapping widget = null;
		for (Object object : widgets)
		{
			widget = (LayoutWidgetMapping) object;
			widgetList.add(widget.getLayoutWidgetMappingAsMap());
		}
		LayoutDefMap.put(ViewDefinitionConstants.PARAM_WIDGETS, widgetList);
		return LayoutDefMap;
	}

	/**
	 * It returns the WorkspaceLayout details in Map object.
	 * 
	 * @return Map
	 */
	public Map getWorkspaceLayoutMap()
	{
		Map wlMap = new HashMap();
		wlMap.put(ViewDefinitionConstants.PARAM_LAYOUT_ID, layoutId);
		wlMap.put(ViewDefinitionConstants.PARAM_WORKSPACE_ID, workspaceId);
		wlMap.put(ViewDefinitionConstants.PARAM_POSITION, layoutPosition);
		wlMap.put(ViewDefinitionConstants.PARAM_PARENT_LAYOUT, parentLayout);
		return wlMap;
	}

	private static final long serialVersionUID = 114789869835840255L;
	private String layoutId;
	private String layoutCategory = "STACK";
	private String layoutDisplayName;
	private String userNumber;
	private String GCIF;
	private String product;
	private String subProduct;
	private String proportion;
	private int layoutPosition = 1;
	private String workspaceId;
	private List widgets;// List of WidgetLayoutMapping which are
							// applicable to this Layout

	private String channelId = "A";
	private String bundleKey = "-1";

	private String parentLayout;

}
