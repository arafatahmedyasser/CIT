/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.pref.date;

import java.io.Serializable;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent;

/**
 * This is a simple value object that contains the definition of Date Format Configuration.
 * 
 * 
 * A format is defined as a combination of the following factors -
 * <ul>
 * <li><b>Id</b> -The format is identified by its ID(mandatory input)</li>
 * <li><b>description</b> - The description for format(mandatory input)</li>
 * *
 * <li><b>javaDateFormat</b> -The Dateformat for SimpleDateFormat java class,By default value is "dd/MM/yyyy</li>
 * <li><b>formatter-class</b> - This is an optional input.If this is provided ,the provided formatter class have higher
 * priority than Canvas Framework default formatter class</li>
 * <li><b>canOverride</b> - This is a "true" or "false" flag that indicates whether a definition can be overridden. In
 * case a definition indicates that it cannot be overridden, then any duplicates faced at a later point in time will be
 * ignored with an appropriate warning. If it is set to true, then the order of loading the dateformat Configuration
 * files into the registry define the exact version of the map that will be used by the framework,defualt value is
 * "false"</li>
 * <li><b>isEnabled</b> - This is a "true" or "false" flag that indicates whether a format can be display or not in
 * Application, default value is "true".</li>
 * </ul>
 * 
 * A typical DateFormat configuration XML structure is provided below -
 * 
 * <pre>
 * {@code
 * <?xml version="1.0" ?>
 * 	<canvas-formats type="date">
 * 	<format Id="dd/MM/yyyy" description="dd/MM/yyyy" javaDateFormat = "dd/MM/yyyy" 
 * 		formatter-class="com.intellectdesign.canvas.pref.date.IDateFormatter"
 * 		canOverride="true"  isEnabled = "true"/>
 * </canvas-formats>
 * }
 * </pre>
 * 
 * @version 1.0
 */
public class DateFormatConfig implements Serializable, ICanvasRegistryContent
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 1L;
	private String dateId;
	private String description;
	private String javaDateFormat;
	private String formatterClass;
	private boolean overridable;
	private boolean enabled;

	/**
	 * ref to Constructor
	 */
	public DateFormatConfig()
	{

	}

	/**
	 * this method refer to DateFormat constructor
	 * 
	 * @param builder
	 */

	protected DateFormatConfig(DateFormatBuilder builder)
	{
		this.dateId = builder.getDateId();
		this.description = builder.getDescription();
		this.javaDateFormat = builder.getJavaDateFormat();
		this.formatterClass = builder.getFormatterClass();
		this.overridable = builder.isOverridable();
		this.enabled = builder.isEnabled();
	}

	/**
	 * method refer to DateId
	 * 
	 * @return the DateId
	 */
	public String getDateId()
	{
		return dateId;
	}

	/**
	 * method refer to Description
	 * 
	 * @return the description
	 */
	public String getDescription()
	{
		return description;
	}

	/**
	 * method refer to javaDateFormat
	 * 
	 * @return the javaDateFormat
	 */
	public String getJavaDateFormat()
	{
		return javaDateFormat;
	}

	/**
	 * method refer to FormatterClass
	 * 
	 * @return the formatterClass
	 */
	public String getFormatterClass()
	{
		return formatterClass;
	}

	/**
	 * method refer to isOverridable
	 * 
	 * @return the overridable
	 */
	public boolean isOverridable()
	{
		return overridable;
	}

	/**
	 * method refer to isEnabled
	 * 
	 * @return the enabled
	 */
	public boolean isEnabled()
	{
		return enabled;
	}

	/**
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent#isOverrideAllowed()
	 * 
	 * @return Flag indicating whether the Map definition can be overridden
	 * 
	 */
	@Override
	public boolean isOverrideAllowed()
	{
		return isOverridable();
	}

	/**
	 * This is an implementatiion of the Comparable interface as required by the ICanvasRegistryContent
	 * 
	 * @param compareObj The object to be compared
	 * @return 0 if the object is same as current object. -1 otherwise
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 */
	@Override
	public int compareTo(Object compareObj)
	{
		int returnVal = -1;
		if (compareObj instanceof DateFormatConfig)
		{
			DateFormatConfig compareVal = (DateFormatConfig) compareObj;
			if (dateId.equalsIgnoreCase(compareVal.dateId))
				returnVal = 0;
		}
		return returnVal;
	}

	/***
	 * Method too build the DateFormats Map
	 * 
	 * @Version 1.0
	 */
	public static class DateFormatBuilder
	{
		private String DateId;
		private String description;
		private String javaDateFormat;
		private String formatterClass;
		private boolean overridable;
		private boolean enabled;

		/**
		 * this method refer to SetDateId
		 * 
		 * @param DateId the DateId to set
		 */
		public DateFormatBuilder setDateId(String DateId)
		{
			this.DateId = DateId;
			return this;
		}

		/**
		 * this method refer DateId
		 * 
		 * @return the DateId
		 */
		public String getDateId()
		{
			return DateId;
		}

		/**
		 * this method refer to SetDescription
		 * 
		 * @param description the description to set
		 */
		public DateFormatBuilder setDescription(String description)
		{
			this.description = description;
			return this;
		}

		/**
		 * this method refer to getDescription
		 * 
		 * @return the description
		 */
		public String getDescription()
		{
			return description;
		}

		/**
		 * this method refer to setJavaDateFormat
		 * 
		 * @param javaDateFormat the javaDateFormat to set
		 */
		public DateFormatBuilder setJavaDateFormat(String javaDateFormat)
		{
			this.javaDateFormat = javaDateFormat;
			return this;
		}

		/**
		 * this method refer to getjavaDateFormat
		 * 
		 * @return the javaDateFormat
		 */
		public String getJavaDateFormat()
		{
			return javaDateFormat;
		}

		/**
		 * this method refer to SetFormatterClass
		 * 
		 * @param formatterClass the formatterClass to set
		 */
		public DateFormatBuilder setFormatterClass(String formatterClass)
		{
			this.formatterClass = formatterClass;
			return this;
		}

		/**
		 * this method refer to GetFormatterClass
		 * 
		 * @return the formatterClass
		 */
		public String getFormatterClass()
		{
			return formatterClass;
		}

		/**
		 * this method ref to SetOverridable
		 * 
		 * @param overridable the overridable to set
		 */
		public DateFormatBuilder setOverridable(boolean overridable)
		{
			this.overridable = overridable;
			return this;
		}

		/**
		 * this method ref to Overridable
		 * 
		 * @return Flag indicating whether the Map definition can be overridden
		 */
		protected boolean isOverridable()
		{
			return overridable;
		}

		/**
		 * this method ref to SetEnabled
		 * 
		 * @param enabled the enabled to set
		 */
		public DateFormatBuilder setEnabled(boolean enabled)
		{
			this.enabled = enabled;
			return this;
		}

		/**
		 * this method ref to enabled
		 * 
		 * @return Flag indicating whether the format can be enabled
		 */
		protected boolean isEnabled()
		{
			return enabled;
		}

		/**
		 * Builds the DateFormat based on the inputs and then returns the same
		 * 
		 * @return The constructed DateFormat
		 * @exception BaseException Thrown if any mandatory information is missing for the DateFormat
		 */
		public DateFormatConfig build() throws BaseException
		{
			return new DateFormatConfig(this);
		}

	}
}
