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
package com.intellectdesign.canvas.preferences;

import java.io.Serializable;

/**
 * This class is for SystemPreferenceDefinition
 * 
 * @version 1.0
 */
public class SystemPreferenceDefinition implements Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -6139721524363118224L;

	private String attributeType;
	private String attributeDescription;
	private String sourceType;
	private String sourceValue;
	private String visibleInd;

	/**
	 * method that gets Attribute Type
	 * 
	 * @return the attributeType
	 */
	public final String getAttributeType()
	{
		return attributeType;
	}

	/**
	 * method that sets Attribute Type
	 * 
	 * @param attrType the attributeType to set
	 */
	public final void setAttributeType(String attrType)
	{
		this.attributeType = attrType;
	}

	/**
	 * method that gets Attribute Description
	 * 
	 * @return the attributeDescription
	 */
	public final String getAttributeDescription()
	{
		return attributeDescription;
	}

	/**
	 * method that sets AttributeDescription
	 * 
	 * @param attrDesc the attributeDescription to set
	 */
	public final void setAttributeDescription(String attrDesc)
	{
		this.attributeDescription = attrDesc;
	}

	/**
	 * method that gets Source Type
	 * 
	 * @return the sourceType
	 */
	public final String getSourceType()
	{
		return sourceType;
	}

	/**
	 * method that sets Source Type
	 * 
	 * @param srcType the sourceType to set
	 */
	public final void setSourceType(String srcType)
	{
		this.sourceType = srcType;
	}

	/**
	 * method that gets Source Value
	 * 
	 * @return the sourceValue
	 */
	public final String getSourceValue()
	{
		return sourceValue;
	}

	/**
	 * method that sets Source Value
	 * 
	 * @param srcValue the sourceValue to set
	 */
	public final void setSourceValue(String srcValue)
	{
		this.sourceValue = srcValue;
	}

	/**
	 * method that gets VisibleInd
	 * 
	 * @return the visibleInd
	 */
	public final String getVisibleInd()
	{
		return visibleInd;
	}

	/**
	 * method that sets VisibleInd
	 * 
	 * @param vsblInd the visibleInd to set
	 */
	public final void setVisibleInd(String vsblInd)
	{
		this.visibleInd = vsblInd;
	}
}
