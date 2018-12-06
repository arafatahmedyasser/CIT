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
 * This class is for layout widget mapping implements serializable and cloneable interfaces
 * 
 * @version 1.0
 */
public class LayoutWidgetMapping implements Serializable, Cloneable
{
	/**
	 * Internal constant for serialization purposes
	 */
	/**
	 * ref to GEt Widget
	 * 
	 * @return the widgetId
	 */
	public String getWidgetId()
	{
		return widgetId;
	}

	/**
	 * ref to Set Widget
	 * 
	 * @param widgetId the widgetId to set
	 */
	public void setWidgetId(String widgetId)
	{
		this.widgetId = widgetId;
	}

	/**
	 * ref to Get LayId
	 * 
	 * @return the layoutId
	 */
	public String getLayoutId()
	{
		return layoutId;
	}

	/**
	 * ref to set LayputId
	 * 
	 * @param layoutId the layoutId to set
	 */
	public void setLayoutId(String layoutId)
	{
		this.layoutId = layoutId;
	}

	/**
	 * ref to getLayoutWidgetPosition
	 * 
	 * @return the layoutWidgetPosition
	 */
	public int getLayoutWidgetPosition()
	{
		return layoutWidgetPosition;
	}

	/**
	 * ref to SetLayoutWidgetPosition
	 * 
	 * @param layoutWidgetPosition the layoutWidgetPosition to set
	 */
	public void setLayoutWidgetPosition(int layoutWidgetPosition)
	{
		this.layoutWidgetPosition = layoutWidgetPosition;
	}

	/**
	 * ref to get Block Postion
	 * 
	 * @return the blockPosition
	 */
	public String getBlockPosition()
	{
		return blockPosition;
	}

	/**
	 * ref to SetblockPosition
	 * 
	 * @param blockPosition the blockPosition to set
	 */
	public void setBlockPosition(String blockPosition)
	{
		this.blockPosition = blockPosition;
	}

	/**
	 * ref to get ClosedInd
	 * 
	 * @return the closedInd
	 */
	public String getClosedInd()
	{
		return closedInd;
	}

	/**
	 * ref to SetClosedInd
	 * 
	 * @param closedInd the closedInd to set
	 */
	public void setClosedInd(String closedInd)
	{
		this.closedInd = closedInd;
	}

	/**
	 * ref to defaultWidgetInd
	 * 
	 * @return the parentLayout
	 */
	public String getDefaultWidgetInd()
	{
		return defaultWidgetInd;
	}

	/**
	 * ref to SetdefaultWidgetInd
	 * 
	 * @param parentLayout the parentLayout to set
	 */
	public void setDefaultWidgetInd(String defaultWidgetInd)
	{
		this.defaultWidgetInd = defaultWidgetInd;
	}

	/**
	 * Ref to SB to Str values
	 * 
	 * @return sb
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("WidgetLayoutMapping -> ");
		sb.append("widgetId: ");
		sb.append(widgetId);
		sb.append("; layoutId: ");
		sb.append(layoutId);
		sb.append("; layoutWidgetPosition: ");
		sb.append(layoutWidgetPosition);
		sb.append("; blockPosition : ");
		sb.append(blockPosition);
		sb.append("; closedInd: ");
		sb.append(closedInd);
		return sb.toString();
	}

	/**
	 * It returns the LayoutWidgetMapping details in Map object.
	 * 
	 * @return Map
	 */
	public Map getLayoutWidgetMappingAsMap()
	{
		Map lwmMap = new HashMap();
		lwmMap.put(ViewDefinitionConstants.PARAM_WIDGET_ID, widgetId);
		lwmMap.put(ViewDefinitionConstants.PARAM_LAYOUT_ID, layoutId);
		lwmMap.put(ViewDefinitionConstants.PARAM_POSITION, layoutWidgetPosition);
		lwmMap.put(ViewDefinitionConstants.PARAM_BLOCK_POSITION, blockPosition);
		lwmMap.put(ViewDefinitionConstants.PARAM_CLOSED_IND, closedInd);
		lwmMap.put(ViewDefinitionConstants.PARAM_DEFAULT_WIDGET_IND, defaultWidgetInd);// CT_DESIGN_CANVAS
		return lwmMap;
	}

	private static final long serialVersionUID = 1760177416517274061L;
	private String widgetId = null;
	private String layoutId = null;
	private int layoutWidgetPosition = 1;
	private String blockPosition = null;
	private String closedInd = null;

	private String defaultWidgetInd = null;

}
