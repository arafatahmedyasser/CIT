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
package com.intellectdesign.canvas.ehcache.attributeextractor;

import java.util.HashMap;

import net.sf.ehcache.Element;
import net.sf.ehcache.search.attribute.AttributeExtractor;
import net.sf.ehcache.search.attribute.AttributeExtractorException;

/**
 * This Class is for that retrives the data from the element object for ehcache system
 * 
 * @version 1.0
 */
public class CBXEhCacheHashMapAttributeExtractor implements AttributeExtractor
{

	/**
	 * Default serial version UID
	 */
	private static final long serialVersionUID = 2L;

	/**
	 * This method is to say the ehcache system how to retrive the data from the element object
	 * 
	 * @param Element element
	 * @param String attributeName
	 * @return boolean isCacheExists
	 */

	public Object attributeFor(Element element, String attributeName) throws AttributeExtractorException
	{
		return ((HashMap<?, ?>) element.getObjectValue()).get(attributeName);
	}

}
