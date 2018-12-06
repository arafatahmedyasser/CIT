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

/**
 * List of possible values for supporting Negative number formatting
 * 
 * @Version 1.0
 */
public enum NegativeSignFormat
{
	/**
	 * Indicates that negative sign need not be included even if the value is negative
	 */
	NONE,
	/**
	 * Indicates that the negative sign should be prefixed before the number
	 */
	PREFIX,
	/**
	 * Indicates that the negative sign should be suffixed after the number
	 */
	SUFFIX,
	/**
	 * Indicates that the negative number should be wrapped with within '()'
	 */
	WRAP
}
