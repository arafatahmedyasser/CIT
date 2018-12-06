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

package com.intellectdesign.canvas.audit.handler;

/**
 * This class contains the audit field metrics for a field. This is used by the formatter to collate the information
 * related to the audit for a particular field. Once the details are collected, the formatter shares the same to the
 * output format generator for corresponding output generation
 * 
 * @version 1.0
 */
public class AuditFieldMetrics
{
	/**
	 * Default constructur for this class.
	 */
	public AuditFieldMetrics()
	{
		setType("F");
		setModified(false);
	}

	/**
	 * This method is used to get Name
	 * 
	 * @return the name
	 */
	public final String getName()
	{
		return name;
	}

	/**
	 * This method is used to set Name
	 * 
	 * @param name the name to set
	 */
	public final void setName(String name)
	{
		this.name = name;
	}

	/**
	 * @return the modified
	 */
	public final boolean isModified()
	{
		return modified;
	}

	/**
	 * @param modified the modified to set
	 */
	public final void setModified(boolean modified)
	{
		this.modified = modified;
	}

	/**
	 * This method is used to get Type
	 * 
	 * @return the type
	 */
	public final String getType()
	{
		return type;
	}

	/**
	 * his method is used to set Type
	 * 
	 * @param type the type to set
	 */
	public final void setType(String type)
	{
		this.type = type;
	}

	/**
	 * This methodis used to get level
	 * 
	 * @return the level
	 */
	public final int getLevel()
	{
		return level;
	}

	/**
	 * This method is used to set level
	 * 
	 * @param level the level to set
	 */
	public final void setLevel(int level)
	{
		this.level = level;
	}

	/**
	 * This method is used to get OldValue
	 * 
	 * @return the oldValue
	 */
	public final String getOldValue()
	{
		return oldValue;
	}

	/**
	 * This method is used to set OldValue
	 * 
	 * @param oldValue the oldValue to set
	 */
	public final void setOldValue(String oldValue)
	{
		this.oldValue = oldValue;
	}

	/**
	 * This method is used to get NewValue
	 * 
	 * @return the newValue
	 */
	public final String getNewValue()
	{
		return newValue;
	}

	/**
	 * This method is used to set newValue
	 * 
	 * @param newValue the newValue to set
	 */
	public final void setNewValue(String newValue)
	{
		this.newValue = newValue;
	}

	/**
	 * this method is used for string conversion
	 * 
	 * @return String
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		return new StringBuffer("Name=").append(name).append("$Type=").append(type).append("$Level=").append(level)
				.append("$Modified=").append(modified).append("$oldValue=").append(oldValue).append("$newValue=")
				.append(newValue).toString();
	}

	private String name;
	private boolean modified;
	private String type;
	private int level;
	private String oldValue;
	private String newValue;
}
