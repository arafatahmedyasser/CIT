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

package com.intellectdesign.canvas.exportdata;

/**
 * The class provides a simple implementation of IExportDataColumnHeaderValueObject
 * 
 * @version 1.0
 */
public class SimpleExportDataColumnHeaderValueObject implements IExportDataColumnHeaderValueObject
{
	private String sHeaderKey = null;
	private String sHeaderDescription = null;
	private String sHeaderType = null;
	private boolean colWrapStyle = false;
	
	/**
	 * This method returns whether column data wrapping is enabled or not.
	 * 
	 * @return Returns the colWrapStyle
	 */
	public boolean isColumnWrapEnabled()
	{
		return colWrapStyle;
	}
	/**
	 * This method is used to enable column data wrapping.
	 * 
	 * @param colWrapStyle to set.
	 */
	public void setColumnWrapEnabled(boolean wrapStyle)
	{
		colWrapStyle = wrapStyle;
	}
	
	/**
	 * This method is used to set the HeaderDescription
	 * 
	 * @param HeaderDescription to set
	 */
	public void setHeaderDescription(String description)
	{
		sHeaderDescription = description;
	}

	/**
	 * method that gets HeaderDescription
	 * 
	 * @return Returns the HeaderDescription
	 */

	public String getHeaderDescription()
	{
		return sHeaderDescription;
	}

	/**
	 * method that gets HeaderKey
	 * 
	 * @return Returns the HeaderKey
	 */

	public String getHeaderKey()
	{
		return sHeaderKey;
	}

	/**
	 * This method is used to set the HeaderKey
	 * 
	 * @param HeaderKey to set
	 */

	public void setHeaderKey(String headerKey)
	{
		sHeaderKey = headerKey;
	}

	/**
	 * method that gets HeaderType
	 * 
	 * @return Returns the HeaderType
	 */

	public String getHeaderType()
	{
		return sHeaderType;
	}

	/**
	 * This method is used to set the HeaderType
	 * 
	 * @param HeaderType to set
	 */

	public void setHeaderType(String headerType)
	{
		sHeaderType = headerType;
	}

	/**
	 * The parameterized constructor for SimpleExportDataColumnHeaderValueObject
	 * 
	 * @param headerKey
	 * @param headerDescription
	 * @param headerType
	 * 
	 */

	public SimpleExportDataColumnHeaderValueObject(String headerKey, String headerDescription, String headerType)
	{
		sHeaderKey = headerKey;
		sHeaderDescription = headerDescription;
		sHeaderType = headerType;
	}
}
