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

package com.intellectdesign.canvas.alert.handler;

import java.io.Serializable;

/** 
 * An enumeration class that describes the different severities of the alert message.
 *  
 * @version 1.0
 */
public class Severity implements Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 3635447152733828109L;
	private String sSeverity = null;

	/**
	 * This method sets the value passed as severity 
	 * 
	 * @param sSeverity String value of the Severity name
	 */
	private Severity(String sSeverity)
	{
		this.sSeverity = sSeverity;
	}

	public static final Severity HIGH = new Severity("High");
	public static final Severity MEDIUM = new Severity("Medium");
	public static final Severity LOW = new Severity("Low");

	/**
	 * This method returns the severity object to the corresponding severity value passed as string. 
	 * If there is no match, the method returns null.
	 * 
	 * @param evalValue String value of the severity 
	 * 
	 * @return Severity object of the string passed as parameter
	 */
	public static Severity evaluate(String evalValue)
	{
		Severity retVal = null;
		if ("High".equals(evalValue))
			retVal = Severity.HIGH;
		else if ("Medium".equals(evalValue))
			retVal = Severity.MEDIUM;
		else if ("Low".equals(evalValue))
			retVal = Severity.LOW;

		return retVal;
	}

	/**
	 * This method returns the current string value representation of the current severity 
	 * 	 
	 * @return Severity String value of the current Severity
	 */

	public String toString()
	{
		return sSeverity;
	}
}
