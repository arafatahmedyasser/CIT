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
package com.intellectdesign.canvas.attribute;

import java.util.HashMap;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * The Base interface provides the option for getting the master attributes for preferences like RateCard, Ratecard
 * Currency, etc.
 * 
 *  @version 1.0
 */
public interface IMasterAttribute
{
	/**
	 * This method is called to get the list of all attribute data for a particular criteria
	 * 
	 * @return HashMap containing the data
	 * @throws BaseException Thrown if any exception occurs while fetching data
	 */
	HashMap getMasterAttributes() throws BaseException;

	/**
	 * This method is called to get the list of all attribute data for a particular criteria. This variant is to be used
	 * if the preference data to be loaded is dependent on the logged in user
	 * 
	 * @param userNo The user Number
	 * @param gcif The GCIF of the user.
	 * @return HashMap containing the data
	 * @throws BaseException Thrown if any exception occurs while fetching data
	 */
	HashMap getMasterAttributes(String userNo, String gcif) throws BaseException;
}
