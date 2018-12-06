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
import java.util.List;

/**
 * This class is for vdf reply object implements serializable inteface
 * 
 * @version 1.0
 */
public class VDFReplyObject implements Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 6669236037060048473L;

	/**
	 * to ref the ViewDefinition data
	 * 
	 * @return
	 */
	public ViewDefinition getViewMetaData()
	{
		return viewMetaData;
	}

	/**
	 * to ref SetViewMetaData
	 * 
	 * @param viewMetaData
	 */
	public void setViewMetaData(ViewDefinition viewMetaData)
	{
		this.viewMetaData = viewMetaData;
	}

	/**
	 * this is ref to ListViewData
	 * 
	 * @return
	 */
	public List getViewData()
	{
		return viewData;
	}

	/**
	 * this is ref to ViewData
	 * 
	 * @param viewData
	 */
	public void setViewData(List viewData)
	{
		this.viewData = viewData;
	}

	/**
	 * this is ref getAddtionaldata
	 * 
	 * @return the additionalData
	 */
	public HashMap getAdditionalData()
	{
		return additionalData;
	}

	/**
	 * this is refto AdditionalData
	 * 
	 * @param additionalData the additionalData to set
	 */
	public void setAdditionalData(HashMap additionalData)
	{
		this.additionalData = additionalData;
	}

	/**
	 * this is ref to Str to viewdata values
	 * 
	 * @return
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		return new StringBuffer("View Meta Data : ").append(viewMetaData).append(", View Data : ").append(viewData)
				.append(", Additional Data : ").append(additionalData).toString();
	}

	private ViewDefinition viewMetaData = null;
	private HashMap additionalData = null;
	private List viewData = null;
}
