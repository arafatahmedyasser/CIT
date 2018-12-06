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

package com.intellectdesign.canvas.deviceband;

/**
 * This class contains the Device Category
 * 
 * @version 1.0
 */
public enum DeviceCategory
{
	/**
	 * Represents the various desktop / laptop devices
	 */
	DESKTOP_LAPTOP("D", "Desktop"),
	/**
	 * Represents tablets like iPAD, Galaxy Tab
	 */
	TABLET("T", "Tablet"),
	/**
	 * Represents mobile phone / smart phone devices
	 */
	MOBILE("M", "Mobile"),
	/**
	 * Represents the intermediate variants between mobile and tablet
	 */
	PHABLET("P", "Phablet"),
	/**
	 * Default catch all category for all other devices.
	 */
	ALL("A", "All");

	private String code;
	private String description;
	
	/**
	 * The constructor of the Device category
	 * @param categoryCode The code value. This is expected to be a single value code.
	 * @param categoryDesc The description of the category
	 */
	private DeviceCategory(String categoryCode, String categoryDesc)
	{
		code = categoryCode;
		description = categoryDesc;
	}

	/**
	 * Gets the code value of the Device Category
	 * 
	 * @return The Device category code value
	 */
	public String getCode()
	{
		return code;
	}

	/**
	 * Gets the description for the Device Category
	 * 
	 * @return The Device Category Description
	 */
	public String getDescription()
	{
		return description;
	}

	/**
	 * Returns the string representation of the device category
	 * 
	 * @return The string representation of the device category
	 * @see java.lang.Enum#toString()
	 */
	public String toString()
	{
		return code + "-" + description;
	}
}
