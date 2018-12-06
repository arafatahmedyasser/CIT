/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 **/
package com.intellectdesign.canvas.validator;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.intellectdesign.canvas.logger.Logger;
/**
 * This class is used to store all fields validation rules of sub tag of <collection>
 * 
 * @version 1.0
 */
public class CollectionElementsValue implements Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -6868134131815843679L;

	/**
	 * Default constructor create arraylist of size 5
	 */
	public CollectionElementsValue()
	{
		elementValueList = new ArrayList(5);
	}

	/**
	 * To get the CollectionName
	 * 
	 * @return collectionName value
	 */
	public String getCollectionName()
	{
		return collectionName;
	}

	/**
	 * This method used to set CollectionName
	 * 
	 * @param String collectionName
	 */
	public void setCollectionName(String collectionName)
	{
		this.collectionName = collectionName;
		logger.ctdebug("CTVAL00013", this.collectionName);
	}

	/**
	 * To get the ElementValueList
	 * 
	 * @return elementValueList - Returns list of ElementValue objects, each element value has its validation rules
	 */
	public List getElementValueList()
	{
		return elementValueList;
	}

	/**
	 * Addes ElementValue objects to List
	 * 
	 * @param ElementValue - an instance of ElementValue
	 */
	public void addElementValueList(ElementValue elemval)
	{
		elementValueList.add(elemval);
		logger.ctdebug("CTVAL00014", elementValueList.size());
	}

	/**
	 * To check whether Mandatory or not
	 * 
	 * @return String - Collection is mandatory or not
	 */
	public boolean isMandatory()
	{
		return mandatory;
	}

	/**
	 * Sets mandatory value
	 * 
	 * @param boolean - mandatory
	 */
	public void setMandatory(boolean mandatory)
	{
		this.mandatory = mandatory;
	}

	private String collectionName = null;// to hold collection tag name
	private List elementValueList = null; // to hold list if element value object
	private boolean mandatory = false;
	private static Logger logger = Logger.getLogger(CollectionElementsValue.class);
}
