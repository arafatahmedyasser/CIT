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

package com.intellectdesign.canvas.reports;

/**
 * Contains label, value details of each element
 * 
 * @version 1.0
 */
public class DetailElement
{
	private String label = null;
	private String value = null;

	/**
	 * DetailElement constructor with params
	 * 
	 * @param label
	 * @param value
	 */
	public DetailElement(String label, String value)
	{
		this.label = label;
		this.value = value;
	}

	/**
	 * method that gets Label
	 * 
	 * @return Returns the Label
	 */

	public String getLabel()
	{
		return label;
	}

	/**
	 * method that gets Value
	 * 
	 * @return Returns the Value
	 */

	public String getValue()
	{
		return value;
	}

	/**
	 * String Representation of label and value
	 * 
	 * @return String
	 */

	public String toString()
	{
		return label + "=" + value;
	}

}