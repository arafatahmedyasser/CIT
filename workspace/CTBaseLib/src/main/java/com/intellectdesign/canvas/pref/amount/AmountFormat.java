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

package com.intellectdesign.canvas.pref.amount;

import java.io.Serializable;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent;

/**
 * This is a simple value object that contains the definition of Amount Format Configuration.
 * 
 * A format is defined as a combination of the following factors -
 * <ul>
 * <li><b>Id</b> -The format is identified by its ID(mandatory input)</li>
 * <li><b>description</b> - The description for format(mandatory input)</li>
 * <li><b>groupSeparator</b> - The groupSeparator used for Integer value separator.</li>
 * <li><b>decimalSeparator</b> - The decimalSeparator used for decimal value separator.</li>
 * <li><b>groupSize</b> - The Grouping size is the number of digits separator in the integer ending portion of a number</li>
 * <li><b>leadingGroupSize</b> - The LeadingGroupSize size is the number of digits between separators in the integer
 * portion of a number</li>
 * <li><b>negativeSignPosition</b> - This is an optional input .If this is provided from {NONE,PREFIX,SUFFIX,WRAP} list
 * of values otherwise by default Framework assign "PREFIX" value is used to supporting Negative number formatting</li>
 * <li><b>formatter-class</b> - This is an optional input.If this is provided ,the provided formatter class have higher
 * priority than Canvas Framework default formatter class</li>
 * <li><b>client-formatter-class</b> - This is an optional input.If this is provided ,the provided client formatter
 * class have higher priority than Canvas Framework default client formatter class</li>
 * <li><b>canOverride</b> - This is a "true" or "false" flag that indicates whether a definition can be overridden. In
 * case a definition indicates that it cannot be overridden, then any duplicates faced at a later point in time will be
 * ignored with an appropriate warning. If it is set to true, then the order of loading the amount format files into the
 * registry define the exact version of the AmountFormat that will be used by the framework.Defualt value is "false".</li>
 * <li><b>isEnabled</b> - This is a "true" or "false" flag that indicates whether a format can be display or not in
 * Application, Defualt value is "true" .</li>
 * </ul>
 * 
 * A typical AmountFormat configuration XML structure is provided below -
 * 
 * <pre>
 * {@code
 * <?xml version="1.0" ?>
 * 	<canvas-formats type="amount">
 * 		<format Id="USA" description="US Currency Format"
 * 	groupSeparator="," decimalSeparator="." groupSize="3" negativeSignPosition="PREFIX"
 *      leadingGroupSize="3" formatter-class="com.intellectdesign.canvas.pref.amount.CanvasAmountFormatter"
 * 	client-formatter-class="canvas.preferences.formatSupport.amountFormatter"
 * 	canOverride="true" isEnabled = "true"/>
 * 	</canvas-formats>
 * }
 * </pre>
 * 
 * @version 1.0
 */
