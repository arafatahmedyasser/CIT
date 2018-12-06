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

package com.intellectdesign.canvas.entitlement;

import java.io.Serializable;

/**
 * A value object representing criteria values
 * 
 * @version 1.0
 */
public class CriteriaValue implements Serializable
{

	private static final long serialVersionUID = 1L;
	private String criteriaValue = null;

	/**
	 * An empty constructor must be provided if there is a overloaded constructor in the bean class
	 */

	public CriteriaValue()
	{
	}

	/**
	 * Parametrized constructor for assigning the value of criteriaValue
	 * 
	 * @param criteriaValue
	 */
	public CriteriaValue(String criteriaValue)
	{
		this.criteriaValue = criteriaValue;
	}

	/**
	 * Method to get Criteria value
	 * 
	 * @return the criteriaValue
	 */
	public String getCriteriaValue()
	{
		return criteriaValue;
	}

	/**
	 * Method to set criteria value
	 * 
	 * @param criteriaValue the criteriaValue to set
	 */
	public void setCriteriaValue(String criteriaValue)
	{
		this.criteriaValue = criteriaValue;
	}

}
