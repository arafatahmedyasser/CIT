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

package com.intellectdesign.canvas.audit.handler;

/**
 * This enumeration holds the various modes that needs to be supported by the output mode
 * 
 * @version 1.0
 */
public enum ParseOutputMode
{
	/**
	 * Indicates that only the Old values are to be retrieved
	 */
	OLD_VALUES_ONLY,
	/**
	 * Indicates that only the New values are to be retrieved
	 */
	NEW_VALUES_ONLY,
	/**
	 * Indicates that old and new values are to be retrieved
	 */
	OLD_AND_NEW_VALUES
}
