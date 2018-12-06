/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.formdefinition;

import java.util.List;

import com.intellectdesign.canvas.common.IBaseDefinition;

/**
 * This is a base class for form definition. This class provides implementation 
 * for ibase definition.
 * 
 * @version 1.0
 */
public abstract class BaseFormDefinition implements IBaseDefinition
{

	/**
	 * Serial version UID
	 */
	private static final long serialVersionUID = -2256236953410887623L;

	/**
	 * This property holds the unique ID of the component/ form is given in the DB configuration.
	 */
	protected String itemId;
	/**
	 * Boolean flag to confirm in case the meta data for this component/ form is already initialized. So that in case
	 * the same component is mentioned twice in the DB, the meta data aggregator layer will not make seperate DB request
	 * for the same.
	 */
	protected boolean initialized;
	
	private String itemType;	
	
	/**
	 * This method returns the copy of the current Form definition object.
	 *  
	 * @see java.lang.Object#clone()
	 * @return cloneable object
	 * @throws CloneNotSupportedException
	 */
	@Override
	protected Object clone() throws CloneNotSupportedException
	{
		return super.clone();
	}

	/**
	 * This method converts current Form Definition object to the JSONString format.
	 * 
	 * @see com.intellectdesign.canvas.exceptions.audit.IBaseDefinition#toJSONString()
	 * @return toJSONString - JSONString representation of the configuration with child forms 
	 */
	public String toJSONString()
	{
		return toJSONString(true);
	}

	/**
	 * This is an abstract method with additional parameter that decides 
	 * whether to include children items as part of the JSON representaion or not.
	 * This method is mostly useful in case of generating the Sub Form's JSON representaion 
	 * where the the JSON should be generated only for the FORM not for its children.
	 * 
	 * @param includeChildren - boolean value to inlcude or not to include children 
	 * @return toJSONstring - JSONString representation of the object with or without child forms based on the parameter.
	 */
	public abstract String toJSONString(boolean includeChildren);

	/**
	 * This is an abstract method that should be used for managing children components of the Object.
	 * 
	 * @param baseObjDef - Base Form or Form Item object
	 */
	public abstract void addChild(BaseFormDefinition baseObjDef);

	/**
	 * This method is intended to add Sub Form ids to the Form Definition Object.
	 * 
	 * @param baseObjDef - FormDefinition object to which to add the child form
	 */
	public abstract void addForm(String formid);

	/**
	 * This method is expected to return all the immediate children of the Object.
	 * 
	 * @return childrenList - List object that contains the children elements
	 */
	public abstract List getChildren();

	/**
	 * This method returns flag that indicates whether the FormDefinition object is initialized or not
	 * 
	 * @return initialized
	 */
	public boolean isInitialized()
	{
		return initialized;
	}

	/**
	 * This method sets the FormDefinition object initialization 
	 * 
	 * @param initialized
	 */
	public void setInitialized(boolean initialized)
	{
		this.initialized = initialized;
	}

	/**
	 * This method returns the itemId in the FormDefinition object
	 * 
	 * @return itemId - String value of the Form Item Id
	 */
	public String getItemId()
	{
		return itemId;
	}

	/**
	 * This method sets the itemId
	 * 
	 * @param itemId - String value of the Form item Id 
	 */
	public void setItemId(String itemId)
	{
		this.itemId = itemId;
	}
	

	/**
	 * This method provides the string value of the Item Type
	 * 
	 * @return itemType - String value of the Item Type
	 */
	public String getItemType()
	{
		return itemType;
	}

	/**
	 * This method sets the Item Type
	 * 
	 * @param itemType - String value of the Item Type 
	 */
	public void setItemType(String itemType)
	{
		this.itemType = itemType;
	}


}
