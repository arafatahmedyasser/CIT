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

package com.intellectdesign.canvas.utils.currency;

import java.util.HashMap;
import java.util.List;

/**
 * This interface should be implemented to provide the list of currencies with its decimal places to the Canvas
 * platform. Based on the details provided, the canvas platform will handle all currency based decimal evaluation within
 * the system
 * 
 * @version 1.0
 */
public interface ICurrencyDataProvider
{
	/**
	 * This method should return the list of Currencies with its supported number of decimal places. In case a currency
	 * does not support decimal places, then the value expected is 0. Since this is a global listing, if any currency is
	 * missing in this list, then the default number of decimal places for that currency will be considered as 2. The
	 * currency code to be used is the 3 character ISO currency code (like USD, EUR, JPY, etc).
	 * 
	 * @return HashMap The map of ISO currency codes to its corresponding decimal precision support needed
	 */
	List<HashMap<String, String>> getCurrencyBasedDecimalData();
}