public class AmountFormat implements Serializable, ICanvasRegistryContent
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 1L;
	private String amountId;
	private String description;
	private char groupSeparator;
	private char decimalSeparator;
	private int groupSize;
	private int leadingGroupSize;
	private String formatterClass;
	private String clientFormatterClass;
	private boolean overridable;
	private NegativeSignFormat negativeFormat;
	private boolean enabled;

	/**
	 * ref to Constructor
	 */
	public AmountFormat()
	{

	}

	/**
	 * this method refer to AmountFormat constructor
	 * 
	 * @param builder
	 */

	protected AmountFormat(AmountFormatBuilder builder)
	{
		this.amountId = builder.getAmountId();
		this.description = builder.getDescription();
		this.groupSeparator = builder.getGroupSeparator();
		this.decimalSeparator = builder.getDecimalSeparator();
		this.groupSize = builder.getGroupSize();
		this.leadingGroupSize = builder.getLeadingGroupSize();
		this.formatterClass = builder.getFormatterClass();
		this.clientFormatterClass = builder.getClientFormatterClass();
		this.overridable = builder.isOverridable();
		this.enabled = builder.isEnabled();
		this.negativeFormat = builder.getNegativeSignFormat();
	}

	/**
	 * method refer to AmountId
	 * 
	 * @return the amountId
	 */
	public String getAmountId()
	{
		return amountId;
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
	 * method refer to GroupSeparator
	 * 
	 * @return the groupSeparator
	 */
	public char getGroupSeparator()
	{
		return groupSeparator;
	}

	/**
	 * method refer to DecimalSeparator
	 * 
	 * @return the decimalSeparator
	 */
	public char getDecimalSeparator()
	{
		return decimalSeparator;
	}

	/**
	 * method refer to GroupSize
	 * 
	 * @return the groupSize
	 */
	public int getGroupSize()
	{
		return groupSize;
	}

	/**
	 * method refer to LeadingGroupSize
	 * 
	 * @return the leadingGroupSize
	 */
	public int getLeadingGroupSize()
	{
		return leadingGroupSize;
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
	 * method refer to CleintFormatterClass
	 * 
	 * @return the clientFormatterClass
	 */
	public String getClientFormatterClass()
	{
		return clientFormatterClass;
	}

	/**
	 * method to refer NegativeSingFormat
	 * 
	 * @return the negativeFormat
	 */
	public NegativeSignFormat getNegativeSignFormat()
	{
		return negativeFormat;
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
	 * @see com..canvas.spec.registry.ICanvasRegistryContent#isOverrideAllowed()
	 * 
	 * @return Flag indicating whether the AmountFormat Object definition can be overridden
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
		if (compareObj instanceof AmountFormat)
		{
			AmountFormat compareVal = (AmountFormat) compareObj;
			if (amountId.equalsIgnoreCase(compareVal.amountId))
				returnVal = 0;
		}
		return returnVal;
	}

	/***
	 * Method too build the AmountFormat
	 * 
	 * @Version 1.0
	 */
	public static class AmountFormatBuilder
	{
		private String amountId;
		private String description;
		private char groupSeparator;
		private char decimalSeparator;
		private int groupSize;
		private int leadingGroupSize;
		private String formatterClass;
		private String clientFormatterClass;
		private boolean overridable;
		private NegativeSignFormat negativeFormat;
		private boolean enabled;

		/**
		 * this method refer to SetAmountId
		 * 
		 * @param amountId the amountId to set
		 */
		public AmountFormatBuilder setAmountId(String amountId)
		{
			this.amountId = amountId;
			return this;
		}

		/**
		 * this method refer AmountId
		 * 
		 * @return the amountId
		 */
		public String getAmountId()
		{
			return amountId;
		}

		/**
		 * this method refer to SetDescription
		 * 
		 * @param description the description to set
		 */
		public AmountFormatBuilder setDescription(String description)
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
		 * this method refer to SetGroupSeparator
		 * 
		 * @param groupSeparator the groupSeparator to set
		 */
		public AmountFormatBuilder setGroupSeparator(char groupSeparator)
		{
			this.groupSeparator = groupSeparator;
			return this;
		}

		/**
		 * this method refer to GetGroupSeparator
		 * 
		 * @return the groupSeparator
		 */
		public char getGroupSeparator()
		{
			return groupSeparator;
		}

		/**
		 * this method refer to SetDecimalSeparator
		 * 
		 * @param decimalSeparator the decimalSeparator to set
		 */
		public AmountFormatBuilder setDecimalSeparator(char decimalSeparator)
		{
			this.decimalSeparator = decimalSeparator;
			return this;
		}

		/**
		 * this method refer to GetDecimalSeparator
		 * 
		 * @return the decimalSeparator
		 */
		public char getDecimalSeparator()
		{
			return decimalSeparator;
		}

		/**
		 * this method refer to SetGroupSize
		 * 
		 * @param groupSize the groupSize to set
		 */
		public AmountFormatBuilder setGroupSize(int groupSize)
		{
			this.groupSize = groupSize;
			return this;
		}

		/**
		 * this method refer to GetGroupSize
		 * 
		 * @return the groupSize
		 */
		public int getGroupSize()
		{
			return groupSize;
		}

		/**
		 * this method refer to SetLeadingGroupSize
		 * 
		 * @param leadingGroupSize the leadingGroupSize to set
		 */
		public AmountFormatBuilder setLeadingGroupSize(int leadingGroupSize)
		{
			this.leadingGroupSize = leadingGroupSize;
			return this;
		}

		/**
		 * this method refer to GetLeadingGroupSize
		 * 
		 * @return the leadingGroupSize
		 */
		public int getLeadingGroupSize()
		{
			return leadingGroupSize;
		}

		/**
		 * this method refer to SetFormatterClass
		 * 
		 * @param formatterClass the formatterClass to set
		 */
		public AmountFormatBuilder setFormatterClass(String formatterClass)
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
		 * this method refer to SetClientFormatterClass
		 * 
		 * @param clientFormatterClass the clientFormatterClass to set
		 */
		public AmountFormatBuilder setClientFormatterClass(String clientFormatterClass)
		{
			this.clientFormatterClass = clientFormatterClass;
			return this;
		}

		/**
		 * this method refer to GetClientFormatterClass
		 * 
		 * @return the clientFormatterClass
		 */
		public String getClientFormatterClass()
		{
			return clientFormatterClass;
		}

		/**
		 * this method refer to GetNegativeSignFormat
		 * 
		 * @return the negativeFormat
		 */
		public NegativeSignFormat getNegativeSignFormat()
		{

			return negativeFormat;
		}

		/**
		 * this method refer to SetNegativeSignFormat
		 * 
		 * @param negativeSignPosition the negativeSignPosition to set
		 */
		public AmountFormatBuilder setNegativeSignFormat(NegativeSignFormat negativeSignPosition)
		{
			this.negativeFormat = negativeSignPosition;
			return this;
		}

		/**
		 * this method ref to SetOverridable
		 * 
		 * @param overridable the overridable to set
		 */
		public AmountFormatBuilder setOverridable(boolean overridable)
		{
			this.overridable = overridable;
			return this;
		}

		/**
		 * this method ref to Overridable
		 * 
		 * @return Flag indicating whether the Object definition can be overridden
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
		public AmountFormatBuilder setEnabled(boolean enabled)
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
		 * Builds the AmountFormat based on the inputs and then returns the same
		 * 
		 * @return The constructed AmountFormat
		 * @exception BaseException Thrown if any mandatory information is missing for the AmountFormat
		 */
		public AmountFormat build() throws BaseException
		{
			return new AmountFormat(this);
		}

	}

}
